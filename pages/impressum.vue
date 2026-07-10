<script setup lang="ts">
useSeoMeta({
  title: 'Impressum – latenta.dev',
  description: 'Angaben gemäss Schweizer Recht / Anbieterkennzeichnung für latenta.dev.',
})
</script>

<template>
  <div class="motion-fade-up mx-auto max-w-lg px-6 pb-16 pt-8 sm:max-w-xl sm:px-8 sm:pt-10">
    <h1 class="font-display text-[2rem] uppercase leading-none text-text">
      Impressum
    </h1>
    <p class="mt-4 text-sm text-text-muted">
      Angaben zur verantwortlichen Person für dieses Lehrprojekt.
    </p>

    <section class="mt-10 space-y-8 text-sm leading-relaxed text-text-muted">
      <div>
        <h2 class="font-display text-lg uppercase text-text">
          Verantwortliche Person
        </h2>
        <p class="mt-3 text-text">
          Adrian Janka<br>
          Bachelor Multimedia Production (mmp23c)<br>
          Fachhochschule Graubünden (FHGR)
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          Kontakt
        </h2>
        <p class="mt-3">
          E-Mail:
          <a
            href="mailto:adi.janka@bluewin.ch"
            class="text-latenta-varnish underline-offset-2 transition hover:underline"
          >
            adi.janka@bluewin.ch
          </a>
        </p>
        <p class="mt-2 text-xs text-text-subtle">
          Postadresse auf Anfrage per E-Mail.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          Projekt
        </h2>
        <p class="mt-3">
          <strong class="text-text">latenta.dev</strong> ist ein nicht-kommerzielles
          Lehrprojekt im Rahmen des Bachelorstudiums Multimedia Production an der FHGR.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          Haftung für Inhalte &amp; Links
        </h2>
        <p class="mt-3">
          Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität wird keine Gewähr übernommen – insbesondere bei
          Entwicklungsrezepten und Filmempfehlungen. Externe Links führen zu Inhalten
          Dritter; für diese ist der jeweilige Anbieter verantwortlich.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          Urheberrecht &amp; Quellen
        </h2>
        <p class="mt-3">
          Design und Code von latenta.dev unterliegen dem Urheberrecht. Filmstammdaten
          stammen u.&nbsp;a. aus der
          <a
            href="https://filmapi.vercel.app/api/films"
            class="text-latenta-varnish underline-offset-2 hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >Film API</a>
          (MIT). Bilder von Unsplash mit Quellenangabe. Entwicklungsrezepte mit
          ausgewiesener Quelle (z.&nbsp;B. Massive Dev Chart).
        </p>
      </div>
    </section>

    <NuxtLink
      to="/"
      class="mt-12 inline-flex text-sm text-text-muted transition hover:text-text"
    >
      ← Zur Startseite
    </NuxtLink>
  </div>
</template>
