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
    .select(({ ref }) => [
      ref('f.film_id').as('film_id'),
      ref('f.title').as('title'),
      ref('f.description').as('description'),
      sql<number>`CAST(${ref('f.rental_rate')} AS float8)`.as('rental_rate'),
    ])
    .where(sql`LOWER(${sql.ref('c.name')})`, '=', name.toLowerCase())
    .execute()

  return rows
}
