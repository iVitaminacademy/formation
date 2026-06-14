import { useNavigate } from 'react-router-dom'

const trustItems = [
  { icon: '💉', label: ' Plusieurs protocoles de perfusion IV',  color: '#1E3A5F' },
  { icon: '📋', label: '4 modules de formation',         color: '#1D4ED8' },
  { icon: '🛡️', label: 'Sécurité & gestion des urgences', color: '#065F46' },
  { icon: '🎓', label: 'Certificat de  qualification',     color: '#991B1B' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 25%, #EFF6FF 50%, #F8FAFC 75%, #FFFFFF 100%)' }}>
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#1E3A5F]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#1D4ED8]/08 blur-3xl" />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6">

        {/* Header */}
        <header className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              💉
            </div>
            <div className="leading-tight">
              <div className="text-xl font-extrabold tracking-tight" style={{ color: '#1E3A5F' }}>
                iVitaminacademy
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
                Guide pratique POUR professionnels de santé
              </div>
            </div>
          </div>

          <nav className="hidden gap-8 md:flex">
            <a href="/faq" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">FAQ</a>
            <a href="/privacy" className="text-sm font-semibold text-slate-600 transition hover:text-slate-900">Conditions</a>
          </nav>

          <button
            onClick={() => navigate('/login')}
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            Connexion
          </button>
        </header>

        {/* Main */}
        <main className="flex flex-1 flex-col items-center pb-14 pt-10">

          {/* Hero */}
          <section className="flex flex-col items-center text-center">
            {/* Important badge */}
         

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
              Injection de{' '}
              <span style={{ color: '#1E3A5F' }}>vitamines </span>
              <br />
              <span style={{ color: '#1D4ED8' }}>Guide pratique pour professionnels de santé</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-base font-medium leading-7 text-slate-500">
             Accédez aux protocoles de pratique, formez-vous aux produits les plus demandés et les plus utilisés,
              validez vos connaissances et obtenez un certificat de qualification.
            </p>
          </section>

          {/* Mode card — Médecin uniquement */}
          <section className="mt-12 w-full max-w-md">
            <div
              className="group flex cursor-pointer flex-col overflow-hidden rounded-[28px] border border-transparent bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)]"
              onClick={() => navigate('/medecin/dashboard')}
            >
              {/* Top illustration */}
              <div
                className="relative flex items-center justify-center overflow-hidden"
                style={{ height: 200, background: 'linear-gradient(135deg, #EFF6FF 0%, #93C5FD 50%, #2563EB 100%)' }}
              >
                <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/15" />
                <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-white/10" />
                <div className="absolute top-4 right-12 h-10 w-10 rounded-full bg-white/15" />
                <div className="relative drop-shadow-lg">
                  <span role="img" style={{ fontSize: 80, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))' }}>
                    👨‍⚕️
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <div
                  className="mb-3 inline-flex self-start rounded-lg px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide"
                  style={{ backgroundColor: '#DBEAFE', color: '#1E3A5F' }}
                >
                  Espace  professionnels de santé
                </div>
                <h2 className="text-[22px] font-extrabold leading-tight text-gray-900">Je me forme aux protocoles </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Apprenez les protocoles d'injection  de vitamines  et validez vos connaissances module par module.
                </p>

                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <li className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                    <span className="mt-0.5 shrink-0 text-sm" style={{ color: '#1E3A5F' }}>✓</span>
                    <span>4 modules + 19 leçons de protocoles</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                    <span className="mt-0.5 shrink-0 text-sm" style={{ color: '#1E3A5F' }}>✓</span>
                    <span>QCM de validation par leçon</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs font-semibold text-slate-500">
                    <span className="mt-0.5 shrink-0 text-sm" style={{ color: '#1E3A5F' }}>✓</span>
                    <span>Certificat de qualification obtenu à la fin</span>
                  </li>
                </ul>

                <div className="mt-auto pt-5">
                  <button
                    className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(0,0,0,0.15)] transition-all duration-200 active:scale-[0.98]"
                    style={{ backgroundColor: '#1E3A5F' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#162C48'
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.20)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '#1E3A5F'
                      e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'
                    }}
                  >
                    Accéder à ma formation →
                  </button>
                </div>
              </div>
            </div>
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

          {/* ── About Section ── */}
          <section className="mt-16 w-full max-w-3xl">
            <div className="rounded-3xl border-2 p-6 sm:p-8 shadow-sm" style={{ backgroundColor: '#fff', borderColor: '#BFDBFE' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: '#EFF6FF' }}>💡</div>
                <h2 className="text-xl font-extrabold text-gray-900">Qu'est-ce qu'iVitaminacademy ?</h2>
              </div>
              
              <div className="space-y-4 text-sm leading-relaxed text-slate-600 font-medium">
                <p>
                  <strong>iVitaminacademy</strong> est une plateforme de formation en ligne destinée aux professionnels de santé souhaitant maîtriser les protocoles d'injections de vitamines.
                </p>
                <p>
                  La formation couvre les produits les plus utilisés et les plus demandés en pratique clinique, organisés en 4 modules : des fondamentaux de l'injection jusqu'à la gestion des urgences et des complications.
                </p>
                <p>
                 Chaque module comprend un contenu pédagogique associé à une mise en pratique des notions abordées. À l'issue de chaque leçon, un quiz sous forme de QCM permet de valider immédiatement les connaissances acquises.
                </p>
                <p>
                 À la fin du parcours, une attestation de formation en injections de vitamines  sera délivrée au participant. Cette attestation certifie que l'ensemble des modules et évaluations du programme a été suivi et validé
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '📖', label: 'Lire la leçon', sub: 'Contenu structuré' },
                  { icon: '📝', label: 'Passer le QCM', sub: 'Valider ses acquis' },
                  { icon: '📊', label: 'Suivre sa progression', sub: 'Tableau de bord' },
                  { icon: '🎓', label: 'Obtenir le certificat', sub: 'Validation finale' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center rounded-2xl p-3 text-center" style={{ backgroundColor: '#F8FAFC' }}>
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-xs font-extrabold text-gray-700">{item.label}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Medical Disclaimer ── */}
          <section className="mt-10 w-full max-w-3xl">
            <div className="rounded-3xl p-6 sm:p-8 border-2 shadow-sm" style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0 mt-0.5">⚖️</span>
                <div>
                  <h3 className="text-base font-extrabold text-gray-800 mb-2">Avertissement médical</h3>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed mb-4">
                   Ce  guide  pratique est  basé sur l'usage courant.
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mb-2">Les posologies doivent toujours être adaptées :</p>
                  <ul className="space-y-1.5 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>au patient</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>au contexte clinique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>aux antécédents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>aux bilans biologiques</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center text-base" style={{ backgroundColor: '#1E3A5F' }}>💉</div>
              <span className="text-sm font-extrabold" style={{ color: '#1E3A5F' }}>iVitaminacademy</span>
            </div>
            <p className="text-xs font-semibold text-slate-400 max-w-md mx-auto leading-relaxed">
              Guide pratique d’injections de vitamines — Formation destinée aux professionnels de santé. 
            </p>
            <p className="text-[10px] text-slate-300">
              © 2026 iVitaminacademy. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
