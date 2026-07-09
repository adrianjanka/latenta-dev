<script setup lang="ts">
import type { Filmstock, Koernung, Kontrast } from '~/types/filmstock'

const props = withDefaults(
  defineProps<{
    film: Pick<Filmstock, 'name' | 'hersteller' | 'iso' | 'typ' | 'koernung' | 'kontrast' | 'farbcharakter'>
    tags?: string[]
    reasons?: string[]
    compact?: boolean
    showCta?: boolean
  }>(),
  {
    compact: false,
    showCta: false,
  },
)

const koernungLabel: Record<Koernung, string> = {
  fein: 'Fein',
  mittel: 'Mittel',
  grob: 'Grob',
}

const kontrastLabel: Record<Kontrast, string> = {
  niedrig: 'Sanft',
  mittel: 'Mittel',
  hoch: 'Hoch',
}

const colorBars = [
  'bg-latenta-varnish',
  'bg-latenta-sugar',
  'bg-latenta-evening',
  'bg-latenta-bighorn',
]
</script>

<template>
  <article
    class="overflow-hidden rounded-card bg-latenta-subtle text-latenta-bighorn shadow-lg dark:shadow-black/40"
    :class="compact ? '' : 'shadow-xl'"
  >
  <!-- Placeholder image area -->
    <div
      class="flex items-center justify-center bg-[repeating-linear-gradient(135deg,#a89484,#a89484_10px,#9c8878_10px,#9c8878_20px)] text-center font-mono text-[11px] text-latenta-bighorn"
      :class="compact ? 'h-[70px]' : 'aspect-[3/2] min-h-[140px]'"
    >
      <span v-if="!compact">FILMSTOCK<br>PRODUKTFOTO</span>
    </div>

    <!-- Color bar -->
    <div class="flex" :class="compact ? 'h-2' : 'h-3.5'">
      <div
        v-for="(bar, index) in colorBars.slice(0, compact ? 2 : 4)"
        :key="index"
        class="flex-1"
        :class="bar"
      />
    </div>

    <div :class="compact ? 'p-2.5' : 'p-4 sm:p-[18px]'">
      <p
        v-if="!compact && film.hersteller"
        class="text-xs font-semibold uppercase tracking-wide text-latenta-muted-light"
      >
        {{ film.hersteller }}
      </p>
      <h3
        class="font-display uppercase leading-tight text-latenta-bighorn"
        :class="compact ? 'text-sm' : 'text-xl sm:text-[22px]'"
      >
        {{ film.name }}
      </h3>

      <div
        v-if="!compact"
        class="mt-3.5 grid grid-cols-3 gap-2 text-center"
      >
        <div>
          <div class="font-display text-xl text-latenta-varnish">{{ film.iso }}</div>
          <div class="text-[11px] uppercase text-latenta-muted-light">ISO</div>
        </div>
        <div>
          <div class="font-display text-xl text-latenta-varnish">{{ koernungLabel[film.koernung] }}</div>
          <div class="text-[11px] uppercase text-latenta-muted-light">Körnung</div>
        </div>
        <div>
          <div class="font-display text-xl text-latenta-varnish">{{ kontrastLabel[film.kontrast] }}</div>
          <div class="text-[11px] uppercase text-latenta-muted-light">Kontrast</div>
        </div>
      </div>

      <p
        v-else
        class="mt-0.5 text-[10px] text-latenta-muted-light"
      >
        ISO {{ film.iso }} · {{ koernungLabel[film.koernung] }}
      </p>

      <p
        v-if="!compact && film.farbcharakter"
        class="mt-2 text-sm text-latenta-muted-light"
      >
        {{ film.farbcharakter }}
      </p>

      <ul v-if="reasons?.length" class="mt-3 space-y-1 border-t border-latenta-bighorn/10 pt-3">
        <li
          v-for="(reason, index) in reasons"
          :key="index"
          class="text-xs leading-relaxed text-latenta-muted-light"
        >
          {{ reason }}
        </li>
      </ul>

      <div v-if="tags?.length" class="mt-3 flex flex-wrap gap-2">
        <SharedAppTag
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          :variant="film.typ === 's_w' ? 'category' : 'default'"
          class="!px-3 !py-1 !text-xs"
        />
      </div>

      <SharedAppButton
        v-if="showCta && !compact"
        variant="primary"
        size="md"
        class="mt-3.5 w-full"
      >
        Details ansehen
      </SharedAppButton>
    </div>
  </article>
</template>
