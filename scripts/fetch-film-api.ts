import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const FILM_API_URL = 'https://filmapi.vercel.app/api/films'
const OUTPUT = resolve(process.cwd(), 'data/filmstocks.raw.json')

async function main() {
  console.log(`Lade Film API: ${FILM_API_URL}`)
  const response = await fetch(FILM_API_URL)
  if (!response.ok) throw new Error(`Film API ${response.status}`)

  const data = await response.json()
  writeFileSync(OUTPUT, JSON.stringify(data, null, 2), 'utf-8')
  console.log(`${data.length} Filme gespeichert → ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
