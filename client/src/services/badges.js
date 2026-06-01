import { supabase } from './supabaseClient'

// Full badge catalog.
export async function getAllBadges() {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .order('condition_value', { ascending: true })
  if (error) throw error
  return data
}

// Badges a user has earned (joined with the catalog).
export async function getEarnedBadges(userId) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('earned_at, badges(*)')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

// Earned + unearned, ready for the badges grid.
export async function getBadgesWithStatus(userId) {
  const [all, earned] = await Promise.all([getAllBadges(), getEarnedBadges(userId)])
  const earnedIds = new Set(earned.map(e => e.badges?.id))
  return all.map(b => ({ ...b, earned: earnedIds.has(b.id) }))
}

export async function awardBadge(userId, badgeId) {
  const { data, error } = await supabase
    .from('user_badges')
    .upsert({ user_id: userId, badge_id: badgeId }, { onConflict: 'user_id,badge_id' })
    .select()
  if (error) throw error
  return data
}
