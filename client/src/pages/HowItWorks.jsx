export default function HowItWorks() {
  return (
    <div className="min-h-screen px-6 py-12 text-slate-900" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(30,58,95,0.12)] backdrop-blur-sm">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em]" style={{ color: '#1E3A5F' }}>
            Comment ça marche
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
            💉 Ivitaminacademy — Guide de démarrage
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Une plateforme de formation certifiante pour les médecins pratiquant les perfusions de vitamines IV. Suivez les 4 modules, validez vos connaissances par QCM, et obtenez votre certificat de formation.
          </p>
        </div>

        <section className="space-y-8">

          {/* Choosing your mode */}
          <div className="space-y-3 rounded-3xl border p-6 shadow-sm" style={{ borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' }}>
            <h2 className="text-2xl font-bold text-slate-950">Choisir votre rôle</h2>
            <p className="text-base leading-7 text-slate-700">
              Ivitaminacademy propose deux modes complémentaires. Le <strong>Mode Médecin</strong> permet un apprentissage autonome à travers les protocoles et QCM. Le <strong>Mode Superviseur</strong> permet de suivre la progression d'un ou plusieurs médecins en formation et de consulter leurs résultats en détail.
            </p>
          </div>

          {/* Mode Médecin */}
          <div className="space-y-3 rounded-3xl border p-6 shadow-sm" style={{ borderColor: '#6EE7B7', backgroundColor: '#ECFDF5' }}>
            <h2 className="text-2xl font-bold text-slate-950">Mode Médecin — Se former et se certifier</h2>
            <p className="text-base leading-7 text-slate-700">
              Inscription → Connexion → Parcourir les modules → Valider les QCM → Obtenir le certificat
            </p>
            <ul className="ml-5 list-disc mt-3 text-base leading-7 text-slate-700 space-y-1">
              <li>4 modules couvrant l'ensemble des protocoles IV : indications, posologies, techniques et sécurité.</li>
              <li>19 leçons progressives avec indices et explications détaillées.</li>
              <li>75 questions QCM pour valider chaque module.</li>
              <li>Suivi de progression par module avec badges de réussite.</li>
              <li>Certificat PDF imprimable dès que les 4 modules sont complétés.</li>
            </ul>
          </div>

          {/* Mode Superviseur */}
          <div className="space-y-3 rounded-3xl border p-6 shadow-sm" style={{ borderColor: '#93C5FD', backgroundColor: '#DBEAFE' }}>
            <h2 className="text-2xl font-bold text-slate-950">Mode Superviseur — Suivre et accompagner</h2>
            <p className="text-base leading-7 text-slate-700">
              Inscription → Connexion → Lier un médecin → Consulter les rapports → Guider la formation
            </p>
            <ul className="ml-5 list-disc mt-3 text-base leading-7 text-slate-700 space-y-1">
              <li>Tableau de bord synthétique par médecin suivi.</li>
              <li>Consultation des corrigés QCM et des scores par leçon.</li>
              <li>Rapports détaillés : progression globale, modules à renforcer, activité récente.</li>
              <li>Notifications en temps réel à chaque leçon complétée.</li>
            </ul>
            <p className="mt-3 text-base leading-7 text-slate-700">
              Chaque médecin dispose d'un <strong>code superviseur</strong> unique à communiquer pour être suivi.
            </p>
          </div>

          {/* 4 modules */}
          <div className="space-y-3 rounded-3xl border p-6 shadow-sm" style={{ borderColor: '#BFDBFE', backgroundColor: '#F8FBFF' }}>
            <h2 className="text-2xl font-bold text-slate-950">Les 4 modules de formation</h2>
            <div className="grid gap-4 sm:grid-cols-2 mt-2">
              {[
                { num: 1, title: 'Fondamentaux & Indications', color: '#1E3A5F', bg: '#EFF6FF', border: '#93C5FD', desc: 'Bases des perfusions IV, indications cliniques, contre-indications et sélection du patient.' },
                { num: 2, title: 'Protocoles & Posologies', color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD', desc: 'Dosages précis par nutriment, formules de dilution, débits de perfusion et durées.' },
                { num: 3, title: 'Techniques & Matériel', color: '#065F46', bg: '#ECFDF5', border: '#6EE7B7', desc: 'Pose de voie veineuse, cathéters, surveillance du site, gestion des abords veineux.' },
                { num: 4, title: 'Sécurité & Complications', color: '#991B1B', bg: '#FEF2F2', border: '#FCA5A5', desc: 'Réactions adverses, extravasation, surcharge volumique, protocoles d\'urgence.' },
              ].map(m => (
                <div key={m.num} className="rounded-2xl border p-4" style={{ borderColor: m.border, backgroundColor: m.bg }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: m.color }}>Module {m.num}</span>
                  </div>
                  <p className="font-bold text-slate-900 mb-1">{m.title}</p>
                  <p className="text-sm leading-6 text-slate-600">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Steps */}
          <div className="space-y-3 rounded-3xl border p-6 shadow-sm" style={{ borderColor: '#FEF3C7', backgroundColor: '#FFFBEB' }}>
            <h2 className="text-2xl font-bold text-slate-950">Étapes rapides</h2>
            <p className="text-base leading-7 text-slate-700">
              <strong>Médecin :</strong> Inscription → Connexion → Parcourir les 4 modules → Valider les QCM → Télécharger le certificat.<br />
              <strong>Superviseur :</strong> Inscription → Connexion → Lier un médecin par code → Suivre les rapports.
            </p>
            <p className="text-sm leading-6 text-amber-800 mt-2">
              ⚠️ Cette formation ne se substitue pas à une formation médicale initiale. Les posologies sont indicatives et doivent être adaptées au contexte clinique de chaque patient.
            </p>
          </div>

        </section>
      </div>
    </div>
  )
}
