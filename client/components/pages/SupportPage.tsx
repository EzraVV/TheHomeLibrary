import { useState } from 'react'
import LoadingSpinner from '../LoadingSpinner'

export default function SupportPage() {
  const fieldClass =
    'w-full rounded-sm border-2 border-secondary/50 bg-white px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/70 shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30'

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please complete all fields before submitting.')
      return
    }

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
      window.alert('Submitted successfully')
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
        <label className="mb-4 block font-medium text-text-primary">
          Your name
          <input
            type="text"
            placeholder="Enter your name"
            className={`${fieldClass} mt-2`}
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </label>

        <label className="mb-4 block font-medium text-text-primary">
          Your email
          <input
            type="email"
            placeholder="Enter your email"
            className={`${fieldClass} mt-2`}
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>

        <label className="mb-4 block font-medium text-text-primary">
          How can we help?
          <textarea
            placeholder="Describe your issue"
            className={`${fieldClass} mt-2 h-32 resize-y`}
            value={form.message}
            required
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </label>

        <button className="btn-primary w-full" disabled={isSending}>
          {isSending ? <LoadingSpinner /> : 'Submit'}
        </button>
      </form>
    </div>
  )
}
