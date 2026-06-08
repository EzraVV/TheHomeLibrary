// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SupportPage from './SupportPage'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('SupportPage', () => {
  it('exposes labelled support form fields', () => {
    render(<SupportPage />)

    expect(screen.getByLabelText('Your name')).toBeInTheDocument()
    expect(screen.getByLabelText('Your email')).toBeInTheDocument()
    expect(screen.getByLabelText('Describe your issue')).toBeInTheDocument()
  })

  it('announces successful submission', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true }),
    )

    render(<SupportPage />)

    await user.type(screen.getByLabelText('Your name'), 'Eden')
    await user.type(screen.getByLabelText('Your email'), 'eden@example.com')
    await user.type(screen.getByLabelText('Describe your issue'), 'Help')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Your support request has been sent.',
    )
  })
})
