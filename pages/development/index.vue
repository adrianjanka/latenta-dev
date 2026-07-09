<script setup lang="ts">
import type { Entwicklungsrezept, Filmstock } from '~/types/filmstock'

useSeoMeta({
  title: 'Entwicklungsassistent – latenta.dev',
  description: 'Schritt-für-Schritt-Laborbegleitung mit Timer.',
})

function getFilmstockId(recipe: Entwicklungsrezept): string {
  if (typeof recipe.filmstock === 'string') return recipe.filmstock
  return recipe.filmstock.id
}

const { data, pending, error } = await useFetch<{ data: Filmstock[], source: string }>('/api/filmstocks')
const { data: recipesData } = await useFetch<{ data: Entwicklungsrezept[] }>('/api/development-recipes')

const films = computed(() => data.value?.data ?? [])
const source = computed(() => data.value?.source ?? 'mock')

const filmIdsWithRecipes = computed(() =>
  [...new Set((recipesData.value?.data ?? []).map(getFilmstockId))],
)
</script>

<template>
  <div>
    <div v-if="pending" class="mx-auto max-w-lg px-6 py-12 text-center text-sm text-text-muted">
      Filme werden geladen…
    </div>

    <div v-else-if="error" class="mx-auto max-w-lg px-6 py-12 text-center text-sm text-text-muted">
      Filme konnten nicht geladen werden.
    </div>

    <DevelopmentAssistantDevelopmentFlow
      v-else
      :films="films"
      :film-ids-with-recipes="filmIdsWithRecipes"
    />

    <p
      v-if="source === 'mock' && !pending"
      class="mx-auto max-w-lg px-6 pb-8 text-center text-xs text-text-subtle"
    >
      Mock-Daten (Directus nicht erreichbar)
    </p>
  </div>
</template>
