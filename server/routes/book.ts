import express from 'express'
import * as db from '../db/book'
import { Book } from '../../models/book'

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

// GET /api/v1/book/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    if (!q.trim()) {
      return res.json([])//Return empty list if nothing typed
    }

    const books = await db.searchBook(q)
    return res.json(books)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Search failed' })
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

// GET /api/v1/book/owner/:id
router.get('/owner/:id', async (req, res) => {
  try {
    const ownerId = req.params.id
    const books = await db.getBooksByOwner(ownerId)
    res.json(books)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
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


//Shared between update and add
type NewBookInput = Omit<Book, 'id' | 'book_id'>
function sanitiseBookPayload(body: any): NewBookInput {
const allowedKeys= [
  'id', 'owner_id', 'title', 'creator', 'edition', 'work_id', 
    'isbn', 'format', 'condition', 'search_index', 'lending_terms', 'status', 'image_urls'
 ]

 const sanitised: Partial<NewBookInput> = {}

 for (const key of allowedKeys) {
  if (body[key] !== undefined) {
    (sanitised as any)[key] = body[key]
  }
 }

 sanitised.updated_at = new Date().toISOString()

 return sanitised as NewBookInput
}


// PATCH /api/v1/books/update
router.patch(`/books/:id/update`, async (req, res, next) => {
  try {
    const {id} = req.params
    const book = await db.getBookById(id)
    if (!book) return res.status(404).json({error: 'Book not found'})
    const fieldsToUpdate = sanitiseBookPayload(req.body)
    const updatedBook = await db.updateBook(id, fieldsToUpdate)
    return res.status(200).json(updatedBook)
  } catch (e) {
    next(e)
  }
})

// POST /api/v1/book/add
router.post('/', async (req, res, next) => {
  try {
    const newBookData = sanitiseBookPayload(req.body)
    if (!newBookData.status) newBookData.status='Available'
    const savedBook = await db.addBook(newBookData)
    return res.status(201).json(savedBook)
  } catch (e) {
    next(e)
  }
})