import { useEffect, useState } from 'react'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { getChildren } from '../services/family'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

const ALL_GRADES = [4, 5]

function relativeDate(iso) {
  if (!iso) return '—'
  const diff = Math.floor((Date.now() - new Date(iso)) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

function computeReport(progressMap, grade) {
  const topicsData = curriculum[grade] || []
  let totalLessons = 0, lessonsCompleted = 0
  let questionsCorrect = 0, questionsAnswered = 0
  let mastered = 0, proficient = 0, needsPractice = 0
  let lastActivity = null
  let lessonsThisWeek = 0
  const allPcts = []
  const quizHistory = []
  const reviewList = []
  const recommended = []
  const weekAgo = Date.now() - 7 * 86400000

  const topics = topicsData.map(t => {
    const lessons = t.lessons || []
    let dT = 0, qT = 0, attemptsT = 0
    const tPcts = []
    lessons.forEach(l => {
      totalLessons++
      const r = progressMap[l.id]
      if (r?.completed) {
        dT++; lessonsCompleted++
        if (r.last_date) {
          if (!lastActivity || new Date(r.last_date) > new Date(lastActivity)) lastActivity = r.last_date
          if (new Date(r.last_date).getTime() >= weekAgo) lessonsThisWeek++
        }
      } else if (recommended.length < 4) {
        recommended.push({ id: l.id, name: l.title, topic: t.name, icon: t.icon })
      }
      if (r?.completed && r.score != null) {
        const total    = l.questions || 1
        const score    = Math.min(r.score, total)
        const pct      = Math.round((score / total) * 100)
        const attempts = r.attempts || 1
        qT++; tPcts.push(pct); allPcts.push(pct)
        attemptsT += attempts
        questionsCorrect += score
        questionsAnswered += total
        if (pct >= 90) mastered++
        else if (pct >= 70) proficient++
        else needsPractice++
        quizHistory.push({ id: l.id, name: l.title, topic: t.name, score, total, pct, attempts, date: r.last_date })
        if (pct < 70 || attempts >= 3) {
          reviewList.push({ id: l.id, name: l.title, topic: t.name, icon: t.icon, score, total, pct, attempts, date: r.last_date })
        }
      }
    })
    const totalL   = lessons.length
    const progress = totalL > 0 ? Math.round((dT / totalL) * 100) : 0
    const avgScore = tPcts.length ? Math.round(tPcts.reduce((a, b) => a + b, 0) / tPcts.length) : null
    return { name: t.name, icon: t.icon, progress, lessonsD: dT, totalL, quizzes: qT, avgScore, attempts: attemptsT }
  })

  quizHistory.sort((a, b) => new Date(b.date) - new Date(a.date))
  reviewList.sort((a, b) => a.pct - b.pct || b.attempts - a.attempts)

  const scoredTopics = topics.filter(t => t.avgScore != null)
  const strongest = scoredTopics.length ? scoredTopics.reduce((a, b) => (b.avgScore > a.avgScore ? b : a)) : null
  const weakest   = scoredTopics.length ? scoredTopics.reduce((a, b) => (b.avgScore < a.avgScore ? b : a)) : null
  const daysSinceActive = lastActivity ? Math.floor((Date.now() - new Date(lastActivity)) / 86400000) : null

  return {
    overall:          totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0,
    lessonsCompleted,
    totalLessons,
    quizzesTaken:     allPcts.length,
    avgScore:         allPcts.length ? Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length) : 0,
    questionsCorrect,
    questionsAnswered,
    accuracy:         questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0,
    mastered,
    proficient,
    needsPractice,
    lastActivity,
    daysSinceActive,
    lessonsThisWeek,
    strongest,
    weakest,
    topics,
    quizHistory:      quizHistory.slice(0, 8),
    reviewList:       reviewList.slice(0, 6),
    recommended,
  }
}

function progressColor(pct) {
  if (pct >= 50) return '#2D7A4F'
  if (pct >= 20) return '#E07B00'
  return '#CC2222'
}

function scoreColor(pct) {
  if (pct >= 80) return '#2D7A4F'
  if (pct >= 60) return '#E07B00'
  return '#CC2222'
}

const TONE_STYLES = {
  good: { bg: '#F0FAF4', border: '#2D7A4F', color: '#2D7A4F' },
  warn: { bg: '#FFF7ED', border: '#E07B00', color: '#9A6700' },
  info: { bg: '#EFF6FF', border: '#3B82F6', color: '#1D4ED8' },
}

function MasteryStat({ label, sub, value, color }) {
  return (
    <div className="rounded-xl p-3 text-center" style={{ backgroundColor: `${color}10`, border: `1px solid ${color}33` }}>
      <div className="text-2xl font-extrabold" style={{ color }}>{value}</div>
      <div className="text-xs font-bold text-gray-700 mt-1">{label}</div>
      <div className="text-[11px] text-gray-400 font-medium">{sub}</div>
    </div>
  )
}

function StatCard({ value, sub, label, color, highlight }) {
  return (
    <div
      className="flex-1 bg-white rounded-2xl border p-5 shadow-sm"
      style={{ borderColor: highlight ? color : '#C8E6D4', borderWidth: highlight ? 2 : 1 }}
    >
      <div className="text-3xl font-extrabold" style={{ color: color || '#1a1a2e' }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 font-semibold mt-0.5">{sub}</div>}
      <div className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-2">{label}</div>
    </div>
  )
}

function WeakAlert({ topic }) {
  return (
    <div
      className="flex items-center gap-3 p-3 rounded-xl border-l-4 text-sm"
      style={{ backgroundColor: '#FFF7ED', borderColor: '#E07B00' }}
    >
      <span className="text-lg">{topic.icon}</span>
      <div className="flex-1">
        <span className="font-bold text-orange-800">{topic.name}</span>
        <span className="text-orange-600"> — {topic.progress}% complete, avg score {topic.avgScore ?? 'N/A'}%</span>
      </div>
      <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wide">Needs work</span>
    </div>
  )
}

export default function ParentReports() {
  const { user } = useAuth()

  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [progressMap, setProgressMap]     = useState({})
  const [loading, setLoading]             = useState(true)
  const [selectedGrade, setSelectedGrade] = useState(null)

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null

  // Which grades have progress data for this child?
  const activeGrades = (() => {
    const proms = Object.keys(progressMap).map(Number).filter(n => !isNaN(n))
    if (proms.length === 0) return ALL_GRADES
    const found = new Set()
    proms.forEach(lessonId => {
      for (const g of ALL_GRADES) {
        const topics = curriculum[g] || []
        if (topics.some(t => (t.lessons || []).some(l => l.id === lessonId))) {
          found.add(g)
        }
      }
    })
    return found.size > 0 ? [...found].sort((a, b) => a - b) : ALL_GRADES
  })()

  const grade = selectedGrade ?? (activeGrades.includes(activeChild?.grade) ? activeChild?.grade : activeGrades[0] ?? 4)

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getChildren(user.id)
      .then(kids => {
        setChildren(kids)
        setActiveChildId(prev => (prev && kids.some(k => k.id === prev)) ? prev : (kids[0]?.id ?? null))
      })
      .catch(err => console.error('[ParentReports] children', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    if (!activeChild?.id) { setProgressMap({}); return }
    getProgressMap(activeChild.id)
      .then(setProgressMap)
      .catch(err => console.error('[ParentReports] progress', err))
  }, [activeChild?.id])

  useEffect(() => { setSelectedGrade(null) }, [activeChild?.id])

  const stats       = computeReport(progressMap, grade)
  const topics      = stats.topics
  const quizHistory = stats.quizHistory
  const weakTopics  = topics.filter(t => (t.avgScore != null && t.avgScore < 70) || (t.lessonsD > 0 && t.progress < 40))
  const streak      = activeChild?.streak_days ?? 0
  const name        = activeChild?.name || 'Your child'

  const insights = []
  if (stats.lessonsCompleted === 0) {
    insights.push({ tone: 'info', text: `${name} hasn't completed any lessons yet — start with the first lesson to begin tracking progress.` })
  } else {
    if (stats.strongest) insights.push({ tone: 'good', text: `Strongest area: ${stats.strongest.name} (avg ${stats.strongest.avgScore}%).` })
    if (stats.weakest && (!stats.strongest || stats.weakest.name !== stats.strongest.name)) insights.push({ tone: 'warn', text: `Needs the most help: ${stats.weakest.name} (avg ${stats.weakest.avgScore}%).` })
    insights.push({ tone: 'info', text: `Overall accuracy ${stats.accuracy}% — ${stats.questionsCorrect} of ${stats.questionsAnswered} questions answered correctly.` })
    if (stats.mastered > 0) insights.push({ tone: 'good', text: `${stats.mastered} lesson${stats.mastered > 1 ? 's' : ''} mastered with 90%+ scores.` })
    if (stats.reviewList.length > 0) insights.push({ tone: 'warn', text: `${stats.reviewList.length} lesson${stats.reviewList.length > 1 ? 's' : ''} need review (low score or repeated attempts).` })
    if (stats.daysSinceActive != null && stats.daysSinceActive >= 5) insights.push({ tone: 'warn', text: `No activity for ${stats.daysSinceActive} days — a short session would help.` })
    else if (stats.lessonsThisWeek > 0) insights.push({ tone: 'good', text: `${stats.lessonsThisWeek} lesson${stats.lessonsThisWeek > 1 ? 's' : ''} completed in the last 7 days — nice momentum!` })
  }

  if (!loading && !activeChild) {
    return (
      <ParentLayout>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Reports</h1>
        <div className="mt-4 px-4 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: '#FFF7ED', color: '#9A6700' }}>
          No child linked yet — link one on your Profile to see their report.
        </div>
      </ParentLayout>
    )
  }

  return (
    <ParentLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {activeChild ? `${activeChild.name} — Grade ${grade}${stats.lastActivity ? ` · Last active ${relativeDate(stats.lastActivity)}` : ''}` : 'Loading…'}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Grade selector */}
          {activeGrades.length > 1 && (
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              {activeGrades.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className="px-4 py-1.5 rounded-lg text-xs font-extrabold transition-colors"
                  style={
                    grade === g
                      ? { backgroundColor: '#2D7A4F', color: '#fff' }
                      : { backgroundColor: 'transparent', color: '#6B7280' }
                  }
                >
                  Grade {g}
                </button>
              ))}
            </div>
          )}
          {children.length > 1 && (
            <select
              value={activeChild?.id ?? ''}
              onChange={e => setActiveChildId(e.target.value)}
              className="px-3 py-2 rounded-xl text-sm font-bold border-2 bg-white"
              style={{ borderColor: '#C8E6D4', color: '#2D7A4F' }}
            >
              {children.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl text-sm font-bold border-2 text-gray-500 bg-white transition-colors"
            style={{ borderColor: '#C8E6D4' }}
          >
            ⬇ Export PDF
          </button>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatCard value={`${stats.overall}%`} label="Overall progress" color="#2D7A4F" highlight />
        <StatCard value={`${stats.lessonsCompleted}/${stats.totalLessons}`} label="Lessons completed" color="#1a1a2e" />
        <StatCard value={`${stats.avgScore}%`} label="Avg quiz score" color={scoreColor(stats.avgScore)} />
        <StatCard value={`${stats.accuracy}%`} sub={`${stats.questionsCorrect}/${stats.questionsAnswered} questions`} label="Accuracy" color={scoreColor(stats.accuracy)} />
        <StatCard value={`🔥 ${streak}`} label="Day streak" color="#E07B00" />
      </div>

      {/* ── Key Insights ── */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">📊 Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {insights.map((it, i) => {
              const s = TONE_STYLES[it.tone]
              return (
                <div key={i} className="p-3 rounded-xl border-l-4 text-sm" style={{ backgroundColor: s.bg, borderColor: s.border }}>
                  <span className="font-semibold" style={{ color: s.color }}>{it.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Quiz Mastery ── */}
      {stats.quizzesTaken > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Quiz Mastery — {stats.quizzesTaken} quiz{stats.quizzesTaken > 1 ? 'zes' : ''} taken</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MasteryStat label="Mastered" sub="90%+ correct" value={stats.mastered} color="#2D7A4F" />
            <MasteryStat label="Proficient" sub="70–89% correct" value={stats.proficient} color="#E07B00" />
            <MasteryStat label="Needs practice" sub="below 70%" value={stats.needsPractice} color="#CC2222" />
          </div>
          <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
            <div style={{ width: `${(stats.mastered / stats.quizzesTaken) * 100}%`, backgroundColor: '#2D7A4F' }} />
            <div style={{ width: `${(stats.proficient / stats.quizzesTaken) * 100}%`, backgroundColor: '#E07B00' }} />
            <div style={{ width: `${(stats.needsPractice / stats.quizzesTaken) * 100}%`, backgroundColor: '#CC2222' }} />
          </div>
        </div>
      )}

      {/* ── Weak Area Alerts ── */}
      {weakTopics.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#FCD34D' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-orange-400 mb-3">
            ⚠ Weak Area Alerts — {weakTopics.length} topic{weakTopics.length > 1 ? 's' : ''} need attention
          </h2>
          <div className="flex flex-col gap-2">
            {weakTopics.map(t => <WeakAlert key={t.name} topic={t} />)}
          </div>
        </div>
      )}

      {/* ── Lessons to Review ── */}
      {stats.reviewList.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#FCA5A5' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-red-400 mb-3">🔁 Lessons to Review — focus here</h2>
          <div className="flex flex-col gap-2">
            {stats.reviewList.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#FEF2F2' }}>
                <span className="text-lg">{r.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{r.name}</div>
                  <div className="text-xs text-gray-400 font-medium">{r.topic} · {relativeDate(r.date)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold" style={{ color: scoreColor(r.pct) }}>{r.pct}%</div>
                  <div className="text-[11px] text-gray-400 font-semibold">{r.score}/{r.total} · {r.attempts} attempt{r.attempts > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 font-medium mt-3">Tip: open the lesson's 📖 Answer Key on the Lessons page to review the questions together.</p>
        </div>
      )}

      {/* ── Recommended Next ── */}
      {stats.recommended.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 shadow-sm mb-5" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">⏭ Recommended Next Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {stats.recommended.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#F0FAF4' }}>
                <span className="text-lg">{r.icon}</span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-gray-800 truncate">{r.name}</div>
                  <div className="text-xs text-gray-400 font-medium">{r.topic}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Two column ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* Left — Topic Breakdown */}
        <div className="flex-1 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Topic Breakdown — Grade {grade}</h2>
          {topics.length === 0 ? (
            <p className="text-sm text-gray-400 font-medium">No lessons for this grade yet.</p>
          ) : (
          <div className="flex flex-col gap-4">
            {topics.map(topic => {
              const color = progressColor(topic.progress)
              return (
                <div key={topic.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{topic.icon}</span>
                      <span className="text-sm font-bold text-gray-800">{topic.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                      <span>{topic.lessonsD}/{topic.totalL} lessons</span>
                      <span>{topic.quizzes} quizzes</span>
                      {topic.avgScore !== null && (
                        <span style={{ color: scoreColor(topic.avgScore) }}>avg {topic.avgScore}%</span>
                      )}
                      <span className="font-extrabold" style={{ color }}>{topic.progress}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.progress}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          )}
        </div>

        {/* Right — Quiz History */}
        <div className="w-full lg:w-80 bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">Recent Quizzes</h2>
          {quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm text-gray-400 font-semibold">No quizzes yet</p>
            </div>
          ) : (
          <div className="flex flex-col gap-3">
            {quizHistory.map(quiz => {
              const color = scoreColor(quiz.pct)
              return (
                <div key={quiz.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#F0FAF4' }}>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {quiz.score}/{quiz.total}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800 truncate">{quiz.name}</div>
                    <div className="text-xs text-gray-400 font-medium">{relativeDate(quiz.date)} · {quiz.pct}% · {quiz.attempts} attempt{quiz.attempts > 1 ? 's' : ''}</div>
                  </div>
                  {quiz.pct >= 90 && <span title="Top score">🏅</span>}
                </div>
              )
            })}
          </div>
          )}
        </div>
      </div>
    </ParentLayout>
  )
}
