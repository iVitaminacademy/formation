import { supabase, isSupabaseConfigured } from './supabaseClient'

// ── localStorage helpers ──────────────────────────────────────────────────────
const lsKey  = (uid) => `progress_${uid || 'demo'}`
const lsLoad = (uid) => { try { return JSON.parse(localStorage.getItem(lsKey(uid)) || '{}') } catch { return {} } }
const lsSave = (uid, map) => { try { localStorage.setItem(lsKey(uid), JSON.stringify(map)) } catch {} }

// ── streak helpers ────────────────────────────────────────────────────────────
function toDateStr(iso) {
  return new Date(iso).toISOString().slice(0, 10)   // "2026-06-02"
}

// Returns the updated streak count based on the previous last_quiz_date
function calcStreak(prevDateIso, prevStreak) {
  const today     = toDateStr(new Date())
  if (!prevDateIso) return 1                         // first quiz ever

  const prev      = toDateStr(prevDateIso)
  if (prev === today) return prevStreak              // already quizzed today — no change
  const yesterday = toDateStr(new Date(Date.now() - 86400000))
  if (prev === yesterday) return prevStreak + 1     // quizzed yesterday — extend streak
  return 1                                           // gap > 1 day — reset
}

async function updateStreak(userId) {
  if (!isSupabaseConfigured || !userId || userId === 'demo') return

  try {
    // Read current streak info from profiles
    const { data: prof, error: e1 } = await supabase
      .from('profiles')
      .select('streak_days, last_quiz_date')
      .eq('id', userId)
      .single()

    if (e1) throw e1

    const newStreak = calcStreak(prof?.last_quiz_date, prof?.streak_days ?? 0)
    const today     = new Date().toISOString()

    await supabase
      .from('profiles')
      .update({ streak_days: newStreak, last_quiz_date: today, updated_at: today })
      .eq('id', userId)

    // Dispatch so AuthContext / components can re-read the updated profile
    window.dispatchEvent(new CustomEvent('streakUpdated', { detail: { streak: newStreak } }))
  } catch (err) {
    console.warn('[progress] streak update failed:', err.message)
  }
}

// ── saveProgress ──────────────────────────────────────────────────────────────
export async function saveProgress({ userId, lessonId, score, completed = true }) {
  const ref = String(lessonId)
  const now = new Date().toISOString()

  // 1. Write localStorage immediately
  const local = lsLoad(userId)
  local[ref]  = { lesson_ref: ref, score, completed, attempts: (local[ref]?.attempts ?? 0) + 1, last_date: now }
  lsSave(userId, local)

  // 2. Persist to Supabase
  if (isSupabaseConfigured && userId && userId !== 'demo') {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert(
          { user_id: userId, lesson_ref: ref, score, completed, attempts: local[ref].attempts, last_date: now },
          { onConflict: 'user_id,lesson_ref' }
        )
        .select()
        .single()

      if (error) throw error
      local[ref] = { ...local[ref], ...data }
      lsSave(userId, local)
      console.log('[progress] saved ✅', ref, score)

      // 3. Update streak after every completed lesson
      await updateStreak(userId)

      // 4. Notify any linked parents (server-side RPC)
      try {
        await supabase.rpc('notify_parents_for_progress', {
          p_child_id: userId,
          p_lesson_ref: ref,
          p_score: score,
          p_completed: completed,
          p_attempts: local[ref].attempts,
          p_last_date: now,
        })
      } catch (e) {
        console.warn('[progress] notify_parents RPC failed:', e.message || e)
      }

      return data
    } catch (err) {
      console.error('[progress] DB save failed:', err.message)
    }
  }

  return local[ref]
}

// ── getProgressMap ────────────────────────────────────────────────────────────
export async function getProgressMap(userId) {
  const local = lsLoad(userId)
  const map   = {}

  for (const [k, v] of Object.entries(local)) {
    const num = Number(k)
    if (!Number.isNaN(num)) map[num] = v
  }

  if (isSupabaseConfigured && userId && userId !== 'demo') {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('lesson_ref, completed, score, attempts, last_date')
        .eq('user_id', userId)

      if (error) throw error

      for (const row of data) {
        const num = Number(row.lesson_ref)
        if (!Number.isNaN(num)) {
          map[num]              = row
          local[row.lesson_ref] = row
        }
      }
      lsSave(userId, local)
    } catch (err) {
      console.error('[progress] DB fetch failed:', err.message)
    }
  }

  return map
}

// ── getProgress — for Reports page ───────────────────────────────────────────
export async function getProgress(userId) {
  if (!isSupabaseConfigured || !userId || userId === 'demo') {
    return Object.values(lsLoad(userId))
  }
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('lesson_ref, completed, score, attempts, last_date')
      .eq('user_id', userId)
      .order('last_date', { ascending: false })
    if (error) throw error
    return data
  } catch (err) {
    console.error('[progress] getProgress DB failed:', err.message)
    return Object.values(lsLoad(userId))
  }
}
