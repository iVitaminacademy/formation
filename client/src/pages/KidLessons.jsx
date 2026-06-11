import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { curriculum } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'

function StatusBadge({ status }) {
  if (status === 'done')
    return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1E3A5F' }}>✓ Terminé</span>
  if (status === 'start')
    return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}>▶ Commencer</span>
  return <span className="text-lg">🔒</span>
}

function TopicPanel({ topic, onStart }) {
  const done  = topic.lessons.filter(l => l.status === 'done').length
  const total = topic.lessons.length

  return (
    <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: topic.border }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: topic.bg }}>
        <div className="flex items-center gap-2 font-extrabold" style={{ color: topic.color }}>
          <span className="text-xl">{topic.icon}</span>
          <span>{topic.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-white/60 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${total > 0 ? (done/total)*100 : 0}%`, backgroundColor: topic.color }} />
          </div>
          <span className="text-xs font-bold text-gray-500">{done}/{total}</span>
        </div>
      </div>

      {/* Lessons */}
      <div className="px-3 py-2">
        {topic.lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            className={`flex items-center justify-between px-3 py-3 rounded-xl mb-1 transition-colors ${lesson.status === 'locked' ? 'opacity-45' : 'cursor-pointer'}`}
            onClick={() => lesson.status !== 'locked' && onStart(lesson)}
            onMouseEnter={e => { if (lesson.status !== 'locked') e.currentTarget.style.backgroundColor = topic.bg }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            title={lesson.status === 'locked' ? 'Complétez la leçon précédente pour déverrouiller' : ''}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 text-white"
                style={{ backgroundColor: lesson.status === 'done' ? '#1E3A5F' : lesson.status === 'start' ? topic.color : '#D1D5DB' }}
              >
                {lesson.status === 'done' ? '✓' : idx + 1}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">{lesson.title}</div>
                <div className="text-xs text-gray-400 font-medium">{lesson.questions} questions · ~{lesson.time} min</div>
              </div>
            </div>
            <StatusBadge status={lesson.status} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function KidLessons() {
  const navigate     = useNavigate()
  const topics       = curriculum[1] || []
  const { user }     = useAuth()
  const [progressMap, setProgressMap] = useState({})
  const [roundStart, setRoundStart]   = useState(0)
  const [justReset, setJustReset]     = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.id) { setProgressMap({}); return }
      try {
        const map = await getProgressMap(user.id)
        if (!mounted) return
        try {
          const localKey  = `local_progress:${user.id}`
          const localJson = localStorage.getItem(localKey)
          if (localJson) {
            const localMap = JSON.parse(localJson)
            for (const k of Object.keys(localMap)) {
              const num = Number(k)
              if (!Number.isNaN(num)) map[num] = { ...map[num], ...localMap[k] }
            }
          }
        } catch { /* ignore */ }
        setProgressMap(map)
      } catch (err) {
        console.error('Failed to load progress map', err.message)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  useEffect(() => {
    function onProgressUpdated(e) {
      const detail   = e?.detail || {}
      const lessonId = typeof detail.lessonId === 'string' ? Number(detail.lessonId) : detail.lessonId
      const row      = detail.row
      if (!lessonId) return
      setProgressMap(prev => ({ ...prev, [lessonId]: row }))
    }
    window.addEventListener('progressUpdated', onProgressUpdated)
    return () => window.removeEventListener('progressUpdated', onProgressUpdated)
  }, [])

  useEffect(() => {
    setJustReset(false)
    if (!user?.id) { setRoundStart(0); return }
    const stored = localStorage.getItem(`practiceRound:${user.id}:1`)
    setRoundStart(stored ? new Date(stored).getTime() : 0)
  }, [user?.id])

  const doneThisRound = (lesson) => {
    const r = progressMap[lesson.id]
    if (!r?.completed) return false
    if (!roundStart) return true
    return r.last_date ? new Date(r.last_date).getTime() >= roundStart : false
  }

  const allLessons = topics.flatMap(t => t.lessons)
  const allDone    = allLessons.length > 0 && allLessons.every(doneThisRound)

  useEffect(() => {
    if (!user?.id || !allDone) return
    const now = new Date().toISOString()
    localStorage.setItem(`practiceRound:${user.id}:1`, now)
    setRoundStart(new Date(now).getTime())
    setJustReset(true)
  }, [allDone, user?.id])

  return (
    <KidLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">💉 Protocoles</h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">Cliquez sur une leçon pour lire le contenu puis passer le QCM</p>
        </div>
      </div>

      {justReset && (
        <div className="mb-5 rounded-2xl p-4 text-center" style={{ backgroundColor: '#EFF6FF', border: '2px solid #93C5FD' }}>
          <p className="text-lg font-extrabold" style={{ color: '#1E3A5F' }}>🎉 Félicitations ! Vous avez terminé toutes les leçons !</p>
          <p className="text-sm font-semibold text-blue-700 mt-1">Toutes les leçons sont réinitialisées pour que vous puissiez pratiquer à nouveau. 🚀</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map(topic => {
          const lessonsWithStatus = topic.lessons.map((lesson, idx) => {
            const isDone   = doneThisRound(lesson)
            const prevDone = idx === 0 || doneThisRound(topic.lessons[idx - 1])
            return {
              ...lesson,
              status: isDone ? 'done' : prevDone ? 'start' : 'locked',
            }
          })
          return (
            <TopicPanel
              key={topic.id}
              topic={{ ...topic, lessons: lessonsWithStatus }}
              onStart={lesson => navigate(`/medecin/lesson/${lesson.id}`)}
            />
          )
        })}
      </div>
    </KidLayout>
  )
}
