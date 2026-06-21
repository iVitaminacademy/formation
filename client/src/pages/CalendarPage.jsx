import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import KidLayout from '../components/KidLayout'
import { useAuth } from '../context/AuthContext'
import {
  getActiveSlots,
  getBookedSlotIds,
  getMyBooking,
  createBooking,
  cancelBooking,
  rescheduleBooking,
} from '../services/bookings'

// ─── Calendar helpers ─────────────────────────────────────────────────────────

// All slot times are stored in UTC and displayed in this fixed timezone.
// Africa/Casablanca = permanent GMT+1 (no daylight saving).
const whatsappNumber = "212622909768"
const whatsappLink = `https://wa.me/${whatsappNumber}`

const SLOT_TZ = 'Africa/Casablanca'

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

// Monday-first calendar grid: returns array of {date|null} for the month view
function buildCalendarDays(year, month) {
  const first = new Date(year, month, 1)
  const last  = new Date(year, month + 1, 0)
  const pad   = (first.getDay() + 6) % 7  // offset to Monday-first
  const days  = Array(pad).fill(null)
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

// Group slots by date in SLOT_TZ (not local browser timezone)
function groupByDate(slots) {
  const map = {}
  for (const s of slots) {
    const key = new Date(s.start_time).toLocaleDateString('fr-CA', { timeZone: SLOT_TZ })
    ;(map[key] || (map[key] = [])).push(s)
  }
  return map
}

// All public time formatters use SLOT_TZ so every user sees the same hour
function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: SLOT_TZ })
}

function fmtDateLong(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: SLOT_TZ })
}

// User's own local time — used only as a reference hint in modals
function fmtLocalTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function fmtMonth(date) {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SlotChip({ slot, status, onClick }) {
  const styles = {
    available: { bg: '#D1FAE5', color: '#065F46', cursor: 'pointer', border: '#6EE7B7' },
    mine:      { bg: '#DBEAFE', color: '#1E3A5F', cursor: 'default', border: '#93C5FD' },
    taken:     { bg: '#F3F4F6', color: '#9CA3AF', cursor: 'not-allowed', border: '#E5E7EB' },
    past:      { bg: '#F9FAFB', color: '#D1D5DB', cursor: 'not-allowed', border: '#F3F4F6' },
  }
  const s = styles[status] || styles.past
  return (
    <button
      onClick={() => status === 'available' && onClick(slot)}
      className="w-full text-[11px] font-bold px-1.5 py-0.5 rounded-md text-left truncate border transition-all"
      style={{ backgroundColor: s.bg, color: s.color, cursor: s.cursor, borderColor: s.border }}
      title={status === 'taken' ? 'Créneau déjà réservé' : status === 'past' ? 'Créneau passé' : `${fmtTime(slot.start_time)}`}
      disabled={status !== 'available'}
    >
      {status === 'mine' ? '📌 ' : ''}{fmtTime(slot.start_time)}
    </button>
  )
}

function ConfirmModal({ slot, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-3">📅</div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Confirmer la réservation</h2>
        <p className="text-sm text-gray-500 mb-1">Vous êtes sur le point de réserver le créneau :</p>
        <div className="my-4 px-4 py-3 rounded-2xl font-extrabold text-sm" style={{ backgroundColor: '#EFF6FF', color: '#1E3A5F' }}>
          {fmtDateLong(slot.start_time)}<br />
          <span className="text-base">{fmtTime(slot.start_time)} — {fmtTime(new Date(new Date(slot.start_time).getTime() + 3600000))}</span>
          <span className="text-[10px] font-bold ml-2 opacity-60">GMT+1</span>
        </div>
        {/* Local time hint — only shown if user is not already in GMT+1 */}
        {fmtLocalTime(slot.start_time) !== fmtTime(slot.start_time) && (
          <p className="text-xs text-amber-600 font-semibold -mt-2 mb-3 px-1">
            🕐 Votre heure locale : {fmtLocalTime(slot.start_time)} — {fmtLocalTime(new Date(new Date(slot.start_time).getTime() + 3600000))}
          </p>
        )}
        <p className="text-xs text-gray-400 mb-6">Durée : 1 heure · Un seul créneau autorisé par utilisateur.</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-2xl border-2 font-bold text-sm text-gray-600" style={{ borderColor: '#E5E7EB' }}>
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-extrabold text-sm text-white transition-all"
            style={{ backgroundColor: loading ? '#9CA3AF' : '#1E3A5F' }}
          >
            {loading ? '…' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CancelModal({ booking, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-3">⚠️</div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Annuler la réservation ?</h2>
        <p className="text-sm text-gray-500 mb-4">
          Votre créneau du <strong>{fmtDateLong(booking.slot.start_time)}</strong> à <strong>{fmtTime(booking.slot.start_time)}</strong> sera libéré.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-2xl border-2 font-bold text-sm text-gray-600" style={{ borderColor: '#E5E7EB' }}>
            Retour
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-2xl font-extrabold text-sm text-white"
            style={{ backgroundColor: loading ? '#9CA3AF' : '#EF4444' }}
          >
            {loading ? '…' : 'Confirmer l\'annulation'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const { user, profile } = useAuth()

  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date(); d.setDate(1); return d
  })
  const [slots,         setSlots]         = useState([])
  const [bookedIds,     setBookedIds]     = useState(new Set())
  const [myBooking,     setMyBooking]     = useState(null)
  const [loading,       setLoading]       = useState(true)
  const [err,           setErr]           = useState(null)
  const [selectedSlot,  setSelectedSlot]  = useState(null)
  const [showCancel,    setShowCancel]    = useState(false)
  const [reschMode,     setReschMode]     = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  async function load() {
    if (!user?.id) { setLoading(false); return }
    setErr(null)
    try {
      const [allSlots, taken, booking] = await Promise.all([
        getActiveSlots(),
        getBookedSlotIds(),
        getMyBooking(user.id),
      ])
      setSlots(allSlots)
      setBookedIds(taken)
      setMyBooking(booking)
    } catch(e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [user?.id]) // eslint-disable-line

  // ── Derived state ────────────────────────────────────────────────────────────
  const now              = new Date()
  const isBookingUsed    = !!(profile?.booking_used)
  const hasBooking       = !!myBooking && myBooking.status === 'confirmed'
  const isCompleted      = myBooking?.status === 'completed'
  const slotTime         = myBooking?.slot?.start_time ? new Date(myBooking.slot.start_time) : null
  const bookingLocked    = !!(slotTime && slotTime <= now)
  const bookingUpcoming  = hasBooking && slotTime > now

  function getSlotStatus(slot) {
    if (new Date(slot.start_time) <= now) return 'past'
    if (myBooking?.slot_id === slot.id && hasBooking) return 'mine'
    if (bookedIds.has(slot.id)) return 'taken'
    return 'available'
  }

  // ── Calendar data ─────────────────────────────────────────────────────────
  const year      = currentMonth.getFullYear()
  const month     = currentMonth.getMonth()
  const calDays   = buildCalendarDays(year, month)
  const byDate    = groupByDate(slots)

  function prevMonth() { setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  // ── Action handlers ───────────────────────────────────────────────────────
  async function handleBook(slot) {
    if (reschMode) {
      setSelectedSlot(slot)  // open confirm with reschedule context
    } else {
      setSelectedSlot(slot)
    }
  }

  async function handleConfirmBook() {
    if (!selectedSlot || !user?.id) return
    setActionLoading(true)
    try {
      if (reschMode && myBooking) {
        const newBooking = await rescheduleBooking(myBooking.id, user.id, selectedSlot.id)
        setMyBooking(newBooking)
        setReschMode(false)
      } else {
        const newBooking = await createBooking(user.id, selectedSlot.id)
        setMyBooking(newBooking)
      }
      setBookedIds(prev => new Set([...prev, selectedSlot.id]))
      setSelectedSlot(null)
    } catch(e) { setErr(e.message || 'Erreur lors de la réservation.') }
    finally { setActionLoading(false) }
  }

  async function handleCancelConfirm() {
    if (!myBooking) return
    setActionLoading(true)
    try {
      await cancelBooking(myBooking.id)
      setBookedIds(prev => { const s = new Set(prev); s.delete(myBooking.slot_id); return s })
      setMyBooking(null)
      setShowCancel(false)
      setReschMode(false)
    } catch(e) { setErr(e.message || 'Erreur lors de l\'annulation.') }
    finally { setActionLoading(false) }
  }

  // ── Screens ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <KidLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center"><div className="text-4xl mb-3 animate-pulse">📅</div><p className="text-gray-400 font-semibold">Chargement du calendrier…</p></div>
        </div>
      </KidLayout>
    )
  }

  // Session permanently consumed
  if (isBookingUsed || isCompleted) {
    return (
      <KidLayout>
        <div className="max-w-lg mx-auto flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: '#1E3A5F' }}>Session de réservation utilisée</h1>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Vous avez déjà bénéficié de votre séance de consultation. Pour obtenir une assistance supplémentaire, veuillez contacter l'administrateur.
          </p>
          <div className="w-full max-w-sm space-y-3">
            <a
              href="mailto:support@ivitaminacademy.com"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-extrabold text-sm text-white"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              ✉️ Contacter par e-mail
            </a>
            <div className="px-5 py-4 rounded-2xl text-xs text-gray-500 border-2" style={{ borderColor: '#E5E7EB' }}>
              Vous pouvez également utiliser le formulaire de contact ou nous joindre directement via la page Contact.
            </div>
          </div>
        </div>
      </KidLayout>
    )
  }

  return (
    <>
    <KidLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">📅 Calendrier de réservation</h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">Réservez un créneau de consultation d'1 heure avec votre accompagnateur.</p>

          {/* Timezone notice */}
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold"
            style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
          >
            <span>🌍</span>
            <span>
              Tous les horaires sont affichés en <strong>GMT+1</strong> (heure Maroc · France hiver).
              {' '}Si votre pays a un décalage différent, l'heure locale sera indiquée lors de la réservation.
            </span>
          </div>
        </div>

        {err && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-red-700 bg-red-50 border border-red-200">{err}</div>
        )}

        {/* Active booking card */}
        {myBooking && (hasBooking || bookingLocked) && (
          <div
            className="mb-6 rounded-2xl border-2 p-5"
            style={{
              borderColor: bookingLocked ? '#FCA5A5' : '#93C5FD',
              backgroundColor: bookingLocked ? '#FEF2F2' : '#EFF6FF',
            }}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest mb-1"
                  style={{ color: bookingLocked ? '#991B1B' : '#1E3A5F' }}>
                  {bookingLocked ? '🔒 Séance en cours / passée' : '📌 Votre réservation'}
                </p>
                <p className="text-base font-extrabold" style={{ color: '#0F172A' }}>
                  {fmtDateLong(myBooking.slot.start_time)}
                </p>
                <p className="text-sm font-bold text-gray-600">
                  {fmtTime(myBooking.slot.start_time)} — {fmtTime(new Date(new Date(myBooking.slot.start_time).getTime() + 3600000))}
                </p>
              </div>
              {!bookingLocked && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setReschMode(true); setErr(null) }}
                    className="px-4 py-2 rounded-xl font-bold text-xs border-2 transition-all"
                    style={{ borderColor: '#1E3A5F', color: '#1E3A5F', backgroundColor: 'white' }}
                  >
                    ↕ Modifier
                  </button>
                  <button
                    onClick={() => setShowCancel(true)}
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white transition-all"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    ✕ Annuler
                  </button>
                </div>
              )}
            </div>
            {bookingLocked && (
              <p className="mt-3 text-xs font-semibold" style={{ color: '#991B1B' }}>
                Ce créneau ne peut plus être modifié. Votre séance sera traitée par l'administrateur.
              </p>
            )}
          </div>
        )}

        {/* Reschedule mode banner */}
        {reschMode && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 border-2 border-amber-200 flex items-center justify-between gap-3">
            <span>↕ Sélectionnez un nouveau créneau pour modifier votre réservation.</span>
            <button onClick={() => setReschMode(false)} className="text-xs underline shrink-0">Annuler</button>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-3xl border-2 p-5 shadow-sm" style={{ borderColor: '#BFDBFE' }}>

          {/* Month nav */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-gray-600 hover:bg-gray-100 transition-colors">‹</button>
            <span className="text-sm font-extrabold capitalize" style={{ color: '#1E3A5F' }}>{fmtMonth(currentMonth)}</span>
            <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-gray-600 hover:bg-gray-100 transition-colors">›</button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-extrabold uppercase tracking-widest py-1" style={{ color: '#94A3B8' }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => {
              if (!day) return <div key={i} />
              const key    = day.toLocaleDateString('fr-CA')
              const today  = day.toDateString() === now.toDateString()
              const isPast = startOfDay(day) < startOfDay(now)
              const daySlots = (byDate[key] || []).sort((a, b) => new Date(a.start_time) - new Date(b.start_time))

              return (
                <div
                  key={key}
                  className="rounded-xl p-1 min-h-[60px] border"
                  style={{
                    borderColor: today ? '#1E3A5F' : '#F1F5F9',
                    backgroundColor: today ? '#EFF6FF' : 'transparent',
                  }}
                >
                  <div
                    className="text-[11px] font-extrabold mb-1 text-center"
                    style={{ color: today ? '#1E3A5F' : isPast ? '#CBD5E1' : '#374151' }}
                  >
                    {day.getDate()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {daySlots.map(slot => (
                      <SlotChip
                        key={slot.id}
                        slot={slot}
                        status={getSlotStatus(slot)}
                        onClick={handleBook}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty state — no slots this month */}
          {slots.filter(s => {
            const d = new Date(s.start_time)
            return d.getFullYear() === year && d.getMonth() === month
          }).length === 0 && (
            <div className="mt-4 py-6 text-center text-xs font-semibold rounded-2xl border-2 border-dashed" style={{ borderColor: '#CBD5E1', color: '#94A3B8' }}>
              Aucun créneau disponible ce mois-ci.<br />
              Utilisez ‹ › pour naviguer ou contactez l'administrateur.
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center text-[10px] font-bold">
            {[
              { color: '#D1FAE5', border: '#6EE7B7', label: 'Disponible', text: '#065F46' },
              { color: '#DBEAFE', border: '#93C5FD', label: 'Ma réservation', text: '#1E3A5F' },
              { color: '#F3F4F6', border: '#E5E7EB', label: 'Non disponible', text: '#9CA3AF' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border" style={{ backgroundColor: l.color, borderColor: l.border }} />
                <span style={{ color: l.text }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        {!myBooking && !reschMode && (
          <div className="mt-4 px-5 py-4 rounded-2xl text-xs font-semibold text-gray-500 border-2" style={{ borderColor: '#E5E7EB' }}>
            ℹ️ Vous ne pouvez réserver qu'<strong>un seul créneau</strong> d'1 heure. Une fois la séance effectuée, tout besoin d'assistance supplémentaire doit être adressé à l'administrateur.
          </div>
        )}

      </div>

 <div className="max-w-3xl mx-auto mt-6">
  <div className="mb-6 text-center">

    {/* Separator clean */}
    <div className="flex items-center gap-3 mb-4">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Alternative
      </span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>

    {/* Message */}
    <p className="text-sm text-gray-600 font-semibold mb-4">
      Ou bien, vous pouvez contacter directement l’administrateur via WhatsApp.
    </p>

    {/* WhatsApp CTA */}
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-white shadow-md transition-all hover:scale-105"
      style={{ backgroundColor: '#25D366' }}
    >
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        width="20"
        height="20"
      >
        <path d="M19.11 17.53c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.12-.41-2.13-1.31-.78-.7-1.31-1.57-1.46-1.84-.15-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26 0 1.33.98 2.61 1.12 2.79.14.18 1.92 2.94 4.66 4.12.65.28 1.16.45 1.56.58.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"/>
        <path d="M16 3C9.37 3 4 8.37 4 15c0 2.11.55 4.1 1.52 5.84L4 29l8.35-1.47C14.04 28.48 15 28.5 16 28.5c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 22.5c-1 0-1.98-.16-2.9-.47l-.21-.07-4.96.87.88-4.83-.14-.22A9.47 9.47 0 0 1 6.5 15C6.5 9.75 10.75 5.5 16 5.5S25.5 9.75 25.5 15 21.25 25.5 16 25.5z"/>
      </svg>

      Contacter sur WhatsApp
    </a>

    {/* Small hint */}
    <p className="text-[11px] text-gray-400 mt-3">
      Réponse rapide via WhatsApp
    </p>

  </div>
</div>

 



    </KidLayout>

    {/* Modals — rendered via Portal at document.body so they are never
        clipped by KidLayout's overflow-y-auto or overflow-hidden containers */}
    {selectedSlot && createPortal(
      <ConfirmModal
        slot={selectedSlot}
        onConfirm={handleConfirmBook}
        onClose={() => setSelectedSlot(null)}
        loading={actionLoading}
      />,
      document.body
    )}
    {showCancel && myBooking && createPortal(
      <CancelModal
        booking={myBooking}
        onConfirm={handleCancelConfirm}
        onClose={() => setShowCancel(false)}
        loading={actionLoading}
      />,
      document.body
    )}
  </>
  )
}
