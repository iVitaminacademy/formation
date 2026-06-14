const SUPPORT_EMAIL = 'supportfrazzlkiddos@frazzlkid.com'
const WEBSITE = 'frazzl.kid.com'

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="text-base leading-7 text-slate-700">{children}</div>
    </div>
  )
}

export default function PrivacyTerms() {
  return (
    <div className="min-h-screen bg-[#F6F1FF] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(34,25,82,0.12)] backdrop-blur-sm">
        <section>
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
              Conditions Générales de Formation
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Merci de lire attentivement les conditions ci-dessous avant de vous inscrire.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {/* 1 */}
            <Section title="1. Objet de la formation">
              <p>
                La présente formation a pour objectif de fournir aux professionnels de santé des connaissances théoriques et pratiques concernant la vitaminothérapie par voie intraveineuse (IV) et intramusculaire (IM), notamment les protocoles couramment utilisés, les précautions d'emploi, les règles de sécurité et la gestion des situations particulières.
              </p>
            </Section>

            {/* 2 */}
            <Section title="2. Public concerné">
              <p>Cette formation est réservée aux :</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Médecins ;</li>
                <li>Infirmiers(ères) ;</li>
                <li>Pharmaciens ;</li>
                <li>Sages-femmes ;</li>
                <li>Professionnels de santé autorisés à réaliser ou participer à des actes injectables selon la réglementation applicable dans leur pays d'exercice.</li>
              </ul>
              <p className="mt-2">L'organisme de formation se réserve le droit de demander un justificatif de qualification professionnelle.</p>
            </Section>

            {/* 3 */}
            <Section title="3. Nature de la formation">
              <p>
                La formation constitue un programme pédagogique de perfectionnement professionnel.
              </p>
              <p>
                Elle ne constitue pas un diplôme universitaire, un diplôme d'État, une spécialisation reconnue par une autorité publique ou un titre professionnel réglementé.
              </p>
            </Section>

            {/* 4 */}
            <Section title="4. Accès à la plateforme">
              <p>
                L'accès à la plateforme est accordé pour une durée de 14 jours à compter de l'activation du compte.
              </p>
              <p>
                Les identifiants sont personnels et ne peuvent être partagés ou cédés à un tiers.
              </p>
            </Section>

            {/* 5 */}
            <Section title="5. Évaluations">
              <p>
                Chaque module comporte une ou plusieurs évaluations sous forme de questionnaires à choix multiples (QCM).
              </p>
              <p>
                Le participant doit compléter l'ensemble des modules et des évaluations pour obtenir son attestation de complétude.
              </p>
            </Section>

            {/* 6 */}
            <Section title="6. Attestation de complétude">
              <p>
                Une attestation de complétude est délivrée après validation de l'ensemble du parcours pédagogique.
              </p>
              <p>Cette attestation certifie uniquement :</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>la participation à la formation ;</li>
                <li>la validation des modules ;</li>
                <li>la réussite des évaluations prévues.</li>
              </ul>
              <p className="mt-2">Elle ne constitue pas une autorisation administrative ou réglementaire d'exercice.</p>
            </Section>

            {/* 7 */}
            <Section title="7. Responsabilité professionnelle">
              <p>
                Chaque participant demeure seul responsable des actes réalisés dans le cadre de son activité professionnelle.
              </p>
              <p>
                Les décisions médicales, les prescriptions, les indications thérapeutiques, la sélection des patients, l'administration des traitements et la surveillance clinique relèvent exclusivement de la responsabilité du professionnel de santé traitant.
              </p>
            </Section>

            {/* 8 */}
            <Section title="8. Adaptation au patient">
              <p>
                Les protocoles présentés dans la formation sont fournis à titre pédagogique.
              </p>
              <p>Toute prise en charge doit être adaptée :</p>
              <ul className="ml-6 list-disc space-y-1">
                <li>au contexte clinique ;</li>
                <li>aux antécédents du patient ;</li>
                <li>aux traitements en cours ;</li>
                <li>aux examens biologiques disponibles ;</li>
                <li>aux recommandations professionnelles en vigueur.</li>
              </ul>
            </Section>

            {/* 9 */}
            <Section title="9. Respect de la réglementation">
              <p>
                Chaque participant est tenu de vérifier et de respecter les dispositions légales, réglementaires et déontologiques applicables dans son pays, sa région et sa structure d'exercice.
              </p>
            </Section>

            {/* 10 */}
            <Section title="10. Propriété intellectuelle">
              <p>
                L'ensemble des contenus de la plateforme (textes, vidéos, documents, protocoles, illustrations, quiz et supports pédagogiques) est protégé par le droit d'auteur.
              </p>
              <p>
                Toute reproduction, diffusion, partage, revente ou utilisation commerciale sans autorisation écrite préalable est interdite.
              </p>
            </Section>

            {/* 11 */}
            <Section title="11. Accompagnement pédagogique">
              <p>
                La formation comprend un entretien individuel d'une heure avec un médecin collaborateur.
              </p>
              <p>
                Cet échange a pour objectif d'apporter des éclaircissements pédagogiques sur le contenu de la formation et ne constitue pas une consultation médicale, un avis spécialisé ou une supervision clinique personnalisée.
              </p>
            </Section>

            {/* 12 */}
            <Section title="12. Remboursement">
              <p>
                Compte tenu de l'accès immédiat aux contenus numériques, aucun remboursement ne pourra être accordé après activation des accès à la plateforme, sauf disposition légale contraire applicable.
              </p>
            </Section>

            {/* 13 */}
            <Section title="13. Limitation de responsabilité">
              <p>
                L'organisme de formation ne pourra être tenu responsable des conséquences résultant d'une utilisation inappropriée, incomplète ou non conforme des informations fournies dans le cadre de la formation.
              </p>
            </Section>

            {/* 14 */}
            <Section title="14. Acceptation des conditions">
              <p>
                L'inscription à la formation implique l'acceptation pleine et entière des présentes conditions générales.
              </p>
            </Section>
          </div>
        </section>
      </div>
    </div>
  )
}
