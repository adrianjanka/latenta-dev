<script setup lang="ts">
useSeoMeta({
  title: 'Filmstock-Datenbank – latenta.dev',
  description: 'Charakterkarten, Filter und Vergleichsmodus für Analogfilme.',
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 class="text-3xl font-bold text-stone-900">
      Filmstock-Datenbank
    </h1>
    <p class="mt-4 text-stone-600">
      Hier entstehen Charakterkarten, Filter und der Vergleichsmodus.
    </p>
    <NuxtLink
      to="/"
      class="mt-8 inline-block text-sm text-stone-500 hover:text-stone-900"
    >
      ← Zurück zur Startseite
    </NuxtLink>
  </div>
</template>
