import express from 'express'
import * as db from '../db/loan'
import { requireAuth } from '../auth/middleware'

const router = express.Router()
// GET /api/v1/loans
router.get('/', requireAuth, async (req, res) => {
  try {
    const loans = await db.getAllLoans(req.auth!.userId)
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch loans' })
  }
})

// GET /api/v1/loans/search?query=foo
router.get('/search', requireAuth, async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const loans = await db.searchLoans(q, req.auth!.userId)
    res.json(loans)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// POST /api/v1/loans
router.post('/add', requireAuth, async (req, res) => {
  try {
    const ownerId = req.auth!.userId
    const loanFields = { ...req.body }
    delete loanFields.loan_id
    delete loanFields.owner_id
    delete loanFields.created_at
    delete loanFields.updated_at
    const newLoan = {
      ...loanFields,
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
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.auth!.userId
    const { id } = req.params;
    const updates = { ...req.body }
    delete updates.loan_id
    delete updates.book_id
    delete updates.owner_id
    delete updates.borrower_id
    delete updates.created_at
    const updated = await db.updateLoan(id, updates, userId)
    res.json(updated)
  } catch {
    res.status(403).json({ error: 'Unauthorised or loan not found' })
  }
})

export default router
