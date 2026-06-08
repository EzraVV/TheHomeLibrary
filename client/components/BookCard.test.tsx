// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import BookCard from './BookCard'

const book = {
  book_id: 'book-1',
  title: 'The Dispossessed',
  creator: 'Ursula K. Le Guin',
  status: 'Available',
  owner_id: 'owner-1',
  image: '',
}

afterEach(() => {
  cleanup()
})

describe('BookCard', () => {
  it('separates the details action from the borrow action', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onBorrow = vi.fn()

    render(
      <MemoryRouter>
        <BookCard book={book as never} onSelect={onSelect} onBorrow={onBorrow} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'The Dispossessed' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Ursula K. Le Guin'),
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', {
        name: 'Next book. View details for The Dispossessed',
      }),
    )
    await user.click(
      screen.getByRole('button', {
        name: 'Borrow The Dispossessed by Ursula K. Le Guin',
      }),
    )

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onBorrow).toHaveBeenCalledWith('book-1')
  })
})
