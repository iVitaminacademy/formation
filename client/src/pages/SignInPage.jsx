import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile } from '../services/auth'

const EnvelopeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
)

const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const ACCENT = '#5E17EB'
const ACCENT_HOVER = '#4C0FC4'

function friendlyError(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('invalid login credentials') || msg.includes('invalid email')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Unable to connect. Please check your internet connection and try again.'
  }
  if (msg.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.'
  }
  if (msg.includes('too many requests') || msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  return 'Something went wrong. Please try again.'
}

const inputBase = {
  borderColor: '#E2E8F0',
  backgroundColor: '#F8FAFC',
  boxShadow: 'none',
  transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
}
const inputFocus = {
  borderColor: ACCENT,
  backgroundColor: '#fff',
  boxShadow: `0 0 0 3px ${ACCENT}22`,
}

export default function SignInPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState('')
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { user } = await signIn({ email: form.email, password: form.password })
      const profile = await getProfile(user.id)
      navigate(profile.role === 'parent' ? '/parent/dashboard' : '/kid/dashboard')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  

  const fieldStyle = name => ({ ...inputBase, ...(focused === name ? inputFocus : {}) })

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #F5F0FF 0%, #EDE4FF 25%, #F3E8FF 50%, #F8F4FF 75%, #FDFBFF 100%)' }}
    >
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#743290' }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#5E17EB' }} />
      <div className="pointer-events-none absolute right-16 top-1/3 h-56 w-56 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#743290' }} />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10"
        style={{ boxShadow: '0 20px 60px rgba(94,23,235,0.10)' }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <img
              src="/favicon.svg"
              alt="Frazzl.kid logo"
              className="h-10 w-10 rounded-xl shadow-sm"
            />
            <div className="text-3xl font-extrabold tracking-tight">
              <span style={{ color: '#743290' }}>Frazzl</span>
              <span style={{ color: '#5E17EB' }}>.kid</span>
            </div>
          </div>
          <h1 className="mt-5 text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>
            Welcome back! 👋
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#94A3B8' }}>
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                <EnvelopeIcon />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                placeholder="you@example.com"
                style={{
                  ...fieldStyle('email'),
                  width: '100%',
                  borderWidth: 1.5,
                  borderStyle: 'solid',
                  borderRadius: 12,
                  padding: '11px 16px 11px 40px',
                  fontSize: 14,
                  color: '#1E293B',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
                Password
              </label>
              <a href="#" className="text-xs font-semibold transition hover:underline" style={{ color: ACCENT }}>
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}>
                <LockIcon />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="••••••••"
                style={{
                  ...fieldStyle('password'),
                  width: '100%',
                  borderWidth: 1.5,
                  borderStyle: 'solid',
                  borderRadius: 12,
                  padding: '11px 44px 11px 40px',
                  fontSize: 14,
                  color: '#1E293B',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition"
                style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex cursor-pointer items-center gap-2.5 text-sm" style={{ color: '#64748B' }}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              style={{ accentColor: ACCENT, width: 16, height: 16, borderRadius: 4, cursor: 'pointer' }}
            />
            Remember me for 30 days
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: ACCENT, boxShadow: '0 4px 20px rgba(94,23,235,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
          >
            {submitting ? 'Signing in…' : 'Sign In →'}
          </button>

          
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-sm" style={{ color: '#94A3B8' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-bold transition hover:underline"
            style={{ color: ACCENT }}
          >
            Create one →
          </Link>
        </p>

        {/* Mode hint */}
        <div
          className="mt-5 flex items-center justify-center gap-4 rounded-2xl px-4 py-3"
          style={{ backgroundColor: '#F0FDF4' }}
        >
          <span className="text-xs font-medium" style={{ color: '#6B7280' }}>Sign in as:</span>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#F97316' }}>
            <span>🧒</span> Kid
          </span>
          <span style={{ color: '#D1D5DB', fontSize: 10 }}>•</span>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#16A34A' }}>
            <span>👨‍👧</span> Parent
          </span>
        </div>
      </div>
    </div>
  )
}
