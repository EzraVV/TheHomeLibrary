import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBookById, createLocalBook, updateBook, executeBorrowSearchCascade, executeCatalogSearchCascade, SearchQueryResponse, editSearchBooks } from '../apis/books';
import { fetchEditionsForWork } from '../apis/externalBooks';
import { Book } from '../../models/book';

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

export function useBookEditions(workId: string | undefined, options = { selectOnlyIsbns: false }) {
  const cleanId = workId ? workId.replace('/works/', '').trim() : '';

  return useQuery({
    queryKey: ['book-editions', cleanId],
    enabled: cleanId.length > 0,
    queryFn: () => fetchEditionsForWork(cleanId),
    select: (editions) => {
      // If we need the clean list, return only the unique metadata objects
      const uniqueEditions = editions.filter((v, i, a) => a.findIndex(t => t.isbn === v.isbn) === i);
      
      if (options.selectOnlyIsbns) {
        return uniqueEditions.map(e => e.isbn);
      }
      return uniqueEditions;
    }
  });
}

export function useAddBook() {
  const queryClient = useQueryClient()

  return useMutation ({
    mutationFn: (payload: Partial<Book>) => createLocalBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-books'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-search'] })
      queryClient.invalidateQueries({ queryKey: ['borrow-search'] })
    }
  })
}

export function useEditBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Book> }) => 
      updateBook(id, payload),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-books'] })
      queryClient.invalidateQueries({ queryKey: ['catalog-search'] })
      queryClient.invalidateQueries({ queryKey: ['borrow-search'] })
    }
  })
}

export function useGetBookById(id: string) {
  const cleanId = id.trim()

  return useQuery({
    queryKey: ['catalogue-search', cleanId],
    queryFn:() => getBookById(cleanId),
    enabled: !!cleanId,
  })
}

// Lookup by isbn / title etc for enriching metadata
export function useEditSearchBooks(query: string) {
  return useQuery({
    queryKey: ['book-search', query],
    queryFn: () => editSearchBooks(query), // Now it calls the function that has access to 'request'
    enabled: query.length >= 3,
    staleTime: 0,
  });
}
