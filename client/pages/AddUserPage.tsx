import { useState } from 'react'
import { createUser } from '../apis/users'

export default function AddUserPage() {
  const [form, setForm] = useState({
    user_name: '',
    prounouns: '',
    email: '',
    postcode: '',
    about: '',
    interests: '',
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      const interestsArray = form.interests
        ? form.interests.split(',').map((s) => s.trim())
        : []

      await createUser({
        ...form,
        interests: interestsArray,
        status: 'ACTIVE',
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      })

      // TODO: redirect to profile or show success message
    } catch (err) {
      const error = err as { response?: { body?: { error?: string } } }
      if (error.response?.body?.error === 'Email already in use') {
        setError('Email already in use')
        return
      }

      setError('Something went wrong')
    }
  }

  return (
    <section className="add-user-page">
      <h1>Create Your Account</h1>
      {error && (
        <div className="popup-overlay">
          <div className="popup">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label>
          UserName
          <input
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Pronouns
          <input
            name="prounouns"
            value={form.prounouns}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input name="email" value={form.email} onChange={handleChange} />
        </label>

        <label>
          Postcode
          <input
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
          />
        </label>

        <label>
          About
          <textarea name="about" value={form.about} onChange={handleChange} />
        </label>

        <label>
          Interests (comma separated)
          <input
            name="interests"
            value={form.interests}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Create Account</button>
      </form>
    </section>
  )
}
