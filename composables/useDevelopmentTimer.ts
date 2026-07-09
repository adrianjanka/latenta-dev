import type { Entwicklungsrezept, Entwicklungsschritt } from '~/types/filmstock'

export function formatTimerDisplay(totalSeconds: number): string {
  const safe = Math.max(0, Math.ceil(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function useDevelopmentTimer(initialSeconds = 0) {
  const remaining = ref(initialSeconds)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const isComplete = ref(false)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let endTimestamp = 0
  let onCompleteCallback: (() => void) | null = null

  const display = computed(() => formatTimerDisplay(remaining.value))

  function clearTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function tick() {
    const next = Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000))
    remaining.value = next

    if (next <= 0) {
      clearTimer()
      isRunning.value = false
      isPaused.value = false
      isComplete.value = true
      onCompleteCallback?.()
    }
  }

  function start(seconds: number, onComplete?: () => void) {
    clearTimer()
    onCompleteCallback = onComplete ?? null
    remaining.value = seconds
    isComplete.value = false
    isPaused.value = false
    isRunning.value = true
    endTimestamp = Date.now() + seconds * 1000
    intervalId = setInterval(tick, 200)
    tick()
  }

  function pause() {
    if (!isRunning.value || isPaused.value) return
    clearTimer()
    isPaused.value = true
    isRunning.value = false
  }

  function resume() {
    if (!isPaused.value || isComplete.value) return
    isPaused.value = false
    isRunning.value = true
    endTimestamp = Date.now() + remaining.value * 1000
    intervalId = setInterval(tick, 200)
    tick()
  }

  function reset(seconds = initialSeconds) {
    clearTimer()
    remaining.value = seconds
    isRunning.value = false
    isPaused.value = false
    isComplete.value = false
    onCompleteCallback = null
  }

  onUnmounted(() => {
    clearTimer()
  })

  return {
    remaining,
    display,
    isRunning,
    isPaused,
    isComplete,
    start,
    pause,
    resume,
    reset,
  }
}

export function stepHasTimer(step: Entwicklungsschritt | undefined): boolean {
  return typeof step?.dauer_sekunden === 'number' && step.dauer_sekunden > 0
}

export function getStepDuration(step: Entwicklungsschritt | undefined): number {
  return stepHasTimer(step) ? step!.dauer_sekunden! : 0
}

export function formatDevelopmentTime(seconds: number): string {
  if (seconds < 60) return `${seconds} Sek.`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (rest === 0) return `${minutes} Min.`
  return `${minutes} Min. ${rest} Sek.`
}

export function formatTemperature(value: number): string {
  return `${value}°C`
}

export function getRecipeFilmLabel(recipe: Entwicklungsrezept): string {
  if (typeof recipe.filmstock === 'object' && recipe.filmstock) {
    return `${recipe.filmstock.hersteller} ${recipe.filmstock.name}`
  }
  return 'Film'
}
