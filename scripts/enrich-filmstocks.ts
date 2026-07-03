import 'dotenv/config'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { enrichFilmWithAi, sleep } from './lib/anthropic-enrich'
import type { FilmstockInput } from '../types/filmstock'

const INPUT = resolve(process.cwd(), 'data/filmstocks.transformed.json')
const OUTPUT = resolve(process.cwd(), 'data/filmstocks.enriched.json')

function ruleBasedEnrich(film: FilmstockInput): FilmstockInput {
  // Minimale Fallback-Werte für draft-Filme
  return {
    ...film,
    beschreibung_en: film.beschreibung.slice(0, 1500),
    koernung: film.koernung || 'mittel',
    kontrast: film.kontrast || 'mittel',
    belichtungstoleranz: film.belichtungstoleranz || 'normal',
    farbcharakter: film.farbcharakter || 'Noch nicht kuratiert',
    stimmungs_tags: film.stimmungs_tags?.length ? film.stimmungs_tags : ['alltag'],
  }
}

async function main() {
  const films: FilmstockInput[] = JSON.parse(readFileSync(INPUT, 'utf-8'))
  const useAi = !!process.env.ANTHROPIC_API_KEY
  const published = films.filter(f => f.status === 'published')

  console.log(useAi
    ? `Anreicherung: KI für ${published.length} published-Filme, Regeln für ${films.length - published.length} drafts`
    : 'Anreicherung: Regelbasiert (kein API-Key)')

  const enriched: FilmstockInput[] = []
  let aiCount = 0

  for (const film of films) {
    if (useAi && film.status === 'published') {
      console.log(`  KI: ${film.hersteller} ${film.name}...`)
      const ai = await enrichFilmWithAi(film)
      if (ai) {
        enriched.push({
          ...film,
          ...ai,
          stimmungs_tags: ai.stimmungs_tags,
        })
        aiCount++
        await sleep(400)
        continue
      }
      console.warn(`  Fallback Regeln für ${film.name}`)
    }

    enriched.push(ruleBasedEnrich(film))
  }

  writeFileSync(OUTPUT, JSON.stringify(enriched, null, 2), 'utf-8')
  console.log(`${enriched.length} Filme angereichert (${aiCount} via KI) → ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
