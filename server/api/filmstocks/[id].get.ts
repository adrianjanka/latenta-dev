import {
  getMockFilmstockById,
  normalizeFilmstock,
  type FilmstockSource,
} from '~/server/utils/filmstocks'
import type { Filmstock } from '~/types/filmstock'

interface FilmstockResponse {
  data: Filmstock
  source: FilmstockSource
}

export default defineEventHandler(async (event): Promise<FilmstockResponse> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Film-ID fehlt' })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.directusUrl as string | undefined
  const token = config.directusToken as string | undefined

  if (!baseUrl || !token) {
    const mock = getMockFilmstockById(id)
    if (!mock) {
      throw createError({ statusCode: 404, statusMessage: 'Film nicht gefunden' })
    }
    return { data: mock, source: 'mock' }
  }

  try {
    const params = new URLSearchParams({
      'fields': '*,stimmungs_tags.stimmungs_tags_id.*',
    })

    const response = await $fetch<{ data: Record<string, unknown> }>(
      `${baseUrl}/items/filmstocks/${id}?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    const film = normalizeFilmstock(response.data)

    if (film.status !== 'published') {
      throw createError({ statusCode: 404, statusMessage: 'Film nicht gefunden' })
    }

    return { data: film, source: 'directus' }
  }
  catch (error: unknown) {
    const mock = getMockFilmstockById(id)
    if (mock) {
      return { data: mock, source: 'mock' }
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({ statusCode: 404, statusMessage: 'Film nicht gefunden' })
  }
})
