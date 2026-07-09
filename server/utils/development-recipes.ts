import { MOCK_DEVELOPMENT_RECIPES } from '~/data/development-recipes.mock'
import type { Entwicklungsrezept, Entwicklungsschritt, Filmstock } from '~/types/filmstock'

export type DevelopmentRecipeSource = 'directus' | 'mock'

/** Directus-Filmname → Mock-Film-ID (Fallback wenn nur UUID bekannt) */
const DIRECTUS_NAME_TO_MOCK_FILM_ID: Record<string, string> = {
  'professional portra 400': '1',
  'gold 200': '2',
  'gc/ultramax 400': '3',
  'professional ektar 100': '4',
  'professional tri-x 400': '5',
  'delta 400 professional': '6',
  '800tungsten xpro': '7',
  'delta 100 professional': '8',
  'pro image 100': '10',
}

const RECIPE_FILMSTOCK_FIELDS = 'filmstock.id,filmstock.name,filmstock.hersteller,filmstock.typ,filmstock.iso,filmstock.format,filmstock.status'

export const DEVELOPMENT_RECIPE_FIELDS = `*,${RECIPE_FILMSTOCK_FIELDS}`

function normalizeSchritte(raw: unknown): Entwicklungsschritt[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (step): step is Entwicklungsschritt =>
      step !== null
      && typeof step === 'object'
      && 'titel' in step
      && typeof (step as Entwicklungsschritt).titel === 'string',
  )
}

function normalizeFilmstockRef(raw: Record<string, unknown>): Filmstock {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? ''),
    hersteller: String(raw.hersteller ?? ''),
    iso: Number(raw.iso ?? 400),
    typ: (raw.typ as Filmstock['typ']) ?? 'farbe',
    format: Array.isArray(raw.format) ? raw.format as Filmstock['format'] : ['35mm'],
    koernung: (raw.koernung as Filmstock['koernung']) ?? 'mittel',
    farbcharakter: String(raw.farbcharakter ?? ''),
    kontrast: (raw.kontrast as Filmstock['kontrast']) ?? 'mittel',
    belichtungstoleranz: (raw.belichtungstoleranz as Filmstock['belichtungstoleranz']) ?? 'normal',
    beschreibung: String(raw.beschreibung ?? ''),
    status: (raw.status as Filmstock['status']) ?? 'published',
  }
}

export function normalizeDevelopmentRecipe(raw: Record<string, unknown>): Entwicklungsrezept {
  const filmstockRaw = raw.filmstock
  let filmstock: string | Filmstock = ''

  if (typeof filmstockRaw === 'string') {
    filmstock = filmstockRaw
  }
  else if (filmstockRaw && typeof filmstockRaw === 'object') {
    filmstock = normalizeFilmstockRef(filmstockRaw as Record<string, unknown>)
  }

  return {
    id: String(raw.id ?? ''),
    filmstock,
    entwickler: String(raw.entwickler ?? ''),
    verduennung: String(raw.verduennung ?? ''),
    temperatur: Number(raw.temperatur ?? 20),
    zeit_sekunden: Number(raw.zeit_sekunden ?? 0),
    agitation: String(raw.agitation ?? ''),
    schritte: normalizeSchritte(raw.schritte),
    quelle: String(raw.quelle ?? ''),
    status: (raw.status as Entwicklungsrezept['status']) ?? 'draft',
  }
}

export function getFilmstockIdFromRecipe(recipe: Entwicklungsrezept): string {
  if (typeof recipe.filmstock === 'string') return recipe.filmstock
  return recipe.filmstock.id
}

export function getMockDevelopmentRecipes(): Entwicklungsrezept[] {
  return MOCK_DEVELOPMENT_RECIPES
}

export function getMockDevelopmentRecipesByFilmId(
  filmstockId: string,
  filmName?: string,
): Entwicklungsrezept[] {
  const byId = MOCK_DEVELOPMENT_RECIPES.filter(
    recipe => getFilmstockIdFromRecipe(recipe) === filmstockId,
  )
  if (byId.length > 0) return byId

  const mockFilmId = filmName
    ? DIRECTUS_NAME_TO_MOCK_FILM_ID[filmName.toLowerCase()]
    : undefined

  if (!mockFilmId) return []

  return MOCK_DEVELOPMENT_RECIPES.filter(
    recipe => getFilmstockIdFromRecipe(recipe) === mockFilmId,
  )
}

export function getMockDevelopmentRecipeById(id: string): Entwicklungsrezept | undefined {
  return MOCK_DEVELOPMENT_RECIPES.find(recipe => recipe.id === id)
}
