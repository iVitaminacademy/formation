import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ParentLayout from '../components/ParentLayout'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/auth'
import { getChildren, linkChildByCode, unlinkChild } from '../services/family'
import { getProgressMap, getProgress } from '../services/progress'
import { supabase, isSupabaseConfigured } from '../services/supabaseClient'
import { curriculum } from '../data/curriculum'

const BADGE_DEFS = [
  { id: 1, icon: '⭐', name: 'Quick Learner', desc: 'Completed 5 lessons',       check: s => s.doneCount >= 5 },
  { id: 2, icon: '🔥', name: 'On Fire',       desc: '5-day streak',              check: s => s.streak >= 5 },
  { id: 3, icon: '🎯', name: 'Accurate',      desc: 'Scored 100% on a quiz',     check: s => s.perfectAny },
  { id: 4, icon: '🚀', name: 'Rocket Start',  desc: 'Completed a full topic',    check: s => s.fullTopicAny },
  { id: 5, icon: '💎', name: 'Diamond',       desc: '10-day streak',             check: s => s.streak >= 10 },
  { id: 6, icon: '🏆', name: 'Champion',      desc: 'Completed the whole grade', check: s => s.gradeComplete },
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
  const total   = allLessons.length
  const overall = total > 0 ? Math.round((doneCount / total) * 100) : 0
  return { doneCount, total, overall, perfectAny, fullTopicAny, gradeComplete }
}

const settingsItems = [
  { icon: '✏️', label: 'Edit Profile',     desc: 'Change your name or avatar' },
  { icon: '🔔', label: 'Notifications',    desc: 'Daily reminders & alerts'   },
  { icon: '🔒', label: 'Privacy & Policy', desc: 'Data usage & privacy info'  },
  { icon: '❓', label: 'Help & FAQ',       desc: 'Get help or read the FAQ', to: '/faq' },
]

const AVATAR_OPTIONS = [
  '👩', '👨', '🧑',
  '👩‍🦰', '👨‍🦰',
  '👩‍🦱', '👨‍🦱',
  '👩‍🦳', '👨‍🦳',
  '👩‍🦲', '👨‍🦲',
  '🧔', '🧔‍♀️', '🧔‍♂️',
  '🧕', '👳‍♀️', '👳‍♂️',
  '👵', '👴',
  '👱‍♀️', '👱‍♂️',
  '👩‍🏫', '👨‍🏫',
  '👩‍💼', '👨‍💼',
  '👩‍⚕️', '👨‍⚕️',
  '👩‍🔬', '👨‍🔬',
  '👩‍🎓', '👨‍🎓',
  '👩‍🚀', '👨‍🚀',
  '👩‍🍳', '👨‍🍳',
  '👸', '🤴',
  '🦸‍♀️', '🦸‍♂️',
  '🧙‍♀️', '🧙‍♂️',
  '🧝‍♀️', '🧝‍♂️',
  '🧛‍♀️', '🧛‍♂️'
]
export default function ParentProfile() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()

  // Edit Profile modal
  const [editing, setEditing]       = useState(false)
  const [editName, setEditName]     = useState('')
  const [editAvatar, setEditAvatar] = useState('👩')
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState('')

  // Linked children
  const [children, setChildren]           = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [loadingKids, setLoadingKids]     = useState(true)

  // Link form
  const [codeInput, setCodeInput] = useState('')
  const [linking, setLinking]     = useState(false)
  const [linkError, setLinkError] = useState('')

  // Active child's progress (for badges)
  const [progressMap, setProgressMap] = useState({})

  const account = {
    name:   profile?.name   || 'Parent',
    email:  profile?.email  || '',
    avatar: profile?.avatar || '👩',
  }

  const activeChild = children.find(c => c.id === activeChildId) || children[0] || null

  async function loadChildren() {
    if (!user?.id) { setLoadingKids(false); return }
    setLoadingKids(true)
    try {
      const kids = await getChildren(user.id)
      setChildren(kids)
      setActiveChildId(prev => (prev && kids.some(k => k.id === prev)) ? prev : (kids[0]?.id ?? null))
    } catch (err) {
      console.error('[ParentProfile] loadChildren', err)
    } finally {
      setLoadingKids(false)
    }
  }

  useEffect(() => { loadChildren() }, [user?.id])

  useEffect(() => {
    if (!activeChild?.id) { setProgressMap({}); return }
    getProgressMap(activeChild.id)
      .then(setProgressMap)
      .catch(err => console.error('[ParentProfile] progress', err))
  }, [activeChild?.id, user?.id])

  // Helper: find lesson title from local curriculum by numeric ref
  function findLessonTitle(ref) {
    const num = Number(ref)
    if (Number.isNaN(num)) return null
    for (const g of Object.values(curriculum)) {
      for (const topic of g) {
        const found = (topic.lessons || []).find(l => l.id === num)
        if (found) return found.title
      }
    }
    return null
  }

  // Notifications state
  const [notifications, setNotifications] = useState([])
  const [lastSeen, setLastSeen] = useState(null)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  const notificationKey = `parent_notifications_last_seen_${user?.id || 'guest'}_${activeChild?.id || 'all'}`

  function buildNotificationMessage(notification) {
    const lesson_ref = notification.payload?.lesson_ref ?? null
    const title = findLessonTitle(lesson_ref) || (lesson_ref ? `Lesson ${lesson_ref}` : 'Activity')
    return notification.payload?.completed
      ? `Completed \u201C${title}\u201D`
      : `Progress on \u201C${title}\u201D`
  }

  function normalizeNotificationRow(row) {
    return {
      id: row.id,
      child_id: row.child_id,
      lesson_ref: row.payload?.lesson_ref ?? null,
      score: row.payload?.score ?? null,
      last_date: row.created_at,
      message: buildNotificationMessage(row),
      read: row.read,
    }
  }

  async function loadNotifications(parentId, childId) {
    if (!parentId || !childId) {
      setNotifications([])
      setLastSeen(null)
      return
    }

    setLoadingNotifications(true)
    const saved = localStorage.getItem(notificationKey)
    setLastSeen(saved)

    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('notifications')
          .select('id, parent_id, child_id, type, payload, read, created_at')
          .eq('parent_id', parentId)
          .eq('child_id', childId)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications((data || []).map(normalizeNotificationRow))
      } else {
        const rows = await getProgress(childId)
        const items = (rows || [])
          .filter(r => !r.read)
          .slice(0, 50)
          .map(r => ({
            id: `${r.lesson_ref}_${r.last_date}`,
            child_id: childId,
            lesson_ref: r.lesson_ref,
            score: r.score,
            last_date: r.last_date,
            read: false,
            message: r.completed ? `Completed \u201C${findLessonTitle(r.lesson_ref) || `Lesson ${r.lesson_ref}`}\u201D` : `Progress on \u201C${findLessonTitle(r.lesson_ref) || `Lesson ${r.lesson_ref}`}\u201D`,
          }))
        setNotifications(items)
      }
    } catch (err) {
      console.error('[ParentProfile] notifications load', err)
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    loadNotifications(user?.id, activeChild?.id)
  }, [user?.id, activeChild?.id])

  // Realtime via Supabase (cross-device) + fallback to in-page event (same-browser)
  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id || !activeChild?.id) return

    const channel = supabase
      .channel(`parent-notify-${user.id}-${activeChild.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `parent_id=eq.${user.id}` }, payload => {
        const n = payload.new
        if (!n || String(n.child_id) !== String(activeChild.id) || n.read === true) return
        const item = normalizeNotificationRow(n)
        setNotifications(prev => [item, ...prev.filter(i => i.id !== item.id)].slice(0, 50))
      })
      .subscribe()

    const handler = (e) => {
      const d = e?.detail || {}
      const r = d.row
      if (!r) return
      const uid = r.user_id || r.userId || d.userId
      if (!uid || String(uid) !== String(activeChild?.id) || r.read === true) return
      const lesson_ref = r.lesson_ref ?? null
      const title = findLessonTitle(lesson_ref) || (lesson_ref ? `Lesson ${lesson_ref}` : 'Activity')
      const item = {
        id: `${r.lesson_ref}_${r.last_date || new Date().toISOString()}`,
        child_id: uid,
        lesson_ref: r.lesson_ref,
        score: r.score,
        last_date: r.last_date || new Date().toISOString(),
        read: false,
        message: r.completed ? `Completed \u201C${title}\u201D` : `Progress on \u201C${title}\u201D`,
      }
      setNotifications(prev => [item, ...prev.filter(i => i.id !== item.id)].slice(0, 50))
    }

    window.addEventListener('progressUpdated', handler)

    return () => {
      window.removeEventListener('progressUpdated', handler)
      try { supabase.removeChannel(channel) } catch (e) { /* ignore */ }
    }
  }, [user?.id, activeChild?.id])

  async function markAllRead() {
    if (!user?.id || !activeChild?.id) return
    const now = new Date().toISOString()
    localStorage.setItem(notificationKey, now)
    setLastSeen(now)

    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('parent_id', user.id)
          .eq('child_id', activeChild.id)
          .eq('read', false)
      }
      setNotifications([])
    } catch (err) {
      console.warn('[ParentProfile] markAllRead failed', err.message || err)
    }
  }

  const unreadCount = notifications.length

  const stats = useMemo(
    () => ({ ...computeStats(progressMap, activeChild?.grade ?? 4), streak: activeChild?.streak_days ?? 0 }),
    [activeChild, progressMap],
  )

  const badges = useMemo(() => {
    if (!activeChild) return BADGE_DEFS.map(b => ({ ...b, earned: false }))
    return BADGE_DEFS.map(b => ({ ...b, earned: b.check(stats) }))
  }, [activeChild, stats])

  async function handleLink(e) {
    e.preventDefault()
    const code = codeInput.trim()
    if (!code) { setLinkError('Enter a code.'); return }
    setLinking(true)
    setLinkError('')
    try {
      const child = await linkChildByCode(code)
      setCodeInput('')
      await loadChildren()
      if (child?.id) setActiveChildId(child.id)
    } catch (err) {
      setLinkError(err.message || 'Could not link that code.')
    } finally {
      setLinking(false)
    }
  }

  async function handleUnlink(childId) {
    if (!user?.id) return
    try {
      await unlinkChild(user.id, childId)
      await loadChildren()
    } catch (err) {
      console.error('[ParentProfile] unlink', err)
    }
  }

  function openEdit() {
    setEditName(profile?.name ?? '')
    setEditAvatar(profile?.avatar ?? '👩')
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

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {
      // ignore — navigate home regardless
    }
    navigate('/')
  }

  return (
    <ParentLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profile &amp; Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Avatar & info */}
          <div className="bg-white rounded-2xl border p-6 flex flex-col items-center text-center shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 border-4"
              style={{ backgroundColor: '#F0FAF4', borderColor: '#2D7A4F' }}
            >
              {account.avatar}
            </div>
            <div className="font-extrabold text-gray-900 text-lg">{account.name}</div>
            <div className="text-xs text-gray-400 font-semibold mt-1">{account.email}</div>
            <div
              className="mt-2 px-3 py-1 rounded-full text-xs font-extrabold"
              style={{ backgroundColor: '#F0FAF4', color: '#2D7A4F' }}
            >
              Parent Mode
            </div>
          </div>

          {/* Linked children */}
          <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div className="text-xs text-gray-400 font-extrabold uppercase tracking-widest mb-3">
              Linked Children
            </div>

            {loadingKids ? (
              <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ) : children.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium mb-3">
                No child linked yet. Ask your child for their code (shown on their Profile page).
              </p>
            ) : (
              <div className="flex flex-col gap-2 mb-3">
                {children.map(c => {
                  const active = c.id === activeChild?.id
                  return (
                    <div
                      key={c.id}
                      onClick={() => setActiveChildId(c.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer border-2 transition-colors"
                      style={active
                        ? { backgroundColor: '#F0FAF4', borderColor: '#2D7A4F' }
                        : { backgroundColor: '#fff', borderColor: '#E8F5EE' }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: '#EDE4FF' }}>
                        {c.avatar || '🧒'}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate">{c.name}</div>
                        <div className="text-xs text-gray-400">Grade {c.grade ?? '—'} · 🔥 {c.streak_days ?? 0}</div>
                      </div>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); handleUnlink(c.id) }}
                        className="text-xs font-bold px-2 py-1 rounded-lg shrink-0"
                        style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}
                        title="Unlink"
                      >
                        Unlink
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Link form */}
            <form onSubmit={handleLink} className="mt-1">
              <label className="text-xs text-gray-400 font-bold">Add a child by code</label>
              <div className="flex gap-2 mt-1.5">
                <input
                  value={codeInput}
                  onChange={e => { setCodeInput(e.target.value.toUpperCase()); setLinkError('') }}
                  maxLength={8}
                  placeholder="e.g. AB3K7Q"
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border-2 text-sm font-bold tracking-widest uppercase outline-none"
                  style={{ borderColor: '#C8E6D4' }}
                />
                <button
                  type="submit"
                  disabled={linking}
                  className="px-4 py-2 rounded-xl text-sm font-extrabold text-white shrink-0"
                  style={{ backgroundColor: linking ? '#A8D5B8' : '#2D7A4F' }}
                >
                  {linking ? '…' : 'Link'}
                </button>
              </div>
              {linkError && (
                <p className="text-xs font-semibold mt-2" style={{ color: '#DC2626' }}>{linkError}</p>
              )}
            </form>
          </div>

          {/* Mode toggle removed per request */}

          {/* Settings menu */}
          <div className="bg-white rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#E8F5EE' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Account</span>
            </div>
            {settingsItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'Edit Profile') openEdit()
                  else if (item.to) navigate(item.to)
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b last:border-0 transition-colors"
                style={{ borderColor: '#F0FAF4' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FAF4')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span className="relative inline-flex items-center justify-center text-lg w-6 text-center">
                  {item.icon}
                  {item.label === 'Notifications' && unreadCount > 0 && (
                    <span
                      className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full text-[10px] font-extrabold text-white flex items-center justify-center"
                      style={{ backgroundColor: '#EF4444' }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">{item.label}</div>
                  <div className="text-xs text-gray-400 font-medium">{item.desc}</div>
                </div>
                <span className="text-gray-300 text-sm">›</span>
              </button>
            ))}
          </div>

          {/* Log out */}
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors"
            style={{ borderColor: '#FCA5A5', color: '#DC2626', backgroundColor: '#FFF5F5' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
          >
            ← Log Out
          </button>
        </div>

        {/* ── Right column — Notifications + Badges ── */}
        <div className="flex-1">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm mb-6" style={{ borderColor: '#C8E6D4' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Recent Activity</h2>
                {unreadCount > 0 && (
                  <span className="text-xs font-extrabold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EF4444' }}>
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-xs font-bold transition-colors"
                style={{ color: unreadCount === 0 ? '#D1D5DB' : '#2D7A4F' }}
              >
                Mark all read
              </button>
            </div>

            {loadingNotifications ? (
              <div className="space-y-2">
                <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-12 rounded-xl bg-gray-100 animate-pulse" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium">No recent activity.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {notifications.map(n => (
                  <li key={n.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-green-100">
                      🔔
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-800">{n.message}</div>
                      <div className="text-xs text-gray-400">{new Date(n.last_date).toLocaleString()}</div>
                    </div>
                    <div className="ml-2 text-xs font-bold text-white px-2 py-1 rounded-full" style={{ backgroundColor: '#EF4444' }}>
                      New
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Badges card (existing) */}
          <div className="bg-white rounded-2xl border p-6 shadow-sm" style={{ borderColor: '#C8E6D4' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
                {activeChild ? `${activeChild.name}'s Badges` : "Child's Badges"}
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {badges.filter(b => b.earned).length} / {badges.length} earned
              </span>
            </div>

            {activeChild ? (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl p-4 text-center border" style={{ borderColor: '#C8E6D4', backgroundColor: '#F0FAF4' }}>
                  <div className="text-2xl font-extrabold" style={{ color: '#2D7A4F' }}>{stats.overall}%</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">Overall</div>
                </div>
                <div className="rounded-2xl p-4 text-center border" style={{ borderColor: '#C8E6D4', backgroundColor: '#fff' }}>
                  <div className="text-2xl font-extrabold text-gray-800">{stats.doneCount}/{stats.total}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">Lessons</div>
                </div>
                <div className="rounded-2xl p-4 text-center border" style={{ borderColor: '#C8E6D4', backgroundColor: '#fff' }}>
                  <div className="text-2xl font-extrabold" style={{ color: '#E07B00' }}>🔥 {stats.streak}</div>
                  <div className="text-xs text-gray-500 font-bold mt-1">Day streak</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 font-medium mb-6">
                Select or link a child to see their progress and badges.
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="flex flex-col items-center text-center p-5 rounded-2xl border-2 transition-all duration-200"
                  style={
                    badge.earned
                      ? { borderColor: '#A8D5B8', backgroundColor: '#F0FAF4' }
                      : { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB', opacity: 0.55 }
                  }
                >
                  <div className="text-4xl mb-3" style={{ filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </div>
                  <div className="text-sm font-extrabold text-gray-800 mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-400 font-medium leading-snug">{badge.desc}</div>
                  {badge.earned && (
                    <div
                      className="mt-3 px-2.5 py-1 rounded-full text-xs font-extrabold"
                      style={{ backgroundColor: '#2D7A4F', color: '#fff' }}
                    >
                      ✓ Earned
                    </div>
                  )}
                  {!badge.earned && (
                    <div className="mt-3 px-2.5 py-1 rounded-full text-xs font-bold text-gray-400 bg-gray-100">
                      🔒 Locked
                    </div>
                  )}
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
            style={{ borderColor: '#C8E6D4' }}
          >
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">Edit Profile</h3>
            <p className="text-xs text-gray-400 font-medium mb-5">Change your name or avatar</p>

            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4"
                style={{ backgroundColor: '#F0FAF4', borderColor: '#2D7A4F' }}
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
                      ? { borderColor: '#2D7A4F', backgroundColor: '#F0FAF4' }
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
              style={{ borderColor: '#C8E6D4' }}
            />

            {saveError && (
              <p className="text-xs font-semibold mt-3" style={{ color: '#DC2626' }}>{saveError}</p>
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
                style={{ backgroundColor: saving ? '#A8D5B8' : '#2D7A4F' }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </ParentLayout>
  )
}
