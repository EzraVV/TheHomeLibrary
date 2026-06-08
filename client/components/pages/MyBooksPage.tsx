import { useState } from 'react'
import { BookMarked, BookOpen, Plus, X } from 'lucide-react'
import { Book } from '../../../models/book'
import { AddBook } from '../book/AddBook'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { useUserBooks } from '../../hooks/useUserBooks'

export default function MyBooksPage() {
  const [isAdding, setIsAdding] = useState(false)
  const { data: user, isLoading: isUserLoading } = useCurrentUser()
  const {
    data: books,
    isLoading: isBooksLoading,
    error,
  } = useUserBooks(user?.user_id || '')

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-md border border-border/40 bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold text-secondary">
              <BookMarked className="h-7 w-7 text-primary" />
              My Books
            </h1>
            <p className="mt-2 text-sm text-text-muted">
              Books you own and have shared with the community. Borrowed books are tracked separately.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdding((open) => !open)}
            className="flex min-h-11 items-center gap-2 rounded-sm bg-primary px-4 py-2 font-semibold text-white hover:opacity-90"
          >
            {isAdding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {isAdding ? 'Close' : 'Add Book'}
          </button>
        </div>
      </section>

      {isAdding && <AddBook onAdded={() => setIsAdding(false)} onCancel={() => setIsAdding(false)} />}

      <section className="rounded-md border border-border/40 bg-surface p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between border-b border-border/50 pb-3">
          <h2 className="text-xl font-bold text-secondary">Your uploaded books</h2>
          <span className="rounded-pill bg-background px-3 py-1 text-xs font-semibold text-text-muted">
            {books?.length || 0} listed
          </span>
        </div>

        {(isUserLoading || isBooksLoading) && <p className="text-sm text-text-muted">Loading your books...</p>}
        {error && <p className="text-sm font-semibold text-danger">Your books could not be loaded.</p>}
        {!isUserLoading && !isBooksLoading && !error && (!books || books.length === 0) && (
          <div className="rounded-sm border border-dashed border-border p-10 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-text-muted/40" />
            <h3 className="font-bold text-secondary">You have not uploaded any books yet</h3>
            <p className="mt-1 text-sm text-text-muted">Use Add Book to share your first book.</p>
          </div>
        )}

        {books && books.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {books.map((book: Book) => (
              <article key={book.book_id} className="rounded-sm border border-border/50 bg-background/30 p-3">
                <div className="aspect-[3/4] overflow-hidden rounded-sm bg-background">
                  {book.image ? (
                    <img src={book.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-text-muted">No cover</div>
                  )}
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-bold text-text-primary">{book.title}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-text-muted">by {book.creator || 'Unknown author'}</p>
                <span className="mt-3 inline-block rounded-pill border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                  {book.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
