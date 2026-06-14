import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Tableau de bord', icon: '🏠', path: '/medecin/dashboard',    activePath: '/medecin/dashboard'    },
  { label: 'Leçons',          icon: '📖', path: '/medecin/lessons',      activePath: '/medecin/lesson'       },
  { label: 'Progression',     icon: '📊', path: '/medecin/progress',     activePath: '/medecin/progress'     },
  { label: 'Certificat',      icon: '🎓', path: '/medecin/certificate',  activePath: '/medecin/certificate'  },
  { label: 'Calendrier',      icon: '📅', path: '/medecin/calendar',     activePath: '/medecin/calendar'     },
  { label: 'Profil',          icon: '👤', path: '/medecin/profile',      activePath: '/medecin/profile'      },
]

export default function KidLayout({ children }) {
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()
  const { pathname } = useLocation()
  const avatar = profile?.avatar ?? '👨‍⚕️'
  const streak = profile?.streak_days ?? 0

  const handleLogout = async () => {
    try { await signOut() } catch { /* ignore */ }
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F8' }}>

      {/* ── Top Navbar ── */}
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#1E3A5F', boxShadow: '0 2px 12px rgba(30,58,95,0.35)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          iVitaminacademy
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-2 align-middle">
            Médecin
          </span>
        </span>

        <div className="flex items-center gap-2 sm:gap-3">
          {streak > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-extrabold"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#93C5FD' }}
            >
              🎯 {streak}<span className="hidden sm:inline"> modules</span>
            </div>
          )}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{ backgroundColor: 'rgba(255,255,255,0.18)' }}
            onClick={() => navigate('/medecin/profile')}
          >
            {avatar}
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-white border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.30)', backgroundColor: 'transparent' }}
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
          style={{ borderColor: '#CBD5E1', backgroundColor: '#E8EEF5' }}
        >
          <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748B' }}>
            Navigation
          </p>
          {navLinks.map(link => {
            const active = pathname.startsWith(link.activePath)
            return (
              <button
                key={link.label}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-bold text-left transition-all duration-150"
                style={
                  active
                    ? { backgroundColor: '#1E3A5F', color: '#fff', boxShadow: '0 2px 8px rgba(30,58,95,0.30)' }
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
         
        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 pb-24 md:pb-7">
          {children}
        </main>
      </div>

      {/* ── Bottom Nav (mobile) ── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch justify-around border-t"
        style={{ backgroundColor: '#E8EEF5', borderColor: '#CBD5E1' }}
      >
        {navLinks.map(link => {
          const active = pathname.startsWith(link.activePath)
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold transition-colors"
              style={active ? { color: '#1E3A5F' } : { color: '#64748B' }}
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
