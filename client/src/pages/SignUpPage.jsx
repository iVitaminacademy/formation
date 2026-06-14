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
    id: 'medecin',
    emoji: '👨‍⚕️',
    label: 'Professionnels de santé ',
    sub: 'Formation aux protocoles IV',
    accent: '#1E3A5F',
    accentHover: '#162C48',
    bg: '#EFF6FF',
    bgSelected: '#DBEAFE',
    border: '#93C5FD',
    shadow: 'rgba(30,58,95,0.18)',
  },
]

const STRENGTH_LABELS = ['', 'Faible', 'Moyen', 'Fort']
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
  const [role, setRole] = useState('medecin')
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
    if (!form.email.trim()) {
      setError('Veuillez saisir votre adresse email.')
      return
    }
    if (!form.terms) {
      setError('Veuillez accepter les conditions d\'utilisation et la politique de confidentialité.')
      return
    }
    setSubmitting(true)
    try {
      const { session } = await signUp({
        email: form.email.trim(),
        password: form.password,
        name: form.name,
        role,
        grade: role === 'medecin' ? Number(form.grade) : null,
      })
      if (!session) {
        setInfo('Compte créé ! Vérifiez votre email pour confirmer votre inscription, puis connectez-vous.')
        return
      }
      navigate('/medecin/dashboard')
    } catch (err) {
      const status = err?.status ?? err?.code
      const m = (err?.message || '').toLowerCase()
      if (status === 429 || m.includes('too many requests') || m.includes('rate limit') || m.includes('over_email_send_rate_limit')) {
        setError('Trop de tentatives. Veuillez patienter une minute avant de réessayer.')
      } else if (m.includes('already registered') || m.includes('already exists') || m.includes('user already')) {
        setError('Un compte avec cet email existe déjà. Essayez de vous connecter.')
      } else {
        setError(err.message || 'Inscription échouée. Veuillez réessayer.')
      }
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
      style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 25%, #EFF6FF 50%, #F8FAFC 100%)' }}
    >
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-15 blur-3xl"
        style={{ backgroundColor: '#1E3A5F' }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{ backgroundColor: '#1D4ED8' }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10"
        style={{ boxShadow: '0 20px 60px rgba(30,58,95,0.12)' }}
      >
        {/* Logo */}
          <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: '#1E3A5F' }}>💉</div>
              <div className="leading-tight text-left">
                <div className="text-xl font-extrabold tracking-tight" style={{ color: '#1E3A5F' }}>iVitaminacademy</div>
                <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>Guide pratique pour professionnels de santé </div>
              </div>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold" style={{ color: '#1A1A2E' }}>
              Créer votre compte
            </h1>
            <p className="mt-1.5 text-sm" style={{ color: '#94A3B8' }}>
              Commencez votre formation IV 💉
            </p>
          </div>

        {/* Role selector — Médecin uniquement */}
        <div className="mb-5 grid grid-cols-1 gap-3">
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
            <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FED7AA' }}>
              {info}
            </div>
          )}

          {/* Full name */}
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide"
              style={{ color: '#64748B' }}
            >
              Nom complet
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
                placeholder="Votre nom complet"
                style={{ ...fieldStyle('name'), padding: '11px 16px 11px 40px' }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide"
              style={{ color: '#64748B' }}
            >
              Email
            </label>
            <div className="relative">
              <span
                className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: '#94A3B8' }}
              >
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
                autoComplete="email"
                style={{ ...fieldStyle('email'), padding: '11px 16px 11px 40px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide"
              style={{ color: '#64748B' }}
            >
              Mot de passe
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
                placeholder="Min. 8 caractères"
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
              J'accepte les{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold hover:underline" style={{ color: accent }}>
                Conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="font-semibold hover:underline" style={{ color: accent }}>
                Politique de confidentialité
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
            {submitting ? 'Création du compte…' : '👨‍⚕️ Commencer ma formation →'}
          </button>

      

          
        </form>

        {/* Footer link */}
        <p className="mt-7 text-center text-sm" style={{ color: '#94A3B8' }}>
          Déjà inscrit ?{' '}
          <Link
            to="/login"
            className="font-bold transition hover:underline"
            style={{ color: accent }}
          >
            Se connecter →
          </Link>
        </p>
      </div>
    </div>
  )
}
