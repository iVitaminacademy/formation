import { supabase } from './supabaseClient'

// Sets certificate_issued_at and certificate_score_pct once.
// The .is('certificate_issued_at', null) filter ensures we never overwrite
// an already-issued certificate even if called more than once.
export async function saveCertificate(userId, scorePct) {
  const { error } = await supabase
    .from('profiles')
    .update({
      certificate_issued_at: new Date().toISOString(),
      certificate_score_pct: scorePct,
    })
    .eq('id', userId)
    .is('certificate_issued_at', null)
  if (error) throw error
}

// Callable without auth (anon). Returns { valid, name, score_pct,
// issued_at, formation } or null if the code is unknown / not yet earned.
export async function verifyCertificate(code) {
  const { data, error } = await supabase.rpc('verify_certificate', { p_code: code })
  if (error) throw error
  return data
}
