<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isExpanded = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (props.modelValue.trim()) {
    isExpanded.value = true
  }
})

watch(() => props.modelValue, (value) => {
  if (value.trim()) {
    isExpanded.value = true
  }
})

function expand() {
  isExpanded.value = true
  nextTick(() => inputRef.value?.focus())
}

function collapseIfEmpty() {
  if (!props.modelValue.trim()) {
    isExpanded.value = false
  }
}

function handleBlur() {
  window.setTimeout(collapseIfEmpty, 120)
}

function handleEscape() {
  emit('update:modelValue', '')
  isExpanded.value = false
}
</script>

<template>
  <div class="flex w-full justify-start">
    <div
      class="flex h-11 items-center overflow-hidden rounded-lg border border-border-strong bg-white transition-[width,box-shadow] duration-300 ease-out dark:bg-surface-elevated"
      :class="isExpanded ? 'w-full shadow-[0_2px_8px_rgba(30,21,16,0.06)] dark:shadow-none' : 'w-11'"
    >
      <button
        v-if="!isExpanded"
        type="button"
        class="flex h-11 w-11 shrink-0 items-center justify-center text-text-muted transition hover:text-text"
        aria-label="Suche öffnen"
        :aria-expanded="false"
        @click="expand"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      <span
        v-else
        class="pointer-events-none flex h-11 w-11 shrink-0 items-center justify-center text-text-muted"
        aria-hidden="true"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        ref="inputRef"
        type="search"
        :value="modelValue"
        placeholder="Film oder Hersteller suchen…"
        autocomplete="off"
        class="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-text placeholder:text-text-subtle transition-all duration-300 ease-out focus:outline-none"
        :class="isExpanded ? 'w-full opacity-100' : 'pointer-events-none w-0 opacity-0'"
        :tabindex="isExpanded ? 0 : -1"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="handleBlur"
        @keydown.escape.prevent="handleEscape"
      >
    </div>
  </div>
</template>
