import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/auth'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

// Badge catalog — `check(stats)` decides if it is earned from real DB progress
const BADGE_DEFS = [
  { id: 1, icon: '⭐', name: 'Quick Learner', desc: 'Complete 5 lessons',     color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', check: s => s.doneCount >= 5 },
  { id: 2, icon: '🔥', name: 'On Fire',       desc: '5-day streak',           color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5', check: s => s.streak >= 5 },
  { id: 3, icon: '🎯', name: 'Accurate',      desc: 'Score 100% on a quiz',  color: '#16A34A', bg: '#DCFCE7', border: '#86EFAC', check: s => s.perfectAny },
  { id: 4, icon: '🚀', name: 'Rocket Start',  desc: 'Complete a full topic',  color: '#A855F7', bg: '#FAF5FF', border: '#D8B4FE', check: s => s.fullTopicAny },
  { id: 5, icon: '💎', name: 'Diamond',       desc: '10-day streak',          color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD', check: s => s.streak >= 10 },
  { id: 6, icon: '🏆', name: 'Champion',      desc: 'Complete the whole grade', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', check: s => s.gradeComplete },
]

const LOCKED = { color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' }

const AVATAR_OPTIONS = [
  '😀', '😎', '🤓', '😊', '🥳',
  '🦊', '🐱', '🐶', '🐼', '🐨',
  '🦁', '🐯', '🐸', '🐵', '🐰',
  '🦄', '🐻', '🐧', '🐢', '🐬'
]

function computeStats(progressMap, grade) {
  const topics     = curriculum[grade] || []
  const allLessons = topics.flatMap(t => t.lessons)
  const doneCount  = allLessons.filter(l => progressMap[l.id]?.completed).length
  const perfectAny = allLessons.some(l => {
    const r = progressMap[l.id]
    return r?.completed && r.score != null && r.score >= l.questions
  })
  const fullTopicAny  = topics.some(t => t.lessons.length > 0 && t.lessons.every(l => progressMap[l.id]?.completed))
  const gradeComplete = allLessons.length > 0 && allLessons.every(l => progressMap[l.id]?.completed)
  return { doneCount, perfectAny, fullTopicAny, gradeComplete }
}

const settingsItems = [
  { icon: '✏️', label: 'Edit Profile',     desc: 'Change your name or avatar' },
  { icon: '🔔', label: 'Notifications',    desc: 'Daily learning reminders'   },
  { icon: '🔒', label: 'Privacy & Policy', desc: 'Data & privacy info', to: '/privacy' },
  { icon: '❓', label: 'Help & FAQ',       desc: 'Get help or read the FAQ', to: '/faq' },
]

export default function KidProfile() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [parentMode, setParentMode]   = useState(false)
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading]         = useState(true)

  // Edit Profile modal state
  const [editing, setEditing]       = useState(false)
  const [editName, setEditName]     = useState('')
  const [editAvatar, setEditAvatar] = useState('🧒')
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState('')
  const [copied, setCopied]         = useState(false)

  const grade = profile?.grade ?? 4

  const userWithProfile = {
    name:   profile?.name   ?? 'there',
    grade,
    avatar: profile?.avatar ?? '🧒',
    streak: profile?.streak_days ?? 0,
  }

  useEffect(() => {
    if (!user?.id) { setLoading(false); return }
    getProgressMap(user.id)
      .then(setProgressMap)
      .catch(err => console.error('[KidProfile]', err))
      .finally(() => setLoading(false))
  }, [user?.id])

  useEffect(() => {
    function onProgress() { if (user?.id) getProgressMap(user.id).then(setProgressMap) }
    function onStreak()   { refreshProfile?.() }
    window.addEventListener('progressUpdated', onProgress)
    window.addEventListener('streakUpdated',   onStreak)
    return () => {
      window.removeEventListener('progressUpdated', onProgress)
      window.removeEventListener('streakUpdated',   onStreak)
    }
  }, [user?.id, refreshProfile])

  const badges = useMemo(() => {
    const stats = { ...computeStats(progressMap, grade), streak: userWithProfile.streak }
    return BADGE_DEFS.map(b => {
      const earned = b.check(stats)
      return {
        ...b,
        earned,
        color:  earned ? b.color  : LOCKED.color,
        bg:     earned ? b.bg     : LOCKED.bg,
        border: earned ? b.border : LOCKED.border,
      }
    })
  }, [progressMap, grade, userWithProfile.streak])

  function handleToggle() {
    setParentMode(v => !v)
    if (!parentMode) navigate('/parent/dashboard')
  }

  function openEdit() {
    setEditName(profile?.name ?? '')
    setEditAvatar(profile?.avatar ?? '🧒')
    setSaveError('')
    setEditing(true)
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    if (!user?.id) { setSaveError('You must be signed in.'); return }
    const name = editName.trim()
    if (!name) { setSaveError('Please enter a name.'); return }
    setSaving(true)
    setSaveError('')
    try {
      await updateProfile(user.id, { name, avatar: editAvatar })
      await refreshProfile?.()
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <KidLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">👤 Profile</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Avatar card */}
          <div className="bg-white rounded-2xl border-2 p-6 flex flex-col items-center text-center shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 border-4"
              style={{ backgroundColor: '#DCFCE7', borderColor: '#16A34A' }}
            >
              {userWithProfile.avatar}
            </div>
            <div className="font-extrabold text-gray-900 text-lg">{userWithProfile.name}</div>
            <div
              className="mt-1 px-3 py-1 rounded-full text-xs font-extrabold"
              style={{ backgroundColor: '#FFF7ED', color: '#F97316' }}
            >
              Grade {userWithProfile.grade} · Kid Mode
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-bold" style={{ color: '#EF4444' }}>
              🔥 {userWithProfile.streak}-day streak
            </div>
          </div>

          {/* Link code — share with parent */}
          {profile?.link_code && (
            <div className="bg-white rounded-2xl border-2 p-4 shadow-sm" style={{ borderColor: '#86EFAC' }}>
              <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">
                🔗 Parent Link Code
              </div>
              <div className="flex items-center gap-2">
                <code
                  className="flex-1 text-center text-lg font-extrabold tracking-[0.3em] py-2 rounded-xl"
                  style={{ backgroundColor: '#F0FDF4', color: '#16A34A' }}
                >
                  {profile.link_code}
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(profile.link_code)
                    setCopied(true)
                    setTimeout(() => setCopied(false), 1500)
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-extrabold text-white shrink-0"
                  style={{ backgroundColor: copied ? '#16A34A' : '#EC4899' }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-2">
                Give this code to your parent so they can follow your progress.
              </p>
            </div>
          )}

          {/* Parent mode toggle */}
          <div className="bg-white rounded-2xl border-2 p-4 shadow-sm flex items-center justify-between" style={{ borderColor: '#86EFAC' }}>
            <div>
              <div className="text-sm font-extrabold text-gray-800">Switch to Parent Mode</div>
              <div className="text-xs text-gray-400 font-medium">For a parent or guardian</div>
            </div>
            <button
              onClick={handleToggle}
              className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
              style={{ backgroundColor: parentMode ? '#16A34A' : '#D1D5DB' }}
            >
              <span
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: parentMode ? '28px' : '4px' }}
              />
            </button>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#DCFCE7' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Account</span>
            </div>
            {settingsItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.to) navigate(item.to)
                  else if (item.label === 'Edit Profile') openEdit()
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b last:border-0 transition-colors"
                style={{ borderColor: '#F0FDF4' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400 font-medium">{item.desc}</div>
                </div>
                <span className="text-gray-300">›</span>
              </button>
            ))}
          </div>

          {/* Log out */}
          <button
            onClick={async () => { try { await signOut() } catch {} ; navigate('/') }}
            className="w-full py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors"
            style={{ borderColor: '#FCA5A5', color: '#EF4444', backgroundColor: '#FFF5F5' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
          >
            ← Log Out
          </button>
        </div>

        {/* ── Right column — Badges ── */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#86EFAC' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">🏆 My Badges</h2>
              <span className="text-xs font-bold text-gray-400">
                {badges.filter(b => b.earned).length} / {badges.length} earned
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {loading
                ? [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />)
                : badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200"
                  style={{
                    borderColor: badge.border,
                    backgroundColor: badge.bg,
                    opacity: badge.earned ? 1 : 0.5,
                  }}
                >
                  <div className="text-4xl mb-3" style={{ filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div className="text-sm font-extrabold text-gray-800 mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-400 font-medium leading-snug">{badge.desc}</div>
                  {badge.earned
                    ? <div className="mt-3 px-3 py-1 rounded-full text-xs font-extrabold text-white" style={{ backgroundColor: badge.color }}>✓ Earned</div>
                    : <div className="mt-3 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-400">🔒 Locked</div>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ── Edit Profile modal ── */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
          onClick={() => !saving && setEditing(false)}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSaveProfile}
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl border-2"
            style={{ borderColor: '#86EFAC' }}
          >
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">Edit Profile</h3>
            <p className="text-xs text-gray-400 font-medium mb-5">Change your name or avatar</p>

            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4"
                style={{ backgroundColor: '#DCFCE7', borderColor: '#16A34A' }}
              >
                {editAvatar}
              </div>
            </div>

            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Choose avatar</label>
            <div className="grid grid-cols-6 gap-2 mt-2 mb-4">
              {AVATAR_OPTIONS.map(a => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setEditAvatar(a)}
                  className="aspect-square rounded-xl text-2xl flex items-center justify-center border-2 transition-all"
                  style={
                    editAvatar === a
                      ? { borderColor: '#16A34A', backgroundColor: '#DCFCE7' }
                      : { borderColor: '#E5E7EB', backgroundColor: '#fff' }
                  }
                >
                  {a}
                </button>
              ))}
            </div>

            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Name</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              maxLength={40}
              placeholder="Your name"
              className="w-full mt-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold text-gray-800 outline-none"
              style={{ borderColor: '#86EFAC' }}
            />

            {saveError && (
              <p className="text-xs font-semibold mt-3" style={{ color: '#EF4444' }}>{saveError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-extrabold border-2 transition-colors"
                style={{ borderColor: '#E5E7EB', color: '#6B7280', backgroundColor: '#fff' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-colors"
                style={{ backgroundColor: saving ? '#86EFAC' : '#16A34A' }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </KidLayout>
  )
}
