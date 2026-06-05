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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSending(true)
    setError(null)

    try {
      const res = await fetch('/api/v1/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Support request failed')
      setForm({ name: '', email: '', message: '' })
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

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-lg p-6 shadow-sm max-w-lg mx-auto"
      >
        <input
          type="text"
          placeholder="Your name"
          className="input mb-4 w-full"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Your email"
          className="input mb-4 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <textarea
          placeholder="Describe your issue"
          className="input mb-4 w-full h-32"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button className="btn-primary w-full" disabled={isSending}>
          {isSending ? <LoadingSpinner /> : 'Submit'}
        </button>
      </form>
    </div>
  )
}
