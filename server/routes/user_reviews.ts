import express from 'express'
import * as db from '../db/user_review'
import { requireAuth } from '../auth/middleware'

const router = express.Router()

// GET /api/v1/user_review
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const reviews = await db.getAllUserReviews()
    res.json(reviews)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch user reviews' })
  }
})

// GET /api/v1/user_reviews/search?query=foo
router.get('/search', async (req, res, next) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const reviews = await db.searchUserReviews(q)
    res.json(user_review)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// POST /api/v1/user_reviews
router.post('/add', requireAuth, async (req, res) => {
  
  try {
    const reviewerId = req.auth!.userId
    const { reviewed_user_id, rating, comment, loan_id } = req.body

    const newReview = await db.createUserReview({
      reviewer_id: reviewerId,
      reviewed_user_id,
      rating,
      comment,
      loan_id
    })
    res.status(201).json(newReview)
  } catch (err) {
    next(err)
  }
})

// GET /api/v1/user_reviews
router.get('/:id', async(req,res,next)  => {
  try {
    const { id } = req.params

    const review = await db.getUserReviewById(id)
    if (!review) { return res.status(404).json({error: 'Review not found'})
    }
    res.status(201).json(review)
  } catch (err) {
    next(err)
  }
})


// POST /api/v1/user_reviews
router.patch('/:id/update', requireAuth, async (req, res, next) => {
  try {
    const {id} = req.params
    const reviewerUserId = req.auth!.userId

    const user_review = await db.getUserReviewById(id)
    if (!user_review) { return res.status(404).json({error: 'user review not found'})
    }
    
    if (String(u_review.user_id) !== String(reviewerUserId)) {
      return res.status(403).json({ error: 'Access Denied: You do not have editing clearance for this inventory asset.' })
    }

    const fieldsToUpdate = getUserReviewUpdateFields(req.body)

    const updated_review = await db.editUserReview(id, reviewerUserId, fieldsToUpdate)
    res.status(201).json(updated_review)
  } catch (err) {
    next(err)
  }
})

// DELETE /api/v1/user_reviews/:id (soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params
    const review = await db.getUserReviewById(id)

    if (!review) return res.status(404).json({ error: 'Review not found' })
    
    // Check if the person deleting it is the one who wrote it
    if (String(review.reviewer_id) !== String(req.auth!.userId)) {
      return res.status(403).json({ error: 'Access Denied' })
    }

    await db.softDeleteUserReview(id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete user review' })
  }
})

export default router
