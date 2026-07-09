import type { QuestionnaireAnswers } from '~/data/questionnaire'
import { QUESTIONNAIRE_QUESTIONS } from '~/data/questionnaire'

export function useQuestionnaire() {
  const currentStep = ref(1)
  const answers = ref<Partial<QuestionnaireAnswers>>({})

  const totalSteps = QUESTIONNAIRE_QUESTIONS.length

  const currentQuestion = computed(
    () => QUESTIONNAIRE_QUESTIONS[currentStep.value - 1],
  )

  const canProceed = computed(() => {
    const question = currentQuestion.value
    if (!question) return false
    return answers.value[question.id] !== undefined
  })

  const isComplete = computed(() => {
    return QUESTIONNAIRE_QUESTIONS.every(
      q => answers.value[q.id] !== undefined,
    )
  })

  function selectAnswer<K extends keyof QuestionnaireAnswers>(
    questionId: K,
    value: QuestionnaireAnswers[K],
  ) {
    answers.value[questionId] = value
  }

  function nextStep() {
    if (currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function reset() {
    currentStep.value = 1
    answers.value = {}
    initDefaults()
  }

  function initDefaults() {
    const formatQuestion = QUESTIONNAIRE_QUESTIONS.find(q => q.id === 'format')
    if (formatQuestion?.options.length === 1) {
      answers.value.format = formatQuestion.options[0].value as QuestionnaireAnswers['format']
    }
  }

  function getCompleteAnswers(): QuestionnaireAnswers | null {
    if (!isComplete.value) return null
    return answers.value as QuestionnaireAnswers
  }

  onMounted(() => {
    initDefaults()
  })

  return {
    currentStep,
    totalSteps,
    answers,
    currentQuestion,
    canProceed,
    isComplete,
    selectAnswer,
    nextStep,
    prevStep,
    reset,
    getCompleteAnswers,
    initDefaults,
  }
}
