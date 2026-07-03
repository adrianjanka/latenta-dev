import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import tagDefinitions from '../data/stimmungs-tags.json'
import type { FilmstockInput } from '../types/filmstock'
import { directusFetch } from './lib/directus'

const INPUT = resolve(process.cwd(), 'data/filmstocks.enriched.json')

interface DirectusTag {
  id: string
  slug: string
}

interface JunctionRow {
  id: number
}

async function seedTags(): Promise<Map<string, string>> {
  const slugToId = new Map<string, string>()

  for (const tag of tagDefinitions) {
    const existing = await directusFetch<{ data: DirectusTag[] }>(
      `/items/stimmungs_tags?filter[slug][_eq]=${tag.slug}&limit=1`,
    )

    if (existing.data.length > 0) {
      slugToId.set(tag.slug, existing.data[0].id)
      continue
    }

    const created = await directusFetch<{ data: DirectusTag }>('/items/stimmungs_tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    })
    slugToId.set(tag.slug, created.data.id)
    console.log(`  Tag: ${tag.slug}`)
  }

  return slugToId
}

async function clearTagLinks(filmId: string) {
  const existing = await directusFetch<{ data: JunctionRow[] }>(
    `/items/filmstocks_stimmungs_tags?filter[filmstocks_id][_eq]=${filmId}&fields=id&limit=-1`,
  )

  for (const row of existing.data) {
    await directusFetch(`/items/filmstocks_stimmungs_tags/${row.id}`, { method: 'DELETE' })
  }
}

/** M2M nur über Junction-Tabelle – nie Tag-UUIDs direkt im filmstocks-POST */
async function linkTags(filmId: string, tagIds: string[]) {
  for (const tagId of tagIds) {
    await directusFetch('/items/filmstocks_stimmungs_tags', {
      method: 'POST',
      body: JSON.stringify({ filmstocks_id: filmId, stimmungs_tags_id: tagId }),
    })
  }
}

async function syncFilmTags(filmId: string, tagIds: string[]) {
  await clearTagLinks(filmId)
  if (tagIds.length > 0) {
    await linkTags(filmId, tagIds)
  }
}

async function seedFilmstocks(slugToId: Map<string, string>) {
  const films: FilmstockInput[] = JSON.parse(readFileSync(INPUT, 'utf-8'))
  let created = 0
  let updated = 0

  for (const film of films) {
    const existing = await directusFetch<{ data: { id: string }[] }>(
      `/items/filmstocks?filter[externe_id][_eq]=${film.externe_id}&limit=1`,
    )

    const { stimmungs_tags, ...filmData } = film
    const tagSlugs = (stimmungs_tags ?? []) as string[]
    const tagIds = tagSlugs.map(s => slugToId.get(s)).filter(Boolean) as string[]

    if (existing.data.length > 0) {
      const id = existing.data[0].id
      await directusFetch(`/items/filmstocks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(filmData),
      })
      await syncFilmTags(id, tagIds)
      updated++
      continue
    }

    const result = await directusFetch<{ data: { id: string } }>('/items/filmstocks', {
      method: 'POST',
      body: JSON.stringify(filmData),
    })

    if (tagIds.length > 0) {
      await linkTags(result.data.id, tagIds)
    }

    created++
  }

  console.log(`  ${created} erstellt, ${updated} aktualisiert`)
}

async function main() {
  console.log('Seede Directus...')
  const slugToId = await seedTags()
  console.log(`${slugToId.size} Tags bereit`)
  await seedFilmstocks(slugToId)
  console.log('Fertig.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
