export default function FAQ() {
  const faqs = [
    {
      q: "À qui s'adresse cette formation ?",
      a: "Cette formation est destinée exclusivement aux professionnels de santé souhaitant acquérir ou renforcer leurs connaissances en vitaminothérapie intraveineuse, notamment sur les fondamentaux, les protocoles pratiques, la sécurité et la gestion des situations d'urgence."
    },
    {
      q: "Quels sont les objectifs de la formation ?",
      a: "La formation a pour objectif de vous permettre de :",
      list: [
        "Comprendre les bases de la vitaminothérapie IV.",
        "Maîtriser les produits les plus utilisés en pratique.",
        "Connaître les protocoles de dilution et d'administration.",
        "Apprendre les associations et mélanges couramment utilisés.",
        "Renforcer la sécurité des perfusions.",
        "Savoir identifier et gérer les incidents et urgences potentielles.",
        "Développer une pratique progressive et sécurisée."
      ]
    },
    {
      q: "Comment accéder à la formation ?",
      a: "Après validation du paiement, vous recevez un accès personnel à la plateforme de formation en ligne.\n\nVotre accès reste actif pendant 14 jours à compter de son activation."
    },
    {
      q: "Comment est organisée la formation ?",
      a: "La formation est divisée en 4 modules principaux :",
      subItems: [
        {
          title: "Module 1 : Fondamentaux de la vitaminothérapie IV",
          items: ["Principes généraux", "Bases physiologiques", "Indications et contre-indications"]
        },
        {
          title: "Module 2 : Protocoles et produits les plus utilisés",
          items: ["Vitamines", "Minéraux", "Antioxydants", "Protocoles de perfusion"]
        },
        {
          title: "Module 3 : Mélanges et applications pratiques",
          items: ["Compatibilités", "Préparation des cocktails", "Dilutions", "Cas pratiques"]
        },
        {
          title: "Module 4 : Sécurité et gestion des urgences",
          items: ["Prévention des incidents", "Surveillance du patient", "Conduite à tenir en cas d'effets indésirables", "Gestion des urgences"]
        }
      ]
    },
    {
      q: "Les cours sont-ils accessibles à tout moment ?",
      a: "Oui. Pendant toute la durée de votre accès, vous pouvez consulter les leçons à votre rythme, 24h/24 et 7j/7."
    },
    {
      q: "Les leçons sont-elles uniquement théoriques ?",
      a: "Non.\n\nChaque leçon comprend un contenu pédagogique structuré ainsi qu'une projection pratique immédiate, permettant au participant de comprendre comment appliquer directement les notions étudiées dans sa pratique professionnelle."
    },
    {
      q: "Y a-t-il des évaluations ?",
      a: "Oui.\n\nChaque leçon est suivie d'un quiz sous forme de QCM permettant de valider immédiatement les connaissances acquises avant de poursuivre le parcours."
    },
    {
      q: "Dois-je réussir les quiz pour terminer la formation ?",
      a: "Oui.\n\nLa validation des quiz fait partie intégrante du parcours pédagogique et permet de s'assurer de l'acquisition des connaissances essentielles enseignées dans chaque module."
    },
    {
      q: "Combien de temps faut-il pour compléter la formation ?",
      a: "La plupart des participants complètent la formation en quelques heures réparties sur plusieurs jours, mais vous disposez de 14 jours complets pour terminer l'ensemble du programme."
    },
    {
      q: "Puis-je revoir les leçons plusieurs fois ?",
      a: "Oui.\n\nPendant toute la durée de votre accès, vous pouvez consulter et revoir les leçons autant de fois que nécessaire."
    },
    {
      q: "Un accompagnement est-il prévu pendant la formation ?",
      a: "Oui.\n\nLa formation comprend un entretien individuel d'une heure avec un médecin collaborateur.\n\nCet échange en direct vous permet de :",
      list: [
        "Poser toutes vos questions concernant les modules étudiés.",
        "Demander des clarifications sur les protocoles.",
        "Discuter de situations pratiques.",
        "Obtenir des conseils d'application.",
        "Échanger sur les aspects de sécurité et de gestion des incidents."
      ],
      extra: "Cet entretien personnalisé constitue une opportunité d'échanger de vive voix avec un professionnel expérimenté afin de consolider vos acquis."
    },
    {
      q: "Quand puis-je bénéficier de cet entretien avec le professionnels de santé ?",
      a: "L'entretien peut être organisé pendant votre période d'accès à la plateforme ou après avoir terminé la formation, selon vos besoins et les disponibilités du médecin collaborateur."
    },
    {
      q: "Que se passe-t-il une fois la formation terminée ?",
      a: "Après avoir :",
      list: [
        "complété l'ensemble des modules ;",
        "validé les quiz associés ;",
        "terminé le parcours pédagogique ;"
      ],
      extra: "une Attestation de Complétude de la Formation Théorique en Perfusion de Vitamines IV sera délivrée."
    },
    {
      q: "Que certifie cette attestation ?",
      a: "Cette attestation certifie que le participant a :",
      list: [
        "suivi l'intégralité de la formation ;",
        "validé les différents modules ;",
        "réussi les évaluations prévues ;",
        "complété le programme théorique de formation en perfusion de vitamines IV."
      ]
    },
    {
      q: "Cette attestation permet-elle d'exercer automatiquement la vitaminothérapie IV ?",
      a: "Cette formation a pour objectif de vous permettre d'acquérir les connaissances théoriques, les protocoles pratiques et les principes de sécurité nécessaires à la mise en place d'une activité de vitaminothérapie au sein de votre cabinet, centre de soins ou dans le cadre d'une prise en charge à domicile, selon votre champ d'exercice professionnel.\n\nL'attestation délivrée à l'issue de la formation certifie la complétude du parcours pédagogique et la validation des évaluations associées. Elle constitue un guide pratique de démarrage destiné à faciliter l'intégration de la vitaminothérapie IV et IM dans votre pratique quotidienne.\n\nDe manière générale, l'administration de vitamines par voie intraveineuse (IV) ou intramusculaire (IM) s'inscrit dans les actes couramment réalisés par les professionnels de santé habilités à pratiquer des injections ou à les réaliser sur prescription médicale. À ce titre, elle relève des mêmes principes généraux de compétence, de sécurité, de traçabilité et de responsabilité professionnelle que les autres traitements injectables courants (antibiotiques, antalgiques, antiémétiques, etc.).\n\nIl appartient toutefois à chaque participant de s'assurer du respect de la réglementation, des recommandations professionnelles et des conditions d'exercice applicables dans son pays, sa région ou sa structure de soins."
    },
    {
      q: "Vais-je apprendre les protocoles de perfusion les plus utilisés ?",
      a: "Oui.\n\nLa formation couvre les protocoles, produits et associations les plus couramment utilisés en pratique, avec leurs indications, modalités d'administration, précautions et conseils de sécurité."
    },
    {
      q: "Vais-je apprendre à gérer les urgences ?",
      a: "Oui.\n\nUn module complet est consacré à la sécurité et à la gestion des situations particulières, notamment :",
      list: [
        "Malaise vagal ;",
        "Réaction anxieuse ;",
        "Intolérance liée à un débit trop rapide ;",
        "Extravasation ;",
        "Réactions d'hypersensibilité ;",
        "Réactions allergiques sévères et conduite à tenir."
      ]
    },
    {
      q: "Un certificat est-il généré automatiquement ?",
      a: "Oui.\n\nAprès validation de l'ensemble des modules et des quiz, votre attestation de complétude est générée automatiquement et mise à votre disposition."
    },
    {
      q: "Puis-je suivre la formation depuis n'importe quel appareil ?",
      a: "Oui.\n\nLa plateforme est accessible depuis un ordinateur, une tablette ou un smartphone disposant d'une connexion Internet."
    },
    {
      q: "Comment obtenir de l'aide si j'ai une question technique ?",
      a: "En cas de difficulté d'accès ou de problème technique, vous pouvez contacter notre équipe d'assistance qui vous accompagnera dans les meilleurs délais."
    },
    {
      q: "Pourquoi suivre cette formation ?",
      a: "Cette formation vous permet :",
      list: [
        " D'acquérir des bases solides en vitaminothérapie IV.",
        " De découvrir les protocoles les plus utilisés.",
        " D'apprendre les bonnes pratiques de préparation et d'administration.",
        " De renforcer la sécurité de vos prises en charge.",
        " De valider vos connaissances grâce aux quiz.",
        " D'échanger directement avec un médecin collaborateur pendant une heure.",
        " D'obtenir une attestation de complétude de formation théorique en perfusion de vitamines IV."
      ]
    }
  ];

  return (
    <div className="min-h-screen px-6 py-12 text-slate-900" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white/90 p-10 shadow-[0_30px_80px_rgba(30,58,95,0.12)] backdrop-blur-sm">
        <section>
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
              FOIRE AUX QUESTIONS (FAQ)
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Retrouvez les réponses aux questions les plus fréquentes concernant la formation.
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="mb-3 text-lg font-bold text-slate-800">
                  {index + 1}. {faq.q}
                </h2>

                {/* Main answer */}
                {faq.a && (
                  <div className="space-y-2 text-slate-600 leading-relaxed">
                    {faq.a.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {/* Simple list */}
                {faq.list && (
                  <ul className="mt-2 ml-5 list-disc space-y-1 text-slate-600">
                    {faq.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}

                {/* Sub-modules (for question 4) */}
                {faq.subItems && (
                  <div className="mt-4 space-y-4">
                    {faq.subItems.map((module, i) => (
                      <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="mb-2 font-semibold text-slate-700">{module.title}</h3>
                        <ul className="ml-5 list-disc space-y-1 text-slate-600">
                          {module.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extra paragraph after list */}
                {faq.extra && (
                  <p className="mt-2 text-slate-600 leading-relaxed">{faq.extra}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
