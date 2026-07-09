import {
  DEVELOPMENT_RECIPE_FIELDS,
  getMockDevelopmentRecipes,
  normalizeDevelopmentRecipe,
  type DevelopmentRecipeSource,
} from '~/server/utils/development-recipes'
import type { Entwicklungsrezept } from '~/types/filmstock'

interface DevelopmentRecipesResponse {
  data: Entwicklungsrezept[]
  source: DevelopmentRecipeSource
}

export default defineEventHandler(async (): Promise<DevelopmentRecipesResponse> => {
  const config = useRuntimeConfig()
  const baseUrl = config.directusUrl as string | undefined
  const token = config.directusToken as string | undefined

  if (!baseUrl || !token) {
    return { data: getMockDevelopmentRecipes(), source: 'mock' }
  }

  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
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
      return { data: getMockDevelopmentRecipes(), source: 'mock' }
    }

    return { data: recipes, source: 'directus' }
  }
  catch {
    return { data: getMockDevelopmentRecipes(), source: 'mock' }
  }
})
