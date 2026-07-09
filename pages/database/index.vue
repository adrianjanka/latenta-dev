<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'
import type { FilmstockFilterState } from '~/composables/useFilmstockFilters'

useSeoMeta({
  title: 'Filmstock-Datenbank – latenta.dev',
  description: 'Charakterkarten, Filter und Vergleichsmodus für Analogfilme.',
})

const PER_PAGE = 12

const { data, pending, error } = await useFetch<{ data: Filmstock[], source: string }>('/api/filmstocks')

const films = computed(() => data.value?.data ?? [])
const source = computed(() => data.value?.source ?? 'mock')

const {
  filters,
  searchQuery,
  filteredFilms,
  setFilter,
} = useFilmstockFilters(films)

const {
  page,
  totalPages,
  paginatedItems,
  rangeLabel,
  nextPage,
  prevPage,
} = usePagination(filteredFilms, PER_PAGE)

function handleFilterChange(key: keyof FilmstockFilterState, value: string) {
  setFilter(key, value as FilmstockFilterState[typeof key])
}
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-12 pt-6 sm:max-w-xl sm:px-8">
    <h1 class="font-display text-[2rem] uppercase leading-none text-text sm:text-[2rem]">
      Filmstocks
    </h1>

    <div class="mt-3.5 space-y-3">
      <DatabaseFilterChips
        :filters="filters"
        @change="handleFilterChange"
      />
      <DatabaseSearchField v-model="searchQuery" />
    </div>

    <div v-if="pending" class="mt-10 text-center text-sm text-text-muted">
      Filme werden geladen…
    </div>

    <div v-else-if="error" class="mt-10 text-center text-sm text-text-muted">
      Filme konnten nicht geladen werden.
    </div>

    <div v-else-if="filteredFilms.length === 0" class="mt-10 text-center text-sm text-text-muted">
      Keine Filme für diese Suche oder Filterkombination.
    </div>

    <template v-else>
      <div class="mt-4">
        <DatabaseFilmstockGrid :films="paginatedItems" />
      </div>

      <DatabasePagination
        :page="page"
        :total-pages="totalPages"
        :range-label="rangeLabel"
        @prev="prevPage"
        @next="nextPage"
      />
    </template>

    <p v-if="source === 'mock' && !pending" class="mt-6 text-center text-xs text-text-subtle">
      Mock-Daten (Directus nicht erreichbar)
    </p>
  </div>
</template>
