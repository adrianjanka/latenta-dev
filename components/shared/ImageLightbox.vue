<script setup lang="ts">
import type { DirectusFile } from '~/types/filmstock'

const props = defineProps<{
  images: DirectusFile[]
  startIndex?: number
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { assetUrl } = useDirectusAsset()

const index = ref(props.startIndex ?? 0)

watch(
  () => [props.open, props.startIndex] as const,
  ([isOpen, start]) => {
    if (isOpen) {
      index.value = start ?? 0
    }
  },
)

const current = computed(() => props.images[index.value] ?? null)

const src = computed(() =>
  current.value
    ? assetUrl(current.value, { width: 1600, quality: 88 })
    : null,
)

const caption = computed(() =>
  current.value?.description?.trim()
    || current.value?.title
    || null,
)

const hasMultiple = computed(() => props.images.length > 1)

const btnClass = [
  'flex h-11 min-w-[44px] items-center justify-center rounded-lg border border-border-strong',
  'bg-surface-elevated text-sm font-semibold text-text shadow-sm',
  'transition hover:border-latenta-varnish hover:text-latenta-varnish',
  'dark:border-latenta-subtle/30 dark:bg-latenta-bighorn/80 dark:text-latenta-subtle',
  'dark:hover:border-latenta-subtle dark:hover:bg-white/15 dark:hover:text-latenta-subtle',
].join(' ')

const navBtnClass = [
  'absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong',
  'bg-white text-xl text-latenta-bighorn shadow-md',
  'transition hover:border-latenta-varnish hover:text-latenta-varnish',
  'dark:border-latenta-subtle/30 dark:bg-latenta-bighorn/85 dark:text-latenta-subtle',
  'dark:hover:border-latenta-subtle dark:hover:bg-white/15 dark:hover:text-latenta-subtle',
].join(' ')

function close() {
  emit('close')
}

function prev() {
  if (!hasMultiple.value) return
  index.value = (index.value - 1 + props.images.length) % props.images.length
}

function next() {
  if (!hasMultiple.value) return
  index.value = (index.value + 1) % props.images.length
}

function onKeydown(event: KeyboardEvent) {
  if (!props.open) return
  if (event.key === 'Escape') close()
  if (event.key === 'ArrowLeft') prev()
  if (event.key === 'ArrowRight') next()
}

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && current && src"
      class="motion-fade-in fixed inset-0 z-[1100] flex flex-col bg-latenta-subtle/95 backdrop-blur-sm dark:bg-latenta-bighorn/92"
      role="dialog"
      aria-modal="true"
      aria-label="Bildansicht"
      @click.self="close"
    >
      <div class="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p class="text-sm font-medium text-text-muted dark:text-latenta-subtle/80">
          {{ index + 1 }} / {{ images.length }}
        </p>
        <button
          type="button"
          :class="btnClass"
          class="px-3"
          aria-label="Schliessen"
          @click="close"
        >
          Schliessen
        </button>
      </div>

      <div class="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-10">
        <button
          v-if="hasMultiple"
          type="button"
          :class="navBtnClass"
          class="left-2 sm:left-4"
          aria-label="Vorheriges Bild"
          @click.stop="prev"
        >
          ‹
        </button>

        <img
          :src="src"
          :alt="current.title || 'Beispielaufnahme'"
          class="max-h-[min(78vh,900px)] max-w-full rounded-card object-contain shadow-2xl shadow-black/25 dark:shadow-black/40"
          @click.stop
        >

        <button
          v-if="hasMultiple"
          type="button"
          :class="navBtnClass"
          class="right-2 sm:right-4"
          aria-label="Nächstes Bild"
          @click.stop="next"
        >
          ›
        </button>
      </div>

      <p
        v-if="caption"
        class="px-4 pb-5 text-center text-[12px] text-text-muted dark:text-latenta-subtle/70 sm:px-6"
      >
        {{ caption }}
      </p>
    </div>
  </Teleport>
</template>
