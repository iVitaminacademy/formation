import { useNavigate } from 'react-router-dom'

const trustItems = [
  { icon: '✅', label: 'Grades 4 & 5 curriculum' },
  { icon: '📊', label: 'Progress tracking' },
  { icon: '👨‍👧', label: 'Parent & kid modes' },
  { icon: '🏆', label: 'Badges & rewards' },
]

function ModeCard({ illustrationBg, border, emoji, title, subtitle, btnColor, btnHover, btnLabel, onClick }) {
  return (
    <div
      className="flex-1 rounded-3xl border-2 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{
        borderColor: border,
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
      }}
    >
      {/* Illustration */}
      <div
        className="flex items-center justify-center relative overflow-hidden"
        style={{ height: 160, background: illustrationBg }}
      >
        <div
          className="absolute rounded-full"
          style={{ width: 130, height: 130, backgroundColor: 'rgba(255,255,255,0.35)', top: 30, left: '50%', transform: 'translateX(-50%)' }}
        />
        <span
          className="relative z-10 select-none"
          style={{ fontSize: 72, lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.15))' }}
        >
          {emoji}
        </span>
      </div>

      {/* Body */}
      <div className="px-6 py-5 flex flex-col flex-1">
        <h2 className="text-lg font-extrabold mb-1.5" style={{ color: '#1a1a2e' }}>{title}</h2>
        <p className="text-sm text-gray-500 font-medium mb-5 leading-snug flex-1">{subtitle}</p>
        <button
          onClick={onClick}
          className="w-full py-3 rounded-2xl text-white font-extrabold text-sm tracking-wide transition-all duration-200"
          style={{ backgroundColor: btnColor, boxShadow: `0 4px 12px ${btnColor}55` }}
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
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0FF' }}>

      {/* ── Navbar ── */}
      <nav
        className="flex items-center justify-between px-12 py-3.5 bg-white sticky top-0 z-20 shrink-0"
        style={{ boxShadow: '0 1px 0 #EAE0F8, 0 4px 16px rgba(107,63,160,0.06)' }}
      >
        <span className="text-2xl font-extrabold tracking-tight">
          <span style={{ color: '#6B3FA0' }}>Math</span>
          <span style={{ color: '#2D7A4F' }}>Mates</span>
        </span>

        <div className="flex items-center gap-8">
          <a href="#about" className="text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors">About</a>
          <a href="#how"   className="text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors">How it works</a>
          <a href="#faq"   className="text-gray-500 hover:text-gray-800 text-sm font-semibold transition-colors">FAQ</a>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl text-sm font-extrabold text-white transition-all duration-200"
            style={{ backgroundColor: '#6B3FA0', boxShadow: '0 2px 8px rgba(107,63,160,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a3388')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#6B3FA0')}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero — fills remaining viewport height ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-10">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest mb-5"
          style={{ backgroundColor: '#EDE4FF', color: '#6B3FA0' }}
        >
          ✨ Interactive Math Platform
        </div>

        {/* Headline */}
        <h1
          className="text-5xl font-extrabold text-center leading-tight mb-4"
          style={{ color: '#1a1a2e', letterSpacing: '-1.5px' }}
        >
          Math learning made{' '}
          <span style={{ color: '#6B3FA0' }}>fun &amp; simple</span>
          <br />
          for Grades 4 &amp; 5
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-500 text-base mb-10 max-w-md leading-relaxed font-medium">
          Join as a kid learning independently, or as a parent guiding your child's success.
        </p>

        {/* ── Mode Cards ── */}
        <div className="flex gap-6 w-full mb-8" style={{ maxWidth: 780 }}>
          <ModeCard
            illustrationBg="linear-gradient(145deg, #EDE4FF, #D4BBFA)"
            border="#C9A8F0"
            emoji="🧒"
            title="I'm learning"
            subtitle="Kid Mode — Grades 4 & 5. Learn at your own pace with lessons, quizzes, and badges."
            btnColor="#6B3FA0"
            btnHover="#5a3388"
            btnLabel="Start learning →"
            onClick={() => navigate('/kid/dashboard')}
          />
          <ModeCard
            illustrationBg="linear-gradient(145deg, #D6F0E0, #B2DFC4)"
            border="#90CCA8"
            emoji="👨‍👧"
            title="I'm helping"
            subtitle="Parent Mode — See your child's progress and get step-by-step teaching guides."
            btnColor="#2D7A4F"
            btnHover="#245f3e"
            btnLabel="Enter Parent Mode →"
            onClick={() => navigate('/parent/dashboard')}
          />
        </div>

        {/* ── Trust Bar ── */}
        <div className="flex gap-3 flex-wrap justify-center">
          {trustItems.map(item => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-sm text-gray-600 font-semibold"
              style={{ boxShadow: '0 1px 6px rgba(107,63,160,0.10)', border: '1px solid #E5D8FA' }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
