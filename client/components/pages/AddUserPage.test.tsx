// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AddUserPage from './AddUserPage'

const signIn = vi.fn()
const signUp = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({ signIn, signUp }),
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('AddUserPage', () => {
  it('exposes labelled login fields', () => {
    render(
      <MemoryRouter>
        <AddUserPage />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument()
    expect(screen.getByLabelText('Password *')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Show password' }),
    ).toBeInTheDocument()
  })

  it('shows field-level validation errors for signup', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <AddUserPage />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Username is required.')).toBeInTheDocument()
    expect(screen.getByText('Email is required.')).toBeInTheDocument()
    expect(screen.getByText('Password is required.')).toBeInTheDocument()
    expect(screen.getByText('Postcode is required.')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please correct the highlighted fields and try again.',
    )
  })
})
