<script setup lang="ts">
import type { Entwicklungsrezept } from '~/types/filmstock'
import { formatDevelopmentTime, formatTemperature, getRecipeFilmLabel } from '~/composables/useDevelopmentTimer'

const props = defineProps<{
  recipe: Entwicklungsrezept
}>()

const emit = defineEmits<{
  start: []
  back: []
}>()

const filmLabel = computed(() => getRecipeFilmLabel(props.recipe))
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-32 pt-6 sm:px-8">
    <button
      type="button"
      class="mb-4 inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text"
      @click="emit('back')"
    >
      ← Zurück
    </button>

    <h1 class="font-display text-[2rem] uppercase leading-none text-text">
      Übersicht
    </h1>
    <p class="mt-3 text-sm text-text-muted">
      {{ filmLabel }}
    </p>

    <div class="mt-6 space-y-4 rounded-card border border-border-strong bg-surface-elevated p-5 dark:border-border">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
          Entwickler
        </p>
        <p class="mt-1 text-lg font-bold text-text">
          {{ recipe.entwickler }} ({{ recipe.verduennung }})
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
            Temperatur
          </p>
          <p class="mt-1 font-display text-2xl text-latenta-varnish">
            {{ formatTemperature(recipe.temperatur) }}
          </p>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
            Entwicklungszeit
          </p>
          <p class="mt-1 font-display text-2xl text-latenta-varnish">
            {{ formatDevelopmentTime(recipe.zeit_sekunden) }}
          </p>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
          Agitation
        </p>
        <p class="mt-1 text-sm leading-relaxed text-text-muted">
          {{ recipe.agitation }}
        </p>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
          Schritte
        </p>
        <p class="mt-1 text-sm text-text-muted">
          {{ recipe.schritte.length }} Labor-Schritte mit Timer-Unterstützung
        </p>
      </div>

      <div class="border-t border-border pt-4">
        <p class="text-xs text-text-subtle">
          Quelle: {{ recipe.quelle }}
        </p>
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-surface from-30% to-transparent px-6 pb-7 pt-5 sm:px-8"
    >
      <div class="mx-auto max-w-lg">
        <SharedAppButton variant="primary" class="w-full" @click="emit('start')">
          Entwicklung starten
        </SharedAppButton>
      </div>
    </div>
  </div>
</template>
