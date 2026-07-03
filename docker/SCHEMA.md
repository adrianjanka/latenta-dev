# Directus-Datenmodell – MVP (Phase 1.5)

Abgeleitet aus Use-Case-Analyse und Matching-Logik für Weg A.

## `stimmungs_tags`

| Feld | Typ | Zweck |
|------|-----|-------|
| `id` | uuid | PK |
| `name` | string | Anzeigename |
| `slug` | string | API/Filter (eindeutig) |
| `kategorie` | enum: `licht`, `stimmung`, `motiv`, `aesthetik` | Fragebogen-Gruppierung |

Seed-Daten: [`data/stimmungs-tags.json`](../data/stimmungs-tags.json)

## `filmstocks`

| Feld | Typ | Zweck |
|------|-----|-------|
| `id` | uuid | PK |
| `name` | string | z.B. «Portra 400» |
| `hersteller` | string | z.B. «Kodak» |
| `iso` | integer | 50–3200 |
| `typ` | enum: `farbe`, `s_w` | Farbe oder S/W |
| `format` | json | `["35mm"]` (MVP) |
| `koernung` | enum: `fein`, `mittel`, `grob` | Charakterkarte |
| `farbcharakter` | text | Ein Satz, Einsteiger-Sprache |
| `kontrast` | enum: `niedrig`, `mittel`, `hoch` | |
| `belichtungstoleranz` | enum: `eng`, `normal`, `weit` | |
| `beschreibung` | text | Kurzbeschreibung (DE, Einsteiger-Sprache) |
| `beschreibung_en` | text, optional | Original/englische Quellbeschreibung |
| `bild` | file (image), optional | Später Wikimedia/Unsplash |
| `bild_quelle` | string, optional | Quellenangabe für Bilder |
| `stimmungs_tags` | m2m → `stimmungs_tags` | Empfehlungslogik |
| `externe_quelle` | string | z.B. «Film API (MIT)» |
| `externe_id` | string | Referenz zur Film API |
| `status` | enum: `draft`, `published` | Top-30 = published |

## `entwicklungsrezepte` (Schema only, Phase 3)

| Feld | Typ | Zweck |
|------|-----|-------|
| `id` | uuid | PK |
| `filmstock` | m2o → `filmstocks` | |
| `entwickler` | string | z.B. «HC-110» |
| `verduennung` | string | z.B. «B» |
| `temperatur` | decimal | °C |
| `zeit_sekunden` | integer | Entwicklungszeit |
| `agitation` | text | Schüttelhinweise |
| `schritte` | json | Timer-Assistent |
| `quelle` | string | Pflicht – z.B. «Massive Dev Chart» |
| `status` | enum: `draft`, `published` | |

## M2M-Junction

`filmstocks_stimmungs_tags` – Verknüpfung zwischen `filmstocks` und `stimmungs_tags`.

Junction-Felder brauchen `meta` mit `special: ['m2o']` und korrekte Relations (`one_field`, `junction_field`). Bei Admin-UI-Fehlern: `npm run directus:setup` (Reparatur) oder Directus MCP.

## Einrichtung

**Schema-Anpassungen:** Directus MCP (`user-frame-and-grain directus`) – bevorzugt.  
**Bulk-Import:** npm-Scripts.

```bash
npm run directus:setup   # Collections + M2M-Reparatur
npm run data:fetch       # Film API → data/filmstocks.raw.json (gitignored)
npm run data:transform   # → data/filmstocks.transformed.json (gitignored)
npm run data:enrich      # → data/filmstocks.enriched.json (Seed-Quelle, committed)
npm run data:seed        # enriched.json → Directus
```

Static Token in `.env` als `DIRECTUS_TOKEN` (Admin-Rechte für Setup).
