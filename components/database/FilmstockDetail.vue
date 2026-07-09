<script setup lang="ts">
import type { Filmstock, StimmungsTag } from '~/types/filmstock'

const props = defineProps<{
  film: Filmstock
}>()

const tagLabels = computed(() => {
  if (!props.film.stimmungs_tags) return []
  return props.film.stimmungs_tags.map((tag) => {
    if (typeof tag === 'string') return tag
    return (tag as StimmungsTag).slug
  })
})
</script>

<template>
  <div class="mx-auto max-w-lg px-6 pb-12 pt-6 sm:max-w-xl sm:px-8">
    <NuxtLink
      to="/database"
      class="mb-6 inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text"
    >
      ← Zurück zur Übersicht
    </NuxtLink>

    <SharedAppCard :film="film" :tags="tagLabels" />

    <div v-if="film.beschreibung" class="mt-6">
      <h2 class="font-display text-lg uppercase text-text">
        Beschreibung
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-text-muted">
        {{ film.beschreibung }}
      </p>
    </div>

    <div v-if="film.farbcharakter" class="mt-6">
      <h2 class="font-display text-lg uppercase text-text">
        Farbcharakter
      </h2>
      <p class="mt-2 text-sm text-text-muted">
        {{ film.farbcharakter }}
      </p>
    </div>
  </div>
</template>
