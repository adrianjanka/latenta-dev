<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'

const route = useRoute()
const id = route.params.id as string

const { data, error } = await useFetch<{ data: Filmstock }>(`/api/filmstocks/${id}`)

if (error.value || !data.value?.data) {
  throw createError({ statusCode: 404, statusMessage: 'Film nicht gefunden' })
}

const film = computed(() => data.value!.data)

useSeoMeta({
  title: () => `${film.value.hersteller} ${film.value.name} – latenta.dev`,
  description: () => film.value.beschreibung?.slice(0, 160) ?? 'Filmstock-Details',
})
</script>

<template>
  <DatabaseFilmstockDetail :film="film" />
</template>
