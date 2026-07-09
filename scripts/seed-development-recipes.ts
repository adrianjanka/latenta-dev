import { MOCK_DEVELOPMENT_RECIPES } from '../data/development-recipes.mock'
import { directusFetch } from './lib/directus'
import type { Entwicklungsrezept } from '../types/filmstock'

/** Mock-Film-ID → Directus-Filmname (published) */
const FILM_NAME_BY_MOCK_ID: Record<string, string> = {
  '1': 'professional portra 400',
  '2': 'gold 200',
  '3': 'gc/ultramax 400',
  '4': 'professional ektar 100',
  '5': 'professional tri-x 400',
  '6': 'delta 400 professional',
  '7': '800tungsten xpro',
  '8': 'delta 100 professional',
  '10': 'pro image 100',
}

interface DirectusFilm {
  id: string
  name: string
}

interface DirectusRecipe {
  id: string
  entwickler: string
  verduennung: string
  filmstock: string
}

function getMockFilmId(recipe: Entwicklungsrezept): string {
  return typeof recipe.filmstock === 'string' ? recipe.filmstock : recipe.filmstock.id
}

async function loadPublishedFilms(): Promise<Map<string, string>> {
  const response = await directusFetch<{ data: DirectusFilm[] }>(
    '/items/filmstocks?filter[status][_eq]=published&fields=id,name&limit=-1',
  )

  const nameToId = new Map<string, string>()
  for (const film of response.data) {
    nameToId.set(film.name.toLowerCase(), film.id)
  }
  return nameToId
}

async function recipeExists(filmId: string, entwickler: string, verduennung: string): Promise<boolean> {
  const params = new URLSearchParams({
    'filter[filmstock][_eq]': filmId,
    'filter[entwickler][_eq]': entwickler,
    'filter[verduennung][_eq]': verduennung,
    'limit': '1',
  })

  const response = await directusFetch<{ data: DirectusRecipe[] }>(
    `/items/entwicklungsrezepte?${params}`,
  )

  return response.data.length > 0
}

async function main() {
  console.log('Entwicklungsrezepte seeden...')
  const nameToId = await loadPublishedFilms()
  let created = 0
  let skipped = 0

  for (const recipe of MOCK_DEVELOPMENT_RECIPES) {
    const mockFilmId = getMockFilmId(recipe)
    const filmName = FILM_NAME_BY_MOCK_ID[mockFilmId]

    if (!filmName) {
      console.warn(`  Übersprungen (kein Mapping): ${recipe.id}`)
      skipped++
      continue
    }

    const filmId = nameToId.get(filmName.toLowerCase())
    if (!filmId) {
      console.warn(`  Übersprungen (Film nicht gefunden): ${filmName}`)
      skipped++
      continue
    }

    if (await recipeExists(filmId, recipe.entwickler, recipe.verduennung)) {
      console.log(`  Existiert bereits: ${filmName} – ${recipe.entwickler}`)
      skipped++
      continue
    }

    const { id: _id, filmstock: _film, ...payload } = recipe

    await directusFetch('/items/entwicklungsrezepte', {
      method: 'POST',
      body: JSON.stringify({
        ...payload,
        filmstock: filmId,
        status: 'published',
      }),
    })

    console.log(`  Erstellt: ${filmName} – ${recipe.entwickler}`)
    created++
  }

  console.log(`Fertig. ${created} erstellt, ${skipped} übersprungen.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
