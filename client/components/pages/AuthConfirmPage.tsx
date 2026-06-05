import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function AuthConfirmPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    const sessionRequest = code
      ? supabase.auth.exchangeCodeForSession(code)
      : supabase.auth.getSession()

    sessionRequest
      .then(({ data }) => {
        const session = 'session' in data ? data.session : null
        navigate(session ? '/profile' : '/signup', { replace: true })
      })
      .catch(() => navigate('/signup', { replace: true }))
  }, [navigate])

  return <div className="p-6 text-center">Confirming your account...</div>
}
