import { useNavigate } from 'react-router-dom'

const trustItems = [
  { icon: '✅', label: 'Grades 4 & 5 curriculum', color: '#16A34A' },
  { icon: '📊', label: 'Progress tracking',        color: '#3B82F6' },
  { icon: '👨‍👧', label: 'Parent & kid modes',       color: '#EC4899' },
  { icon: '🏆', label: 'Badges & rewards',         color: '#F97316' },
]

function ModeCard({ illustrationBg, emoji, isParent, title, subtitle, btnColor, btnHover, btnLabel, onClick }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
      <div
        className="flex items-center justify-center"
        style={{ height: 200, background: illustrationBg }}
      >
        {isParent ? (
          <div
            className="flex items-center justify-center rounded-2xl bg-white"
            style={{ width: 88, height: 88, boxShadow: '0 2px 12px rgba(0,0,0,0.10)' }}
          >
            <span className="select-none" style={{ fontSize: 42, lineHeight: 1 }}>👨‍👧</span>
          </div>
        ) : (
          <span className="select-none" style={{ fontSize: 70, lineHeight: 1 }}>
            {emoji}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <h2 className="text-lg font-extrabold" style={{ color: '#111827' }}>{title}</h2>
          <p className="mt-1.5 text-sm leading-5 text-slate-500">{subtitle}</p>
        </div>
        <button
          onClick={onClick}
          className="w-full rounded-xl py-3 text-sm font-bold text-white transition-colors duration-200"
          style={{ backgroundColor: btnColor }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = btnHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = btnColor)}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#F0FDF4' }}>
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6">

        {/* Header */}
        <header className="flex items-center justify-between py-5">
          <div className="text-2xl font-extrabold tracking-tight">
            <span style={{ color: '#111827' }}>Frazzl</span>
            <span style={{ color: '#16A34A' }}>.kid</span>
          </div>

          <nav className="hidden gap-8 md:flex">
            <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">About</a>
            <button type="button" onClick={() => navigate('/how')} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">How it works</button>
            <a href="/faq" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">FAQ</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition"
            style={{ backgroundColor: '#A855F7' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#9333EA')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#A855F7')}
          >
            Sign In
          </button>
        </header>

        {/* Main */}
        <main className="flex flex-1 flex-col items-center pb-12 pt-8">

          {/* Hero */}
          <section className="flex flex-col items-center text-center">
            <img
              src="/favicon.svg"
              alt="Frazzl.kid logo"
              className="mb-8 h-32 w-32 rounded-[28px] border-4 border-white shadow-[0_18px_40px_rgba(34,25,82,0.12)]"
            />
            <h1 className="text-4xl font-extrabold leading-tight" style={{ color: '#111827' }}>
              Math learning made{' '}
              <span className="whitespace-nowrap" style={{ color: '#EC4899' }}>fun &amp; simple</span>
              <br />
              for Grades 4 &amp; 5
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm font-semibold leading-6 text-slate-600">
              Choose how you want to join today — as a kid learning independently,
              or as a parent helping your child succeed.
            </p>
          </section>

          {/* Mode cards */}
          <section className="mt-10 grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-5">
            <ModeCard
              illustrationBg="linear-gradient(135deg, #FED7AA 0%, #FB923C 100%)"
              emoji="🧒"
              title="I'm learning"
              subtitle="Kid Mode — Grade 4 & 5 · Learn at your own pace"
              btnColor="#F97316"
              btnHover="#EA580C"
              btnLabel="Start learning →"
              onClick={() => navigate('/kid/dashboard')}
            />
            <ModeCard
              illustrationBg="linear-gradient(135deg, #DCFCE7 0%, #86EFAC 100%)"
              isParent
              title="I'm helping"
              subtitle="Parent Mode — See your child's progress & guide them"
              btnColor="#16A34A"
              btnHover="#15803D"
              btnLabel="Enter Parent Mode →"
              onClick={() => navigate('/parent/dashboard')}
            />
          </section>

          {/* Trust bar */}
          <section className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {trustItems.map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm font-semibold" style={{ color: item.color }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </section>

        </main>
      </div>
    </div>
  )
}
