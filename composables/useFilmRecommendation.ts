import type { QuestionnaireAnswers } from '~/data/questionnaire'
import { MOCK_FILMSTOCKS } from '~/data/filmstocks.mock'
import type { Filmstock } from '~/types/filmstock'
import { recommendFilms, type FilmRecommendation } from '~/utils/recommendation'

export type FilmstockSource = 'directus' | 'mock'

interface FilmstocksApiResponse {
  data: Filmstock[]
  source: FilmstockSource
}

export function useFilmRecommendation() {
  const filmstocks = ref<Filmstock[]>([])
  const source = ref<FilmstockSource>('mock')
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadFilmstocks(): Promise<Filmstock[]> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<FilmstocksApiResponse>('/api/filmstocks')
      filmstocks.value = response.data
      source.value = response.source
      return response.data
    }
    catch {
      filmstocks.value = MOCK_FILMSTOCKS
      source.value = 'mock'
      error.value = 'Directus nicht erreichbar – Mock-Daten verwendet'
      return MOCK_FILMSTOCKS
    }
    finally {
      loading.value = false
    }
  }

  function getRecommendations(
    answers: QuestionnaireAnswers,
    stocks: Filmstock[] = filmstocks.value.length ? filmstocks.value : MOCK_FILMSTOCKS,
    limit = 3,
  ): FilmRecommendation[] {
    return recommendFilms(stocks, answers, limit)
  }

  async function getRecommendationsFromAnswers(
    answers: QuestionnaireAnswers,
    limit = 3,
  ): Promise<FilmRecommendation[]> {
    const stocks = filmstocks.value.length
      ? filmstocks.value
      : await loadFilmstocks()
    return getRecommendations(answers, stocks, limit)
  }

  return {
    filmstocks,
    source,
    loading,
    error,
    loadFilmstocks,
    getRecommendations,
    getRecommendationsFromAnswers,
    mockFilmstocks: MOCK_FILMSTOCKS,
  }
}
