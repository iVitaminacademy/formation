import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'
import { changePassword } from '../services/auth'

// ── helper ───────────────────────────────────────────────────────────────────
function passwordScore(pw) {
  let score = 0
  if (pw.length >= 8) score += 1
  if (pw.length >= 12) score += 1
  if (/[A-Z]/.test(pw))    score += 1
  if (/[a-z]/.test(pw))    score += 1
  if (/[0-9]/.test(pw))    score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 5)
}

function StrengthBar({ pw }) {
  const s = passwordScore(pw)
  const labels   = ['Weak', 'Fair', 'Good', 'Strong', 'Great']
  const colors   = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#16A34A']
  const widths   = ['20%', '40%', '60%', '80%', '100%']
  const idx      = Math.max(0, Math.min(s - 1, colors.length - 1))
  return (
    <div className="mt-1">
      <div className="h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: widths[idx] || '0%', backgroundColor: s > 0 ? colors[idx] : '#E5E7EB' }}
        />
      </div>
      {s > 0 && <p className="text-xs font-semibold mt-0.5" style={{ color: colors[idx] }}>{labels[idx]}</p>}
    </div>
  )
}

// ══ Page ═════════════════════════════════════════════════════════════════════
export default function ResetPasswordPage() {
  const navigate   = useNavigate()

  const [phase,    setPhase]     = useState('checking') // checking | ready | success | error
  const [statusMsg, setStatusMsg] = useState('Checking your reset link…')
  const [errorHint, setErrorHint] = useState('')

  const [pw,       setPw]        = useState('')
  const [pw2,      setPw2]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [localErr, setLocalErr]   = useState('')

  // ── Phase 1: establish the recovery session ──
  useEffect(() => {
    let mounted = true

    async function tryRecover() {
      // Supabase puts the recovery tokens in the URL hash (#). Before
      // `getSession()` can resolve the recovery, we must have the hash
      // accessible — this is automatic on normal page load but on SPA
      // navigation we need to ensure supabase processes it.
      try {
        // If there's no hash at all, the link may have been stripped.
        // Give a helpful message.
        if (!window.location.hash || !window.location.hash.includes('access_token')) {
          if (mounted) {
            setPhase('error')
            setStatusMsg('Invalid or expired reset link.')
            setErrorHint(
              'The password reset link appears to be missing a security token. ' +
              'This can happen if the link was copied incorrectly. ' +
              'Please request a new reset link from the sign-in page.'
            )
          }
          return
        }

        const { data, error } = await supabase.auth.getSession()
        if (error || !data?.session) {
          if (mounted) {
            setPhase('error')
            setStatusMsg('Reset link expired or invalid.')
            setErrorHint(
              'This link may have already been used or has expired. ' +
              'Please request a new one from the sign-in page.'
            )
          }
          return
        }

        if (mounted) {
          setPhase('ready')
          setStatusMsg('')
        }
      } catch (err) {
        console.error('[ResetPassword]', err)
        if (mounted) {
          setPhase('error')
          setStatusMsg('Something went wrong while verifying your reset link.')
          setErrorHint('Please try requesting a new reset link from the sign-in page.')
        }
      }
    }

    // Small delay so Supabase auth state resolves from the hash
    const t = setTimeout(() => tryRecover(), 600)
    return () => {
      mounted = false
      clearTimeout(t)
    }
  }, [])

  // ── Phase 2: submit new password ──
  async function handleSubmit(e) {
    e.preventDefault()
    setLocalErr('')

    if (pw !== pw2) {
      setLocalErr('Passwords do not match.')
      return
    }
    if (pw.length < 8) {
      setLocalErr('Password must be at least 8 characters.')
      return
    }

    setSubmitting(true)
    try {
      await changePassword(pw)
      setPhase('success')
      setStatusMsg('')
    } catch (err) {
      console.error('[ResetPassword] change error', err)
      setLocalErr(err.message || 'Could not update password. The link may have expired.')
      setPhase('error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: '1rem',
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: '2rem',
    border: '2px solid #F3F4F6',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  }

  const linkStyle = {
    color: '#F97316',
    fontWeight: 700,
    textDecoration: 'underline',
  }

  // ── Checking / Loading ──
  if (phase === 'checking') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🔐</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
              Reset Password
            </h2>
            <p style={{ marginTop: 12, color: '#6B7280', fontSize: '.9rem', fontWeight:600 }}>
              {statusMsg}
            </p>
          </div>
          {/* Spinner */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: '3px solid #E5E7EB',
                borderTopColor: '#F97316',
                borderRadius: '50%',
                animation: 'spin .6s linear infinite',
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // ── Error ──
  if (phase === 'error') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>⏱️</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991B1B' }}>
              Reset Link Expired
            </h2>
            <p style={{ marginTop: 12, color: '#374151', fontSize: '.9rem', fontWeight: 600 }}>
              {statusMsg}
            </p>
            {errorHint && (
              <p style={{ marginTop: 8, color: '#6B7280', fontSize: '.85rem', lineHeight: 1.5 }}>
                {errorHint}
              </p>
            )}
            {localErr && (
              <p style={{ marginTop: 8, color: '#DC2626', fontSize: '.85rem', fontWeight: 600 }}>
                {localErr}
              </p>
            )}
          </div>

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              to="/login"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px 0',
                backgroundColor: '#F97316',
                color: '#fff',
                borderRadius: 12,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              Back to Sign In
            </Link>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                background: 'transparent',
                border: '2px solid #E5E7EB',
                borderRadius: 12,
                padding: '10px 0',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#6B7280',
              }}
            >
              Try reloading page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──
  if (phase === 'success') {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '.5rem' }}>✅</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#EA580C' }}>
              Password Updated!
            </h2>
            <p style={{ marginTop: 12, color: '#374151', fontSize: '.9rem', fontWeight: 600 }}>
              You can now sign in with your new password.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              display: 'block',
              marginTop: 28,
              textAlign: 'center',
              padding: '12px 0',
              backgroundColor: '#F97316',
              color: '#fff',
              borderRadius: 12,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>

          {/* Success tip banner — orange now, previously green */}
          <div
            style={{
              marginTop: 20,
              padding: '1rem',
              borderRadius: 12,
              border: '2px solid #FB923C',
              backgroundColor: '#FFF7ED',
            }}
          >
            <p style={{ fontSize: '.85rem', fontWeight: 700, color: '#9A3412' }}>
              💡 Tip: For security, you'll be signed out of all other devices.
              Sign in to continue learning!
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Ready (password form) ──
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
            Set New Password
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="pw"
              style={{
                display: 'block',
                fontSize: '.8rem',
                fontWeight: 800,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}
            >
              New password
            </label>
            <input
              id="pw"
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="At least 8 characters"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: 12,
                fontSize: '.95rem',
                fontWeight: 600,
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = '#F97316')}
              onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
            />
            <StrengthBar pw={pw} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label
              htmlFor="pw2"
              style={{
                display: 'block',
                fontSize: '.8rem',
                fontWeight: 800,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}
            >
              Confirm password
            </label>
            <input
              id="pw2"
              type="password"
              value={pw2}
              onChange={e => setPw2(e.target.value)}
              placeholder="Retype your new password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${pw2 && pw !== pw2 ? '#EF4444' : '#E5E7EB'}`,
                borderRadius: 12,
                fontSize: '.95rem',
                fontWeight: 600,
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = pw2 && pw !== pw2 ? '#EF4444' : '#F97316')}
              onBlur={e => (e.target.style.borderColor = pw2 && pw !== pw2 ? '#EF4444' : '#E5E7EB')}
            />
            {pw2 && pw !== pw2 && (
              <p style={{ color: '#EF4444', fontSize: '.8rem', fontWeight: 600, marginTop: 4 }}>
                Passwords don't match
              </p>
            )}
          </div>

          {localErr && (
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '2px solid #FECACA',
                borderRadius: 12,
                padding: '.75rem 1rem',
                marginBottom: 16,
              }}
            >
              <p style={{ color: '#B91C1C', fontSize: '.85rem', fontWeight: 700 }}>{localErr}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              marginTop: 8,
              padding: '14px 0',
              backgroundColor: submitting ? '#FDBA74' : '#F97316',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(249,115,22,0.35)',
              transition: 'background-color 0.15s',
            }}
          >
            {submitting ? 'Updating password…' : 'Update password'}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: '.85rem', color: '#6B7280' }}>
          Remember your password?{' '}
          <Link to="/login" style={linkStyle}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
