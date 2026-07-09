<script setup lang="ts">
import type { Entwicklungsrezept } from '~/types/filmstock'
import { formatDevelopmentTime, formatTemperature } from '~/composables/useDevelopmentTimer'

defineProps<{
  filmLabel: string
  recipes: Entwicklungsrezept[]
}>()

const emit = defineEmits<{
  select: [recipe: Entwicklungsrezept]
  back: []
}>()
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-12 pt-6 sm:px-8">
    <button
      type="button"
      class="mb-4 inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text"
      @click="emit('back')"
    >
      ← Zurück
    </button>

    <h1 class="font-display text-[2rem] uppercase leading-none text-text">
      Rezept wählen
    </h1>
    <p class="mt-3 text-sm text-text-muted">
      {{ filmLabel }}
    </p>

    <div class="mt-5 flex flex-col gap-3">
      <button
        v-for="recipe in recipes"
        :key="recipe.id"
        type="button"
        class="flex w-full flex-col rounded-card border-[1.5px] border-border-strong bg-surface-elevated p-4 text-left transition hover:opacity-90 dark:border-border"
        @click="emit('select', recipe)"
      >
        <span class="text-lg font-bold text-text">
          {{ recipe.entwickler }}
        </span>
        <span class="mt-1 text-sm text-text-muted">
          {{ recipe.verduennung }} · {{ formatTemperature(recipe.temperatur) }} · {{ formatDevelopmentTime(recipe.zeit_sekunden) }}
        </span>
        <span class="mt-2 text-xs text-text-subtle">
          Quelle: {{ recipe.quelle }}
        </span>
      </button>
    </div>

    <p v-if="recipes.length === 0" class="mt-8 text-center text-sm text-text-muted">
      Für diesen Film liegt noch kein Rezept vor.
    </p>
  </div>
</template>
