import { Router } from 'express'
import { ospipeHealth } from '../ospipe.js'

const router = Router()

router.get('/', async (_req, res) => {
  const ospipe = await ospipeHealth()
  res.json({ ok: ospipe, ospipe })
})

export default router
