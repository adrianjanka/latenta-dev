import {
  getMockFilmstocks,
  normalizeFilmstock,
  type FilmstockSource,
} from '~/server/utils/filmstocks'
import type { Filmstock } from '~/types/filmstock'

interface FilmstocksResponse {
  data: Filmstock[]
  source: FilmstockSource
}

export default defineEventHandler(async (): Promise<FilmstocksResponse> => {
  const config = useRuntimeConfig()
  const baseUrl = config.directusUrl as string | undefined
  const token = config.directusToken as string | undefined

  if (!baseUrl || !token) {
    return { data: getMockFilmstocks(), source: 'mock' }
  }

  try {
    const params = new URLSearchParams({
      'filter[status][_eq]': 'published',
      'fields': '*,stimmungs_tags.stimmungs_tags_id.*',
      'limit': '-1',
    })

    const response = await $fetch<{ data: Record<string, unknown>[] }>(
      `${baseUrl}/items/filmstocks?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    const films = (response.data ?? []).map(normalizeFilmstock)

    if (films.length === 0) {
      return { data: getMockFilmstocks(), source: 'mock' }
    }

    return { data: films, source: 'directus' }
  }
  catch {
    return { data: getMockFilmstocks(), source: 'mock' }
  }
})
