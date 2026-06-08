import { useEffect, useId, useRef } from 'react'
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
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = 'auto'
      previousFocusRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!first || !last) {
        return
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <button
        type="button"
        aria-label="Close book details overlay"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-border bg-surface shadow-card"
      >
        <div className="sr-only">
          <h2 id={titleId}>Book details</h2>
          <p id={descriptionId}>
            Review book details and request to borrow this book.
          </p>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close book details"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-surface text-text-muted transition hover:text-secondary"
        >
          <X aria-hidden="true" className="h-4 w-4" />
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
