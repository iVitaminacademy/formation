import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, sendResetLink, changePassword, signOut } from '../services/auth'

const EnvelopeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
  </svg>
)
const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)
const EyeOpenIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)
const EyeClosedIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const ACCENT = '#1E3A5F'
const ACCENT_HOVER = '#162C48'

function friendlyError(err) {
  const msg = (err?.message || String(err || '')).toLowerCase()
  if (msg.includes('too many requests') || msg.includes('rate limit'))
    return 'Too many attempts. Please wait a minute.'
  if (msg.includes('invalid login credentials') || msg.includes('invalid email'))
    return 'Incorrect email or password.'
  if (msg.includes('token has expired') || msg.includes('otp expired'))
    return 'Code expired. Please request a new one.'
  if (msg.includes('token is invalid') || msg.includes('invalid otp'))
    return 'Incorrect code. Please check and try again.'
  if (msg.includes('network') || msg.includes('failed to fetch'))
    return 'Connection error. Check your internet.'
  return 'Something went wrong. Please try again.'
}

const inputBase = {
  borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', boxShadow: 'none',
  transition: 'border-color 0.15s, background-color 0.15s, box-shadow 0.15s',
}
const inputFocus = {
  borderColor: ACCENT, backgroundColor: '#fff', boxShadow: `0 0 0 3px ${ACCENT}22`,
}

function PasswordStrengthBar({ pw }) {
  const score = (() => {
    let s = 0
    if (pw.length >= 6) s++; if (pw.length >= 8) s++; if (pw.length >= 12) s++
    if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++
    return Math.min(s, 5)
  })()
  if (pw.length === 0) return null
  const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#16A34A']
  const widths = ['20%', '40%', '60%', '80%', '100%']
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Great']
  const idx = Math.max(0, Math.min(score - 1, 4))
  return (
    <div className="mt-1.5">
      <div className="h-1.5 rounded-full overflow-hidden bg-gray-200">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: widths[idx], backgroundColor: colors[idx] }} />
      </div>
      <p className="text-xs font-semibold mt-0.5" style={{ color: colors[idx] }}>{labels[idx]}</p>
    </div>
  )
}

// ── Modal: code + password (no redirects) ────────────────────────────────────
function ForgotPasswordModal({ formEmail, onClose }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState(formEmail || '')
  const [code, setCode] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Send code to email
  const handleSendCode = async e => {
    e.preventDefault()
    setError('')
    if (!email.trim()) { setError('Please enter your email.'); return }
    setLoading(true)
    try {
      await sendResetLink(email.trim())
      setMessage('Check your email for a verification code.')
      setStep('code')
    } catch (err) {
      setError(friendlyError(err))
    } finally { setLoading(false) }
  }

  // Verify code
  const handleVerifyCode = async e => {
    e.preventDefault()
    setError('')
    const c = code.trim()
    if (!c) { setError('Please enter the code from your email.'); return }
    setLoading(true)
    try {
      // signInWithOtp + code = verify the magic link token
      const { supabase } = await import('../services/supabaseClient')
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: c,
        type: 'email',
      })
      if (verifyError) {
        // Try with token_hash as fallback
        const { error: e2 } = await supabase.auth.verifyOtp({
          email: email.trim(),
          token_hash: c,
          type: 'email',
        })
        if (e2) throw verifyError
      }
      setMessage('')
      setStep('password')
    } catch (err) {
      setError(friendlyError(err))
    } finally { setLoading(false) }
  }

  // Set new password
  const handleSetPassword = async e => {
    e.preventDefault()
    setError('')
    if (newPw.length < 8) { setError('Min 8 characters.'); return }
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      await changePassword(newPw)
      try { await signOut() } catch {}
      setStep('done')
    } catch (err) {
      setError(friendlyError(err))
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    setError('')
    setLoading(true)
    try {
      await sendResetLink(email.trim())
      setMessage('New code sent.')
    } catch (err) {
      setError(friendlyError(err))
    } finally { setLoading(false) }
  }

  const btnStyle = d => ({
    width: '100%', padding: '13px 0',
    backgroundColor: d ? '#D1C4E9' : ACCENT, color: '#fff',
    border: 'none', borderRadius: 12, fontWeight: 800, fontSize: '.9rem',
    cursor: d ? 'not-allowed' : 'pointer',
    boxShadow: d ? 'none' : `0 4px 14px ${ACCENT}44`,
  })

  const inp = { ...inputBase, width: '100%', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 12, padding: '11px 16px', fontSize: 14, color: '#1E293B', outline: 'none' }

  const lbl = { display: 'block', marginBottom: 6, fontSize: '.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(26,26,46,0.45)' }}
      onClick={!loading ? onClose : undefined}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-sm rounded-3xl bg-white px-7 py-7"
        style={{ boxShadow: '0 20px 60px rgba(94,23,235,0.18)' }}>

        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-extrabold" style={{ color: '#1A1A2E' }}>
            {step === 'done' ? '✅ All set!' : 'Réinitialiser le mot de passe'}
          </h3>
          <button onClick={loading ? undefined : onClose}
            style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: loading ? 'default' : 'pointer', fontSize: 20 }}>×</button>
        </div>

        {error && <div className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{error}</div>}
        {message && <div className="mb-4 rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' }}>{message}</div>}

        {/* Email */}
        {step === 'email' && (
          <form onSubmit={handleSendCode}>
            <p className="mb-5 text-sm" style={{ color: '#94A3B8' }}>Réinitialiser le mot de passe ,veuilllez contacter  l'administrateur.</p>
           {/*  <label style={lbl}>Email</label>
           <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus style={inp} />
            <div style={{ marginTop: 20 }}><button type="submit" disabled={loading} style={btnStyle(loading)}>{loading ? 'Sending…' : 'Send code'}</button></div>
        */}  </form>
        )}

        {/* Code */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode}>
            <p className="mb-2 text-sm" style={{ color: '#94A3B8' }}>Enter the code sent to <strong>{email}</strong>.</p>
            <label style={lbl}>Verification code</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="00000000" maxLength={8} autoFocus
              style={{ ...inp, textAlign: 'center', fontSize: 22, fontWeight: 800, letterSpacing: '0.15em' }} />
            <div style={{ marginTop: 20 }}><button type="submit" disabled={loading || !code.trim()} style={btnStyle(loading || !code.trim())}>{loading ? 'Verifying…' : 'Verify code'}</button></div>
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <button type="button" onClick={handleResend} disabled={loading} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 700, fontSize: '.8rem', cursor: loading ? 'default' : 'pointer' }}>Resend code</button>
              <span style={{ margin: '0 6px', color: '#D1D5DB' }}>·</span>
              <button type="button" onClick={() => { setStep('email'); setCode(''); setMessage(''); setError('') }} disabled={loading} style={{ background: 'none', border: 'none', color: '#94A3B8', fontWeight: 700, fontSize: '.8rem', cursor: loading ? 'default' : 'pointer' }}>Change email</button>
            </div>
          </form>
        )}

        {/* New password */}
        {step === 'password' && (
          <form onSubmit={handleSetPassword}>
            <p className="mb-5 text-sm" style={{ color: '#94A3B8' }}>Choose a new password for <strong>{email}</strong>.</p>
            <div className="mb-4">
              <label style={lbl}>New password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" autoFocus style={{ ...inp, paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
                  {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              </div>
              <PasswordStrengthBar pw={newPw} />
            </div>
            <div className="mb-1">
              <label style={lbl}>Confirm</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Retype password"
                style={{ ...inp, borderColor: confirmPw && newPw !== confirmPw ? '#EF4444' : '#E2E8F0' }} />
              {confirmPw && newPw !== confirmPw && <p style={{ color: '#EF4444', fontSize: '.75rem', fontWeight: 700, marginTop: 4 }}>Passwords don't match</p>}
            </div>
            <div style={{ marginTop: 20 }}>
              <button type="submit" disabled={loading || newPw.length < 8 || newPw !== confirmPw} style={btnStyle(loading || newPw.length < 8 || newPw !== confirmPw)}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </form>
        )}

        {/* Done */}
        {step === 'done' && (
          <div className="text-center">
            <p className="mb-6 text-sm" style={{ color: '#64748B', lineHeight: 1.6 }}>Password updated! Sign in with your new password.</p>
            <button onClick={onClose} style={btnStyle(false)}>Sign in</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ══ PAGE ═════════════════════════════════════════════════════════════════════
export default function SignInPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [showPass, setShowPass] = useState(false)
  const [focused, setFocused] = useState('')
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showReset, setShowReset] = useState(false)

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
      navigate(profile.role === 'admin' ? '/admin/dashboard' : '/medecin/dashboard')
    } catch (err) {
      setError(friendlyError(err))
    } finally { setSubmitting(false) }
  }

  const fieldStyle = name => ({ ...inputBase, ...(focused === name ? inputFocus : {}) })

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 25%, #EFF6FF 50%, #F8FAFC 75%, #FFFFFF 100%)' }}>
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#1E3A5F' }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#1D4ED8' }} />

      <div className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10" style={{ boxShadow: '0 20px 60px rgba(30,58,95,0.12)' }}>
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#1E3A5F' }}>💉</div>
            <div className="leading-tight text-left">
              <div className="text-xl font-extrabold tracking-tight" style={{ color: '#1E3A5F' }}>iVitaminacademy</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Guide pratique pour professionnels de santé</div>
            </div>
          </div>
          <h1 className="mt-5 text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>Bienvenue 👋</h1>
          <p className="mt-1.5 text-sm" style={{ color: '#94A3B8' }}>Connexion à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>{error}</div>}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}><EnvelopeIcon /></span>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                onFocus={() => setFocused('email')} onBlur={() => setFocused('')} placeholder="you@example.com"
                style={{ ...fieldStyle('email'), width: '100%', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 12, padding: '11px 16px 11px 40px', fontSize: 14, color: '#1E293B', outline: 'none' }} />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#64748B' }}>Password</label>
              <button type="button" onClick={() => setShowReset(true)} className="text-xs font-semibold hover:underline" style={{ color: ACCENT, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Mot de passe oublié ?</button>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }}><LockIcon /></span>
              <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                onFocus={() => setFocused('password')} onBlur={() => setFocused('')} placeholder="••••••••"
                style={{ ...fieldStyle('password'), width: '100%', borderWidth: 1.5, borderStyle: 'solid', borderRadius: 12, padding: '11px 44px 11px 40px', fontSize: 14, color: '#1E293B', outline: 'none' }} />
              <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm" style={{ color: '#64748B' }}>
            <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} style={{ accentColor: ACCENT, width: 16, height: 16, cursor: 'pointer' }} />
            Remember me
          </label>
          <button type="submit" disabled={submitting} className="mt-1 w-full rounded-xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: ACCENT, boxShadow: '0 4px 20px rgba(94,23,235,0.35)' }}>
            {submitting ? 'Connexion…' : 'Se connecter →'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm" style={{ color: '#94A3B8' }}>
          Pas encore de compte ? <Link to="/signup" className="font-bold" style={{ color: ACCENT }}>S'inscrire →</Link>
        </p>
        <div className="mt-5 flex items-center justify-center gap-4 rounded-2xl px-4 py-3" style={{ backgroundColor: '#EFF6FF' }}>
          <span className="text-xs font-medium" style={{ color: '#6B7280' }}>Connexion :</span>
          <span className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#1E3A5F' }}><span>👨‍⚕️</span> Professionnels de santé </span>
        </div>
      </div>

      {showReset && <ForgotPasswordModal formEmail={form.email} onClose={() => setShowReset(false)} />}
    </div>
  )
}
