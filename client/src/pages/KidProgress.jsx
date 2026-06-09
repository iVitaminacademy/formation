import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

// ── helpers ───────────────────────────────────────────────────────────────────
function scoreColor(pct) {
  if (pct >= 80) return '#F97316'
  if (pct >= 60) return '#F97316'
  return '#EF4444'
}

function relativeDate(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

const topicMeta = {
  1: { color: '#F97316', bg: '#FFF7ED' },
  2: { color: '#3B82F6', bg: '#EFF6FF' },
  3: { color: '#EC4899', bg: '#FDF2F8' },
  4: { color: '#A855F7', bg: '#FAF5FF' },
  5: { color: '#0891B2', bg: '#ECFEFF' },
  6: { color: '#EC4899', bg: '#FDF2F8' },
  7: { color: '#3B82F6', bg: '#EFF6FF' },
  8: { color: '#F97316', bg: '#FFF7ED' },
}

function buildStats(progressMap, grade, profile) {
  const topics = curriculum[grade] || []

  // Per-topic breakdown
  let totalLessons = 0, totalDone = 0
  const topicsWithProgress = topics.map(t => {
    const done  = t.lessons.filter(l => progressMap[l.id]?.completed).length
    const total = t.lessons.length
    totalLessons += total
    totalDone    += done
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { ...t, ...(topicMeta[t.id] || topicMeta[1]), done, total, progress: pct }
  })

  const overall = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0

  // Quiz history — every completed lesson row, sorted newest first
  const allLessons = topics.flatMap(t => t.lessons)
  const quizHistory = allLessons
    .filter(l => progressMap[l.id]?.completed)
    .map(l => {
      const row   = progressMap[l.id]
      const total = l.questions
      const score = Math.min(row.score ?? 0, total)
      const pct   = total > 0 ? Math.round((score / total) * 100) : 0
      return { id: l.id, name: l.title, score, total, pct, date: row.last_date }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  // Badges
  const badges = []
  if (totalDone >= 5)                     badges.push({ icon: '⭐', name: 'Quick Learner' })
  if ((profile?.streak_days ?? 0) >= 5)  badges.push({ icon: '🔥', name: 'On Fire'       })
  if (quizHistory.some(q => q.pct === 100)) badges.push({ icon: '🎯', name: 'Accurate'    })

  return { topicsWithProgress, overall, totalDone, quizHistory, badges }
}

// ── sub-components ────────────────────────────────────────────────────────────
function StatCard({ value, label, color, border }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border-2 p-5 text-center shadow-sm" style={{ borderColor: border }}>
      <div className="text-3xl font-extrabold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{label}</div>
    </div>
  )
}

function SkeletonRow() {
  return <div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-3" />
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function KidProgress() {
  const navigate          = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading]         = useState(true)
  const grade = profile?.grade ?? 4

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(setProgressMap)
      .catch(err => console.error('[Progress page]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    function onProgress() { if (user?.id) getProgressMap(user.id).then(setProgressMap) }
    function onStreak()   { refreshProfile?.() }
    window.addEventListener('progressUpdated', onProgress)
    window.addEventListener('streakUpdated',   onStreak)
    return () => {
      window.removeEventListener('progressUpdated', onProgress)
      window.removeEventListener('streakUpdated',   onStreak)
    }
  }, [user?.id, refreshProfile])

  const { topicsWithProgress, overall, totalDone, quizHistory, badges } =
    buildStats(progressMap, grade, profile)

  const statCards = [
    { value: loading ? '…' : `${overall}%`,    label: `Overall Grade ${grade}`, color: '#F97316', border: '#FB923C' },
    { value: loading ? '…' : totalDone,         label: 'Lessons completed',      color: '#3B82F6', border: '#93C5FD' },
    { value: `🔥 ${profile?.streak_days ?? 0}`, label: 'Day streak',             color: '#F97316', border: '#FED7AA' },
    { value: `🏅 ${badges.length}`,             label: 'Badges earned',          color: '#EC4899', border: '#F9A8D4' },
  ]

  return (
    <KidLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">📊 My Progress</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex flex-col lg:flex-row gap-5">

        {/* Topic breakdown */}
        <div className="flex-1 bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#FB923C' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">
            Topic Breakdown
          </h2>
          <div className="flex flex-col gap-5">
            {loading
              ? [1,2,3,4].map(i => <SkeletonRow key={i} />)
              : topicsWithProgress.map(topic => (
                <button
                  key={topic.id}
                  className="w-full text-left rounded-xl px-2 py-1 transition-colors"
                  onClick={() => navigate('/kid/lessons')}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = topic.bg)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{topic.icon}</span>
                      <span className="text-sm font-extrabold text-gray-800">{topic.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-semibold">{topic.done}/{topic.total}</span>
                      <span className="text-sm font-extrabold" style={{ color: topic.color }}>
                        {topic.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: topic.bg }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${topic.progress}%`, backgroundColor: topic.color }}
                    />
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Recent quizzes */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#FB923C' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">
            Recent Quizzes
          </h2>

          {loading ? (
            [1,2,3].map(i => <SkeletonRow key={i} />)
          ) : quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400 font-semibold">No quizzes yet</p>
              <p className="text-xs text-gray-300 mt-1">Complete a lesson to see your results here</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {quizHistory.map(quiz => {
                const color = scoreColor(quiz.pct)
                return (
                  <div
                    key={quiz.id}
                    className="flex items-center gap-3 py-3 border-b last:border-0 rounded-xl px-2 transition-colors"
                    style={{ borderColor: '#FFF7ED' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FFF7ED')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {quiz.score}/{quiz.total}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{quiz.name}</div>
                      <div className="text-xs text-gray-400 font-medium">
                        {relativeDate(quiz.date)} · {quiz.pct}% correct
                      </div>
                    </div>
                    {quiz.pct >= 90 && <span title="Top score!">🏅</span>}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </KidLayout>
  )
}
