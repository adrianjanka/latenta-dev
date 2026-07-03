import type { QuestionnaireAnswers } from '~/data/questionnaire'
import { MOCK_FILMSTOCKS } from '~/data/filmstocks.mock'
import type { Filmstock } from '~/types/filmstock'
import { recommendFilms, type FilmRecommendation } from '~/utils/recommendation'

export function useFilmRecommendation() {
  function getRecommendations(
    answers: QuestionnaireAnswers,
    filmstocks: Filmstock[] = MOCK_FILMSTOCKS,
    limit = 3,
  ): FilmRecommendation[] {
    return recommendFilms(filmstocks, answers, limit)
  }

  return {
    getRecommendations,
    mockFilmstocks: MOCK_FILMSTOCKS,
  }
}
