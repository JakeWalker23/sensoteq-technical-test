import type { Request, Response, NextFunction } from 'express'
import { listFilmsByCategory, searchFilms } from '../services/FilmsService.js'
import { FilmSearchQuerySchema } from '../validators/Film.js';

export async function getFilmsByCategory(req: Request, res: Response) {
  try {
    const categoryName = String(req.query.category_name ?? '')
    
    const films = await listFilmsByCategory(categoryName)
    
    return res.status(200).json(films)
  } catch (err: any) {
    if (err?.message === 'category_name is required') {
      return res.status(400).json({ error: err.message })
    }

    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export async function getFilms(req: Request, res: Response, next: NextFunction) {
  try {
    const query = FilmSearchQuerySchema.parse(req.query);
    const rows = await searchFilms(query);
    return res.json({ count: rows.length, results: rows });
  } catch (e: any) {
    if (e?.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid query', details: e.errors });
    }
    return next(e);
  }
}