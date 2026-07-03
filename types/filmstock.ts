/**
 * TypeScript-Interfaces synchron zum Directus-Datenmodell.
 */

export type FilmTyp = 'farbe' | 's_w'
export type FilmFormat = '35mm' | '120'
export type Koernung = 'fein' | 'mittel' | 'grob'
export type Kontrast = 'niedrig' | 'mittel' | 'hoch'
export type Belichtungstoleranz = 'eng' | 'normal' | 'weit'
export type PublishStatus = 'draft' | 'published'
export type StimmungsTagKategorie = 'licht' | 'stimmung' | 'motiv' | 'aesthetik'

export interface DirectusFile {
  id: string
  filename_download?: string
}

export interface StimmungsTag {
  id: string
  name: string
  slug: string
  kategorie: StimmungsTagKategorie
}

export interface Entwicklungsschritt {
  titel: string
  beschreibung: string
  dauer_sekunden?: number
}

export interface Filmstock {
  id: string
  name: string
  hersteller: string
  iso: number
  typ: FilmTyp
  format: FilmFormat[]
  koernung: Koernung
  farbcharakter: string
  kontrast: Kontrast
  belichtungstoleranz: Belichtungstoleranz
  beschreibung: string
  beschreibung_en?: string | null
  bild?: string | DirectusFile | null
  bild_quelle?: string | null
  stimmungs_tags?: StimmungsTag[] | string[]
  externe_quelle?: string | null
  externe_id?: string | null
  status: PublishStatus
}

export interface Entwicklungsrezept {
  id: string
  filmstock: string | Filmstock
  entwickler: string
  verduennung: string
  temperatur: number
  zeit_sekunden: number
  agitation: string
  schritte: Entwicklungsschritt[]
  quelle: string
  status: PublishStatus
}

export interface DirectusListResponse<T> {
  data: T[]
}

export interface DirectusItemResponse<T> {
  data: T
}

/** Filmstock ohne Directus-ID – für Import/Seed */
export type FilmstockInput = Omit<Filmstock, 'id'> & { id?: string }

export interface FilmApiRecord {
  _id: string
  brand: string
  name: string
  iso: number
  formatThirtyFive: boolean
  formatOneTwenty: boolean
  color: boolean
  process: string
  description: string
  keyFeatures?: Array<{ feature: string }>
}
