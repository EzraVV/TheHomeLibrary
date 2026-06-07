// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { BorrowedList } from './BorrowedList'
import { Loan } from '../../../models/loan'

afterEach(() => {
  cleanup()
})

describe('BorrowedList', () => {
  it('renders an empty state when there are no borrowed loans', () => {
    render(
      <MemoryRouter>
        <BorrowedList loans={[]} />
      </MemoryRouter>,
    )

    expect(screen.getByText("You haven't borrowed any books yet")).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Catalog' })).toHaveAttribute(
      'href',
      '/books/search',
    )
  })

  it('renders borrowed loan details', () => {
    const loans: Loan[] = [
      {
        loan_id: 'ln_test01',
        book_id: 'bk_test01',
        owner_id: 'u_owner',
        borrower_id: 'u_borrower',
        status: 'Pending',
        due_at: '2026-07-01T00:00:00.000Z',
        returned_at: '',
        created_at: '2026-06-01T00:00:00.000Z',
        updated_at: '2026-06-01T00:00:00.000Z',
        archived_at: null,
        book_title: 'Borrowed Book',
        book_image: '',
        owner_name: 'book_owner',
      },
    ]

    render(
      <MemoryRouter>
        <BorrowedList loans={loans} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Borrowed Book')).toBeInTheDocument()
    expect(screen.getByText('Owner: book_owner')).toBeInTheDocument()
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })
})
