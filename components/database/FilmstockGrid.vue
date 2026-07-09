<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'

defineProps<{
  films: Filmstock[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-3 auto-rows-fr">
    <NuxtLink
      v-for="film in films"
      :key="film.id"
      :to="`/database/${film.id}`"
      class="flex h-full transition hover:opacity-90"
    >
      <SharedAppCard :film="film" compact class="h-full w-full" />
    </NuxtLink>
  </div>
</template>
