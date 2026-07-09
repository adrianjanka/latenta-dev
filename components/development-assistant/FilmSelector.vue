<script setup lang="ts">
import type { Filmstock, FilmTyp } from '~/types/filmstock'

const props = defineProps<{
  films: Filmstock[]
  filmIdsWithRecipes: string[]
}>()

const emit = defineEmits<{
  select: [film: Filmstock]
}>()

type TypFilter = 'all' | FilmTyp

const typFilter = ref<TypFilter>('all')

const recipeFilmIdSet = computed(() => new Set(props.filmIdsWithRecipes))

const filteredFilms = computed(() => {
  const list = typFilter.value === 'all'
    ? props.films
    : props.films.filter(film => film.typ === typFilter.value)

  return [...list].sort((a, b) => {
    const aHas = recipeFilmIdSet.value.has(a.id)
    const bHas = recipeFilmIdSet.value.has(b.id)
    if (aHas === bHas) return 0
    return aHas ? -1 : 1
  })
})

function hasRecipes(filmId: string): boolean {
  return recipeFilmIdSet.value.has(filmId)
}

const chips: { value: TypFilter, label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'farbe', label: 'Farbe' },
  { value: 's_w', label: 'S/W' },
]
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-12 pt-6 sm:px-8">
    <h1 class="font-display text-[2rem] uppercase leading-none text-text">
      Film wählen
    </h1>
    <p class="mt-3 text-sm text-text-muted">
      Welchen Film entwickelst du heute?
    </p>

    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="chip in chips"
        :key="chip.value"
        type="button"
        class="shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition"
        :class="
          typFilter === chip.value
            ? 'bg-latenta-varnish text-latenta-subtle'
            : 'border border-border-strong bg-white text-text dark:bg-surface-elevated dark:text-text'
        "
        @click="typFilter = chip.value"
      >
        {{ chip.label }}
      </button>
    </div>

    <div class="mt-5 flex flex-col gap-3">
      <button
        v-for="film in filteredFilms"
        :key="film.id"
        type="button"
        class="flex w-full items-center justify-between rounded-card border-[1.5px] p-4 text-left transition"
        :class="
          hasRecipes(film.id)
            ? 'border-border-strong bg-surface-elevated hover:opacity-90 dark:border-border'
            : 'cursor-not-allowed border-border bg-surface-elevated/50 opacity-50'
        "
        :disabled="!hasRecipes(film.id)"
        @click="hasRecipes(film.id) && emit('select', film)"
      >
        <span>
          <span
            class="block text-xs font-semibold uppercase tracking-wide"
            :class="hasRecipes(film.id) ? 'text-text-subtle' : 'text-text-subtle/70'"
          >
            {{ film.hersteller }}
          </span>
          <span
            class="mt-0.5 block text-lg font-bold"
            :class="hasRecipes(film.id) ? 'text-text' : 'text-text-muted'"
          >
            {{ film.name }}
          </span>
          <span class="mt-1 block text-sm text-text-muted">
            <template v-if="hasRecipes(film.id)">
              ISO {{ film.iso }} · {{ film.typ === 's_w' ? 'S/W' : 'Farbe' }}
            </template>
            <template v-else>
              Noch kein Rezept verfügbar
            </template>
          </span>
        </span>
        <span
          v-if="hasRecipes(film.id)"
          class="text-text-muted"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </div>

    <p v-if="filteredFilms.length === 0" class="mt-8 text-center text-sm text-text-muted">
      Keine Filme für diesen Filter.
    </p>
  </div>
</template>
