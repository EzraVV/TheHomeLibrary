import request from "superagent";
import { Book, BookEditionMinimal } from "../../models/book";

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
      isbn: item.isbn && item.isbn.length > 0 ? item.isbn[0] : undefined,
      image: computedImageUrl || undefined
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
      image: item.volumeInfo.imageLinks?.thumbnail
    }))
  } catch (err) {
    console.error ('Google Books search failed:', err)
    return []
  }
}


/*
//Editions fetcher 
export async function fetchEditionsForWork(work_id:string): Promise<BookEditionMinimal[]> {
  try {
    const cleanId = work_id.replace('/works/', '')
    const url =  `https://openLibrary.org/works${cleanId}/editions.json?Limit=10`;

    const response = await request.get(url)
    const data = await response.body
    const entries = data.entries || []

    return entries
      .filter((edit: any) => edit.isbn_13?.length || edit.isbn_10?.length)
      .map((edit: any) => {
        const exactIsbn = (edit.isbn_13?.[0]) || (edit.isbn_10??[0])
        const separationKey = edit.key ? edit.key.replace('/books/', ''):'';

        let formatText = 'Paperback';
        if (edit.physical_format){
          formatText = edit.physical_format.toLowerCase().includes('hard') ? 'Hardcover' : 'Paperback';
        }
        return {
          edition_name: edit.publish_name || edit.title || 'Standard Edition',
          isbn: exactIsbn,
          format: formatText,
          image: separationKey ? `https://covers.openlibrary.org/b/olid${separationKey}-M.jpg`:''
        }
      }) 
    } catch (err) {
    console.error('Failed fetching specific book copies', err);
    return []
  }
}*/