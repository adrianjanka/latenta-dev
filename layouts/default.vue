<template>
  <div class="relative flex min-h-screen flex-col bg-surface text-text">
    <SharedGrainOverlay />
    <SharedAppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SharedAppFooter />
  </div>
</template>
