import 'dotenv/config'
import request from 'superagent';
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchFromGoogleBooksBackend(query: string) : Promise<any[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_BOOKS_API_KEY is not configured')
  }

  try {
    const response = await request
      .get('https://www.googleapis.com/books/v1/volumes')
      .query({
        q: query.trim(),
        maxResults: 20,
        printType: 'books',
        key: apiKey,
      })

    return response.body.items || []
  } catch (err) {
    console.error('Google Books search failed:', err)
    throw err
  }
}
