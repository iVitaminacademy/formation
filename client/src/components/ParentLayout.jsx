import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Tableau de bord', icon: '🏠', path: '/parent/dashboard' },
  { label: 'Protocoles',      icon: '💉', path: '/parent/lessons'   },
  { label: 'Rapports',        icon: '📊', path: '/parent/reports'   },
  { label: 'Profil',          icon: '👤', path: '/parent/profile'   },
]

export default function ParentLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { signOut, profile } = useAuth()

  const handleLogout = async () => {
    try { await signOut() } catch { /* ignore */ }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F8' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#0F2847', boxShadow: '0 2px 12px rgba(15,40,71,0.40)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Ivitaminacademy{' '}
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-1 align-middle">
            Superviseur
          </span>
        </span>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            onClick={() => navigate('/parent/profile')}
            title={profile?.name ?? 'Profil'}
          >
            {profile?.avatar ?? '🩺'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-white border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.30)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ⎋ <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop) */}
        <aside
          className="hidden md:flex w-52 shrink-0 flex-col py-5 px-3 border-r overflow-y-auto"
          style={{ borderColor: '#CBD5E1', backgroundColor: '#E2EAF4' }}
        >
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>
            Navigation
          </p>
          {navLinks.map(link => {
            const active = pathname === link.path
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold text-left transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: '#0F2847', color: '#fff', boxShadow: '0 2px 8px rgba(15,40,71,0.30)' }
                    : { color: '#334155' }
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#BFDBFE' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            )
          })}

          {/* Medical disclaimer */}
          <div className="mt-auto mx-2 p-2.5 rounded-xl text-[10px] leading-4 font-medium" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            ⚠️ Guide pratique basé sur l'usage courant. Posologies à adapter au patient.
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 pb-24 md:pb-7">
          {children}
        </main>
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch justify-around border-t"
        style={{ backgroundColor: '#E2EAF4', borderColor: '#CBD5E1' }}
      >
        {navLinks.map(link => {
          const active = pathname === link.path
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold transition-colors"
              style={active ? { color: '#0F2847' } : { color: '#64748B' }}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span>{link.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
