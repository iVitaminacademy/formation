import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'

const curriculum = {
  4: [
    {
      id: 1, name: 'Multiplication', icon: '✖️', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA',
      lessons: [
        { id: 1, title: 'Times tables 1–5',     questions: 8,  time: 5, status: 'done'   },
        { id: 2, title: 'Times tables 6–10',    questions: 10, time: 6, status: 'done'   },
        { id: 3, title: 'Multiply by 2 digits', questions: 12, time: 8, status: 'start'  },
        { id: 4, title: 'Word problems',        questions: 10, time: 7, status: 'locked' },
      ],
    },
    {
      id: 2, name: 'Division', icon: '➗', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE',
      lessons: [
        { id: 5, title: 'Basic division facts',  questions: 10, time: 5, status: 'done'   },
        { id: 6, title: 'Long division intro',   questions: 8,  time: 7, status: 'start'  },
        { id: 7, title: 'Remainders',            questions: 9,  time: 7, status: 'locked' },
      ],
    },
    {
      id: 3, name: 'Fractions', icon: '½', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8',
      lessons: [
        { id: 8, title: 'What is a fraction?', questions: 8,  time: 5, status: 'start'  },
        { id: 9, title: 'Adding fractions',    questions: 10, time: 6, status: 'locked' },
      ],
    },
    {
      id: 4, name: 'Geometry', icon: '📐', color: '#A855F7', bg: '#FAF5FF', border: '#E9D5FF',
      lessons: [
        { id: 10, title: 'Shapes & properties', questions: 9,  time: 6, status: 'done'  },
        { id: 11, title: 'Perimeter',           questions: 8,  time: 6, status: 'done'  },
        { id: 12, title: 'Area',                questions: 10, time: 7, status: 'start' },
      ],
    },
  ],
  5: [],
}

function StatusBadge({ status }) {
  if (status === 'done')  return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>✓ Done</span>
  if (status === 'start') return <span className="text-xs font-extrabold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}>▶ Start</span>
  return <span className="text-lg">🔒</span>
}

function TopicPanel({ topic, onStart }) {
  const done  = topic.lessons.filter(l => l.status === 'done').length
  const total = topic.lessons.length

  return (
    <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: topic.border }}>
      <div className="flex items-center justify-between px-5 py-3.5" style={{ backgroundColor: topic.bg }}>
        <div className="flex items-center gap-2 font-extrabold" style={{ color: topic.color }}>
          <span>{topic.icon}</span>
          <span>{topic.name}</span>
        </div>
        <span className="text-xs font-bold text-gray-500">{done}/{total} done</span>
      </div>

      <div className="px-3 py-2">
        {topic.lessons.map(lesson => (
          <div
            key={lesson.id}
            className={`flex items-center justify-between px-3 py-3 rounded-xl mb-1 transition-colors ${lesson.status === 'locked' ? 'opacity-50' : 'cursor-pointer'}`}
            style={{ ':hover': { backgroundColor: topic.bg } }}
            onClick={() => lesson.status !== 'locked' && onStart(lesson)}
            onMouseEnter={e => { if (lesson.status !== 'locked') e.currentTarget.style.backgroundColor = topic.bg }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            title={lesson.status === 'locked' ? 'Complete the previous lesson first' : ''}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
                style={{
                  backgroundColor: lesson.status === 'done' ? '#16A34A' : lesson.status === 'start' ? topic.color : '#D1D5DB',
                  color: '#fff',
                }}
              >
                {lesson.status === 'done' ? '✓' : lesson.id}
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
  const navigate = useNavigate()
  const [grade, setGrade] = useState(4)
  const topics = curriculum[grade]

  return (
    <KidLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">📚 Lessons</h1>
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
          {topics.map(topic => (
            <TopicPanel
              key={topic.id}
              topic={topic}
              onStart={lesson => navigate(`/kid/quiz/${lesson.id}`)}
            />
          ))}
        </div>
      )}
    </KidLayout>
  )
}
