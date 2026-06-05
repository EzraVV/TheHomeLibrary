import express from 'express'
import * as db from '../db/follows'
import { requireAuth } from '../auth/middleware'

const router = express.Router()
// GET /api/v1/follows
router.get('/', requireAuth, async (req, res) => {
  try {
    const follows = await db.getAllFollows(req.auth!.userId)
    res.json(follows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch follows' })
  }
})

// GET /api/v1/follows/search?query=foo
router.get('/search', requireAuth, async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const follows = await db.searchFollows(q, req.auth!.userId)
    res.json(follows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// POST /api/v1/follows
router.post('/add', requireAuth, async (req, res) => {
  
  try {
    const { follower_id, followed_id } = req.body

    const followed = await db.createFollow(followed_id)
    res.status(201).json(followed)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

export default router
