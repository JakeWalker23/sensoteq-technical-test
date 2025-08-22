import express from 'express'
import { getFilmsByCategory, deleteFilm} from './controllers/FilmsController.js'

export function buildApp() {
  const app = express()
  app.use(express.json())

  app.get('/films', getFilmsByCategory)
  app.delete('/films/:id', deleteFilm)

  return app
}