import { useId } from 'react'
import { Book } from '../../models/book'
import { BookOpen, User as UserIcon } from 'lucide-react'

interface BookCardProps {
  book: Book
  onBorrow?: (bookId: string) => void
  onSelect?: () => void
  isLoading?: boolean
}

export default function BookCard({
  book,
  onSelect,
  onBorrow,
  isLoading,
}: BookCardProps) {
  const titleId = useId()
  const statusId = useId()
  const nextBookLabelId = useId()

  // Map status to styling guide badge classes
  const getBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-[#3d6f4d] text-white'
      case 'on loan':
      case 'borrowed':
        return 'bg-[#8a651f] text-white'
      case 'overdue':
        return 'bg-[#943d3d] text-white'
      default:
        return 'bg-[#7a5a2c] text-white' // Reserved or In Transit
    }
  }

  const handleBorrow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (onBorrow && book.status.toLowerCase() === 'available') {
      onBorrow(book.book_id)
    }
  }

  const isAvailable = book.status.toLowerCase() === 'available'
  const authorName = book.creator || 'Unknown author'
  const ownerName = book.owner_id || 'Library member'

  return (
    <article className="rounded-md bg-surface p-4 shadow-card hover:-translate-y-0.5 transition-all duration-180 ease-smooth flex flex-col justify-between border border-border/40 h-full">
      <div>
        <div className="aspect-[3/4] bg-background rounded-sm overflow-hidden mb-3 relative flex items-center justify-center border border-border/20">
          {book.image ? (
            <img
              src={book.image}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center text-text-muted">
              <BookOpen aria-hidden="true" className="w-8 h-8 mb-1 opacity-40" />
              <span className="text-xs">No Cover</span>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span
              id={statusId}
              className={`rounded-pill px-3 py-1 text-xs font-semibold ${getBadgeClass(book.status)}`}
            >
              {book.status}
            </span>
          </div>
        </div>

        <div className="text-left">
          <h3
            id={titleId}
            className="text-lg font-bold text-text-primary line-clamp-1 mb-0.5"
            title={book.title}
          >
            {book.title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-1 mb-2 font-medium">
            <span className="sr-only">Author: </span>
            <span aria-hidden="true">by </span>
            {authorName}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4 bg-background/50 py-1 px-2 rounded-sm w-fit">
            <UserIcon aria-hidden="true" className="w-3.5 h-3.5 opacity-60" />
            <span>
              <span className="sr-only">Owner: </span>
              <span aria-hidden="true">Owner: </span>
              <strong className="font-semibold text-text-primary">
                {ownerName}
              </strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {onSelect && (
          <button
            type="button"
            onClick={onSelect}
            className="min-h-11 w-full rounded-sm border border-border bg-background/40 px-4 py-2 text-sm font-semibold text-secondary transition hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            aria-labelledby={`${nextBookLabelId} ${titleId}`}
            aria-describedby={statusId}
          >
            <span id={nextBookLabelId} className="sr-only">
              Next book. View details for
            </span>
            View details
          </button>
        )}
        <button
          type="button"
          onClick={handleBorrow}
          disabled={!isAvailable || isLoading}
          aria-label={
            isAvailable
              ? `Borrow ${book.title} by ${authorName}`
              : `${book.title} by ${authorName} is not available to borrow`
          }
          className={`min-h-11 w-full rounded-sm font-semibold transition duration-200 ease-smooth hover:opacity-90 flex items-center justify-center gap-2 px-4 py-2 text-white outline-none focus:outline-2 focus:outline-primary focus:outline-offset-2 ${
            isAvailable
              ? 'bg-primary cursor-pointer'
              : 'bg-[#76706a] cursor-not-allowed opacity-100'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-1">
              <svg
                aria-hidden="true"
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processing...
            </span>
          ) : isAvailable ? (
            'Borrow Book'
          ) : (
            'Not Available'
          )}
        </button>
      </div>
    </article>
  )
}
