import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'

const child = { name: 'Emma', grade: 4, overallProgress: 62 }

const topics = [
  { id: 1, name: 'Multiplication', icon: '✖️', done: 8,  total: 12, progress: 66, active: true  },
  { id: 2, name: 'Division',       icon: '➗', done: 3,  total: 10, progress: 30, active: false },
  { id: 3, name: 'Fractions',      icon: '½',  done: 0,  total: 8,  progress: 0,  active: false },
  { id: 4, name: 'Geometry',       icon: '📐', done: 5,  total: 9,  progress: 55, active: false },
]

const badges = [
  { icon: '⭐', name: 'Quick Learner' },
  { icon: '🔥', name: 'On Fire'       },
  { icon: '🎯', name: 'Accurate'      },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function KidDashboard() {
  const navigate = useNavigate()

  return (
    <KidLayout>
      {/* Welcome banner */}
      <div
        className="rounded-3xl p-6 mb-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #6B3FA0 0%, #9B5FD0 100%)', boxShadow: '0 4px 20px rgba(107,63,160,0.30)' }}
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            {greeting()}, {child.name}! 👋
          </h1>
          <p className="text-purple-200 text-sm font-semibold">
            You're {child.overallProgress}% through Grade {child.grade} — keep going!
          </p>
        </div>
        <span className="text-6xl select-none">🧒</span>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border p-5 mb-6 shadow-sm" style={{ borderColor: '#D4B8F0' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-extrabold text-gray-700">Grade {child.grade} overall progress</span>
          <span className="text-sm font-extrabold" style={{ color: '#6B3FA0' }}>{child.overallProgress}%</span>
        </div>
        <div className="h-3 rounded-full bg-purple-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${child.overallProgress}%`, background: 'linear-gradient(90deg, #6B3FA0, #9B5FD0)' }}
          />
        </div>
        {/* Grade switcher */}
        <div className="flex gap-2 mt-3">
          <button
            className="px-3 py-1 rounded-lg text-xs font-extrabold text-white"
            style={{ backgroundColor: '#6B3FA0' }}
          >Grade 4</button>
          <button
            className="px-3 py-1 rounded-lg text-xs font-bold text-gray-400 bg-gray-100 hover:bg-purple-50 transition-colors"
          >Grade 5</button>
        </div>
      </div>

      {/* Topic grid */}
      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Pick a topic to practice</p>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => navigate(`/kid/lessons?topic=${topic.id}`)}
            className="bg-white rounded-2xl p-5 text-left border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            style={{ borderColor: topic.active ? '#6B3FA0' : '#E8E0F5' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
              style={{ backgroundColor: topic.active ? '#EDE4FF' : '#F5F0FF' }}
            >
              {topic.icon}
            </div>
            <div className="text-sm font-extrabold text-gray-800 mb-1">{topic.name}</div>
            <div className="text-xs text-gray-400 font-semibold mb-2">{topic.done} / {topic.total} done</div>
            <div className="h-1.5 rounded-full bg-purple-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${topic.progress}%`, backgroundColor: '#6B3FA0' }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#D4B8F0' }}>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">My Badges</p>
        <div className="flex gap-3">
          {badges.map(b => (
            <div
              key={b.name}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: '#EDE4FF', color: '#6B3FA0' }}
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
