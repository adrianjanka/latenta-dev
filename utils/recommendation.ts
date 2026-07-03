import type { QuestionnaireAnswers } from '~/data/questionnaire'
import { answersToTagSlugs, preferredIsoRange } from '~/data/questionnaire'
import type { Filmstock } from '~/types/filmstock'

export interface FilmRecommendation {
  filmstock: Filmstock
  score: number
  reasons: string[]
}

const MOOD_LABELS: Record<string, string> = {
  warm: 'warme, natürliche Farben',
  lebhaft: 'lebendige Farben',
  nostalgisch: 'gedämpfte, nostalgische Stimmung',
  klassisch: 'klassischen Look',
  menschen: 'Porträts und Menschen',
  portraet: 'Porträts',
  landschaft: 'Landschaften',
  strasse: 'Strassenfotografie',
  alltag: 'Alltagsmomente',
  draussen: 'Aufnahmen draussen',
  drinnen: 'Aufnahmen drinnen',
  hell: 'helles Licht',
  bewoelkt: 'bewölktes Licht',
  wenig_licht: 'wenig Licht',
  nacht: 'Aufnahmen bei wenig Licht',
  kontrastreich: 'kontrastreichen Aufnahmen',
  dokumentarisch: 'dokumentarischen Bildern',
  vintage: 'vintage Ästhetik',
  feinkoernig: 'feinem Korn',
  koernig: 'sichtbarem Korn',
}

function getFilmTagSlugs(film: Filmstock): string[] {
  if (!film.stimmungs_tags) return []
  return film.stimmungs_tags.map((tag) => {
    if (typeof tag === 'string') return tag
    return tag.slug
  })
}

function isoFitScore(iso: number, light: QuestionnaireAnswers['light']): number {
  const { min, max } = preferredIsoRange(light)
  if (iso >= min && iso <= max) return 3
  if (iso >= min * 0.5 && iso <= max * 2) return 1
  return 0
}

function buildReasons(matchedSlugs: string[], iso: number, light: QuestionnaireAnswers['light']): string[] {
  const reasons: string[] = []

  for (const slug of matchedSlugs.slice(0, 3)) {
    const label = MOOD_LABELS[slug]
    if (label) reasons.push(`Passt zu ${label}`)
  }

  const { min, max } = preferredIsoRange(light)
  if (iso >= min && iso <= max) {
    reasons.push(`ISO ${iso} eignet sich gut für dein Licht`)
  }
  else if (iso >= 400 && light === 'wenig_licht') {
    reasons.push(`ISO ${iso} hilft bei wenig Licht`)
  }

  return reasons.slice(0, 3)
}

export function recommendFilms(
  filmstocks: Filmstock[],
  answers: QuestionnaireAnswers,
  limit = 3,
): FilmRecommendation[] {
  const desiredTags = answersToTagSlugs(answers)

  const candidates = filmstocks.filter((film) => {
    if (film.status !== 'published') return false
    if (!film.format.includes(answers.format)) return false
    if (answers.typ !== 'unsure' && film.typ !== answers.typ) return false
    return true
  })

  const scored = candidates.map((film) => {
    const filmTags = getFilmTagSlugs(film)
    const matchedSlugs = desiredTags.filter(tag => filmTags.includes(tag))

    let score = 0
    score += matchedSlugs.length * 2

    const moodSlugs = desiredTags.filter(t =>
      ['warm', 'lebhaft', 'nostalgisch', 'klassisch', 'gedaempft', 'saettigend', 'kontrastreich', 'vintage', 'dokumentarisch'].includes(t),
    )
    score += moodSlugs.filter(t => filmTags.includes(t)).length * 2

    score += isoFitScore(film.iso, answers.light)

    const reasons = buildReasons(matchedSlugs, film.iso, answers.light)
    if (reasons.length === 0) {
      reasons.push(`Vielseitiger ${film.typ === 'farbe' ? 'Farb' : 'Schwarzweiss'}-Film für Einsteiger`)
    }

    return { filmstock: film, score, reasons }
  })

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}
