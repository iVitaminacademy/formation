import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { getChildren } from '../services/family'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

function relativeDate(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diff <= 0) return 'aujourd\'hui'
  if (diff === 1) return 'hier'
  return `il y a ${diff} jours`
}

function lastActiveLabel(progressMap) {
  const dates = Object.values(progressMap).map(r => r?.last_date).filter(Boolean)
  if (!dates.length) return 'jamais'
  const latest = dates.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
  return relativeDate(latest)
}

function computeDashboard(progressMap) {
  const topicsData = curriculum[1] || []
  let totalLessons = 0, lessonsCompleted = 0
  const topics = topicsData.map(t => {
    const lessons = t.lessons || []
    let done = 0, quizzes = 0
    lessons.forEach(l => {
      const r = progressMap[l.id]
      if (r?.completed) done++
      if (r?.completed && r.score != null) quizzes++
    })
    totalLessons     += lessons.length
    lessonsCompleted += done
    const totalL   = lessons.length
    const progress = totalL > 0 ? Math.round((done / totalL) * 100) : 0
    return { id: t.id, name: t.name, icon: t.icon, color: t.color, bg: t.bg, border: t.border, progress, lessons: done, totalLessons: totalL, quizzes }
  })
  const overall = totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0
  return { topics, overall, lessonsCompleted, totalLessons }
}

function progressColor(pct) {
  if (pct >= 50) return '#1E3A5F'
  if (pct >= 20) return '#1D4ED8'
  return '#EF4444'
}

function StatCard({ value, label, color, icon }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border p-5 text-center shadow-sm" style={{ borderColor: '#BFDBFE' }}>
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
      className="w-full flex items-center gap-3 py-3 px-2 rounded-xl transition-colors text-left group"
      onClick={() => onGuideClick(topic)}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = topic.bg ?? '#EFF6FF')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
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
          {topic.lessons}/{topic.totalLessons} leçons · {topic.quizzes} quiz complété{topic.quizzes > 1 ? 's' : ''}
        </div>
      </div>
      <span className="text-gray-200 group-hover:text-blue-400 transition-colors text-sm">›</span>
    </button>
  )
}

export default function ParentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [progressMap, setProgressMap]     = useState({})
  const [loading, setLoading]             = useState(true)

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getChildren(user.id)
      .then(kids => {
        setChildren(kids)
        setActiveChildId(prev => (prev && kids.some(k => k.id === prev)) ? prev : (kids[0]?.id ?? null))
      })
      .catch(err => console.error('[ParentDashboard] children', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    if (!activeChild?.id) { setProgressMap({}); return }
    getProgressMap(activeChild.id)
      .then(setProgressMap)
      .catch(err => console.error('[ParentDashboard] progress', err))
  }, [activeChild?.id])

  const { topics, overall, lessonsCompleted } = computeDashboard(progressMap)
  const weakTopics = topics.filter(t => t.totalLessons > 0 && t.progress < 40)
  const weakest    = [...topics].filter(t => t.totalLessons > 0).sort((a, b) => a.progress - b.progress)[0] || null
  const streak     = activeChild?.streak_days ?? 0
  const name       = activeChild?.name || 'Votre médecin'
  const firstName  = name.split(' ')[0]
  const avatar     = activeChild?.avatar || '👨‍⚕️'
  const lastActive = lastActiveLabel(progressMap)

  if (!loading && !activeChild) {
    return (
      <ParentLayout>
        <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1a1a2e' }}>Tableau de bord superviseur</h1>
        <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}>
          Aucun médecin lié — allez dans votre Profil et liez un médecin avec son code pour voir son tableau de bord.
        </div>
      </ParentLayout>
    )
  }

  return (
    <ParentLayout>
      {/* Title + child selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold" style={{ color: '#1a1a2e' }}>
          Rapport de {name}
        </h1>
        {children.length > 1 && (
          <select
            value={activeChild?.id ?? ''}
            onChange={e => setActiveChildId(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-bold border-2 bg-white"
            style={{ borderColor: '#BFDBFE', color: '#1E3A5F' }}
          >
            {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard value={`${overall}%`}     label="Progression globale" color="#1E3A5F" />
        <StatCard value={lessonsCompleted}   label="Leçons terminées"    color="#1a1a2e" />
        <StatCard value={streak}             label="Jours consécutifs"   color="#1D4ED8" icon="🎯" />
        <StatCard value={weakTopics.length}  label="Modules à renforcer" color="#EF4444" />
      </div>

      {/* Two-column grid */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Module Breakdown */}
        <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#BFDBFE' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Modules — Formation IV</h2>
          {topics.length === 0 ? (
            <p className="text-sm text-gray-400 font-medium">Aucune leçon disponible.</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {topics.map(topic => (
                <TopicRow
                  key={topic.id}
                  topic={topic}
                  onGuideClick={() => navigate('/parent/lessons')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-full lg:w-72 flex flex-col gap-4">

          {/* Médecin card */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm flex items-center gap-4" style={{ borderColor: '#BFDBFE' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#EFF6FF' }}>
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-gray-800 truncate">{name}</div>
              <div className="text-xs text-gray-400 font-semibold">
                Actif {lastActive}
              </div>
            </div>
            <button onClick={() => navigate('/parent/profile')} className="text-gray-300">›</button>
          </div>

          {/* Suggestion */}
          {weakest && (
            <div className="bg-white rounded-2xl border p-5 shadow-sm flex flex-col gap-3" style={{ borderColor: '#BFDBFE' }}>
              <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Suggestion superviseur</div>
              <div
                className="rounded-xl p-4 text-sm leading-relaxed"
                style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #1E3A5F' }}
              >
                <div className="font-bold mb-1" style={{ color: '#1E3A5F' }}>
                  💡 Accompagnez {firstName} sur {weakest.name}
                </div>
                <div className="text-gray-600 text-xs leading-relaxed">
                  {firstName} est à seulement {weakest.progress}% sur le module {weakest.name}.
                  Consultez le corrigé pour revoir les questions ensemble.
                </div>
              </div>
              <button
                className="w-full py-3 rounded-xl text-white font-extrabold text-sm transition-all duration-200"
                style={{ backgroundColor: '#1E3A5F', boxShadow: '0 4px 12px rgba(30,58,95,0.3)' }}
                onClick={() => navigate('/parent/lessons')}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
              >
                Ouvrir le guide →
              </button>
            </div>
          )}

        </div>
      </div>
    </ParentLayout>
  )
}
