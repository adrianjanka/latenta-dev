<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    current: number
    total?: number
  }>(),
  {
    total: 6,
  },
)

const steps = computed(() => Array.from({ length: props.total }, (_, i) => i + 1))
</script>

<template>
  <div>
    <div class="flex items-center gap-1.5 sm:gap-2">
      <template v-for="step in steps" :key="step">
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold sm:h-9 sm:w-9 sm:text-sm"
          :class="
            step <= current
              ? 'bg-latenta-varnish text-latenta-subtle'
              : 'bg-white text-text-subtle dark:bg-white/10 dark:text-text-muted'
          "
        >
          {{ step }}
        </div>
        <div
          v-if="step < total"
          class="h-1 w-5 rounded-sm sm:w-6"
          :class="step < current ? 'bg-latenta-varnish' : 'bg-border-strong'"
        />
      </template>
    </div>
    <p class="mt-2.5 text-sm text-text-muted">
      Schritt {{ current }} von {{ total }}
    </p>
  </div>
</template>
