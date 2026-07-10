<template>
  <footer class="mt-auto border-t border-border bg-surface">
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <p class="text-center text-sm text-text-muted">
        © 2026 latenta.dev
      </p>
      <nav
        class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm"
        aria-label="Rechtliches"
      >
        <NuxtLink
          to="/impressum"
          class="text-text-muted transition hover:text-text"
        >
          Impressum
        </NuxtLink>
        <span class="text-border-strong" aria-hidden="true">·</span>
        <NuxtLink
          to="/datenschutz"
          class="text-text-muted transition hover:text-text"
        >
          Datenschutz
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>
