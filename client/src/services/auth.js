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

// Send a password-reset email. The link routes the user to /reset-password,
// where Supabase establishes a temporary recovery session.
// 
// NOTE: The redirect URL passed here may be overridden by the Supabase
// Dashboard's Site URL setting. Make sure the Dashboard has the correct
// production URL (not localhost:3000) configured under
// Authentication → URL Configuration → Site URL.
export async function sendPasswordReset(email) {
  const origin = window.location.origin
  const redirectTo = `${origin}/reset-password`

  // Safety: warn if we detect a mismatch that suggests the Supabase config
  // still points to the wrong domain.
  if (origin === 'http://localhost:5173') {
    console.log('[auth] Local dev: reset-password redirect is', redirectTo)
  } else if (!origin.startsWith('https://')) {
    console.warn('[auth] Non-HTTPS origin for password reset:', origin)
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })
  if (error) throw error
}

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
