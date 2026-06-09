import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Dashboard',   icon: '🏠', path: '/kid/dashboard', activePath: '/kid/dashboard' },
  { label: 'Lessons',     icon: '📚', path: '/kid/lessons',   activePath: '/kid/lessons'   },
  { label: 'Quiz',        icon: '✏️', path: '/kid/lessons',   activePath: '/kid/quiz'      },
  { label: 'My Progress', icon: '📊', path: '/kid/progress',  activePath: '/kid/progress'  },
  { label: 'Profile',     icon: '👤', path: '/kid/profile',   activePath: '/kid/profile'   },
]

export default function KidLayout({ children }) {
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()
  const { pathname } = useLocation()
  const avatar = profile?.avatar ?? '🧒'
  const streak = profile?.streak_days ?? 0

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // ignore
    }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFF7ED' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#F97316', boxShadow: '0 2px 12px rgba(249,115,22,0.30)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Frazzl<span style={{ color: '#FED7AA' }}>.kid</span>
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-2 align-middle">
            Kid Mode
          </span>
        </span>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#FDE68A' }}
          >
            🔥 {streak}<span className="hidden sm:inline">-day streak</span>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            onClick={() => navigate('/kid/profile')}
          >
            {avatar}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-white border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ⎋ <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar (desktop) */}
        <aside
          className="hidden md:flex w-48 shrink-0 flex-col py-5 px-3 border-r overflow-y-auto"
          style={{ borderColor: '#FB923C', backgroundColor: '#FFF7ED' }}
        >
          {navLinks.map(link => {
            const active = pathname.startsWith(link.activePath)
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold text-left transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: '#EC4899', color: '#fff', boxShadow: '0 2px 8px rgba(236,72,153,0.30)' }
                    : { color: '#9A3412' }
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#FED7AA' }}
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
        style={{ backgroundColor: '#FFF7ED', borderColor: '#FB923C' }}
      >
        {navLinks.map(link => {
          const active = pathname.startsWith(link.activePath)
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold transition-colors"
              style={active ? { color: '#EC4899' } : { color: '#9A3412' }}
            >
              <span className="text-lg leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
