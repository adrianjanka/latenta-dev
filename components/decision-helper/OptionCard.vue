<script setup lang="ts">
defineProps<{
  label: string
  description?: string
  selected: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center justify-between rounded-card p-5 text-left transition"
    :class="
      selected
        ? 'bg-latenta-varnish text-latenta-subtle'
        : 'border-[1.5px] border-border-strong bg-surface-elevated text-text dark:border-border'
    "
    @click="emit('select')"
  >
    <span>
      <span class="block text-[17px] font-bold">{{ label }}</span>
      <span
        v-if="description"
        class="mt-1 block text-sm"
        :class="selected ? 'text-latenta-subtle/80' : 'text-text-muted'"
      >
        {{ description }}
      </span>
    </span>
    <div
      v-if="selected"
      class="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-latenta-subtle text-sm text-latenta-varnish"
      aria-hidden="true"
    >
      ✓
    </div>
  </button>
</template>
