<script setup lang="ts">
useSeoMeta({
  title: 'Datenschutz – latenta.dev',
  description: 'Datenschutzerklärung für latenta.dev (Schweizer DSG).',
})
</script>

<template>
  <div class="motion-fade-up mx-auto max-w-lg px-6 pb-16 pt-8 sm:max-w-xl sm:px-8 sm:pt-10">
    <h1 class="font-display text-[2rem] uppercase leading-none text-text">
      Datenschutz
    </h1>
    <p class="mt-4 text-sm text-text-muted">
      Informationen zur Bearbeitung von Personendaten gemäss Schweizer Datenschutzgesetz (DSG).
    </p>

    <section class="mt-10 space-y-8 text-sm leading-relaxed text-text-muted">
      <div>
        <h2 class="font-display text-lg uppercase text-text">
          1. Verantwortliche Person
        </h2>
        <p class="mt-3">
          Adrian Janka<br>
          E-Mail:
          <a
            href="mailto:adi.janka@bluewin.ch"
            class="text-latenta-varnish underline-offset-2 hover:underline"
          >
            adi.janka@bluewin.ch
          </a>
        </p>
        <p class="mt-2">
          Siehe auch
          <NuxtLink to="/impressum" class="text-latenta-varnish underline-offset-2 hover:underline">
            Impressum
          </NuxtLink>.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          2. Zweck der Website
        </h2>
        <p class="mt-3">
          latenta.dev ist ein Lehrprojekt der FHGR und bietet Filmempfehlungen,
          eine Filmstock-Datenbank und einen Entwicklungsassistenten. Es werden
          keine Benutzerkonten geführt und keine kommerzielle Nutzerprofilierung betrieben.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          3. Welche Daten werden bearbeitet?
        </h2>
        <ul class="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong class="text-text">Technische Zugriffsdaten:</strong>
            Beim Aufruf können Server-Logs (z.&nbsp;B. IP-Adresse, Zeitpunkt, User-Agent)
            beim Hosting-Anbieter anfallen – soweit der Betrieb das technisch erfordert.
          </li>
          <li>
            <strong class="text-text">Theme-Einstellung:</strong>
            Die Wahl Hell/Dunkel wird lokal im Browser gespeichert
            (<code class="text-text">localStorage</code>, Schlüssel
            <code class="text-text">latenta-theme</code>). Keine Übermittlung an den Server.
          </li>
          <li>
            <strong class="text-text">Fragebogen / Empfehlung:</strong>
            Antworten werden nur im Browser bzw. für die laufende Session verarbeitet,
            um Filmempfehlungen zu berechnen. Es findet keine dauerhafte Speicherung
            deiner Antworten auf unseren Servern statt.
          </li>
          <li>
            <strong class="text-text">Keine Tracking-Cookies:</strong>
            Es werden derzeit keine Analyse- oder Werbe-Cookies gesetzt.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          4. Drittanbieter &amp; externe Dienste
        </h2>
        <ul class="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong class="text-text">Hosting:</strong>
            Die Web-App kann über einen Hosting-Anbieter (z.&nbsp;B. Vercel) ausgeliefert werden.
            Dabei gelten zusätzlich dessen Datenschutzbestimmungen.
          </li>
          <li>
            <strong class="text-text">Inhalte / CMS (Directus):</strong>
            Film- und Rezeptdaten werden über ein Directus-Backend bereitgestellt.
          </li>
          <li>
            <strong class="text-text">Schriftarten (Google Fonts):</strong>
            Beim Laden der Seite werden Schriftarten von Google-Servern abgerufen.
            Dabei kann Google die IP-Adresse und technische Daten erhalten.
            Alternative: künftig selbst gehostete Fonts.
          </li>
          <li>
            <strong class="text-text">Bilder (Unsplash):</strong>
            Beispiel- und Rollenfotos stammen von Unsplash (lizenzfrei mit Attribution)
            und werden über unser CMS ausgeliefert.
          </li>
          <li>
            <strong class="text-text">KI-Bildanalyse (geplant / Weg&nbsp;B):</strong>
            Wenn du ein Bild zur Analyse hochlädst, wird es serverseitig an die
            Anthropic API (Claude) übermittelt, um Stimmungs-Tags und Empfehlungen
            abzuleiten. Lade keine Bilder mit sensiblen Personendaten Dritter hoch,
            ohne deren Einwilligung.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          5. Rechtsgrundlage &amp; Speicherdauer
        </h2>
        <p class="mt-3">
          Die Bearbeitung erfolgt zur Bereitstellung der Lehrprojekt-Website und – soweit
          erforderlich – aufgrund berechtigter Interessen an einem stabilen, sicheren Betrieb.
          Lokal gespeicherte Einstellungen bleiben, bis du sie im Browser löschst.
          Server-Logs werden vom Hosting-Anbieter nach dessen Praxis aufbewahrt.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          6. Deine Rechte
        </h2>
        <p class="mt-3">
          Nach dem Schweizer DSG hast du insbesondere das Recht auf Auskunft, Berichtigung
          und Löschung von dich betreffenden Personendaten sowie das Recht, eine Beschwerde
          beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) einzureichen.
          Anfragen bitte an
          <a
            href="mailto:adi.janka@bluewin.ch"
            class="text-latenta-varnish underline-offset-2 hover:underline"
          >
            adi.janka@bluewin.ch
          </a>.
        </p>
      </div>

      <div>
        <h2 class="font-display text-lg uppercase text-text">
          7. Änderungen
        </h2>
        <p class="mt-3">
          Diese Erklärung kann angepasst werden, wenn sich Funktionen der Website ändern
          (z.&nbsp;B. Einführung der KI-Bildanalyse). Stand: Juli 2026.
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
