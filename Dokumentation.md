# latenta.dev – Projektdokumentation

Fortlaufendes Entwicklungsjournal für das Lehrprojekt (FHGR, mmp23c).  
Abgabetermin: **7. August 2026**

> Diese Datei wird bei jeder relevanten Projektphase aktualisiert – Entscheidungen, Umsetzung, Reflexion.

---

## Aktueller Stand (10. Juli 2026)

**Erledigt:** Phasen 1–5B, plus Legal (Impressum/Datenschutz) und Favicon.

**Nächste Session:** Weg B (KI-Bildanalyse) + kleiner Vergleichsmodus in der Datenbank.

| Was | Wo nachschlagen |
|-----|-----------------|
| Datenbank-UI | `pages/database/`, `components/database/` |
| Filter-Logik | `composables/useFilmstockFilters.ts` |
| Film-API | `server/api/filmstocks.get.ts`, `server/api/filmstocks/[id].get.ts` |
| Fragebogen-UI | `pages/decision-helper/`, `components/decision-helper/` |
| Matcher testen | `npm run test:recommendation` |
| Entwicklungsassistent | `pages/development/`, `components/development-assistant/` |
| Rezepte seeden | `npm run data:seed:recipes` |
| Bilder seeden | `npm run data:seed:images` (Unsplash → Directus) |
| Asset-URLs | `composables/useDirectusAsset.ts` |
| Impressum / Datenschutz | `pages/impressum.vue`, `pages/datenschutz.vue` |

---

## Arbeitsweise

**Stand 3. Juli 2026:** Alle Architektur-, Stack- und Konzeptentscheidungen werden direkt in Cursor getroffen und hier dokumentiert. Kein separater Architektur-Chat mehr.

---

## Phase 1 – Fundament (abgeschlossen)

**Ziel:** Lauffähiges Nuxt-3-Grundgerüst mit Tailwind, lokalem Directus, TypeScript-Types und Startseite.

### Umgesetzt

- Nuxt 3.21 + Tailwind CSS initialisiert
- Projektstruktur gemäss `.cursorrules` angelegt
- `docker/docker-compose.yml` mit Postgres 16 + Directus 11.5.1
- TypeScript-Interfaces in `types/filmstock.ts`
- Schema-Dokumentation in `docker/SCHEMA.md`
- Basis-UI: Layout, Header, Footer, Startseite mit Navigation
- `composables/useDirectus.ts` – REST-Wrapper für Directus
- Stubs für KI (`server/api/analyze-image.post.ts`) und Composables
- `runtimeConfig` für Directus + Anthropic (Key nur serverseitig)
- Production-Build verifiziert (`npm run build`)

---

## Phase 1.5 – Use-Case, Schema & Datenpipeline (abgeschlossen)

**Ziel:** Fragebogen-Logik, Matching, minimales Directus-Schema und automatisierte Film-Daten – Grundlage für Weg A.

### Persona & User Journey

- **Zielgruppe:** Analog-Einsteiger bei der ersten Filmwahl
- **Flow:** Startseite → Decision Helper → Fragebogen (6 Schritte) → Top 3 mit Begründung → optional Datenbank
- **Grenzen:** 35mm zuerst, kein Vollkatalog, keine Bilder (Placeholder), Figma-Design in Phase 1.6

### Fragebogen (Weg A)

Definiert in `data/questionnaire.ts` – 6 Fragen in Einsteiger-Sprache:

1. Farbe oder Schwarzweiss? (inkl. «Weiss nicht»)
2. Wo fotografierst du?
3. Wie ist das Licht?
4. Welche Stimmung?
5. Was fotografierst du?
6. Format (35mm)

### Matching-Logik

- Implementiert in `utils/recommendation.ts` + `composables/useFilmRecommendation.ts`
- Hard-Filter: `typ`, `format`, `status=published`
- Scoring: Tag-Übereinstimmung (Stimmung höher gewichtet) + ISO-Fit
- Mock-Daten: `data/filmstocks.mock.ts` (10 Filme)
- Test: `npm run test:recommendation`

### Datenpipeline

| Schritt | Befehl | Output |
|---------|--------|--------|
| Abrufen | `npm run data:fetch` | `data/filmstocks.raw.json` |
| Transformieren | `npm run data:transform` | `data/filmstocks.transformed.json` |
| Anreichern | `npm run data:enrich` | `data/filmstocks.enriched.json` |
| Schema | `npm run directus:setup` | Directus-Collections |
| Seed | `npm run data:seed` | Daten in Directus |

**Quelle:** [Film API](https://filmapi.vercel.app/api/films) (MIT, ~130 Filme, gefiltert auf 35mm)  
**Anreicherung:** Hybrid – regelbasiert für `draft`, KI (`scripts/lib/anthropic-enrich.ts`) für alle `published`-Filme

### Directus einrichten

**Schema & Einzelanpassungen:** Directus MCP (`user-latenta.dev directus`).  
**Bulk-Import:** npm-Scripts.

```bash
npm run directus:setup    # Collections + M2M-Reparatur
npm run data:pipeline     # fetch → transform → enrich (braucht ANTHROPIC_API_KEY für published)
npm run data:seed         # enriched.json → Directus
```

### Nächste Schritte

1. **Phase 1.6:** Figma Design Foundation (Adrian)
2. **Phase 2:** Fragebogen-UI + Ergebnis-Screen (Weg A)

---

## Phase 1.5b – Inhaltsqualität & Sprache (abgeschlossen)

### Problem: Stimmungs-Tags (gelöst)

Die M2M-Verknüpfung in Directus **funktioniert technisch** – die **inhaltliche Qualität** der regelbasierten Anreicherung war zu schwach.

Beispiel Portra 400 (vorher): `feinkoernig` + `koernig` gleichzeitig, `wenig_licht` bei ISO 400, `lebhaft` trotz «low contrast».

**Ursache:** `scripts/enrich-filmstocks.ts` nutzte einfache Keyword-Regeln.

**Umsetzung:**
1. `scripts/lib/anthropic-enrich.ts` – KI-Prompt + `sanitizeTags()` (Widersprüche, ISO-Regeln)
2. KI-Neuanreicherung für alle 19 `published`-Filme (`ANTHROPIC_MODEL=claude-sonnet-4-6`)
3. 102 `draft`-Filme weiterhin regelbasiert
4. `beschreibung_en` speichert Original aus Film API
5. Re-Seed: `npm run data:enrich && npm run data:seed` (121 aktualisiert)

**Stichprobe Portra 400 (nachher):** Tags `portraet`, `draussen`, `warm`, `feinkoernig`, `klassisch` – DE-Beschreibung in Einsteiger-Sprache, `koernung: fein`, `kontrast: niedrig`.

### Directus M2M-Fix

Junction-Felder `filmstocks_stimmungs_tags` hatten `meta: null` → Admin-UI-Fehler «Relation nicht korrekt konfiguriert». Repariert via Feld-Meta + Relations (`npm run directus:setup` enthält Reparatur-Logik). Künftige Directus-Anpassungen über MCP.

### Sprache: Deutsch zuerst, i18n später

| Option | Aufwand | Empfehlung |
|--------|---------|------------|
| **A: Nur DE** – `beschreibung` + `farbcharakter` per KI übersetzen | Gering | **Jetzt (MVP)** |
| **B: Volles i18n** – `@nuxtjs/i18n` + UI + Directus-Inhalte DE/EN | Hoch | **Nicht vor Abgabe** |
| **C: Hybrid** – UI-Strings i18n-ready, Inhalte DE; EN-Felder später | Mittel | **Optional Phase 5** |

**Entscheidung (vorläufig):** Option A für die Abgabe.

---

## Phase 1.6 – Design Foundation (abgeschlossen)

**Ziel:** Visuelles Fundament vor der Fragebogen-UI – nicht im Wireframe-Look bauen.

**Design-Quelle:** Claude Design in `design/` (statt Figma-URL).

**Umgesetzt:**
1. Design Tokens in `tailwind.config.ts` + semantische CSS-Variablen in `assets/css/main.css`
2. Fonts: Anton (Headlines) + Inter (UI) via Google Fonts
3. Dual-Theme: **1A Dunkelkammer** (Standard, `.dark`) + **1B Labormodus** (Light) per globalem Toggle im Header
4. Shared Components: `AppButton`, `AppCard`, `AppTag`, `StepIndicator`, `ThemeToggle`, `GrainOverlay`
5. Layout + Startseite nach Screen 1A/1B umgesetzt
6. `FilmstockPlaceholder` nutzt intern `AppCard`

---

## Phase 2 – Fragebogen-UI + Ergebnis Weg A (abgeschlossen)

**Ziel:** Interaktiver 6-Schritte-Fragebogen mit Matcher und Top-3-Ergebnis im finalen Design.

**Umgesetzt:**
1. `server/api/filmstocks.get.ts` – published Filme aus Directus, Tag-Normalisierung, Mock-Fallback
2. `composables/useQuestionnaire.ts` – Schritt-State, Antworten, Navigation
3. `composables/useFilmRecommendation.ts` – async Laden + Matcher-Anbindung
4. `components/decision-helper/` – OptionCard, QuestionStep, QuestionnaireFlow, ResultCard, ResultList
5. `pages/decision-helper/index.vue` – Flow: Fragebogen → Loading → Top 3 / Leer-Fallback

**Entscheidungen:** Directus live mit Mock-Fallback; kompakte Ergebnis-Karten; Weg B ausserhalb Scope.

---

## Phase 3 – Filmstock-Datenbank UI (abgeschlossen)

**Ziel:** Browse-Interface für published Filme mit Filter-Chips und Detailseite.

**Umgesetzt:**
1. `composables/useFilmstockFilters.ts` – Filter Alle / Farbe / S/W / ISO 100–400
2. `components/database/` – FilterChips, FilmstockGrid, FilmstockDetail
3. `pages/database/index.vue` – 2-Spalten-Grid nach Design 1A/1B
4. `pages/database/[id].vue` – Detailseite mit voller AppCard + Beschreibung
5. `server/api/filmstocks/[id].get.ts` + `server/utils/filmstocks.ts`
6. `AppCard` compact/full – Light-Mode mit weiss + Schatten (1B)

**Entscheidungen:** Nur published; kein Vergleichsmodus; Detailseite per Klick.

---

## Phase 3.1 – Datenbank-Filter & Pagination (abgeschlossen)

**Ziel:** Gleichhohe Kacheln, kombinierbare Filter (AND-Logik) und clientseitige Pagination.

**Umgesetzt:**
1. `composables/useFilmstockFilters.ts` – drei Chip-Zeilen: Typ (Alle/Farbe/S/W), ISO (≤200/400/800+), Charakter (Körnung + Kontrast)
2. `composables/usePagination.ts` – 12 Filme pro Seite, Reset bei Filterwechsel
3. `components/database/FilterChips.vue` – mehrzeilige Chips + Trefferzähler
4. `components/database/Pagination.vue` – Zurück/Weiter + Bereichsanzeige
5. `components/database/FilmstockGrid.vue` – `auto-rows-fr` + `h-full` für gleichhohe Kacheln
6. `AppCard` compact – `flex-col h-full`, `line-clamp-2`, Tags im Grid ausgeblendet

**Bildkonzept (für Phase 5):**
- `bild` / `bild_quelle` = Produktfoto der Filmrolle
- Beispielbilder (Aufnahmeergebnisse) kommen separat dazu – nicht Teil von 3.1

**Entscheidungen:** Filter kombinierbar (AND über Zeilen); Pagination clientseitig; Bilder bewusst auf Phase 5 verschoben.

---

## Phase 4 – Entwicklungsassistent (abgeschlossen)

**Ziel:** Schritt-für-Schritt-Laborbegleitung mit Countdown-Timer, mobil optimiert (grosse Touch-Targets, Labormodus 1B).

**Umgesetzt:**
1. `data/development-recipes.mock.ts` – 12 kuratierte Rezepte (S/W + C-41)
2. `server/api/development-recipes.get.ts` + `by-film/[filmstockId].get.ts` – Directus/Mock-Fallback
3. `composables/useDevelopmentFlow.ts` + `useDevelopmentTimer.ts` – Flow-State + Countdown
4. `components/development-assistant/` – FilmSelector, RecipeSelector, RecipeOverview, DevelopmentTimer, DevelopmentStep, DevelopmentFlow
5. `pages/development/index.vue` – vollständiger Flow: Film → Rezept → Übersicht → Schritte → Fertig
6. `scripts/seed-development-recipes.ts` – 12 published Rezepte in Directus (`npm run data:seed:recipes`)

**Entscheidungen:** S/W + C-41; Einstieg nur über `/development` (kein CTA auf Detailseite); Timer pro Schritt mit Pause/Fortsetzen; Wake Lock + Vibration bei Timer-Ende; Quellenangabe sichtbar.

## Phase 5A – Bild-Infrastruktur (abgeschlossen)

**Ziel:** Rollenfotos + Beispielaufnahmen anzeigbar machen; Inhalte aus lizenzfreien Stock-Quellen (Unsplash) nach Directus importieren.

**Umgesetzt:**
1. Directus: `beispielbilder` (files) + Junction `filmstocks_beispielbilder` (via `npm run directus:setup`)
2. `composables/useDirectusAsset.ts` – Asset-URLs mit optionalen Transforms
3. `AppCard` zeigt `bild` (Fallback Placeholder) + `bild_quelle`; Detailseite Galerie «Beispielaufnahmen»
4. API/`normalizeFilmstock` laden und normalisieren `bild` + `beispielbilder`
5. Manifest `data/filmstock-images.manifest.json` + Seed `npm run data:seed:images`

**Entscheidungen:** Unsplash API (Attribution Pflicht) → Import nach Directus (kein Hotlinking); Rollenfoto = `bild`/`bild_quelle`; Look-Beispiele = `beispielbilder` (Attribution in File-`description`); Animationen = Phase 5B.

**Seed ausführen:** `UNSPLASH_ACCESS_KEY` in `.env` setzen, dann gestaffelt wegen 50 Requests/h:

```bash
npm run data:seed:images -- --limit=2
```

Pro Film ~6 Unsplash-Calls; bei Rate-Limit bricht das Script ab. Nach ~1 h erneut (idempotent). `bild` braucht die Relation zu `directus_files` (`npm run directus:setup`).

## Phase 5B – Animationen (abgeschlossen)

**Ziel:** Zurückhaltende Motion für Hierarchie und Präsenz – Analog-Ästhetik, kein UI-Lärm.

**Umgesetzt:**
1. Motion-Tokens + Keyframes in `assets/css/main.css` (`fade-up`, `fade-in`, `grain-drift`)
2. Page-Transition (`app.vue` + `.page-*`)
3. Gestaffelte Karten (Home, Filmstock-Grid, Beispielgalerie)
4. Bild-Reveal in `AppCard` beim Laden
5. Grain-Drift (Dark), StepIndicator-Farbübergänge, Fragebogen-Schritt-Fade
6. `prefers-reduced-motion: reduce` deaktiviert Animationen

**Entscheidungen:** Wenige, bewusste Motionen statt überall Transition; reduced-motion first-class.

## Phase 5C – Legal & Favicon (abgeschlossen)

**Ziel:** Impressum und Datenschutz verlinken; Favicon für Browser-Tab.

**Umgesetzt:**
1. `pages/impressum.vue` – Verantwortliche Person, Kontakt, Haftung, Quellen
2. `pages/datenschutz.vue` – DSG-CH: lokale Theme-Daten, Hosting, Google Fonts, Directus, geplante KI (Weg B)
3. Footer-Links in `components/shared/AppFooter.vue`
4. `public/favicon.svg` + Eintrag in `nuxt.config.ts`

**Hinweis:** Postadresse im Impressum aktuell «auf Anfrage»; bei Bedarf ergänzen.

## Design & UX – Roadmap

| Phase | Inhalt | Status |
|-------|--------|--------|
| 1.5 | UX-Flows, Placeholder-Komponenten | Erledigt |
| 1.5b | KI-Tags + DE-Übersetzung published Filme | Erledigt |
| **1.6** | Design Tokens, Components, Startseite, Dual-Theme | **Erledigt** |
| 2 | Fragebogen + Ergebnis im finalen Look | **Erledigt** |
| 3 | Datenbank-Grid + Filter + Detailseite | **Erledigt** |
| 3.1 | Kombinierbare Filter, Pagination, gleichhohe Kacheln | **Erledigt** |
| 4 | Entwicklungsassistent | **Erledigt** |
| 5A | Bild-Infrastruktur (Rollenfotos + Beispielbilder + Unsplash-Seed) | **Erledigt** |
| 5B | Animationen / Micro-Interactions | **Erledigt** |
| 5C | Impressum, Datenschutz, Favicon | **Erledigt** |
| 6 | Weg B (KI-Bildanalyse) | **Nächste Session** |
| 6b | Vergleichsmodus Datenbank | **Nächste Session** |

---

## Entscheidungslog

| Datum | Entscheidung | Begründung |
|-------|-------------|------------|
| 2026-07-03 | Nuxt 3 (nicht Nuxt 4) | Vorgabe in `.cursorrules`, Stabilität für Lehrprojekt |
| 2026-07-03 | Anthropic für KI-Bildanalyse | Bessere Bildbeschreibungen, strukturierte JSON-Outputs |
| 2026-07-03 | Directus lokal via Docker | CMS + API für Filmstocks, Rezepte, Tags |
| 2026-07-03 | Architektur direkt in Cursor | Einheitlicher Workflow |
| 2026-07-03 | Film API als Datenquelle | MIT-Lizenz, strukturiert, kein manuelles Eintippen |
| 2026-07-03 | Hybrid-Anreicherung | KI-Entwurf + Review für Top-30 |
| 2026-07-03 | Schema aus Use-Case ableiten | Nicht vor Matcher-Design festzurren |
| 2026-07-03 | Directus MCP als bevorzugter Weg für Schema/Daten | Reproduzierbarkeit, direkte Integration in Cursor |
| 2026-07-03 | Bilder später, einheitlicher Stil | Fokus auf Logik zuerst |
| 2026-07-03 | DE-first, kein i18n für MVP | Zielgruppe DE, Film-API ist EN; i18n = Scope-Risiko vor Abgabe |
| 2026-07-03 | Directus MCP Pflicht für Schema-Anpassungen | Reproduzierbarkeit, Session-Ende dokumentiert |
| 2026-07-09 | Dual-Theme: 1A Dark (Standard) + 1B Light (globaler Toggle) | Dunkelkammer-Ästhetik + Labor-Lesbarkeit |
| 2026-07-09 | Phase 2: Directus-API + Mock-Fallback für Matcher | Echte published Filme, robust bei Ausfall |
| 2026-07-09 | Phase 3: Grid + Filter, Detailseite, nur published | Vergleichsmodus später |
| 2026-07-09 | Phase 3.1: kombinierbare Filter (AND), Pagination, gleichhohe Kacheln | Bilder (`bild` = Rolle, Beispielbilder Phase 5) |
| 2026-07-09 | Phase 4: S/W + C-41 Rezepte, nur `/development`, Timer mit Pause | Labor-UX; Seed via `npm run data:seed:recipes` |
| 2026-07-10 | Phase 5A: Unsplash → Directus Files, kein Hotlinking | Lizenz/Attribution FHGR; Offline-fähig via CMS |
| 2026-07-10 | `beispielbilder` als files-Relation | Mehrere Looks pro Film; Quelle in File-description |
| 2026-07-10 | Seed gestaffelt (`--limit`), Rate-Limit-Abbruch | Unsplash Demo 50 Requests/h |
| 2026-07-10 | Phase 5B: sparsame Motion + reduced-motion | Hierarchie ohne UI-Lärm |
| 2026-07-10 | Impressum + Datenschutz im Footer; Favicon SVG | Rechtliche Transparenz Lehrprojekt / FHGR |

---

## Reflexion

### Phase 1

Die Grundstruktur folgt bewusst dem «Progressive Enhancement»-Prinzip: Weg A (Fragebogen) vor Weg B (KI).

### Phase 1.5

Statt das Schema blind zu definieren, wurde zuerst der Fragebogen und die Matching-Logik entworfen. Das Datenmodell wurde daraus abgeleitet – schlanker und zweckgebundener. Die Film API vermeidet manuelle Pflege von 80+ Einträgen. Der Hybrid-Ansatz bei der Anreicherung balanciert Aufwand und Qualität: Top-30 für den Matcher reviewed, Rest als Entwurf.

### Phase 1.5b

Die regelbasierte Tag-Anreicherung lieferte widersprüchliche Ergebnisse – ein klarer Fall für gezielten KI-Einsatz nur bei den 19 published Filmen. `sanitizeTags()` fängt verbleibende Inkonsistenzen ab. Der API-Key bleibt serverseitig im Enrichment-Script (nicht im Frontend). Kosten: ca. 2 Min. Laufzeit für 19 Filme.

### Phase 1.6

Design-Tokens und Komponenten wurden direkt aus den Claude-Design-Dateien (`design/`) abgeleitet. Dual-Theme mit globalem Toggle: 1A (Dunkelkammer) als Standard, 1B (Labor) für bessere Lesbarkeit. Grain-Overlay und Anton-Typografie vermitteln Analog-Ästhetik ohne Bilder. Komponenten-Bibliothek ist bereit für Phase 2 (Fragebogen).

### Phase 2

Der Fragebogen nutzt die bestehende Matcher-Logik und lädt Filme serverseitig aus Directus – mit Mock-Fallback für lokale Entwicklung ohne Docker. Die UI folgt dem 1A/1B-Design mit OptionCards, sticky Footer und kompakten Ergebnis-Karten. Weg B (KI) bleibt bewusst für eine spätere Phase.

### Phase 3

Die Datenbank nutzt dieselbe Film-API wie der Matcher. Filter-Chips und 2-Spalten-Grid folgen dem Design; Light-Mode-Karten heben sich bewusst vom Hintergrund ab. Die Detailseite zeigt die volle Charakterkarte – Grundlage für späteren Vergleichsmodus.

### Phase 3.1

Die Filter wurden von einer einfachen Zeile auf drei kombinierbare Gruppen erweitert (Typ, ISO, Charakter) – AND-Logik über die Zeilen hinweg. Pagination (12 pro Seite) hält das Grid bei wachsender Filmzahl übersichtlich. Gleichhohe Kacheln via Flexbox-Layout in Grid und AppCard. Produktfotos der Rolle (`bild`) und separate Beispielbilder bleiben bewusst für Phase 5.

### Phase 4

Der Entwicklungsassistent schliesst die dritte Säule des Produkts. Der Flow orientiert sich am Fragebogen-Pattern (sticky Footer, StepIndicator), ist aber auf Labor-Nutzung optimiert: grosser Timer, Pause/Fortsetzen, Wake Lock. Rezepte mit Quellenangabe (Massive Dev Chart, Tetenal/Bellini) decken S/W und C-41 ab. Mock-Fallback und Seed-Script machen die Entwicklung unabhängig von laufendem Directus.

### Phase 5A

Bilder kommen bewusst über Directus (nicht per Hotlink), damit Attribution, Offline-Fähigkeit und Deployment stabil bleiben. Unsplash liefert lizenzfreie Motive; die Suchbegriffe im Manifest steuern Look vs. Rollenfoto. Die UI fällt ohne Bilder auf die bisherigen Placeholder zurück – Progressive Enhancement. Rate-Limit (50/h) erzwingt gestaffeltes Seeden (`--limit=2`).

### Phase 5B

Motion bleibt sparsam: Page-Fade, gestaffelte Karten, Bild-Reveal und dezenter Grain. `prefers-reduced-motion` ist Pflicht für Usability und Bewertung (Gestaltung/Handwerk).

### Phase 5C

Impressum und Datenschutz machen das Lehrprojekt abgabetauglich (Transparenz, DSG). Favicon stärkt den Markenauftritt im Browser-Tab. Nächste Session: Weg B (KI) und Vergleichsmodus.

---

## Changelog

| Datum | Änderung |
|-------|----------|
| 2026-07-03 | Phase 1 abgeschlossen, Dokumentation.md angelegt |
| 2026-07-03 | Arbeitsweise auf Cursor-only umgestellt |
| 2026-07-03 | Phase 1.5 abgeschlossen: Fragebogen, Matcher, Datenpipeline |
| 2026-07-03 | Phase 1.5b geplant: Tag-Qualität + deutsche Inhalte |
| 2026-07-03 | Phase 1.5b abgeschlossen: 19 Filme KI-angereichert, Directus aktualisiert |
| 2026-07-03 | M2M-Relation repariert, Session-Ende dokumentiert |
| 2026-07-09 | Projektumbenennung: Frame & Grain → latenta.dev |
| 2026-07-09 | Phase 3 abgeschlossen: Datenbank-Grid, Filter, Detailseite |
| 2026-07-09 | Phase 3.1 abgeschlossen: kombinierbare Filter, Pagination, gleichhohe Kacheln |
| 2026-07-09 | Phase 4 abgeschlossen: Entwicklungsassistent mit Timer, 12 Rezepte in Directus |
| 2026-07-10 | Phase 5A: beispielbilder-Schema, Asset-Helper, AppCard/Detail, Unsplash-Seed |
| 2026-07-10 | `bild`→`directus_files`-Relation; Seed mit `--limit` wegen Unsplash 50/h |
| 2026-07-10 | Phase 5B: Page-Transition, Stagger, Bild-Reveal, Grain, reduced-motion |
| 2026-07-10 | Phase 5C: Impressum, Datenschutz, Favicon |
