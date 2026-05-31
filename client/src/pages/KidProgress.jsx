import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'

const stats = { overall: 62, lessonsCompleted: 16, streak: 5, badgesEarned: 3 }

const topics = [
  { id: 1, name: 'Multiplication', icon: '✖️', progress: 66 },
  { id: 2, name: 'Division',       icon: '➗', progress: 30 },
  { id: 3, name: 'Fractions',      icon: '½',  progress: 0  },
  { id: 4, name: 'Geometry',       icon: '📐', progress: 55 },
]

const quizHistory = [
  { id: 1, name: 'Times tables 6–10',    score: 9,  total: 10, date: 'Yesterday',  pct: 90  },
  { id: 2, name: 'Long division intro',  score: 6,  total: 10, date: '2 days ago', pct: 60  },
  { id: 3, name: 'Basic geometry shapes',score: 8,  total: 10, date: '3 days ago', pct: 80  },
  { id: 4, name: 'Times tables 1–5',     score: 10, total: 10, date: '4 days ago', pct: 100 },
]

function barColor(pct) {
  if (pct >= 50) return '#6B3FA0'
  if (pct >= 20) return '#E07B00'
  return '#DC2626'
}

function scoreColor(pct) {
  if (pct >= 80) return '#16A34A'
  if (pct >= 60) return '#E07B00'
  return '#DC2626'
}

function StatCard({ value, label, color, sub }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border-2 p-5 text-center shadow-sm" style={{ borderColor: '#D4B8F0' }}>
      <div className="text-3xl font-extrabold mb-1" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 font-semibold">{sub}</div>}
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{label}</div>
    </div>
  )
}

export default function KidProgress() {
  const navigate = useNavigate()

  return (
    <KidLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">📊 My Progress</h1>

      {/* Stat cards */}
      <div className="flex gap-4 mb-6">
        <StatCard value={`${stats.overall}%`}      label="Overall Grade 4"   color="#6B3FA0" />
        <StatCard value={stats.lessonsCompleted}    label="Lessons completed" color="#1a1a2e" />
        <StatCard value={`🔥 ${stats.streak}`}     label="Day streak"        color="#E07B00" />
        <StatCard value={`🏅 ${stats.badgesEarned}`} label="Badges earned"   color="#B45309" />
      </div>

      {/* Two panels */}
      <div className="flex gap-5">

        {/* Topic breakdown */}
        <div className="flex-1 bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#D4B8F0' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Topic Breakdown</h2>
          <div className="flex flex-col gap-5">
            {topics.map(topic => {
              const color = barColor(topic.progress)
              return (
                <button
                  key={topic.id}
                  className="w-full text-left hover:bg-purple-50 rounded-xl px-2 py-1 transition-colors"
                  onClick={() => navigate(`/kid/lessons?topic=${topic.id}`)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{topic.icon}</span>
                      <span className="text-sm font-extrabold text-gray-800">{topic.name}</span>
                    </div>
                    <span className="text-sm font-extrabold" style={{ color }}>{topic.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${topic.progress}%`, backgroundColor: color }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recent quizzes */}
        <div className="w-80 bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#D4B8F0' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Recent Quizzes</h2>
          <div className="flex flex-col gap-2">
            {quizHistory.map(quiz => {
              const color = scoreColor(quiz.pct)
              return (
                <div
                  key={quiz.id}
                  className="flex items-center gap-3 py-3 border-b last:border-0 cursor-pointer hover:bg-purple-50 rounded-xl px-2 transition-colors"
                  style={{ borderColor: '#F5F0FF' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {quiz.score}/{quiz.total}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{quiz.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{quiz.date} · {quiz.pct}% correct</div>
                  </div>
                  {quiz.pct >= 90 && <span title="Top score!">🏅</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </KidLayout>
  )
}
