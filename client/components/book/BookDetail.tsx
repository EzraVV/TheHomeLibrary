import { useGetBookById } from '../../hooks/useBooks'
import { useParams } from 'react-router'
import { atomiseInterests } from '../../../shared/utils/interestProcessing'

interface BookDetailsProp {
  bookId?: string
  onBorrow?: (bookId: string) => void
  isLoading?: boolean
}

export default function BookDetail(
  { bookId, onBorrow, isLoading }: BookDetailsProp,
) {
  const params = useParams<{ id: string }>()

  const id = bookId ?? params.id ?? ''

  const { data: book, isLoading: isBookLoading, error } = useGetBookById(id || '')
  const tags = book?.subject_index ? atomiseInterests(book.subject_index) : []
  const creators = book?.creator ? atomiseInterests(book.creator) : []

  if (isBookLoading) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        className="min-h-[22rem] rounded-md bg-surface p-6 text-left"
      >
        <div className="h-7 w-2/3 animate-pulse rounded-sm bg-background/80" />
        <div className="mt-5 flex gap-5">
          <div className="h-48 w-32 animate-pulse rounded-sm bg-background/80" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-sm bg-background/80" />
            <div className="h-4 w-5/6 animate-pulse rounded-sm bg-background/80" />
            <div className="h-4 w-2/3 animate-pulse rounded-sm bg-background/80" />
          </div>
        </div>
      </section>
    )
  }

  if (error) return <div role="alert">Unable to load this book.</div>
  if (!book) return <div>Book not found.</div>

  return (
    <section className="rounded-md bg-surface p-6 pr-14 text-left space-y-6">
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-secondary">
          {book.title}
        </h2>
        {book.description && (
          <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
            {book.description}
          </p>
        )}
        {book.image ? (
          <img
            src={book.image}
            alt={`Cover of ${book.title}`}
            className="w-16 h-24 object-cover mr-4"
          />
        ) : (
          <div className="w-16 h-24 bg-gray-200 mr-4 flex items-center justify-center text-xs text-gray-500">
            No Cover
          </div>
        )}

        {creators.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {creators.map((name) => (
              <span
                key={name}
                className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-sm border border-blue-200"
              >
                {name}
              </span>
            ))}
          </div>
        )}

        <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
          <span>Edition: </span>
          {book.edition_name}
        </p>
        <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
          <span>Format: </span>
          {book.format}
        </p>
        {book.isbn && (
          <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
            <span>ISBN: </span>
            {book.isbn}
          </p>
        )}
      </div>

      <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
        <span>Current status: </span>
        {book.status}
      </p>
      {book.condition && (
        <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
          <span>Condition: </span>
          {book.condition}
        </p>
      )}

      {book.lending_terms && (
        <p className="text-text-muted text-base leading-relaxed whitespace-pre-line">
          <span>Lending terms: </span>
          {book.lending_terms}
        </p>
      )}

      <button
        type="button"
        onClick={() => {
          onBorrow?.(book.book_id)
        }}
        disabled={isLoading}
        className="min-h-11 rounded-sm bg-primary px-5 py-2 font-semibold text-white transition duration-200 hover:opacity-90"
      >
        {isLoading ? 'Requesting...' : 'Request to Borrow'}
      </button>

      {book.search_index && (
        <div className="border-t border-border/40 my-4"></div>
      )}

      {tags && tags.length > 0 && (
        <div>
          <h3 className="font-heading text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-pill bg-accent/15 text-secondary border border-accent/25 px-3.5 py-1 text-xs font-semibold tracking-wide flex items-center gap-1 hover:bg-accent/20 transition-all cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
