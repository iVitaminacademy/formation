import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { curriculum } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../services/auth'
import {
  getAdminDashboardData,
  activateMedecin,
  setMedecinStatus,
  updateProfileByAdmin,
  upsertProgressByAdmin,
  unbanMedecinFromQuiz,
  adminGetAllSlots,
  adminCreateSlot,
  adminDeactivateSlot,
  adminGetAllBookings,
  adminCompleteBooking,
  adminCancelBooking,
  adminGrantBookingException,
} from '../services/admin'

const THEME_KEY = 'admin_dashboard_theme'

const LIGHT = {
  page: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  text: '#0F172A',
  subtext: '#64748B',
  border: '#E2E8F0',
  primary: '#F97316',
  primarySoft: '#FFF7ED',
  accent: '#F97316',
  danger: '#DC2626',
  warning: '#D97706',
}

const DARK = {
  page: '#020617',
  surface: '#0F172A',
  surfaceSoft: '#111827',
  text: '#F8FAFC',
  subtext: '#94A3B8',
  border: '#1E293B',
  primary: '#22C55E',
  primarySoft: '#052E16',
  accent: '#FB923C',
  danger: '#F87171',
  warning: '#FBBF24',
}

function StatCard({ label, value, helper, color, theme }) {
  return (
    <div className="rounded-2xl border p-5 shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
      <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>
        {label}
      </div>
      <div className="mt-2 text-3xl font-extrabold" style={{ color: color || theme.text }}>
        {value}
      </div>
      {helper && (
        <div className="mt-2 text-xs font-medium" style={{ color: theme.subtext }}>
          {helper}
        </div>
      )}
    </div>
  )
}

function SectionCard({ title, children, theme, action }) {
  return (
    <section className="rounded-2xl border p-5 shadow-sm" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>
          {title}
        </h2>
        <div className="w-full sm:w-auto">{action}</div>
      </div>
      {children}
    </section>
  )
}

function matchesSearch(target, query) {
  if (!query) return true
  return String(target ?? '').toLowerCase().includes(query.toLowerCase())
}

function formatScore(score) {
  if (score == null || Number.isNaN(Number(score))) return '—'
  return `${score}%`
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function buildLessonIndex() {
  const map = new Map()
  for (const grade of Object.values(curriculum)) {
    for (const topic of grade) {
      for (const lesson of topic.lessons || []) {
        map.set(Number(lesson.id), { lessonTitle: lesson.title, topicName: topic.name })
      }
    }
  }
  return map
}

function PagingBar({ total, page, setPage, PAGE, theme }) {
  if (total <= PAGE) return null
  const maxPage = Math.ceil(total / PAGE)
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <div className="text-xs" style={{ color: theme.subtext }}>
        {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, total)} sur {total}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border px-3 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Préc.</button>
        <span className="text-xs" style={{ color: theme.subtext }}>{page}/{maxPage}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= maxPage} className="rounded-md border px-3 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Suiv.</button>
      </div>
    </div>
  )
}

const PAGE = 8

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()

  const [themeName, setThemeName] = useState(() => localStorage.getItem(THEME_KEY) || 'light')
  const theme = themeName === 'dark' ? DARK : LIGHT

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [refreshTick, setRefreshTick] = useState(0)

  const [profiles, setProfiles] = useState([])
  const [progress, setProgress] = useState([])
  const [badges, setBadges] = useState([])
  const [userBadges, setUserBadges] = useState([])

  const [activeProfileId, setActiveProfileId] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userPage, setUserPage] = useState(1)

  const [profileForm, setProfileForm] = useState({ name: '', role: 'medecin', status: 'pending', avatar: '' })
  const [profileSaved, setProfileSaved] = useState(false)
  const [progressForm, setProgressForm] = useState({ lessonRef: '', score: '', completed: true, attempts: 1 })
  const [selectedProgressRowId, setSelectedProgressRowId] = useState('')
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [newSlotTime, setNewSlotTime] = useState('')
  const [bookingActionLoading, setBookingActionLoading] = useState(false)

  const lessonIndex = useMemo(() => buildLessonIndex(), [])

  useEffect(() => { localStorage.setItem(THEME_KEY, themeName) }, [themeName])
  useEffect(() => { if (profile?.role && profile.role !== 'admin') navigate('/login') }, [profile?.role, navigate])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const [data, allSlots, allBookings] = await Promise.all([
        getAdminDashboardData(),
        adminGetAllSlots(),
        adminGetAllBookings(),
      ])
      setProfiles(data.profiles)
      setProgress(data.progress)
      setBadges(data.badges)
      setUserBadges(data.userBadges)
      setActiveProfileId(prev => prev || data.profiles[0]?.id || '')
      setSelectedChildId(prev => prev || data.profiles.find(p => p.role === 'medecin')?.id || '')
      setSlots(allSlots)
      setBookings(allBookings)
    } catch (err) { setError(err.message || 'Impossible de charger les données du tableau de bord.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [refreshTick])

  const kpis = useMemo(() => {
    const medecins = profiles.filter(p => p.role === 'medecin')
    const admins = profiles.filter(p => p.role === 'admin')
    const done = progress.filter(p => p.completed)
    const avgScore = progress.length
      ? Math.round(progress.reduce((s, r) => s + (Number(r.score) || 0), 0) / progress.length)
      : 0
    const completionRate = progress.length ? Math.round((done.length / progress.length) * 100) : 0
    const avgStreak = medecins.length
      ? Math.round(medecins.reduce((s, k) => s + (k.streak_days || 0), 0) / medecins.length)
      : 0
    return {
      totalUsers: profiles.length,
      medecins: medecins.length,
      admins: admins.length,
      totalProgress: progress.length,
      completionRate,
      avgScore,
      averageStreak: avgStreak,
      completedProgress: done.length,
      avgAttempts: progress.length
        ? Math.round(progress.reduce((s, r) => s + (Number(r.attempts) || 0), 0) / progress.length)
        : 0,
    }
  }, [profiles, progress])

  const selectedProfile = useMemo(() => profiles.find(p => p.id === activeProfileId) || null, [activeProfileId, profiles])
  const selectedChild = useMemo(() => profiles.find(p => p.id === selectedChildId && p.role === 'medecin') || null, [profiles, selectedChildId])

  const selectedChildProgress = useMemo(() => {
    if (!selectedChild?.id) return []
    return progress.filter(r => r.user_id === selectedChild.id).sort((a, b) => new Date(b.last_date || 0) - new Date(a.last_date || 0))
  }, [progress, selectedChild?.id])

  const pendingMedecins = useMemo(
    () => profiles.filter(p => p.role === 'medecin' && p.status !== 'active'),
    [profiles]
  )

  const bannedMedecins = useMemo(
    () => profiles.filter(p => p.role === 'medecin' && p.banned_from_quiz),
    [profiles]
  )

  const handleActivate = async (medecinId) => {
    setSaving(true); setError('')
    try { await activateMedecin(medecinId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Impossible d\'activer ce compte.') }
    finally { setSaving(false) }
  }

  const handleUnbanQuiz = async (medecinId) => {
    setSaving(true); setError('')
    try { await unbanMedecinFromQuiz(medecinId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Impossible de débloquer cet utilisateur.') }
    finally { setSaving(false) }
  }

  const handleToggleStatus = async (userId, currentStatus) => {
    const next = currentStatus === 'active' ? 'pending' : 'active'
    setSaving(true); setError('')
    try {
      await setMedecinStatus(userId, next)
      setRefreshTick(t => t + 1)
    }
    catch (err) { setError(err.message || 'Impossible de modifier le statut.') }
    finally { setSaving(false) }
  }

  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return profiles
    return profiles.filter(p =>
      matchesSearch(p.name, userSearch) ||
      matchesSearch(p.email, userSearch) ||
      matchesSearch(p.role, userSearch)
    )
  }, [profiles, userSearch])

  useEffect(() => { setUserPage(1) }, [userSearch])
  const usersPaged = filteredUsers.slice((userPage - 1) * PAGE, userPage * PAGE)

  const handleProfileFieldChange = (f, v) => setProfileForm(prev => ({ ...prev, [f]: v }))
  const handleSelectProfile = id => {
    const item = profiles.find(p => p.id === id)
    if (!item) return
    setActiveProfileId(id)
    setProfileForm({ name: item.name || '', role: item.role || 'medecin', status: item.status || 'pending', avatar: item.avatar || '' })
    if (item.role === 'medecin') setSelectedChildId(item.id)
  }
  const handleSelectProgressRow = row => {
    setSelectedProgressRowId(row.id)
    setSelectedChildId(row.user_id)
    setProgressForm({
      lessonRef: row.lesson_ref || '',
      score: row.score == null ? '' : String(row.score),
      completed: Boolean(row.completed),
      attempts: row.attempts == null ? 1 : Number(row.attempts),
    })
  }

  const handleSaveProfile = async () => {
    if (!selectedProfile) return
    setSaving(true); setError(''); setProfileSaved(false)
    try {
      await updateProfileByAdmin(selectedProfile.id, {
        name: profileForm.name.trim(),
        role: profileForm.role,
        avatar: profileForm.avatar.trim(),
        ...(profileForm.role === 'medecin' && { status: profileForm.status }),
      })
      setRefreshTick(t => t + 1)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 3000)
    } catch (err) { setError(err.message || 'Impossible de sauvegarder les modifications.') }
    finally { setSaving(false) }
  }

  const handleSaveProgress = async () => {
    if (!selectedChild || !progressForm.lessonRef.trim()) return
    setSaving(true); setError('')
    try {
      await upsertProgressByAdmin({
        userId: selectedChild.id,
        lessonRef: progressForm.lessonRef.trim(),
        score: progressForm.score === '' ? null : Number(progressForm.score),
        completed: Boolean(progressForm.completed),
        attempts: Number(progressForm.attempts) || 1,
      })
      setRefreshTick(t => t + 1)
    } catch (err) { setError(err.message || 'Impossible de sauvegarder la progression.') }
    finally { setSaving(false) }
  }

  const handleCreateSlot = async () => {
    if (!newSlotTime) return
    setBookingActionLoading(true); setError('')
    try {
      await adminCreateSlot(new Date(newSlotTime).toISOString())
      setNewSlotTime('')
      setRefreshTick(t => t + 1)
    } catch (err) { setError(err.message || 'Erreur lors de la création du créneau.') }
    finally { setBookingActionLoading(false) }
  }

  const handleDeactivateSlot = async (slotId) => {
    setBookingActionLoading(true); setError('')
    try { await adminDeactivateSlot(slotId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Erreur.') }
    finally { setBookingActionLoading(false) }
  }

  const handleCompleteBooking = async (bookingId, userId) => {
    setBookingActionLoading(true); setError('')
    try { await adminCompleteBooking(bookingId, userId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Erreur.') }
    finally { setBookingActionLoading(false) }
  }

  const handleCancelBookingAdmin = async (bookingId) => {
    setBookingActionLoading(true); setError('')
    try { await adminCancelBooking(bookingId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Erreur.') }
    finally { setBookingActionLoading(false) }
  }

  const handleGrantException = async (userId) => {
    setBookingActionLoading(true); setError('')
    try { await adminGrantBookingException(userId); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Erreur.') }
    finally { setBookingActionLoading(false) }
  }

  const handleLogout = async () => { try { await signOut() } catch {} navigate('/login') }

  const handleChangePassword = async () => {
    setPwError(''); setPwSuccess('')
    const np = pwForm.newPassword.trim()
    const cp = pwForm.confirmPassword.trim()
    if (!np || !cp) { setPwError('Les deux champs sont requis.'); return }
    if (np.length < 6) { setPwError('Le mot de passe doit comporter au moins 6 caractères.'); return }
    if (np !== cp) { setPwError('Les mots de passe ne correspondent pas.'); return }
    setPwLoading(true)
    try {
      await changePassword(np)
      setPwSuccess('Mot de passe modifié avec succès.')
      setPwForm({ newPassword: '', confirmPassword: '' })
    } catch (err) { setPwError(err.message || 'Impossible de modifier le mot de passe.') }
    finally { setPwLoading(false) }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: theme.page, color: theme.text }}>
      <p className="text-sm font-semibold">Chargement du tableau de bord…</p>
    </div>
  )

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.page, color: theme.text }}>
      <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ backgroundColor: theme.surface + 'EE', borderColor: theme.border }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <div className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: theme.subtext }}>Admin</div>
            <h1 className="text-xl font-extrabold sm:text-2xl">iVitaminacademy — Tableau de bord</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setThemeName(prev => (prev === 'dark' ? 'light' : 'dark'))}
              className="rounded-xl border px-3 py-2 text-sm font-bold transition sm:px-4"
              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
            >
              {themeName === 'dark' ? 'Mode clair' : 'Mode sombre'}
            </button>
            <button
              onClick={() => setRefreshTick(t => t + 1)}
              className="rounded-xl px-3 py-2 text-sm font-bold text-white transition sm:px-4"
              style={{ backgroundColor: theme.primary }}
            >
              Actualiser
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border px-3 py-2 text-sm font-bold transition sm:px-4"
              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: theme.danger, backgroundColor: theme.danger + '10', color: theme.danger }}>
            {error}
          </div>
        )}

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total utilisateurs" value={kpis.totalUsers} helper={`${kpis.medecins} médecins · ${kpis.admins} admins`} theme={theme} />
          <StatCard label="En attente" value={pendingMedecins.length} helper="Médecins en attente d'activation" color={pendingMedecins.length > 0 ? '#D97706' : theme.primary} theme={theme} />
          <StatCard label="Bannis des quiz" value={bannedMedecins.length} helper="Tricherie détectée" color={bannedMedecins.length > 0 ? '#DC2626' : theme.primary} theme={theme} />
          <StatCard label="Score moyen" value={`${kpis.avgScore}%`} helper={`Série moyenne : ${kpis.averageStreak}j`} color={theme.accent} theme={theme} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">

            {/* Médecins en attente d'activation */}
            {pendingMedecins.length > 0 && (
              <SectionCard
                title={`⏳ Médecins en attente (${pendingMedecins.length})`}
                theme={theme}
              >
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                  <table className="min-w-[480px] w-full text-left text-sm">
                    <thead style={{ backgroundColor: theme.surfaceSoft }}>
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Médecin</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Inscrit le</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingMedecins.map(med => (
                        <tr key={med.id} className="border-t" style={{ borderColor: theme.border }}>
                          <td className="px-4 py-3">
                            <div className="font-bold truncate max-w-[180px]">{med.name || '—'}</div>
                            <div className="text-xs truncate max-w-[180px]" style={{ color: theme.subtext }}>{med.email || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: theme.subtext }}>
                            {formatDate(med.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleActivate(med.id)}
                              disabled={saving}
                              className="rounded-xl px-4 py-1.5 text-xs font-bold text-white"
                              style={{ backgroundColor: '#065F46' }}
                            >
                              ✓ Activer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Médecins bannis des quiz */}
            {bannedMedecins.length > 0 && (
              <SectionCard
                title={`🚫 Bannis des quiz (${bannedMedecins.length})`}
                theme={theme}
              >
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                  <table className="min-w-[480px] w-full text-left text-sm">
                    <thead style={{ backgroundColor: theme.surfaceSoft }}>
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Médecin</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Inscrit le</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannedMedecins.map(med => (
                        <tr key={med.id} className="border-t" style={{ borderColor: theme.border }}>
                          <td className="px-4 py-3">
                            <div className="font-bold truncate max-w-[180px]">{med.name || '—'}</div>
                            <div className="text-xs truncate max-w-[180px]" style={{ color: theme.subtext }}>{med.email || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: theme.subtext }}>
                            {formatDate(med.created_at)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleUnbanQuiz(med.id)}
                              disabled={saving}
                              className="rounded-xl px-4 py-1.5 text-xs font-bold text-white"
                              style={{ backgroundColor: '#1D4ED8' }}
                            >
                              🔓 Débloquer les quiz
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            )}

            {/* Réservations & Créneaux */}
            <SectionCard title={`📅 Réservations (${bookings.filter(b => b.status === 'confirmed').length} actives)`} theme={theme}>

              {/* Create slot */}
              <div className="mb-4 flex flex-wrap items-end gap-3">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: theme.subtext }}>Nouveau créneau (date & heure locale)</label>
                  <input
                    type="datetime-local"
                    value={newSlotTime}
                    onChange={e => setNewSlotTime(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                  />
                </div>
                <button
                  onClick={handleCreateSlot}
                  disabled={bookingActionLoading || !newSlotTime}
                  className="px-5 py-2 rounded-xl text-sm font-bold text-white shrink-0"
                  style={{ backgroundColor: bookingActionLoading || !newSlotTime ? '#94A3B8' : '#065F46' }}
                >
                  + Créer
                </button>
              </div>

              {/* Upcoming slots */}
              <div className="mb-5">
                <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: theme.subtext }}>Créneaux à venir</div>
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                  <table className="min-w-[400px] w-full text-left text-sm">
                    <thead style={{ backgroundColor: theme.surfaceSoft }}>
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Date & Heure</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Statut</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slots.filter(s => new Date(s.start_time) > new Date()).length === 0 ? (
                        <tr><td className="px-4 py-3 text-sm" colSpan={3} style={{ color: theme.subtext }}>Aucun créneau futur.</td></tr>
                      ) : slots.filter(s => new Date(s.start_time) > new Date()).slice(0, 10).map(s => (
                        <tr key={s.id} className="border-t" style={{ borderColor: theme.border }}>
                          <td className="px-4 py-3 font-bold">
                            {new Date(s.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}{' '}
                            {new Date(s.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={s.is_active ? { backgroundColor: '#ECFDF5', color: '#065F46' } : { backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                              {s.is_active ? 'Actif' : 'Désactivé'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {s.is_active && (
                              <button
                                onClick={() => handleDeactivateSlot(s.id)}
                                disabled={bookingActionLoading}
                                className="rounded-lg px-3 py-1 text-xs font-bold text-white"
                                style={{ backgroundColor: '#DC2626' }}
                              >
                                Désactiver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* All bookings */}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: theme.subtext }}>Toutes les réservations</div>
                <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                  <table className="min-w-[560px] w-full text-left text-sm">
                    <thead style={{ backgroundColor: theme.surfaceSoft }}>
                      <tr>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Médecin</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Créneau</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Statut</th>
                        <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.length === 0 ? (
                        <tr><td className="px-4 py-3 text-sm" colSpan={4} style={{ color: theme.subtext }}>Aucune réservation.</td></tr>
                      ) : bookings.map(b => (
                        <tr key={b.id} className="border-t" style={{ borderColor: theme.border }}>
                          <td className="px-4 py-3">
                            <div className="font-bold truncate max-w-[140px]">{b.profile?.name || '—'}</div>
                            <div className="text-xs truncate max-w-[140px]" style={{ color: theme.subtext }}>{b.profile?.email || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-xs" style={{ color: theme.subtext }}>
                            {b.slot?.start_time
                              ? new Date(b.slot.start_time).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
                                new Date(b.slot.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                              : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="rounded-full px-2 py-0.5 text-xs font-bold"
                              style={
                                b.status === 'confirmed' ? { backgroundColor: '#DBEAFE', color: '#1E3A5F' }
                                : b.status === 'completed' ? { backgroundColor: '#ECFDF5', color: '#065F46' }
                                : { backgroundColor: '#F3F4F6', color: '#6B7280' }
                              }
                            >
                              {b.status === 'confirmed' ? 'Confirmé' : b.status === 'completed' ? 'Effectué' : 'Annulé'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {b.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => handleCompleteBooking(b.id, b.user_id)}
                                    disabled={bookingActionLoading}
                                    className="rounded-lg px-2 py-1 text-xs font-bold text-white"
                                    style={{ backgroundColor: '#065F46' }}
                                  >
                                    ✓ Effectué
                                  </button>
                                  <button
                                    onClick={() => handleCancelBookingAdmin(b.id)}
                                    disabled={bookingActionLoading}
                                    className="rounded-lg px-2 py-1 text-xs font-bold text-white"
                                    style={{ backgroundColor: '#DC2626' }}
                                  >
                                    ✕ Annuler
                                  </button>
                                </>
                              )}
                              {(b.status === 'completed') && (
                                <button
                                  onClick={() => handleGrantException(b.user_id)}
                                  disabled={bookingActionLoading}
                                  className="rounded-lg px-2 py-1 text-xs font-bold text-white"
                                  style={{ backgroundColor: '#7C3AED' }}
                                >
                                  🔓 Exception
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SectionCard>

            {/* Liste des utilisateurs */}
            <SectionCard
              title={`Utilisateurs (${filteredUsers.length})`}
              theme={theme}
              action={
                <input
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Rechercher nom, email, rôle…"
                  className="rounded-xl border px-3 py-2 text-sm outline-none w-full sm:w-56"
                  style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                />
              }
            >
              <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                <table className="min-w-[520px] w-full text-left text-sm">
                  <thead style={{ backgroundColor: theme.surfaceSoft }}>
                    <tr>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Nom</th>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Email</th>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Rôle</th>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Statut</th>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Série</th>
                      <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-wide" style={{ color: theme.subtext }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersPaged.length === 0 ? (
                      <tr><td className="px-4 py-4 text-sm" colSpan={6} style={{ color: theme.subtext }}>Aucun utilisateur trouvé.</td></tr>
                    ) : usersPaged.map(u => (
                      <tr key={u.id} className="border-t" style={{ borderColor: theme.border }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{u.avatar || (u.role === 'admin' ? '🛡️' : '🩺')}</span>
                            <span className="font-bold truncate max-w-[120px]">{u.name || '—'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs truncate max-w-[160px]" style={{ color: theme.subtext }}>{u.email || '—'}</td>
                        <td className="px-4 py-3">
                          <span
                            className="rounded-full px-2 py-0.5 text-xs font-bold"
                            style={{
                              backgroundColor: u.role === 'admin' ? '#EFF6FF' : '#ECFDF5',
                              color: u.role === 'admin' ? '#1D4ED8' : '#065F46',
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.role === 'medecin' ? (
                            <div className="flex flex-col gap-1">
                              <span
                                className="rounded-full px-2 py-0.5 text-xs font-bold w-fit"
                                style={
                                  u.status === 'active'
                                    ? { backgroundColor: '#ECFDF5', color: '#065F46' }
                                    : { backgroundColor: '#FFFBEB', color: '#92400E' }
                                }
                              >
                                {u.status === 'active' ? '✓ Actif' : '⏸ En attente'}
                              </span>
                              {u.banned_from_quiz && (
                                <span className="rounded-full px-2 py-0.5 text-xs font-bold w-fit" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                                  🚫 Quiz banni
                                </span>
                              )}
                              {u.booking_used && (
                                <span className="rounded-full px-2 py-0.5 text-xs font-bold w-fit" style={{ backgroundColor: '#F5F3FF', color: '#7C3AED' }}>
                                  📅 Session utilisée
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs" style={{ color: theme.subtext }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">🔥 {u.streak_days ?? 0}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => { handleSelectProfile(u.id); setSelectedChildId(u.id) }}
                              className="rounded-lg border px-3 py-1 text-xs font-bold transition"
                              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                            >
                              Modifier
                            </button>
                            {u.role === 'medecin' && (
                              <button
                                onClick={() => handleToggleStatus(u.id, u.status)}
                                disabled={saving}
                                className="rounded-lg px-3 py-1 text-xs font-bold text-white transition"
                                style={{ backgroundColor: u.status === 'active' ? '#92400E' : '#065F46' }}
                              >
                                {u.status === 'active' ? 'Bloquer' : 'Activer'}
                              </button>
                            )}
                            {u.role === 'medecin' && u.banned_from_quiz && (
                              <button
                                onClick={() => handleUnbanQuiz(u.id)}
                                disabled={saving}
                                className="rounded-lg px-3 py-1 text-xs font-bold text-white transition"
                                style={{ backgroundColor: '#1D4ED8' }}
                              >
                                🔓 Débloquer
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PagingBar total={filteredUsers.length} page={userPage} setPage={setUserPage} PAGE={PAGE} theme={theme} />
            </SectionCard>

          </div>

          <div className="space-y-6">

            {/* Edit profile */}
            <SectionCard title="Modifier le profil" theme={theme}>
              {selectedProfile ? (
                <div className="space-y-3">
                  {/* Profile selector */}
                  <select
                    value={selectedProfile.id}
                    onChange={e => handleSelectProfile(e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                  >
                    {profiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name || p.email || p.id} · {p.role}</option>
                    ))}
                  </select>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.subtext }}>Nom</label>
                    <input
                      value={profileForm.name}
                      onChange={e => handleProfileFieldChange('name', e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.subtext }}>Rôle</label>
                    <select
                      value={profileForm.role}
                      onChange={e => handleProfileFieldChange('role', e.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                    >
                      <option value="medecin">Médecin</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {/* Status — only for médecins */}
                  {profileForm.role === 'medecin' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.subtext }}>Statut du compte</label>
                      <select
                        value={profileForm.status}
                        onChange={e => handleProfileFieldChange('status', e.target.value)}
                        className="w-full rounded-xl border px-3 py-2 text-sm font-semibold"
                        style={{
                          borderColor: profileForm.status === 'active' ? '#6EE7B7' : '#FCD34D',
                          backgroundColor: profileForm.status === 'active' ? '#ECFDF5' : '#FFFBEB',
                          color: profileForm.status === 'active' ? '#065F46' : '#92400E',
                        }}
                      >
                        <option value="active">✓ Actif — accès autorisé</option>
                        <option value="pending">⏸ Désactivé — accès bloqué</option>
                      </select>
                      <p className="mt-1.5 text-xs" style={{ color: theme.subtext }}>
                        {profileForm.status === 'active'
                          ? 'Le médecin peut accéder à la plateforme.'
                          : 'Le médecin verra un écran bloqué à la connexion.'}
                      </p>
                    </div>
                  )}

                  {/* Avatar */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wide mb-1" style={{ color: theme.subtext }}>Avatar</label>
                    <input
                      value={profileForm.avatar}
                      onChange={e => handleProfileFieldChange('avatar', e.target.value)}
                      placeholder="🩺"
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                    />
                  </div>

                  {profileSaved && (
                    <div className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: '#6EE7B7', backgroundColor: '#ECFDF5', color: '#065F46' }}>
                      ✓ Modifications sauvegardées
                    </div>
                  )}

                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full rounded-xl py-3 text-sm font-bold text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {saving ? 'Enregistrement…' : 'Sauvegarder les modifications'}
                  </button>
                </div>
              ) : (
                <p className="text-sm" style={{ color: theme.subtext }}>Sélectionnez un utilisateur pour le modifier.</p>
              )}
            </SectionCard>

            {/* Progress editor */}
            <SectionCard title="Éditeur de progression" theme={theme}>
              {selectedChild ? (
                <div className="space-y-3">
                  <div className="rounded-xl border p-3" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                    <div className="font-bold">{selectedChild.name || selectedChild.email}</div>
                    <div className="text-xs" style={{ color: theme.subtext }}>Progression de ce médecin</div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Rechercher une leçon</label>
                    <input
                      value={progressForm.lessonRef}
                      onChange={e => setProgressForm(prev => ({ ...prev, lessonRef: e.target.value }))}
                      placeholder="Titre ou référence"
                      className="w-full rounded-xl border px-3 py-2 text-sm sm:w-44"
                      style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                    />
                  </div>
                  <div className="max-h-56 overflow-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                    {selectedChildProgress.length === 0 ? (
                      <div className="p-4 text-sm" style={{ color: theme.subtext }}>Aucune progression enregistrée.</div>
                    ) : selectedChildProgress.filter(row => {
                      const meta = lessonIndex.get(Number(row.lesson_ref))
                      const title = meta?.lessonTitle || `Leçon ${row.lesson_ref}`
                      return (
                        matchesSearch(row.lesson_ref, progressForm.lessonRef) ||
                        matchesSearch(title, progressForm.lessonRef) ||
                        matchesSearch(row.score, progressForm.lessonRef) ||
                        matchesSearch(row.attempts, progressForm.lessonRef)
                      )
                    }).map(row => {
                      const meta = lessonIndex.get(Number(row.lesson_ref))
                      const title = meta?.lessonTitle || `Leçon ${row.lesson_ref}`
                      const topic = meta?.topicName || 'Module inconnu'
                      return (
                        <button
                          key={row.id}
                          onClick={() => handleSelectProgressRow(row)}
                          className={`w-full border-b px-4 py-3 text-left transition hover:bg-opacity-80 ${selectedProgressRowId === row.id ? 'bg-emerald-50' : ''}`}
                          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-bold break-words">{title}</div>
                              <div className="text-xs" style={{ color: theme.subtext }}>{topic} · réf {row.lesson_ref}</div>
                              <div className="mt-1 text-xs" style={{ color: theme.subtext }}>
                                Score : {formatScore(row.score)} · Tentatives : {row.attempts ?? 1} · {row.completed ? 'Terminé' : 'En cours'}
                              </div>
                            </div>
                            <div className="shrink-0 text-right text-xs" style={{ color: theme.subtext }}>
                              <div className="font-bold uppercase tracking-wide">Mis à jour</div>
                              <div>{formatDate(row.last_date)}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                    <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Modifier la ligne sélectionnée</div>
                    {selectedProgressRowId ? (
                      <div className="mt-3 space-y-3">
                        <div className="text-sm font-semibold break-words">
                          {lessonIndex.get(Number(progress.find(r => r.id === selectedProgressRowId)?.lesson_ref))?.lessonTitle || 'Leçon sélectionnée'}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Score (%)</label>
                            <input
                              value={progressForm.score}
                              onChange={e => setProgressForm(prev => ({ ...prev, score: e.target.value }))}
                              placeholder="ex : 80"
                              className="w-full rounded-xl border px-3 py-2 text-sm"
                              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Tentatives</label>
                            <input
                              value={progressForm.attempts}
                              onChange={e => setProgressForm(prev => ({ ...prev, attempts: e.target.value }))}
                              placeholder="ex : 2"
                              className="w-full rounded-xl border px-3 py-2 text-sm"
                              style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                            />
                          </div>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-semibold">
                          <input
                            type="checkbox"
                            checked={progressForm.completed}
                            onChange={e => setProgressForm(prev => ({ ...prev, completed: e.target.checked }))}
                          />
                          Terminé
                        </label>
                        <button
                          onClick={handleSaveProgress}
                          disabled={saving}
                          className="w-full rounded-xl py-3 text-sm font-bold text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          Sauvegarder la progression
                        </button>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm" style={{ color: theme.subtext }}>Sélectionnez une ligne pour modifier le score, les tentatives et la complétion.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm" style={{ color: theme.subtext }}>Sélectionnez un médecin pour modifier sa progression.</p>
              )}
            </SectionCard>

            {/* Change password */}
            <SectionCard title="Changer le mot de passe admin" theme={theme}>
              <div className="space-y-3">
                {pwError && (
                  <div className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: theme.danger, backgroundColor: theme.danger + '10', color: theme.danger }}>
                    {pwError}
                  </div>
                )}
                {pwSuccess && (
                  <div className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: theme.primary, backgroundColor: theme.primarySoft, color: theme.primary }}>
                    {pwSuccess}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Min. 6 caractères"
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Répéter le mot de passe"
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading}
                  className="w-full rounded-xl py-3 text-sm font-bold text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  {pwLoading ? 'Modification…' : 'Changer le mot de passe'}
                </button>
              </div>
            </SectionCard>

            {/* Database overview */}
            <SectionCard title="Aperçu de la base de données" theme={theme}>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Catalogue de badges" value={badges.length} helper="Définitions de badges" color={theme.primary} theme={theme} />
                <StatCard label="Badges gagnés" value={userBadges.length} helper="Lignes dans user_badges" color={theme.accent} theme={theme} />
                <StatCard label="Lignes de progression" value={kpis.totalProgress} helper={`${kpis.completedProgress} terminées`} color={theme.warning} theme={theme} />
                <StatCard label="Série moyenne" value={`${kpis.averageStreak}j`} helper="Tous les médecins confondus" color={theme.primary} theme={theme} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                  <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Médecins</div>
                  <div className="mt-2 text-2xl font-extrabold">{kpis.medecins}</div>
                </div>
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                  <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Admins</div>
                  <div className="mt-2 text-2xl font-extrabold">{kpis.admins}</div>
                </div>
              </div>
            </SectionCard>

          </div>
        </div>
      </main>
    </div>
  )
}
