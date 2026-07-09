# latenta.dev – Projektdokumentation

Fortlaufendes Entwicklungsjournal für das Lehrprojekt (FHGR, mmp23c).  
Abgabetermin: **7. August 2026**

> Diese Datei wird bei jeder relevanten Projektphase aktualisiert – Entscheidungen, Umsetzung, Reflexion.

---

## Aktueller Stand (9. Juli 2026)

**Umbenennung:** Projekt heisst ab sofort **latenta.dev** (ehemals Frame & Grain).

**Erledigt:** Phasen 1, 1.5 und 1.5b – Fundament, Fragebogen-Logik, Matcher, Directus-Daten (121 Filme, 19 published), KI-Anreicherung, M2M-Relation repariert.

**Nächster Schritt:** Phase 1.6 – Design Foundation (Adrian: Figma/Claude Design offline), danach Phase 2 Fragebogen-UI.

| Was | Wo nachschlagen |
|-----|-----------------|
| Cursor-Plan Phase 1.6 | `.cursor/plans/phase_1.6_design_foundation.plan.md` |
| Directus Schema | `docker/SCHEMA.md` |
| Fragebogen | `data/questionnaire.ts` |
| Seed-Daten | `data/filmstocks.enriched.json` |
| Matcher testen | `npm run test:recommendation` |

**Figma (Adrian):** Moodboard → Key Screens (Start, Fragebogen, Top 3) → Komponenten → URL in diese Datei eintragen.

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

## Phase 1.6 – Design Foundation (ausstehend)

**Ziel:** Visuelles Fundament vor der Fragebogen-UI – nicht im Wireframe-Look bauen.

**Adrian (offline):**
1. Moodboard (Analog-Ästhetik, warm/material)
2. Claude Design für erste Exploration → in Figma verfeinern
3. Key Screens: Startseite, Fragebogen (1 Schritt), Ergebnis Top 3, optional Filmstock-Karte
4. Komponenten: Button, Card, Tag, StepIndicator
5. Figma-URL hier eintragen: _noch offen_

**Cursor (nächste Session):**
1. Design Tokens in `tailwind.config.ts`
2. `components/shared/`: `AppButton`, `AppCard`, `AppTag`, `StepIndicator`
3. Startseite visuell überarbeiten
4. → Phase 2: Fragebogen-UI

---

## Design & UX – Roadmap

| Phase | Inhalt | Status |
|-------|--------|--------|
| 1.5 | UX-Flows, Placeholder-Komponenten | Erledigt |
| 1.5b | KI-Tags + DE-Übersetzung published Filme | Erledigt |
| **1.6** | Figma, Design Tokens, Key Screens | **Ausstehend (Adrian)** |
| 2 | Fragebogen + Ergebnis im finalen Look | Geplant |
| 3–4 | Datenbank + Entwicklungsassistent | Geplant |
| 5 | Polish, Bilder, Animationen | Geplant |

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
| 2026-07-09 | Projektumbenennung zu latenta.dev | Neuer Markenname, technischer Slug latenta-dev |
| 2026-07-03 | Session-Ende: Phasen 1–1.5b abgeschlossen, Phase 1.6 als Nächstes | Adrian: Figma offline |

---

## Reflexion

### Phase 1

Die Grundstruktur folgt bewusst dem «Progressive Enhancement»-Prinzip: Weg A (Fragebogen) vor Weg B (KI).

### Phase 1.5

Statt das Schema blind zu definieren, wurde zuerst der Fragebogen und die Matching-Logik entworfen. Das Datenmodell wurde daraus abgeleitet – schlanker und zweckgebundener. Die Film API vermeidet manuelle Pflege von 80+ Einträgen. Der Hybrid-Ansatz bei der Anreicherung balanciert Aufwand und Qualität: Top-30 für den Matcher reviewed, Rest als Entwurf.

### Phase 1.5b

Die regelbasierte Tag-Anreicherung lieferte widersprüchliche Ergebnisse – ein klarer Fall für gezielten KI-Einsatz nur bei den 19 published Filmen. `sanitizeTags()` fängt verbleibende Inkonsistenzen ab. Der API-Key bleibt serverseitig im Enrichment-Script (nicht im Frontend). Kosten: ca. 2 Min. Laufzeit für 19 Filme.

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
| 2026-07-09 | GitHub-Repo → `latenta-dev`, MCP → `latenta.dev directus` |
