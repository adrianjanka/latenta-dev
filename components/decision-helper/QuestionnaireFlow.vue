<script setup lang="ts">
import type { QuestionnaireAnswers } from '~/data/questionnaire'

const emit = defineEmits<{
  complete: [answers: QuestionnaireAnswers]
}>()

const {
  currentStep,
  totalSteps,
  currentQuestion,
  answers,
  canProceed,
  selectAnswer,
  nextStep,
  prevStep,
  getCompleteAnswers,
  initDefaults,
} = useQuestionnaire()

onMounted(() => {
  initDefaults()
})

const selectedValue = computed(() => {
  const q = currentQuestion.value
  if (!q) return undefined
  return answers.value[q.id] as string | undefined
})

function handleSelect(value: string) {
  const q = currentQuestion.value
  if (!q) return
  selectAnswer(q.id, value as QuestionnaireAnswers[typeof q.id])
}

function handleNext() {
  if (!canProceed.value) return

  if (currentStep.value < totalSteps) {
    nextStep()
    return
  }

  const complete = getCompleteAnswers()
  if (complete) {
    emit('complete', complete)
  }
}
</script>

<template>
  <DecisionHelperQuestionStep
    v-if="currentQuestion"
    :key="currentStep"
    class="motion-fade-up"
    :step="currentStep"
    :total-steps="totalSteps"
    :question="currentQuestion"
    :selected-value="selectedValue"
    :can-proceed="canProceed"
    :show-back="currentStep > 1"
    @select="handleSelect"
    @next="handleNext"
    @back="prevStep"
  />
</template>
