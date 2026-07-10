import { MOCK_FILMSTOCKS } from '~/data/filmstocks.mock'
import type { DirectusFile, Filmstock, StimmungsTag } from '~/types/filmstock'

export type FilmstockSource = 'directus' | 'mock'

/** Felder für Listen- und Detail-API inkl. Bilder */
export const FILMSTOCK_FIELDS = [
  '*',
  'bild.id',
  'bild.filename_download',
  'bild.title',
  'bild.description',
  'stimmungs_tags.stimmungs_tags_id.*',
  'beispielbilder.directus_files_id.id',
  'beispielbilder.directus_files_id.filename_download',
  'beispielbilder.directus_files_id.title',
  'beispielbilder.directus_files_id.description',
].join(',')

type DirectusTagRelation =
  | string
  | number
  | StimmungsTag
  | { stimmungs_tags_id: StimmungsTag | string | null }

type DirectusFileRelation =
  | string
  | DirectusFile
  | { directus_files_id: DirectusFile | string | null }

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

function normalizeFile(raw: unknown): DirectusFile | null {
  if (!raw) return null
  if (typeof raw === 'string') return { id: raw }
  if (typeof raw === 'object' && raw !== null && 'id' in raw) {
    const file = raw as DirectusFile
    return {
      id: file.id,
      filename_download: file.filename_download,
      title: file.title,
      description: file.description,
    }
  }
  return null
}

export function normalizeBeispielbilder(raw: unknown): DirectusFile[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((entry: DirectusFileRelation) => {
      if (typeof entry === 'string') return { id: entry }
      if (entry && typeof entry === 'object' && 'directus_files_id' in entry) {
        return normalizeFile(entry.directus_files_id)
      }
      return normalizeFile(entry)
    })
    .filter((file): file is DirectusFile => file !== null)
}

export function normalizeFilmstock(raw: Record<string, unknown>): Filmstock {
  return {
    ...(raw as unknown as Filmstock),
    format: Array.isArray(raw.format) ? raw.format as Filmstock['format'] : ['35mm'],
    bild: normalizeFile(raw.bild),
    stimmungs_tags: normalizeTags(raw.stimmungs_tags),
    beispielbilder: normalizeBeispielbilder(raw.beispielbilder),
  }
}

export function getMockFilmstocks(): Filmstock[] {
  return MOCK_FILMSTOCKS
}

export function getMockFilmstockById(id: string): Filmstock | undefined {
  return MOCK_FILMSTOCKS.find(film => film.id === id)
}
