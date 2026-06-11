import { useEffect, useState } from 'react'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { getChildren } from '../services/family'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

const ACCENT = '#0F2847'

function LessonRow({ lesson, index, topicColor, topicName, done, onOpen }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white shrink-0"
          style={{ backgroundColor: done ? '#1E3A5F' : topicColor }}
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
        onClick={() => onOpen(lesson, topicColor, topicName)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold text-white shadow-sm hover:brightness-110 transition"
        style={{ backgroundColor: topicColor }}
      >
        📖 Corrigé
      </button>
    </div>
  )
}

function TopicPanel({ topic, progressMap, onOpen }) {
  const lessons = topic.lessons || []
  const done    = lessons.filter(l => progressMap[l.id]?.completed).length
  const total   = lessons.length
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0
  const color   = topic.color || ACCENT
  const bg      = topic.bg || '#EFF6FF'

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: topic.border || '#BFDBFE' }}>
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
            topicName={topic.name}
            done={!!progressMap[lesson.id]?.completed}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  )
}

function LessonAnswersModal({ lesson, child, progress, accent = ACCENT, topicName, onClose }) {
  useEffect(() => {
    if (!lesson) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [lesson, onClose])

  if (!lesson) return null
  const quiz      = lesson.quiz || []
  const total     = quiz.length
  const completed = !!progress?.completed
  const hasScore  = completed && progress?.score != null
  const correct   = hasScore ? Number(progress.score) : null
  const pct       = hasScore && total > 0 ? Math.round((correct / total) * 100) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {topicName && (
                <span className="inline-block text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/20 mb-1.5">
                  {topicName}
                </span>
              )}
              <h2 className="text-xl font-extrabold leading-tight">📖 {lesson.title}</h2>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1.5 text-xs font-semibold text-white/90">
                <span>{total} question{total === 1 ? '' : 's'}</span>
                {lesson.time ? <span>· ~{lesson.time} min</span> : null}
                {child ? <span>· {child.name}</span> : null}
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/20 text-2xl leading-none"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          {/* Score / status */}
          <div className="mt-4">
            {hasScore ? (
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Score : {correct}/{total}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/25 overflow-hidden">
                  <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ) : (
              <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20">
                {child ? 'Pas encore tenté' : 'Liez un médecin pour voir son score'}
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4" style={{ backgroundColor: '#FAFAFA' }}>
          {total === 0 ? (
            <p className="text-sm text-gray-400 font-medium">Aucune question disponible pour cette leçon.</p>
          ) : quiz.map((q, i) => (
            <div key={i} className="rounded-xl border bg-white p-4" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-bold text-gray-800">{q.text}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {(q.options || []).map((opt, j) => {
                  const isCorrect = opt === q.correct
                  return (
                    <div
                      key={j}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-semibold"
                      style={isCorrect
                        ? { backgroundColor: '#EFF6FF', color: '#1E3A5F', border: '1px solid #93C5FD' }
                        : { backgroundColor: '#F8FAFC', color: '#94A3B8', border: '1px solid #E2E8F0' }}
                    >
                      <span>{opt}</span>
                      {isCorrect && <span className="text-[10px] font-extrabold uppercase tracking-wide">✓ Correct</span>}
                    </div>
                  )
                })}
              </div>
              {q.hint && (
                <div className="flex gap-1.5 text-xs text-gray-500 mb-1.5">
                  <span>💡</span>
                  <span><span className="font-bold">Indice :</span> {q.hint}</span>
                </div>
              )}
              {q.explanation && (
                <div className="flex gap-1.5 text-xs rounded-lg px-3 py-2" style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}>
                  <span>✅</span>
                  <span><span className="font-bold">Explication :</span> {q.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-between" style={{ borderColor: '#E5E7EB' }}>
          <span className="text-xs text-gray-400 font-medium">Appuyez sur Échap pour fermer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ParentLessons() {
  const { user } = useAuth()

  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [progressMap, setProgressMap]     = useState({})
  const [loading, setLoading]             = useState(true)

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null
  const topics      = curriculum[1] || []

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

  const [openLesson, setOpenLesson] = useState(null)
  const [openMeta, setOpenMeta]     = useState({ color: ACCENT, topicName: '' })

  const handleOpen = (lesson, color, topicName) => {
    setOpenMeta({ color: color || ACCENT, topicName: topicName || '' })
    setOpenLesson(lesson)
  }

  return (
    <ParentLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">💉 Protocoles &amp; Guides</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {activeChild
              ? `Progression de ${activeChild.name} · cliquez sur "Corrigé" pour consulter les réponses`
              : 'Cliquez sur "Corrigé" pour consulter le guide de chaque leçon'}
          </p>
        </div>
        {children.length > 1 && (
          <select
            value={activeChild?.id ?? ''}
            onChange={e => setActiveChildId(e.target.value)}
            className="px-3 py-2 rounded-xl text-sm font-bold border-2 bg-white"
            style={{ borderColor: '#BFDBFE', color: '#0F2847' }}
          >
            {children.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {!activeChild && !loading && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}>
          Aucun médecin lié — liez-en un dans votre Profil pour voir sa progression.
        </div>
      )}

      {/* Topic grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topics.map(topic => (
            <TopicPanel key={topic.id} topic={topic} progressMap={progressMap} onOpen={handleOpen} />
          ))}
        </div>
      )}

      <LessonAnswersModal
        lesson={openLesson}
        child={activeChild}
        progress={openLesson ? progressMap[openLesson.id] : null}
        accent={openMeta.color}
        topicName={openMeta.topicName}
        onClose={() => setOpenLesson(null)}
      />
    </ParentLayout>
  )
}
