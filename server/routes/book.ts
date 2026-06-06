import express from 'express'
import * as db from '../db/book'
import { Book } from '../../models/book'
import { fetchFromGoogleBooksBackend } from '../services/externalApis'
import { requireAuth } from '../auth/middleware'

const router = express.Router()

// GET /api/v1/books
router.get('/', async (req, res) => {
  try {
    const books = await db.getAllBooks()
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

// GET /api/v1/books/search?query=foo
router.get('/search', async (req, res) => {
  const q = (req.query.query || req.query.q || '') as string
  try {
    const books = await db.searchBook(q)
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Search failed' })
  }
})

// Cataloguing search: local inventory plus server-proxied Google Books metadata.
//Get /api/v1/books/search/registries?query=foo
router.get(`/search/registries`, async (req, res, next) => {
  try {
    const query = (req.query.query || req.query.q || '') as string
    if (query.trim().length < 3) {
      return res.status(400).json({ error: 'Search query must be at least 3 characters' })
    }

    let localMatches: Book[] = []
    try {
      localMatches = await db.searchBook(query) || []
    } catch {
      localMatches = []
    }

    const googleResults = await fetchFromGoogleBooksBackend(query)

    let unifiedSource = 'none'
    if (localMatches.length > 0 && googleResults.length > 0) {
      unifiedSource = 'mixed'
    } else if (localMatches.length > 0) {
      unifiedSource = 'local'
    } else if (googleResults.length > 0) {
      unifiedSource = 'google'
    }

    return res.json({ 
      source: unifiedSource, 
      externalSource: googleResults.length > 0 ? 'google' : 'none',
      localData: localMatches, 
      externalData: googleResults,
      data: [...localMatches, ...googleResults]
    })
  } catch (e) {
    console.error("Fatal crash in registry router cascade root:", e)
    next(e)
  }
})

// GET /api/v1/books/item/:id
router.get('/item/:id', async (req, res) => {
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

// GET /api/v1/books/owner/:id
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


//MUTATIONS AND ACCESS CONTROL

//Shared between update and add: Sanitise book data
type NewBookInput = Omit<Book, 'book_id'>

function sanitiseBookPayload(body: Record<string, unknown>): Partial<NewBookInput> {
  const forbidden = ['owner_id', 'id', 'book_id', 'created_at'];
    
  const sanitised: Record<string, unknown> = {}

    Object.keys(body).forEach(key => {
      if (!forbidden.includes(key)) {
        sanitised[key] = body[key];
      }
    });

    sanitised.status = body.status || 'Available';
    sanitised.condition = body.condition || 'Good';
    sanitised.updated_at = new Date().toISOString();

  return sanitised;
}


// PATCH /api/v1/books/:id/update
router.patch(`/:id/update`, requireAuth, async (req, res, next) => {
  try {
    const {id} = req.params
    const requestorUserId = req.auth!.userId

    const book = await db.getBookById(id)
      if (!book) { return res.status(404).json({error: 'Book not found'})
    }

    if (String(book.owner_id) !== String(requestorUserId)) {
      return res.status(403).json({ error: 'Access Denied: You do not have editing clearance for this inventory asset.' })
    }

    const fieldsToUpdate = sanitiseBookPayload(req.body)

    //You don't get to sign away ownership
    const updatedBook = await db.updateBook(id, requestorUserId, fieldsToUpdate)
    return res.status(200).json(updatedBook)
  } catch (e) {
    next(e)
  }
})

// POST /api/v1/books/add
router.post('/add', requireAuth, async (req, res, next) => {
  try {
    const activeUserId = req.auth!.userId

    const payload = {
      ...req.body,
      owner_id: activeUserId // Forces explicit ownership injection
    }

    const newBookData = {
      ...sanitiseBookPayload(payload),
      owner_id: activeUserId,
    } as Omit<Book, 'book_id'>
    const savedBook = await db.addBook(newBookData)
    return res.status(201).json(savedBook)
  } catch (e) {
    next(e)
  }
})

router.get('/search/metadata', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Missing query' });
    }

    const results = await fetchFromGoogleBooksBackend(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed' });
  }
});

// GET /api/v1/books/:title
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
