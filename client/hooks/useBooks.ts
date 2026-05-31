import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createLocalBook, executeBorrowSearchCascade, executeCatalogSearchCascade, ingestExternalBook, SearchQueryResponse } from '../apis/books';


export function useAddBookSearch(query: string) {
  const searchQuery = query.trim()
  return useQuery({
    queryKey: ['catalogue-search', searchQuery],
    enabled: searchQuery.length > 2, //At least 2 letters, c'mon
    queryFn:() => executeCatalogSearchCascade(searchQuery)
    //Consider custom fallback styling if all else fails
  })
}  

export function useBorrowBookSearch (query: string ) {
    const searchQuery = query.trim()
    
    return useQuery<SearchQueryResponse>({
    queryKey: ['borrow-search', searchQuery],
    enabled: searchQuery.length > 2, //At least 2 letters, c'mon
    queryFn: async () => executeBorrowSearchCascade(searchQuery)
  })
}


  export function useAddBook() {
    const queryClient = useQueryClient()

    return useMutation ({
      mutationFn: async ({mode, payload}: {mode: 'manual' | 'ingest'; payload: any}) => {
      if (mode === 'ingest') {
        return ingestExternalBook(payload) //Payload = ISBN
      }
      return createLocalBook(payload) //Payload = BookResult object
    },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['all-books'] })
        queryClient.invalidateQueries({ queryKey: ['catalog-search'] })
        queryClient.invalidateQueries({ queryKey: ['borrow-search'] })
      }
    })
  }