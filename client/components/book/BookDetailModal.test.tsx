// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookDetailModal from './BookDetailModal'

vi.mock('./BookDetail', () => ({
  default: ({ bookId }: { bookId: string }) => <div>Book detail for {bookId}</div>,
}))

afterEach(() => {
  cleanup()
})

describe('BookDetailModal', () => {
  it('renders book detail content inside a dialog frame', () => {
    render(<BookDetailModal bookId="bk_test01" onClose={vi.fn()} />)

    expect(screen.getByRole('dialog', { name: 'Book details' })).toBeInTheDocument()
    expect(screen.getByText('Book detail for bk_test01')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Close book details' })).toBeInTheDocument()
  })

  it('calls onClose from the close button, Escape, and outside click', () => {
    const onClose = vi.fn()
    const { container } = render(
      <BookDetailModal bookId="bk_test01" onClose={onClose} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Close book details' }))
    fireEvent.keyDown(window, { key: 'Escape' })
    fireEvent.click(container.firstElementChild as Element)

    expect(onClose).toHaveBeenCalledTimes(3)
  })
})
