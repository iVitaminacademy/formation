import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/auth'
import { getProgressMap } from '../services/progress'
import { curriculum } from '../data/curriculum'

const BADGE_DEFS = [
  { id: 1, icon: '⭐', name: 'Apprenant rapide', desc: 'Compléter 5 leçons',             color: '#1E3A5F', bg: '#EFF6FF', border: '#93C5FD', check: s => s.doneCount >= 5 }, 
  { id: 3, icon: '🎯', name: 'Précision clinique',desc: 'Score 100 % à un quiz',          color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', check: s => s.perfectAny },
  { id: 4, icon: '🚀', name: 'Module validé',    desc: 'Terminer un module en entier',     color: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD', check: s => s.fullTopicAny },
   { id: 6, icon: '🏆', name: 'Certification IV', desc: 'Compléter toute la formation',     color: '#065F46', bg: '#ECFDF5', border: '#34D399', check: s => s.gradeComplete },
]

const AVATAR_OPTIONS = [
  '👨‍⚕️', '👩‍⚕️', '🩺', '💉', '🧬',
  '😀', '😎', '🤓', '😊', '🥳',
  '🦊', '🐱', '🐶',
]

function computeStats(progressMap) {
  const topics     = curriculum[1] || []
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
  { icon: '✏️', label: 'Modifier le profil',     desc: 'Changer votre nom ou avatar' },
  { icon: '🔒', label: 'Condition',         desc: 'Données et Condition', to: '/privacy' },
  { icon: '❓', label: 'Aide & FAQ',              desc: 'Obtenir de l\'aide', to: '/faq' },
]

function BadgeRow({ badge }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3.5 border transition-all"
      style={{
        borderColor: badge.earned ? badge.border : '#E5E7EB',
        backgroundColor: badge.earned ? badge.bg : '#F9FAFB',
      }}
    >
      <div
        className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-xl border-2"
        style={{
          borderColor: badge.earned ? badge.border : '#E5E7EB',
          backgroundColor: badge.earned ? badge.bg : '#F3F4F6',
          filter: badge.earned ? 'none' : 'grayscale(0.9)',
          opacity: badge.earned ? 1 : 0.55,
        }}
      >
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-extrabold truncate" style={{ color: badge.earned ? badge.color : '#9CA3AF' }}>
          {badge.name}
        </div>
        <div className="text-xs font-medium text-gray-400 mt-0.5 truncate">{badge.desc}</div>
      </div>
      <div className="shrink-0">
        {badge.earned
          ? <span className="px-3 py-1 rounded-full text-xs font-extrabold text-white whitespace-nowrap" style={{ backgroundColor: badge.color }}>✓ Obtenu</span>
          : <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-400 whitespace-nowrap">Non obtenu</span>
        }
      </div>
    </div>
  )
}

export default function KidProfile() {
  const navigate = useNavigate()
  const { user, profile, signOut, refreshProfile } = useAuth()
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading]         = useState(true)

  const [editing, setEditing]       = useState(false)
  const [editName, setEditName]     = useState('')
  const [editAvatar, setEditAvatar] = useState('👨‍⚕️')
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState('')

  const userWithProfile = {
    name:   profile?.name   ?? 'Docteur',
    avatar: profile?.avatar ?? '👨‍⚕️',
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
    const stats = { ...computeStats(progressMap), streak: userWithProfile.streak }
    return BADGE_DEFS.map(b => ({ ...b, earned: b.check(stats) }))
  }, [progressMap, userWithProfile.streak])

  const earnedCount = badges.filter(b => b.earned).length
  const earnedPct   = Math.round((earnedCount / badges.length) * 100)

  const topics     = curriculum[1] || []
  const allLessons = topics.flatMap(t => t.lessons)
  const doneCount  = allLessons.filter(l => progressMap[l.id]?.completed).length
  const lessonPct  = allLessons.length ? Math.round((doneCount / allLessons.length) * 100) : 0

  function openEdit() {
    setEditName(profile?.name ?? '')
    setEditAvatar(profile?.avatar ?? '👨‍⚕️')
    setSaveError('')
    setEditing(true)
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    if (!user?.id) { setSaveError('Vous devez être connecté.'); return }
    const name = editName.trim()
    if (!name) { setSaveError('Veuillez saisir un nom.'); return }
    setSaving(true)
    setSaveError('')
    try {
      await updateProfile(user.id, { name, avatar: editAvatar })
      await refreshProfile?.()
      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Impossible de sauvegarder les modifications.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <KidLayout>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Profil</h1>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Left column ── */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">

          {/* Identity card */}
          <div className="bg-white rounded-2xl border-2 p-6 flex flex-col items-center text-center shadow-sm" style={{ borderColor: '#93C5FD' }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 border-4"
              style={{ backgroundColor: '#EFF6FF', borderColor: '#1E3A5F' }}
            >
              {userWithProfile.avatar}
            </div>
            <div className="font-extrabold text-gray-900 text-lg">{userWithProfile.name}</div>
            <div className="mt-1 px-3 py-1 rounded-full text-xs font-extrabold" style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}>
              Formation IV · Médecin
            </div>
            <div className="mt-4 w-full grid grid-cols-2 gap-3 pt-4 border-t" style={{ borderColor: '#EFF6FF' }}>
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold" style={{ color: '#1E3A5F' }}>{userWithProfile.streak}</span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">Jours consécutifs</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-extrabold" style={{ color: '#1E3A5F' }}>{doneCount}</span>
                <span className="text-xs text-gray-400 font-medium mt-0.5">Leçons terminées</span>
              </div>
            </div>
          </div>

          {/* Progression globale */}
          <div className="bg-white rounded-2xl border-2 p-4 shadow-sm" style={{ borderColor: '#93C5FD' }}>
            <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Progression globale</div>
            <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
              <span>{doneCount} / {allLessons.length} leçons</span>
              <span>{lessonPct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EFF6FF' }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${lessonPct}%`, backgroundColor: '#1E3A5F' }}
              />
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: '#93C5FD' }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: '#EFF6FF' }}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Compte</span>
            </div>
            {settingsItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.to) navigate(item.to)
                  else if (item.label === 'Modifier le profil') openEdit()
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left border-b last:border-0 transition-colors"
                style={{ borderColor: '#EFF6FF' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
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
            onClick={async () => { try { await signOut() } catch {} navigate('/') }}
            className="w-full py-3 rounded-2xl text-sm font-extrabold border-2 transition-colors"
            style={{ borderColor: '#FCA5A5', color: '#EF4444', backgroundColor: '#FFF5F5' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
          >
            ← Déconnexion
          </button>
        </div>

        {/* ── Right column — Certifications ── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border-2 p-6 shadow-sm" style={{ borderColor: '#93C5FD' }}>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">Certifications professionnelles</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Récompenses obtenues au fil de votre formation IV</p>
              </div>
              <span
                className="shrink-0 px-3 py-1 rounded-full text-xs font-extrabold"
                style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}
              >
                {earnedCount} / {badges.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1.5">
                <span>Progression des certifications</span>
                <span>{earnedPct}%</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EFF6FF' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${earnedPct}%`,
                    backgroundColor: earnedPct === 100 ? '#065F46' : '#1E3A5F',
                  }}
                />
              </div>
            </div>

            {/* Badge rows */}
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {earnedCount > 0 && (
                  <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 pb-1">
                    Obtenues — {earnedCount}
                  </div>
                )}
                {badges.filter(b => b.earned).map(badge => (
                  <BadgeRow key={badge.id} badge={badge} />
                ))}

                {badges.filter(b => !b.earned).length > 0 && (
                  <div className="text-xs font-extrabold uppercase tracking-widest text-gray-400 pb-1 pt-4">
                    À obtenir — {badges.filter(b => !b.earned).length}
                  </div>
                )}
                {badges.filter(b => !b.earned).map(badge => (
                  <BadgeRow key={badge.id} badge={badge} />
                ))}
              </div>
            )}

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
            style={{ borderColor: '#93C5FD' }}
          >
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">Modifier le profil</h3>
            <p className="text-xs text-gray-400 font-medium mb-5">Changez votre nom ou votre avatar</p>

            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4"
                style={{ backgroundColor: '#EFF6FF', borderColor: '#1E3A5F' }}
              >
                {editAvatar}
              </div>
            </div>

            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Choisir un avatar</label>
            <div className="grid grid-cols-5 gap-2 mt-2 mb-4">
              {AVATAR_OPTIONS.map(a => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setEditAvatar(a)}
                  className="aspect-square rounded-xl text-2xl flex items-center justify-center border-2 transition-all"
                  style={
                    editAvatar === a
                      ? { borderColor: '#1E3A5F', backgroundColor: '#EFF6FF' }
                      : { borderColor: '#E5E7EB', backgroundColor: '#fff' }
                  }
                >
                  {a}
                </button>
              ))}
            </div>

            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Nom</label>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              maxLength={40}
              placeholder="Votre nom"
              className="w-full mt-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold text-gray-800 outline-none"
              style={{ borderColor: '#93C5FD' }}
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
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white transition-colors"
                style={{ backgroundColor: saving ? '#60A5FA' : '#1E3A5F' }}
              >
                {saving ? 'Enregistrement…' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      )}
    </KidLayout>
  )
}
