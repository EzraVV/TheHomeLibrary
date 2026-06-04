import { useState } from 'react'
import { createUser } from '../apis/users'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { UserPlus, Sparkles, Mail, Compass, Info, CheckCircle2, ArrowLeft } from 'lucide-react'

export default function AddUserPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    user_name: '',
    prounouns: '',
    email: '',
    postcode: '',
    about: '',
    interests: '',
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    // Form Validation Checks
    if (!form.user_name.trim()) {
      setError('Username is required')
      setIsSubmitting(false)
      return
    }
    if (!form.email.trim()) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }
    if (!form.postcode.trim()) {
      setError('Postcode is required')
      setIsSubmitting(false)
      return
    }

    try {
      const interestsArray = form.interests
        ? form.interests.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      const createdUser = await createUser({
        ...form,
        interests: interestsArray,
        status: 'ACTIVE',
        is_deleted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      })

      if (createdUser && createdUser.user_id) {
        localStorage.setItem('active_user_id', createdUser.user_id)
      }

      setSuccess(true)
      setIsSubmitting(false)
      
      // Auto redirect to profile page after 2 seconds
      setTimeout(() => {
        navigate('/profile')
      }, 2000)

    } catch (err) {
      setIsSubmitting(false)
      const error = err as { response?: { body?: { error?: string } } }
      if (error.response?.body?.error === 'Email already in use') {
        setError('Email already in use')
        return
      }

      setError('Something went wrong. Please check your inputs and try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background text-text-primary font-body flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center items-center">
        {success ? (
          /* Cozy Success Card */
          <div className="bg-surface rounded-md p-8 shadow-card border border-border/40 text-center w-full py-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-success"></div>
            <div className="w-16 h-16 bg-success/10 text-success rounded-pill flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-secondary mb-2">
              Welcome to the Library!
            </h2>
            <p className="text-text-muted text-sm mb-6 max-w-xs mx-auto">
              Your account has been created successfully. We are redirecting you to your cozy new profile...
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-semibold">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Preparing your bookshelves...</span>
            </div>
          </div>
        ) : (
          /* Cozy Form Card */
          <div className="bg-surface rounded-md p-6 md:p-8 shadow-card border border-border/40 w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
            
            {/* Header info */}
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary mb-4 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to catalog
              </Link>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 bg-primary/10 text-primary rounded-sm">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-secondary">
                  Create Account
                </h1>
              </div>
              <p className="text-text-muted text-sm">
                Join our cozy community-focused book lending network.
              </p>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="bg-danger/10 border border-danger/20 text-danger rounded-sm p-3 mb-6 text-sm flex gap-2 items-start">
                <Info className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
                <p className="font-semibold leading-relaxed text-left">{error}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              
              {/* Username Input */}
              <div className="flex flex-col">
                <label htmlFor="user_name" className="text-sm font-semibold text-text-muted mb-1.5">
                  Username *
                </label>
                <input
                  id="user_name"
                  name="user_name"
                  type="text"
                  placeholder="e.g. bookworm_jane"
                  value={form.user_name}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                  required
                />
              </div>

              {/* Pronouns Input */}
              <div className="flex flex-col">
                <label htmlFor="prounouns" className="text-sm font-semibold text-text-muted mb-1.5">
                  Pronouns
                </label>
                <input
                  id="prounouns"
                  name="prounouns"
                  type="text"
                  placeholder="e.g. she/her"
                  value={form.prounouns}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold text-text-muted mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-border bg-background/30 pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                    required
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40" />
                </div>
              </div>

              {/* Postcode Input */}
              <div className="flex flex-col">
                <label htmlFor="postcode" className="text-sm font-semibold text-text-muted mb-1.5">
                  NZ Postcode *
                </label>
                <div className="relative">
                  <input
                    id="postcode"
                    name="postcode"
                    type="text"
                    placeholder="e.g. 1010"
                    value={form.postcode}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-border bg-background/30 pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                    required
                  />
                  <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40" />
                </div>
              </div>

              {/* About Textarea */}
              <div className="flex flex-col">
                <label htmlFor="about" className="text-sm font-semibold text-text-muted mb-1.5">
                  About Me
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  placeholder="Share a bit about yourself or your favorite genres..."
                  value={form.about}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180 resize-none"
                />
              </div>

              {/* Interests Input */}
              <div className="flex flex-col">
                <label htmlFor="interests" className="text-sm font-semibold text-text-muted mb-1.5">
                  Interests <span className="text-xs font-normal text-text-muted/65">(comma separated)</span>
                </label>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  placeholder="e.g. Sci-Fi, Gardening, Classic Literature"
                  value={form.interests}
                  onChange={handleChange}
                  className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-11 rounded-sm bg-primary px-6 py-2.5 font-semibold text-white transition duration-180 ease-smooth hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-pill animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
