import { supabase } from './supabaseClient'

// All topics (with their lessons) for a grade, ordered for display.
export async function getTopicsWithLessons(grade) {
  const { data, error } = await supabase
    .from('topics')
    .select('id, name, grade, icon, sort_order, lessons(id, title, content_text, sort_order, unlock_after_id)')
    .eq('grade', grade)
    .order('sort_order', { ascending: true })
    .order('sort_order', { foreignTable: 'lessons', ascending: true })
  if (error) throw error
  return data
}

// Flat list of lessons for a grade.
export async function getLessonsByGrade(grade) {
  const { data, error } = await supabase
    .from('lessons')
    .select('id, title, content_text, sort_order, unlock_after_id, topic_id, topics!inner(grade)')
    .eq('topics.grade', grade)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}

export async function getLesson(lessonId) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single()
  if (error) throw error
  return data
}

// Questions for a lesson, ordered.
export async function getQuestions(lessonId) {
  const { data, error } = await supabase
    .from('questions')
    .select('id, question_text, options, correct_answer, hint, explanation, teaching_steps, sort_order')
    .eq('lesson_id', lessonId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data
}
