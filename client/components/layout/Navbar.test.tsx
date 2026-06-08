// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Navbar from './Navbar'

vi.mock('../../hooks/useCurrentUser', () => ({
  useCurrentUser: () => ({ data: null }),
}))

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ signOut: vi.fn() }),
}))

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname + location.search}</div>
}

function renderNavbar(initialPath = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar />
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

afterEach(() => {
  cleanup()
})

describe('Navbar search', () => {
  it('renders the primary navigation as a list', () => {
    renderNavbar()

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })

  it('does not navigate while typing and submits on Enter', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.type(
      screen.getByRole('textbox', { name: 'Search the library catalogue' }),
      'dune',
    )

    expect(screen.getByTestId('location')).toHaveTextContent('/')

    await user.keyboard('{Enter}')

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/books/search?query=dune',
    )
  })

  it('submits from the search button', async () => {
    const user = userEvent.setup()
    renderNavbar('/books/search')

    await user.type(
      screen.getByRole('textbox', { name: 'Search the library catalogue' }),
      'asimov',
    )
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/books/search?query=asimov',
    )
  })
})
