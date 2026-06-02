import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'

const child = { name: 'Emma', grade: 4, overallProgress: 62 }

const topics = [
  { id: 1, name: 'Multiplication', icon: '✖️', done: 8,  total: 12, progress: 66, active: true,  color: '#F97316', bg: '#FFF7ED', border: '#FB923C' },
  { id: 2, name: 'Division',       icon: '➗', done: 3,  total: 10, progress: 30, active: false, color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD' },
  { id: 3, name: 'Fractions',      icon: '½',  done: 0,  total: 8,  progress: 0,  active: false, color: '#EC4899', bg: '#FDF2F8', border: '#F9A8D4' },
  { id: 4, name: 'Geometry',       icon: '📐', done: 5,  total: 9,  progress: 55, active: false, color: '#A855F7', bg: '#FAF5FF', border: '#D8B4FE' },
]

const badges = [
  { icon: '⭐', name: 'Quick Learner', color: '#F97316', bg: '#FFF7ED' },
  { icon: '🔥', name: 'On Fire',       color: '#EF4444', bg: '#FEF2F2' },
  { icon: '🎯', name: 'Accurate',      color: '#16A34A', bg: '#DCFCE7' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function KidDashboard() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const childWithProfile = { ...child, name: profile?.name ?? child.name, grade: profile?.grade ?? child.grade, overallProgress: child.overallProgress }

  return (
    <KidLayout>
      {/* Welcome banner */}
      <div
        className="rounded-3xl p-6 mb-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)', boxShadow: '0 4px 20px rgba(249,115,22,0.30)' }}
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            {greeting()}, {childWithProfile.name}! 👋
          </h1>
          <p className="text-orange-100 text-sm font-semibold">
            You're {childWithProfile.overallProgress}% through Grade {childWithProfile.grade} — keep going!
          </p>
        </div>
        <span className="text-6xl select-none">🧒</span>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border-2 p-5 mb-6 shadow-sm" style={{ borderColor: '#86EFAC' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-extrabold text-gray-700">Grade {child.grade} overall progress</span>
          <span className="text-sm font-extrabold" style={{ color: '#16A34A' }}>{child.overallProgress}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#DCFCE7' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${child.overallProgress}%`, background: 'linear-gradient(90deg, #16A34A, #4ADE80)' }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-1 rounded-lg text-xs font-extrabold text-white"
            style={{ backgroundColor: '#16A34A' }}
          >
            Grade 4
          </button>
          <button className="px-3 py-1 rounded-lg text-xs font-bold text-gray-400 bg-gray-100 hover:bg-green-50 transition-colors">
            Grade 5
          </button>
        </div>
      </div>

      {/* Topic grid */}
      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Pick a topic to practice</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => navigate(`/kid/lessons?topic=${topic.id}`)}
            className="bg-white rounded-2xl p-5 text-left border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: topic.active ? topic.border : '#E5E7EB' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: topic.bg }}
            >
              {topic.icon}
            </div>
            <div className="text-sm font-extrabold text-gray-800 mb-1">{topic.name}</div>
            <div className="text-xs text-gray-400 font-semibold mb-2">{topic.done} / {topic.total} done</div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: topic.bg }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${topic.progress}%`, backgroundColor: topic.color }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border-2 p-5 shadow-sm" style={{ borderColor: '#86EFAC' }}>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">My Badges</p>
        <div className="flex flex-wrap gap-3">
          {badges.map(b => (
            <div
              key={b.name}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: b.bg, color: b.color }}
            >
              <span>{b.icon}</span>
              <span>{b.name}</span>
            </div>
          ))}
        </div>
      </div>
    </KidLayout>
  )
}
