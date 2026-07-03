import { MOCK_FILMSTOCKS } from '../data/filmstocks.mock'
import { recommendFilms } from '../utils/recommendation'
import type { QuestionnaireAnswers } from '../data/questionnaire'

const scenarios: Array<{ name: string, answers: QuestionnaireAnswers }> = [
  {
    name: 'Porträt draussen, warm',
    answers: {
      typ: 'farbe',
      location: 'draussen',
      light: 'bewoelkt',
      mood: 'warm',
      motiv: 'menschen',
      format: '35mm',
    },
  },
  {
    name: 'Nacht, Strasse',
    answers: {
      typ: 'farbe',
      location: 'draussen',
      light: 'wenig_licht',
      mood: 'nostalgisch',
      motiv: 'strasse',
      format: '35mm',
    },
  },
  {
    name: 'Klassisch SW Dokumentarisch',
    answers: {
      typ: 's_w',
      location: 'beides',
      light: 'bewoelkt',
      mood: 'klassisch',
      motiv: 'strasse',
      format: '35mm',
    },
  },
  {
    name: 'Landschaft, hell',
    answers: {
      typ: 'farbe',
      location: 'draussen',
      light: 'hell',
      mood: 'lebhaft',
      motiv: 'landschaft',
      format: '35mm',
    },
  },
  {
    name: 'Einsteiger unsicher',
    answers: {
      typ: 'unsure',
      location: 'beides',
      light: 'bewoelkt',
      mood: 'warm',
      motiv: 'alltag',
      format: '35mm',
    },
  },
]

console.log('Matcher-Tests (Mock-Daten)\n')

let passed = 0
for (const scenario of scenarios) {
  const results = recommendFilms(MOCK_FILMSTOCKS, scenario.answers, 3)
  console.log(`--- ${scenario.name} ---`)
  if (results.length === 0) {
    console.log('  KEINE ERGEBNISSE')
    continue
  }
  results.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.filmstock.hersteller} ${r.filmstock.name} (Score: ${r.score})`)
    r.reasons.forEach(reason => console.log(`     → ${reason}`))
  })
  passed++
  console.log()
}

console.log(`${passed}/${scenarios.length} Szenarien mit Ergebnissen`)
if (passed < scenarios.length) process.exit(1)
