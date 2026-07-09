<script setup lang="ts">
type TagVariant = 'default' | 'category'

withDefaults(
  defineProps<{
    label: string
    variant?: TagVariant
  }>(),
  {
    variant: 'default',
  },
)
</script>

<template>
  <span
    class="inline-block rounded-full px-[18px] py-2 text-sm font-semibold"
    :class="
      variant === 'category'
        ? 'bg-latenta-evening text-latenta-bighorn'
        : 'bg-latenta-sugar text-latenta-bighorn'
    "
  >
    {{ label }}
  </span>
</template>
