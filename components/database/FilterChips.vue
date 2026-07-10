<script setup lang="ts">
import type { FilmstockFilterState } from '~/composables/useFilmstockFilters'
import { FILTER_CHIP_GROUPS } from '~/composables/useFilmstockFilters'

defineProps<{
  filters: FilmstockFilterState
}>()

const emit = defineEmits<{
  change: [key: keyof FilmstockFilterState, value: string]
  reset: []
}>()
</script>

<template>
  <div class="space-y-5">
    <div
      v-for="group in FILTER_CHIP_GROUPS"
      :key="group.id"
      class="space-y-2.5"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-text-subtle">
        {{ group.label }}
      </p>
      <div class="flex flex-wrap gap-2.5">
        <button
          v-for="chip in group.chips"
          :key="chip.value"
          type="button"
          class="shrink-0 rounded-full px-4 py-2.5 text-[13px] font-semibold transition"
          :class="
            filters[group.id] === chip.value
              ? 'bg-latenta-varnish text-latenta-subtle'
              : 'border border-border-strong bg-white text-text dark:bg-surface-elevated dark:text-text'
          "
          @click="emit('change', group.id, chip.value)"
        >
          {{ chip.label }}
        </button>
      </div>
    </div>
  </div>
</template>
