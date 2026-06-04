import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage'
import UserProfilePage from './pages/UserProfilePage'
//import Navbar from './layout/Navbar'
//import Footer from './layout/Footer'
import { AddBook } from './book/AddBook'
import SearchPage from './book/SearchPage'
import SearchResultsPage from './pages/SearchResultsPage'
import { BookDashboard } from './book/BookDashboard'
import { BookOpen, Library } from 'lucide-react'
import AddUserPage from './pages/AddUserPage'
import { EditBook } from './book/EditBook'
import AppLayout from './layout/AppLayout'
import BookDetail from './book/BookDetail'
import AboutPage from './pages/AboutPage'

// Cozy placeholder page for My Books
function MyBooksPlaceholder() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
      <main className="flex-grow max-w-app w-full mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-surface rounded-md shadow-card border border-border/40 max-w-md w-full py-12">
          <BookOpen className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
          <h2 className="font-heading text-2xl font-bold text-secondary mb-1">
            No books uploaded yet
          </h2>
          <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
            You haven&apos;t listed any books in your personal library yet.
            Share a book with your community!
          </p>
          <Link
            to="/books"
            className="min-h-11 rounded-sm bg-primary px-6 py-2 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90"
          >
            Add to My Library
          </Link>
        </div>
      </main>
    </div>
  )
}

// Cozy placeholder page for Borrowed Books
function BorrowedPlaceholder() {
  return (
    <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
      <main className="flex-grow max-w-app w-full mx-auto px-4 py-12 text-center flex flex-col items-center justify-center gap-4">
        <div className="p-4 bg-surface rounded-md shadow-card border border-border/40 max-w-md w-full py-12">
          <Library className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
          <h2 className="font-heading text-2xl font-bold text-secondary mb-1">
            You haven’t borrowed any books yet
          </h2>
          <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
            Explore our community catalogue to discover, request, and borrow
            books from other members.
          </p>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-primary px-6 py-2 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90"
          >
            Browse Catalog
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        {/* <Route path="/my-books" element={<MyBooksPlaceholder />} />
        <Route path="/borrowed" element={<BorrowedPlaceholder />} />*/}
        <Route path="/signup" element={<AddUserPage />} />
        <Route path="/books/dashboard" element={<BookDashboard />} />
        <Route path="/books/add" element={<AddBook />} />
        <Route path="/books/:id/update" element={<EditBook />} />
        <Route path="/books/:id/" element={<BookDetail />} />
        <Route path="/books/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}
