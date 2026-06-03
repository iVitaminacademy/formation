import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Dashboard',        icon: '🏠', path: '/parent/dashboard' },
  { label: 'Lessons & Guides', icon: '📚', path: '/parent/lessons' },
  { label: 'Reports',          icon: '📊', path: '/parent/reports' },
  { label: 'Profile',          icon: '👤', path: '/parent/profile' },
]

export default function ParentLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { signOut, profile } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // ignore — navigate home regardless
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0FAF4' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#2D7A4F', boxShadow: '0 2px 12px rgba(45,122,79,0.25)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Frazzl.kid{' '}
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-1 align-middle">
            Parent Mode
          </span>
        </span>

        <div className="flex items-center gap-2 sm:gap-3">
          
          <div
            className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => navigate('/parent/profile')}
            title={profile?.name ?? 'Profile'}
          >
            {profile?.avatar ?? '👩'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold text-white border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ⎋ <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop) */}
        <aside
          className="hidden md:flex w-52 shrink-0 flex-col py-5 px-3 border-r overflow-y-auto"
          style={{ borderColor: '#C8E6D4', backgroundColor: '#E8F7EE' }}
        >
          {navLinks.map(link => {
            const active = pathname === link.path
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold text-left transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: '#2D7A4F', color: '#fff', boxShadow: '0 2px 8px rgba(45,122,79,0.25)' }
                    : { color: '#2D7A4F' }
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#C8E6D4' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 pb-24 md:pb-7">
          {children}
        </main>
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch justify-around border-t"
        style={{ backgroundColor: '#E8F7EE', borderColor: '#C8E6D4' }}
      >
        {navLinks.map(link => {
          const active = pathname === link.path
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold transition-colors"
              style={active ? { color: '#2D7A4F' } : { color: '#6B8E7A' }}
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
