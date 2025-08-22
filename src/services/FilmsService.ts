import { findFilmsByCategory, type FilmSummary } from '../models/FilmsModel.js'

export async function listFilmsByCategory(categoryName: string): Promise<FilmSummary[]> {
  if (!categoryName || !categoryName.trim()) {
    throw new Error('category_name is required')
  }
  return findFilmsByCategory(categoryName)
}
