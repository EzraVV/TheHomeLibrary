import express from 'express'
import * as db from '../db/book'
import { Book, SelectableBook } from '../../models/book'
import { fetchEditionsForWorkBackend, fetchFromGoogleBooksBackend, fetchFromOpenLibraryBackend, queryWorldCatBackend } from '../services/externalApis'

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
  console.log("🔥 HIT: Registry Cascade Search");
  try {
    const query = (req.query.query || req.query.q || '') as string
    let localMatches: any = []
    try {
      localMatches = await db.searchBook(query) || []
    } catch (dbErr) {
      console.error("Local database search failed:", dbErr)
    }

    console.log(`Cascading registry search for: ${query}`)
    let openLibraryResults = []
    let googleResults = []

    // Safe OpenLibrary Fetch
    try {
      openLibraryResults = await fetchFromOpenLibraryBackend(query) || []
    } catch (olErr: any) {
      console.warn("⚠️ OpenLibrary backend fetch skipped or failed:", olErr.message)
    }

    // Safe Google Books Fetch (Damn 429 Quota Limits)
    try {
      googleResults = await fetchFromGoogleBooksBackend(query) || []
    } catch (googleErr) {
      console.warn("⚠️ Google Books backend rate-limited or failed (429/Resource Exhausted). Falling back gracefully.")
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

// GET /api/v1/books/search/network?query=foo
router.get('/search/network', async (req, res, next) => {
  try {
    const query = (req.query.query || '') as string
    console.log(`Querying WorldCat shared network collections for: ${query}`)
    
    const networkMatches = await queryWorldCatBackend(query)
    
      return res.json(networkMatches) 
  } catch (e) {
    next(e)
  }
})

// GET /api/v1/book/:id
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


//MUTATIONS AND ACCESS CONTROL

//Shared between update and add: Sanitise book data
type NewBookInput = Omit<Book, 'id' | 'book_id'>

function sanitiseBookPayload(body: any): NewBookInput {
  const forbidden = ['owner_id', 'id', 'book_id', 'created_at'];
    
  const sanitised: any = {};

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


// PATCH /api/v1/book/update
router.patch(`/:id/update`, async (req, res, next) => {
  try {
    const {id} = req.params
    //TODO sort out user_id from Auth
    const user_id = 'x-user-id'
    const requestorUserId = req.headers['x-user-id'] || req.body.owner_id || 'anonymous'

    const book = await db.getBookById(id)
      if (!book) { return res.status(404).json({error: 'Book not found'})
    }

    if (String(book.owner_id) !== String(requestorUserId)) {
      console.warn(`⚠️ Access Denied: User ${requestorUserId} attempted to modify Book ${id} owned by ${book.owner_id}`)
      return res.status(403).json({ error: 'Access Denied: You do not have editing clearance for this inventory asset.' })
    }

    const fieldsToUpdate = sanitiseBookPayload(req.body)

    //You don't get to sign away ownership
    delete (fieldsToUpdate as any).owner_id;

    const updatedBook = await db.updateBook(id, user_id, fieldsToUpdate)
    return res.status(200).json(updatedBook)
  } catch (e) {
    next(e)
  }
})

// POST /api/v1/books/add
router.post('/ingest', async (req, res, next) => {
  try {
    const activeUserId = req.headers['u-00001'] || req.body.owner_id;
    
    if (!activeUserId) {
      return res.status(401).json({ error: 'Authentication required: Missing owner context assignment.' })
    }

    const payload = {
      ...req.body,
      owner_id: activeUserId // Forces explicit ownership injection
    }

    const newBookData = sanitiseBookPayload(payload)
    if (!newBookData.status) newBookData.status='Available'
    const savedBook = await db.addBook(newBookData)
    return res.status(201).json(savedBook)
  } catch (e) {
    next(e)
  }
})

router.get (`/work/:workId/editions`, async (req, res) => {
  try {
    const {workId} = req.params;

    const editions = response.body.entries.map((entry: any) => ({
      title: entry.title,
      isbn: (entry.isbn_13?.[0] || entry.isbn_10?.[0]) || 'N/A',
      edition_name: entry.edition_name || 'Standard edition',
      cover_url: entry.covers ? `https://covers.openlibrary.org/b/id/${entry.covers[0]}-M.jpg` : null,
      work_id: workId
    }))
    res.json(edition)
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch editions'})
  }
})

router.get('/search/metadata', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Missing query' });
    }

    const results = await fetchFromOpenLibraryBackend(q);
    console.log("DEBUG: Backend returning items:", results);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed' });
  }
});