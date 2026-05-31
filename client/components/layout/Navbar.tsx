import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BookOpen, User, BookMarked, Layers, Search, LogOut, LogIn } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const [inputValue, setInputValue] = useState('')
  const currentQueryParams = new URLSearchParams(location.search)
  const currentQueryString = currentQueryParams.get('query') || ''

  //Keep search value active while navigating
  useEffect(() => {
    if (location.pathname === '/search' && currentQueryString !== inputValue) {
      setInputValue(currentQueryString)
    } else if (location.pathname !== '/search' && inputValue !== '') {
      // Clear the navbar box if they leave the search page completely
      setInputValue('')
    }
  }, [location.pathname, currentQueryString])

  //Debounce to reduce external calls
  useEffect(() => {
    // If the input is too short, skip the API entirely
    if (inputValue.trim().length <= 2) {
      return
    }

    if (location.pathname === '/search' && currentQueryString === inputValue) {
      return
    }

    // Single network window timer
  const handler = setTimeout(() => {
      // Redirect to dedicated search page automatically
      navigate(`/search?query=${encodeURIComponent(inputValue.trim())}`)
    }, 600)

    // Clean-up before every single key strike
    return () => {
      clearTimeout(handler)
    }
  }, [inputValue, navigate])

  const linkClass = (path: string) => {
    return `flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold transition-all duration-180 ${
      isActive(path)
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-muted hover:text-primary hover:bg-primary/5'
    }`
  }

  const handleAuthAction = () => {
    if (user) {
      // Simulate Logout
      localStorage.setItem('active_user_id', 'none')
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
      navigate('/signup')
    } else {
      // Redirect to simulated Login/Signup
      navigate('/signup')
    }
  }

  return (
    <nav className="border-b border-border bg-surface sticky top-0 z-50 shadow-sm px-4 py-3 md:px-6">
      <div className="max-w-app mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-90">
          <BookOpen className="w-6 h-6 stroke-[2.5]" />
          <span className="font-heading text-xl font-bold tracking-tight text-secondary">
            The Home Library
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <Link to="/" className={linkClass('/')}>
            <Layers className="w-4 h-4" />
            <span>Discover</span>
          </Link>
          <Link to="/my-books" className={linkClass('/my-books')}>
            <BookMarked className="w-4 h-4" />
            <span>My Books</span>
          </Link>
          <Link to="/borrowed" className={linkClass('/borrowed')}>
            <BookMarked className="w-4 h-4" />
            <span>Borrowed</span>
          </Link>
          <Link to="/profile" className={linkClass('/profile')}>
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
        </div>

        {/* Actions (Search and Buttons) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Search box */}
          <div className="relative flex-1 sm:flex-initial sm:w-48">
            <input
              type="text"
              placeholder="Search library..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full min-h-11 rounded-sm border border-border bg-background/50 pl-9 pr-3 py-2 text-sm focus:bg-surface focus:outline focus:outline-2 focus:outline-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-60" />
          </div>          
          
          {/* Action button */}
          <button
            onClick={handleAuthAction}
            className="min-h-11 rounded-sm bg-secondary px-4 py-2 font-semibold text-white transition duration-200 ease-smooth hover:opacity-95 text-sm flex items-center gap-1.5"
          >
            {user ? (
              <>
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login / Sign Up</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
