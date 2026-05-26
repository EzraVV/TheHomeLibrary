import request from "superagent";
import { CleanBookResult } from "../../models/book";

//OpenLibrary fetcher
export async function fetchFromOpenLibrary(query:string): Promise<CleanBookResult[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    const response = await request.get(url)
    const items = response.body.docs || []

    return items.map((item: any) => ({
      title: item.title,
      creator: item.author_name ? item.author_name[0]: 'Unknown Author',
      isbn: item.isbn ? item.isbn[0]: 'No ISBN',
      coverURL: item.cover_i? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` : undefined
    }))
  } catch(err) {
    console.error('OpenLibrary failed', err)
    return []
  }
}


//GoogleBooks fetcher
export async function fetchFromGoogleBooks(query: string) : Promise<CleanBookResult[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`
    const response = await request.get(url)
    const items = response.body.items || []

    return items.map((item: any) => ({
      title: item.volumeInfo.title,
      creator: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
      isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers[0].identifier : 'No ISBN',
      coverUrl: item.volumeInfo.imageLinks?.thumbnail
    }))
  } catch (err) {
    console.error ('Google Books search failed:', err)
    return []
  }
}
