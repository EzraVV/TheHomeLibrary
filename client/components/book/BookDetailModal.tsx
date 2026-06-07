import { useEffect } from 'react'
import BookDetail from './BookDetail'
import { X } from 'lucide-react'

interface Props {
  bookId: string
  onBorrow?: (bookId: string) => void
  isLoading?: boolean
  onClose: () => void
}

export default function BookDetailModal({
  bookId,
  onBorrow,
  isLoading,
  onClose,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div
      role="button"
      tabIndex={-1}
      aria-label="Close book details overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book details"
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-border bg-surface shadow-card"
      >
        <button
          type="button"
          aria-label="Close book details"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-surface text-text-muted transition hover:text-secondary"
        >
          <X className="h-4 w-4" />
        </button>
        <BookDetail
          bookId={bookId}
          onBorrow={onBorrow}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
