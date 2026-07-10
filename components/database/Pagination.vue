<script setup lang="ts">
defineProps<{
  page: number
  totalPages: number
  rangeLabel: string
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <div
    v-if="totalPages > 1"
    class="mt-10 flex flex-col items-center gap-4"
  >
    <p class="text-center text-sm text-text-muted">
      {{ rangeLabel }}
    </p>
    <div class="flex items-center justify-center gap-3">
      <SharedAppButton
        variant="secondary"
        size="md"
        :disabled="page <= 1"
        @click="emit('prev')"
      >
        Zurück
      </SharedAppButton>
      <span class="min-w-[4rem] text-center text-sm font-semibold text-text">
        {{ page }} / {{ totalPages }}
      </span>
      <SharedAppButton
        variant="secondary"
        size="md"
        :disabled="page >= totalPages"
        @click="emit('next')"
      >
        Weiter
      </SharedAppButton>
    </div>
  </div>
</template>
