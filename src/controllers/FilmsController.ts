import type { Request, Response } from 'express'
import { listFilmsByCategory } from '../services/FilmsService.js'

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
