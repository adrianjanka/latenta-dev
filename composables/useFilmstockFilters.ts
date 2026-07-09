import type { Filmstock, Kontrast, Koernung } from '~/types/filmstock'

export type TypFilter = 'all' | 'farbe' | 's_w'
export type IsoFilter = 'all' | 'lte200' | 'iso400' | 'gte800'
export type CharakterFilter = 'all' | Koernung | 'sanft' | 'kontrastreich'

export interface FilmstockFilterState {
  typ: TypFilter
  iso: IsoFilter
  charakter: CharakterFilter
}

export const DEFAULT_FILMSTOCK_FILTERS: FilmstockFilterState = {
  typ: 'all',
  iso: 'all',
  charakter: 'all',
}

export interface FilterChipGroup<T extends string> {
  id: keyof FilmstockFilterState
  label: string
  chips: { value: T, label: string }[]
}

export const FILTER_CHIP_GROUPS: FilterChipGroup<string>[] = [
  {
    id: 'typ',
    label: 'Typ',
    chips: [
      { value: 'all', label: 'Alle' },
      { value: 'farbe', label: 'Farbe' },
      { value: 's_w', label: 'S/W' },
    ],
  },
  {
    id: 'iso',
    label: 'ISO',
    chips: [
      { value: 'all', label: 'Alle' },
      { value: 'lte200', label: '≤200' },
      { value: 'iso400', label: '400' },
      { value: 'gte800', label: '800+' },
    ],
  },
  {
    id: 'charakter',
    label: 'Charakter',
    chips: [
      { value: 'all', label: 'Alle' },
      { value: 'fein', label: 'Fein' },
      { value: 'mittel', label: 'Mittel' },
      { value: 'grob', label: 'Grob' },
      { value: 'sanft', label: 'Sanft' },
      { value: 'kontrastreich', label: 'Kontrastreich' },
    ],
  },
]

function matchesIso(iso: number, filter: IsoFilter): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'lte200':
      return iso <= 200
    case 'iso400':
      return iso >= 250 && iso <= 500
    case 'gte800':
      return iso >= 800
  }
}

function matchesCharakter(
  koernung: Koernung,
  kontrast: Kontrast,
  filter: CharakterFilter,
): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'fein':
    case 'mittel':
    case 'grob':
      return koernung === filter
    case 'sanft':
      return kontrast === 'niedrig'
    case 'kontrastreich':
      return kontrast === 'hoch'
  }
}

function matchesSearch(film: Filmstock, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const tagLabels = (film.stimmungs_tags ?? []).map((tag) => {
    if (typeof tag === 'string') return tag
    return tag.name
  })

  const haystack = [
    film.name,
    film.hersteller,
    film.farbcharakter,
    film.beschreibung,
    String(film.iso),
    ...tagLabels,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(normalized)
}

function matchesFilters(film: Filmstock, filters: FilmstockFilterState, query: string): boolean {
  if (!matchesSearch(film, query)) return false
  if (filters.typ !== 'all' && film.typ !== filters.typ) return false
  if (!matchesIso(film.iso, filters.iso)) return false
  if (!matchesCharakter(film.koernung, film.kontrast, filters.charakter)) return false
  return true
}

export function useFilmstockFilters(films: Ref<Filmstock[]>) {
  const filters = ref<FilmstockFilterState>({ ...DEFAULT_FILMSTOCK_FILTERS })
  const searchQuery = ref('')

  const filteredFilms = computed(() =>
    films.value.filter(film => matchesFilters(film, filters.value, searchQuery.value)),
  )

  const hasActiveFilters = computed(() =>
    searchQuery.value.trim().length > 0
    || filters.value.typ !== 'all'
    || filters.value.iso !== 'all'
    || filters.value.charakter !== 'all',
  )

  function setFilter<K extends keyof FilmstockFilterState>(
    key: K,
    value: FilmstockFilterState[K],
  ) {
    filters.value[key] = value
  }

  function setSearchQuery(value: string) {
    searchQuery.value = value
  }

  function resetFilters() {
    filters.value = { ...DEFAULT_FILMSTOCK_FILTERS }
    searchQuery.value = ''
  }

  return {
    filters,
    searchQuery,
    filteredFilms,
    hasActiveFilters,
    setFilter,
    setSearchQuery,
    resetFilters,
    filterGroups: FILTER_CHIP_GROUPS,
  }
}
