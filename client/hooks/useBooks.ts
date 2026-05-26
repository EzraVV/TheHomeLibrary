import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { CleanBookResult } from '../../models/book';
import { fetchFromGoogleBooks, fetchFromOpenLibrary } from '../apis/externalBooks'
import { isValidISBN } from '../../shared/utils/isbnCheck';
import { createLocalBook } from '../apis/books';

interface SearchQueryResponse {
  source: 'local' | 'openlibrary' | 'google' | 'none';
  data: any[];
  redirectUrl?: string //WorldCat link
}

export function useAddBookSearch(searchQuery: string) {
  return useQuery({
    queryKey: ['book-search', searchQuery],
    enabled: searchQuery.length > 2, //At least 2 letters, c'mon
    queryFn: async () => {
      //Try local
        const localResponse = await request.get(`/api/v1/books/search?q=${encodeURIComponent(searchQuery)}`)
        if (localResponse.body.length > 0) {
          return {source: 'local', data: localResponse.body }
        }

        //Cascade fallback
        console.log ('Local DB miss, try OpenLibrary')
        const OLResults = await fetchFromOpenLibrary(searchQuery)
        if (OLResults.length > 0) 
          return { source: 'openlibrary', data: OLResults
          }

        //Cascade fallback
        console.log ('OpenLibrary miss, try Google Books')
        const GBResults = await fetchFromGoogleBooks(searchQuery)
        if (GBResults.length > 0 ) {
          return {source: 'google', data: GBResults }
      }
        return { source: 'none', 
          data: [] }
        //Consider custom fallback styling in this case
    }
  })
}  

export function useBorrowBookSearch (searchQuery: string ) {
    return useQuery({
    queryKey: ['book-search', searchQuery],
    enabled: searchQuery.length > 2, //At least 2 letters, c'mon
    queryFn: async () => {
      const cleanQuery = searchQuery.trim()
      //Try local
        const localResponse = await request.get(`/api/v1/books/search?q=${encodeURIComponent(cleanQuery)}`)
        if (localResponse.body.length > 0) {
          return {source: 'local', data: localResponse.body }
        }

        //Cascade fallback
        console.log ('Local DB miss, try WorldCat')
        if (isValidISBN(cleanQuery)) {
          console.log('Valid ISBN, initialising WorldCat library lookup...')
          return { 
            source: 'worldcat', 
            data: [],
            redirectUrl: `https://www.worldcat.org/isbn/${cleanQuery}`
          }
        } 
          return {source: 'none', data: [] }
      }
    })
  }


  export function useAddBook() {
    const queryClient = useQueryClient()

    return useMutation ({
      mutationFn: async (newBook: CleanBookResult) => createLocalBook(newBook),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['all-books']})
        queryClient.invalidateQueries({queryKey: ['book-search']})
      }
    })
  }