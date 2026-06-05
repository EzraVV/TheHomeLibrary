import request from 'superagent'
import { Book, SelectableBook } from '../../models/book'
import { normaliseBookPayload } from '../../shared/utils/normaliseBookPayload';
import { isValidISBN } from '../../shared/utils/isbnCheck'
import { withAccessToken } from '../lib/authenticatedRequest'


export interface SearchQueryResponse {
  source: 'local' | 'openlibrary' | 'google' | 'mixed' | 'none' | 'worldcat';
  data?: unknown[]
  localData?: unknown[]
  externalData?: unknown[]
  externalSource?: 'openlibrary' | 'google' | 'none' | 'mixed';
  redirectUrl?: string;
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

// EDIT book 

export async function updateBook(book_id: string, updatedFields: Partial<Book>) {
  if (!book_id || book_id === 'undefined') {
    throw new Error("CRITICAL: Attempted to PATCH with an invalid book ID");
  }

  const response = await withAccessToken(
    request.patch(`/api/v1/books/${book_id}/update`).send(updatedFields),
  )
  
  return response.body;
}

// ADD book 
export async function createLocalBook(newBook: Partial<Book>) {
  const response = await withAccessToken(request.post(`${baseUrl}/add`).send(newBook))
  return response.body
}

// SEARCH books,local and external
export async function executeCatalogSearchCascade(query: string): Promise<SearchQueryResponse> {
  try {
    const response = await request
      .get('/api/v1/books/search/registries')
      .query({ query });

    const serverResult = response.body;

    return {
      source: serverResult.source || 'none',
      localData: serverResult.localData || serverResult.data || [],
      externalData: serverResult.externalData || [],
      externalSource: serverResult.externalSource || 'none'
    };

  } catch (err) {
    console.error('❌ Server proxy aggregator returned an error code:', err);
    return { source: 'none', localData: [], externalData: [] };
  }
}


// SEARCH Peer Borrowing Cascade
export async function executeBorrowSearchCascade(rawQuery: string): Promise<SearchQueryResponse> {
  const query = rawQuery.trim()

  let localDataResult: unknown[] = []
  let externalDataResult: unknown[] = []
  let sourceResult: 'local' | 'openlibrary' | 'google' | 'mixed' | 'none' | 'worldcat' = 'none'
  let redirectUrlResult: string | undefined = undefined

  // Local Search Pass
  try {
    const localResponse = await request.get(`${baseUrl}/search`).query({ query });
    if (localResponse.body && localResponse.body.length > 0) {
      localDataResult = localResponse.body;
      sourceResult = 'local';
    }
  } catch (err) {
    console.error("Backend local search route failed:", err);
  }

  let targetIsbn = isValidISBN(query) ? query : null;

  // Aggregate External Repositories via Shared Gate
  try {
    const registryResult = await executeCatalogSearchCascade(query);
  
    if (registryResult && registryResult.externalData && registryResult.externalData.length > 0) {
      externalDataResult = registryResult.externalData;
    }
    
    // Combine hidden db records safely
    if (registryResult && registryResult.localData && registryResult.localData.length > 0) {
      registryResult.localData.forEach((item) => {
        const candidate = item as SelectableBook
        if (!localDataResult.some(existing => (existing as SelectableBook).book_id === candidate.book_id)) {
          localDataResult.push(item);
        }
      });
    }

    // Determine unified source string state flag
    if (localDataResult.length > 0 && externalDataResult.length > 0) {
      sourceResult = 'mixed';
    } else if (localDataResult.length > 0) {
      sourceResult = 'local';
    } else if (externalDataResult.length > 0) {
      sourceResult = 'openlibrary';
    }

    // Try to extract an ISBN from the top match if none yet exists
    const rawTopMatch = externalDataResult?.[0];
    if (!targetIsbn && rawTopMatch) {
      const topMatch = normaliseBookPayload(rawTopMatch, registryResult.source);
      if (topMatch && topMatch.isbn) {
        targetIsbn = topMatch.isbn;
      }
    }
  } catch (err) {
    console.error('⚠️ External lookup translation step encountered an error:', err);
  }

  // Evaluate Redirect Safety Gates
  if (targetIsbn && isValidISBN(targetIsbn)) {
    if (localDataResult.length === 0) {
      sourceResult = 'worldcat';
      redirectUrlResult = `https://www.worldcat.org/isbn/${targetIsbn}`;
    } else {
      // Local data items! Demote source back to mixed and drop the redirect loop
      sourceResult = 'mixed';
      redirectUrlResult = undefined; 
    }
  }

  // Final Emergency Safety Valve: If any local records survived, redirectUrl MUST be killed
  if (localDataResult && localDataResult.length > 0) {
    redirectUrlResult = undefined;
  }

  return { 
    source: sourceResult, 
    localData: localDataResult, 
    externalData: externalDataResult,
    redirectUrl: redirectUrlResult
  };
}

// api/books.ts
export async function editSearchBooks(query: string) {
  if (!query || query.length < 3) return [];
  
  const response = await request
    .get(`/api/v1/books/search/metadata`)
    .query({ q: encodeURIComponent(query) }); 
    
  return response.body || [];
}
