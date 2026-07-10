<script setup lang="ts">
import type { QuestionnaireAnswers } from '~/data/questionnaire'
import type { FilmRecommendation } from '~/utils/recommendation'

defineProps<{
  recommendations: FilmRecommendation[]
  answers: QuestionnaireAnswers
}>()

const emit = defineEmits<{
  restart: []
}>()
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-16 pt-8 sm:px-8 sm:pt-10">
    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-latenta-varnish dark:text-text-muted">
      Deine Empfehlung
    </p>
    <h2 class="mt-3 font-display text-4xl uppercase leading-none text-text">
      Top 3 Filme
    </h2>

    <div class="mt-8 flex flex-col gap-5">
      <DecisionHelperResultCard
        v-for="(rec, index) in recommendations"
        :key="rec.filmstock.id"
        :recommendation="rec"
        :answers="answers"
        :rank="index"
      />
    </div>

    <div class="mt-10 flex flex-col gap-3.5">
      <SharedAppButton to="/database" variant="secondary" class="w-full">
        Zur Datenbank
      </SharedAppButton>
      <SharedAppButton variant="secondary" class="w-full" @click="emit('restart')">
        Nochmal starten
      </SharedAppButton>
    </div>
  </div>
</template>
