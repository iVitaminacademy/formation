import { supabase } from './supabaseClient'

// Children linked to a parent (with their profiles).
export async function getChildren(parentId) {
  const { data, error } = await supabase
    .from('parent_child')
    .select('child_id, profiles:child_id(id, name, grade, avatar, streak_days)')
    .eq('parent_id', parentId)
  if (error) throw error
  return data.map(r => r.profiles)
}

// Link a child to the current parent using the kid's short link code.
// Uses a SECURITY DEFINER RPC so RLS doesn't hide the kid's profile.
export async function linkChildByCode(code) {
  const { data, error } = await supabase.rpc('link_child_by_code', {
    p_code: (code || '').trim(),
  })
  if (error) throw error
  // RPC returns a table → take the first row
  return Array.isArray(data) ? data[0] : data
}

export async function linkChild(parentId, childId) {
  const { data, error } = await supabase
    .from('parent_child')
    .upsert({ parent_id: parentId, child_id: childId }, { onConflict: 'parent_id,child_id' })
    .select()
  if (error) throw error
  return data
}

export async function unlinkChild(parentId, childId) {
  const { error } = await supabase
    .from('parent_child')
    .delete()
    .eq('parent_id', parentId)
    .eq('child_id', childId)
  if (error) throw error
}
