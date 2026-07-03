<script setup lang="ts">
import type { Filmstock } from '~/types/filmstock'

defineProps<{
  film: Pick<Filmstock, 'name' | 'hersteller' | 'iso' | 'typ' | 'farbcharakter'>
  reasons?: string[]
}>()
</script>

<template>
  <article class="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
    <!-- Einheitlicher Placeholder – später durch Bilder im gleichen Seitenverhältnis ersetzt -->
    <div class="flex aspect-[3/2] items-center justify-center bg-stone-100">
      <div class="text-center">
        <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-stone-200">
          <svg class="h-6 w-6 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p class="text-xs font-medium uppercase tracking-wider text-stone-400">
          {{ film.typ === 'farbe' ? 'Farbe' : 'S/W' }}
        </p>
      </div>
    </div>

    <div class="p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-stone-500">
        {{ film.hersteller }}
      </p>
      <h3 class="mt-1 text-lg font-semibold text-stone-900">
        {{ film.name }}
      </h3>
      <p class="mt-1 text-sm text-stone-500">
        ISO {{ film.iso }}
      </p>
      <p v-if="film.farbcharakter" class="mt-2 text-sm text-stone-600">
        {{ film.farbcharakter }}
      </p>

      <ul v-if="reasons?.length" class="mt-3 space-y-1 border-t border-stone-100 pt-3">
        <li
          v-for="(reason, index) in reasons"
          :key="index"
          class="text-xs text-stone-500"
        >
          {{ reason }}
        </li>
      </ul>
    </div>
  </article>
</template>
