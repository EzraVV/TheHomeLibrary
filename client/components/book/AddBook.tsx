import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Book, BookFormData, SelectableBook } from '../../../models/book'
import { normaliseBookPayload } from '../../../shared/utils/normaliseBookPayload'
import { generateWorkId } from '../../../server/utils/generateWorkId'
import { useAddBook, useAddBookSearch } from '../../hooks/useBooks'
import BookForm from './BookForm'

interface AddBookProps {
  onAdded?: () => void
  onCancel?: () => void
}

export function AddBook({ onAdded, onCancel }: AddBookProps) {
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBook, setSelectedBook] = useState<SelectableBook | null>(null)
  const { data: searchResult, isLoading: isSearching, error } = useAddBookSearch(searchQuery)
  const bookMutation = useAddBook()

  useEffect(() => {
    if (inputValue.trim().length < 3) {
      setSearchQuery('')
      return
    }

    const handler = setTimeout(() => setSearchQuery(inputValue.trim()), 500)
    return () => clearTimeout(handler)
  }, [inputValue])

  const googleMatches = Array.isArray(searchResult?.externalData)
    ? searchResult.externalData.map((book) => normaliseBookPayload(book, 'google'))
    : []

  const handleCreateRecord = async (formData: BookFormData) => {
    const workId =
      selectedBook?.googleVolumeId ||
      (await generateWorkId(formData.title, formData.creator))

    const payload: Partial<Book> = {
      ...formData,
      work_id: workId,
      condition: formData.condition || 'Good',
      search_index: `${formData.title.toLowerCase()} ${formData.creator.toLowerCase()}`,
      lending_terms: formData.lending_terms || '',
    }

    bookMutation.mutate(payload, {
      onSuccess: () => {
        setInputValue('')
        setSearchQuery('')
        setSelectedBook(null)
        onAdded?.()
      },
    })
  }

  if (selectedBook) {
    return (
      <section className="rounded-md border border-border/60 bg-surface p-5 shadow-card">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-border/50 pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-primary">Confirm selection</p>
            <h2 className="mt-1 text-xl font-bold text-secondary">Review this book before adding it</h2>
            <p className="mt-1 text-sm text-text-muted">
              Google Books filled these details. Edit anything that does not match your copy.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedBook(null)}
            className="flex min-h-10 items-center gap-1 rounded-sm border border-border px-3 text-sm text-text-muted hover:bg-background"
          >
            <X className="h-4 w-4" />
            Back
          </button>
        </div>

        <BookForm
          initialValues={selectedBook}
          onSubmit={handleCreateRecord}
          isSaving={bookMutation.isPending}
        />
        {bookMutation.isError && (
          <p className="mt-3 text-sm font-semibold text-danger">
            The book could not be saved. Check the details and try again.
          </p>
        )}
      </section>
    )
  }

  return (
    <section className="rounded-md border border-border/60 bg-surface p-5 shadow-card">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-secondary">Add one of your books</h2>
          <p className="mt-1 text-sm text-text-muted">
            Search Google Books, then select a result to review before uploading.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close add book"
            className="rounded-sm border border-border p-2 text-text-muted hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <label htmlFor="google-book-search" className="mb-1 block text-sm font-semibold text-text-primary">
        Search by title, author, or ISBN
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          id="google-book-search"
          type="search"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="e.g. The Left Hand of Darkness"
          className="min-h-11 w-full rounded-sm border border-border bg-background/50 py-2 pl-10 pr-3 outline-none focus:border-primary"
        />
      </div>

      {isSearching && <p className="mt-4 text-sm text-text-muted">Searching Google Books...</p>}
      {error && (
        <p className="mt-4 text-sm font-semibold text-danger">
          Google Books search failed. Please try again.
        </p>
      )}
      {!isSearching && searchQuery && !error && googleMatches.length === 0 && (
        <p className="mt-4 text-sm text-text-muted">No Google Books matches found.</p>
      )}

      {googleMatches.length > 0 && (
        <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {googleMatches.map((book, index) => (
            <li
              key={book.googleVolumeId || `${book.title}-${index}`}
              className="flex gap-3 rounded-sm border border-border/50 bg-background/30 p-3"
            >
              <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-background">
                {book.image ? (
                  <img src={book.image} alt={`${book.title} cover`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center px-2 text-center text-xs text-text-muted">
                    No cover
                  </div>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <h3 className="line-clamp-2 text-sm font-bold text-text-primary">{book.title}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-text-muted">by {book.creator}</p>
                {book.isbn && <p className="mt-1 text-xs text-text-muted">ISBN {book.isbn}</p>}
                <button
                  type="button"
                  onClick={() => setSelectedBook(book)}
                  className="mt-auto min-h-9 rounded-sm bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Select and review
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
