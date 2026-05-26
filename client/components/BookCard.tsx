import { Book } from '../../models/book'
import { BookOpen, User as UserIcon } from 'lucide-react'

interface BookCardProps {
  book: Book
  onBorrow?: (bookId: string) => void
  isLoading?: boolean
}

export default function BookCard({ book, onBorrow, isLoading }: BookCardProps) {
  // Map status to styling guide badge classes
  const getBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-success text-white'
      case 'on loan':
      case 'borrowed':
        return 'bg-warning text-white'
      case 'overdue':
        return 'bg-danger text-white'
      default:
        return 'bg-accent text-white' // Reserved or In Transit
    }
  }

  const handleBorrow = () => {
    if (onBorrow && book.status.toLowerCase() === 'available') {
      onBorrow(book.id)
    }
  }

  const isAvailable = book.status.toLowerCase() === 'available'

  return (
    <div className="rounded-md bg-surface p-4 shadow-card hover:-translate-y-0.5 transition-all duration-180 ease-smooth flex flex-col justify-between border border-border/40 h-full">
      <div>
        {/* Cover image container */}
        <div className="aspect-[3/4] bg-background rounded-sm overflow-hidden mb-3 relative flex items-center justify-center border border-border/20">
          {book.image_urls ? (
            <img
              src={book.image_urls}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center text-text-muted">
              <BookOpen className="w-8 h-8 mb-1 opacity-40" />
              <span className="text-xs">No Cover</span>
            </div>
          )}
          {/* Status badge floating or top corner */}
          <div className="absolute top-2 right-2">
            <span className={`rounded-pill px-3 py-1 text-xs font-semibold ${getBadgeClass(book.status)}`}>
              {book.status}
            </span>
          </div>
        </div>

        {/* Book Details */}
        <div className="text-left">
          <h3 className="text-lg font-bold text-text-primary line-clamp-1 mb-0.5" title={book.title}>
            {book.title}
          </h3>
          <p className="text-sm text-text-muted line-clamp-1 mb-2 font-medium">
            by {book.creator || 'Unknown Author'}
          </p>

          {/* Owner details */}
          <div className="flex items-center gap-1.5 text-xs text-text-muted mb-4 bg-background/50 py-1 px-2 rounded-sm w-fit">
            <UserIcon className="w-3.5 h-3.5 opacity-60" />
            <span>Owner: <strong className="font-semibold text-text-primary">{book.owner_id || 'Library Member'}</strong></span>
          </div>
        </div>
      </div>

      {/* Borrow button */}
      <button
        onClick={handleBorrow}
        disabled={!isAvailable || isLoading}
        className={`min-h-11 w-full rounded-sm font-semibold transition duration-200 ease-smooth hover:opacity-90 flex items-center justify-center gap-2 px-4 py-2 text-white outline-none focus:outline-2 focus:outline-primary focus:outline-offset-2 ${
          isAvailable
            ? 'bg-primary cursor-pointer'
            : 'bg-text-muted/40 cursor-not-allowed opacity-60'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center gap-1">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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
  )
}
