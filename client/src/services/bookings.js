import { supabase } from './supabaseClient'

// ─── Time Slots ───────────────────────────────────────────────────────────────

export async function getActiveSlots() {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('is_active', true)
    .order('start_time', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Returns a Set of slot_ids that are already booked (confirmed or completed)
// Uses a security-definer RPC so any authenticated user can check availability
// without seeing who made the booking.
export async function getBookedSlotIds() {
  const { data, error } = await supabase.rpc('get_booked_slot_ids')
  if (error) throw error
  return new Set((data ?? []).map(r => r.slot_id))
}

// ─── User Bookings ────────────────────────────────────────────────────────────

// Returns the user's most recent non-cancelled booking (with slot data joined)
export async function getMyBooking(userId) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, slot:slot_id(*)')
    .eq('user_id', userId)
    .in('status', ['confirmed', 'completed'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function createBooking(userId, slotId) {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ user_id: userId, slot_id: slotId, status: 'confirmed' })
    .select('*, slot:slot_id(*)')
    .single()
  if (error) throw error
  return data
}

export async function cancelBooking(bookingId) {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', bookingId)
  if (error) throw error
}

// Cancel old booking then create a new one on the new slot
export async function rescheduleBooking(oldBookingId, userId, newSlotId) {
  await cancelBooking(oldBookingId)
  return createBooking(userId, newSlotId)
}
