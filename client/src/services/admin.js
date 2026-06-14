import { supabase } from './supabaseClient'

// Bulk-import lesson/question content from a JSON structure.
// Requires the signed-in user to have role = 'admin' (enforced by RLS).
//
// Expected shape:
// {
//   "topics": [
//     {
//       "name": "Multiplication", "grade": 4, "icon": "✖️", "sort_order": 1,
//       "lessons": [
//         {
//           "title": "Times Tables", "content_text": "...", "sort_order": 1,
//           "questions": [
//             { "question_text": "3 × 4?", "options": ["10","11","12","14"],
//               "correct_answer": "12", "hint": "...", "explanation": "...",
//               "teaching_steps": [], "sort_order": 1 }
//           ]
//         }
//       ]
//     }
//   ]
// }
export async function importContent(payload) {
  const result = { topics: 0, lessons: 0, questions: 0 }

  for (const topic of payload.topics ?? []) {
    const { data: topicRow, error: tErr } = await supabase
      .from('topics')
      .insert({
        name: topic.name,
        grade: topic.grade,
        icon: topic.icon ?? null,
        sort_order: topic.sort_order ?? 0,
      })
      .select()
      .single()
    if (tErr) throw tErr
    result.topics++

    for (const lesson of topic.lessons ?? []) {
      const { data: lessonRow, error: lErr } = await supabase
        .from('lessons')
        .insert({
          topic_id: topicRow.id,
          title: lesson.title,
          content_text: lesson.content_text ?? null,
          sort_order: lesson.sort_order ?? 0,
        })
        .select()
        .single()
      if (lErr) throw lErr
      result.lessons++

      const questions = (lesson.questions ?? []).map(q => ({
        lesson_id: lessonRow.id,
        question_text: q.question_text,
        options: q.options ?? [],
        correct_answer: q.correct_answer,
        hint: q.hint ?? null,
        explanation: q.explanation ?? null,
        teaching_steps: q.teaching_steps ?? [],
        sort_order: q.sort_order ?? 0,
      }))
      if (questions.length) {
        const { error: qErr } = await supabase.from('questions').insert(questions)
        if (qErr) throw qErr
        result.questions += questions.length
      }
    }
  }

  return result
}

export async function getAdminDashboardData() {
  const [
    profilesRes,
    progressRes,
    badgesRes,
    userBadgesRes,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, email, role, avatar, streak_days, status, banned_from_quiz, booking_used, certificate_code, certificate_issued_at, certificate_score_pct, created_at, updated_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('user_progress')
      .select('id, user_id, lesson_ref, score, completed, attempts, last_date')
      .order('last_date', { ascending: false }),
    supabase
      .from('badges')
      .select('id, name, icon, condition_type, condition_value')
      .order('condition_value', { ascending: true }),
    supabase
      .from('user_badges')
      .select('user_id, badge_id, earned_at')
      .order('earned_at', { ascending: false }),
  ])

  const firstError = profilesRes.error || progressRes.error || badgesRes.error || userBadgesRes.error
  if (firstError) throw firstError

  return {
    profiles: profilesRes.data ?? [],
    progress: progressRes.data ?? [],
    badges: badgesRes.data ?? [],
    userBadges: userBadgesRes.data ?? [],
  }
}

export async function updateProfileByAdmin(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function activateMedecin(medecinId) {
  const { error } = await supabase
    .from('profiles')
    .update({ status: 'active' })
    .eq('id', medecinId)
  if (error) throw error
}

export async function setMedecinStatus(medecinId, status) {
  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', medecinId)
  if (error) throw error
}

export async function unbanMedecinFromQuiz(medecinId) {
  const { error } = await supabase
    .from('profiles')
    .update({ banned_from_quiz: false })
    .eq('id', medecinId)
  if (error) throw error
}

// ─── Booking Admin Functions ──────────────────────────────────────────────────

export async function adminGetAllSlots() {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .order('start_time', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function adminCreateSlot(startTime) {
  const { data, error } = await supabase
    .from('time_slots')
    .insert({ start_time: startTime, is_active: true })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function adminDeactivateSlot(slotId) {
  const { error } = await supabase
    .from('time_slots')
    .update({ is_active: false })
    .eq('id', slotId)
  if (error) throw error
}

export async function adminGetAllBookings() {
  // bookings.user_id → auth.users (not public.profiles), so PostgREST can't
  // resolve the inline join. Fetch profiles separately and merge.
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, slot:slot_id(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  if (!bookings?.length) return []

  const userIds = [...new Set(bookings.map(b => b.user_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name, email')
    .in('id', userIds)

  const byId = Object.fromEntries((profiles ?? []).map(p => [p.id, p]))
  return bookings.map(b => ({ ...b, profile: byId[b.user_id] ?? null }))
}

export async function adminCreateBooking(userId, slotId) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ user_id: userId, slot_id: slotId, status: 'confirmed' })
    .select('*, slot:slot_id(*)')
    .single()
  if (error) throw error
  return data
}

export async function adminCompleteBooking(bookingId, userId) {
  const { error: bErr } = await supabase
    .from('bookings')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
  if (bErr) throw bErr
  const { error: pErr } = await supabase
    .from('profiles')
    .update({ booking_used: true })
    .eq('id', userId)
  if (pErr) throw pErr
}

export async function adminCancelBooking(bookingId) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
  if (error) throw error
}

export async function adminGrantBookingException(userId) {
  const { error } = await supabase
    .from('profiles')
    .update({ booking_used: false })
    .eq('id', userId)
  if (error) throw error
}

// ─── Progress Admin ───────────────────────────────────────────────────────────

export async function deleteUserByAdmin(userId) {
  const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId })
  if (error) throw error
}

export async function upsertProgressByAdmin({ userId, lessonRef, score, completed, attempts, lastDate }) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        lesson_ref: String(lessonRef),
        score: score ?? null,
        completed: Boolean(completed),
        attempts: attempts ?? 1,
        last_date: lastDate ?? new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_ref' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

