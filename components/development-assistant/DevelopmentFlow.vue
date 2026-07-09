<script setup lang="ts">
import type { Entwicklungsrezept, Filmstock } from '~/types/filmstock'
import { stepHasTimer, useDevelopmentTimer } from '~/composables/useDevelopmentTimer'

const props = defineProps<{
  films: Filmstock[]
  filmIdsWithRecipes: string[]
}>()

const {
  view,
  selectedFilm,
  selectedRecipe,
  currentStepIndex,
  totalSteps,
  currentStep,
  isTimerStep,
  currentStepDuration,
  isLastStep,
  selectFilm,
  selectRecipe,
  startDevelopment,
  nextStep,
  backFromRecipe,
  backFromOverview,
  reset,
} = useDevelopmentFlow()

const recipes = ref<Entwicklungsrezept[]>([])
const recipesPending = ref(false)
const recipesError = ref(false)

const timer = useDevelopmentTimer()

let wakeLock: WakeLockSentinel | null = null

const filmLabel = computed(() => {
  if (!selectedFilm.value) return ''
  return `${selectedFilm.value.hersteller} ${selectedFilm.value.name}`
})

const canProceed = computed(() => {
  if (!currentStep.value) return false
  if (!stepHasTimer(currentStep.value)) return true
  return timer.isComplete.value
})

async function loadRecipes(filmId: string) {
  recipesPending.value = true
  recipesError.value = false
  try {
    const response = await $fetch<{ data: Entwicklungsrezept[] }>(
      `/api/development-recipes/by-film/${filmId}`,
    )
    recipes.value = response.data
  }
  catch {
    recipesError.value = true
    recipes.value = []
  }
  finally {
    recipesPending.value = false
  }
}

async function requestWakeLock() {
  if (!import.meta.client || !('wakeLock' in navigator)) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
  }
  catch {
    wakeLock = null
  }
}

function releaseWakeLock() {
  wakeLock?.release()
  wakeLock = null
}

function onTimerComplete() {
  if (import.meta.client && 'vibrate' in navigator) {
    navigator.vibrate([200, 100, 200])
  }
  releaseWakeLock()
}

function handleSelectFilm(film: Filmstock) {
  selectFilm(film)
  loadRecipes(film.id)
}

function handleStartDevelopment() {
  timer.reset()
  startDevelopment()
}

function handleStartTimer() {
  if (!currentStep.value || !isTimerStep.value) return
  timer.start(currentStepDuration.value, onTimerComplete)
  requestWakeLock()
}

function handleNextStep() {
  timer.reset()
  releaseWakeLock()
  nextStep()
}

function handleReset() {
  timer.reset()
  releaseWakeLock()
  recipes.value = []
  reset()
}

watch(currentStepIndex, () => {
  timer.reset()
  releaseWakeLock()
})

onUnmounted(() => {
  releaseWakeLock()
})
</script>

<template>
  <div>
    <DevelopmentAssistantFilmSelector
      v-if="view === 'select-film'"
      :films="films"
      :film-ids-with-recipes="filmIdsWithRecipes"
      @select="handleSelectFilm"
    />

    <div
      v-else-if="view === 'select-recipe'"
      class="relative"
    >
      <div
        v-if="recipesPending"
        class="mx-auto max-w-lg px-6 py-12 text-center text-sm text-text-muted"
      >
        Rezepte werden geladen…
      </div>
      <div
        v-else-if="recipesError"
        class="mx-auto max-w-lg px-6 py-12 text-center text-sm text-text-muted"
      >
        Rezepte konnten nicht geladen werden.
        <button
          type="button"
          class="mt-4 block w-full text-latenta-varnish"
          @click="backFromRecipe"
        >
          Zurück
        </button>
      </div>
      <DevelopmentAssistantRecipeSelector
        v-else
        :film-label="filmLabel"
        :recipes="recipes"
        @select="selectRecipe"
        @back="backFromRecipe"
      />
    </div>

    <DevelopmentAssistantRecipeOverview
      v-else-if="view === 'overview' && selectedRecipe"
      :recipe="selectedRecipe"
      @start="handleStartDevelopment"
      @back="backFromOverview"
    />

    <div v-else-if="view === 'running' && currentStep">
      <div class="mx-auto max-w-lg space-y-3 px-6 pt-4 sm:px-8">
        <SharedAppButton
          variant="secondary"
          size="md"
          class="w-full"
          @click="handleReset"
        >
          Entwicklung abbrechen
        </SharedAppButton>
        <p class="text-xs text-text-subtle">
          {{ filmLabel }} · {{ selectedRecipe?.entwickler }}
        </p>
      </div>

      <DevelopmentAssistantDevelopmentStep
        :step="currentStep"
        :step-index="currentStepIndex"
        :total-steps="totalSteps"
        :display="timer.display.value"
        :is-running="timer.isRunning.value"
        :is-paused="timer.isPaused.value"
        :is-complete="timer.isComplete.value"
        :can-proceed="canProceed"
        @start-timer="handleStartTimer"
        @pause-timer="timer.pause"
        @resume-timer="timer.resume"
        @next="handleNextStep"
        @skip="handleNextStep"
      />
    </div>

    <div
      v-else-if="view === 'complete' && selectedRecipe"
      class="mx-auto max-w-lg px-6 py-12 text-center sm:px-8"
    >
      <h2 class="font-display text-3xl uppercase text-text">
        Fertig!
      </h2>
      <p class="mt-4 text-text-muted">
        Die Entwicklung von {{ filmLabel }} ist abgeschlossen. Häng den Film zum Trocknen auf.
      </p>
      <p class="mt-4 text-xs text-text-subtle">
        Quelle: {{ selectedRecipe.quelle }}
      </p>
      <SharedAppButton variant="primary" class="mt-8 w-full" @click="handleReset">
        Neue Entwicklung
      </SharedAppButton>
    </div>
  </div>
</template>
