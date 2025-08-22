import express from 'express'
import { getFilmsByCategory } from './controllers/FilmsController.js'

export function buildApp() {
  const app = express()
  app.use(express.json())

  app.get('/films', getFilmsByCategory)

  return app
}