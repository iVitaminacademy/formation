import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { getProgressMap } from '../services/progress'
import { curriculum, getAllLessons } from '../data/curriculum'

const PASS_SCORE  = 80
const ALL_LESSONS = getAllLessons(1)

// Global score across all lessons: sum(correct) / sum(total questions)
function calcGlobalScore(progressMap) {
  let totalCorrect = 0
  let totalQuestions = 0
  for (const mod of curriculum[1]) {
    for (const lesson of mod.lessons) {
      const p = progressMap[lesson.id]
      totalCorrect  += p?.score ?? 0
      totalQuestions += lesson.quiz.length
    }
  }
  const pct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  return { totalCorrect, totalQuestions, pct }
}

// All lessons completed for the current attempt cycle
function isAllDoneForCycle(progressMap, cycle) {
  return ALL_LESSONS.every(l => {
    const p = progressMap[l.id]
    return p && p.completed && (p.attempts ?? 0) >= cycle
  })
}

// Per-module progress for the progress tracker display
function computeModuleProgress(progressMap, cycle) {
  return (curriculum[1] || []).map(topic => {
    const done  = topic.lessons.filter(l => {
      const p = progressMap[l.id]
      return p && p.completed && (p.attempts ?? 0) >= cycle
    }).length
    const total    = topic.lessons.length
    const pct      = total > 0 ? Math.round((done / total) * 100) : 0
    const complete = done === total && total > 0
    return { ...topic, done, total, pct, complete }
  })
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function CertificatePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const printRef = useRef(null)

  const [progressMap, setProgressMap] = useState({})
  const [loading,     setLoading]     = useState(true)
  const [certDate,    setCertDate]    = useState(null)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(map => {
        setProgressMap(map)
        const dates = Object.values(map).map(r => r?.last_date).filter(Boolean)
        if (dates.length) {
          const latest = dates.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
          setCertDate(latest)
        }
      })
      .catch(err => console.error('[CertificatePage]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    function onUpdate() {
      if (user?.id) getProgressMap(user.id).then(setProgressMap)
    }
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [user?.id])

  const currentCycle  = profile?.quiz_cycle ?? 1
  const allDone       = isAllDoneForCycle(progressMap, currentCycle)
  const { totalCorrect, totalQuestions, pct: globalPct } = calcGlobalScore(progressMap)
  const hasPassed     = allDone && globalPct >= PASS_SCORE
  const modules       = computeModuleProgress(progressMap, currentCycle)
  const doneCount     = modules.filter(m => m.complete).length
  const name          = profile?.name || 'Médecin'

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <KidLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-pulse">🎓</div>
            <p className="text-gray-400 font-semibold">Vérification de votre progression…</p>
          </div>
        </div>
      </KidLayout>
    )
  }

  // ── Not all quizzes done yet — show progress tracker ─────────────────────────
  if (!allDone) {
    const doneLessons = ALL_LESSONS.filter(l => {
      const p = progressMap[l.id]
      return p && p.completed && (p.attempts ?? 0) >= currentCycle
    }).length

    return (
      <KidLayout>
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <div className="text-5xl mb-3">🎓</div>
            <h1 className="text-2xl font-extrabold text-gray-900">Certificat de mise en route</h1>
            <p className="text-gray-500 font-medium mt-2">
              Complétez les {modules.length} modules pour obtenir votre certificat.
            </p>
            {currentCycle === 2 && (
              <p className="text-xs font-bold mt-1" style={{ color: '#EF4444' }}>
                ⚠️ Deuxième tentative en cours — dernière chance d'atteindre {PASS_SCORE}%
              </p>
            )}
          </div>

          {/* Overall progress bar */}
          <div className="bg-white rounded-3xl border-2 p-6 shadow-sm mb-6" style={{ borderColor: '#93C5FD' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-400">Votre progression</h2>
              <span className="text-sm font-extrabold" style={{ color: '#1E3A5F' }}>
                {doneLessons} / {ALL_LESSONS.length} leçons
              </span>
            </div>

            <div className="mb-6">
              <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EFF6FF' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(doneLessons / ALL_LESSONS.length) * 100}%`, background: 'linear-gradient(90deg,#1E3A5F,#1D4ED8)' }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {modules.map(module => (
                <div
                  key={module.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 transition-all"
                  style={{
                    borderColor: module.complete ? module.border : '#E5E7EB',
                    backgroundColor: module.complete ? module.bg : '#FAFAFA',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ backgroundColor: module.complete ? module.bg : '#F3F4F6' }}
                  >
                    {module.complete ? '✅' : module.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-extrabold text-gray-800">{module.name}</span>
                      <span className="text-xs font-bold" style={{ color: module.complete ? module.color : '#9CA3AF' }}>
                        {module.done}/{module.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: module.complete ? module.bg : '#E5E7EB' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${module.pct}%`, backgroundColor: module.color }}
                      />
                    </div>
                  </div>
                  {module.complete && (
                    <span className="text-xs font-extrabold px-2 py-1 rounded-lg text-white shrink-0" style={{ backgroundColor: module.color }}>
                      ✓ Complété
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/medecin/lessons')}
            className="w-full py-4 rounded-2xl text-white font-extrabold text-sm transition-all"
            style={{ backgroundColor: '#1E3A5F', boxShadow: '0 4px 16px rgba(30,58,95,0.30)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
          >
            Continuer ma formation →
          </button>
        </div>
      </KidLayout>
    )
  }

  // ── All quizzes done but score < 80% — not eligible ──────────────────────────
  if (!hasPassed) {
    return (
      <KidLayout>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#EF4444' }}>
            Certificat non disponible
          </h1>
          <p className="text-sm text-gray-500 mb-1 max-w-sm">
            Vous avez complété tous les modules, mais votre score global est insuffisant.
          </p>
          <div className="text-4xl font-extrabold my-4" style={{ color: '#EF4444' }}>
            {totalCorrect}/{totalQuestions} — {globalPct}%
          </div>
          <p className="text-sm font-bold mb-2" style={{ color: '#EF4444' }}>
            La note de passage est de {PASS_SCORE}%.
          </p>
          {currentCycle === 1 && (
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Vous pouvez repasser l'ensemble des quiz une dernière fois.
              Retournez aux protocoles pour commencer votre 2ème tentative.
            </p>
          )}
          {currentCycle === 2 && (
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Vous avez utilisé vos 2 tentatives. Contactez l'administrateur pour
              débloquer votre accès.
            </p>
          )}
          <button
            onClick={() => navigate('/medecin/lessons')}
            className="px-8 py-3 rounded-2xl text-white font-extrabold"
            style={{ backgroundColor: '#1E3A5F' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
          >
            Retour aux protocoles
          </button>
        </div>
      </KidLayout>
    )
  }

  // ── Passed ≥ 80% — show the certificate ──────────────────────────────────────
  return (
    <KidLayout>
      <div className="no-print flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">🎓 Votre certificat</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Score global : {totalCorrect}/{totalQuestions} ({globalPct}%) — Félicitations !
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
          style={{ backgroundColor: '#1E3A5F' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#162C48')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1E3A5F')}
        >
          🖨 Imprimer / Télécharger
        </button>
      </div>

      {/* Certificate card */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl mx-auto max-w-2xl overflow-hidden"
        style={{ boxShadow: '0 8px 40px rgba(30,58,95,0.18)', border: '2px solid #BFDBFE' }}
      >
        {/* Header band */}
        <div className="px-8 py-6 text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)' }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-white/20">💉</div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">Ivitaminacademy</div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-200">Guide pratique médecin</div>
            </div>
          </div>
        </div>

        {/* Certificate body */}
        <div className="px-8 py-8 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-gray-400 mb-3">
            Certificat de mise en route
          </p>
          <p className="text-lg font-semibold text-gray-500 mb-2">Ce certificat est décerné à</p>
          <h2
            className="text-4xl font-extrabold mb-2 py-2 border-b-2 border-dashed inline-block px-6"
            style={{ color: '#1E3A5F', borderColor: '#BFDBFE' }}
          >
            {name}
          </h2>
          <p className="mt-4 text-base font-medium text-gray-600 max-w-md mx-auto leading-relaxed">
            pour avoir complété avec succès la formation
            <br />
            <span className="font-extrabold" style={{ color: '#1E3A5F' }}>
              Perfusions de vitamines IV — Guide pratique médecin
            </span>
          </p>

          {/* Score badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full font-extrabold text-white text-sm"
            style={{ background: 'linear-gradient(90deg, #065F46, #059669)' }}>
            Score global : {totalCorrect}/{totalQuestions} — {globalPct}%
          </div>

          {certDate && (
            <p className="mt-4 text-sm text-gray-400 font-semibold">
              Le {formatDate(certDate)}
            </p>
          )}

          {/* Module list */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-left">
            {modules.map(module => (
              <div
                key={module.id}
                className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{ backgroundColor: module.bg, border: `1px solid ${module.border}` }}
              >
                <span className="text-lg">{module.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold truncate" style={{ color: module.color }}>{module.name}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">{module.total} leçons ✓</div>
                </div>
                <span className="text-green-600 font-extrabold text-sm">✓</span>
              </div>
            ))}
          </div>

          {/* Signature lines */}
          <div className="mt-8 flex justify-center gap-16">
            <div className="text-center">
              <div className="w-32 border-b-2 border-gray-300 mb-1" />
              <div className="text-xs text-gray-400 font-semibold">Médecin formé</div>
            </div>
            <div className="text-center">
              <div className="w-32 border-b-2 border-gray-300 mb-1" />
              <div className="text-xs text-gray-400 font-semibold">Superviseur</div>
            </div>
          </div>
        </div>

        {/* Footer band */}
        <div className="px-8 py-4 border-t text-center" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <p className="text-xs font-semibold" style={{ color: '#1E3A5F' }}>
            Ivitaminacademy · Perfusions de vitamines IV · Guide pratique médecin · 2026
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </KidLayout>
  )
}
