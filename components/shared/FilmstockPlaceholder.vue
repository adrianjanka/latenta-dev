<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'

defineProps<{
  film: Pick<Filmstock, 'name' | 'hersteller' | 'iso' | 'typ' | 'koernung' | 'kontrast' | 'farbcharakter'>
  reasons?: string[]
}>()
</script>

<template>
  <SharedAppCard :film="film" :reasons="reasons" />
</template>
