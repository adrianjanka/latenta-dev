<script setup lang="ts">
defineProps<{
  display: string
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
}>()

const emit = defineEmits<{
  start: []
  pause: []
  resume: []
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div
      class="font-display text-[4.5rem] leading-none tabular-nums tracking-tight sm:text-[5.5rem]"
      :class="isComplete ? 'text-latenta-varnish' : 'text-text'"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ display }}
    </div>

    <div class="flex gap-3">
      <SharedAppButton
        v-if="!isRunning && !isPaused && !isComplete"
        variant="primary"
        size="md"
        @click="emit('start')"
      >
        Timer starten
      </SharedAppButton>

      <SharedAppButton
        v-if="isRunning"
        variant="secondary"
        size="md"
        @click="emit('pause')"
      >
        Pause
      </SharedAppButton>

      <SharedAppButton
        v-if="isPaused"
        variant="primary"
        size="md"
        @click="emit('resume')"
      >
        Fortsetzen
      </SharedAppButton>

      <p
        v-if="isComplete"
        class="text-sm font-semibold text-latenta-varnish"
      >
        Zeit abgelaufen
      </p>
    </div>
  </div>
</template>
