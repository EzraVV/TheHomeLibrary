import express from 'express'
import * as db from '../db/loan.js'
import * as bookDb from '../db/book.js'
import { requireAuth } from '../auth/middleware.js'
import { calculateDueDate } from '../../shared/utils/calculateDueDate.js'

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
    const borrowerId = req.auth!.userId
    const { book_id } = req.body

    if (typeof book_id !== 'string' || book_id.trim() === '') {
      return res.status(400).json({ error: 'book_id is required' })
    }

    const book = await bookDb.getBookById(book_id)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    if (String(book.owner_id) === String(borrowerId)) {
      return res.status(400).json({ error: 'You cannot borrow your own book' })
    }

    const now = new Date().toISOString()
    const newLoan = {
      book_id: book.book_id,
      owner_id: book.owner_id,
      borrower_id: borrowerId,
      status: 'Pending' as const,
      due_at: req.body.due_at || calculateDueDate(2, now),
      returned_at: null,
      created_at: now,
      updated_at: now,
      archived_at: null,
      is_deleted: false,
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
