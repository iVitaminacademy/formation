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

// Find a lesson in the DB by its title. Returns a single lesson row or null.
export async function findLessonByTitle(title) {
  if (!title) return null
  try {
    // Try exact match first
    let { data, error } = await supabase
      .from('lessons')
      .select('id, title')
      .eq('title', title)
      .limit(1)
    if (error) {
      console.warn('[lessons.findLessonByTitle] exact match error', error.message)
    }
    if (data && data.length) return data[0]

    // Fallback: case-insensitive partial match
    const pattern = `%${title}%`
    const { data: data2, error: error2 } = await supabase
      .from('lessons')
      .select('id, title')
      .ilike('title', pattern)
      .limit(1)
    if (error2) {
      console.warn('[lessons.findLessonByTitle] ilike error', error2.message)
      return null
    }
    return data2 && data2.length ? data2[0] : null
  } catch (e) {
    console.warn('[lessons.findLessonByTitle] unexpected error', e.message)
    return null
  }
}

// Find a lesson by matching a question text (useful when questions were seeded but lesson ids differ)
export async function findLessonByQuestionText(questionText) {
  if (!questionText) return null
  try {
    const pattern = `%${questionText}%`
    const { data, error } = await supabase
      .from('questions')
      .select('lesson_id, question_text')
      .ilike('question_text', pattern)
      .limit(1)
    if (error) {
      console.warn('[lessons.findLessonByQuestionText] query error', error.message)
      return null
    }
    if (data && data.length) return data[0]
    return null
  } catch (e) {
    console.warn('[lessons.findLessonByQuestionText] unexpected error', e.message)
    return null
  }
}

// Create a lesson (and its questions) in the DB. Returns the created lesson row or null.
export async function createLessonWithQuestions({ grade = 4, topicName = 'Imported', lessonTitle, questions = [] }) {
  if (!lessonTitle) return null
  try {
    // Ensure topic exists (find or create)
    let { data: tdata, error: terr } = await supabase
      .from('topics')
      .select('id')
      .eq('name', topicName)
      .eq('grade', grade)
      .limit(1)

    if (terr) {
      console.warn('[lessons.create] topic lookup error', terr.message)
    }

    let topicId = tdata && tdata.length ? tdata[0].id : null
    if (!topicId) {
      const { data: newTopic, error: newTopicErr } = await supabase
        .from('topics')
        .insert({ name: topicName, grade, icon: null, sort_order: 100 })
        .select()
        .single()
      if (newTopicErr) {
        console.warn('[lessons.create] failed to create topic', newTopicErr.message)
        return null
      }
      topicId = newTopic.id
    }

    // Create lesson
    const { data: lessonData, error: lessonErr } = await supabase
      .from('lessons')
      .insert({ topic_id: topicId, title: lessonTitle, content_text: '', sort_order: 100 })
      .select()
      .single()
    if (lessonErr) {
      console.warn('[lessons.create] failed to create lesson', lessonErr.message)
      return null
    }

    // Insert questions (best-effort)
    if (questions && questions.length) {
      const qRows = questions.map((q, idx) => ({
        lesson_id: lessonData.id,
        question_text: q.text || q.question || '',
        options: q.options || [],
        correct_answer: q.correct || q.correct_answer || '',
        hint: q.hint || null,
        explanation: q.explanation || null,
        sort_order: idx + 1,
      }))
      const { error: qErr } = await supabase.from('questions').insert(qRows)
      if (qErr) console.warn('[lessons.create] failed to insert questions', qErr.message)
    }

    return lessonData
  } catch (e) {
    console.warn('[lessons.create] unexpected error', e.message)
    return null
  }
}
