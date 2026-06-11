import { supabase } from './supabaseClient'

// Médecins liés à un superviseur (avec leurs profils).
export async function getChildren(superviseurId) {
  const { data, error } = await supabase
    .from('supervisor_medecin')
    .select('medecin_id, profiles:medecin_id(id, name, grade, avatar, streak_days)')
    .eq('superviseur_id', superviseurId)
  if (error) throw error
  return data.map(r => r.profiles)
}

// Lier un médecin au superviseur courant via son code.
export async function linkChildByCode(code) {
  const { data, error } = await supabase.rpc('link_medecin_by_code', {
    p_code: (code || '').trim(),
  })
  if (error) throw error
  return Array.isArray(data) ? data[0] : data
}

export async function linkChild(superviseurId, medecinId) {
  const { data, error } = await supabase
    .from('supervisor_medecin')
    .upsert(
      { superviseur_id: superviseurId, medecin_id: medecinId },
      { onConflict: 'superviseur_id,medecin_id' }
    )
    .select()
  if (error) throw error
  return data
}

export async function unlinkChild(superviseurId, medecinId) {
  const { error } = await supabase
    .from('supervisor_medecin')
    .delete()
    .eq('superviseur_id', superviseurId)
    .eq('medecin_id', medecinId)
  if (error) throw error
}
