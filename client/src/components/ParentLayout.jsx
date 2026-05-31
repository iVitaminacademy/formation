import { useNavigate, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Dashboard',        icon: '🏠', path: '/parent/dashboard' },
  { label: 'Lessons & Guides', icon: '📚', path: '/parent/lessons' },
  { label: 'Reports',          icon: '📊', path: '/parent/reports' },
  { label: 'Profile',          icon: '👤', path: '/parent/profile' },
]

export default function ParentLayout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0FAF4' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#2D7A4F', boxShadow: '0 2px 12px rgba(45,122,79,0.25)' }}
      >
        <span className="text-xl font-extrabold text-white tracking-tight">
          MathMates{' '}
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-1 align-middle">
            Parent Mode
          </span>
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/kid/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ⇄ Switch to Kid Mode
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => navigate('/parent/profile')}
          >
            🧒
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside
          className="w-52 shrink-0 flex flex-col py-5 px-3 border-r overflow-y-auto"
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
        <main className="flex-1 overflow-y-auto px-8 py-7">
          {children}
        </main>
      </div>
    </div>
  )
}
