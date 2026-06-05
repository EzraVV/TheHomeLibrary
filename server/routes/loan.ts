import express from 'express'
import * as db from '../db/loan'

const router = express.Router()
// GET /api/v1/loans
router.get('/', async (req, res) => {
  try {
    const loans = await db.getAllLoans()
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch loans' })
  }
})

// GET /api/v1/loans/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const loans = await db.searchLoans(q)
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// POST /api/v1/loans
router.post('/add', async (req, res) => {
  try {
    const ownerId = req.headers['x-user-id']
    if (typeof ownerId !== 'string') {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const newLoan = {
      ...req.body,
      owner_id: ownerId,
    }
    const created = await db.createLoan(newLoan)
    res.status(201).json(created)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// PATCH /api/v1/loans/:id
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id']
    if (typeof userId !== 'string') {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const { id } = req.params;
    const updated = await db.updateLoan(id, req.body, userId)
    res.json(updated)
  } catch {
    res.status(403).json({ error: 'Unauthorised or loan not found' })
  }
})

export default router
