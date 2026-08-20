import { Router } from 'express'
import { ingestNote } from '../ingestors/note.js'
import { ingestWeb } from '../ingestors/web.js'
import { ospipeIngest } from '../ospipe.js'
import { addItem } from '../store.js'
import type { IngestRequest } from '../types.js'

const router = Router()

router.post('/', async (req, res) => {
  const body = req.body as IngestRequest

  try {
    let payload

    if (body.type === 'note') {
      if (!body.title?.trim() || !body.text?.trim()) {
        return res.status(400).json({ error: 'title and text are required for notes' })
      }
      payload = ingestNote({ title: body.title, text: body.text, tags: body.tags })
    } else if (body.type === 'web') {
      if (!body.url?.trim()) {
        return res.status(400).json({ error: 'url is required for web ingestion' })
      }
      payload = await ingestWeb(body.url)
    } else {
      return res.status(400).json({ error: `Unsupported type: ${body.type}` })
    }

    // Send to OSpipe for semantic indexing (best-effort)
    ospipeIngest(payload).catch((e: Error) =>
      console.warn('[ospipe] ingest skipped:', e.message)
    )

    const item = addItem(payload, body.type)
    return res.json({ ok: true, item })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
})

export default router
