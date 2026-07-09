import { MOCK_FILMSTOCKS } from '~/data/filmstocks.mock'
import type { Filmstock, StimmungsTag } from '~/types/filmstock'

export type FilmstockSource = 'directus' | 'mock'

interface FilmstocksResponse {
  data: Filmstock[]
  source: FilmstockSource
}

type DirectusTagRelation =
  | string
  | StimmungsTag
  | { stimmungs_tags_id: StimmungsTag | string | null }

function normalizeTags(raw: unknown): StimmungsTag[] | string[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((entry: DirectusTagRelation) => {
      if (typeof entry === 'string') return entry
      if ('slug' in entry && entry.slug) return entry as StimmungsTag
      if (entry && typeof entry === 'object' && 'stimmungs_tags_id' in entry) {
        const nested = entry.stimmungs_tags_id
        if (!nested) return null
        if (typeof nested === 'string') return nested
        if (typeof nested === 'object' && 'slug' in nested) return nested as StimmungsTag
      }
      return null
    })
    .filter((tag): tag is StimmungsTag | string => tag !== null)
}

function normalizeFilmstock(raw: Record<string, unknown>): Filmstock {
  return {
    ...(raw as unknown as Filmstock),
    format: Array.isArray(raw.format) ? raw.format as Filmstock['format'] : ['35mm'],
    stimmungs_tags: normalizeTags(raw.stimmungs_tags),
  }
}

export default defineEventHandler(async (): Promise<FilmstocksResponse> => {
  const config = useRuntimeConfig()
  const baseUrl = config.directusUrl as string | undefined
  const token = config.directusToken as string | undefined

  if (!baseUrl || !token) {
    return { data: MOCK_FILMSTOCKS, source: 'mock' }
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
      return { data: MOCK_FILMSTOCKS, source: 'mock' }
    }

    return { data: films, source: 'directus' }
  }
  catch {
    return { data: MOCK_FILMSTOCKS, source: 'mock' }
  }
})
