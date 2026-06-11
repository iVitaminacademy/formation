import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PendingScreen() {
  const { signOut, refreshProfile } = useAuth()
  const [checking, setChecking] = useState(false)

  // Auto-check every 10 s — when admin activates the account the user
  // gets through automatically without needing to log out and back in.
  useEffect(() => {
    const id = setInterval(async () => {
      await refreshProfile?.()
    }, 10000)
    return () => clearInterval(id)
  }, [refreshProfile])

  const handleCheck = async () => {
    setChecking(true)
    await refreshProfile?.()
    setChecking(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4" style={{ backgroundColor: '#EFF6FF' }}>
      <div className="rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-xl max-w-md w-full">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-extrabold mb-2" style={{ color: '#1E3A5F' }}>Compte en attente</h1>
        <p className="text-sm mb-6" style={{ color: '#64748B' }}>
          Votre compte est en attente de validation par l'administrateur.<br />
          Vous recevrez l'accès dès qu'un admin aura activé votre compte.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheck}
            disabled={checking}
            className="rounded-xl px-6 py-2.5 text-sm font-bold text-white"
            style={{ backgroundColor: checking ? '#60A5FA' : '#1D4ED8' }}
          >
            {checking ? 'Vérification…' : 'Vérifier l\'accès'}
          </button>
          <button
            onClick={async () => { try { await signOut() } catch {} }}
            className="rounded-xl px-6 py-2.5 text-sm font-semibold border"
            style={{ borderColor: '#CBD5E1', color: '#64748B', backgroundColor: '#F8FAFC' }}
          >
            Se déconnecter
          </button>
        </div>
        <p className="mt-4 text-xs" style={{ color: '#94A3B8' }}>Vérification automatique toutes les 10 secondes</p>
      </div>
    </div>
  )
}

// Guards routes. Optionally restrict by role ('medecin' | 'admin').
export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
        <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>Chargement…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (profile?.role === 'medecin' && profile?.status !== 'active') {
    return <PendingScreen />
  }

  if (role && profile && profile.role !== role) {
    const home = profile.role === 'admin' ? '/admin/dashboard' : '/medecin/dashboard'
    return <Navigate to={home} replace />
  }

  return children
}
