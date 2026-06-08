import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllBooks } from '../../apis/books'
import { Book } from '../../../models/book'
//import Navbar from '../components/layout/Navbar' -- Now in App Layout
//import Footer from '../components/layout/Footer' -- Now in App layout
import BookCard from '../../components/BookCard'
import { Library, Info, Sparkles } from 'lucide-react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import BookDetailModal from '../book/BookDetailModal'
import { useAddLoan } from '../../hooks/useLoans'
import { getAllLoans } from '../../apis/loans'

export default function HomePage() {
  const {
    data: books,
    isLoading,
    error,
  } = useQuery<Book[]>({
    queryKey: ['all-books'],
    queryFn: getAllBooks,
  })

  const { data: loans } = useQuery({
    queryKey: ['all-loans'],
    queryFn: getAllLoans,
  })

  const { data: user } = useCurrentUser()
  const addLoanMutation = useAddLoan()

  const availableBooks = books
    ?.filter((book) => book.owner_id !== user?.user_id)
    ?.filter((book) => {
      const activeOrPendingLoan = loans?.some(
        (loan) =>
          loan.book_id === book.book_id &&
          (loan.status === 'Active' || loan.status === 'Pending'),
      )
      return !activeOrPendingLoan
    })

  const [borrowingId, setBorrowingId] = useState<string | null>(null)
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState<string | null>(null)

  const handleBorrow = (bookId: string) => {
    setBorrowingId(bookId)
    setRequestMessage(null)
    addLoanMutation.mutate(
      { book_id: bookId },
      {
        onSuccess: () => {
          setRequestMessage('Borrow request sent.')
        },
        onError: () => {
          setRequestMessage('Unable to send borrow request. Please try again.')
        },
        onSettled: () => {
          setBorrowingId(null)
        },
      },
    )
  }

  return (
    <>
      <div className="w-full flex flex-col gap-8">
        <section
          aria-labelledby="home-hero-heading"
          aria-describedby="home-hero-description"
          className="bg-surface rounded-md p-6 md:p-8 shadow-card border border-border/40 text-left relative overflow-hidden"
        >
          <p className="sr-only">
            Welcome to the discover page. Browse available community library books below.
          </p>
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-pill mb-3">
              <Sparkles aria-hidden="true" className="w-3 h-3" />
              Community Shared Library
            </p>
            <h1
              id="home-hero-heading"
              className="font-heading text-3xl md:text-4xl font-bold text-secondary mb-3 leading-tight"
            >
              Unlock the libraries hidden in our homes
            </h1>
            <p
              id="home-hero-description"
              className="text-text-muted text-base md:text-lg mb-0"
            >
              We are building a cozy, person-to-person book lending network.
              Borrow books you love, share books you&apos;ve read, and connect
              with fellow readers in your neighborhood.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none hidden md:block">
            <Library aria-hidden="true" className="w-64 h-64 text-primary" />
          </div>
        </section>

        <section aria-labelledby="discover-books-heading">
          <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-6">
            <h2 id="discover-books-heading" className="font-heading text-2xl font-bold text-secondary flex items-center gap-2">
              <Library aria-hidden="true" className="w-5.5 h-5.5 text-primary stroke-[2.5]" />
              Discover Books
            </h2>
            <p className="text-sm font-semibold text-text-muted" aria-live="polite">
              {availableBooks
                ? `${availableBooks.length} books available`
                : 'Loading...'}
            </p>
          </div>

          {isLoading && (
            <div
              aria-busy="true"
              aria-live="polite"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-md bg-surface p-4 shadow-card border border-border/40 animate-pulse flex flex-col justify-between h-[380px]"
                >
                  <div>
                    <div className="aspect-[3/4] bg-background/80 rounded-sm mb-4 w-full"></div>
                    <div className="h-5 bg-background/80 rounded-sm w-3/4 mb-2"></div>
                    <div className="h-4 bg-background/80 rounded-sm w-1/2 mb-4"></div>
                  </div>
                  <div className="h-11 bg-background/80 rounded-sm w-full"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div role="alert" className="bg-danger/10 border border-danger/30 text-danger rounded-md p-4 flex gap-3 items-center">
              <Info aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Failed to load the library catalogue. Please try reloading the
                page.
              </p>
            </div>
          )}

          {requestMessage && (
            <div
              role="status"
              className="mb-4 rounded-sm border border-border bg-surface px-4 py-3 text-sm font-medium text-secondary"
            >
              {requestMessage}
            </div>
          )}

          {!isLoading &&
            !error &&
            (!availableBooks || availableBooks.length === 0) && (
              <div className="rounded-md bg-surface border border-dashed border-border py-12 px-4 text-center max-w-md mx-auto my-8">
                <Library aria-hidden="true" className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-secondary mb-1">
                  No books uploaded yet
                </h3>
                <p className="text-text-muted text-sm mb-4">
                  Be the first to share your home library collection with the
                  community!
                </p>
                <button type="button" className="min-h-11 rounded-sm bg-primary px-5 py-2 font-semibold text-white transition duration-200 ease-smooth hover:opacity-90">
                  Share a Book
                </button>
              </div>
            )}

          {!isLoading &&
            !error &&
            availableBooks &&
            availableBooks.length > 0 && (
              <>
                <p id="discover-books-list-help" className="sr-only">
                  Use the Next book button on each card to open details. The title, author, owner, and availability are announced as you read through the list.
                </p>
                <ul
                  aria-describedby="discover-books-list-help"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                {availableBooks.map((book: Book, i: number) => (
                  <li key={book.book_id || book.isbn || `catalogue-${i}`} className="list-none">
                    <BookCard
                      book={book}
                      onBorrow={handleBorrow}
                      onSelect={() => setSelectedBookId(book.book_id)}
                      isLoading={borrowingId === book.book_id}
                    />
                  </li>
                ))}
                </ul>
              </>
            )}
        </section>
      </div>

      {selectedBookId && (
        <BookDetailModal
          bookId={selectedBookId}
          onBorrow={handleBorrow}
          isLoading={borrowingId === selectedBookId}
          onClose={() => setSelectedBookId(null)}
        />
      )}
    </>
  )
}
