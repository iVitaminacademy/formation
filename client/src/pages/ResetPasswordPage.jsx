import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { changePassword } from '../services/auth'

const ACCENT = '#5E17EB'
const ACCENT_HOVER = '#4C0FC4'

const inputBase = {
  borderColor: '#E2E8F0',
  backgroundColor: '#F8FAFC',
  width: '100%',
  borderWidth: 1.5,
  borderStyle: 'solid',
  borderRadius: 12,
  padding: '11px 16px',
  fontSize: 14,
  color: '#1E293B',
  outline: 'none',
}

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [ready, setReady]       = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  // Supabase parses the recovery token from the URL and emits PASSWORD_RECOVERY.
  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session) setHasSession(true)
      setReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'PASSWORD_RECOVERY' || session) {
        setHasSession(true)
        setReady(true)
      }
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await changePassword(password)
      setDone(true)
      await supabase.auth.signOut()
    } catch (err) {
      setError(err?.message || 'Could not update your password. The reset link may have expired.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #F5F0FF 0%, #EDE4FF 25%, #F3E8FF 50%, #F8F4FF 75%, #FDFBFF 100%)' }}
    >
      <div className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10" style={{ boxShadow: '0 20px 60px rgba(94,23,235,0.10)' }}>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <img src="/favicon.svg" alt="Frazzl.kid logo" className="h-10 w-10 rounded-xl shadow-sm" />
            <div className="text-3xl font-extrabold tracking-tight">
              <span style={{ color: '#743290' }}>Frazzl</span>
              <span style={{ color: '#5E17EB' }}>.kid</span>
            </div>
          </div>
          <h1 className="mt-5 text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>Set a new password</h1>
          <p className="mt-1.5 text-sm" style={{ color: '#94A3B8' }}>Choose a new password for your account</p>
        </div>

        {done ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
              Your password has been updated. You can now sign in with your new password.
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: ACCENT }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
            >
              Go to sign in →
            </button>
          </div>
        ) : !ready ? (
          <p className="text-center text-sm" style={{ color: '#94A3B8' }}>Verifying your reset link…</p>
        ) : !hasSession ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              This password reset link is invalid or has expired. Please request a new one from the sign-in page.
            </div>
            <Link
              to="/login"
              className="w-full rounded-xl py-3.5 text-center text-sm font-extrabold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: ACCENT }}
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
                New password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={inputBase}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>
                Confirm new password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={inputBase}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-1 w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60"
              style={{ backgroundColor: ACCENT, boxShadow: '0 4px 20px rgba(94,23,235,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = ACCENT_HOVER)}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
            >
              {saving ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
