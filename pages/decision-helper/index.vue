<script setup lang="ts">
import type { QuestionnaireAnswers } from '~/data/questionnaire'
import type { FilmRecommendation } from '~/utils/recommendation'

useSeoMeta({
  title: 'Film Decision Helper – latenta.dev',
  description: 'Filmempfehlung per Fragebogen oder KI-Bildanalyse.',
})

type View = 'questionnaire' | 'loading' | 'results' | 'empty'

const view = ref<View>('questionnaire')
const answers = ref<QuestionnaireAnswers | null>(null)
const recommendations = ref<FilmRecommendation[]>([])

const { getRecommendationsFromAnswers, source, error } = useFilmRecommendation()

async function handleComplete(completedAnswers: QuestionnaireAnswers) {
  answers.value = completedAnswers
  view.value = 'loading'

  try {
    const results = await getRecommendationsFromAnswers(completedAnswers)
    recommendations.value = results
    view.value = results.length > 0 ? 'results' : 'empty'
  }
  catch {
    view.value = 'empty'
  }
}

function handleRestart() {
  answers.value = null
  recommendations.value = []
  view.value = 'questionnaire'
}
</script>

<template>
  <div>
    <DecisionHelperQuestionnaireFlow
      v-if="view === 'questionnaire'"
      @complete="handleComplete"
    />

    <div
      v-else-if="view === 'loading'"
      class="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-6 text-center"
    >
      <p class="font-display text-2xl uppercase text-text">
        Filme werden gematcht…
      </p>
      <p class="mt-3 text-sm text-text-muted">
        Deine Antworten werden mit unserer Filmstock-Datenbank abgeglichen.
      </p>
    </div>

    <DecisionHelperResultList
      v-else-if="view === 'results' && answers"
      :recommendations="recommendations"
      :answers="answers"
      @restart="handleRestart"
    />

    <div
      v-else-if="view === 'empty'"
      class="mx-auto max-w-lg px-6 py-12 text-center sm:px-8"
    >
      <h2 class="font-display text-3xl uppercase text-text">
        Keine passenden Filme
      </h2>
      <p class="mt-4 text-text-muted">
        Für diese Kombination haben wir leider keine Treffer. Versuch es mit anderen Antworten.
      </p>
      <p v-if="error" class="mt-2 text-xs text-text-subtle">
        {{ error }} (Quelle: {{ source }})
      </p>
      <SharedAppButton variant="primary" class="mt-8" @click="handleRestart">
        Nochmal starten
      </SharedAppButton>
    </div>
  </div>
</template>
