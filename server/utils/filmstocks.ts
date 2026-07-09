import { MOCK_FILMSTOCKS } from '~/data/filmstocks.mock'
import type { Filmstock, StimmungsTag } from '~/types/filmstock'

export type FilmstockSource = 'directus' | 'mock'

type DirectusTagRelation =
  | string
  | number
  | StimmungsTag
  | { stimmungs_tags_id: StimmungsTag | string | null }

export function normalizeTags(raw: unknown): StimmungsTag[] | string[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((entry: DirectusTagRelation) => {
      if (typeof entry === 'string') return entry
      if (typeof entry === 'number') return null
      if (typeof entry === 'object' && entry !== null && 'slug' in entry && entry.slug) {
        return entry as StimmungsTag
      }
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

export function normalizeFilmstock(raw: Record<string, unknown>): Filmstock {
  return {
    ...(raw as unknown as Filmstock),
    format: Array.isArray(raw.format) ? raw.format as Filmstock['format'] : ['35mm'],
    stimmungs_tags: normalizeTags(raw.stimmungs_tags),
  }
}

export function getMockFilmstocks(): Filmstock[] {
  return MOCK_FILMSTOCKS
}

export function getMockFilmstockById(id: string): Filmstock | undefined {
  return MOCK_FILMSTOCKS.find(film => film.id === id)
}
