import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  UserPlus,
  Sparkles,
  Mail,
  Compass,
  Info,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react'

type FormState = {
  user_name: string
  pronouns: string
  email: string
  password: string
  postcode: string
  about: string
  interests: string
}

export default function AddUserPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signup' | 'login'>('login')
  const [form, setForm] = useState<FormState>({
    user_name: '',
    pronouns: '',
    email: '',
    password: '',
    postcode: '',
    about: '',
    interests: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target as { name: keyof FormState; value: string }

    setFieldErrors((current) => {
      if (!current[name]) return current

      const updated = { ...current }
      delete updated[name]
      return updated
    })

    setForm((current) => ({ ...current, [name]: value }))
  }

  function validateForm() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {}

    if (mode === 'signup' && !form.user_name.trim()) {
      nextErrors.user_name = 'Username is required.'
    }
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.'
    }
    if (!form.password) {
      nextErrors.password = 'Password is required.'
    } else if (form.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters.'
    }
    if (mode === 'signup' && !form.postcode.trim()) {
      nextErrors.postcode = 'Postcode is required.'
    }

    return nextErrors
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    const nextErrors = validateForm()
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setError('Please correct the highlighted fields and try again.')
      setIsSubmitting(false)
      return
    }

    try {
      if (mode === 'login') {
        await signIn(form.email, form.password)
        navigate(searchParams.get('returnTo') || '/profile')
        return
      }

      const interestsArray = form.interests
        ? form.interests
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      await signUp({
        email: form.email,
        password: form.password,
        user_name: form.user_name,
        pronouns: form.pronouns,
        postcode: form.postcode,
        about: form.about,
        interests: interestsArray,
      })

      setSuccess(true)
    } catch (err) {
      const authError = err as { response?: { body?: { error?: string } } }
      if (authError.response?.body?.error === 'Email already in use') {
        setError('Email already in use')
      } else {
        setError('Something went wrong. Please check your inputs and try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function getFieldProps(fieldName: keyof FormState, helpId?: string) {
    const errorId = `${fieldName}-error`
    const describedBy = [helpId, fieldErrors[fieldName] ? errorId : null]
      .filter(Boolean)
      .join(' ')

    return {
      'aria-invalid': Boolean(fieldErrors[fieldName]),
      'aria-describedby': describedBy || undefined,
    }
  }

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12 flex flex-col justify-center items-center">
      {success ? (
        <div className="bg-surface rounded-md p-8 shadow-card border border-border/40 text-center w-full py-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-success"></div>
          <div className="w-16 h-16 bg-success/10 text-success rounded-pill flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 aria-hidden="true" className="w-10 h-10 stroke-[2.5]" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-secondary mb-2">
            Check your email
          </h1>
          <p
            role="status"
            aria-live="polite"
            className="text-text-muted text-sm mb-6 max-w-xs mx-auto"
          >
            Confirm your email address, then return here to log in.
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-semibold">
            <Sparkles aria-hidden="true" className="w-4 h-4 text-accent" />
            <button
              type="button"
              onClick={() => {
                setSuccess(false)
                setMode('login')
                setError(null)
              }}
            >
              Return to login
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-md p-6 md:p-8 shadow-card border border-border/40 w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>

          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary mb-4 transition-colors"
            >
              <ArrowLeft aria-hidden="true" className="w-3.5 h-3.5" />
              Back to catalog
            </Link>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 bg-primary/10 text-primary rounded-sm">
                <UserPlus aria-hidden="true" className="w-5 h-5" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-secondary">
                {mode === 'signup' ? 'Create Account' : 'Log In'}
              </h1>
            </div>
            <p className="text-text-muted text-sm">
              {mode === 'signup'
                ? 'Join our cozy community-focused book lending network.'
                : 'Welcome back to your home library.'}
            </p>
          </div>

          {error && (
            <div role="alert" className="bg-danger/10 border border-danger/20 text-danger rounded-sm p-3 mb-6 text-sm flex gap-2 items-start">
              <Info aria-hidden="true" className="w-5 h-5 flex-shrink-0 stroke-[2.5]" />
              <p className="font-semibold leading-relaxed text-left">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left" noValidate>
            {mode === 'signup' && (
              <>
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
                    {...getFieldProps('user_name')}
                    className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                    required
                  />
                  {fieldErrors.user_name && (
                    <p id="user_name-error" className="mt-1 text-sm text-danger">
                      {fieldErrors.user_name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label htmlFor="pronouns" className="text-sm font-semibold text-text-muted mb-1.5">
                    Pronouns
                  </label>
                  <input
                    id="pronouns"
                    name="pronouns"
                    type="text"
                    placeholder="e.g. she/her"
                    value={form.pronouns}
                    onChange={handleChange}
                    className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                  />
                </div>
              </>
            )}

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
                  autoComplete="email"
                  {...getFieldProps('email')}
                  className="w-full rounded-sm border border-border bg-background/30 pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                  required
                />
                <Mail aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40" />
              </div>
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-danger">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-text-muted mb-1.5">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  {...getFieldProps('password', 'password-help')}
                  className="w-full rounded-sm border border-border bg-background/30 px-3.5 py-2 pr-12 text-sm text-text-primary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p id="password-help" className="sr-only">
                  Passwords must be at least 8 characters long.
                </p>
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex min-w-11 items-center justify-center text-text-muted transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-sm text-danger">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {mode === 'signup' && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="postcode" className="text-sm font-semibold text-text-muted mb-1.5">
                    NZ Postcode *
                  </label>
                  <div className="relative">
                    <input
                      id="postcode"
                      name="postcode"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 1010"
                      value={form.postcode}
                      onChange={handleChange}
                      {...getFieldProps('postcode')}
                      className="w-full rounded-sm border border-border bg-background/30 pl-10 pr-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-180"
                      required
                    />
                    <Compass aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted/40" />
                  </div>
                  {fieldErrors.postcode && (
                    <p id="postcode-error" className="mt-1 text-sm text-danger">
                      {fieldErrors.postcode}
                    </p>
                  )}
                </div>

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
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-11 rounded-sm bg-primary px-6 py-2.5 font-semibold text-white transition duration-180 ease-smooth hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div aria-hidden="true" className="w-4 h-4 border-2 border-white/30 border-t-white rounded-pill animate-spin"></div>
                  <span>{mode === 'signup' ? 'Creating account...' : 'Logging in...'}</span>
                </>
              ) : (
                <>
                  <UserPlus aria-hidden="true" className="w-4 h-4" />
                  <span>{mode === 'signup' ? 'Create Account' : 'Log In'}</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {mode === 'signup' ? 'Already have an account? ' : 'Need an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setError(null)
                setFieldErrors({})
              }}
              className="font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary"
            >
              {mode === 'signup' ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
