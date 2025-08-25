import { db, type Executor } from '../db/kysely.js';
import { findFilmsByCategory, type FilmSummary, FilmModel } from '../models/FilmsModel.js'
import type { FilmSearchQuery } from '../validators/Film.js';

export async function listFilmsByCategory(categoryName: string): Promise<FilmSummary[]> {
  if (!categoryName || !categoryName.trim()) {
    throw new Error('category_name is required')
  }
  return findFilmsByCategory(categoryName)
}


export async function searchFilms(query: FilmSearchQuery, exec: Executor = db) {
  return FilmModel.search(exec, query);
}