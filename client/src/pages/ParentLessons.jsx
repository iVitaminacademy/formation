import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'

const topics = [
  {
    id: 1, name: 'Multiplication', icon: '✖️', color: '#6B3FA0', bg: '#F3ECFF',
    lessons: [
      { id: 1, title: 'Times tables 1–5',    questions: 8,  time: 5,  done: true  },
      { id: 2, title: 'Times tables 6–10',   questions: 10, time: 6,  done: true  },
      { id: 3, title: 'Multiply by 2 digits', questions: 12, time: 8,  done: false },
      { id: 4, title: 'Word problems',        questions: 10, time: 7,  done: false },
    ],
  },
  {
    id: 2, name: 'Division', icon: '➗', color: '#0369A1', bg: '#E0F2FE',
    lessons: [
      { id: 5, title: 'Basic division facts',  questions: 10, time: 5, done: true  },
      { id: 6, title: 'Long division intro',   questions: 8,  time: 7, done: false },
      { id: 7, title: 'Remainders',            questions: 9,  time: 7, done: false },
    ],
  },
  {
    id: 3, name: 'Fractions', icon: '½', color: '#B45309', bg: '#FEF3C7',
    lessons: [
      { id: 8,  title: 'What is a fraction?', questions: 8,  time: 5, done: false },
      { id: 9,  title: 'Adding fractions',    questions: 10, time: 6, done: false },
    ],
  },
  {
    id: 4, name: 'Geometry', icon: '📐', color: '#047857', bg: '#D1FAE5',
    lessons: [
      { id: 10, title: 'Shapes & properties', questions: 9,  time: 6, done: true  },
      { id: 11, title: 'Perimeter',           questions: 8,  time: 6, done: true  },
      { id: 12, title: 'Area',                questions: 10, time: 7, done: false },
    ],
  },
]

function LessonRow({ lesson, topicColor, onOpen }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0"
          style={{ backgroundColor: lesson.done ? '#2D7A4F' : topicColor }}
        >
          {lesson.done ? '✓' : lesson.id}
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

function TopicPanel({ topic, onOpen }) {
  const done  = topic.lessons.filter(l => l.done).length
  const total = topic.lessons.length
  const pct   = Math.round((done / total) * 100)

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#C8E6D4' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: topic.bg }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{topic.icon}</span>
          <span className="font-extrabold text-gray-800">{topic.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-24 h-2 rounded-full bg-white/60 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, backgroundColor: topic.color }}
            />
          </div>
          <span className="text-xs font-extrabold" style={{ color: topic.color }}>{pct}%</span>
        </div>
      </div>

      {/* Lessons */}
      <div className="px-2 py-2">
        {topic.lessons.map(lesson => (
          <LessonRow key={lesson.id} lesson={lesson} topicColor={topic.color} onOpen={onOpen} />
        ))}
      </div>
    </div>
  )
}

export default function ParentLessons() {
  const navigate = useNavigate()

  const handleOpen = (lesson) => {
    navigate(`/parent/teaching-guide/${lesson.id}`)
  }

  return (
    <ParentLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Lessons &amp; Guides</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Hover any lesson to open its step-by-step Teaching Guide
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
            style={{ borderColor: '#2D7A4F', color: '#2D7A4F', backgroundColor: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FAF4')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            Grade 4
          </button>
          <button
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
            style={{ borderColor: '#C8E6D4', color: '#6B7280', backgroundColor: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FAF4')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff')}
          >
            Grade 5
          </button>
        </div>
      </div>

      {/* Topic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {topics.map(topic => (
          <TopicPanel key={topic.id} topic={topic} onOpen={handleOpen} />
        ))}
      </div>
    </ParentLayout>
  )
}
