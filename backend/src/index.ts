import { buildApp } from './app.js'
import { closeDb } from './db/kysely.js'

const port = Number(process.env.PORT ?? 3000)
const app = buildApp()

const server = app.listen(port, '0.0.0.0', () => {
  console.log('DB URL present:', Boolean(process.env.DATABASE_URL));
  console.log(`API listening on http://0.0.0.0:${port}`)
})

process.on('SIGINT', async () => { await closeDb(); server.close(() => process.exit(0)) })
process.on('SIGTERM', async () => { await closeDb(); server.close(() => process.exit(0)) })