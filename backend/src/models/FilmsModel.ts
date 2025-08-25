import { db, type Executor } from '../db/kysely.js'
import { sql } from 'kysely'
import type { FilmSearchQuery } from '../validators/Film.js';


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

export interface FilmSearchRow {
  film_id: number;
  title: string;
  length: number | null;
  language: string;
  categories: string[]; // aggregated
}

export const FilmModel = {
  async search(exec: Executor, q: FilmSearchQuery): Promise<FilmSearchRow[]> {
    let qb = exec
      .selectFrom('film as f')
      .innerJoin('language as l', 'l.language_id', 'f.language_id')
      .leftJoin('film_category as fc', 'fc.film_id', 'f.film_id')
      .leftJoin('category as c', 'c.category_id', 'fc.category_id')
      .select([
        'f.film_id as film_id',
        'f.title as title',
        'f.length as length',
        'l.name as language',
        // categories as array_agg(distinct ...)
        sql<string[]>`coalesce(array_agg(distinct c.name) filter (where c.name is not null), '{}')`.as('categories'),
      ])
      .groupBy(['f.film_id', 'l.name']);

    if (q.title) {
      qb = qb.where('f.title', 'ilike', `%${q.title}%`);
    }
    if (typeof q.length === 'number') {
      qb = qb.where('f.length', '<=', q.length);
    }

    qb = qb
      .orderBy('f.title asc')
      .limit(q.limit ?? 50)
      .offset(q.offset ?? 0);

    return qb.execute();
  },
};