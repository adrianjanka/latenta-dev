import {
  DEVELOPMENT_RECIPE_FIELDS,
  getMockDevelopmentRecipesByFilmId,
  normalizeDevelopmentRecipe,
  type DevelopmentRecipeSource,
} from '~/server/utils/development-recipes'
import { getMockFilmstockById } from '~/server/utils/filmstocks'
import type { Entwicklungsrezept } from '~/types/filmstock'

interface DevelopmentRecipesByFilmResponse {
  data: Entwicklungsrezept[]
  source: DevelopmentRecipeSource
}

async function resolveFilmName(
  filmstockId: string,
  baseUrl: string | undefined,
  token: string | undefined,
): Promise<string | undefined> {
  const mockFilm = getMockFilmstockById(filmstockId)
  if (mockFilm) return mockFilm.name

  if (!baseUrl || !token) return undefined

  try {
    const response = await $fetch<{ data: Record<string, unknown> }>(
      `${baseUrl}/items/filmstocks/${filmstockId}?fields=name`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return String(response.data?.name ?? '')
  }
  catch {
    return undefined
  }
}

export default defineEventHandler(async (event): Promise<DevelopmentRecipesByFilmResponse> => {
  const filmstockId = getRouterParam(event, 'filmstockId')

  if (!filmstockId) {
    throw createError({ statusCode: 400, message: 'Filmstock-ID fehlt' })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.directusUrl as string | undefined
  const token = config.directusToken as string | undefined

  if (!baseUrl || !token) {
    return {
      data: getMockDevelopmentRecipesByFilmId(filmstockId),
      source: 'mock',
    }
  }

  const filmName = await resolveFilmName(filmstockId, baseUrl, token)

  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'filter[filmstock][_eq]': filmstockId,
      'fields': DEVELOPMENT_RECIPE_FIELDS,
      'limit': '-1',
    })

    const response = await $fetch<{ data: Record<string, unknown>[] }>(
      `${baseUrl}/items/entwicklungsrezepte?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    const recipes = (response.data ?? []).map(normalizeDevelopmentRecipe)

    if (recipes.length === 0) {
      return {
        data: getMockDevelopmentRecipesByFilmId(filmstockId, filmName),
        source: 'mock',
      }
    }

    return { data: recipes, source: 'directus' }
  }
  catch {
    return {
      data: getMockDevelopmentRecipesByFilmId(filmstockId, filmName),
      source: 'mock',
    }
  }
})
