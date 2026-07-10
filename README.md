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
npm run data:seed:images # Optional: Unsplash → Rollenfotos + Beispiele (braucht UNSPLASH_ACCESS_KEY)
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
| `npm run data:seed:recipes` | Entwicklungsrezepte → Directus |
| `npm run data:seed:images` | Unsplash → Directus Files (Rollenfotos + Beispiele); gestaffelt: `-- --limit=2` |
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
- `entwicklungsrezepte` – 12 published Rezepte (S/W + C-41), `npm run data:seed:recipes`

Details: [docker/SCHEMA.md](docker/SCHEMA.md)

## Aktueller Stand (10. Juli 2026)

| Erledigt | Ausstehend |
|----------|------------|
| Design, Fragebogen (Weg A), Datenbank, Entwicklungsassistent | Restliche Unsplash-Bilder (gestaffelt) |
| Bild-Infrastruktur (5A) + Motion (5B) | KI-Bildanalyse Weg B |
| Film-API-Pipeline, KI-Anreicherung | Vergleichsmodus Datenbank |

Nächster Schritt: Bilder nachfüllen (`npm run data:seed:images -- --limit=2`); optional Weg B. Siehe [Dokumentation.md](Dokumentation.md).

## Dokumentation

Fortlaufendes Entwicklungsjournal mit Entscheidungen und Reflexion: [Dokumentation.md](Dokumentation.md)

## Lizenz & Quellen

Film-Daten: [Film API](https://filmapi.vercel.app/api/films) (MIT). Entwicklungsrezepte mit Quellenangabe im `quelle`-Feld. Bilder: Unsplash (Attribution in `bild_quelle` / File-description), nur lizenzfrei.

## Autor

Adrian Janka – [FHGR](https://www.fhgr.ch) Bachelor Multimedia Production (mmp23c)
