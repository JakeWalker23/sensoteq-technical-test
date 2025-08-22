import { findFilmsByCategory, type FilmSummary } from '../models/FilmsModel.js'
import { removeFilm } from '../models/FilmsModel.js'

export async function listFilmsByCategory(categoryName: string): Promise<FilmSummary[]> {
  if (!categoryName || !categoryName.trim()) {
    throw new Error('category_name is required')
  }
  return findFilmsByCategory(categoryName)
}

export async function deleteFilmById(filmId: number): Promise<boolean> {
  const rowsAffected = await removeFilm(filmId)
  return rowsAffected > 0
}