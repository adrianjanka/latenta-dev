<script setup lang="ts">
import type { DirectusFile, Filmstock, StimmungsTag } from '~/types/filmstock'

const props = defineProps<{
  film: Filmstock
}>()

const { assetUrl } = useDirectusAsset()

const tagLabels = computed(() => {
  if (!props.film.stimmungs_tags) return []
  return props.film.stimmungs_tags.map((tag) => {
    if (typeof tag === 'string') return tag
    return (tag as StimmungsTag).slug
  })
})

const beispielbilder = computed(() => {
  const raw = props.film.beispielbilder
  if (!Array.isArray(raw)) return [] as DirectusFile[]
  return raw.filter((file): file is DirectusFile =>
    Boolean(file && typeof file === 'object' && 'id' in file && file.id),
  )
})

const beispielQuellen = computed(() => {
  const sources = beispielbilder.value
    .map(file => file.description?.trim())
    .filter((text): text is string => Boolean(text))
  return [...new Set(sources)]
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}
</script>

<template>
  <div class="motion-fade-up mx-auto max-w-lg px-6 pb-16 pt-8 sm:max-w-xl sm:px-8 sm:pt-10">
    <NuxtLink
      to="/database"
      class="mb-8 inline-flex items-center gap-1 text-sm text-text-muted transition hover:text-text"
    >
      ← Zurück zur Übersicht
    </NuxtLink>

    <SharedAppCard :film="film" :tags="tagLabels" />

    <div v-if="film.beschreibung" class="mt-10">
      <h2 class="font-display text-lg uppercase text-text">
        Beschreibung
      </h2>
      <p class="mt-3 text-sm leading-relaxed text-text-muted">
        {{ film.beschreibung }}
      </p>
    </div>

    <div v-if="film.farbcharakter" class="mt-10">
      <h2 class="font-display text-lg uppercase text-text">
        Farbcharakter
      </h2>
      <p class="mt-3 text-sm text-text-muted">
        {{ film.farbcharakter }}
      </p>
    </div>

    <div v-if="beispielbilder.length" class="mt-12">
      <h2 class="font-display text-lg uppercase text-text">
        Beispielaufnahmen
      </h2>
      <p class="mt-2 text-sm text-text-muted">
        Tippen zum Vergrössern – typischer Look, nicht vom Hersteller.
      </p>
      <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          v-for="(file, index) in beispielbilder"
          :key="file.id"
          type="button"
          class="motion-stagger motion-img-zoom-parent group overflow-hidden rounded-card bg-surface-elevated text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-latenta-varnish"
          :style="{ '--stagger': index }"
          :aria-label="`Beispielaufnahme ${index + 1} vergrössern`"
          @click="openLightbox(index)"
        >
          <img
            :src="assetUrl(file, { width: 900, quality: 82, fit: 'cover' }) ?? undefined"
            :alt="file.title || `Beispielaufnahme ${film.name}`"
            class="motion-img-zoom aspect-[4/3] w-full object-cover"
            loading="lazy"
          >
        </button>
      </div>
      <p
        v-if="beispielQuellen.length"
        class="mt-4 text-[11px] leading-relaxed text-text-muted"
      >
        {{ beispielQuellen.join(' · ') }}
      </p>
    </div>

    <SharedImageLightbox
      :open="lightboxOpen"
      :images="beispielbilder"
      :start-index="lightboxIndex"
      @close="closeLightbox"
    />
  </div>
</template>
