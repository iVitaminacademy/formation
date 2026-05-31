import { useNavigate, useLocation } from 'react-router-dom'

// path = where to navigate, activePath = what URL prefix marks this link as active
const navLinks = [
  { label: 'Dashboard',   icon: '🏠', path: '/kid/dashboard', activePath: '/kid/dashboard' },
  { label: 'Lessons',     icon: '📚', path: '/kid/lessons',   activePath: '/kid/lessons'   },
  { label: 'Quiz',        icon: '✏️', path: '/kid/lessons',   activePath: '/kid/quiz'      },
  { label: 'My Progress', icon: '📊', path: '/kid/progress',  activePath: '/kid/progress'  },
  { label: 'Profile',     icon: '👤', path: '/kid/profile',   activePath: '/kid/profile'   },
]

const streak = 5

export default function KidLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0FF' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#6B3FA0', boxShadow: '0 2px 12px rgba(107,63,160,0.30)' }}
      >
        <span className="text-xl font-extrabold text-white tracking-tight">
          MathMates{' '}
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-1 align-middle">
            Kid Mode
          </span>
        </span>

        <div className="flex items-center gap-3">
          {/* Streak badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#FFD700' }}
          >
            🔥 {streak}-day streak
          </div>
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            onClick={() => navigate('/kid/profile')}
          >
            🧒
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside
          className="w-48 shrink-0 flex flex-col py-5 px-3 border-r overflow-y-auto"
          style={{ borderColor: '#D4B8F0', backgroundColor: '#EDE4FF' }}
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
                    ? { backgroundColor: '#6B3FA0', color: '#fff', boxShadow: '0 2px 8px rgba(107,63,160,0.28)' }
                    : { color: '#6B3FA0' }
                }
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#D4B8F0' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  )
}
