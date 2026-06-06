import { useEffect } from 'react'
import BookDetail from './BookDetail'

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
      role="presentation"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="presentation"
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <BookDetail bookId={bookId} onBorrow={onBorrow} isLoading={isLoading} />
      </div>
    </div>
  )
}
