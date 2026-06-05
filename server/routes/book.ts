import express from 'express'
import * as db from '../db/book'
import { Book, BookPayload } from '../../models/book'
import { fetchEditionsForWorkBackend, fetchFromGoogleBooksBackend, fetchFromOpenLibraryBackend, queryWorldCatBackend } from '../services/externalApis'
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

//Cataloguing search - cascade to OpenLibrary, Google Books
//Get /api/v1/books/search/registries?query=foo
router.get(`/search/registries`, async (req, res, next) => {
  try {
    const query = (req.query.query || req.query.q || '') as string
    let localMatches: Book[] = []
    try {
      localMatches = await db.searchBook(query) || []
    } catch {
      localMatches = []
    }

    let openLibraryResults = []
    let googleResults = []

    // Safe OpenLibrary Fetch
    try {
      openLibraryResults = await fetchFromOpenLibraryBackend(query) || []
    } catch {
      openLibraryResults = []
    }

    // Safe Google Books Fetch (Damn 429 Quota Limits)
    try {
      googleResults = await fetchFromGoogleBooksBackend(query) || []
    } catch {
      googleResults = []
    }

    // Combine registries that survived the network request
    const externalResults = [...openLibraryResults, ...googleResults]

    let unifiedSource = 'none'
    if (localMatches.length > 0 && externalResults.length > 0) {
      unifiedSource = 'mixed'
    } else if (localMatches.length > 0) {
      unifiedSource = 'local'
    } else if (externalResults.length > 0) {
      unifiedSource = 'openlibrary' // Default fallback tag for external assets
    }
    
    // Determine Tracking string for frontend metadata labels
    let primaryExternalSource = 'none'
    if (openLibraryResults.length > 0) primaryExternalSource = 'openlibrary'
    else if (googleResults.length > 0) primaryExternalSource = 'google'
    return res.json({ 
      source: unifiedSource, 
      externalSource: primaryExternalSource,
      localData: localMatches, 
      externalData: externalResults,
      data: [...localMatches, ...externalResults]
    })
  } catch (e) {
    console.error("Fatal crash in registry router cascade root:", e)
    next(e)
  }
})

//Editions search for Open Library
router.get('/work/:work_id/editions', async (req, res, next) => {
  try {
    const { work_id } = req.params;
    const editions = await fetchEditionsForWorkBackend(work_id); 
    return res.json(editions);
  } catch (e) {
    next(e);
  }
});

// GET /api/v1/books/search/network?query=foo - WorldCat
router.get('/search/network', async (req, res, next) => {
  try {
    const query = (req.query.query || '') as string
    const networkMatches = await queryWorldCatBackend(query)
    
      return res.json(networkMatches) 
  } catch (e) {
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

    const fieldsToUpdate = getBookUpdateFields(req.body)

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
    const { title, creator, isbn, format, edition_name, description, condition, search_index, lending_terms, status, image } = req.body as BookPayload
    const owner_id:  req.auth!.userId, // Forces explicit ownership injection
    
    const newBookData = {
      title,
      creator,
      isbn,
      format, 
      edition_name,
      description,
      condition,
      search_index,
      lending_terms,
      status, 
      image,
      owner_id: activeUserId,
    } 

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

    const results = await fetchFromOpenLibraryBackend(q);
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
