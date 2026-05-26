import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../apis/users'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => getUserById('u_00001'),
  })
}
