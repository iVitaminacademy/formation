import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { curriculum } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'

function StatusBadge({ status }) {
  if (status === 'done')
    return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>✓ Done</span>
  if (status === 'start')
    return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>▶ Start</span>
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
            title={lesson.status === 'locked' ? 'Complete the previous lesson first' : ''}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 text-white"
                style={{ backgroundColor: lesson.status === 'done' ? '#F97316' : lesson.status === 'start' ? topic.color : '#D1D5DB' }}
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
  const [grade, setGrade] = useState(4)
  const topics       = curriculum[grade] || []
  const { user }     = useAuth()
  const [progressMap, setProgressMap] = useState({})
  const [roundStart, setRoundStart]   = useState(0)
  const [justReset, setJustReset]     = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.id) {
        setProgressMap({})
        return
      }
      try {
        const map = await getProgressMap(user.id)
        if (!mounted) return
        console.log('[KidLessons] loaded progress map', map)
        // Merge any locally-saved demo progress (localStorage) so demo lessons show completed
        try {
          const localKey = `local_progress:${user.id}`
          const localJson = localStorage.getItem(localKey)
          if (localJson) {
            const localMap = JSON.parse(localJson)
            for (const k of Object.keys(localMap)) {
              const num = Number(k)
              if (!Number.isNaN(num)) map[num] = { ...map[num], ...localMap[k] }
            }
          }
        } catch (e) {
          console.warn('[KidLessons] failed to merge local progress', e)
        }
        setProgressMap(map)
      } catch (err) {
        console.error('Failed to load progress map', err.message)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  // Listen for saved progress events so the lessons UI updates immediately
  useEffect(() => {
    function onProgressUpdated(e) {
      const detail = e?.detail || {}
      const lessonId = typeof detail.lessonId === 'string' ? Number(detail.lessonId) : detail.lessonId
      const row = detail.row
      if (!lessonId) return
      setProgressMap(prev => ({ ...prev, [lessonId]: row }))
    }
    window.addEventListener('progressUpdated', onProgressUpdated)
    return () => window.removeEventListener('progressUpdated', onProgressUpdated)
  }, [])

  // Load the current practice-round start time for this kid + grade
  useEffect(() => {
    setJustReset(false)
    if (!user?.id) { setRoundStart(0); return }
    const stored = localStorage.getItem(`practiceRound:${user.id}:${grade}`)
    setRoundStart(stored ? new Date(stored).getTime() : 0)
  }, [user?.id, grade])

  // A lesson counts as done only if it was completed during the current round
  const doneThisRound = (lesson) => {
    const r = progressMap[lesson.id]
    if (!r?.completed) return false
    if (!roundStart) return true
    return r.last_date ? new Date(r.last_date).getTime() >= roundStart : false
  }

  const allLessons = topics.flatMap(t => t.lessons)
  const allDone    = allLessons.length > 0 && allLessons.every(doneThisRound)

  // When every lesson in the grade is finished, start a fresh round (re-locks all)
  useEffect(() => {
    if (!user?.id || !allDone) return
    const now = new Date().toISOString()
    localStorage.setItem(`practiceRound:${user.id}:${grade}`, now)
    setRoundStart(new Date(now).getTime())
    setJustReset(true)
  }, [allDone, user?.id, grade])

  return (
    <KidLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">📚 Lessons</h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">Click any lesson to start the quiz</p>
        </div>
        <div className="flex gap-2">
          {[4, 5].map(g => (
            <button
              key={g}
              onClick={() => setGrade(g)}
              className="px-5 py-2 rounded-xl text-sm font-extrabold border-2 transition-all duration-150"
              style={
                grade === g
                  ? { backgroundColor: '#F97316', color: '#fff', borderColor: '#F97316' }
                  : { backgroundColor: '#fff', color: '#F97316', borderColor: '#FB923C' }
              }
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      {justReset && (
        <div className="mb-5 rounded-2xl p-4 text-center" style={{ backgroundColor: '#FFF7ED', border: '2px solid #FB923C' }}>
          <p className="text-lg font-extrabold" style={{ color: '#F97316' }}>🎉 Awesome! You finished every lesson!</p>
          <p className="text-sm font-semibold text-green-700 mt-1">All lessons are locked again so you can practice from the beginning. Let's go! 🚀</p>
        </div>
      )}

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🚀</span>
          <p className="font-bold text-lg">Grade 5 content coming soon!</p>
          <p className="text-sm mt-1">Complete Grade 4 to unlock.</p>
        </div>
      ) : (
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
                onStart={lesson => navigate(`/kid/quiz/${lesson.id}`)}
              />
            )
          })}
        </div>
      )}
    </KidLayout>
  )
}
