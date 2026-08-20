import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import ingestRoute from './routes/ingest.js'
import searchRoute from './routes/search.js'
import healthRoute from './routes/health.js'
import { getAllItems } from './store.js'
import { ospipeIngest } from './ospipe.js'

const app = express()
const PORT = 3031

async function syncStoreToOspipe(): Promise<void> {
  const items = getAllItems()
  if (items.length === 0) return
  console.log(`[startup] syncing ${items.length} items to OSpipe...`)
  let ok = 0
  for (const item of items) {
    try {
      await ospipeIngest({ title: item.title, content: item.content, source: item.source })
      ok++
    } catch {
      // OSpipe may not be ready yet — search falls back to keyword until it is
    }
  }
  console.log(`[startup] synced ${ok}/${items.length} items to OSpipe`)
}

app.use(cors())
app.use(express.json({ limit: '5mb' }))

app.use('/api/ingest', ingestRoute)
app.use('/api/search', searchRoute)
app.use('/api/health', healthRoute)

// Serve built client in production
const __dirname = dirname(fileURLToPath(import.meta.url))
const clientDist = join(__dirname, '../../client/dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => {
  res.sendFile(join(clientDist, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`my-kb server → http://localhost:${PORT}`)
  syncStoreToOspipe().catch(() => {})
})
