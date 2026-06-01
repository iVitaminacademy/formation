import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'

const user = { name: 'Emma Johnson', grade: 4, streak: 5, avatar: '🧒' }

const badges = [
  { id: 1, icon: '⭐', name: 'Quick Learner', desc: 'Complete 5 lessons',     earned: true,  color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
  { id: 2, icon: '🔥', name: 'On Fire',       desc: '5-day streak',           earned: true,  color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5' },
  { id: 3, icon: '🎯', name: 'Accurate',      desc: 'Score 100% on a quiz',  earned: true,  color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC' },
  { id: 4, icon: '🚀', name: 'Rocket Start',  desc: 'Complete a full topic',  earned: false, color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
  { id: 5, icon: '💎', name: 'Diamond',       desc: '10-day streak',          earned: false, color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
  { id: 6, icon: '🏆', name: 'Champion',      desc: 'Complete full Grade 4',  earned: false, color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
]

const settingsItems = [
  { icon: '✏️', label: 'Edit Profile',     desc: 'Change your name or avatar' },
  { icon: '🔔', label: 'Notifications',    desc: 'Daily learning reminders'   },
  { icon: '🔒', label: 'Privacy & Policy', desc: 'Data & privacy info'        },
  { icon: '❓', label: 'Help & FAQ',       desc: 'Get help or read the FAQ'   },
]

export default function KidProfile() {
  const navigate = useNavigate()
  const [parentMode, setParentMode] = useState(false)

  function handleToggle() {
    setParentMode(v => !v)
    if (!parentMode) navigate('/parent/dashboard')
  }

  return (
    <KidLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">👤 Profile</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border-2 p-6 flex flex-col items-center text-center shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 border-4"
              style={{ backgroundColor: '#DCFCE7', borderColor: '#16A34A' }}
            >
              {user.avatar}
            </div>
            <div className="font-extrabold text-gray-900 text-lg">{user.name}</div>
            <div
              className="mt-1 px-3 py-1 rounded-full text-xs font-extrabold"
              style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}
            >
              Grade {user.grade} · Kid Mode
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-bold" style={{ color: '#EF4444' }}>
              🔥 {user.streak}-day streak
            </div>
          </div>

          {/* Parent mode toggle */}
          <div className="bg-white rounded-2xl border-2 p-4 shadow-sm flex items-center justify-between" style={{ borderColor: '#86EFAC' }}>
            <div>
              <div className="text-sm font-extrabold text-gray-800">Switch to Parent Mode</div>
              <div className="text-xs text-gray-400 font-medium">For a parent or guardian</div>
            </div>
            <button
              onClick={handleToggle}
              className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
              style={{ backgroundColor: parentMode ? '#16A34A' : '#D1D5DB' }}
            >
              <span
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: parentMode ? '28px' : '4px' }}
              />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#DCFCE7' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Account</span>
            </div>
            {settingsItems.map(item => (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b last:border-0 transition-colors"
                style={{ borderColor: '#F0FDF4' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400 font-medium">{item.desc}</div>
                </div>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>

          {/* Log out */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors"
            style={{ borderColor: '#FCA5A5', color: '#EF4444', backgroundColor: '#FFF5F5' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
          >
            ← Log Out
          </button>
        </div>

        {/* ── Right column — Badges ── */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">🏆 My Badges</h2>
              <span className="text-xs font-bold text-gray-400">
                {badges.filter(b => b.earned).length} / {badges.length} earned
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200"
                  style={{
                    borderColor: badge.border,
                    backgroundColor: badge.bg,
                    opacity: badge.earned ? 1 : 0.5,
                  }}
                >
                  <div className="text-4xl mb-3" style={{ filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div className="text-sm font-extrabold text-gray-800 mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-400 font-medium leading-snug">{badge.desc}</div>
                  {badge.earned
                    ? <div className="mt-3 px-3 py-1 rounded-full text-xs font-extrabold text-white" style={{ backgroundColor: badge.color }}>✓ Earned</div>
                    : <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400">🔒 Locked</div>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </KidLayout>
  )
}
