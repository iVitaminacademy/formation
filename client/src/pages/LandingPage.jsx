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
          <svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-lg">
            {/* ====== DAD (left) ====== */}
            {/* Neck */}
            <path d="M44 30 Q47 40 48 48" stroke="#16A34A" strokeWidth="3" fill="none" opacity="0.4"/>
            {/* Body/shirt */}
            <rect x="28" y="48" width="42" height="38" rx="10" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            {/* Collar */}
            <path d="M35 48 L42 54 L49 48" fill="#16A34A" opacity="0.15" stroke="#16A34A" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M49 48 L56 54 L63 48" fill="#16A34A" opacity="0.15" stroke="#16A34A" strokeWidth="1.5" strokeLinejoin="round"/>
            {/* Pocket */}
            <rect x="33" y="62" width="10" height="8" rx="2" fill="none" stroke="#16A34A" strokeWidth="1.2" opacity="0.4"/>
            {/* Head */}
            <ellipse cx="49" cy="26" rx="18" ry="20" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            {/* Hair - top */}
            <path d="M31 24 Q31 5 49 6 Q67 5 67 24 Q66 18 58 16 Q54 8 49 9 Q44 8 40 16 Q32 18 31 24Z" fill="#1a1a2e" opacity="0.8"/>
            <path d="M31 24 Q32 14 40 12 Q38 8 42 7 Q46 5 49 5 Q52 5 56 7 Q60 8 58 12 Q66 14 67 24" fill="#2d2d3d" opacity="0.7"/>
            {/* Side hair */}
            <path d="M31 26 Q28 30 31 34" fill="#1a1a2e" opacity="0.7"/>
            <path d="M67 26 Q70 30 67 34" fill="#1a1a2e" opacity="0.7"/>
            {/* Eyebrows */}
            <path d="M39 20 Q43 18 47 20" stroke="#2d2d3d" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M51 20 Q55 18 59 20" stroke="#2d2d3d" strokeWidth="1.8" strokeLinecap="round"/>
            {/* Eyes */}
            <ellipse cx="43" cy="25" rx="2.5" ry="3.5" fill="#2d2d3d"/>
            <ellipse cx="55" cy="25" rx="2.5" ry="3.5" fill="#2d2d3d"/>
            <circle cx="43.5" cy="24.5" r="1" fill="white"/>
            <circle cx="55.5" cy="24.5" r="1" fill="white"/>
            {/* Nose */}
            <path d="M48 28 Q49 32 47 34 Q49 34 50 33 Q51 34 50 34 Q48 32 49 28" fill="#E8D5C4"/>
            {/* Smile */}
            <path d="M42 36 Q49 42 56 36" stroke="#2d2d3d" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Arms */}
            <path d="M28 55 Q22 60 20 68" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M20 68 Q18 72 22 74" stroke="white" fill="none"/>
            <path d="M70 55 Q76 60 78 68" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M78 68 Q80 72 76 74" stroke="white" fill="none"/>

            {/* ====== MOM (right) ====== */}
            {/* Body/dress */}
            <path d="M130 48 L122 86 L178 86 L170 48Z" fill="white" stroke="#16A34A" strokeWidth="2.5" strokeLinejoin="round"/>
            {/* Necklace */}
            <path d="M136 52 Q140 56 144 52 Q148 56 152 52 Q156 56 160 52 Q164 56 168 52" fill="none" stroke="#16A34A" strokeWidth="1.5" opacity="0.5"/>
            <circle cx="150" cy="56" r="2" fill="#16A34A" opacity="0.4"/>
            {/* Head */}
            <ellipse cx="152" cy="26" rx="16" ry="18" fill="white" stroke="#16A34A" strokeWidth="2.5"/>
            {/* Hair - long bob style */}
            <path d="M136 22 Q136 6 152 6 Q168 6 168 22" fill="#4a3728" opacity="0.8"/>
            <path d="M136 22 Q134 26 136 34 Q135 32 136 28" fill="#4a3728" opacity="0.7"/>
            <path d="M168 22 Q170 26 168 36 Q169 33 168 28" fill="#4a3728" opacity="0.7"/>
            {/* Hair strands on sides */}
            <path d="M136 34 Q134 42 135 50" fill="#4a3728" opacity="0.5"/>
            <path d="M168 36 Q170 44 169 52" fill="#4a3728" opacity="0.5"/>
            {/* Eyebrows */}
            <path d="M143 19 Q147 17 150 19" stroke="#4a3728" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M154 19 Q157 17 161 19" stroke="#4a3728" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Eyes */}
            <ellipse cx="147" cy="24" rx="2" ry="2.8" fill="#4a3728"/>
            <ellipse cx="158" cy="24" rx="2" ry="2.8" fill="#4a3728"/>
            <circle cx="147.5" cy="23.5" r="0.8" fill="white"/>
            <circle cx="158.5" cy="23.5" r="0.8" fill="white"/>
            {/* Blush */}
            <circle cx="140" cy="27" r="3.5" fill="#F43F5E" opacity="0.1"/>
            <circle cx="165" cy="27" r="3.5" fill="#F43F5E" opacity="0.1"/>
            {/* Nose */}
            <path d="M151 27 Q152 30 151 32" stroke="#E8D5C4" strokeWidth="1" fill="none"/>
            {/* Smile */}
            <path d="M146 34 Q152 40 158 34" stroke="#4a3728" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            {/* Arms */}
            <path d="M130 55 Q124 60 123 68" stroke="white" strokeWidth="5" strokeLinecap="round"/>
            <path d="M170 55 Q176 60 177 68" stroke="white" strokeWidth="5" strokeLinecap="round"/>

            {/* ====== HEART between them ====== */}
            <path d="M96 38 Q96 32 100 32 Q104 32 104 38 Q104 44 100 50 Q96 44 96 38Z" fill="#16A34A" opacity="0.2"/>
            <path d="M96 38 Q96 32 100 32 Q104 32 104 38 Q104 44 100 48 Q96 44 96 38Z" fill="#16A34A" opacity="0.15"/>

            {/* Shared progress chart at bottom */}
            <rect x="72" y="78" width="64" height="36" rx="6" fill="white" stroke="#16A34A" strokeWidth="2"/>
            {/* Chart bars */}
            <rect x="82" y="98" width="6" height="8" rx="1" fill="#16A34A" opacity="0.6"/>
            <rect x="92" y="92" width="6" height="14" rx="1" fill="#16A34A" opacity="0.7"/>
            <rect x="102" y="86" width="6" height="20" rx="1" fill="#16A34A" opacity="0.8"/>
            <rect x="112" y="90" width="6" height="16" rx="1" fill="#16A34A" opacity="0.7"/>
            <rect x="122" y="94" width="6" height="12" rx="1" fill="#16A34A" opacity="0.6"/>
            {/* Trend line */}
            <path d="M85 90 L105 96 L115 94 L125 88" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9"/>
            <circle cx="125" cy="88" r="2.5" fill="#16A34A"/>
          </svg>
        ) : (
          <svg width="120" height="140" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative drop-shadow-lg">
            {/* ====== KID (single avatar, cheerful) ====== */}

            {/* Backpack */}
            <rect x="48" y="58" width="24" height="30" rx="8" fill="white" stroke="#F97316" strokeWidth="2.5"/>
            <rect x="52" y="62" width="16" height="3" rx="1.5" fill="#F97316" opacity="0.3"/>
            <circle cx="57" cy="72" r="3" fill="#F97316" opacity="0.15"/>
            <circle cx="63" cy="72" r="3" fill="#F97316" opacity="0.15"/>
            {/* Backpack straps */}
            <path d="M48 60 Q40 64 40 70" stroke="#F97316" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none"/>
            <path d="M72 60 Q80 64 80 70" stroke="#F97316" strokeWidth="3" strokeLinecap="round" opacity="0.5" fill="none"/>

            {/* Legs */}
            <path d="M48 88 L46 106" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M72 88 L74 106" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M48 88 L46 106" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
            <path d="M72 88 L74 106" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
            {/* Socks/shoes */}
            <rect x="42" y="104" width="8" height="6" rx="2" fill="#F97316" opacity="0.25"/>
            <rect x="70" y="104" width="8" height="6" rx="2" fill="#F97316" opacity="0.25"/>
            <ellipse cx="46" cy="112" rx="6" ry="3" fill="#F97316" opacity="0.3"/>
            <ellipse cx="74" cy="112" rx="6" ry="3" fill="#F97316" opacity="0.3"/>

            {/* Body/t-shirt */}
            <rect x="43" y="64" width="34" height="28" rx="12" fill="white" stroke="#F97316" strokeWidth="2.5"/>
            {/* Star on t-shirt */}
            <path d="M60 73 L61 76 L64 76 L62 78 L63 81 L60 79 L57 81 L58 78 L56 76 L59 76Z" fill="#F97316" opacity="0.3"/>

            {/* Arms */}
            <path d="M43 68 Q34 72 32 82" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M77 68 Q86 72 88 82" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            <path d="M43 68 Q34 72 32 82" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
            <path d="M77 68 Q86 72 88 82" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
            {/* Hands */}
            <circle cx="32" cy="82" r="4" fill="white" stroke="#F97316" strokeWidth="1.5"/>
            <circle cx="88" cy="82" r="4" fill="white" stroke="#F97316" strokeWidth="1.5"/>
            {/* Left hand holding pencil */}
            <rect x="26" y="86" width="4" height="16" rx="2" fill="#F97316" opacity="0.3" transform="rotate(-10 26 86)"/>

            {/* Neck */}
            <path d="M56 64 Q60 60 64 64" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.3"/>

            {/* Head */}
            <ellipse cx="60" cy="36" rx="20" ry="22" fill="white" stroke="#F97316" strokeWidth="2.5"/>

            {/* Ears */}
            <ellipse cx="40" cy="36" rx="4" ry="6" fill="white" stroke="#F97316" strokeWidth="1.8"/>
            <ellipse cx="80" cy="36" rx="4" ry="6" fill="white" stroke="#F97316" strokeWidth="1.8"/>

            {/* Hair - messy fun style */}
            <path d="M40 32 Q38 10 60 8 Q82 10 80 32" fill="#c2410c" opacity="0.75"/>
            <path d="M40 32 Q38 14 55 12 Q62 10 65 12 Q82 14 80 32" fill="#ea580c" opacity="0.6"/>
            {/* Hair spikes/wisps */}
            <path d="M45 15 Q47 10 50 14" fill="#c2410c" opacity="0.5"/>
            <path d="M55 10 Q57 6 60 10" fill="#c2410c" opacity="0.6"/>
            <path d="M65 10 Q67 5 70 11" fill="#c2410c" opacity="0.5"/>
            <path d="M72 16 Q75 11 78 17" fill="#c2410c" opacity="0.4"/>
            {/* Side hair */}
            <path d="M40 34 Q38 40 40 42" fill="#c2410c" opacity="0.5"/>
            <path d="M80 34 Q82 40 80 42" fill="#c2410c" opacity="0.5"/>

            {/* Eyebrows */}
            <path d="M48 26 Q53 23 57 25" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
            <path d="M63 25 Q67 23 72 26" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>

            {/* Eyes - big, happy */}
            <ellipse cx="53" cy="32" rx="3.5" ry="4" fill="#2d1f0d"/>
            <ellipse cx="67" cy="32" rx="3.5" ry="4" fill="#2d1f0d"/>
            <circle cx="54" cy="30.5" r="1.5" fill="white"/>
            <circle cx="68" cy="30.5" r="1.5" fill="white"/>
            <circle cx="52" cy="33" r="0.8" fill="white" opacity="0.4"/>

            {/* Rosy cheeks */}
            <circle cx="44" cy="38" r="4" fill="#F97316" opacity="0.1"/>
            <circle cx="76" cy="38" r="4" fill="#F97316" opacity="0.1"/>

            {/* Nose */}
            <path d="M58 36 Q60 40 60 42" fill="#FDE8C4" stroke="#F97316" strokeWidth="0.8" opacity="0.3"/>

            {/* Big smile showing teeth */}
            <path d="M50 42 Q60 52 70 42" fill="#F97316" opacity="0.15"/>
            <path d="M50 42 Q60 52 70 42" stroke="#2d1f0d" strokeWidth="2" strokeLinecap="round" fill="none"/>
            {/* Teeth */}
            <rect x="55" y="44" width="10" height="5" rx="2" fill="white"/>
            <line x1="60" y1="44" x2="60" y2="49" stroke="#ddd" strokeWidth="0.8"/>
            {/* Tongue */}
            <ellipse cx="60" cy="50" rx="3" ry="2" fill="#F43F5E" opacity="0.5"/>

            {/* Freckles */}
            <circle cx="47" cy="35" r="0.6" fill="#F97316" opacity="0.25"/>
            <circle cx="49" cy="37" r="0.6" fill="#F97316" opacity="0.25"/>
            <circle cx="71" cy="35" r="0.6" fill="#F97316" opacity="0.25"/>
            <circle cx="73" cy="37" r="0.6" fill="#F97316" opacity="0.25"/>

            {/* Floating math sparkles */}
            <g opacity="0.4">
              <text x="20" y="50" fontSize="14" fontWeight="800" fill="#F97316">+</text>
              <text x="94" y="48" fontSize="12" fontWeight="800" fill="#F97316">×</text>
              <text x="18" y="74" fontSize="10" fill="#F97316">⭐</text>
              <text x="96" y="72" fontSize="8" fill="#F97316">📐</text>
            </g>
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
