import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { curriculum } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'

function StatusBadge({ status }) {
  if (status === 'done')
    return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>✓ Done</span>
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
                style={{ backgroundColor: lesson.status === 'done' ? '#16A34A' : lesson.status === 'start' ? topic.color : '#D1D5DB' }}
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
        setProgressMap(map)
      } catch (err) {
        console.error('Failed to load progress map', err.message)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

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
                  ? { backgroundColor: '#16A34A', color: '#fff', borderColor: '#16A34A' }
                  : { backgroundColor: '#fff', color: '#16A34A', borderColor: '#86EFAC' }
              }
            >
              Grade {g}
            </button>
          ))}
        </div>
      </div>

      {topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <span className="text-5xl mb-4">🚀</span>
          <p className="font-bold text-lg">Grade 5 content coming soon!</p>
          <p className="text-sm mt-1">Complete Grade 4 to unlock.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map(topic => {
              const topicCopy = {
                ...topic,
                lessons: topic.lessons.map(l => ({
                  ...l,
                  status: progressMap[l.id] && progressMap[l.id].completed ? 'done' : 'start',
                })),
              }
              return (
                <TopicPanel
                  key={topic.id}
                  topic={topicCopy}
                  onStart={lesson => navigate(`/kid/quiz/${lesson.id}`)}
                />
              )
            })}
        </div>
      )}
    </KidLayout>
  )
}
