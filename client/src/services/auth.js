import { supabase } from './supabaseClient'

// Sign up a kid or parent. Profile row is created automatically by the
// `handle_new_user` trigger using this metadata.
export async function signUp({ email, password, name, role, grade }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        grade: grade ? String(grade) : '',
      },
    },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// Fetch the public.profiles row for a given user id.
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// ── Password reset via magic link ────────────────────────────────────────

/**
 * Send a magic link to the user's email. When clicked, the user returns to
 * /login?reset=1 with a session established. The modal detects this and
 * prompts for a new password.
 */
export async function sendResetLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      // Don't set redirectTo — let Supabase use its default redirect
      // which includes the token hash. We'll detect the session on return.
    },
  })
  if (error) throw error
}

/**
 * Change password (user must be authenticated via magic link first).
 */
export async function changePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
