<script setup lang="ts">
useSeoMeta({
  title: 'latenta.dev – Analogfotografie',
  description: 'Filmempfehlung, Filmstock-Datenbank und Entwicklungsassistent für Analogfotograf:innen.',
})

const features = [
  {
    title: 'Filmstock-Datenbank',
    description: 'Alle Filme durchstöbern & vergleichen',
    to: '/database',
    iconClass: 'bg-latenta-evening',
  },
  {
    title: 'Entwicklungsassistent',
    description: 'Schritt-für-Schritt-Timer fürs Labor',
    to: '/development',
    iconClass: 'bg-latenta-sugar dark:bg-latenta-sugar',
  },
]
</script>

<template>
  <div class="motion-fade-up mx-auto max-w-lg px-6 pb-16 pt-10 sm:max-w-xl sm:px-8 sm:pt-14">
    <p class="text-xs font-semibold uppercase tracking-[0.15em] text-latenta-varnish dark:text-text-muted">
      latenta.dev
    </p>

    <h1 class="mt-5 font-display text-[2.75rem] uppercase leading-[0.95] text-text sm:text-5xl">
      Finde deinen<br>ersten Film.
    </h1>

    <p class="mt-5 text-[15px] leading-relaxed text-text-muted">
      6 Fragen. Drei Empfehlungen. Kein Rätselraten in der Dunkelkammer.
    </p>

    <SharedAppButton to="/decision-helper" variant="primary" class="mt-8 w-full">
      Fragebogen starten
    </SharedAppButton>

    <div class="mt-6 flex flex-col gap-4">
      <NuxtLink
        v-for="(feature, index) in features"
        :key="feature.to"
        :to="feature.to"
        class="motion-stagger flex items-center gap-4 rounded-card border border-border bg-surface-elevated p-5 shadow-sm transition duration-200 hover:border-border-strong hover:-translate-y-0.5 dark:shadow-none"
        :style="{ '--stagger': index + 1 }"
      >
        <div
          class="h-11 w-11 shrink-0 rounded-lg"
          :class="feature.iconClass"
        />
        <div>
          <div class="text-[15px] font-bold text-text">
            {{ feature.title }}
          </div>
          <div class="mt-1 text-[13px] text-text-muted">
            {{ feature.description }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
