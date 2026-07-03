import type { DirectusItemResponse, DirectusListResponse } from '~/types/filmstock'

type DirectusQuery = Record<string, string | number | boolean | undefined>

export function useDirectus() {
  const config = useRuntimeConfig()

  const baseUrl = config.public.directusUrl as string

  async function fetchItems<T>(
    collection: string,
    query: DirectusQuery = {},
  ): Promise<T[]> {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value))
      }
    }

    const url = `${baseUrl}/items/${collection}${params.toString() ? `?${params}` : ''}`

    const response = await $fetch<DirectusListResponse<T>>(url)
    return response.data
  }

  async function fetchItem<T>(
    collection: string,
    id: string,
    query: DirectusQuery = {},
  ): Promise<T> {
    const params = new URLSearchParams()

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        params.set(key, String(value))
      }
    }

    const url = `${baseUrl}/items/${collection}/${id}${params.toString() ? `?${params}` : ''}`

    const response = await $fetch<DirectusItemResponse<T>>(url)
    return response.data
  }

  return {
    fetchItems,
    fetchItem,
  }
}
