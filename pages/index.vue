<script setup lang="ts">
useSeoMeta({
  title: 'Frame & Grain – Analogfotografie',
  description: 'Filmempfehlung, Filmstock-Datenbank und Entwicklungsassistent für Analogfotograf:innen.',
})

const features = [
  {
    title: 'Film Decision Helper',
    description: 'Finde den passenden Film per Fragebogen oder KI-Bildanalyse.',
    to: '/decision-helper',
    badge: 'Weg A + B',
  },
  {
    title: 'Filmstock-Datenbank',
    description: 'Charakterkarten, Filter und Vergleichsmodus für Analogfilme.',
    to: '/database',
    badge: 'Datenbank',
  },
  {
    title: 'Entwicklungsassistent',
    description: 'Schritt-für-Schritt-Laborbegleitung mit Timer – mobil optimiert.',
    to: '/development',
    badge: 'Labor',
  },
]
</script>

<template>
  <div>
    <section class="border-b border-stone-200 bg-stone-900 px-4 py-16 text-stone-50 sm:px-6">
      <div class="mx-auto max-w-5xl">
        <p class="mb-3 text-sm uppercase tracking-widest text-stone-400">
          Analogfotografie
        </p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
          Frame &amp; Grain
        </h1>
        <p class="mt-4 max-w-2xl text-lg text-stone-300">
          Dein Begleiter für Filmwahl, Filmstock-Recherche und Entwicklung im Dunkelkammer-Labor.
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="feature in features"
          :key="feature.to"
          :to="feature.to"
          class="group rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-stone-300 hover:shadow-md"
        >
          <span class="inline-block rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            {{ feature.badge }}
          </span>
          <h2 class="mt-4 text-xl font-semibold text-stone-900 group-hover:text-stone-700">
            {{ feature.title }}
          </h2>
          <p class="mt-2 text-sm text-stone-600">
            {{ feature.description }}
          </p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
