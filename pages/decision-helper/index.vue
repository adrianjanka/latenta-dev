<script setup lang="ts">
useSeoMeta({
  title: 'Film Decision Helper – Frame & Grain',
  description: 'Filmempfehlung per Fragebogen oder KI-Bildanalyse.',
})
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 class="text-3xl font-bold text-stone-900">
      Film Decision Helper
    </h1>
    <p class="mt-4 text-stone-600">
      Hier entsteht der Fragebogen (Weg A) und die KI-Bildanalyse (Weg B).
    </p>
    <NuxtLink
      to="/"
      class="mt-8 inline-block text-sm text-stone-500 hover:text-stone-900"
    >
      ← Zurück zur Startseite
    </NuxtLink>
  </div>
</template>
