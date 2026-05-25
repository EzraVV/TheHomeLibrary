import { useQuery } from '@tanstack/react-query'
import { getBooksByOwner } from '../apis/books'

export function useUserBooks(ownerId: string) {
  return useQuery({
    queryKey: ['user-books', ownerId],
    queryFn: () => getBooksByOwner(ownerId),
    enabled: !!ownerId,
  })
}
