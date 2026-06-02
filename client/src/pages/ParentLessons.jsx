import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { getChildren } from '../services/family'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

function LessonRow({ lesson, index, topicColor, done, onOpen }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0"
          style={{ backgroundColor: done ? '#2D7A4F' : topicColor }}
        >
          {done ? '✓' : index}
        </div>
        <div>
          <div className="text-sm font-bold text-gray-800">{lesson.title}</div>
          <div className="text-xs text-gray-400 font-medium mt-0.5">
            {lesson.questions} questions · ~{lesson.time} min
          </div>
        </div>
      </div>
      <button
        onClick={() => onOpen(lesson)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold text-white opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: '#2D7A4F' }}
      >
        📖 Teaching Guide
      </button>
    </div>
  )
}

function TopicPanel({ topic, progressMap, onOpen }) {
  const lessons = topic.lessons || []
  const done    = lessons.filter(l => progressMap[l.id]?.completed).length
  const total   = lessons.length
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0
  const color   = topic.color || '#2D7A4F'
  const bg      = topic.bg || '#F0FAF4'

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#C8E6D4' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{topic.icon}</span>
          <span className="font-extrabold text-gray-800">{topic.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-semibold">{done}/{total}</span>
          <div className="w-24 h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs font-extrabold" style={{ color }}>{pct}%</span>
        </div>
      </div>

      {/* Lessons */}
      <div className="px-2 py-2">
        {lessons.map((lesson, i) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            index={i + 1}
            topicColor={color}
            done={!!progressMap[lesson.id]?.completed}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  )
}

export default function ParentLessons() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [progressMap, setProgressMap]     = useState({})
  const [grade, setGrade]                 = useState(null)
  const [loading, setLoading]             = useState(true)

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null
  const activeGrade = grade ?? activeChild?.grade ?? 4
  const topics      = curriculum[activeGrade] || []

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getChildren(user.id)
      .then(kids => {
        setChildren(kids)
        setActiveChildId(prev => (prev && kids.some(k => k.id === prev)) ? prev : (kids[0]?.id ?? null))
      })
      .catch(err => console.error('[ParentLessons] children', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    if (!activeChild?.id) { setProgressMap({}); return }
    getProgressMap(activeChild.id)
      .then(setProgressMap)
      .catch(err => console.error('[ParentLessons] progress', err))
  }, [activeChild?.id])

  const handleOpen = (lesson) => {
    navigate(`/parent/teaching-guide/${lesson.id}`)
  }

  return (
    <ParentLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Lessons &amp; Guides</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {activeChild
              ? `Showing ${activeChild.name}'s progress · hover a lesson for its Teaching Guide`
              : 'Hover any lesson to open its step-by-step Teaching Guide'}
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
              {children.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          {[4, 5].map(g => {
            const active = activeGrade === g
            return (
              <button
                key={g}
                onClick={() => setGrade(g)}
                className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
                style={active
                  ? { borderColor: '#2D7A4F', color: '#2D7A4F', backgroundColor: '#F0FAF4' }
                  : { borderColor: '#C8E6D4', color: '#6B7280', backgroundColor: '#fff' }}
              >
                Grade {g}
              </button>
            )
          })}
        </div>
      </div>

      {!activeChild && !loading && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FFF7ED', color: '#9A6700' }}>
          No child linked yet — link one on your Profile to see completion. Showing lesson content only.
        </div>
      )}

      {/* Topic grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : topics.length === 0 ? (
        <p className="text-sm text-gray-400 font-medium">No lessons available for Grade {activeGrade} yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map(topic => (
            <TopicPanel key={topic.id} topic={topic} progressMap={progressMap} onOpen={handleOpen} />
          ))}
        </div>
      )}
    </ParentLayout>
  )
}
