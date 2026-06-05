import express from 'express'
import * as db from '../db/book_review'
import { requireAuth } from '../auth/middleware'

const router = express.Router()
// GET /api/v1/book_review
router.get('/', requireAuth, async (req, res,next) => {
  try {
    const reviews = await db.getAllBookReviews()
    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch book reviews' })
  }
})

// GET /api/v1/book_reviews/search?query=foo
router.get('/search', async (req, res,next) => {
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
router.post('/add', requireAuth, async (req, res, next) => {
  try {
    const reviewerId = req.auth!.userId
    const { book_id, rating, comment } = req.body

    const newReview = await db.createBookReview({
      reviewer_id: reviewerId,
      book_id,
      rating,
      comment
    })
    res.status(201).json(newReview)
    } catch (err) {
      next(err)
  }
})

// GET /api/v1/book_reviews
router.get('/:id', async(req,res,next)  => {
  try {
    const { id } = req.params
    const book_review = await db.getBookReviewById(id)
    if (!book_review) { return res.status(404).json({error: 'Book review not found'})
    }
    res.status(201).json(book_review)
    } catch (err) {
    next(err)
  }
})


// POST /api/v1/book_reviews
router.patch('/:id/update', requireAuth, async (req, res, next) => {
  try {
    const {id} = req.params
    const reviewerUserId = req.auth!.userId

    const book_review = await db.getBookReviewById(id)
    if (!book_review) { return res.status(404).json({error: 'Book review not found'})
    }
    
    if (String(b_review.reviewer_id) !== String(reviewerUserId)) {
      return res.status(403).json({ error: 'Access Denied: You do not have editing clearance for this inventory asset.' })
    }

    const fieldsToUpdate = getBookReviewUpdateFields(req.body)
    const updated_review = await db.editBookReview(id, fieldsToUpdate)
    res.status(200).json(updated_review)
  } catch (err) {
    next(err)
  }
})


// DELETE /api/v1/book_reviews/:id (soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const review = await db.getBookReviewById(id)

    if (!review) return res.status(404).json({ error: 'Review not found' })
    
    // Check if the person deleting it is the one who wrote it
    if (String(review.reviewer_id) !== String(req.auth!.userId)) {
      return res.status(403).json({ error: 'Access Denied' })
    }

    await db.softDeleteBookReview(id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete book review' })
  }
})


export default router
