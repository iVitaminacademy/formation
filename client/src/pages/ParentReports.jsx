import ParentLayout from '../components/ParentLayout'

const stats = {
  overall: 62,
  lessonsCompleted: 16,
  totalLessons: 39,
  streak: 5,
  quizzesTaken: 8,
  avgScore: 78,
}

const topics = [
  { name: 'Multiplication', icon: '✖️', progress: 66, lessonsD: 8,  totalL: 12, quizzes: 3, avgScore: 88 },
  { name: 'Division',       icon: '➗', progress: 30, lessonsD: 3,  totalL: 10, quizzes: 1, avgScore: 60 },
  { name: 'Fractions',      icon: '½',  progress: 0,  lessonsD: 0,  totalL: 8,  quizzes: 0, avgScore: null },
  { name: 'Geometry',       icon: '📐', progress: 55, lessonsD: 5,  totalL: 9,  quizzes: 2, avgScore: 80 },
]

const quizHistory = [
  { id: 1, name: 'Times tables 6–10',   topic: 'Multiplication', score: 9,  total: 10, date: 'Yesterday',  pct: 90 },
  { id: 2, name: 'Long division intro',  topic: 'Division',       score: 6,  total: 10, date: '2 days ago', pct: 60 },
  { id: 3, name: 'Basic geometry shapes',topic: 'Geometry',       score: 8,  total: 10, date: '3 days ago', pct: 80 },
  { id: 4, name: 'Times tables 1–5',    topic: 'Multiplication', score: 10, total: 10, date: '4 days ago', pct: 100 },
  { id: 5, name: 'Shapes & properties', topic: 'Geometry',       score: 7,  total: 10, date: '5 days ago', pct: 70 },
]

function progressColor(pct) {
  if (pct >= 50) return '#2D7A4F'
  if (pct >= 20) return '#E07B00'
  return '#CC2222'
}

function scoreColor(pct) {
  if (pct >= 80) return '#2D7A4F'
  if (pct >= 60) return '#E07B00'
  return '#CC2222'
}

function StatCard({ value, sub, label, color, highlight }) {
  return (
    <div
      className="flex-1 bg-white rounded-2xl border p-5 shadow-sm"
      style={{ borderColor: highlight ? color : '#C8E6D4', borderWidth: highlight ? 2 : 1 }}
    >
      <div className="text-3xl font-extrabold" style={{ color: color || '#1a1a2e' }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 font-semibold mt-0.5">{sub}</div>}
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-2">{label}</div>
    </div>
  )
}

function WeakAlert({ topic }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border-l-4 text-sm"
      style={{ backgroundColor: '#FFF7ED', borderColor: '#E07B00' }}
    >
      <span className="text-lg">{topic.icon}</span>
      <div className="flex-1">
        <span className="font-bold text-orange-800">{topic.name}</span>
        <span className="text-orange-600"> — {topic.progress}% complete, avg score {topic.avgScore ?? 'N/A'}%</span>
      </div>
      <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wide">Needs work</span>
    </div>
  )
}

export default function ParentReports() {
  const weakTopics = topics.filter(t => t.progress < 40)

  return (
    <ParentLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Emma Johnson — Grade 4 · Full performance report</p>
        </div>
        <button
          className="px-4 py-2 rounded-xl text-sm font-bold border-2 text-gray-500 bg-white transition-colors"
          style={{ borderColor: '#C8E6D4' }}
        >
          ⬇ Export PDF
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="flex gap-4 mb-6">
        <StatCard value={`${stats.overall}%`}          label="Overall progress"  color="#2D7A4F" highlight />
        <StatCard
          value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
          label="Lessons completed"
          color="#1a1a2e"
        />
        <StatCard value={`${stats.avgScore}%`}         label="Avg quiz score"   color={scoreColor(stats.avgScore)} />
        <StatCard value={stats.quizzesTaken}            label="Quizzes taken"    color="#1a1a2e" />
        <StatCard value={`🔥 ${stats.streak}`}         label="Day streak"       color="#E07B00" />
      </div>

      {/* ── Weak Area Alerts ── */}
      {weakTopics.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#FCD34D' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-orange-400 mb-3">
            ⚠ Weak Area Alerts — {weakTopics.length} topic{weakTopics.length > 1 ? 's' : ''} need attention
          </h2>
          <div className="flex flex-col gap-2">
            {weakTopics.map(t => <WeakAlert key={t.name} topic={t} />)}
          </div>
        </div>
      )}

      {/* ── Two column ── */}
      <div className="flex gap-5">

        {/* Left — Topic Breakdown */}
        <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Topic Breakdown</h2>
          <div className="flex flex-col gap-4">
            {topics.map(topic => {
              const color = progressColor(topic.progress)
              return (
                <div key={topic.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{topic.icon}</span>
                      <span className="text-sm font-bold text-gray-800">{topic.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                      <span>{topic.lessonsD}/{topic.totalL} lessons</span>
                      <span>{topic.quizzes} quizzes</span>
                      {topic.avgScore !== null && (
                        <span style={{ color: scoreColor(topic.avgScore) }}>avg {topic.avgScore}%</span>
                      )}
                      <span className="font-extrabold" style={{ color }}>{topic.progress}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.progress}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — Quiz History */}
        <div className="w-80 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Recent Quizzes</h2>
          <div className="flex flex-col gap-3">
            {quizHistory.map(quiz => {
              const color = scoreColor(quiz.pct)
              return (
                <div key={quiz.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#F0FAF4' }}>
                  {/* Score badge */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {quiz.score}/{quiz.total}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{quiz.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{quiz.date} · {quiz.pct}% correct</div>
                  </div>
                  {/* Medal */}
                  {quiz.pct >= 90 && <span title="Top score">🏅</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </ParentLayout>
  )
}
