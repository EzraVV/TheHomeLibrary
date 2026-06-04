import { useState } from 'react'

export default function SupportPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch('/api/v1/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Support ticket sent successfully')
      setForm({ name: '', email: '', message: '' })
    } else {
      alert('Failed to send support ticket')
    }
  }

  return (
    <div className="max-w-app mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Support</h1>

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

        <button className="btn-primary w-full">Submit</button>
      </form>
    </div>
  )
}
