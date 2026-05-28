import request from "superagent";
import { Book } from "../../models/book";

//OpenLibrary fetcher
export async function fetchFromOpenLibrary(query:string): Promise<Book[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    const response = await request.get(url)
    const items = response.body.docs || []

    return items.map((item: any) => {
      const targetOlid = item.cover_edition_key || (item.edition_key?.length ? item.edition_key[0] : undefined);
        let computedImageUrl = '';
        if (targetOlid) {
          //In case of Olid string
          computedImageUrl = `https://covers.openlibrary.org/b/olid/${targetOlid}-M.jpg`;
        } else if (item.cover_i) {
          // Fallback to old numeric index
          computedImageUrl = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
        }

      return{
      title: item.title,
      creator: item.author_name ? item.author_name[0]: 'Unknown Author',
      isbn: item.isbn ? item.isbn[0]: 'No ISBN',
      image_urls: computedImageUrl || undefined
    }
  })
 } catch(err) {
    console.error('OpenLibrary failed', err)
    return []
  }
}


//GoogleBooks fetcher
export async function fetchFromGoogleBooks(query: string) : Promise<Book[]> {
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
