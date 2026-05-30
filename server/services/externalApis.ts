import request from 'superagent';

// Proxies cataloguing searches to OpenLibrary securely from the server

export async function fetchFromOpenLibraryBackend(query: string): Promise<any[]> {
  try {
    const fields = 'key,title,author_name,language,isbn,edition_name,ia,cover_i,cover_edition_key,edition_key';

    const cleanQuery = query.trim();
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(cleanQuery)}+language:eng&limit=20&fields=${fields}`
    
    const response = await request.get(url);
    const items = response.body.docs || [];

    return items.map((item: any) => {
      const isbnList = Array.isArray(item.isbn) ? item.isbn : []
      const cleanIsbn = isbnList
        .map((num: string) => num.replace(/[^0-9X]/gi, '').trim()) // Strip text comments
        .find((num: string) => num.length === 10 || num.length === 13); // Find standard lengths
     
      return {  
        key: item.key,
        title: item.title,
        author_name: item.author_name || [],
        isbn: cleanIsbn || null,
        edition_name: item.edition_name || '',
        image: item.cover_edition_key 
          ? `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`
          : item.cover_i 
            ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` 
            : '',
        ia: item.ia || []
      }
    });
  } catch (err) {
    console.error('Backend OpenLibrary proxy failed:', err);
    return [];
  }
}

//Fetch editions from open library
export async function fetchEditionsForWorkBackend(work_id:string): Promise<any[]> {
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
}


// Proxies cataloguing searches to Google securely from the server

export async function fetchFromGoogleBooksBackend(query: string) : Promise<any[]> {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`
    const response = await request.get(url)
    const items = response.body.items || []

    return items.map((item: any) => {
      const industryIds = item.volumeInfo.industryIdentifiers || [];
      const extractedIsbns = industryIds.map((idObj: any) => idObj.identifier)

      return {
      title: item.volumeInfo.title,
      creator: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown Author',
      isbn: extractedIsbns[0] || '',
      image: item.volumeInfo.imageLinks?.thumbnail || undefined,
      availableIsbns:extractedIsbns,
      id: item.id
    }
  })
  } catch (err) {
    console.error ('Google Books search failed:', err)
    return []
  }
}


//Proxies library sharing searches to WorldCat network securely from the server

export async function queryWorldCatBackend(query: string): Promise<any[]> {
  try {
    const WORLDCAT_API_KEY = process.env.WORLDCAT_API_KEY || 'mock-key-if-public';
    
    const response = await request
      .get('https://wan.worldcat.org/v2/search/brief') // Example WorldCat endpoint
      .query({ q: query })
      .set('Authorization', `Bearer ${WORLDCAT_API_KEY}`)
      .set('Accept', 'application/json');

    return response.body.items || [];
  } catch (err) {
    console.error('Backend WorldCat proxy failed:', err);
    return [];
  }
}