import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function AppLayout() {
  const location = useLocation()
  const query = new URLSearchParams(location.search).get('query')

  const mainContentContext = (() => {
    if (location.pathname === '/') {
      return {
        label: 'Discover books',
        description:
          'Browse the community shared library, featured discover content, and available books to borrow.',
      }
    }

    if (location.pathname === '/signup') {
      return {
        label: 'Log in or sign up',
        description:
          'Create an account or sign in to manage your home library and borrowing activity.',
      }
    }

    if (location.pathname === '/my-books') {
      return {
        label: 'My books',
        description:
          'Review the books you have shared, search for books to add, and manage your uploaded library.',
      }
    }

    if (location.pathname === '/borrowed' || location.pathname === '/books/dashboard') {
      return {
        label: 'Borrowed books dashboard',
        description:
          'Review your borrowing requests, active loans, and the books you have loaned to other readers.',
      }
    }

    if (location.pathname === '/profile') {
      return {
        label: 'Your profile',
        description:
          'Review your member profile, about information, owned books, and borrowing activity.',
      }
    }

    if (location.pathname === '/about') {
      return {
        label: 'About The Home Library',
        description:
          'Learn about The Home Library project and the team members behind it.',
      }
    }

    if (location.pathname === '/support') {
      return {
        label: 'Support',
        description:
          'Contact the team or send a support message about your account or library activity.',
      }
    }

    if (location.pathname === '/books/search') {
      return {
        label: 'Search books',
        description: query
          ? `Search results for ${query} in The Home Library catalogue.`
          : 'Search The Home Library catalogue for books to browse or borrow.',
      }
    }

    if (location.pathname === '/books/add') {
      return {
        label: 'Add a book',
        description:
          'Search for a book and add it to your shared home library collection.',
      }
    }

    if (location.pathname.startsWith('/books/') && location.pathname.endsWith('/update')) {
      return {
        label: 'Edit book details',
        description:
          'Update the information for a book in your home library collection.',
      }
    }

    if (location.pathname.startsWith('/books/')) {
      return {
        label: 'Book details',
        description:
          'Read the selected book details, availability, and borrowing options.',
      }
    }

    if (location.pathname === '/auth/confirm') {
      return {
        label: 'Confirm your account',
        description:
          'Review the account confirmation status for The Home Library.',
      }
    }

    return {
      label: 'Main content',
      description: 'The main content area for this page.',
    }
  })()

  useEffect(() => {
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
  }, [location.pathname, location.search, query])

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
        aria-label={mainContentContext.label}
        aria-describedby="main-content-description"
        className="flex-1 w-full max-w-app mx-auto px-4 py-6 md:px-6"
      >
        <p id="main-content-description" className="sr-only">
          {mainContentContext.description}
        </p>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
