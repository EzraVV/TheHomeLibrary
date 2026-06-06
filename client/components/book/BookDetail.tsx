import { useGetBookById } from '../../hooks/useBooks'
import { useParams } from 'react-router'
import { atomiseInterests } from '../../../shared/utils/interestProcessing'

interface BookDetailsProp {
  bookId?: string
  onBorrow?: (bookId: string) => void
  isLoading?: boolean
}

export default function BookDetail({
  bookId,
  onBorrow,
  isLoading,
}: BookDetailsProp) {
  const params = useParams<{ id: string }>()

  const id = bookId ?? params.id ?? ''

  const { data: book, isLoading: isBookLoading } = useGetBookById(id || '')
  const tags = book?.subject_index ? atomiseInterests(book.subject_index) : []
  const creators = book?.creator ? atomiseInterests(book.creator) : []

  if (isBookLoading) {
    return <section>Loading...</section>
  }

  if (!book) return <div>Book not found.</div>

  //TODO Thee aesthetics and also add buttons, visibility depends on user logged in. Owner (Edit, delete) Other (Request)
  return (
    <section className="rounded-md bg-surface p-6 shadow-card border border-border/40 text-left space-y-6">
      {/* Details */}
      <div>
        <h2 className="font-heading text-xl font-bold text-secondary mb-3 flex items-center gap-2">
          Book Details
        </h2>
        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          {book.title}
        </p>
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
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

        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          <span>Edition: </span>
          {book.edition_name}
        </p>
        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          {' '}
          <span>Format: </span>
          {book.format}
        </p>
        {book.isbn && (
          <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
            {' '}
            <span>ISBN: </span>
            {book.isbn}
          </p>
        )}
      </div>
      {/* Meta */}

      <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
        <span>Current status: </span>
        {book.status}
      </p>
      {book.condition && (
        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          <span>Condition: </span>
          {book.condition}
        </p>
      )}

      {book.lending_terms && (
        <p className="text-text-muted text-base leading-relaxed leading-6 whitespace-pre-line">
          <span>Lending terms: </span>
          {book.lending_terms}
        </p>
      )}

      <button
        onClick={() => {
          onBorrow?.(book.book_id)
        }}
        disabled={isLoading}
        className="min-h-11 rounded-sm bg-primary px-5 py-2 font-semibold text-white transition duration-200 hover:opacity-90"
      >
        {isLoading ? 'Processing...' : 'Borrow Book'}
      </button>

      {book.subject_index && (
        <div className="border-t border-border/40 my-4"></div>
      )}

      {/* Tags badges */}
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

      {/* Placeholder for future Review System */}
      <div className="border-t border-border/40 my-6 pt-6">
        <h3 className="font-heading text-lg font-semibold text-secondary mb-3">
          Reviews
        </h3>
        <div className="bg-background/50 border border-dashed border-border p-8 rounded-md text-center">
          <p className="text-text-muted mb-4">
            Reviews for this edition have not been integrated yet.
          </p>
          <button
            className="bg-accent/10 text-accent px-4 py-2 rounded text-sm font-semibold hover:bg-accent/20 transition-all"
            onClick={() => alert('Integration point for Review creation')}
          >
            Add Review (Placeholder)
          </button>
        </div>
      </div>
    </section>
  )
}
