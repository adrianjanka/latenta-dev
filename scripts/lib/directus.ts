import { DIRECTUS_TOKEN, DIRECTUS_URL } from './env'

export async function directusFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${DIRECTUS_URL()}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIRECTUS_TOKEN()}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Directus ${response.status}: ${body}`)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export async function collectionExists(name: string): Promise<boolean> {
  try {
    await directusFetch(`/collections/${name}`)
    return true
  }
  catch {
    return false
  }
}
