import tagDefinitions from '../../data/stimmungs-tags.json'
import type { FilmstockInput, Koernung, Kontrast, Belichtungstoleranz } from '../../types/filmstock'

const VALID_SLUGS = new Set(tagDefinitions.map(t => t.slug))

export interface AiEnrichmentResult {
  beschreibung: string
  beschreibung_en: string
  koernung: Koernung
  kontrast: Kontrast
  belichtungstoleranz: Belichtungstoleranz
  farbcharakter: string
  stimmungs_tags: string[]
}

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6'

export function sanitizeTags(tags: string[], koernung: Koernung, iso: number): string[] {
  const set = new Set(tags.filter(s => VALID_SLUGS.has(s)))

  // Widersprüche auflösen
  if (set.has('feinkoernig') && set.has('koernig')) {
    if (koernung === 'fein') set.delete('koernig')
    else if (koernung === 'grob') set.delete('feinkoernig')
    else set.delete('koernig')
  }

  // ISO-basierte Licht-Tags korrigieren
  if (iso < 400) {
    set.delete('wenig_licht')
    set.delete('nacht')
  }
  if (iso >= 800) set.add('wenig_licht')

  // Max. ein Korn-Tag
  const kornTags = ['feinkoernig', 'koernig'].filter(t => set.has(t))
  if (kornTags.length > 1) {
    if (koernung === 'fein') set.delete('koernig')
    else set.delete('feinkoernig')
  }

  return [...set].slice(0, 5)
}

export async function enrichFilmWithAi(film: FilmstockInput): Promise<AiEnrichmentResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const tagList = tagDefinitions.map(t => `${t.slug} (${t.kategorie})`).join(', ')
  const typLabel = film.typ === 'farbe' ? 'Farbfilm' : 'Schwarzweissfilm'

  const prompt = `Du bist Expert:in für Analogfotografie und schreibst für absolute Einsteiger auf Deutsch.

Analysiere diesen Film und antworte NUR mit validem JSON (kein Markdown):

{
  "beschreibung": "1-2 kurze Sätze auf Deutsch, verständlich für Einsteiger",
  "koernung": "fein|mittel|grob",
  "kontrast": "niedrig|mittel|hoch",
  "belichtungstoleranz": "eng|normal|weit",
  "farbcharakter": "ein Satz auf Deutsch",
  "stimmungs_tags": ["slug1", "slug2", "slug3"]
}

Regeln für stimmungs_tags:
- Genau 3 bis 5 Tags aus der erlaubten Liste
- Keine widersprüchlichen Tags (nicht feinkoernig UND koernig)
- wenig_licht nur bei ISO 800+ oder Nacht-/Tungsten-Filmen
- Tags sollen zum Fragebogen passen (Licht, Stimmung, Motiv)

Erlaubte Tags: ${tagList}

Film: ${film.hersteller} ${film.name}
ISO: ${film.iso}
Typ: ${typLabel}

Englische Quellbeschreibung:
${film.beschreibung.slice(0, 1200)}`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.warn(`  KI-Fehler für ${film.name}: ${response.status} ${err.slice(0, 100)}`)
    return null
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null

  try {
    const parsed = JSON.parse(match[0])
    const koernung = (['fein', 'mittel', 'grob'].includes(parsed.koernung) ? parsed.koernung : 'mittel') as Koernung
    const kontrast = (['niedrig', 'mittel', 'hoch'].includes(parsed.kontrast) ? parsed.kontrast : 'mittel') as Kontrast
    const belichtungstoleranz = (['eng', 'normal', 'weit'].includes(parsed.belichtungstoleranz) ? parsed.belichtungstoleranz : 'normal') as Belichtungstoleranz

    const tags = sanitizeTags(parsed.stimmungs_tags ?? [], koernung, film.iso)

    return {
      beschreibung: String(parsed.beschreibung ?? '').trim(),
      beschreibung_en: film.beschreibung.slice(0, 1500),
      koernung,
      kontrast,
      belichtungstoleranz,
      farbcharakter: String(parsed.farbcharakter ?? '').trim(),
      stimmungs_tags: tags.length > 0 ? tags : ['alltag'],
    }
  }
  catch {
    return null
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
