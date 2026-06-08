import 'dotenv/config'
import request from 'superagent';
import type { Book } from '../../models/book.js'
import { normaliseBookPayload } from '../../shared/utils/normaliseBookPayload.js'

interface GoogleBooksResponse {
  items?: unknown[]
}

const catalogueMetadataCache = new Map<
  string,
  { expiresAt: number; metadata: Partial<Book> | null }
>()
const CACHE_TTL_MS = 6 * 60 * 60 * 1000

export async function fetchFromGoogleBooksBackend(
  query: string,
  maxResults = 20,
): Promise<unknown[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_BOOKS_API_KEY is not configured')
  }

  try {
    const response = await request
      .get('https://www.googleapis.com/books/v1/volumes')
      .query({
        q: query.trim(),
        maxResults,
        printType: 'books',
        key: apiKey,
      })

    return (response.body as GoogleBooksResponse).items || []
  } catch (err) {
    console.error('Google Books search failed:', err)
    throw err
  }
}

function catalogueLookupQuery(book: Book) {
  const isbn = book.isbn?.split(',')[0].replace(/[^0-9X]/gi, '').trim()
  if (isbn) return `isbn:${isbn}`

  return `intitle:${book.title} inauthor:${book.creator}`
}

function googleMetadataFromMatch(
  book: Book,
  match: unknown,
): Partial<Book> | null {
  const normalised = match ? normaliseBookPayload(match, 'google') : null
  return normalised
    ? {
        title: normalised.title,
        creator: normalised.creator,
        description: normalised.description,
        image: normalised.image,
        work_id: normalised.googleVolumeId,
        isbn: normalised.isbn || book.isbn,
        search_index: `${normalised.title} ${normalised.creator}`.toLowerCase(),
      }
    : null
}

function metadataScore(book: Book, metadata: Partial<Book> | null) {
  if (!metadata) return -1

  const expectedTitle = book.title.toLowerCase().replace(/[^a-z0-9]/g, '')
  const matchedTitle = metadata.title?.toLowerCase().replace(/[^a-z0-9]/g, '')
  return (
    (expectedTitle === matchedTitle ? 10 : 0) +
    (metadata.image ? 3 : 0) +
    (metadata.description ? 3 : 0) +
    (metadata.isbn ? 1 : 0)
  )
}

function bestGoogleMetadata(book: Book, matches: unknown[]) {
  return matches
    .map((match) => googleMetadataFromMatch(book, match))
    .sort((a, b) => metadataScore(book, b) - metadataScore(book, a))[0] || null
}

export async function getGoogleMetadataForBook(
  book: Book,
): Promise<Partial<Book> | null> {
  const cacheKey = `${book.book_id}:${book.isbn || book.title}`
  const cached = catalogueMetadataCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) return cached.metadata

  const isbnMatches = await fetchFromGoogleBooksBackend(catalogueLookupQuery(book), 1)
  let metadata = bestGoogleMetadata(book, isbnMatches)

  if (!metadata?.image || !metadata.description) {
    const titleMatches = await fetchFromGoogleBooksBackend(
      `intitle:${book.title} inauthor:${book.creator}`,
      10,
    )
    const titleMetadata = bestGoogleMetadata(book, titleMatches)
    if (metadataScore(book, titleMetadata) > metadataScore(book, metadata)) {
      metadata = titleMetadata
    }
  }

  catalogueMetadataCache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    metadata,
  })
  return metadata
}

export async function enrichBooksWithGoogleMetadata(
  books: Book[],
): Promise<Book[]> {
  if (process.env.NODE_ENV === 'test') return books

  const enriched: Book[] = []

  // Keep requests bounded so a catalogue load does not create a large burst.
  for (let index = 0; index < books.length; index += 12) {
    const batch = books.slice(index, index + 12)
    const results = await Promise.all(
      batch.map(async (book) => {
        try {
          const metadata = await getGoogleMetadataForBook(book)
          return metadata ? { ...book, ...metadata } : book
        } catch (error) {
          console.error(`Google metadata enrichment failed for ${book.book_id}:`, error)
          return book
        }
      }),
    )
    enriched.push(...results)
  }

  return enriched
}
