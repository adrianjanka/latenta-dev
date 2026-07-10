/**
 * Directus Asset-URLs für Filmstock-Bilder (Rollenfoto + Beispielaufnahmen).
 */

export interface DirectusAssetOptions {
  width?: number
  height?: number
  quality?: number
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
}

function resolveFileId(file: string | { id: string } | null | undefined): string | null {
  if (!file) return null
  if (typeof file === 'string') return file
  return file.id ?? null
}

export function useDirectusAsset() {
  const config = useRuntimeConfig()
  const baseUrl = (config.public.directusUrl as string | undefined)?.replace(/\/$/, '') ?? ''

  function assetUrl(
    file: string | { id: string } | null | undefined,
    options: DirectusAssetOptions = {},
  ): string | null {
    const id = resolveFileId(file)
    if (!id || !baseUrl) return null

    const params = new URLSearchParams()
    if (options.width) params.set('width', String(options.width))
    if (options.height) params.set('height', String(options.height))
    if (options.quality) params.set('quality', String(options.quality))
    if (options.fit) params.set('fit', options.fit)

    const query = params.toString()
    return `${baseUrl}/assets/${id}${query ? `?${query}` : ''}`
  }

  return { assetUrl }
}
