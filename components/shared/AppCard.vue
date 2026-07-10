<script setup lang="ts">
import type { Filmstock, Koernung, Kontrast } from '~/types/filmstock'

const props = withDefaults(
  defineProps<{
    film: Pick<
      Filmstock,
      'name' | 'hersteller' | 'iso' | 'typ' | 'koernung' | 'kontrast' | 'farbcharakter' | 'bild' | 'bild_quelle'
    >
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

const { assetUrl } = useDirectusAsset()

const imageSrc = computed(() =>
  assetUrl(props.film.bild, {
    width: props.compact ? 400 : 800,
    quality: 80,
    fit: 'cover',
  }),
)

const imageLoaded = ref(false)

watch(imageSrc, () => {
  imageLoaded.value = false
})

function onImageLoad() {
  imageLoaded.value = true
}

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
const placeholderClass = computed(() =>
  props.film.typ === 's_w'
    ? 'bg-[repeating-linear-gradient(135deg,#8a8a8a,#8a8a8a_6px,#7d7d7d_6px,#7d7d7d_12px)]'
    : 'bg-[repeating-linear-gradient(135deg,#a89484,#a89484_10px,#9c8878_10px,#9c8878_20px)]',
)
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-card text-latenta-bighorn"
    :class="
      compact
        ? 'bg-white shadow-[0_4px_10px_rgba(30,21,16,0.06)] dark:bg-latenta-subtle dark:shadow-none'
        : 'bg-white shadow-[0_4px_14px_rgba(30,21,16,0.08)] dark:bg-latenta-subtle dark:shadow-xl dark:shadow-black/40'
    "
  >
    <!-- Rollenfoto oder Placeholder -->
    <div
      class="motion-img-zoom-parent relative overflow-hidden"
      :class="[compact ? 'h-[70px]' : 'aspect-[3/2] min-h-[140px]', !imageSrc ? placeholderClass : 'bg-latenta-bighorn/10']"
    >
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="`${film.hersteller} ${film.name}`"
        class="motion-img-reveal motion-img-zoom h-full w-full object-cover"
        :class="{ 'is-loaded': imageLoaded }"
        loading="lazy"
        @load="onImageLoad"
      >
      <span
        v-else-if="!compact"
        class="flex h-full items-center justify-center text-center font-mono text-[11px] text-latenta-bighorn"
      >
        FILMSTOCK<br>PRODUKTFOTO
      </span>
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

    <div :class="compact ? 'flex flex-1 flex-col p-3.5' : 'p-5 sm:p-6'">
      <p
        v-if="!compact && film.hersteller"
        class="text-xs font-semibold uppercase tracking-wide text-latenta-muted-light"
      >
        {{ film.hersteller }}
      </p>
      <h3
        class="font-display uppercase leading-tight text-latenta-bighorn"
        :class="compact ? 'mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm' : 'mt-1 text-xl sm:text-[22px]'"
      >
        {{ film.name }}
      </h3>

      <div
        v-if="!compact"
        class="mt-5 grid grid-cols-3 gap-3 text-center"
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
        class="mt-auto pt-2 text-[10px] text-latenta-muted-light"
      >
        ISO {{ film.iso }} · {{ koernungLabel[film.koernung] }}
      </p>

      <p
        v-if="!compact && film.farbcharakter"
        class="mt-3 text-sm text-latenta-muted-light"
      >
        {{ film.farbcharakter }}
      </p>

      <ul v-if="reasons?.length" class="mt-4 space-y-1.5 border-t border-latenta-bighorn/10 pt-4">
        <li
          v-for="(reason, index) in reasons"
          :key="index"
          class="text-xs leading-relaxed text-latenta-muted-light"
        >
          {{ reason }}
        </li>
      </ul>

      <div v-if="tags?.length && !compact" class="mt-4 flex flex-wrap gap-2">
        <SharedAppTag
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          :variant="film.typ === 's_w' ? 'category' : 'default'"
          class="!px-3 !py-1 !text-xs"
        />
      </div>

      <p
        v-if="!compact && film.bild_quelle && imageSrc"
        class="mt-4 text-[10px] leading-snug text-latenta-muted-light/80"
      >
        {{ film.bild_quelle }}
      </p>

      <SharedAppButton
        v-if="showCta && !compact"
        variant="primary"
        size="md"
        class="mt-5 w-full"
      >
        Details ansehen
      </SharedAppButton>
    </div>
  </article>
</template>
