import express from 'express'
import * as db from '../db/book'

const router = express.Router()

// GET /api/v1/book
router.get('/', async (req, res) => {
  try {
    const books = await db.getAllBooks()
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

// GET /api/v1/book/:id
router.get('/:id', async (req, res) => {
  try {
    const book = await db.getBookById(req.params.id)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.json(book)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch book' })
  }
})

// GET /api/v1/book/:title
router.get('/:title', async (req, res) => {
  try {
    const book = await db.getBookByTitle(req.params.title)

    if (!book) {
      return res.status(404).json({ error: 'Book not found' })
    }

    res.json(book)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch book' })
  }
})
export default router
