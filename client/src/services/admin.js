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
    linksRes,
    progressRes,
    badgesRes,
    userBadgesRes,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, email, role, grade, avatar, streak_days, link_code, created_at, updated_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('parent_child')
      .select(`
        parent_id,
        child_id,
        created_at,
        parent:parent_id(id, name, email, role, grade, avatar, streak_days, link_code),
        child:child_id(id, name, email, role, grade, avatar, streak_days, link_code)
      `)
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

  const firstError = profilesRes.error || linksRes.error || progressRes.error || badgesRes.error || userBadgesRes.error
  if (firstError) throw firstError

  return {
    profiles: profilesRes.data ?? [],
    links: linksRes.data ?? [],
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

export async function linkParentChild(parentId, childId) {
  const { data, error } = await supabase
    .from('parent_child')
    .upsert(
      { parent_id: parentId, child_id: childId },
      { onConflict: 'parent_id,child_id' },
    )
    .select()
  if (error) throw error
  return data
}

export async function unlinkParentChild(parentId, childId) {
  const { error } = await supabase
    .from('parent_child')
    .delete()
    .eq('parent_id', parentId)
    .eq('child_id', childId)
  if (error) throw error
}

export async function getProfilesForAdmin() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, role, grade, avatar, streak_days, link_code, created_at, updated_at')
    .order('role', { ascending: true })
    .order('name', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function getParentChildLinksForAdmin() {
  const { data, error } = await supabase
    .from('parent_child')
    .select(`
      parent_id,
      child_id,
      created_at,
      parent:parent_id(id, name, email, role, grade, avatar, streak_days, link_code),
      child:child_id(id, name, email, role, grade, avatar, streak_days, link_code)
    `)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
