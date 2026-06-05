import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute() {
  const { session, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="p-6 text-center">Checking your session...</div>
  }

  if (!session) {
    const returnTo = `${location.pathname}${location.search}`
    return <Navigate to={`/signup?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return <Outlet />
}
