import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query')
    const pathTitles: Record<string, string> = {
      '/': 'Discover Books',
      '/signup': 'Log In or Sign Up',
      '/my-books': 'My Books',
      '/borrowed': 'Borrowed Books',
      '/profile': 'Your Profile',
      '/about': 'About',
      '/support': 'Support',
      '/books/search': query ? `Search: ${query}` : 'Search Books',
      '/books/dashboard': 'Book Dashboard',
      '/auth/confirm': 'Confirm Your Account',
    }

    const fallbackTitle = location.pathname.startsWith('/books/')
      ? 'Book Details'
      : 'The Home Library'

    const pageTitle = pathTitles[location.pathname] ?? fallbackTitle
    document.title = `${pageTitle} | The Home Library`
  }, [location.pathname, location.search])

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      <Navbar />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 w-full max-w-app mx-auto px-4 py-6 md:px-6"
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
