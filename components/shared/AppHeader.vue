<script setup lang="ts">
const navItems = [
  { label: 'Film Decision Helper', to: '/decision-helper' },
  { label: 'Filmstock-Datenbank', to: '/database' },
  { label: 'Entwicklungsassistent', to: '/development' },
]

const mobileOpen = ref(false)
</script>

<template>
  <header class="border-b border-border bg-surface">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
      <NuxtLink
        to="/"
        class="font-display text-lg uppercase tracking-tight text-text sm:text-xl"
        @click="mobileOpen = false"
      >
        latenta.dev
      </NuxtLink>

      <div class="flex items-center gap-2 sm:gap-4">
        <nav class="hidden gap-6 md:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="text-sm text-text-muted transition hover:text-text"
            active-class="!text-text font-semibold"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <SharedThemeToggle />

        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-text md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Navigation öffnen"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              v-if="!mobileOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <nav
      v-if="mobileOpen"
      class="border-t border-border px-4 py-3 md:hidden"
    >
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="block rounded-lg px-3 py-3 text-sm text-text-muted transition hover:bg-surface-elevated hover:text-text"
        active-class="!text-text font-semibold bg-surface-elevated"
        @click="mobileOpen = false"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
