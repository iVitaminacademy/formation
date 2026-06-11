import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveProgress } from '../services/progress'
import { getQuizByLessonId } from '../data/curriculum'

const defaultQuiz = {
  lessonTitle: 'Règles Générales de Perfusion',
  topicName: 'Fondamentaux',
  topicColor: '#1E3A5F',
  questions: [
    {
      text: 'Quelle est la voie d\'administration recommandée pour les perfusions de vitamines IV ?',
      options: ['Intramusculaire', 'Intraveineuse lente', 'Sous-cutanée', 'Orale'],
      correct: 'Intraveineuse lente',
      hint: 'IV = intraveineux.',
      explanation: 'Les vitamines doivent être administrées par voie intraveineuse lente pour éviter les réactions.'
    },
  ],
}

const ACCENT = '#1E3A5F'
const ACCENT_CORRECT = '#065F46'
const ACCENT_WRONG   = '#EF4444'
const MAX_VIOLATIONS = 3

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildShuffled(questions) {
  return questions.map(q => ({ ...q, options: shuffle(q.options) }))
}

function CheatWarningOverlay({ violations, onResume, autoSubmitted }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(10,20,40,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        className="rounded-3xl p-10 text-center max-w-sm w-full mx-4"
        style={{ backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
      >
        <div className="text-5xl mb-4">{autoSubmitted ? '🚫' : '⚠️'}</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: '#1E3A5F' }}>
          {autoSubmitted ? 'Quiz terminé' : 'Changement d\'onglet détecté'}
        </h2>
        <p className="text-sm mb-1" style={{ color: '#64748B' }}>
          {autoSubmitted
            ? 'Vous avez changé d\'onglet trop de fois. Le quiz a été soumis automatiquement.'
            : 'Vous avez quitté la page du quiz.'}
        </p>
        {!autoSubmitted && (
          <p className="text-xs font-bold mb-6" style={{ color: violations >= MAX_VIOLATIONS - 1 ? '#EF4444' : '#F59E0B' }}>
            Avertissement {violations} / {MAX_VIOLATIONS} — encore {MAX_VIOLATIONS - violations} avant soumission automatique
          </p>
        )}
        <button
          onClick={onResume}
          className="w-full py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: autoSubmitted ? '#EF4444' : '#1E3A5F' }}
        >
          {autoSubmitted ? 'Voir mon score' : 'Reprendre le quiz'}
        </button>
      </div>
    </div>
  )
}

function QuizShell({ children, onQuit, quizDone }) {
  useEffect(() => {
    if (quizDone) return
    const handler = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [quizDone])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F8' }}>
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: '#1E3A5F', boxShadow: '0 2px 12px rgba(30,58,95,0.35)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Ivitaminacademy
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-2 align-middle">
            Quiz
          </span>
        </span>
        {!quizDone && (
          <button
            onClick={onQuit}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.30)', color: '#fff', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ✕ Quitter le quiz
          </button>
        )}
      </nav>
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}

function ScorePage({ score, total, topicColor, onRetry, onBack }) {
  const pct   = Math.round((score / total) * 100)
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : 1
  const msg   = pct >= 90 ? 'Excellent travail ! 🎉' : pct >= 70 ? 'Très bien ! 👏' : 'Continuez à pratiquer ! 💪'

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{msg}</h2>
      <p className="text-gray-500 font-semibold mb-2">Votre score</p>
      <div
        className="text-6xl font-extrabold mb-2"
        style={{ color: pct >= 70 ? ACCENT : ACCENT_WRONG }}
      >
        {score}/{total}
      </div>
      <p className="text-gray-400 font-semibold mb-10">{pct}% de bonnes réponses</p>
      <div className="flex gap-4">
        <button
          onClick={onRetry}
          className="px-8 py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: ACCENT }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
        >
          Réessayer
        </button>
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-2xl font-extrabold border-2 transition-colors"
          style={{ borderColor: '#93C5FD', color: ACCENT }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Retour aux protocoles
        </button>
      </div>
    </div>
  )
}

export default function KidQuiz() {
  const navigate  = useNavigate()
  const { id }   = useParams()
  const lessonId = Number(id)
  const { user } = useAuth()
  const quizData = getQuizByLessonId(lessonId) || defaultQuiz

  const [questions,      setQuestions]      = useState(() => buildShuffled(quizData.questions))
  const [current,        setCurrent]        = useState(0)
  const [selected,       setSelected]       = useState(null)
  const [showHint,       setShowHint]       = useState(false)
  const [answered,       setAnswered]       = useState({})
  const [quizDone,       setQuizDone]       = useState(false)
  const [tabViolations,  setTabViolations]  = useState(0)
  const [cheatOverlay,   setCheatOverlay]   = useState(false)   // 'warn' | 'submitted' | false

  useEffect(() => {
    if (quizDone) return
    const handler = () => {
      if (!document.hidden) return
      setTabViolations(prev => {
        const next = prev + 1
        setCheatOverlay(next >= MAX_VIOLATIONS ? 'submitted' : 'warn')
        return next
      })
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [quizDone])

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
      return
    }

    const finalScore = Object.values({ ...answered, [current]: { correct: isCorrect } })
      .filter(a => a.correct).length

    try {
      const saved = await saveProgress({
        userId:    user?.id || 'demo',
        lessonId:  lessonId,
        score:     finalScore,
        completed: true,
      })
      window.dispatchEvent(new CustomEvent('progressUpdated', {
        detail: { lessonId, row: saved },
      }))
    } catch (err) {
      console.warn('[KidQuiz] saveProgress failed:', err.message)
    }

    setQuizDone(true)
  }

  function handleRetry() {
    setQuestions(buildShuffled(quizData.questions))
    setCurrent(0); setSelected(null); setShowHint(false); setAnswered({}); setQuizDone(false)
    setTabViolations(0); setCheatOverlay(false)
  }

  function handleQuit() {
    const ok = window.confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')
    if (ok) navigate('/medecin/lessons')
  }

  function optionStyle(opt) {
    if (!isAnswered) return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#1a1a2e' }
    if (opt === q.correct) return { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7', color: '#065F46' }
    if (opt === selected)  return { backgroundColor: '#FEE2E2', borderColor: '#EF4444', color: '#EF4444' }
    return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#9CA3AF' }
  }

  const finalScore = Object.values(answered).filter(a => a.correct).length

  // Auto-submit when MAX_VIOLATIONS reached: save progress then show score
  useEffect(() => {
    if (cheatOverlay !== 'submitted') return
    const submit = async () => {
      try {
        const saved = await saveProgress({ userId: user?.id || 'demo', lessonId, score: finalScore, completed: true })
        window.dispatchEvent(new CustomEvent('progressUpdated', { detail: { lessonId, row: saved } }))
      } catch {}
      setQuizDone(true)
    }
    submit()
  }, [cheatOverlay]) // eslint-disable-line

  if (quizDone) {
    return (
      <QuizShell quizDone={true} onQuit={handleQuit}>
        <ScorePage
          score={finalScore}
          total={questions.length}
          topicColor={quizData.topicColor}
          onRetry={handleRetry}
          onBack={() => navigate('/medecin/lessons')}
        />
      </QuizShell>
    )
  }

  return (
    <QuizShell quizDone={false} onQuit={handleQuit}>
      {cheatOverlay && (
        <CheatWarningOverlay
          violations={tabViolations}
          autoSubmitted={cheatOverlay === 'submitted'}
          onResume={() => { if (cheatOverlay !== 'submitted') setCheatOverlay(false) }}
        />
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900">{quizData.lessonTitle}</h1>
          <p className="text-xs text-gray-400 font-semibold">{quizData.topicName}</p>
        </div>
        <span className="text-sm font-extrabold" style={{ color: quizData.topicColor ?? ACCENT }}>
          Question {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => {
          const ans = answered[i]
          const bg  = ans ? (ans.correct ? ACCENT : ACCENT_WRONG) : i === current ? '#1D4ED8' : '#E5E7EB'
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
            style={{ backgroundColor: '#EFF6FF', borderColor: '#93C5FD' }}
          >
            <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: quizData.topicColor ?? ACCENT }}>
              Question {current + 1}
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug">{q.text}</p>
            <button
              onClick={() => setShowHint(v => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ backgroundColor: '#DBEAFE', color: ACCENT }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#BFDBFE')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#DBEAFE')}
            >
              💡 {showHint ? 'Masquer l\'indice' : 'Afficher l\'indice'}
            </button>
            {showHint && (
              <div
                className="mt-4 p-4 rounded-2xl text-sm text-left font-medium leading-relaxed"
                style={{ backgroundColor: '#DBEAFE', borderLeft: `4px solid ${ACCENT}`, color: '#1E3A5F' }}
              >
                {q.hint}
              </div>
            )}
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="py-4 px-3 rounded-2xl text-base font-extrabold border-2 transition-all duration-150 text-left leading-snug"
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
                backgroundColor: isCorrect ? '#ECFDF5' : '#FEE2E2',
                borderLeft: `4px solid ${isCorrect ? '#10B981' : ACCENT_WRONG}`,
              }}
            >
              <span className="text-2xl">{isCorrect ? '🎉' : '💪'}</span>
              <div className="flex-1">
                <p className="font-extrabold mb-1" style={{ color: isCorrect ? '#065F46' : '#B91C1C' }}>
                  {isCorrect ? 'Correct !' : `Pas tout à fait — la bonne réponse est : ${q.correct}`}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: isCorrect ? '#064E3B' : '#991B1B' }}>
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
              style={{ backgroundColor: ACCENT, boxShadow: '0 4px 14px rgba(30,58,95,0.35)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
            >
              {current < questions.length - 1 ? 'Question suivante →' : 'Voir mon score 🎉'}
            </button>
          )}
        </div>

        {/* Right panel — desktop only */}
        <div
          className="hidden lg:block w-56 shrink-0 bg-white rounded-2xl border-2 p-4 self-start"
          style={{ borderColor: '#93C5FD' }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Progression du quiz</p>
          <div className="flex flex-col gap-1.5">
            {questions.map((q2, i) => {
              const ans    = answered[i]
              const active = i === current
              return (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    backgroundColor: active ? '#EFF6FF' : 'transparent',
                    color: ans ? (ans.correct ? ACCENT : ACCENT_WRONG) : active ? '#1D4ED8' : '#9CA3AF',
                  }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0"
                    style={{
                      backgroundColor: ans ? (ans.correct ? ACCENT : ACCENT_WRONG) : active ? '#1D4ED8' : '#E5E7EB',
                      color: (ans || active) ? '#fff' : '#9CA3AF',
                    }}
                  >
                    {ans ? (ans.correct ? '✓' : '✗') : i + 1}
                  </span>
                  <span className="truncate text-xs">{q2.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </QuizShell>
  )
}
