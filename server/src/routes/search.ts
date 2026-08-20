import { Router } from 'express'
import { ospipeSearch } from '../ospipe.js'
import { getAllItems, searchItems } from '../store.js'
import type { KBItem, OSpipeSearchResult } from '../types.js'

const router = Router()

router.get('/', async (req, res) => {
  const q = (req.query.q as string | undefined)?.trim()

  if (!q) {
    return res.json(getAllItems().slice(0, 50))
  }

  try {
    const results = await ospipeSearch(q)
    if (results.length === 0) {
      return res.json(searchItems(q))
    }
    // Merge OSpipe results with local store metadata (for type/createdAt)
    const local = getAllItems()
    const enriched = results.map((r: OSpipeSearchResult) => {
      const match = local.find(
        item => item.source === r.source || item.title === r.title
      )
      return match ? { ...match, score: r.score } : { ...r, type: 'web', createdAt: new Date().toISOString() }
    })
    return res.json(enriched as KBItem[])
  } catch {
    // OSpipe unavailable — fall back to local text search
    return res.json(searchItems(q))
  }
})

export default router
