import { useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSending(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch('/api/v1/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Support request failed')
      setForm({ name: '', email: '', message: '' })
      setSuccess('Your support request has been sent.')
    } catch {
      setError('Failed to send support ticket. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-app mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Support</h1>
      {error && <p role="alert" className="text-danger text-center mb-4">{error}</p>}
      {success && (
        <p role="status" aria-live="polite" className="text-success text-center mb-4">
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-lg p-6 shadow-sm max-w-lg mx-auto"
      >
        <label htmlFor="support-name" className="mb-1 block text-sm font-semibold">
          Your name
        </label>
        <input
          id="support-name"
          type="text"
          placeholder="Your name"
          className="input mb-4 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label htmlFor="support-email" className="mb-1 block text-sm font-semibold">
          Your email
        </label>
        <input
          id="support-email"
          type="email"
          placeholder="Your email"
          className="input mb-4 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label htmlFor="support-message" className="mb-1 block text-sm font-semibold">
          Describe your issue
        </label>
        <textarea
          id="support-message"
          placeholder="Describe your issue"
          className="input mb-4 w-full h-32"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button type="submit" className="btn-primary w-full" disabled={isSending}>
          {isSending ? <LoadingSpinner /> : 'Submit'}
        </button>
      </form>
    </div>
  )
}
