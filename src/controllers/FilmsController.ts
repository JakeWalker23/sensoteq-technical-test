import type { Request, Response } from 'express'
import { listFilmsByCategory, deleteFilmById } from '../services/FilmsService.js'

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


export async function deleteFilm(req: Request, res: Response) {
  const { id } = req.params

  const filmId = Number(id)
  if (Number.isNaN(filmId)) {
    return res.status(400).json({ error: 'Invalid film id' })
  }

  try {
    const deleted = await deleteFilmById(filmId)
    if (!deleted) {
      return res.status(404).json({ error: 'Film not found' })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Error deleting film:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}