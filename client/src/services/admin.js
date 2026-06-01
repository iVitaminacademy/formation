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
