import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveProgress, getProgressMap } from '../services/progress'
import { supabase, isSupabaseConfigured } from '../services/supabaseClient'
import { getQuizByLessonId, getAllLessons, curriculum } from '../data/curriculum'

const defaultQuiz = {
  lessonTitle: 'Règles Générales de Perfusion',
  topicName: 'Fondamentaux',
  topicColor: '#1E3A5F',
  questions: [
    {
      text: "Quelle est la voie d'administration recommandée pour les perfusions de vitamines IV ?",
      options: ['Intramusculaire', 'Intraveineuse lente', 'Sous-cutanée', 'Orale'],
      correct: 'Intraveineuse lente',
      hint: 'IV = intraveineux.',
      explanation: "Les vitamines doivent être administrées par voie intraveineuse lente pour éviter les réactions.",
    },
  ],
}

const ACCENT         = '#1E3A5F'
const ACCENT_CORRECT = '#065F46'
const ACCENT_WRONG   = '#EF4444'
const MAX_VIOLATIONS    = 3
const PASS_SCORE        = 80   // %
const TIME_PER_QUESTION = 45   // seconds per question

// All lessons flat list — used for global score computation
const ALL_LESSONS = getAllLessons(1)
const ALL_LESSON_IDS = ALL_LESSONS.map(l => l.id)

// Returns true when every lesson in the current cycle has been completed
function isAllDoneForCycle(progressMap, cycle) {
  return ALL_LESSON_IDS.every(id => {
    const p = progressMap[id]
    return p && p.completed && (p.attempts ?? 0) >= cycle
  })
}

// Computes global score across all lessons (raw correct / total questions)
function calcGlobalScore(progressMap) {
  let totalCorrect = 0
  let totalQuestions = 0
  for (const mod of curriculum[1]) {
    for (const lesson of mod.lessons) {
      const p = progressMap[lesson.id]
      totalCorrect += p?.score ?? 0
      totalQuestions += lesson.quiz.length
    }
  }
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  return { totalCorrect, totalQuestions, pct }
}

// Counts how many lessons are done in the current cycle
function countDoneForCycle(progressMap, cycle) {
  return ALL_LESSON_IDS.filter(id => {
    const p = progressMap[id]
    return p && p.completed && (p.attempts ?? 0) >= cycle
  }).length
}

// Sets banned_from_quiz = true on the profile, then refreshes AuthContext
async function banUserFromQuiz(userId, refreshProfile) {
  if (isSupabaseConfigured && userId && userId !== 'demo') {
    try {
      await supabase.from('profiles').update({ banned_from_quiz: true }).eq('id', userId)
    } catch {}
  }
  await refreshProfile?.()
}

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

// ── QuizBannedScreen — shown when profile.banned_from_quiz = true ──────────────
function QuizBannedScreen({ onBack }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-extrabold mb-3" style={{ color: ACCENT_WRONG }}>
        Accès aux quiz révoqué
      </h2>
      <p className="text-sm text-gray-500 mb-2 max-w-sm">
        Une tentative de triche a été détectée sur votre compte.
        Vous n'êtes plus autorisé à passer aucun quiz.
      </p>
      <p className="text-xs font-bold mb-8" style={{ color: ACCENT_WRONG }}>
        Contactez l'administrateur pour débloquer votre accès.
      </p>
      <button
        onClick={onBack}
        className="px-8 py-3 rounded-2xl font-extrabold border-2 transition-colors"
        style={{ borderColor: '#FCA5A5', color: ACCENT_WRONG }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Retour
      </button>
    </div>
  )
}

// ── AlreadyDoneScreen — quiz already submitted for the current cycle ───────────
function AlreadyDoneScreen({ prevScore, total, onBack }) {
  const pct = total > 0 && prevScore != null ? Math.round((prevScore / total) * 100) : null
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="text-2xl font-extrabold mb-2" style={{ color: ACCENT }}>Quiz déjà complété</h2>
      <p className="text-sm text-gray-500 mb-2 max-w-sm">
        Vous avez déjà soumis ce quiz pour cette tentative.
        {pct != null ? ` Score obtenu : ${prevScore}/${total} (${pct}%).` : ''}
      </p>
      <p className="text-xs font-semibold mb-8 text-gray-400">
        Terminez les autres modules pour obtenir votre résultat global.
      </p>
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
  )
}

// ── CheatWarningOverlay ────────────────────────────────────────────────────────
function CheatWarningOverlay({ violations, onResume, autoSubmitted }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(10,20,40,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)',
    }}>
      <div
        className="rounded-3xl p-10 text-center max-w-sm w-full mx-4"
        style={{ backgroundColor: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
      >
        <div className="text-5xl mb-4">{autoSubmitted ? '🚫' : '⚠️'}</div>
        <h2 className="text-xl font-extrabold mb-2" style={{ color: autoSubmitted ? ACCENT_WRONG : ACCENT }}>
          {autoSubmitted ? 'Tricherie détectée' : 'Sortie de page détectée'}
        </h2>
        <p className="text-sm mb-1" style={{ color: '#64748B' }}>
          {autoSubmitted
            ? "Vous avez quitté la page trop de fois. Votre accès est révoqué définitivement."
            : "Vous avez changé d'onglet ou minimisé la fenêtre."}
        </p>
        {!autoSubmitted && (
          <p className="text-xs font-bold mb-6" style={{ color: violations >= MAX_VIOLATIONS - 1 ? ACCENT_WRONG : '#F59E0B' }}>
            Avertissement {violations} / {MAX_VIOLATIONS} — encore {MAX_VIOLATIONS - violations} avant révocation
          </p>
        )}
        <button
          onClick={onResume}
          disabled={autoSubmitted}
          className="w-full py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: autoSubmitted ? '#94A3B8' : ACCENT }}
        >
          {autoSubmitted ? 'Révocation en cours…' : 'Reprendre le quiz'}
        </button>
      </div>
    </div>
  )
}

// ── QuizShell ──────────────────────────────────────────────────────────────────
function QuizShell({ children, onQuit, quizDone, timeLeft }) {
  useEffect(() => {
    if (quizDone) return
    const handler = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [quizDone])

  const mins  = Math.floor((timeLeft ?? 0) / 60).toString().padStart(2, '0')
  const secs  = ((timeLeft ?? 0) % 60).toString().padStart(2, '0')
  const isLow = timeLeft != null && !quizDone && timeLeft <= 30

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0F4F8' }}>
      <nav
        className="flex items-center justify-between px-4 sm:px-8 py-3 sticky top-0 z-20 shrink-0"
        style={{ backgroundColor: ACCENT, boxShadow: '0 2px 12px rgba(30,58,95,0.35)' }}
      >
        <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          iVitaminacademy
          <span className="hidden sm:inline-block text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full ml-2 align-middle">
            Quiz
          </span>
        </span>
        <div className="flex items-center gap-3">
          {timeLeft != null && !quizDone && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold${isLow ? ' animate-pulse' : ''}`}
              style={{
                backgroundColor: isLow ? ACCENT_WRONG : 'rgba(255,255,255,0.15)',
                color: '#fff',
              }}
            >
              ⏱ {mins}:{secs}
            </div>
          )}
          {!quizDone && (
            <button
              onClick={onQuit}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border-2 transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.30)', color: '#fff', backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              ✕ Quitter
            </button>
          )}
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 max-w-4xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}

// ── ScorePage — per-quiz result, no retry ─────────────────────────────────────
function ScorePage({ score, total, passed, timedOut, onBack, doneSoFar, totalLessons }) {
  const pct       = Math.round((score / total) * 100)
  const minNeeded = Math.ceil(total * (PASS_SCORE / 100))

  let icon, title
  if (timedOut && !passed) { icon = '⏰'; title = 'Temps écoulé !' }
  else if (passed)         { icon = pct >= 95 ? '🏆' : '✅'; title = 'Quiz réussi !' }
  else                     { icon = '❌'; title = 'Quiz non validé' }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
      {timedOut && !passed && (
        <p className="text-sm font-semibold mb-2" style={{ color: '#F59E0B' }}>Le temps imparti est écoulé.</p>
      )}
      <p className="text-gray-500 font-semibold mb-2">Votre score sur ce quiz</p>
      <div className="text-6xl font-extrabold mb-2" style={{ color: passed ? ACCENT : ACCENT_WRONG }}>
        {score}/{total}
      </div>
      <p className="text-gray-400 font-semibold mb-1">{pct}% de bonnes réponses</p>
      <p className="text-sm font-bold mb-4" style={{ color: passed ? ACCENT_CORRECT : ACCENT_WRONG }}>
        {passed
          ? `✓ Note de passage atteinte (≥ ${PASS_SCORE}%)`
          : `✗ Note insuffisante — il faut ${minNeeded}/${total} bonnes réponses`}
      </p>
      {doneSoFar != null && totalLessons != null && (
        <p className="text-xs font-semibold text-gray-400 mb-8">
          Progression globale : {doneSoFar} / {totalLessons} modules complétés pour cette tentative
        </p>
      )}
      {doneSoFar === totalLessons && (
        <p className="text-sm font-bold mb-6 animate-pulse" style={{ color: ACCENT }}>
          ⏳ Calcul de votre score global…
        </p>
      )}
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
  )
}

// ── GlobalResultPage — shown after ALL quizzes completed in a cycle ────────────
function GlobalResultPage({ result, onGoToLessons, onGoToCertificate }) {
  const { type, pct, totalCorrect, totalQuestions } = result

  if (type === 'pass') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: ACCENT_CORRECT }}>
          Félicitations — Certification réussie !
        </h2>
        <p className="text-gray-500 font-semibold mb-1">Score global sur tous les modules</p>
        <div className="text-5xl font-extrabold mb-1" style={{ color: ACCENT_CORRECT }}>
          {totalCorrect}/{totalQuestions}
        </div>
        <p className="text-2xl font-extrabold mb-4" style={{ color: ACCENT_CORRECT }}>{pct}%</p>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">
          Vous avez atteint la note minimale requise et obtenu votre certification iVitamin Academy.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={onGoToCertificate}
            className="px-8 py-3 rounded-2xl text-white font-extrabold"
            style={{ backgroundColor: ACCENT_CORRECT }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#047857')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT_CORRECT)}
          >
            📜 Voir mon certificat
          </button>
          <button
            onClick={onGoToLessons}
            className="px-8 py-3 rounded-2xl font-extrabold border-2 transition-colors"
            style={{ borderColor: '#6EE7B7', color: ACCENT_CORRECT }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#ECFDF5')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Retour aux protocoles
          </button>
        </div>
      </div>
    )
  }

  if (type === 'fail_cycle1') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-4">
        <div className="text-7xl mb-4">❌</div>
        <h2 className="text-3xl font-extrabold mb-3" style={{ color: ACCENT }}>
          Score insuffisant — Tentative 1 / 2
        </h2>
        <p className="text-gray-500 font-semibold mb-1">Score global sur tous les modules</p>
        <div className="text-5xl font-extrabold mb-1" style={{ color: ACCENT_WRONG }}>
          {totalCorrect}/{totalQuestions}
        </div>
        <p className="text-2xl font-extrabold mb-2" style={{ color: ACCENT_WRONG }}>{pct}%</p>
        <p className="text-sm font-bold mb-2" style={{ color: ACCENT_WRONG }}>
          Il vous manque {PASS_SCORE - pct}% pour valider la certification.
        </p>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">
          Vous pouvez repasser l'ensemble des quiz une dernière fois.
          Retournez aux protocoles et recommencez chaque module.
        </p>
        <button
          onClick={onGoToLessons}
          className="px-8 py-3 rounded-2xl text-white font-extrabold"
          style={{ backgroundColor: ACCENT }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = ACCENT)}
        >
          Recommencer les quiz (dernière tentative)
        </button>
      </div>
    )
  }

  // type === 'fail_cycle2'
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="text-7xl mb-4">🚫</div>
      <h2 className="text-3xl font-extrabold mb-3" style={{ color: ACCENT_WRONG }}>
        Crédit de tests épuisé
      </h2>
      <p className="text-gray-500 font-semibold mb-1">Score global — 2ème tentative</p>
      <div className="text-5xl font-extrabold mb-1" style={{ color: ACCENT_WRONG }}>
        {totalCorrect}/{totalQuestions}
      </div>
      <p className="text-2xl font-extrabold mb-2" style={{ color: ACCENT_WRONG }}>{pct}%</p>
      <p className="text-sm text-gray-500 mb-8 max-w-sm">
        Vous avez utilisé vos 2 tentatives sans atteindre {PASS_SCORE}%.
        L'accès aux cours et aux tests est suspendu.
        Contactez l'administrateur pour débloquer votre accès.
      </p>
      <button
        onClick={onGoToLessons}
        className="px-8 py-3 rounded-2xl font-extrabold border-2 transition-colors"
        style={{ borderColor: '#FCA5A5', color: ACCENT_WRONG }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        Retour
      </button>
    </div>
  )
}

// ── KidQuiz ───────────────────────────────────────────────────────────────────
export default function KidQuiz() {
  const navigate  = useNavigate()
  const { id }   = useParams()
  const lessonId = Number(id)
  const { user, profile, refreshProfile } = useAuth()
  const quizData = getQuizByLessonId(lessonId) || defaultQuiz
  const total    = quizData.questions.length

  const [questions,       setQuestions]       = useState(() => buildShuffled(quizData.questions))
  const [current,         setCurrent]         = useState(0)
  const [selected,        setSelected]        = useState(null)
  const [showHint,        setShowHint]        = useState(false)
  const [answered,        setAnswered]        = useState({})
  const [quizDone,        setQuizDone]        = useState(false)
  const [tabViolations,   setTabViolations]   = useState(0)
  const [cheatOverlay,    setCheatOverlay]    = useState(false)  // false | 'warn' | 'submitted'
  const [timeLeft,        setTimeLeft]        = useState(null)
  const [alreadyDone,     setAlreadyDone]     = useState(false)
  const [prevScore,       setPrevScore]       = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(true)
  const [timedOut,        setTimedOut]        = useState(false)
  const [globalResult,    setGlobalResult]    = useState(null) // {type,pct,totalCorrect,totalQuestions}
  const [doneSoFar,       setDoneSoFar]       = useState(null)

  const lastViolationTime = useRef(0)
  // Keep a ref of profile so timer callbacks don't use stale closure
  const profileRef = useRef(profile)
  useEffect(() => { profileRef.current = profile }, [profile])

  // ── Load previous progress and check if already done this cycle ────────────
  useEffect(() => {
    const load = async () => {
      try {
        const map          = await getProgressMap(user?.id)
        const currentCycle = profile?.quiz_cycle ?? 1
        const prev         = map[lessonId]
        if (prev?.completed && (prev.attempts ?? 0) >= currentCycle) {
          setAlreadyDone(true)
          setPrevScore(prev.score ?? null)
        }
        setDoneSoFar(countDoneForCycle(map, currentCycle))
      } catch {}
      setTimeLeft(total * TIME_PER_QUESTION)
      setLoadingProgress(false)
    }
    load()
  }, []) // eslint-disable-line

  // ── Countdown timer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null || quizDone || alreadyDone || loadingProgress) return
    if (timeLeft <= 0) {
      setTimedOut(true)
      const fs = Object.values(answered).filter(a => a.correct).length
      ;(async () => {
        let allProg = null
        try {
          const saved = await saveProgress({ userId: user?.id || 'demo', lessonId, score: fs, completed: true })
          if (saved) window.dispatchEvent(new CustomEvent('progressUpdated', { detail: { lessonId, row: saved } }))
          allProg = await getProgressMap(user?.id)
        } catch {}
        setQuizDone(true)
        await runGlobalCheck(allProg)
      })()
      return
    }
    const tid = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(tid)
  }, [timeLeft, quizDone, alreadyDone, loadingProgress]) // eslint-disable-line

  // ── Tab switch + window minimize detection ─────────────────────────────────
  useEffect(() => {
    if (quizDone || alreadyDone) return
    const trigger = () => {
      const now = Date.now()
      if (now - lastViolationTime.current < 300) return
      lastViolationTime.current = now
      setTabViolations(prev => {
        const next = prev + 1
        setCheatOverlay(next >= MAX_VIOLATIONS ? 'submitted' : 'warn')
        return next
      })
    }
    const onVisibility = () => { if (document.hidden) trigger() }
    const onBlur       = () => trigger()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
    }
  }, [quizDone, alreadyDone])

  // ── Copy / paste / right-click prevention ─────────────────────────────────
  useEffect(() => {
    if (quizDone) return
    const noop = e => e.preventDefault()
    const blockKey = e => {
      if ((e.ctrlKey || e.metaKey) && ['c', 'a', 'x', 'v'].includes(e.key.toLowerCase()))
        e.preventDefault()
    }
    document.addEventListener('copy', noop)
    document.addEventListener('cut', noop)
    document.addEventListener('contextmenu', noop)
    document.addEventListener('keydown', blockKey)
    return () => {
      document.removeEventListener('copy', noop)
      document.removeEventListener('cut', noop)
      document.removeEventListener('contextmenu', noop)
      document.removeEventListener('keydown', blockKey)
    }
  }, [quizDone])

  // ── Cheat ban when MAX_VIOLATIONS reached ─────────────────────────────────
  useEffect(() => {
    if (cheatOverlay !== 'submitted') return
    banUserFromQuiz(user?.id, refreshProfile)
      .finally(() => setCheatOverlay(false))
  }, [cheatOverlay]) // eslint-disable-line

  // ── Global completion check (shared between handleNext and timer) ──────────
  async function runGlobalCheck(allProg) {
    if (!allProg) return
    const cycle = profileRef.current?.quiz_cycle ?? 1
    if (!isAllDoneForCycle(allProg, cycle)) {
      setDoneSoFar(countDoneForCycle(allProg, cycle))
      return
    }
    const { pct, totalCorrect, totalQuestions } = calcGlobalScore(allProg)
    if (pct >= PASS_SCORE) {
      setGlobalResult({ type: 'pass', pct, totalCorrect, totalQuestions })
    } else if (cycle === 1) {
      if (isSupabaseConfigured && user?.id && user.id !== 'demo') {
        try { await supabase.from('profiles').update({ quiz_cycle: 2 }).eq('id', user.id) } catch {}
      }
      await refreshProfile?.()
      setGlobalResult({ type: 'fail_cycle1', pct, totalCorrect, totalQuestions })
    } else {
      if (isSupabaseConfigured && user?.id && user.id !== 'demo') {
        try { await supabase.from('profiles').update({ banned_from_quiz: true }).eq('id', user.id) } catch {}
      }
      await refreshProfile?.()
      setGlobalResult({ type: 'fail_cycle2', pct, totalCorrect, totalQuestions })
    }
  }

  const q          = questions[current]
  const isAnswered = selected !== null
  const isCorrect  = selected === q?.correct

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
    // Last question — save and run global check
    const fs = Object.values({ ...answered, [current]: { correct: isCorrect } }).filter(a => a.correct).length
    let allProg = null
    try {
      const saved = await saveProgress({ userId: user?.id || 'demo', lessonId, score: fs, completed: true })
      if (saved) window.dispatchEvent(new CustomEvent('progressUpdated', { detail: { lessonId, row: saved } }))
      allProg = await getProgressMap(user?.id)
    } catch (err) {
      console.warn('[KidQuiz] save failed:', err.message)
    }
    setQuizDone(true)
    await runGlobalCheck(allProg)
  }

  function handleQuit() {
    const ok = window.confirm('Êtes-vous sûr de vouloir quitter le quiz ? Votre progression sera perdue.')
    if (ok) navigate('/medecin/lessons')
  }

  function optionStyle(opt) {
    if (!isAnswered) return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#1a1a2e' }
    if (opt === q.correct) return { backgroundColor: '#ECFDF5', borderColor: '#6EE7B7', color: ACCENT_CORRECT }
    if (opt === selected)  return { backgroundColor: '#FEE2E2', borderColor: ACCENT_WRONG, color: ACCENT_WRONG }
    return { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#9CA3AF' }
  }

  const finalScore = Object.values(answered).filter(a => a.correct).length
  const pct        = Math.round((finalScore / total) * 100)
  const passed     = pct >= PASS_SCORE

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loadingProgress) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
        <p className="text-sm font-semibold" style={{ color: ACCENT }}>Chargement…</p>
      </div>
    )
  }

  // ── Global quiz ban (cheating detected) ────────────────────────────────────
  if (profile?.banned_from_quiz) {
    return (
      <QuizShell quizDone={true} onQuit={() => navigate('/medecin/lessons')} timeLeft={null}>
        <QuizBannedScreen onBack={() => navigate('/medecin/lessons')} />
      </QuizShell>
    )
  }

  // ── Already done this cycle ────────────────────────────────────────────────
  if (alreadyDone) {
    return (
      <QuizShell quizDone={true} onQuit={() => navigate('/medecin/lessons')} timeLeft={null}>
        <AlreadyDoneScreen
          prevScore={prevScore}
          total={total}
          onBack={() => navigate('/medecin/lessons')}
        />
      </QuizShell>
    )
  }

  // ── Global result page (all quizzes done for this cycle) ───────────────────
  if (quizDone && globalResult) {
    return (
      <QuizShell quizDone={true} onQuit={() => navigate('/medecin/lessons')} timeLeft={null}>
        <GlobalResultPage
          result={globalResult}
          onGoToLessons={() => navigate('/medecin/lessons')}
          onGoToCertificate={() => navigate('/medecin/certificate')}
        />
      </QuizShell>
    )
  }

  // ── Per-quiz score page (not the last quiz, or waiting for global check) ───
  if (quizDone) {
    return (
      <QuizShell quizDone={true} onQuit={handleQuit} timeLeft={null}>
        <ScorePage
          score={finalScore}
          total={total}
          passed={passed}
          timedOut={timedOut}
          doneSoFar={doneSoFar}
          totalLessons={ALL_LESSON_IDS.length}
          onBack={() => navigate('/medecin/lessons')}
        />
      </QuizShell>
    )
  }

  // ── Active quiz ────────────────────────────────────────────────────────────
  return (
    <QuizShell quizDone={false} onQuit={handleQuit} timeLeft={timeLeft}>
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
          Question {current + 1} / {total}
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
            <p
              className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 leading-snug select-none"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            >
              {q.text}
            </p>
            <button
              onClick={() => setShowHint(v => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              style={{ backgroundColor: '#DBEAFE', color: ACCENT }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#BFDBFE')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#DBEAFE')}
            >
              💡 {showHint ? "Masquer l'indice" : "Afficher l'indice"}
            </button>
            {showHint && (
              <div
                className="mt-4 p-4 rounded-2xl text-sm text-left font-medium leading-relaxed"
                style={{ backgroundColor: '#DBEAFE', borderLeft: `4px solid ${ACCENT}`, color: ACCENT }}
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
                className="py-4 px-3 rounded-2xl text-base font-extrabold border-2 transition-all duration-150 text-left leading-snug select-none"
                style={{
                  ...optionStyle(opt),
                  cursor: isAnswered ? 'default' : 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
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
                <p className="font-extrabold mb-1" style={{ color: isCorrect ? ACCENT_CORRECT : '#B91C1C' }}>
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
                  <span className="truncate text-xs select-none">{q2.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </QuizShell>
  )
}
