import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import top30 from '../data/top-30-films.json'
import type { FilmApiRecord, FilmstockInput } from '../types/filmstock'

const INPUT = resolve(process.cwd(), 'data/filmstocks.raw.json')
const OUTPUT = resolve(process.cwd(), 'data/filmstocks.transformed.json')

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function isTop30(hersteller: string, name: string): boolean {
  const h = normalize(hersteller)
  const n = normalize(name)
  return top30.films.some((f) => {
    return h.includes(normalize(f.hersteller)) && n.includes(normalize(f.name))
  })
}

function buildDescription(film: FilmApiRecord): string {
  const features = (film.keyFeatures ?? []).map(f => f.feature).join('. ')
  return [film.description, features].filter(Boolean).join(' ')
}

function transformFilm(film: FilmApiRecord): FilmstockInput {
  const top = isTop30(film.brand, film.name)
  return {
    name: film.name,
    hersteller: film.brand,
    iso: Math.max(1, Math.round(film.iso)),
    typ: film.color ? 'farbe' : 's_w',
    format: ['35mm'],
    koernung: 'mittel',
    kontrast: 'mittel',
    belichtungstoleranz: 'normal',
    farbcharakter: '',
    beschreibung: buildDescription(film),
    stimmungs_tags: [],
    externe_quelle: 'Film API (MIT)',
    externe_id: film._id,
    status: top ? 'published' : 'draft',
  }
}

function main() {
  const raw: FilmApiRecord[] = JSON.parse(readFileSync(INPUT, 'utf-8'))
  const filtered = raw.filter(f => f.formatThirtyFive)
  const transformed = filtered.map(transformFilm)

  writeFileSync(OUTPUT, JSON.stringify(transformed, null, 2), 'utf-8')
  console.log(`${transformed.length} Filme transformiert (35mm) → ${OUTPUT}`)
  console.log(`${transformed.filter(f => f.status === 'published').length} als Top-30 markiert (published)`)
}

main()
