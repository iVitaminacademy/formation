import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'

const child = {
  name: 'Emma Johnson',
  grade: 4,
  lastActive: 'Today',
  avatar: '🧒',
  overallProgress: 62,
  lessonsCompleted: 16,
  streak: 5,
}

const topics = [
  { id: 1, name: 'Multiplication', icon: '✖️', progress: 66, lessons: 8,  totalLessons: 12, quizzes: 3 },
  { id: 2, name: 'Division',       icon: '➗', progress: 30, lessons: 3,  totalLessons: 10, quizzes: 1 },
  { id: 3, name: 'Fractions',      icon: '½',  progress: 0,  lessons: 0,  totalLessons: 8,  quizzes: 0 },
  { id: 4, name: 'Geometry',       icon: '📐', progress: 55, lessons: 5,  totalLessons: 9,  quizzes: 2 },
]

const weakTopics = topics.filter(t => t.progress < 40)

function progressColor(pct) {
  if (pct >= 50) return '#2D7A4F'
  if (pct >= 20) return '#E07B00'
  return '#CC2222'
}

function StatCard({ value, label, color, icon }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border p-5 text-center shadow-sm" style={{ borderColor: '#C8E6D4' }}>
      <div className="text-3xl font-extrabold mb-1" style={{ color: color || '#1a1a2e' }}>
        {icon && <span className="mr-1">{icon}</span>}{value}
      </div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide">{label}</div>
    </div>
  )
}

function TopicRow({ topic, onGuideClick }) {
  const color = progressColor(topic.progress)
  return (
    <button
      className="w-full flex items-center gap-3 py-3 px-2 hover:bg-green-50 rounded-xl transition-colors text-left group"
      onClick={() => onGuideClick(topic)}
    >
      <span className="text-xl w-6 text-center">{topic.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold text-gray-800">{topic.name}</span>
          <span className="text-sm font-extrabold" style={{ color }}>{topic.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${topic.progress}%`, backgroundColor: color }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1 font-medium">
          {topic.lessons}/{topic.totalLessons} lessons · {topic.quizzes} quiz{topic.quizzes !== 1 ? 'zes' : ''} done
        </div>
      </div>
      <span className="text-gray-200 group-hover:text-green-400 transition-colors text-sm">›</span>
    </button>
  )
}

export default function ParentDashboard() {
  const navigate = useNavigate()
  const weakest  = weakTopics[0] || topics[topics.length - 1]

  return (
    <ParentLayout>
      {/* Title */}
      <h1 className="text-2xl font-extrabold mb-6" style={{ color: '#1a1a2e' }}>
        {child.name}'s Report — Grade {child.grade}
      </h1>

      {/* Stat Cards */}
      <div className="flex gap-4 mb-6">
        <StatCard value={`${child.overallProgress}%`} label="Overall progress" color="#2D7A4F" />
        <StatCard value={child.lessonsCompleted}       label="Lessons done"     color="#1a1a2e" />
        <StatCard value={child.streak}                 label="Day streak"       color="#E07B00" icon="🔥" />
        <StatCard value={weakTopics.length}            label="Weak topics"      color="#CC2222" />
      </div>

      {/* Two-column grid */}
      <div className="flex gap-5">

        {/* Topic Breakdown */}
        <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Topic Breakdown</h2>
          <div className="flex flex-col gap-0.5">
            {topics.map(topic => (
              <TopicRow
                key={topic.id}
                topic={topic}
                onGuideClick={t => navigate(`/parent/lessons?topic=${t.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 flex flex-col gap-4">

          {/* Child card */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm flex items-center gap-4" style={{ borderColor: '#C8E6D4' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#EDE4FF' }}>
              {child.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-gray-800 truncate">{child.name}</div>
              <div className="text-xs text-gray-400 font-semibold">Grade {child.grade} · Active {child.lastActive}</div>
            </div>
            <span className="text-gray-300">›</span>
          </div>

          {/* Suggestion box */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3" style={{ borderColor: '#C8E6D4' }}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Parent Suggestion</div>
            <div
              className="rounded-xl p-4 text-sm leading-relaxed"
              style={{ backgroundColor: '#FFFBEB', borderLeft: '4px solid #E07B00' }}
            >
              <div className="font-bold text-orange-700 mb-1">
                💡 Help {child.name.split(' ')[0]} with {weakest.name}
              </div>
              <div className="text-gray-600 text-xs leading-relaxed">
                {child.name.split(' ')[0]} is at only {weakest.progress}% in {weakest.name}.
                Open the Teaching Guide for step-by-step instructions on how to explain{' '}
                {weakest.name.toLowerCase()} in a simple way.
              </div>
            </div>
            <button
              className="w-full py-3 rounded-xl text-white font-extrabold text-sm transition-all duration-200"
              style={{ backgroundColor: '#2D7A4F', boxShadow: '0 4px 12px rgba(45,122,79,0.3)' }}
              onClick={() => navigate(`/parent/lessons?topic=${weakest.id}`)}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#245f3e')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2D7A4F')}
            >
              Open Teaching Guide →
            </button>
          </div>

        </div>
      </div>
    </ParentLayout>
  )
}
