import express from 'express'
import { getFilmsByCategory, getFilms} from './controllers/FilmsController.js'
import { deleteCustomer, postCreateCustomer } from './controllers/CustomersController.js'

export function buildApp() {
  const app = express()
  app.use(express.json())

  app.get('/films', getFilmsByCategory)
  app.post('/customers', postCreateCustomer);
  app.delete('/customers/:customer_id', deleteCustomer)
  app.get('/films/search', getFilms);

  app.use((err: any, _req: any, res: any, _next: any) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });


  return app
}
