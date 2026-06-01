import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Guards routes. Optionally restrict by role ('kid' | 'parent' | 'admin').
export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
        <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (role && profile && profile.role !== role) {
    // Logged in but wrong role → send to their own dashboard.
    const home = profile.role === 'parent' ? '/parent/dashboard' : '/kid/dashboard'
    return <Navigate to={home} replace />
  }

  return children
}
