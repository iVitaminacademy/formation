import { useNavigate } from 'react-router-dom'

const trustItems = [
  { icon: '📚', label: 'Grades 4 & 5 curriculum', color: '#F97316' },
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
          <div className="relative flex items-center justify-center gap-4 drop-shadow-lg">
            <span role="img" aria-label="woman parent" style={{ fontSize: 64, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' }}>
              👩‍🦰
            </span>
            <span role="img" aria-label="man parent" style={{ fontSize: 64, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' }}>
              👨‍🦰
            </span>
          </div>
        ) : (
          <div className="relative drop-shadow-lg">
            <span role="img" aria-label="kid avatar" style={{ fontSize: 80, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' }}>
              👱‍♀️
            </span>
          </div>
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
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #F5F0FF 0%, #EDE4FF 25%, #F3E8FF 50%, #F8F4FF 75%, #FDFBFF 100%)' }}>
      {/* Subtle decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#743290]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#5E17EB]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#743290]/8 blur-3xl" />
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
              <span style={{ color: '#743290' }}>Frazzl</span>
              <span style={{ color: '#5E17EB' }}>.kid</span>
            </div>
          </div>

          <nav className="hidden gap-8 md:flex">
            <button type="button" onClick={() => navigate('/how')} className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">How it works</button>
            <a href="/faq" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">FAQ</a>
            <a href="/privacy" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Privacy &amp; Terms</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#5E17EB' }}
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
              <span className="whitespace-nowrap" style={{ color: '#5E17EB' }}>fun &  </span>
              <span className="whitespace-nowrap" style={{ color: '#743290' }}> simple</span>
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
              badgeColor="#F97316"
              badgeBg="#FFF7ED"
              title="I'm Helping"
              subtitle="Track progress, guide learning, and celebrate wins."
              features={[
                'Real-time progress dashboard',
                'Detailed quiz reports & insights',
                'Link multiple children easily',
              ]}
              btnColor="#F97316"
              btnHover="#EA580C"
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
            © 2026 <span style={{ color: '#111827' }}>Frazzl</span><span style={{ color: '#F97316' }}>.kid</span> — Built for kids, trusted by parents.
          </p>
        </footer>
      </div>
    </div>
  )
}
