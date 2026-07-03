import type { FilmFormat, FilmTyp } from '~/types/filmstock'

export type TypAnswer = FilmTyp | 'unsure'
export type LocationAnswer = 'draussen' | 'drinnen' | 'beides'
export type LightAnswer = 'hell' | 'bewoelkt' | 'wenig_licht'
export type MoodAnswer = 'warm' | 'lebhaft' | 'nostalgisch' | 'klassisch'
export type MotivAnswer = 'menschen' | 'landschaft' | 'strasse' | 'alltag'

export interface QuestionnaireAnswers {
  typ: TypAnswer
  location: LocationAnswer
  light: LightAnswer
  mood: MoodAnswer
  motiv: MotivAnswer
  format: FilmFormat
}

export interface QuestionOption<T extends string> {
  value: T
  label: string
  description?: string
}

export interface QuestionnaireQuestion<T extends string = string> {
  id: keyof QuestionnaireAnswers
  question: string
  hint?: string
  options: QuestionOption<T>[]
}

export const QUESTIONNAIRE_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: 'typ',
    question: 'Möchtest du Farbfotos oder Schwarzweiss-Fotos?',
    hint: 'Wenn du unsicher bist, wähle «Weiss nicht» – wir zeigen dir beides.',
    options: [
      { value: 'farbe', label: 'Farbe', description: 'Natürliche oder lebendige Farben' },
      { value: 's_w', label: 'Schwarzweiss', description: 'Zeitlos, kontrastreich, klassisch' },
      { value: 'unsure', label: 'Weiss nicht', description: 'Zeigt Empfehlungen aus beiden Welten' },
    ],
  },
  {
    id: 'location',
    question: 'Wo fotografierst du hauptsächlich?',
    options: [
      { value: 'draussen', label: 'Draussen', description: 'Strasse, Natur, unterwegs' },
      { value: 'drinnen', label: 'Drinnen', description: 'Zuhause, Café, Studio' },
      { value: 'beides', label: 'Beides', description: 'Flexibel unterwegs' },
    ],
  },
  {
    id: 'light',
    question: 'Wie ist das Licht meistens?',
    options: [
      { value: 'hell', label: 'Hell', description: 'Sonnenschein, helle Tage' },
      { value: 'bewoelkt', label: 'Bewölkt', description: 'Weiches, gleichmässiges Licht' },
      { value: 'wenig_licht', label: 'Wenig Licht', description: 'Abend, Schatten, Innenräume' },
    ],
  },
  {
    id: 'mood',
    question: 'Welche Stimmung soll dein Foto haben?',
    options: [
      { value: 'warm', label: 'Warm & natürlich', description: 'Hauttöne, Alltag, Sonnenlicht' },
      { value: 'lebhaft', label: 'Lebhaft & knallig', description: 'Kräftige Farben, viel Energie' },
      { value: 'nostalgisch', label: 'Gedämpft & nostalgisch', description: 'Retro, weich, verträumt' },
      { value: 'klassisch', label: 'Klassisch & zeitlos', description: 'Dokumentarisch, klar, reduziert' },
    ],
  },
  {
    id: 'motiv',
    question: 'Was fotografierst du am liebsten?',
    options: [
      { value: 'menschen', label: 'Menschen', description: 'Porträts, Freunde, Familie' },
      { value: 'landschaft', label: 'Landschaft', description: 'Berge, Natur, Weite' },
      { value: 'strasse', label: 'Strasse & Alltag', description: 'Urban, spontan, unterwegs' },
      { value: 'alltag', label: 'Ein bisschen alles', description: 'Vielseitig, ohne Schwerpunkt' },
    ],
  },
  {
    id: 'format',
    question: 'Welches Filmformat nutzt du?',
    hint: 'Aktuell unterstützen wir 35mm als Standard.',
    options: [
      { value: '35mm', label: '35mm', description: 'Kleinbild – die gängigste Wahl' },
    ],
  },
]

/** Mappt Fragebogen-Antworten auf Tag-Slugs für den Matcher */
export function answersToTagSlugs(answers: QuestionnaireAnswers): string[] {
  const tags = new Set<string>()

  if (answers.location === 'draussen' || answers.location === 'beides') tags.add('draussen')
  if (answers.location === 'drinnen' || answers.location === 'beides') tags.add('drinnen')

  tags.add(answers.light)

  const moodTags: Record<MoodAnswer, string[]> = {
    warm: ['warm', 'saettigend'],
    lebhaft: ['lebhaft', 'saettigend', 'kontrastreich'],
    nostalgisch: ['nostalgisch', 'gedaempft', 'vintage'],
    klassisch: ['klassisch', 'dokumentarisch'],
  }
  moodTags[answers.mood].forEach(t => tags.add(t))

  const motivTags: Record<MotivAnswer, string[]> = {
    menschen: ['menschen', 'portraet'],
    landschaft: ['landschaft'],
    strasse: ['strasse', 'alltag'],
    alltag: ['alltag', 'dokumentarisch'],
  }
  motivTags[answers.motiv].forEach(t => tags.add(t))

  if (answers.light === 'wenig_licht') tags.add('nacht')

  return [...tags]
}

/** ISO-Bereich passend zum Licht (weiche Präferenz, kein harter Ausschluss) */
export function preferredIsoRange(light: LightAnswer): { min: number, max: number } {
  switch (light) {
    case 'hell': return { min: 50, max: 200 }
    case 'bewoelkt': return { min: 100, max: 400 }
    case 'wenig_licht': return { min: 400, max: 3200 }
  }
}
