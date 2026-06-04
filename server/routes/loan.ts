import express from 'express'
import * as db from '../db/loan'

const router = express.Router()

// GET /api/v1/loan
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
router.post('/', async (req, res) => {
  try {
    const newLoan = {
      ...req.body,
    }
    const created = await db.createLoan(newLoan)
    res.status(201).json(created)
  } catch (err) {
    const error = err as { code?: string }
    console.error(err)
    res.sendStatus(500)
  }
})

// PATCH /api/v1/users/:id
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string
    const { id } = req.params;
    const updated = await db.updateLoan(id, req.body, userId)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update loan' })
  }
})

export default router