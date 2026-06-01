import { supabase } from './supabaseClient'

// Save (insert or update) a lesson result. One row per (user, lesson).
export async function saveProgress({ userId, lessonId, score, completed = true }) {
  const { data: existing } = await supabase
    .from('progress')
    .select('attempts')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  const attempts = (existing?.attempts ?? 0) + 1

  const { data, error } = await supabase
    .from('progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        score,
        completed,
        attempts,
        last_date: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

// Full progress for a child/user, including lesson + topic info for reports.
export async function getProgress(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('id, completed, score, attempts, last_date, lessons(id, title, topic_id, topics(name, grade))')
    .eq('user_id', userId)
    .order('last_date', { ascending: false })
  if (error) throw error
  return data
}

// Lightweight progress map keyed by lesson_id (for unlock logic / badges).
export async function getProgressMap(userId) {
  const { data, error } = await supabase
    .from('progress')
    .select('lesson_id, completed, score')
    .eq('user_id', userId)
  if (error) throw error
  const map = {}
  for (const row of data) map[row.lesson_id] = row
  return map
}
