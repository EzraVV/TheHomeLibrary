import express from 'express'
import * as db from '../db/book_review'
import { requireAuth } from '../auth/middleware'

const router = express.Router()
// GET /api/v1/book_review
router.get('/', requireAuth, async (req, res) => {
  try {
    const user_review = await db.getAllBookReviews()
    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch book reviews' })
  }
})

// GET /api/v1/book_reviews/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const reviews = await db.searchBookReviews(q)
    res.json(book_review)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// POST /api/v1/book_reviews
router.post('/add', requireAuth, async (req, res) => {
  
  try {
    const { user_id, book_id } = req.body

    const book_review = await db.createBookReview(book_id)
    res.status(201).json(book_review)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

// POST /api/v1/book_reviews
router.patch('/add', requireAuth, async (req, res) => {
  
  try {
    const { user_id, book_id } = req.body
    const book_review = await db.editBookReview(book_id)
    res.status(201).json(book_review)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

export default router
