import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const ROLES = [
  {
    id: 'kid',
    emoji: '🧒',
    label: "I'm a Kid",
    sub: 'Grade 4 & 5 · Learn at your own pace',
    accent: '#F97316',
    accentHover: '#EA580C',
    bg: '#FFF7ED',
    bgSelected: '#FFEDD5',
    border: '#FB923C',
    shadow: 'rgba(249,115,22,0.18)',
  },
  {
    id: 'parent',
    emoji: '👨‍👧',
    label: "I'm a Parent",
    sub: "Track your child's progress",
    accent: '#16A34A',
    accentHover: '#15803D',
    bg: '#F0FDF4',
    bgSelected: '#DCFCE7',
    border: '#86EFAC',
    shadow: 'rgba(22,163,74,0.18)',
  },
]

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong']
const STRENGTH_COLORS = ['', '#EF4444', '#F59E0B', '#16A34A']

function getStrength(password) {
  if (!password) return 0
  if (password.length < 6) return 1
  if (password.length < 10) return 2
  return 3
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [role, setRole] = useState('kid')
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', grade: 4, terms: false })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const selectedRole = ROLES.find(r => r.id === role)
  const { accent, accentHover, shadow } = selectedRole

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setInfo('')
    if (!form.terms) {
      setError('Please accept the Terms of Service and Privacy Policy.')
      return
    }
    setSubmitting(true)
    try {
      // If the email field was removed from the form, generate a fallback
      // email so signUp() still receives a valid address. This avoids
      // breaking submissions when the UI doesn't collect an email.
      const sanitized = (form.name || 'user')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '.')
        .replace(/[^a-z0-9.]/g, '') || 'user'
      const emailToUse = form.email || `${sanitized}+${Date.now()}@frazzl.kid`

      const { session } = await signUp({
        email: emailToUse,
        password: form.password,
        name: form.name,
        role,
        grade: role === 'kid' ? Number(form.grade) : null,
      })
      // If email confirmation is required, there is no session yet.
      if (!session) {
        setInfo('Account created! Please check your email to confirm, then sign in.')
        return
      }
      navigate(role === 'kid' ? '/kid/dashboard' : '/parent/dashboard')
    } catch (err) {
      setError(err.message || 'Sign up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const strength = getStrength(form.password)

  const fieldStyle = name => ({
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderRadius: 12,
    fontSize: 14,
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
    ...(focused === name
      ? { borderColor: accent, backgroundColor: '#fff', boxShadow: `0 0 0 3px ${accent}22` }
      : { borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', boxShadow: 'none' }),
  })

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: '#F0FDF4' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{ backgroundColor: '#86EFAC' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{ backgroundColor: '#FB923C' }}
      />
      <div
        className="pointer-events-none absolute left-16 top-1/3 h-52 w-52 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: '#EC4899' }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10"
        style={{ boxShadow: '0 20px 60px rgba(22,163,74,0.12)' }}
      >
        {/* Logo */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/favicon.svg"
                alt="Frazzl.kid logo"
                className="h-10 w-10 rounded-xl shadow-sm"
              />
              <div className="text-3xl font-extrabold tracking-tight">
                <span style={{ color: '#111827' }}>Frazzl</span>
                <span style={{ color: '#16A34A' }}>.kid</span>
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>
              Create your account
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: '#94A3B8' }}>
              Join thousands of learners today ✨
            </p>
          </div>

        {/* Role selector */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          {ROLES.map(r => {
            const isSelected = role === r.id
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className="flex flex-col items-center rounded-2xl px-3 py-4 text-center transition-all duration-200"
                style={{
                  border: `2px solid ${isSelected ? r.border : '#E2E8F0'}`,
                  backgroundColor: isSelected ? r.bgSelected : '#FAFAFA',
                  cursor: 'pointer',
                  transform: isSelected ? 'translateY(-1px)' : 'none',
                  boxShadow: isSelected ? `0 4px 16px ${r.shadow}` : 'none',
                }}
              >
                <span style={{ fontSize: 30, lineHeight: 1, marginBottom: 6 }}>{r.emoji}</span>
                <span
                  className="text-sm font-extrabold"
                  style={{ color: isSelected ? r.accent : '#64748B' }}
                >
                  {r.label}
                </span>
                <span
                  className="mt-1 text-[11px] leading-tight"
                  style={{ color: isSelected ? r.accent + 'BB' : '#94A3B8' }}
                >
                  {r.sub}
                </span>
              </button>
            )
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' }}>
              {info}
            </div>
          )}

          {/* Grade (kids only) */}
          {role === 'kid' && (
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
                Grade
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[4, 5].map(g => {
                  const isSel = Number(form.grade) === g
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, grade: g }))}
                      className="rounded-xl py-3 text-sm font-extrabold transition-all"
                      style={{
                        border: `2px solid ${isSel ? accent : '#E2E8F0'}`,
                        backgroundColor: isSel ? accent + '15' : '#FAFAFA',
                        color: isSel ? accent : '#64748B',
                        cursor: 'pointer',
                      }}
                    >
                      Grade {g}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Full name */}
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide"
              style={{ color: '#64748B' }}
            >
              Full Name
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
                <UserIcon />
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused('')}
                placeholder="Your full name"
                style={{ ...fieldStyle('name'), padding: '11px 16px 11px 40px' }}
              />
            </div>
          </div>

          

          {/* Password */}
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide"
              style={{ color: '#64748B' }}
            >
              Password
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
                <LockIcon />
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                placeholder="Min. 8 characters"
                style={{ ...fieldStyle('password'), padding: '11px 44px 11px 40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#64748B')}
                onMouseLeave={e => (e.currentTarget.style.color = '#94A3B8')}
              >
                {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>

            {/* Password strength bar */}
            {form.password.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex flex-1 gap-1.5">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: i <= strength ? STRENGTH_COLORS[strength] : '#E2E8F0' }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: STRENGTH_COLORS[strength], minWidth: 40 }}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Terms */}
          <label
            className="flex cursor-pointer items-start gap-2.5 text-sm leading-5"
            style={{ color: '#64748B' }}
          >
            <input
              type="checkbox"
              name="terms"
              checked={form.terms}
              onChange={handleChange}
              style={{ accentColor: accent, width: 16, height: 16, marginTop: 2, borderRadius: 4, cursor: 'pointer', flexShrink: 0 }}
            />
            <span>
              I agree to the{' '}
              <a href="#" className="font-semibold hover:underline" style={{ color: accent }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold hover:underline" style={{ color: accent }}>
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              backgroundColor: accent,
              boxShadow: `0 4px 16px ${shadow}`,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = accentHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = accent)}
          >
            {submitting ? 'Creating account…' : role === 'kid' ? '🧒 Start Learning →' : '👨‍👧 Join as Parent →'}
          </button>

      

          
        </form>

        {/* Footer link */}
        <p className="mt-7 text-center text-sm" style={{ color: '#94A3B8' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold transition hover:underline"
            style={{ color: accent }}
          >
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  )
}
