<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'

defineProps<{
  films: Filmstock[]
}>()
</script>

<template>
  <div class="grid auto-rows-fr grid-cols-2 gap-4">
    <NuxtLink
      v-for="(film, index) in films"
      :key="film.id"
      :to="`/database/${film.id}`"
      class="group motion-stagger flex h-full transition duration-200 hover:-translate-y-0.5 hover:opacity-95"
      :style="{ '--stagger': Math.min(index, 11) }"
    >
      <SharedAppCard :film="film" compact class="h-full w-full" />
    </NuxtLink>
  </div>
</template>
