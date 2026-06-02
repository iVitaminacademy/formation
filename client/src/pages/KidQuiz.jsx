import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import lessonsContent from '../content/lessonsContent'
import { useAuth } from '../context/AuthContext'
import { saveProgress } from '../services/progress'
import { getQuizByLessonId } from '../data/curriculum'

const defaultQuiz = {
  lessonTitle: 'Sample Quiz',
  topicName: 'Math',
  topicColor: '#6366F1',
  questions: [
    { text: 'What is 7 × 8?', options: ['48', '56', '54', '63'], correct: '56', hint: 'Count by 8s seven times.', explanation: '7 × 8 = 56.' },
  ],
}

function ScorePage({ score, total, onRetry, onBack }) {
  const pct   = Math.round((score / total) * 100)
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1
  const msg   = pct >= 90 ? 'Amazing work! 🎉' : pct >= 70 ? 'Great job! 👏' : 'Keep practising! 💪'

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{msg}</h2>
      <p className="text-gray-500 font-semibold mb-2">You scored</p>
      <div
        className="text-6xl font-extrabold mb-2"
        style={{ color: pct >= 70 ? '#16A34A' : '#EF4444' }}
      >
        {score}/{total}
      </div>
      <p className="text-gray-400 font-semibold mb-10">{pct}% correct</p>
      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: '#16A34A' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803D')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#16A34A')}
        >
          Try again
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-2xl font-extrabold border-2 transition-colors"
          style={{ borderColor: '#86EFAC', color: '#16A34A' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Back to Lessons
        </button>
      </div>
    </div>
  )
}

export default function KidQuiz() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const key       = Number(id)
  const { user }  = useAuth()
  const quizData  = lessonsContent[key] || getQuizByLessonId(key) || defaultQuiz
  const questions = quizData.questions

  const [current,   setCurrent]   = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [showHint,  setShowHint]  = useState(false)
  const [answered,  setAnswered]  = useState({})
  const [quizDone,  setQuizDone]  = useState(false)

  const q          = questions[current]
  const isAnswered = selected !== null
  const isCorrect  = selected === q.correct
  const score      = Object.values(answered).filter(a => a.correct).length

  function handleSelect(opt) {
    if (isAnswered) return
    setSelected(opt)
    setAnswered(prev => ({ ...prev, [current]: { selected: opt, correct: opt === q.correct } }))
  }

  async function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowHint(false)
    } else {
      // quiz finished — save progress for this user and lesson
      const scoreNow = Object.values(answered).filter(a => a.correct).length
      try {
        if (user?.id && Number.isFinite(key)) {
          await saveProgress({ userId: user.id, lessonId: key, score: scoreNow, completed: true })
        }
      } catch (err) {
        console.error('Failed to save progress', err.message)
      }
      setQuizDone(true)
    }
  }

  function handleRetry() {
    setCurrent(0); setSelected(null); setShowHint(false); setAnswered({}); setQuizDone(false)
  }

  function optionStyle(opt) {
    if (!isAnswered) return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#1a1a2e' }
    if (opt === q.correct) return { backgroundColor: '#DCFCE7', borderColor: '#16A34A', color: '#15803D' }
    if (opt === selected)  return { backgroundColor: '#FEE2E2', borderColor: '#EF4444', color: '#EF4444' }
    return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#9CA3AF' }
  }

  if (quizDone) {
    return (
      <KidLayout>
        <ScorePage score={score} total={questions.length} onRetry={handleRetry} onBack={() => navigate('/kid/lessons')} />
      </KidLayout>
    )
  }

  return (
    <KidLayout>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900">{quizData.lessonTitle}</h1>
          <p className="text-xs text-gray-400 font-semibold">{quizData.topicName}</p>
        </div>
        <span className="text-sm font-extrabold" style={{ color: quizData.topicColor }}>
          Question {current + 1} of {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => {
          const ans = answered[i]
          const bg  = ans ? (ans.correct ? '#16A34A' : '#EF4444') : i === current ? '#A855F7' : '#E5E7EB'
          return (
            <div
              key={i}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: bg, width: i === current ? 32 : 12 }}
            />
          )
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main question area */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Question card */}
          <div
            className="rounded-3xl p-5 sm:p-8 text-center border-2"
            style={{ backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }}
          >
            <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: quizData.topicColor }}>
              Question {current + 1}
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mb-6">{q.text}</p>
            <button
              onClick={() => setShowHint(v => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#BBF7D0')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#DCFCE7')}
            >
              💡 {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            {showHint && (
              <div
                className="mt-4 p-4 rounded-2xl text-sm text-left font-medium leading-relaxed"
                style={{ backgroundColor: '#FFF7ED', borderLeft: '4px solid #F97316', color: '#9A3412' }}
              >
                {q.hint}
              </div>
            )}
          </div>

          {/* Answer options 2×2 */}
          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="py-5 rounded-2xl text-2xl font-extrabold border-2 transition-all duration-150"
                style={{
                  ...optionStyle(opt),
                  cursor: isAnswered ? 'default' : 'pointer',
                }}
              >
                {isAnswered && opt === q.correct && <span className="mr-2">✓</span>}
                {isAnswered && opt === selected && opt !== q.correct && <span className="mr-2">✗</span>}
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              className="rounded-2xl p-5 flex items-start gap-3"
              style={{
                backgroundColor: isCorrect ? '#DCFCE7' : '#FEE2E2',
                borderLeft: `4px solid ${isCorrect ? '#16A34A' : '#EF4444'}`,
              }}
            >
              <span className="text-2xl">{isCorrect ? '🎉' : '💪'}</span>
              <div className="flex-1">
                <p className="font-extrabold mb-1" style={{ color: isCorrect ? '#15803D' : '#B91C1C' }}>
                  {isCorrect ? 'Correct!' : `Not quite — the answer is ${q.correct}`}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isCorrect ? '#166534' : '#991B1B' }}>
                  {q.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="self-start px-8 py-3 rounded-2xl text-white font-extrabold transition-all duration-150"
              style={{ backgroundColor: '#16A34A', boxShadow: '0 4px 14px rgba(22,163,74,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#15803D')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#16A34A')}
            >
              {current < questions.length - 1 ? 'Next question →' : 'See my score 🎉'}
            </button>
          )}
        </div>

        {/* Right panel — hidden on mobile */}
        <div
          className="hidden lg:block w-56 shrink-0 bg-white rounded-2xl border-2 p-4 self-start"
          style={{ borderColor: '#86EFAC' }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Quiz Progress</p>
          <div className="flex flex-col gap-1.5">
            {questions.map((q2, i) => {
              const ans    = answered[i]
              const active = i === current
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: active ? '#DCFCE7' : 'transparent',
                    color: ans ? (ans.correct ? '#16A34A' : '#EF4444') : active ? '#A855F7' : '#9CA3AF',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
                    style={{
                      backgroundColor: ans ? (ans.correct ? '#16A34A' : '#EF4444') : active ? '#A855F7' : '#E5E7EB',
                      color: (ans || active) ? '#fff' : '#9CA3AF',
                    }}
                  >
                    {ans ? (ans.correct ? '✓' : '✗') : i + 1}
                  </span>
                  <span className="truncate">{q2.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </KidLayout>
  )
}
