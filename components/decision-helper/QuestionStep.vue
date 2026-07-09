<script setup lang="ts">
import type { QuestionnaireQuestion } from '~/data/questionnaire'

const props = defineProps<{
  step: number
  totalSteps: number
  question: QuestionnaireQuestion
  selectedValue?: string
  canProceed: boolean
  showBack: boolean
}>()

const emit = defineEmits<{
  select: [value: string]
  next: []
  back: []
}>()
</script>

<template>
  <div class="flex min-h-[calc(100vh-8rem)] flex-col">
    <div class="mx-auto w-full max-w-lg flex-1 px-6 pb-32 pt-6 sm:px-8">
      <SharedStepIndicator :current="step" :total="totalSteps" />

      <h2 class="mt-5 font-display text-3xl uppercase leading-none text-text">
        {{ question.question }}
      </h2>

      <p v-if="question.hint" class="mt-3 text-sm text-text-muted">
        {{ question.hint }}
      </p>

      <div class="mt-6 flex flex-col gap-3.5">
        <DecisionHelperOptionCard
          v-for="option in question.options"
          :key="option.value"
          :label="option.label"
          :description="option.description"
          :selected="selectedValue === option.value"
          @select="emit('select', option.value)"
        />
      </div>
    </div>

    <div
      class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-surface from-30% to-transparent px-6 pb-7 pt-5 sm:px-8"
    >
      <div class="mx-auto flex max-w-lg gap-3">
        <SharedAppButton
          v-if="showBack"
          variant="secondary"
          class="shrink-0"
          @click="emit('back')"
        >
          Zurück
        </SharedAppButton>
        <SharedAppButton
          variant="primary"
          class="flex-1"
          :disabled="!canProceed"
          @click="emit('next')"
        >
          Weiter
        </SharedAppButton>
      </div>
    </div>
  </div>
</template>
