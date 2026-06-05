import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../apis/users'
import { useAuth } from '../contexts/AuthContext'

export function useCurrentUser() {
  const { session, isLoading } = useAuth()

  return useQuery({
    queryKey: ['current-user', session?.user.id],
    queryFn: getUserById,
    enabled: !isLoading && !!session,
  })
}
