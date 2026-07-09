import type { Entwicklungsrezept, Filmstock } from '~/types/filmstock'
import { getStepDuration, stepHasTimer } from '~/composables/useDevelopmentTimer'

export type DevelopmentView =
  | 'select-film'
  | 'select-recipe'
  | 'overview'
  | 'running'
  | 'complete'

export function useDevelopmentFlow() {
  const view = ref<DevelopmentView>('select-film')
  const selectedFilm = ref<Filmstock | null>(null)
  const selectedRecipe = ref<Entwicklungsrezept | null>(null)
  const currentStepIndex = ref(0)

  const steps = computed(() => selectedRecipe.value?.schritte ?? [])
  const totalSteps = computed(() => steps.value.length)
  const currentStep = computed(() => steps.value[currentStepIndex.value])
  const isTimerStep = computed(() => stepHasTimer(currentStep.value))
  const currentStepDuration = computed(() => getStepDuration(currentStep.value))
  const isLastStep = computed(() => currentStepIndex.value >= totalSteps.value - 1)

  const recipeMeta = computed(() => {
    const recipe = selectedRecipe.value
    if (!recipe) return null
    return {
      entwickler: recipe.entwickler,
      verduennung: recipe.verduennung,
      temperatur: recipe.temperatur,
      zeit_sekunden: recipe.zeit_sekunden,
      agitation: recipe.agitation,
      quelle: recipe.quelle,
    }
  })

  function selectFilm(film: Filmstock) {
    selectedFilm.value = film
    selectedRecipe.value = null
    currentStepIndex.value = 0
    view.value = 'select-recipe'
  }

  function selectRecipe(recipe: Entwicklungsrezept) {
    selectedRecipe.value = recipe
    currentStepIndex.value = 0
    view.value = 'overview'
  }

  function startDevelopment() {
    currentStepIndex.value = 0
    view.value = 'running'
  }

  function nextStep() {
    if (isLastStep.value) {
      view.value = 'complete'
      return
    }
    currentStepIndex.value += 1
  }

  function prevStep() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value -= 1
    }
  }

  function backFromRecipe() {
    selectedRecipe.value = null
    view.value = 'select-film'
  }

  function backFromOverview() {
    view.value = 'select-recipe'
  }

  function reset() {
    view.value = 'select-film'
    selectedFilm.value = null
    selectedRecipe.value = null
    currentStepIndex.value = 0
  }

  return {
    view,
    selectedFilm,
    selectedRecipe,
    currentStepIndex,
    steps,
    totalSteps,
    currentStep,
    isTimerStep,
    currentStepDuration,
    isLastStep,
    recipeMeta,
    selectFilm,
    selectRecipe,
    startDevelopment,
    nextStep,
    prevStep,
    backFromRecipe,
    backFromOverview,
    reset,
  }
}
