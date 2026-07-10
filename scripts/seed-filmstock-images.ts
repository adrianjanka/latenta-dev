/**
 * Phase 5A: Unsplash → Directus Files für Rollenfotos + Beispielaufnahmen.
 *
 * Env: DIRECTUS_URL, DIRECTUS_TOKEN, UNSPLASH_ACCESS_KEY
 * Idempotent: Filme mit bestehendem `bild` werden übersprungen.
 *
 * Unsplash Demo-Apps: 50 Requests/Stunde. Pro Film ~6 Calls
 * (3× Suche + 3× Download-Trigger) → max. ~8 Filme/Stunde.
 *
 * Gestaffelt:
 *   npm run data:seed:images -- --limit=2
 * Bei Rate-Limit bricht das Script sauber ab (Rest später erneut).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { directusFetch } from './lib/directus'
import { getEnv } from './lib/env'

interface ManifestFilm {
  label?: string
  roll_query?: string
  look_queries?: string[]
  /** Optional: feste Unsplash-Photo-IDs statt Suche */
  roll_photo_id?: string
  look_photo_ids?: string[]
}

interface Manifest {
  default_roll_query: string
  look_by_typ: Record<'farbe' | 's_w', string[]>
  films: Record<string, ManifestFilm>
}

interface DirectusFilm {
  id: string
  name: string
  hersteller: string
  typ: 'farbe' | 's_w'
  bild: string | null
  beispielbilder: Array<{ id: number }> | null
}

interface UnsplashPhoto {
  id: string
  urls: { raw: string; regular: string }
  user: { name: string; links: { html: string } }
  links: { download_location: string }
  description: string | null
  alt_description: string | null
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[]
}

interface DirectusFileImport {
  data: { id: string }
}

class RateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RateLimitError'
  }
}

/** Pause zwischen Unsplash-Calls – schont das 50/h-Kontingent */
const DELAY_MS = 2500
const usedPhotoIds = new Set<string>()
let unsplashCalls = 0

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function unsplashKey() {
  return getEnv('UNSPLASH_ACCESS_KEY')
}

function attribution(photo: UnsplashPhoto): string {
  return `Foto: ${photo.user.name} / Unsplash`
}

function parseArgs() {
  const args = process.argv.slice(2)
  let limit = Number.POSITIVE_INFINITY
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--limit' && args[i + 1]) {
      limit = Math.max(1, Number.parseInt(args[i + 1], 10) || 1)
      i++
    }
    else if (args[i]?.startsWith('--limit=')) {
      limit = Math.max(1, Number.parseInt(args[i].split('=')[1] ?? '1', 10) || 1)
    }
  }
  return { limit }
}

async function unsplashFetch<T>(path: string): Promise<T> {
  const url = path.startsWith('http') ? path : `https://api.unsplash.com${path}`
  unsplashCalls++
  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${unsplashKey()}`,
      'Accept-Version': 'v1',
    },
  })

  const remaining = response.headers.get('x-ratelimit-remaining')
  const limit = response.headers.get('x-ratelimit-limit')
  if (remaining !== null) {
    console.log(`  [Unsplash ${unsplashCalls}] Rate-Limit Rest: ${remaining}/${limit ?? '?'}`)
  }

  if (response.status === 403) {
    const body = await response.text()
    if (/rate limit/i.test(body)) {
      throw new RateLimitError(`Unsplash Rate Limit (${unsplashCalls} Calls in diesem Lauf)`)
    }
    throw new Error(`Unsplash 403: ${body}`)
  }

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Unsplash ${response.status}: ${body}`)
  }

  return response.json() as Promise<T>
}

/** Unsplash-ToS: Download-Endpoint triggern */
async function triggerDownload(photo: UnsplashPhoto) {
  await unsplashFetch(photo.links.download_location)
}

async function getPhotoById(id: string): Promise<UnsplashPhoto> {
  return unsplashFetch<UnsplashPhoto>(`/photos/${id}`)
}

async function searchPhoto(query: string): Promise<UnsplashPhoto | null> {
  const params = new URLSearchParams({
    query,
    per_page: '8',
    orientation: 'landscape',
    content_filter: 'high',
  })

  const data = await unsplashFetch<UnsplashSearchResponse>(`/search/photos?${params}`)

  for (const photo of data.results) {
    if (!usedPhotoIds.has(photo.id)) {
      usedPhotoIds.add(photo.id)
      return photo
    }
  }

  return data.results[0] ?? null
}

async function resolvePhoto(opts: {
  photoId?: string
  query: string
}): Promise<UnsplashPhoto | null> {
  if (opts.photoId) {
    const photo = await getPhotoById(opts.photoId)
    usedPhotoIds.add(photo.id)
    return photo
  }
  return searchPhoto(opts.query)
}

async function importToDirectus(photo: UnsplashPhoto, title: string): Promise<string> {
  await triggerDownload(photo)

  // raw + w=1600 für vernünftige Dateigrösse
  const importUrl = `${photo.urls.raw}&w=1600&q=80&fm=jpg`

  const response = await directusFetch<DirectusFileImport>('/files/import', {
    method: 'POST',
    body: JSON.stringify({
      url: importUrl,
      data: {
        title,
        description: attribution(photo),
        tags: ['unsplash', 'latenta-phase5'],
      },
    }),
  })

  return response.data.id
}

async function loadPublishedFilms(): Promise<DirectusFilm[]> {
  const params = new URLSearchParams({
    'filter[status][_eq]': 'published',
    'fields': 'id,name,hersteller,typ,bild,beispielbilder',
    'limit': '-1',
  })

  const response = await directusFetch<{ data: DirectusFilm[] }>(
    `/items/filmstocks?${params}`,
  )
  return response.data
}

function loadManifest(): Manifest {
  const path = resolve(process.cwd(), 'data/filmstock-images.manifest.json')
  return JSON.parse(readFileSync(path, 'utf-8')) as Manifest
}

async function seedFilm(film: DirectusFilm, manifest: Manifest) {
  const entry = manifest.films[film.id] ?? {}
  const label = entry.label ?? `${film.hersteller} ${film.name}`

  const rollQuery = entry.roll_query ?? `${film.hersteller} 35mm film roll`
  const lookQueries = entry.look_queries
    ?? manifest.look_by_typ[film.typ]
    ?? manifest.look_by_typ.farbe

  console.log(`\n→ ${label}`)

  const rollPhoto = await resolvePhoto({
    photoId: entry.roll_photo_id,
    query: rollQuery || manifest.default_roll_query,
  })
  await sleep(DELAY_MS)

  if (!rollPhoto) {
    console.warn('  Kein Rollenfoto gefunden – übersprungen')
    return { seeded: false }
  }

  const rollFileId = await importToDirectus(rollPhoto, `${label} – Rollenfoto`)
  console.log(`  Rollenfoto: ${attribution(rollPhoto)}`)
  await sleep(DELAY_MS)

  const beispielFileIds: string[] = []
  const lookIds = entry.look_photo_ids ?? []

  for (let i = 0; i < 2; i++) {
    const lookPhoto = await resolvePhoto({
      photoId: lookIds[i],
      query: lookQueries[i] ?? lookQueries[0] ?? 'analog film photography',
    })
    await sleep(DELAY_MS)

    if (!lookPhoto) {
      console.warn(`  Look-Beispiel ${i + 1}: nichts gefunden`)
      continue
    }

    const fileId = await importToDirectus(lookPhoto, `${label} – Beispiel ${i + 1}`)
    beispielFileIds.push(fileId)
    console.log(`  Beispiel ${i + 1}: ${attribution(lookPhoto)}`)
    await sleep(DELAY_MS)
  }

  await directusFetch(`/items/filmstocks/${film.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      bild: rollFileId,
      bild_quelle: attribution(rollPhoto),
      beispielbilder: beispielFileIds.map(id => ({
        directus_files_id: id,
      })),
    }),
  })

  return { seeded: true }
}

async function main() {
  const { limit } = parseArgs()
  console.log('Filmstock-Bilder seeden (Unsplash → Directus)...')
  console.log(`Batch-Limit: ${Number.isFinite(limit) ? limit : 'alle offenen'} Filme`)
  console.log('Tipp: npm run data:seed:images -- --limit=2  (ca. 12 Unsplash-Calls)')
  getEnv('UNSPLASH_ACCESS_KEY')

  const manifest = loadManifest()
  const films = await loadPublishedFilms()
  const pending = films.filter(film => !film.bild)

  console.log(`Published: ${films.length}, bereits mit bild: ${films.length - pending.length}, offen: ${pending.length}`)

  let seeded = 0
  let skipped = films.length - pending.length
  let failed = 0
  let rateLimited = false

  for (const film of pending) {
    if (seeded >= limit) {
      console.log(`\nBatch-Limit (${limit}) erreicht – Rest später mit erneutem Aufruf.`)
      break
    }

    try {
      const result = await seedFilm(film, manifest)
      if (result.seeded) seeded++
      else skipped++
    }
    catch (error) {
      if (error instanceof RateLimitError) {
        rateLimited = true
        console.error(`\n⛔ ${error.message}`)
        console.error('   Warte ~1 Stunde, dann: npm run data:seed:images -- --limit=2')
        break
      }
      failed++
      console.error(`  Fehler bei ${film.name}:`, error instanceof Error ? error.message : error)
    }
  }

  const stillOpen = (await loadPublishedFilms()).filter(f => !f.bild).length
  console.log(`\nFertig. Neu: ${seeded}, übersprungen: ${skipped}, Fehler: ${failed}, Unsplash-Calls: ${unsplashCalls}`)
  console.log(`Noch offen ohne bild: ${stillOpen}`)
  if (rateLimited) process.exitCode = 0
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
