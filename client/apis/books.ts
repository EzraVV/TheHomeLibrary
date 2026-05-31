import request from 'superagent'
import { Book } from '../../models/book' //Aspirations
import { fetchFromGoogleBooks, fetchFromOpenLibrary } from './externalBooks'
import { isValidISBN } from '../../shared/utils/isbnCheck'


export interface SearchQueryResponse {
  source: 'local' | 'openlibrary' | 'google' | 'mixed' | 'none' | 'worldcat';
  data?: any[];          // Kept for borrow search compatibility
  localData?: any[];     // New structure for catalog search
  externalData?: any[];  // New structure for catalog search
  externalSource?: 'openlibrary' | 'google' | 'none';
  redirectUrl?: string;
}

export interface IngestionPayload {
  type: 'isbn' | 'openlibrary' | 'google';
  identifier: string; // This could be an ISBN-13 string, an OL Work Key ("OL27479W"), or a Google Vol ID
}

const baseUrl = '/api/v1/books'

// GET all books
export async function getAllBooks() {
  const res = await request.get(baseUrl)
  return res.body
}

// GET one book by ID
export async function getBookById(id: string) {
  const res = await request.get(`${baseUrl}/item/${id}`)
  return res.body
}

// SEARCH books
export async function searchBooks(searchQuery: string) {
  const res = await request.get(`/api/v1/books/search?query=${encodeURIComponent(searchQuery)}`)
  return res.body
}

// GET books by owner
export async function getBooksByOwner(ownerId: string) {
  const res = await request.get(`${baseUrl}/owner/${ownerId}`)
  return res.body
}

//ADD book (draft, using short model cleanbookresult until i sort default vals,fallbacks etc.
export async function createLocalBook(newBook: Book) {
  const response = await request.post('/api/v1/books').send(newBook)
  return response.body
}

//ADD book (exotic external book)
export async function ingestExternalBook(payload: IngestionPayload) {
  const token = localStorage.getItem('token'); 
  const response = await request
  .post(`${baseUrl}/ingest`)
  .set('Authorization', `Bearer ${token}`)
  .send(payload)

  return response.body
}

export async function executeCatalogSearchCascade(query: string): Promise<SearchQueryResponse> {
  try {
    console.log(`Sending single aggregated lookup request for: "${query}"`);
    
    const response = await request
      .get('/api/v1/books/search/registries')
      .query({ query });

    const serverResult = response.body;

    return {
      source: serverResult.source || 'none',
      localData: serverResult.source === 'local' ? (serverResult.data || []) : [],
      externalData: serverResult.source === 'externalSource' ? (serverResult.externalData || []) : [],
      externalSource: serverResult.externalSource || 'none'
    };

  } catch (err) {
    console.error('❌ Server proxy aggregator returned an error code:', err);
    return { source: 'none', localData: [], externalData: [] };
  }
}


// Peer Borrowing Cascade
export async function executeBorrowSearchCascade(query: string): Promise<SearchQueryResponse> {
  // Check Local inventory
  const localResponse = await request.get(`${baseUrl}/search`).query({ query })
  if (localResponse.body && localResponse.body.length > 0) {
    return { source: 'local', data: localResponse.body }
  }

  // Evaluate WorldCat global link generation
  if (isValidISBN(query)) {
    return {
      source: 'worldcat',
      data: [],
      redirectUrl: `https://www.worldcat.org/isbn/${query}`
    }
  }

  return { source: 'none', data: [] }
}