import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

const topicMeta = [
  { id: 1, color: '#F97316', bg: '#FFF7ED', border: '#FB923C' },
  { id: 2, color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD' },
  { id: 3, color: '#EC4899', bg: '#FDF2F8', border: '#F9A8D4' },
  { id: 4, color: '#A855F7', bg: '#FAF5FF', border: '#D8B4FE' },
  { id: 5, color: '#0891B2', bg: '#ECFEFF', border: '#A5F3FC' },
  { id: 6, color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8' },
  { id: 7, color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
  { id: 8, color: '#F97316', bg: '#FFF7ED', border: '#FB923C' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function computeStats(progressMap, grade) {
  const topics = curriculum[grade] || []
  let totalLessons = 0
  let totalDone    = 0

  const topicsWithProgress = topics.map(topic => {
    const doneLessons = topic.lessons.filter(l => progressMap[l.id]?.completed).length
    const total       = topic.lessons.length
    totalLessons += total
    totalDone    += doneLessons
    const pct = total > 0 ? Math.round((doneLessons / total) * 100) : 0
    const meta = topicMeta.find(m => m.id === topic.id) || topicMeta[0]
    return { ...topic, ...meta, done: doneLessons, total, progress: pct }
  })

  const overall = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0
  return { topicsWithProgress, overall, totalDone }
}

function computeBadges(progressMap, profile) {
  const allRows   = Object.values(progressMap)
  const completed = allRows.filter(r => r?.completed).length
  const hasHundred = allRows.some(r => r?.score !== null && r?.score !== undefined &&
    r?.score >= (curriculum[4].flatMap(t => t.lessons).find(l => String(l.id) === String(r.lesson_ref))?.quiz?.length ?? 1) * 1)

  const earned = []

  if (completed >= 5)
    earned.push({ icon: '⭐', name: 'Quick Learner', color: '#F97316', bg: '#FFF7ED' })
  if ((profile?.streak_days ?? 0) >= 5)
    earned.push({ icon: '🔥', name: 'On Fire',       color: '#EF4444', bg: '#FEF2F2' })

  // Accurate: scored full marks on any lesson
  const perfectLesson = allRows.find(r => {
    if (!r?.completed || r?.score == null) return false
    const lessonId = Number(r.lesson_ref ?? r.lesson_id)
    const lesson = [...(curriculum[4] ?? []), ...(curriculum[5] ?? [])]
      .flatMap(t => t.lessons)
      .find(l => l.id === lessonId)
    return lesson && r.score >= lesson.questions
  })
  if (perfectLesson)
    earned.push({ icon: '🎯', name: 'Accurate', color: '#F97316', bg: '#FFF7ED' })

  return earned
}

export default function KidDashboard() {
  const navigate          = useNavigate()
  const { user, profile } = useAuth()
  const [grade, setGrade] = useState(null)
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)

  const activeGrade = grade ?? profile?.grade ?? 4

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(map => setProgressMap(map))
      .catch(err => console.error('[Dashboard]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  // Re-sync when a quiz is finished
  useEffect(() => {
    function onUpdate() {
      if (user?.id) getProgressMap(user.id).then(setProgressMap)
    }
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [user?.id])

  const { topicsWithProgress, overall, totalDone } = computeStats(progressMap, activeGrade)
  const badges   = computeBadges(progressMap, profile)
  const name     = profile?.name || 'there'

  return (
    <KidLayout>

      {/* Welcome banner */}
      <div
        className="rounded-3xl p-5 sm:p-6 mb-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#F97316,#FB923C)', boxShadow: '0 4px 20px rgba(249,115,22,.30)' }}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
            {greeting()}, {name}! 👋
          </h1>
          <p className="text-orange-100 text-sm font-semibold">
            {loading
              ? 'Loading your progress…'
              : overall > 0
                ? `You're ${overall}% through Grade ${activeGrade} — keep going!`
                : `Let's start Grade ${activeGrade}!`}
          </p>
        </div>
        <span className="text-5xl sm:text-6xl select-none">{profile?.avatar ?? '🧒'}</span>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border-2 p-5 mb-6 shadow-sm" style={{ borderColor: '#FB923C' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-extrabold text-gray-700">
            Grade {activeGrade} overall progress
          </span>
          <span className="text-sm font-extrabold" style={{ color: '#F97316' }}>
            {loading ? '…' : `${overall}%`}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#FFF7ED' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${overall}%`, background: 'linear-gradient(90deg,#F97316,#4ADE80)' }}
          />
        </div>
        <div className="flex gap-2 mt-3">
          {[4, 5].map(g => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className="px-3 py-1 rounded-lg text-xs font-extrabold transition-colors"
              style={
                activeGrade === g
                  ? { backgroundColor: '#F97316', color: '#fff' }
                  : { backgroundColor: '#F3F4F6', color: '#6B7280' }
              }
            >
              Grade {g}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 font-semibold self-center">
            {loading ? '' : `${totalDone} lessons done`}
          </span>
        </div>
      </div>

      {/* Topic grid */}
      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">
        Pick a topic to practice
      </p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {topicsWithProgress.map(topic => (
            <button
              key={topic.id}
              onClick={() => navigate(`/kid/lessons`)}
              className="bg-white rounded-2xl p-4 sm:p-5 text-left border-2 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              style={{ borderColor: topic.progress > 0 ? topic.border : '#E5E7EB' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                style={{ backgroundColor: topic.bg }}
              >
                {topic.icon}
              </div>
              <div className="text-sm font-extrabold text-gray-800 mb-1">{topic.name}</div>
              <div className="text-xs text-gray-400 font-semibold mb-2">
                {topic.done} / {topic.total} done
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: topic.bg }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${topic.progress}%`, backgroundColor: topic.color }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Badges */}
      <div className="bg-white rounded-2xl border-2 p-5 shadow-sm" style={{ borderColor: '#FB923C' }}>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">My Badges</p>
        {badges.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">
            Complete lessons to earn badges! 🏅
          </p>
        ) : (
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
        )}
      </div>

    </KidLayout>
  )
}
