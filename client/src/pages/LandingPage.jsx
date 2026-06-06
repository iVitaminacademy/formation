import { useNavigate } from 'react-router-dom'

const trustItems = [
  { icon: '📚', label: 'Grades 4 & 5 curriculum', color: '#16A34A' },
  { icon: '📊', label: 'Progress tracking',        color: '#3B82F6' },
  { icon: '👨‍👧', label: 'Parent & kid modes',       color: '#EC4899' },
  { icon: '🏆', label: 'Badges & rewards',         color: '#F97316' },
]

function ModeCard({ illustrationBg, emoji, isParent, title, subtitle, features, btnColor, btnHover, btnLabel, badge, badgeColor, badgeBg, onClick }) {
  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-transparent bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-current hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)]"
      style={{ '--tw-border-opacity': 1, '--hover-border-color': btnColor }}
      onClick={onClick}
    >
      {/* Top illustration area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: 200, background: illustrationBg }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/15" />
        <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10" />
        <div className="absolute top-4 right-12 h-10 w-10 rounded-full bg-white/15" />

        {isParent ? (
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-lg">
            {/* Parent with chart/tablet */}
            <rect x="62" y="52" width="44" height="34" rx="5" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            <rect x="68" y="58" width="14" height="2" rx="1" fill="#16A34A"/>
            <rect x="68" y="63" width="24" height="2" rx="1" fill="#D1FAE5"/>
            <rect x="68" y="68" width="18" height="2" rx="1" fill="#D1FAE5"/>
            <rect x="68" y="73" width="28" height="2" rx="1" fill="#D1FAE5"/>
            <rect x="68" y="78" width="20" height="2" rx="1" fill="#D1FAE5"/>
            {/* Parent figure */}
            <circle cx="40" cy="30" r="14" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            <circle cx="35" cy="27" r="2.5" fill="#16A34A"/>
            <circle cx="45" cy="27" r="2.5" fill="#16A34A"/>
            <path d="M35 36 Q40 40 45 36" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <rect x="32" y="46" width="16" height="2" rx="1" fill="white" opacity="0.8"/>
            <rect x="30" y="52" width="20" height="18" rx="6" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            {/* Kid on side */}
            <circle cx="22" cy="64" r="9" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            <circle cx="19" cy="62" r="1.8" fill="#16A34A"/>
            <circle cx="25" cy="62" r="1.8" fill="#16A34A"/>
            <path d="M19 68 Q22 70 25 68" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <rect x="19" y="74" width="6" height="2" rx="1" fill="white" opacity="0.6"/>
            <rect x="17" y="78" width="10" height="12" rx="5" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
          </svg>
        ) : (
          <svg width="130" height="130" viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-lg">
            {/* Kid figure */}
            <circle cx="65" cy="32" r="16" fill="white" stroke="#F97316" strokeWidth="3"/>
            {/* Hair */}
            <path d="M49 28 Q52 16 65 14 Q78 16 81 28" fill="#F97316" opacity="0.3"/>
            {/* Eyes */}
            <circle cx="59" cy="30" r="3" fill="#F97316"/>
            <circle cx="71" cy="30" r="3" fill="#F97316"/>
            <circle cx="60" cy="29" r="1.2" fill="white"/>
            <circle cx="72" cy="29" r="1.2" fill="white"/>
            {/* Smile */}
            <path d="M58 38 Q65 45 72 38" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            {/* Body */}
            <rect x="57" y="50" width="16" height="2" rx="1" fill="white" opacity="0.7"/>
            <rect x="54" y="56" width="22" height="24" rx="8" fill="white" stroke="#F97316" strokeWidth="3"/>
            {/* Math symbols floating */}
            <text x="20" y="50" fontSize="18" fontWeight="800" fill="white" opacity="0.7">+</text>
            <text x="100" y="45" fontSize="16" fontWeight="800" fill="white" opacity="0.6">×</text>
            <text x="12" y="78" fontSize="14" fontWeight="800" fill="white" opacity="0.5">÷</text>
            <text x="105" y="78" fontSize="20" fontWeight="800" fill="white" opacity="0.7">=</text>
            {/* Star */}
            <text x="90" y="62" fontSize="12" fill="white" opacity="0.8">⭐</text>
            <text x="30" y="62" fontSize="10" fill="white" opacity="0.6">🔢</text>
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        {/* Badge */}
        {badge && (
          <div className="mb-3 inline-flex self-start rounded-lg px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: badgeBg, color: badgeColor }}>
            {badge}
          </div>
        )}

        <h2 className="text-[22px] font-extrabold leading-tight text-gray-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>

        {/* Feature bullets */}
        {features && features.length > 0 && (
          <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                <span className="mt-0.5 shrink-0 text-sm" style={{ color: btnColor }}>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer pushes button to bottom */}
        <div className="mt-auto pt-5">
          <button
            className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: btnColor }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = btnHover
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.20)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = btnColor
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EEF2FF 0%, #F0FDF4 30%, #FFF7ED 60%, #FDF2F8 100%)' }}>
      {/* Subtle decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-200/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-100/20 blur-3xl" />
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">

        {/* Header */}
        <header className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="Frazzl.kid logo"
              className="h-16 w-16 rounded-xl shadow-sm"
            />
            <div className="text-2xl font-extrabold tracking-tight">
              <span style={{ color: '#111827' }}>Frazzl</span>
              <span style={{ color: '#16A34A' }}>.kid</span>
            </div>
          </div>

          <nav className="hidden gap-8 md:flex">
            <button type="button" onClick={() => navigate('/how')} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">How it works</button>
            <a href="/faq" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">FAQ</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#A855F7' }}
          >
            Sign In
          </button>
        </header>

        {/* Main */}
        <main className="flex flex-1 flex-col items-center pb-14 pt-10">

          {/* Hero */}
          <section className="flex flex-col items-center text-center">           
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Math learning made{' '}
              <span className="whitespace-nowrap" style={{ color: '#EC4899' }}>fun & simple</span>
              <br />
              for Grades 4 & 5
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-7 text-slate-500">
              Choose how you want to join today — as a kid learning independently,
              or as a parent helping your child succeed.
            </p>
          </section>

          {/* Mode cards */}
          <section className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
            <ModeCard
              illustrationBg="linear-gradient(135deg, #FFF4E6 0%, #FDBB7C 50%, #FB923C 100%)"
              emoji="🧒"
              badge="Kid Mode"
              badgeColor="#F97316"
              badgeBg="#FFF7ED"
              title="I'm Learning"
              subtitle="Dive into fun math challenges designed just for you."
              features={[
                'Interactive lessons for Grade 4 & 5',
                'Earn badges & build streaks',
                'Learn at your own pace',
              ]}
              btnColor="#F97316"
              btnHover="#EA580C"
              btnLabel="Start learning →"
              onClick={() => navigate('/kid/dashboard')}
            />
            <ModeCard
              illustrationBg="linear-gradient(135deg, #ECFDF5 0%, #6EE7B7 50%, #34D399 100%)"
              isParent
              badge="Parent Mode"
              badgeColor="#16A34A"
              badgeBg="#F0FDF4"
              title="I'm Helping"
              subtitle="Track progress, guide learning, and celebrate wins."
              features={[
                'Real-time progress dashboard',
                'Detailed quiz reports & insights',
                'Link multiple children easily',
              ]}
              btnColor="#16A34A"
              btnHover="#15803D"
              btnLabel="Enter parent mode →"
              onClick={() => navigate('/parent/dashboard')}
            />
          </section>

          {/* Trust bar */}
          <section className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustItems.map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm font-semibold" style={{ color: item.color }}>
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-6 text-center">
          <p className="text-xs font-semibold text-slate-400">
            © 2026 <span style={{ color: '#111827' }}>Frazzl</span><span style={{ color: '#16A34A' }}>.kid</span> — Built for kids, trusted by parents.
          </p>
        </footer>
      </div>
    </div>
  )
}
