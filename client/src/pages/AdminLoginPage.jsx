import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, signUp as signUpAuth } from '../services/auth'

const ADMIN_EMAIL = 'admin@admin.com'
const ADMIN_PASSWORD_HINT = '@dmIn7'

function friendlyError(err) {
  const msg = (err?.message || '').toLowerCase()
  if (msg.includes('invalid login credentials') || msg.includes('invalid email')) {
    return 'Incorrect email or password. Please try again.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Unable to connect. Please check your internet connection and try again.'
  }
  if (msg.includes('too many requests') || msg.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (msg.includes('already registered') || msg.includes('already exists')) {
    return 'This admin account already exists. Please sign in instead.'
  }
  return 'Something went wrong. Please try again.'
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn, signOut } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const email = form.email.trim().toLowerCase()

    try {
      if (email !== ADMIN_EMAIL) {
        setError('Admin access only. Use the dedicated admin credentials.')
        return
      }

      let authResult
      try {
        authResult = await signIn({ email, password: form.password })
      } catch (signInErr) {
        const message = signInErr?.message || ''
        if (!message.toLowerCase().includes('invalid login credentials')) throw signInErr

        authResult = await signUpAuth({
          email,
          password: form.password,
          name: 'System Admin',
          role: 'admin',
        })

        if (!authResult?.session) {
          authResult = await signIn({ email, password: form.password })
        }
      }

      const user = authResult?.user || authResult?.session?.user
      if (!user) {
        throw new Error('Unable to establish an admin session.')
      }

      const profile = await getProfile(user.id)

      if (profile?.role !== 'admin') {
        await signOut()
        setError('Admin access only. This account is not configured as admin.')
        return
      }

      navigate('/admin/dashboard')
    } catch (err) {
      setError(friendlyError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={{ backgroundColor: '#0F172A' }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl" style={{ backgroundColor: '#22C55E' }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#F97316' }} />

      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950 px-8 py-10 shadow-2xl"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
      >
        <div className="mb-8 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
            Admin Only
          </div>
          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
            Admin Console
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Secure access for system administrators
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Admin email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Admin@admin.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder={ADMIN_PASSWORD_HINT}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: '#16A34A', boxShadow: '0 10px 25px rgba(22,163,74,0.25)' }}
          >
            {loading ? 'Authenticating…' : 'Enter Admin Dashboard →'}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
          <div className="font-bold text-white">Access policy</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            <li>Only <span className="font-semibold text-white">admin@admin.com</span> can enter.</li>
            <li>The account must have <span className="font-semibold text-white">role = admin</span> in Supabase.</li>
            <li>Unauthorized users are immediately signed out.</li>
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Not an admin?{' '}
          <Link to="/login" className="font-bold text-emerald-400 hover:underline">
            Back to regular sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
