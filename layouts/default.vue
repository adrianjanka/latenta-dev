<template>
  <div class="flex min-h-screen flex-col bg-stone-100 text-stone-900">
    <SharedAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SharedAppFooter />
  </div>
</template>
