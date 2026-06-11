import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 17) return 'Bon après-midi'
  return 'Bonsoir'
}

function computeStats(progressMap) {
  const topics = curriculum[1] || []
  let totalLessons = 0
  let totalDone    = 0

  const topicsWithProgress = topics.map(topic => {
    const doneLessons = topic.lessons.filter(l => progressMap[l.id]?.completed).length
    const total       = topic.lessons.length
    totalLessons += total
    totalDone    += doneLessons
    const pct = total > 0 ? Math.round((doneLessons / total) * 100) : 0
    return { ...topic, done: doneLessons, total, progress: pct }
  })

  const overall = totalLessons > 0 ? Math.round((totalDone / totalLessons) * 100) : 0
  return { topicsWithProgress, overall, totalDone }
}

function computeBadges(progressMap, profile) {
  const allRows   = Object.values(progressMap)
  const completed = allRows.filter(r => r?.completed).length

  const allLessons = (curriculum[1] || []).flatMap(t => t.lessons)
  const perfectLesson = allLessons.some(l => {
    const r = progressMap[l.id]
    return r?.completed && r?.score != null && r.score >= l.questions
  })

  const earned = []
  if (completed >= 5)
    earned.push({ icon: '⭐', name: 'Apprenant rapide', color: '#1E3A5F', bg: '#EFF6FF' })
  if ((profile?.streak_days ?? 0) >= 5)
    earned.push({ icon: '🔥', name: 'En feu',           color: '#EF4444', bg: '#FEF2F2' })
  if (perfectLesson)
    earned.push({ icon: '🎯', name: 'Précis',           color: '#065F46', bg: '#ECFDF5' })

  return earned
}

export default function KidDashboard() {
  const navigate          = useNavigate()
  const { user, profile } = useAuth()
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(map => setProgressMap(map))
      .catch(err => console.error('[Dashboard]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    function onUpdate() {
      if (user?.id) getProgressMap(user.id).then(setProgressMap)
    }
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [user?.id])

  const { topicsWithProgress, overall, totalDone } = computeStats(progressMap)
  const badges = computeBadges(progressMap, profile)
  const name   = profile?.name || 'Docteur'

  return (
    <KidLayout>

      {/* Welcome banner */}
      <div
        className="rounded-3xl p-5 sm:p-6 mb-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg,#1E3A5F,#1D4ED8)', boxShadow: '0 4px 20px rgba(30,58,95,.35)' }}
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">
            {greeting()}, {name} ! 👋
          </h1>
          <p className="text-blue-200 text-sm font-semibold">
            {loading
              ? 'Chargement de votre progression…'
              : overall > 0
                ? `Vous avez complété ${overall}% de la formation — continuez !`
                : 'Commencez votre formation en perfectusion IV !'}
          </p>
        </div>
        <span className="text-5xl sm:text-6xl select-none">{profile?.avatar ?? '👨‍⚕️'}</span>
      </div>

      {/* Overall progress bar */}
      <div className="bg-white rounded-2xl border-2 p-5 mb-6 shadow-sm" style={{ borderColor: '#93C5FD' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-extrabold text-gray-700">
            Progression globale — Formation IV
          </span>
          <span className="text-sm font-extrabold" style={{ color: '#1E3A5F' }}>
            {loading ? '…' : `${overall}%`}
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EFF6FF' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${overall}%`, background: 'linear-gradient(90deg,#1E3A5F,#1D4ED8)' }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-400 font-semibold">
            {loading ? '' : `${totalDone} leçons terminées`}
          </span>
        </div>
      </div>

      {/* Topic grid */}
      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">
        Choisir un module
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
              onClick={() => navigate('/medecin/lessons')}
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
                {topic.done} / {topic.total} terminé{topic.done > 1 ? 'es' : 'e'}
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
      <div className="bg-white rounded-2xl border-2 p-5 shadow-sm" style={{ borderColor: '#93C5FD' }}>
        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Mes badges</p>
        {badges.length === 0 ? (
          <p className="text-sm text-gray-400 font-medium">
            Complétez des leçons pour débloquer des badges ! 🏅
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
