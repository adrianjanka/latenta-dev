<script setup lang="ts">
import type { Entwicklungsschritt } from '~/types/filmstock'
import { stepHasTimer } from '~/composables/useDevelopmentTimer'

const props = defineProps<{
  step: Entwicklungsschritt
  stepIndex: number
  totalSteps: number
  display: string
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  canProceed: boolean
}>()

const emit = defineEmits<{
  startTimer: []
  pauseTimer: []
  resumeTimer: []
  next: []
  skip: []
}>()

const hasTimer = computed(() => stepHasTimer(props.step))
</script>

<template>
  <div class="flex min-h-[calc(100vh-8rem)] flex-col">
    <div class="mx-auto w-full max-w-lg flex-1 px-6 pb-32 pt-6 sm:px-8">
      <SharedStepIndicator :current="stepIndex + 1" :total="totalSteps" />

      <h2 class="mt-5 font-display text-3xl uppercase leading-none text-text">
        {{ step.titel }}
      </h2>

      <p class="mt-4 text-base leading-relaxed text-text-muted">
        {{ step.beschreibung }}
      </p>

      <button
        type="button"
        class="mt-5 text-sm text-text-muted underline-offset-2 transition hover:text-text hover:underline"
        @click="emit('skip')"
      >
        Schritt überspringen
      </button>

      <div v-if="hasTimer" class="mt-8">
        <DevelopmentAssistantDevelopmentTimer
          :display="display"
          :is-running="isRunning"
          :is-paused="isPaused"
          :is-complete="isComplete"
          @start="emit('startTimer')"
          @pause="emit('pauseTimer')"
          @resume="emit('resumeTimer')"
        />
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-surface from-30% to-transparent px-6 pb-7 pt-5 sm:px-8"
    >
      <div class="mx-auto flex max-w-lg gap-3">
        <SharedAppButton
          variant="primary"
          class="flex-1"
          :disabled="!canProceed"
          @click="emit('next')"
        >
          {{ stepIndex >= totalSteps - 1 ? 'Abschliessen' : 'Nächster Schritt' }}
        </SharedAppButton>
      </div>
    </div>
  </div>
</template>
