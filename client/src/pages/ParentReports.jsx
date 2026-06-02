import { useEffect, useState } from 'react'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { getChildren } from '../services/family'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

function relativeDate(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

function computeReport(progressMap, grade) {
  const topicsData = curriculum[grade] || []
  let totalLessons = 0, lessonsCompleted = 0
  const allPcts = []
  const quizHistory = []

  const topics = topicsData.map(t => {
    const lessons = t.lessons || []
    let dT = 0, qT = 0
    const tPcts = []
    lessons.forEach(l => {
      totalLessons++
      const r = progressMap[l.id]
      if (r?.completed) { dT++; lessonsCompleted++ }
      if (r?.completed && r.score != null) {
        const total = l.questions || 1
        const pct   = Math.round((Math.min(r.score, total) / total) * 100)
        qT++; tPcts.push(pct); allPcts.push(pct)
        quizHistory.push({ id: l.id, name: l.title, topic: t.name, score: Math.min(r.score, total), total, pct, date: r.last_date })
      }
    })
    const totalL   = lessons.length
    const progress = totalL > 0 ? Math.round((dT / totalL) * 100) : 0
    const avgScore = tPcts.length ? Math.round(tPcts.reduce((a, b) => a + b, 0) / tPcts.length) : null
    return { name: t.name, icon: t.icon, progress, lessonsD: dT, totalL, quizzes: qT, avgScore }
  })

  quizHistory.sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    overall:          totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0,
    lessonsCompleted,
    totalLessons,
    quizzesTaken:     allPcts.length,
    avgScore:         allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0,
    topics,
    quizHistory:      quizHistory.slice(0, 8),
  }
}

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
  const { user } = useAuth()

  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [progressMap, setProgressMap]     = useState({})
  const [loading, setLoading]             = useState(true)

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null
  const grade       = activeChild?.grade ?? 4

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getChildren(user.id)
      .then(kids => {
        setChildren(kids)
        setActiveChildId(prev => (prev && kids.some(k => k.id === prev)) ? prev : (kids[0]?.id ?? null))
      })
      .catch(err => console.error('[ParentReports] children', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    if (!activeChild?.id) { setProgressMap({}); return }
    getProgressMap(activeChild.id)
      .then(setProgressMap)
      .catch(err => console.error('[ParentReports] progress', err))
  }, [activeChild?.id])

  const stats       = computeReport(progressMap, grade)
  const topics      = stats.topics
  const quizHistory = stats.quizHistory
  const weakTopics  = topics.filter(t => (t.avgScore != null && t.avgScore < 70) || (t.lessonsD > 0 && t.progress < 40))
  const streak      = activeChild?.streak_days ?? 0

  if (!loading && !activeChild) {
    return (
      <ParentLayout>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Reports</h1>
        <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FFF7ED', color: '#9A6700' }}>
          No child linked yet — link one on your Profile to see their report.
        </div>
      </ParentLayout>
    )
  }

  return (
    <ParentLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {activeChild ? `${activeChild.name} — Grade ${grade} · Full performance report` : 'Loading…'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {children.length > 1 && (
            <select
              value={activeChild?.id ?? ''}
              onChange={e => setActiveChildId(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 bg-white"
              style={{ borderColor: '#C8E6D4', color: '#2D7A4F' }}
            >
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 text-gray-500 bg-white transition-colors"
            style={{ borderColor: '#C8E6D4' }}
          >
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard value={`${stats.overall}%`}          label="Overall progress"  color="#2D7A4F" highlight />
        <StatCard
          value={`${stats.lessonsCompleted}/${stats.totalLessons}`}
          label="Lessons completed"
          color="#1a1a2e"
        />
        <StatCard value={`${stats.avgScore}%`}         label="Avg quiz score"   color={scoreColor(stats.avgScore)} />
        <StatCard value={stats.quizzesTaken}            label="Quizzes taken"    color="#1a1a2e" />
        <StatCard value={`🔥 ${streak}`}              label="Day streak"       color="#E07B00" />
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
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left — Topic Breakdown */}
        <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Topic Breakdown</h2>
          {topics.length === 0 ? (
            <p className="text-sm text-gray-400 font-medium">No lessons for this grade yet.</p>
          ) : (
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
          )}
        </div>

        {/* Right — Quiz History */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Recent Quizzes</h2>
          {quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400 font-semibold">No quizzes yet</p>
            </div>
          ) : (
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
                    <div className="text-xs text-gray-400 font-medium">{relativeDate(quiz.date)} · {quiz.pct}% correct</div>
                  </div>
                  {/* Medal */}
                  {quiz.pct >= 90 && <span title="Top score">🏅</span>}
                </div>
              )
            })}
          </div>
          )}
        </div>
      </div>
    </ParentLayout>
  )
}
