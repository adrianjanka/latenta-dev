<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'category'
type ButtonSize = 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    to?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'lg',
    type: 'button',
    disabled: false,
  },
)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-latenta-varnish text-latenta-subtle hover:bg-latenta-varnish/90',
  secondary:
    'bg-transparent text-text border-2 border-text hover:bg-surface-elevated dark:hover:bg-white/5',
  category: 'bg-latenta-evening text-latenta-bighorn hover:bg-latenta-evening/90',
}

const sizeClasses: Record<ButtonSize, string> = {
  md: 'h-11 min-h-[44px] px-6 text-sm',
  lg: 'h-[52px] min-h-[48px] px-8 text-base',
}

const classes = computed(
  () =>
    `inline-flex items-center justify-center rounded-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[props.variant]} ${sizeClasses[props.size]}`,
)
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
