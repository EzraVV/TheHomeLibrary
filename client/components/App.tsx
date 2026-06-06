import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const HomePage = lazy(() => import('./pages/HomePage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const SearchPage = lazy(() => import('./book/SearchPage'))
const AddUserPage = lazy(() => import('./pages/AddUserPage'))
const AppLayout = lazy(() => import('./layout/AppLayout'))
const BookDetail = lazy(() => import('./book/BookDetail'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))
const AuthConfirmPage = lazy(() => import('./pages/AuthConfirmPage'))
const MyBooksPage = lazy(() => import('./pages/MyBooksPage'))
const ProtectedRoute = lazy(() => import('./auth/ProtectedRoute'))
const AddBook = lazy(() =>
  import('./book/AddBook').then((module) => ({ default: module.AddBook })),
)
const BookDashboard = lazy(() =>
  import('./book/BookDashboard').then((module) => ({
    default: module.BookDashboard,
  })),
)
const EditBook = lazy(() =>
  import('./book/EditBook').then((module) => ({ default: module.EditBook })),
)

export default function App() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/auth/confirm" element={<AuthConfirmPage />} />
        {/* <Route path="/my-books" element={<MyBooksPlaceholder />} />
        <Route path="/borrowed" element={<BorrowedPlaceholder />} />*/}
        <Route path="/signup" element={<AddUserPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/my-books" element={<MyBooksPage />} />
          <Route path="/books/dashboard" element={<BookDashboard />} />
          <Route path="/books/add" element={<AddBook />} />
          <Route path="/books/:id/update" element={<EditBook />} />
        </Route>
        <Route path="/books/:id/" element={<BookDetail />} />
        <Route path="/books/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
