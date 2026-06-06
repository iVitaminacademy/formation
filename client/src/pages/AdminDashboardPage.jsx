import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { curriculum } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../services/auth'
import {
  getAdminDashboardData,
  linkParentChild,
  unlinkParentChild,
  updateProfileByAdmin,
  upsertProgressByAdmin,
} from '../services/admin'

const THEME_KEY = 'admin_dashboard_theme'

const LIGHT = {
  page: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSoft: '#F1F5F9',
  text: '#0F172A',
  subtext: '#64748B',
  border: '#E2E8F0',
  primary: '#16A34A',
  primarySoft: '#DCFCE7',
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

function Pill({ children, tone = 'default', theme }) {
  const styles = {
    default: { backgroundColor: theme.surfaceSoft, color: theme.text },
    green: { backgroundColor: theme.primarySoft, color: theme.primary },
    orange: { backgroundColor: '#FFF7ED', color: theme.accent },
    red: { backgroundColor: '#FEF2F2', color: theme.danger },
  }
  return (
    <span className="rounded-full px-3 py-1 text-xs font-bold" style={styles[tone] || styles.default}>
      {children}
    </span>
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
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
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
        {(page - 1) * PAGE + 1}–{Math.min(page * PAGE, total)} of {total}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border px-3 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Prev</button>
        <span className="text-xs" style={{ color: theme.subtext }}>{page}/{maxPage}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page >= maxPage} className="rounded-md border px-3 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Next</button>
      </div>
    </div>
  )
}

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
  const [links, setLinks] = useState([])
  const [progress, setProgress] = useState([])
  const [badges, setBadges] = useState([])
  const [userBadges, setUserBadges] = useState([])

  const [activeProfileId, setActiveProfileId] = useState('')
  const [selectedParentId, setSelectedParentId] = useState('')
  const [selectedChildId, setSelectedChildId] = useState('')
  const [newParentId, setNewParentId] = useState('')
  const [newChildId, setNewChildId] = useState('')
  const [linkError, setLinkError] = useState('')
  const [parentSearch, setParentSearch] = useState('')
  const [pPage, setPPage] = useState(1)
  const [iPage, setIPage] = useState(1)
  const [lPage, setLPage] = useState(1)
  const PP = 3
  const PAGE = 5
  const [profileForm, setProfileForm] = useState({ name: '', role: 'kid', grade: 4, avatar: '' })
  const [progressForm, setProgressForm] = useState({ lessonRef: '', score: '', completed: true, attempts: 1 })
  const [selectedProgressRowId, setSelectedProgressRowId] = useState('')
  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const lessonIndex = useMemo(() => buildLessonIndex(), [])

  useEffect(() => { localStorage.setItem(THEME_KEY, themeName) }, [themeName])
  useEffect(() => { if (profile?.role && profile.role !== 'admin') navigate('/login') }, [profile?.role, navigate])

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminDashboardData()
      setProfiles(data.profiles)
      setLinks(data.links)
      setProgress(data.progress)
      setBadges(data.badges)
      setUserBadges(data.userBadges)
      setSelectedParentId(prev => prev || data.profiles.find(p => p.role === 'parent')?.id || '')
      setSelectedChildId(prev => prev || data.profiles.find(p => p.role === 'kid')?.id || '')
      setActiveProfileId(prev => prev || data.profiles[0]?.id || '')
    } catch (err) { setError(err.message || 'Failed to load admin dashboard data.') }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [refreshTick])

  const kpis = useMemo(() => {
    const parents = profiles.filter(p => p.role === 'parent')
    const kids = profiles.filter(p => p.role === 'kid')
    const admins = profiles.filter(p => p.role === 'admin')
    const linkedIds = new Set(links.map(l => l.child_id))
    const ind = kids.filter(k => !linkedIds.has(k.id))
    const done = progress.filter(p => p.completed)
    const avgS = progress.length ? Math.round(progress.reduce((s, r) => s + (Number(r.score) || 0), 0) / progress.length) : 0
    const compR = progress.length ? Math.round((done.length / progress.length) * 100) : 0
    const activeP = parents.filter(p => links.some(l => l.parent_id === p.id)).length
    const avgStreak = kids.length ? Math.round(kids.reduce((s, k) => s + (k.streak_days || 0), 0) / kids.length) : 0
    return {
      totalUsers: profiles.length, parents: parents.length, kids: kids.length,
      admins: admins.length, activeParents: activeP,
      independentStudents: ind.length, linkedStudents: linkedIds.size,
      totalProgress: progress.length, completionRate: compR, avgScore: avgS,
      averageStreak: avgStreak, completedProgress: done.length,
      avgAttempts: progress.length ? Math.round(progress.reduce((s, r) => s + (Number(r.attempts) || 0), 0) / progress.length) : 0,
      linkedParents: links.length,
    }
  }, [links, profiles, progress])

  const selectedProfile = useMemo(() => profiles.find(p => p.id === activeProfileId) || null, [activeProfileId, profiles])
  const selectedChild = useMemo(() => profiles.find(p => p.id === selectedChildId && p.role === 'kid') || null, [profiles, selectedChildId])

  const parentsWithChildren = useMemo(() =>
    profiles.filter(p => p.role === 'parent').map(parent => ({
      ...parent,
      children: profiles.filter(p => links.filter(l => l.parent_id === parent.id).map(l => l.child_id).includes(p.id)),
    })), [links, profiles])

  const filteredParentsWithChildren = useMemo(() => {
    if (!parentSearch.trim()) return parentsWithChildren
    return parentsWithChildren.filter(parent => {
      const pm = matchesSearch(parent.name, parentSearch) || matchesSearch(parent.email, parentSearch)
      const cm = parent.children.some(c => matchesSearch(c.name, parentSearch) || matchesSearch(c.email, parentSearch) || matchesSearch(c.link_code, parentSearch))
      return pm || cm
    })
  }, [parentSearch, parentsWithChildren])

  const independentStudents = useMemo(() => {
    const linkedIds = new Set(links.map(l => l.child_id))
    return profiles.filter(p => p.role === 'kid' && !linkedIds.has(p.id))
  }, [links, profiles])

  const filteredIndependentStudents = useMemo(() => {
    if (!parentSearch.trim()) return independentStudents
    return independentStudents.filter(s => matchesSearch(s.name, parentSearch) || matchesSearch(s.email, parentSearch) || matchesSearch(s.link_code, parentSearch))
  }, [independentStudents, parentSearch])

  const selectedChildProgress = useMemo(() => {
    if (!selectedChild?.id) return []
    return progress.filter(r => r.user_id === selectedChild.id).sort((a, b) => new Date(b.last_date || 0) - new Date(a.last_date || 0))
  }, [progress, selectedChild?.id])

  const roleCounts = useMemo(() =>
    profiles.reduce((acc, p) => { acc[p.role] = (acc[p.role] || 0) + 1; return acc }, { kid: 0, parent: 0, admin: 0 }),
  [profiles])

  // pagination
  useEffect(() => { setPPage(1); setIPage(1) }, [parentSearch])
  const parentsPaged = filteredParentsWithChildren.slice((pPage - 1) * PP, pPage * PP)
  const indPaged = filteredIndependentStudents.slice((iPage - 1) * PAGE, iPage * PAGE)
  const linksPaged = links.slice((lPage - 1) * PAGE, lPage * PAGE)

  const handleProfileFieldChange = (f, v) => setProfileForm(prev => ({ ...prev, [f]: v }))
  const handleSelectProfile = id => {
    const item = profiles.find(p => p.id === id)
    if (!item) return
    setActiveProfileId(id)
    setProfileForm({ name: item.name || '', role: item.role || 'kid', grade: item.grade || 4, avatar: item.avatar || '' })
    if (item.role === 'parent') setSelectedParentId(item.id)
    if (item.role === 'kid') setSelectedChildId(item.id)
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
    if (!selectedProfile) return; setSaving(true); setError('')
    try { await updateProfileByAdmin(selectedProfile.id, { name: profileForm.name.trim(), role: profileForm.role, grade: profileForm.role === 'kid' ? Number(profileForm.grade) : null, avatar: profileForm.avatar.trim() }); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Could not save profile changes.') }
    finally { setSaving(false) }
  }

  const handleSaveProgress = async () => {
    if (!selectedChild || !progressForm.lessonRef.trim()) return; setSaving(true); setError('')
    try { await upsertProgressByAdmin({ userId: selectedChild.id, lessonRef: progressForm.lessonRef.trim(), score: progressForm.score === '' ? null : Number(progressForm.score), completed: Boolean(progressForm.completed), attempts: Number(progressForm.attempts) || 1 }); setRefreshTick(t => t + 1) }
    catch (err) { setError(err.message || 'Could not save progress.') }
    finally { setSaving(false) }
  }

  const handleAddLink = async () => {
    if (!newParentId || !newChildId) return; setLinkError(''); setSaving(true)
    try { await linkParentChild(newParentId, newChildId); setRefreshTick(t => t + 1); setNewChildId(''); setNewParentId('') }
    catch (err) { setLinkError(err.message || 'Could not create that relationship.') }
    finally { setSaving(false) }
  }

  const handleRemoveLink = async (parentId, childId) => {
    setSaving(true); setLinkError('')
    try { await unlinkParentChild(parentId, childId); setRefreshTick(t => t + 1) }
    catch (err) { setLinkError(err.message || 'Could not remove that relationship.') }
    finally { setSaving(false) }
  }

  const handleLogout = async () => { try { await signOut() } catch {} navigate('/login') }

  const handleChangePassword = async () => {
    setPwError('')
    setPwSuccess('')
    const np = pwForm.newPassword.trim()
    const cp = pwForm.confirmPassword.trim()

    if (!np || !cp) { setPwError('Both fields are required.'); return }
    if (np.length < 6) { setPwError('Password must be at least 6 characters.'); return }
    if (np !== cp) { setPwError('Passwords do not match.'); return }

    setPwLoading(true)
    try {
      await changePassword(np)
      setPwSuccess('Your password has been changed.')
      setPwForm({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwError(err.message || 'Could not change password. You may need to re-authenticate.')
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: theme.page, color: theme.text }}>
      <p className="text-sm font-semibold">Loading admin dashboard…</p>
    </div>
  )

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: theme.page, color: theme.text }}>
      <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ backgroundColor: theme.surface + 'EE', borderColor: theme.border }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="min-w-0">
            <div className="text-xs font-extrabold uppercase tracking-[0.3em]" style={{ color: theme.subtext }}>Admin Dashboard</div>
            <h1 className="text-xl font-extrabold sm:text-2xl">Frazzl.kid Control Center</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button onClick={() => setThemeName(prev => (prev === 'dark' ? 'light' : 'dark'))} className="rounded-xl border px-3 py-2 text-sm font-bold transition sm:px-4" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>{themeName === 'dark' ? 'Light mode' : 'Dark mode'}</button>
            <button onClick={() => setRefreshTick(t => t + 1)} className="rounded-xl px-3 py-2 text-sm font-bold text-white transition sm:px-4" style={{ backgroundColor: theme.primary }}>Refresh</button>
            <button onClick={handleLogout} className="rounded-xl border px-3 py-2 text-sm font-bold transition sm:px-4" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error && <div className="mb-6 rounded-2xl border px-4 py-3 text-sm font-semibold" style={{ borderColor: theme.danger, backgroundColor: theme.danger + '10', color: theme.danger }}>{error}</div>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={kpis.totalUsers} helper={`${kpis.parents} parents · ${kpis.kids} students`} theme={theme} />
          <StatCard label="Active parents" value={kpis.activeParents} helper={`${kpis.linkedParents} parent-child links`} color={theme.primary} theme={theme} />
          <StatCard label="Independent students" value={kpis.independentStudents} helper="Students without parent links" color={theme.accent} theme={theme} />
          <StatCard label="Progress completion" value={`${kpis.completionRate}%`} helper={`${kpis.totalProgress} progress rows · avg score ${kpis.avgScore}%`} color={theme.warning} theme={theme} />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {/* Parents with children */}
            <SectionCard title="Parents with children" theme={theme} action={
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <input value={parentSearch} onChange={e => setParentSearch(e.target.value)} placeholder="Search parents or students" className="w-full rounded-xl border px-3 py-2 text-sm outline-none sm:w-56" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
              </div>
            }>
              <div className="space-y-4">
                {filteredParentsWithChildren.length === 0 ? (
                  <p className="text-sm" style={{ color: theme.subtext }}>No matching parents or linked students.</p>
                ) : (
                  <>
                    {parentsPaged.map(parent => (
                      <div key={parent.id} className="w-full rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="break-words font-extrabold">{parent.name || 'Unnamed parent'}</div>
                            <div className="break-words text-xs font-medium" style={{ color: theme.subtext }}>{parent.email || '—'}</div>
                          </div>
                          <Pill tone="green" theme={theme}>{parent.children.length} linked child{parent.children.length !== 1 ? 'ren' : ''}</Pill>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {parent.children.length === 0 ? (
                            <div className="text-sm" style={{ color: theme.subtext }}>No children linked.</div>
                          ) : parent.children.map(child => (
                            <div key={child.id} role="button" tabIndex={0} onClick={() => { setSelectedChildId(child.id); handleSelectProfile(child.id) }} className="cursor-pointer rounded-xl border p-3 text-left transition hover:-translate-y-0.5" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: theme.primarySoft }}>{child.avatar || '🧒'}</div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-bold">{child.name || 'Unnamed student'}</div>
                                  <div className="text-xs" style={{ color: theme.subtext }}>Grade {child.grade ?? '—'} · 🔥 {child.streak_days ?? 0}</div>
                                </div>
                                <button type="button" onClick={e => { e.stopPropagation(); handleRemoveLink(parent.id, child.id) }} className="shrink-0 rounded-lg border px-2 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.danger }}>Unlink</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <PagingBar total={filteredParentsWithChildren.length} page={pPage} setPage={setPPage} PAGE={PP} theme={theme} />
                  </>
                )}
              </div>
            </SectionCard>

            {/* Independent students */}
            <SectionCard title="Independent students" theme={theme} action={
              <input value={parentSearch} onChange={e => setParentSearch(e.target.value)} placeholder="Search students" className="w-full rounded-xl border px-3 py-2 text-sm outline-none sm:w-44" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
            }>
              {filteredIndependentStudents.length === 0 ? (
                <p className="text-sm" style={{ color: theme.subtext }}>All students are linked to a parent.</p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    {indPaged.map(student => (
                      <button key={student.id} onClick={() => { setSelectedChildId(student.id); handleSelectProfile(student.id) }} className="flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg" style={{ backgroundColor: theme.primarySoft }}>{student.avatar || '🧒'}</div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-bold">{student.name || 'Unnamed student'}</div>
                          <div className="text-xs" style={{ color: theme.subtext }}>Grade {student.grade ?? '—'} · link code {student.link_code || '—'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <PagingBar total={filteredIndependentStudents.length} page={iPage} setPage={setIPage} PAGE={PAGE} theme={theme} />
                </>
              )}
            </SectionCard>

            {/* Relationship manager */}
            <SectionCard title="Relationship manager" theme={theme}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <select value={newParentId} onChange={e => setNewParentId(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>
                  <option value="">Select parent</option>
                  {profiles.filter(p => p.role === 'parent').map(parent => <option key={parent.id} value={parent.id}>{parent.name || parent.email || parent.id}</option>)}
                </select>
                <select value={newChildId} onChange={e => setNewChildId(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>
                  <option value="">Select child</option>
                  {profiles.filter(p => p.role === 'kid').map(child => <option key={child.id} value={child.id}>{child.name || child.email || child.id}</option>)}
                </select>
                <button onClick={handleAddLink} className="rounded-xl px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: theme.primary }}>Link accounts</button>
              </div>
              {linkError && <p className="mt-3 text-sm font-semibold" style={{ color: theme.danger }}>{linkError}</p>}
              <div className="mt-5 overflow-x-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                <table className="min-w-[640px] w-full text-left text-sm">
                  <thead style={{ backgroundColor: theme.surfaceSoft }}>
                    <tr><th className="px-4 py-3">Parent</th><th className="px-4 py-3">Child</th><th className="px-4 py-3">Created</th><th className="px-4 py-3">Action</th></tr>
                  </thead>
                  <tbody>
                    {links.length === 0 ? (
                      <tr><td className="px-4 py-4" colSpan="4" style={{ color: theme.subtext }}>No relationships found.</td></tr>
                    ) : linksPaged.map(row => (
                      <tr key={`${row.parent_id}-${row.child_id}`} className="border-t" style={{ borderColor: theme.border }}>
                        <td className="px-4 py-3">{row.parent?.name || row.parent_id}</td>
                        <td className="px-4 py-3">{row.child?.name || row.child_id}</td>
                        <td className="px-4 py-3">{row.created_at ? new Date(row.created_at).toLocaleString() : '—'}</td>
                        <td className="px-4 py-3"><button onClick={() => handleRemoveLink(row.parent_id, row.child_id)} className="rounded-lg border px-3 py-1 text-xs font-bold" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>Remove</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-3"><PagingBar total={links.length} page={lPage} setPage={setLPage} PAGE={5} theme={theme} /></div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            {/* Edit profile */}
            <SectionCard title="Edit profile" theme={theme}>
              {selectedProfile ? (
                <div className="space-y-3">
                  <select value={selectedProfile.id} onChange={e => handleSelectProfile(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>
                    {profiles.map(p => <option key={p.id} value={p.id}>{p.name || p.email || p.id} · {p.role}</option>)}
                  </select>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Name</label>
                  <input value={profileForm.name} onChange={e => handleProfileFieldChange('name', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Role</label>
                      <select value={profileForm.role} onChange={e => handleProfileFieldChange('role', e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>
                        <option value="kid">kid</option><option value="parent">parent</option><option value="admin">admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Grade</label>
                      <select value={profileForm.grade} onChange={e => handleProfileFieldChange('grade', e.target.value)} disabled={profileForm.role !== 'kid'} className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }}>
                        <option value={4}>Grade 4</option><option value={5}>Grade 5</option>
                      </select>
                    </div>
                  </div>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Avatar</label>
                  <input value={profileForm.avatar} onChange={e => handleProfileFieldChange('avatar', e.target.value)} placeholder="🧒" className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
                  <button onClick={handleSaveProfile} disabled={saving} className="w-full rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: theme.primary }}>Save profile changes</button>
                </div>
              ) : <p className="text-sm" style={{ color: theme.subtext }}>Select a record to edit.</p>}
            </SectionCard>

            {/* Progress editor */}
            <SectionCard title="Progress editor" theme={theme}>
              {selectedChild ? (
                <div className="space-y-3">
                  <div className="rounded-xl border p-3" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                    <div className="font-bold">{selectedChild.name}</div>
                    <div className="text-xs" style={{ color: theme.subtext }}>Showing progress rows for this student</div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Search rows</label>
                    <input value={progressForm.lessonRef} onChange={e => setProgressForm(prev => ({ ...prev, lessonRef: e.target.value }))} placeholder="Lesson title or ref" className="w-full rounded-xl border px-3 py-2 text-sm sm:w-44" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
                  </div>
                  <div className="max-h-56 overflow-auto rounded-2xl border" style={{ borderColor: theme.border }}>
                    {selectedChildProgress.length === 0 ? (
                      <div className="p-4 text-sm" style={{ color: theme.subtext }}>No progress rows yet for this student.</div>
                    ) : selectedChildProgress.filter(row => {
                      const meta = lessonIndex.get(Number(row.lesson_ref)); const title = meta?.lessonTitle || `Lesson ${row.lesson_ref}`
                      return matchesSearch(row.lesson_ref, progressForm.lessonRef) || matchesSearch(title, progressForm.lessonRef) || matchesSearch(row.score, progressForm.lessonRef) || matchesSearch(row.attempts, progressForm.lessonRef)
                    }).map(row => {
                      const meta = lessonIndex.get(Number(row.lesson_ref)); const title = meta?.lessonTitle || `Lesson ${row.lesson_ref}`; const topic = meta?.topicName || 'Unknown topic'
                      return (
                        <button key={row.id} onClick={() => handleSelectProgressRow(row)} className={`w-full border-b px-4 py-3 text-left transition hover:bg-opacity-80 ${selectedProgressRowId === row.id ? 'bg-emerald-50' : ''}`} style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-bold break-words">{title}</div>
                              <div className="text-xs" style={{ color: theme.subtext }}>{topic} · Lesson ref {row.lesson_ref}</div>
                              <div className="mt-1 text-xs" style={{ color: theme.subtext }}>Score: {formatScore(row.score)} · Attempts: {row.attempts ?? 1} · {row.completed ? 'Completed' : 'In progress'}</div>
                            </div>
                            <div className="shrink-0 text-right text-xs" style={{ color: theme.subtext }}>
                              <div className="font-bold uppercase tracking-wide">Last updated</div><div>{formatDate(row.last_date)}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}>
                    <div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Selected row editor</div>
                    {selectedProgressRowId ? (
                      <div className="mt-3 space-y-3">
                        <div className="text-sm font-semibold break-words">{lessonIndex.get(Number(progress.find(r => r.id === selectedProgressRowId)?.lesson_ref))?.lessonTitle || 'Selected lesson'}</div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Score</label><input value={progressForm.score} onChange={e => setProgressForm(prev => ({ ...prev, score: e.target.value }))} placeholder="3" className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} /><div className="mt-1 text-[11px]" style={{ color: theme.subtext }}>Percentage score shown as a percent, for example 3% or 100%.</div></div>
                          <div><label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Attempts</label><input value={progressForm.attempts} onChange={e => setProgressForm(prev => ({ ...prev, attempts: e.target.value }))} placeholder="2" className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} /></div>
                        </div>
                        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={progressForm.completed} onChange={e => setProgressForm(prev => ({ ...prev, completed: e.target.checked }))} />Completed</label>
                        <button onClick={handleSaveProgress} disabled={saving} className="w-full rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: theme.accent }}>Save progress row</button>
                      </div>
                    ) : <p className="mt-2 text-sm" style={{ color: theme.subtext }}>Select a progress row above to edit score, attempts, and completion status.</p>}
                  </div>
                </div>
              ) : <p className="text-sm" style={{ color: theme.subtext }}>Select a student to update their progress.</p>}
            </SectionCard>

            {/* Change password */}
            <SectionCard title="Change admin password" theme={theme}>
              <div className="space-y-3">
                {pwError && <div className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: theme.danger, backgroundColor: theme.danger + '10', color: theme.danger }}>{pwError}</div>}
                {pwSuccess && <div className="rounded-xl border px-3 py-2 text-sm font-semibold" style={{ borderColor: theme.primary, backgroundColor: theme.primarySoft, color: theme.primary }}>{pwSuccess}</div>}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>New password</label>
                  <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="Min. 6 characters" className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide" style={{ color: theme.subtext }}>Confirm new password</label>
                  <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(prev => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Re-enter new password" className="w-full rounded-xl border px-3 py-2 text-sm" style={{ borderColor: theme.border, backgroundColor: theme.surface, color: theme.text }} />
                </div>
                <button onClick={handleChangePassword} disabled={pwLoading} className="w-full rounded-xl py-3 text-sm font-bold text-white" style={{ backgroundColor: theme.primary }}>
                  {pwLoading ? 'Updating…' : 'Change password'}
                </button>
              </div>
            </SectionCard>

            {/* Database overview */}
            <SectionCard title="Database overview" theme={theme}>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Badges catalog" value={badges.length} helper="Total badge definitions" color={theme.primary} theme={theme} />
                <StatCard label="Earned badge rows" value={userBadges.length} helper="Rows in user_badges" color={theme.accent} theme={theme} />
                <StatCard label="Progress rows" value={kpis.totalProgress} helper={`${kpis.completedProgress} completed`} color={theme.warning} theme={theme} />
                <StatCard label="Average streak" value={kpis.averageStreak} helper="Across all kids" color={theme.primary} theme={theme} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}><div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Kids</div><div className="mt-2 text-2xl font-extrabold">{roleCounts.kid}</div></div>
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}><div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Parents</div><div className="mt-2 text-2xl font-extrabold">{roleCounts.parent}</div></div>
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.border, backgroundColor: theme.surfaceSoft }}><div className="text-xs font-extrabold uppercase tracking-widest" style={{ color: theme.subtext }}>Admins</div><div className="mt-2 text-2xl font-extrabold">{roleCounts.admin}</div></div>
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  )
}
