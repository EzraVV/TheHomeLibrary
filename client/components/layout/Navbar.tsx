import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormEvent, useEffect, useState } from 'react'
import { BookOpen, User, BookMarked, Layers, Search, LogOut, LogIn } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUser()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const [inputValue, setInputValue] = useState('')
  const currentQueryParams = new URLSearchParams(location.search)
  const currentQueryString = currentQueryParams.get('query') || ''

  useEffect(() => {
    if (location.pathname === '/books/search') {
      setInputValue(currentQueryString)
    } else {
      setInputValue('')
    }
  }, [location.pathname, currentQueryString])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedInput = inputValue.trim()

    if (trimmedInput.length === 0) {
      navigate('/books/search')
      return
    }

    if (trimmedInput.length < 3) {
      return
    }

    navigate(`/books/search?query=${encodeURIComponent(trimmedInput)}`)
  }

  const linkClass = (path: string) => {
    return `flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-semibold transition-all duration-180 ${
      isActive(path)
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-muted hover:text-primary hover:bg-primary/5'
    }`
  }

  const handleAuthAction = async () => {
    if (user) {
      await signOut()
      queryClient.clear()
      navigate('/signup')
    } else {
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
          <Link to={user ? '/my-books' : '/signup'} className={linkClass('/my-books')}>
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
          <form
            role="search"
            onSubmit={handleSearchSubmit}
            className="flex flex-1 items-center gap-2 sm:flex-initial"
          >
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search library..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full min-h-11 rounded-sm border border-border bg-background/50 pl-9 pr-3 py-2 text-sm focus:bg-surface focus:outline focus:outline-2 focus:outline-primary transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted opacity-60" />
          </div>
          <button
            type="submit"
            className="min-h-11 rounded-sm bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Search
          </button>
          </form>
          
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
