import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'

const fallbackChild = {
  childName: 'Emma Johnson',
  childGrade: 4,
}

const badges = [
  { id: 1, icon: '⭐', name: 'Quick Learner',  desc: 'Child completed 5 lessons',    earned: true  },
  { id: 2, icon: '🔥', name: 'On Fire',         desc: '5-day streak',                 earned: true  },
  { id: 3, icon: '🎯', name: 'Accurate',         desc: 'Child scored 100% on a quiz',  earned: true  },
  { id: 4, icon: '🚀', name: 'Rocket Start',    desc: 'Child completed a full topic', earned: false },
  { id: 5, icon: '💎', name: 'Diamond',          desc: '10-day streak',                earned: false },
  { id: 6, icon: '🏆', name: 'Champion',         desc: 'Child completed Grade 4',      earned: false },
]

const settingsItems = [
  { icon: '✏️', label: 'Edit Profile',     desc: 'Change name, email, avatar' },
  { icon: '🔔', label: 'Notifications',    desc: 'Daily reminders & alerts'   },
  { icon: '🔒', label: 'Privacy & Policy', desc: 'Data usage & privacy info'  },
  { icon: '❓', label: 'Help & FAQ',       desc: 'Get help or read the FAQ'   },
]

export default function ParentProfile() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [kidMode, setKidMode] = useState(false)

  const user = {
    name: profile?.name || 'Parent',
    email: profile?.email || '',
    role: 'Parent',
    avatar: profile?.avatar || '👩',
    childName: fallbackChild.childName,
    childGrade: fallbackChild.childGrade,
  }

  const handleModeToggle = () => {
    setKidMode(v => !v)
    if (!kidMode) navigate('/kid/dashboard')
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // ignore — navigate home regardless
    }
    navigate('/')
  }

  return (
    <ParentLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile &amp; Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Avatar & info */}
          <div className="bg-white rounded-2xl border p-6 flex flex-col items-center text-center shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 border-4"
              style={{ backgroundColor: '#F0FAF4', borderColor: '#2D7A4F' }}
            >
              {user.avatar}
            </div>
            <div className="font-extrabold text-gray-900 text-lg">{user.name}</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">{user.email}</div>
            <div
              className="mt-2 px-3 py-1 rounded-full text-xs font-extrabold"
              style={{ backgroundColor: '#F0FAF4', color: '#2D7A4F' }}
            >
              Parent Mode
            </div>

            {/* Linked child */}
            <div className="w-full mt-4 pt-4 border-t" style={{ borderColor: '#E8F5EE' }}>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-2">Linked Child</div>
              <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: '#F0FAF4' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#EDE4FF' }}>🧒</div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-800">{user.childName}</div>
                  <div className="text-xs text-gray-400">Grade {user.childGrade}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="bg-white rounded-2xl border p-4 shadow-sm flex items-center justify-between" style={{ borderColor: '#C8E6D4' }}>
            <div>
              <div className="text-sm font-bold text-gray-800">Switch to Kid Mode</div>
              <div className="text-xs text-gray-400 font-medium">Let your child take over</div>
            </div>
            <button
              onClick={handleModeToggle}
              className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
              style={{ backgroundColor: kidMode ? '#2D7A4F' : '#D1D5DB' }}
            >
              <span
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: kidMode ? '28px' : '4px' }}
              />
            </button>
          </div>

          {/* Settings menu */}
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#E8F5EE' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Account</span>
            </div>
            {settingsItems.map((item, i) => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b last:border-0 transition-colors"
                style={{ borderColor: '#F0FAF4' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FAF4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400 font-medium">{item.desc}</div>
                </div>
                <span className="text-gray-300 text-sm">›</span>
              </button>
            ))}
          </div>

          {/* Log out */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors"
            style={{ borderColor: '#FCA5A5', color: '#DC2626', backgroundColor: '#FFF5F5' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
          >
            ← Log Out
          </button>
        </div>

        {/* ── Right column — Badges ── */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                Child's Badges
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {badges.filter(b => b.earned).length} / {badges.length} earned
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200"
                  style={
                    badge.earned
                      ? { borderColor: '#A8D5B8', backgroundColor: '#F0FAF4' }
                      : { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', opacity: 0.55 }
                  }
                >
                  <div className="text-4xl mb-3" style={{ filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div className="text-sm font-extrabold text-gray-800 mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-400 font-medium leading-snug">{badge.desc}</div>
                  {badge.earned && (
                    <div
                      className="mt-3 px-2.5 py-1 rounded-full text-xs font-extrabold"
                      style={{ backgroundColor: '#2D7A4F', color: '#fff' }}
                    >
                      ✓ Earned
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="mt-3 px-2.5 py-1 rounded-full text-xs font-bold text-gray-400 bg-gray-100">
                      🔒 Locked
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </ParentLayout>
  )
}
