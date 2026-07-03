<script setup lang="ts">
const navItems = [
  { label: 'Film Decision Helper', to: '/decision-helper' },
  { label: 'Filmstock-Datenbank', to: '/database' },
  { label: 'Entwicklungsassistent', to: '/development' },
]
</script>

<template>
  <header class="border-b border-stone-200 bg-stone-50">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="text-lg font-semibold tracking-tight text-stone-900">
        Frame &amp; Grain
      </NuxtLink>

      <nav class="hidden gap-6 sm:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="text-sm text-stone-600 transition hover:text-stone-900"
          active-class="!text-stone-900 font-medium"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
