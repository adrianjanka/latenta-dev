# latenta.dev

Webapplikation für Analogfotograf:innen – Lehrprojekt Bachelor Multimedia Production (mmp23c), FHGR. Abgabetermin: **7. August 2026**.

## Über das Projekt

latenta.dev unterstützt Analogfotograf:innen in drei Bereichen:

- **Film Decision Helper** – Filmempfehlung via Fragebogen (Weg A) und KI-Bildanalyse (Weg B)
- **Filmstock-Datenbank** – Charakterkarten, Filter, Vergleichsmodus
- **Entwicklungsassistent** – Schritt-für-Schritt-Laborbegleitung mit Timer, mobil optimiert

## Technologie-Stack

| Bereich | Technologie |
|---------|-------------|
| Frontend | Nuxt 3, Vue 3, Tailwind CSS |
| CMS / Datenbank | Directus (lokal via Docker/Postgres) |
| Deployment | Vercel |
| KI | Anthropic Claude API (serverseitig) |

## Voraussetzungen

- Node.js 20+
- npm
- Docker & Docker Compose

## Lokales Setup

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen

```bash
cp .env.example .env
```

`DIRECTUS_TOKEN` und optional `ANTHROPIC_API_KEY` setzen. Keys bleiben serverseitig.

### 3. Directus starten

```bash
docker compose -f docker/docker-compose.yml up -d
```

Directus Admin: http://localhost:8055 (`adi.janka@bluewin.ch` / `directus`)

### 4. Schema & Daten

```bash
npm run directus:setup   # Collections anlegen
npm run data:seed        # Aus data/filmstocks.enriched.json importieren
```

Volle Pipeline (Film API neu holen + KI-Anreicherung): `npm run data:pipeline && npm run data:seed`

### 5. Entwicklungsserver

```bash
npm run dev
```

App: http://localhost:3000

## npm-Scripts

| Befehl | Zweck |
|--------|-------|
| `npm run dev` | Nuxt Dev-Server |
| `npm run build` | Production-Build |
| `npm run directus:setup` | Directus-Schema + M2M-Reparatur |
| `npm run data:pipeline` | fetch → transform → enrich |
| `npm run data:seed` | enriched.json → Directus |
| `npm run test:recommendation` | Matcher gegen Mock-Daten testen |

## Projektstruktur

```
latenta-dev/
├── components/          # UI nach Bereich (decision-helper, database, shared, …)
├── composables/         # useDirectus, useFilmRecommendation, …
├── data/                # Fragebogen, Tags, enriched JSON
├── scripts/             # Datenpipeline, Directus-Setup
├── server/api/          # KI-Bildanalyse (serverseitig)
├── types/               # TypeScript ↔ Directus-Schema
├── docker/              # Directus + Postgres, SCHEMA.md
└── Dokumentation.md     # Entwicklungsjournal
```

## Directus-Datenmodell

- `filmstocks` – 121 Filme (19 published für Matcher)
- `stimmungs_tags` – 25 Tags für Empfehlungslogik
- `entwicklungsrezepte` – Schema vorhanden, Phase 3

Details: [docker/SCHEMA.md](docker/SCHEMA.md)

## Aktueller Stand (9. Juli 2026)

| Erledigt | Ausstehend |
|----------|------------|
| Nuxt-Fundament, Directus + Daten | Fragebogen-UI (Phase 2) |
| Fragebogen-Logik + Matcher (Mock) | KI-Bildanalyse Weg B |
| Film-API-Pipeline, KI-Anreicherung | Datenbank-UI, Entwicklungsassistent |
| Placeholder-Komponenten | **Phase 1.6: Figma Design** |

Nächster Schritt: Design Foundation in Figma, dann Fragebogen-UI. Siehe [Dokumentation.md](Dokumentation.md).

## Dokumentation

Fortlaufendes Entwicklungsjournal mit Entscheidungen und Reflexion: [Dokumentation.md](Dokumentation.md)

## Lizenz & Quellen

Film-Daten: [Film API](https://filmapi.vercel.app/api/films) (MIT). Entwicklungsrezepte mit Quellenangabe im `quelle`-Feld. Bilder nur lizenzfrei.

## Autor

Adrian Janka – [FHGR](https://www.fhgr.ch) Bachelor Multimedia Production (mmp23c)
