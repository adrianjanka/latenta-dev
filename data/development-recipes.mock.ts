import type { Entwicklungsrezept } from '~/types/filmstock'

const BW_FINISH_STEPS = [
  { titel: 'Stopbad', beschreibung: '30 Sekunden kräftig schütteln.', dauer_sekunden: 30 },
  { titel: 'Fixieren', beschreibung: '5 Minuten – alle 60 Sekunden 10 Sekunden schütteln.', dauer_sekunden: 300 },
  { titel: 'Waschen', beschreibung: '10 Minuten unter fliessendem Wasser.', dauer_sekunden: 600 },
  { titel: 'Trocknen', beschreibung: 'Film vorsichtig abtropfen lassen und hängen.' },
] as const

function bwRecipe(
  id: string,
  filmstockId: string,
  entwickler: string,
  verduennung: string,
  temperatur: number,
  zeit_sekunden: number,
  agitation: string,
  quelle: string,
): Entwicklungsrezept {
  return {
    id,
    filmstock: filmstockId,
    entwickler,
    verduennung,
    temperatur,
    zeit_sekunden,
    agitation,
    quelle,
    status: 'published',
    schritte: [
      {
        titel: 'Chemikalien mischen',
        beschreibung: `Entwickler auf ${temperatur}°C temperieren. Tank und Spirale bereitstellen.`,
      },
      {
        titel: 'Entwickeln',
        beschreibung: agitation,
        dauer_sekunden: zeit_sekunden,
      },
      ...BW_FINISH_STEPS.map(step => ({ ...step })),
    ],
  }
}

function c41Recipe(
  id: string,
  filmstockId: string,
  entwickler: string,
  temperatur: number,
  developSeconds: number,
  quelle: string,
): Entwicklungsrezept {
  return {
    id,
    filmstock: filmstockId,
    entwickler,
    verduennung: 'Kit-Komplettlösung',
    temperatur,
    zeit_sekunden: developSeconds,
    agitation: 'Erste 30 Sekunden kontinuierlich schütteln, danach alle 30 Sekunden 5 Sekunden.',
    quelle,
    status: 'published',
    schritte: [
      {
        titel: 'Chemikalien temperieren',
        beschreibung: `Alle Bäder auf ${temperatur}°C bringen. Dunkelkammer bereit.`,
      },
      {
        titel: 'Vorbad',
        beschreibung: '1 Minute – gleichmässige Temperatur im Film.',
        dauer_sekunden: 60,
      },
      {
        titel: 'Entwickeln',
        beschreibung: 'Erste 30s kontinuierlich schütteln, dann alle 30s 5s schütteln.',
        dauer_sekunden: developSeconds,
      },
      {
        titel: 'Bleach-Fix',
        beschreibung: '6 Minuten 30 Sekunden – alle 30 Sekunden 5 Sekunden schütteln.',
        dauer_sekunden: 390,
      },
      {
        titel: 'Waschen',
        beschreibung: '3 Minuten unter fliessendem Wasser (Stabilisator-Bad folgt).',
        dauer_sekunden: 180,
      },
      {
        titel: 'Stabilisator',
        beschreibung: '1 Minute – Film nicht abtropfen lassen vor dem Trocknen.',
        dauer_sekunden: 60,
      },
      {
        titel: 'Trocknen',
        beschreibung: 'Film hängen – Staub vermeiden.',
      },
    ],
  }
}

/** Mock-Rezepte – filmstock-IDs entsprechen MOCK_FILMSTOCKS */
export const MOCK_DEVELOPMENT_RECIPES: Entwicklungsrezept[] = [
  // S/W
  bwRecipe(
    'r-bw-1',
    '5',
    'Kodak D-76',
    '1+1',
    20,
    510,
    'Erste 30 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 5 Sekunden.',
    'Massive Dev Chart – Kodak Tri-X 400',
  ),
  bwRecipe(
    'r-bw-2',
    '5',
    'Kodak HC-110',
    'Dil. B',
    20,
    390,
    'Erste 30 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 5 Sekunden.',
    'Massive Dev Chart – Kodak Tri-X 400',
  ),
  bwRecipe(
    'r-bw-3',
    '6',
    'Ilford ID-11',
    '1+1',
    20,
    510,
    'Erste 60 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 10 Sekunden.',
    'Massive Dev Chart – Ilford HP5 Plus',
  ),
  bwRecipe(
    'r-bw-4',
    '6',
    'Kodak D-76',
    '1+1',
    20,
    450,
    'Erste 30 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 5 Sekunden.',
    'Massive Dev Chart – Ilford HP5 Plus',
  ),
  bwRecipe(
    'r-bw-5',
    '8',
    'Ilford ID-11',
    '1+1',
    20,
    480,
    'Erste 60 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 10 Sekunden.',
    'Massive Dev Chart – Ilford FP4 Plus',
  ),
  bwRecipe(
    'r-bw-6',
    '8',
    'Kodak D-76',
    '1+1',
    20,
    420,
    'Erste 30 Sekunden kontinuierlich schütteln, danach alle 60 Sekunden 5 Sekunden.',
    'Massive Dev Chart – Ilford FP4 Plus',
  ),
  // C-41
  c41Recipe('r-c41-1', '1', 'Tetenal Colortec C-41', 38, 195, 'Tetenal Colortec C-41 Kit – Kodak Portra 400'),
  c41Recipe('r-c41-2', '2', 'Tetenal Colortec C-41', 38, 180, 'Tetenal Colortec C-41 Kit – Kodak Gold 200'),
  c41Recipe('r-c41-3', '3', 'Bellini C-41', 38, 195, 'Bellini C-41 Monopart – Kodak Ultramax 400'),
  c41Recipe('r-c41-4', '4', 'Tetenal Colortec C-41', 38, 195, 'Tetenal Colortec C-41 Kit – Kodak Ektar 100'),
  c41Recipe('r-c41-5', '7', 'Tetenal Colortec C-41', 38, 210, 'Tetenal Colortec C-41 Kit – CineStill 800T'),
  c41Recipe('r-c41-6', '10', 'Tetenal Colortec C-41', 38, 195, 'Tetenal Colortec C-41 Kit – Kodak ProImage 100'),
]
