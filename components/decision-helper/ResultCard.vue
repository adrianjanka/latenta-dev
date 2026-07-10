<script setup lang="ts">
import { answersToTagSlugs } from '~/data/questionnaire'
import type { QuestionnaireAnswers } from '~/data/questionnaire'
import type { FilmRecommendation } from '~/utils/recommendation'
import type { Filmstock, StimmungsTag } from '~/types/filmstock'

const props = withDefaults(
  defineProps<{
    recommendation: FilmRecommendation
    answers: QuestionnaireAnswers
    rank?: number
  }>(),
  {
    rank: 0,
  },
)

const colorBars = [
  'bg-latenta-varnish',
  'bg-latenta-sugar',
  'bg-latenta-evening',
]

function getFilmTagSlugs(film: Filmstock): string[] {
  if (!film.stimmungs_tags) return []
  return film.stimmungs_tags.map((tag) => {
    if (typeof tag === 'string') return tag
    return (tag as StimmungsTag).slug
  })
}

const displayTags = computed(() => {
  const desired = answersToTagSlugs(props.answers)
  const filmTags = getFilmTagSlugs(props.recommendation.filmstock)
  const matched = filmTags.filter(tag => desired.includes(tag))
  const tags = matched.length > 0 ? matched : filmTags
  return tags.slice(0, 3)
})

const primaryReason = computed(() => {
  if (props.recommendation.reasons.length > 0) {
    return props.recommendation.reasons[0]
  }
  return props.recommendation.filmstock.beschreibung
})
</script>

<template>
  <article
    class="overflow-hidden rounded-card bg-white text-latenta-bighorn shadow-[0_4px_14px_rgba(30,21,16,0.08)] dark:bg-latenta-subtle dark:shadow-none"
    :class="{
      'dark:opacity-90': rank === 1,
      'dark:opacity-80': rank === 2,
    }"
  >
    <div class="flex h-3.5">
      <div
        v-for="(bar, index) in colorBars"
        :key="index"
        class="flex-1"
        :class="bar"
      />
    </div>
    <div class="p-5">
      <h3 class="font-display text-xl uppercase leading-tight">
        {{ recommendation.filmstock.hersteller }}
        {{ recommendation.filmstock.name }}
      </h3>
      <p class="mt-2.5 text-[13px] leading-relaxed text-latenta-muted-light">
        {{ primaryReason }}
      </p>
      <div v-if="displayTags.length" class="mt-3.5 flex flex-wrap gap-2">
        <SharedAppTag
          v-for="tag in displayTags"
          :key="tag"
          :label="tag"
          :variant="recommendation.filmstock.typ === 's_w' ? 'category' : 'default'"
          class="!px-2.5 !py-1 !text-[11px]"
        />
      </div>
    </div>
  </article>
</template>
