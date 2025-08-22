import { db } from '../db/kysely.js'
import { sql } from 'kysely'

export interface FilmSummary {
  film_id: number
  title: string
  description: string | null
  rental_rate: number
}

export async function findFilmsByCategory(categoryName: string): Promise<FilmSummary[]> {
  const name = categoryName.trim()

  const rows = await db
    .selectFrom('category as c')
    .innerJoin('film_category as fc', 'c.category_id', 'fc.category_id')
    .innerJoin('film as f', 'fc.film_id', 'f.film_id')
    .select([
      'f.film_id as film_id',
      'f.title as title',
      'f.description as description',
      // direct cast to number in SQL:
      sql<number>`f.rental_rate::float8`.as('rental_rate'),
    ])
    .where('c.name', 'ilike', name)   // case-insensitive match
    .orderBy('f.title asc')
    .execute()

  return rows
}
