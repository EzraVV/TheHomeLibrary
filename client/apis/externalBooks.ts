import request from "superagent";
import { Book, BookEditionMinimal } from "../../models/book";

//OpenLibrary fetcher
export async function fetchFromOpenLibrary(query: string): Promise<Book[]> {
  try {
    // Express server
    const response = await request
      .get('/api/v1/book/search/registries')
      .query({ query, provider: 'openlibrary' }); 
    
    return response.body.externalData || [];
  } catch (err) {
    console.error('Frontend OpenLibrary bridge failure:', err);
    return [];
  }
}


//GoogleBooks fetcher
export async function fetchFromGoogleBooks(query: string): Promise<Book[]> {
  try {
    // Talk to your own Express server route
    const response = await request
      .get('/api/v1/book/search/registries')
      .query({ query, provider: 'google' });
    
    return response.body.externalData || [];
  } catch (err) {
    console.error('Frontend Google Books bridge failure:', err);
    return [];
  }
}

//Editions fetcher 
export async function fetchEditionsForWork(work_id: string): Promise<BookEditionMinimal[]> {
  try {
    const cleanId = work_id.replace('/works/', '');
    
    const response = await request.get(`/api/v1/book/work/${cleanId}/editions`);
    
    return response.body || [];
  } catch (err) {
    console.error('Frontend editions bridge failure:', err);
    return [];
  }
}