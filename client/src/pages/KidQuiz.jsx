import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'

const quizData = {
  lessonTitle: 'Times tables 6–10',
  topic: 'Multiplication',
  questions: [
    {
      id: 1, text: 'What is 7 × 8?',
      options: ['48', '56', '54', '63'],
      correct: '56',
      hint: 'Think of 7 groups of 8. Count by 8s: 8, 16, 24, 32, 40, 48, 56!',
      explanation: '7 × 8 = 56. Think of it as 7 groups of 8 — that\'s 56 things in total! You can also count by 7s: 7, 14, 21, 28, 35, 42, 49, 56.',
    },
    {
      id: 2, text: 'What is 9 × 4?',
      options: ['32', '36', '40', '27'],
      correct: '36',
      hint: 'Try counting by 9s: 9, 18, 27, 36. How many steps did it take?',
      explanation: '9 × 4 = 36. You can count by 9s four times: 9, 18, 27, 36.',
    },
    {
      id: 3, text: 'What is 6 × 7?',
      options: ['42', '48', '36', '45'],
      correct: '42',
      hint: 'Count by 6s: 6, 12, 18, 24, 30, 36, 42. Count 7 steps!',
      explanation: '6 × 7 = 42. Six multiplied by 7 gives you 42. Think of 6 rows of 7 objects.',
    },
    {
      id: 4, text: 'What is 8 × 9?',
      options: ['63', '64', '72', '81'],
      correct: '72',
      hint: '8 × 10 = 80, so 8 × 9 is just 8 less than that!',
      explanation: '8 × 9 = 72. A useful trick: 8 × 10 = 80, then subtract 8 to get 72.',
    },
    {
      id: 5, text: 'What is 10 × 6?',
      options: ['56', '66', '60', '65'],
      correct: '60',
      hint: 'Multiplying by 10 is easy — just add a zero to the other number!',
      explanation: '10 × 6 = 60. Multiplying any number by 10 just adds a zero: 6 → 60.',
    },
    {
      id: 6, text: 'What is 7 × 6?',
      options: ['42', '43', '48', '36'],
      correct: '42',
      hint: 'You already know 6 × 7 = 42! Multiplication works both ways.',
      explanation: '7 × 6 = 42. Same as 6 × 7 — multiplication is commutative!',
    },
    {
      id: 7, text: 'What is 9 × 9?',
      options: ['81', '72', '90', '63'],
      correct: '81',
      hint: 'Use the 9s trick: the digits of the answer always add up to 9!',
      explanation: '9 × 9 = 81. Notice 8 + 1 = 9. The 9 times table has this cool pattern!',
    },
    {
      id: 8, text: 'What is 8 × 6?',
      options: ['42', '48', '54', '46'],
      correct: '48',
      hint: 'Count by 8s six times: 8, 16, 24, 32, 40, 48.',
      explanation: '8 × 6 = 48. Count by 8s: 8, 16, 24, 32, 40, 48 — six steps!',
    },
  ],
}

function ScorePage({ score, total, onRetry, onBack }) {
  const pct    = Math.round((score / total) * 100)
  const stars  = pct >= 90 ? 3 : pct >= 70 ? 2 : 1
  const msg    = pct >= 90 ? 'Amazing work! 🎉' : pct >= 70 ? 'Great job! 👏' : 'Keep practising! 💪'

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{msg}</h2>
      <p className="text-gray-500 font-semibold mb-2">You scored</p>
      <div
        className="text-6xl font-extrabold mb-2"
        style={{ color: pct >= 70 ? '#6B3FA0' : '#CC2222' }}
      >
        {score}/{total}
      </div>
      <p className="text-gray-400 font-semibold mb-10">{pct}% correct</p>
      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: '#6B3FA0' }}
        >
          Try again
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-2xl font-extrabold border-2"
          style={{ borderColor: '#D4B8F0', color: '#6B3FA0' }}
        >
          Back to Lessons
        </button>
      </div>
    </div>
  )
}

export default function KidQuiz() {
  const navigate  = useNavigate()
  const questions = quizData.questions

  const [current,     setCurrent]     = useState(0)
  const [selected,    setSelected]    = useState(null)
  const [showHint,    setShowHint]    = useState(false)
  const [answered,    setAnswered]    = useState({})
  const [quizDone,    setQuizDone]    = useState(false)

  const q        = questions[current]
  const isAnswered = selected !== null
  const isCorrect  = selected === q.correct
  const score      = Object.values(answered).filter(a => a.correct).length

  function handleSelect(opt) {
    if (isAnswered) return
    const correct = opt === q.correct
    setSelected(opt)
    setAnswered(prev => ({ ...prev, [current]: { selected: opt, correct } }))
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setShowHint(false)
    } else {
      setQuizDone(true)
    }
  }

  function handleRetry() {
    setCurrent(0); setSelected(null); setShowHint(false); setAnswered({}); setQuizDone(false)
  }

  function optionStyle(opt) {
    if (!isAnswered) return { backgroundColor: '#fff', borderColor: '#D4B8F0', color: '#1a1a2e' }
    if (opt === q.correct) return { backgroundColor: '#DCFCE7', borderColor: '#16A34A', color: '#15803D' }
    if (opt === selected)  return { backgroundColor: '#FEE2E2', borderColor: '#DC2626', color: '#DC2626' }
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
          <p className="text-xs text-gray-400 font-semibold">{quizData.topic}</p>
        </div>
        <span className="text-sm font-extrabold" style={{ color: '#6B3FA0' }}>
          Question {current + 1} of {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => {
          const ans = answered[i]
          const bg  = ans ? (ans.correct ? '#16A34A' : '#DC2626') : i === current ? '#6B3FA0' : '#E5E7EB'
          return (
            <div
              key={i}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: bg, width: i === current ? 32 : 12 }}
            />
          )
        })}
      </div>

      <div className="flex gap-6">
        {/* Main question area */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Question card */}
          <div
            className="rounded-3xl p-8 text-center border-2"
            style={{ backgroundColor: '#FAF7FF', borderColor: '#D4B8F0' }}
          >
            <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: '#6B3FA0' }}>
              Question {current + 1}
            </p>
            <p className="text-3xl font-extrabold text-gray-900 mb-6">{q.text}</p>
            <button
              onClick={() => setShowHint(v => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ backgroundColor: '#EDE4FF', color: '#6B3FA0' }}
            >
              💡 {showHint ? 'Hide hint' : 'Show hint'}
            </button>
            {showHint && (
              <div
                className="mt-4 p-4 rounded-2xl text-sm text-left font-medium leading-relaxed"
                style={{ backgroundColor: '#FFF8E1', borderLeft: '4px solid #F59E0B', color: '#92400E' }}
              >
                {q.hint}
              </div>
            )}
          </div>

          {/* Answer options 2x2 */}
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
                borderLeft: `4px solid ${isCorrect ? '#16A34A' : '#DC2626'}`,
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
              style={{ backgroundColor: '#6B3FA0', boxShadow: '0 4px 14px rgba(107,63,160,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a3388')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6B3FA0')}
            >
              {current < questions.length - 1 ? 'Next question →' : 'See my score 🎉'}
            </button>
          )}
        </div>

        {/* Right panel — question list */}
        <div
          className="w-56 shrink-0 bg-white rounded-2xl border p-4 self-start"
          style={{ borderColor: '#D4B8F0' }}
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
                    backgroundColor: active ? '#EDE4FF' : 'transparent',
                    color: ans ? (ans.correct ? '#16A34A' : '#DC2626') : active ? '#6B3FA0' : '#9CA3AF',
                  }}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
                    style={{
                      backgroundColor: ans ? (ans.correct ? '#16A34A' : '#DC2626') : active ? '#6B3FA0' : '#E5E7EB',
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
