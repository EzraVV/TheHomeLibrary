import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../../apis/users'

export function useCurrentUser() {
  const storedUser = localStorage.getItem('active_user_id')
  const userId = storedUser === 'none' ? null : storedUser || 'u_00001'

  return useQuery({
    queryKey: ['current-user', userId],
    queryFn: async () => {
      if (!userId) return null
      return getUserById(userId)
    },
  })
}
