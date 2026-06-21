import { useNavigate, useParams } from 'react-router-dom'
import KidLayout from '../components/KidLayout'
import { curriculum, getQuizByLessonId } from '../data/curriculum'
import { useAuth } from '../context/AuthContext'

const lessonContent = {
  101: {
    sections: [
      { title: '🔬 Solvant Standard', content: 'Le NaCl 0,9% (sérum salé isotonique) est le solvant standard pour la majorité des perfusions IV de vitamines. Le Glucose 5% est réservé à certains produits spécifiques comme le Bleu de Méthylène.' },
      { title: '📏 Volumes Recommandés', content: '• **100–250 ml** → perfusions courtes\n• **500 ml** → perfusions lentes et confort du patient\nLe volume de 500 ml permet une meilleure dilution et une administration plus progressive.' },
      { title: '⏱️ Durée de Perfusion', content: 'La durée standard est de **30 à 60 minutes**. Certains produits nécessitent des durées plus longues :\n• **NAD+** → jusqu\'à 210 minutes selon la dose\n• Produits irritants → perfusion ralentie' },
      { title: '⚠️ Point Clé', content: 'Le choix du solvant, du volume et du débit dépend du produit, de la dose et du profil du patient. Adapter chaque paramètre au cas par cas.' },
    ],
  },
  102: {
    sections: [
      { title: '🎯 Principe Fondamental — Titration', content: 'La règle la plus importante en perfusion de micronutriments IV est de **raisonner en titration**, pas en « dose standard automatique ». La tolérance individuelle varie selon :\n• Le terrain du patient\n• L\'état d\'hydratation\n• Le statut métabolique\n• Les associations de produits' },
      { title: '🩺 La Première Minute = Test de Tolérance', content: 'Les premières 60 secondes doivent être considérées comme un test de tolérance clinique. Le médecin doit :\n1. Démarrer avec un débit très lent\n2. Observer attentivement le patient\n3. Ne jamais laisser le patient seul durant cette phase' },
      { title: '✋ La Main Proche du Débitmètre', content: 'Règle pratique essentielle : **garder la main proche du débitmètre** pendant toute la perfusion. Au moindre symptôme inhabituel, ralentir immédiatement ou arrêter la perfusion.' },
      { title: '📋 Première Séance — Évaluation', content: 'La première perfusion ne doit jamais être une séance « maximale ». Elle doit servir à évaluer la tolérance individuelle :\n• Doses les plus faibles\n• Nombre limité de produits\n• Vitesse d\'administration prudente\n\n✅ L\'approche progressive améliore la sécurité, le confort du patient et la confiance du praticien.' },
    ],
  },
  201: {
    sections: [
      { title: '💊 Présentation', content: 'La **Vitamine C** (acide ascorbique) est un antioxydant majeur utilisé en perfusion IV pour ses effets sur la fatigue, l\'immunité et l\'éclat de la peau.' },
      { title: '📊 Dosages', content: '• **Dose esthétique** : 2 à 3 g (prévention, éclat de peau)\n• **Dose élevée** : >7 g (nécessite vérification G6PD et fonction rénale)\n• **Dose max** : jusqu\'à 15 g selon tolérance' },
      { title: '🧪 Solvant & Dilution', content: '• NaCl 0,9%\n• Volume : 100, 250 ou 500 ml selon la dose et le débit souhaité\n• Durée : **30 à 45 minutes**' },
      { title: '⚠️ Précautions', content: '• **Avant >7 g** : éliminer un déficit en G6PD (risque d\'hémolyse)\n• Vérifier la fonction rénale\n• **Effet fréquent** : goût métallique en bouche (bénin, transitoire) — prévenir le patient à l\'avance\n• Administration trop rapide : sensation de chaleur + irritation veineuse' },
      { title: '🎯 Indications', content: '✅ Fatigue\n✅ Immunité\n✅ Récupération\n✅ Éclat de peau' },
    ],
  },
  202: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Complexe Vitamines B** apporte un ensemble de vitamines B essentielles au métabolisme énergétique et nerveux.' },
      { title: '📊 Dosage', content: '• **Min** : 1 ampoule\n• **Max** : 2 ampoules\n• Dilution : NaCl 250–500 ml\n• Durée : 30 à 45 minutes' },
      { title: '👃 Particularité — Odeur Forte', content: 'Le complexe de vitamines B a une *odeur très forte et caractéristique* qui peut être extrêmement mal tolérée. Des nausées peuvent apparaître dès l\'ouverture de l\'ampoule.\n\n*Conduite* : ouvrir l\'ampoule loin du patient, préparer discrètement, perfuser lentement.' },
      { title: '⚠️ Effets Secondaires', content: '• **Coloration des urines** (effet bénin lié à la riboflavine B2) — prévenir le patient\n• Nausées possibles chez les sujets sensibles' },
      { title: '🎯 Indications', content: '✅ Fatigue\n✅ Stress\n✅ Neuropathies' },
    ],
  },
  203: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Magnésium** est impliqué dans plus de 300 réactions enzymatiques. Il joue un rôle clé dans la contraction musculaire, la transmission nerveuse et la gestion du stress.' },
      { title: '📊 Dosage & Administration', content: '• **Dose** : 1,5 à 3 g selon besoin\n• **Solvant** : NaCl 250–500 ml\n• **Durée** : 45 à 60 minutes\n• **Règle absolue** : TOUJOURS LENT' },
      { title: '⚠️ Risque Principal', content: 'Le Magnésium est un vasodilatateur. Une administration trop rapide peut provoquer :\n• **Hypotension transitoire**\n• Flushing (bouffée de chaleur)\n• Lourdeur corporelle\n• Oppression\n\n✅ « Toujours lent » est la règle terrain la plus importante du guide.' },
      { title: '🎯 Indications', content: '✅ Stress\n✅ Crampes\n✅ Fatigue\n\nLe Magnésium mal administré (trop vite) est une cause fréquente d\'inconfort en IV therapy.' },
    ],
  },
  204: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Zinc** est un oligo-élément essentiel impliqué dans la synthèse protéique et la production de kératine.' },
      { title: '📊 Dosage', content: '• **Min** : 2 mg\n• **Max** : 10 mg\n• **Obligatoire** : toujours dilué (évite l\'irritation veineuse)\n• Solvant : NaCl 250 ml' },
      { title: '⚠️ Précautions', content: '• **Toujours diluer** pour éviter l\'irritation veineuse\n• Administration trop concentrée → **nausées rapides**\n• Mieux toléré bien dilué dans NaCl 250 ml' },
      { title: '🎯 Indications', content: '✅ Immunité\n✅ Peau\n✅ Cheveux' },
    ],
  },
  205: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Sélénium** est un oligo-élément essentiel, cofacteur de la glutathion peroxydase, une enzyme antioxydante majeure.' },
      { title: '📊 Dosage — Attention à la Toxicité', content: 'Le Sélénium a une **fenêtre thérapeutique étroite** :\n• **Min** : 20 µg\n• **Max** : 100 µg\n• **⚠️ Strict respect des doses** : toxicité dose-dépendante' },
      { title: '😊 Tolérance', content: 'Le Sélénium IV est **généralement très bien toléré**.\nRarement : goût inhabituel ou légère gêne digestive.' },
      { title: '🎯 Indications', content: '✅ Antioxydant\n✅ Immunité' },
    ],
  },
  206: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Glutathion** (GSH) est le principal antioxydant intracellulaire. C\'est un tripeptide (Glu-Cys-Gly) aux propriétés détoxifiantes majeures.' },
      { title: '📊 Administration', content: '• **Règle** : injecter lentement\n• Une administration progressive réduit le risque de nausées et de sensations de chaleur\n• Solvant : NaCl 250 ml' },
      { title: '👅 Effets Secondaires', content: '• **Goût soufré** fréquent (lié à la structure du tripeptide)\n• **Sensation de « vide » ou faiblesse** si admin. trop rapide → ralentir le débit résout le symptôme' },
      { title: '🎯 Indications', content: '✅ Antioxydant\n✅ Détoxification\n✅ Éclat de peau' },
    ],
  },
  207: {
    sections: [
      { title: '💊 Présentation', content: 'La **Vitamine B12** (cobalamine) est essentielle à la formation de la myéline, au métabolisme nerveux et à la production des globules rouges.' },
      { title: '📊 Voies d\'Administration', content: '• **IM** (intramusculaire)\n• **IV lente** : diluée dans NaCl 100 ml, 30 à 45 minutes\n\n⚠️ **Vérifier l\'indication réelle** avant administration. La carence doit être confirmée.' },
      { title: '⚠️ Effets Secondaires', content: '• **Agitation transitoire** ou sensation d\'activation (rare)\n• Effet paradoxal, bénin et transitoire' },
      { title: '🎯 Indications', content: '✅ Carence avérée en B12\n✅ Fatigue\n✅ Manifestations neurologiques (neuropathies, troubles cognitifs liés à une carence)' },
    ],
  },
  208: {
    sections: [
      { title: '💊 Biotine (B7)', content: '• **Voie** : IM uniquement\n• **Dosage** : 5 mg (min) à 10 mg (max)\n• **Tolérance** : très bien tolérée, aucun inconfort spécifique fréquent\n• **Indications** : cheveux, ongles' },
      { title: '💊 Bépanthène (B5)', content: '• Complément vitaminique du groupe B\n• Souvent associé à la Biotine en pratique\n• Bon profil de tolérance' },
      { title: '🎯 Indications Commune', content: '✅ Amélioration de l\'état des cheveux\n✅ Renforcement des ongles\n\nLa Biotine est connue comme « la vitamine de la beauté » pour son rôle dans la synthèse de la kératine.' },
    ],
  },
  209: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Complexe Multivitaminé IV** apporte un large spectre de vitamines pour un soutien nutritionnel global.' },
      { title: '👃 Particularités', content: '• **Odeur marquée** (liée aux vitamines B)\n• **Couleur intense**\n• Ces caractéristiques peuvent provoquer des nausées chez les sujets sensibles ou anxieux.' },
      { title: '📊 Administration', content: '• **Surveillance** : surveiller les réactions pendant la perfusion\n• Être particulièrement attentif chez les patients sensibles aux odeurs ou à tendance anxieuse' },
      { title: '🎯 Indications', content: '✅ Fatigue globale\n✅ Soutien nutritionnel large' },
    ],
  },
  210: {
    sections: [
      { title: '💊 Présentation', content: 'Le **NAD+** (Nicotinamide Adénine Dinucléotide) est une coenzyme centrale du métabolisme énergétique mitochondrial, utilisé pour la fatigue intense, la récupération et la longévité.' },
      { title: '⚠️ RÈGLE ABSOLUE', content: '🔥 **TOUJOURS EN PERFUSION LENTE**\n\nLes effets indésirables sévères sont quasi exclusivement liés à un débit trop rapide :\n• Oppression thoracique\n• Palpitations\n• **Sensation de mort imminente** (surtout chez patients anxieux)\n\n**Conduite** : ralentir drastiquement — le problème est presque toujours le débit.' },
      { title: '📊 Dosage & Administration', content: '• **250 mg** → 60 à 75 minutes\n• **500 mg** → 90 à 120 minutes\n• **Solvant** : NaCl 500 ml (grand volume = dilution + administration lente)' },
      { title: '🎯 Indications', content: '✅ Fatigue intense\n✅ Récupération\n✅ Approche longévité' },
    ],
  },
  211: {
    sections: [
      { title: '💊 Présentation', content: 'L\'**Acide Alpha-Lipoïque (ALA)** est un antioxydant puissant, particulièrement efficace dans les neuropathies diabétiques.' },
      { title: '⚠️ Précaution Glycémie', content: '🔥 **NE JAMAIS PERFUSER À JEUN**\n\nL\'ALA a une action insulino-sensibilisante et peut majorer l\'inconfort chez un patient à glycémie basse.\n• Surveiller la glycémie\n• Particulièrement chez les diabétiques' },
      { title: '📊 Administration', content: '• **Durée** : 30 à 60 minutes\n• **Solvant** : NaCl 250 ml\n• Surveillance glycémie recommandée pendant et après la perfusion' },
      { title: '⚠️ Effets Fréquents', content: '• Sensation de faiblesse\n• Nausées\n• Malaise vague\n• Tremblements\n\nCes effets peuvent être liés à l\'action insulino-sensibilisante de l\'ALA.' },
      { title: '🎯 Indications', content: '✅ Neuropathies (notamment diabétiques)\n✅ Antioxydant puissant' },
    ],
  },
  212: {
    sections: [
      { title: '💊 Présentation', content: 'Le **Bleu de Méthylène** est un accepteur d\'électrons dans la chaîne respiratoire mitochondriale, utilisé pour la fatigue et la cognition.' },
      { title: '🧪 Solvant — Particularité', content: '🔥 **UNIQUE** — Ce produit nécessite un solvant glucosé :\n• **Dextrose 250 ml**\n• (Contrairement aux autres produits qui utilisent NaCl)' },
      { title: '⚠️ Interactions Médicamenteuses', content: '📋 **Vérifier impérativement les interactions avec les ISRS** (antidépresseurs)\n• Le Bleu de Méthylène peut potentialiser le syndrome sérotoninergique\n• → Vérifier le traitement du patient avant administration' },
      { title: '👅 Effets Secondaires', content: '• **Coloration bleue/verte des urines** (fréquent — toujours prévenir le patient)\n• Parfois coloration des muqueuses\n• Bénin, ne pas paniquer' },
      { title: '🎯 Indications', content: '✅ Fatigue\n✅ Cognition' },
    ],
  },
  301: {
    sections: [
      { title: '🧪 Associations Compatibles', content: '✅ **Vit C + B + Mg** — compatible (mélange le plus courant en cabinet)\n✅ **Vit C + Zinc** — compatible\n✅ **B + Mg** — compatible\n\n❌ Éviter les mélanges avec trop de produits dans une même poche (risque d\'instabilité).' },
      { title: '📋 Règle Générale', content: '• **Éviter trop de produits dans une seule poche**\n• La stabilité des mélanges est difficile à garantir\n• **Tester progressivement** les nouvelles combinaisons\n• Préférer des mélanges simples et éprouvés' },
      { title: '🎯 Approche Pratique', content: '1. Commencer par des mélanges validés (Vit C+B+Mg)\n2. Observer la tolérance\n3. Ajouter progressivement de nouveaux produits\n4. Privilégier la sécurité à la complexité' },
    ],
  },
  302: {
    sections: [
      { title: '⏱️ Durées Types par Séance', content: '• **Séance standard** : 30–45 minutes\n• **Magnésium et cocktails** : 45–60 minutes\n• **NAD+** : 90 minutes à 4 heures selon dose\n• **Produits irritants** : adapter en augmentant la durée' },
      { title: '📏 Volume Recommandé pour Débuter', content: '🔥 **Préférer 250 ml au début** pour :\n• Observer la tolérance\n• Évaluer la réaction du patient\n• Puis augmenter progressivement si bien toléré' },
      { title: '🎯 Objectif de l\'Approche Progressive', content: '1. **Mise en place rapide** — des protocoles simples, opérationnels immédiatement\n2. **Sécurité maximale** — réduire les risques d\'incidents\n3. **Protocoles simples et efficaces** — reproductibles, standardisables\n\nLa progressivité est un outil au service de ces trois objectifs.' },
    ],
  },
  401: {
    sections: [
      { title: '🩺 Évaluation Pré-Perfusion', content: 'Avant toute perfusion IV, vérifier :\n✅ Absence de fièvre ou d\'infection aiguë (contre-indication temporaire)\n✅ Patient hydraté\n✅ Patient ayant mangé\n✅ Patient cliniquement stable' },
      { title: '⚠️ Facteurs de Risque d\'Intolérance', content: '• **Déshydratation** → facteur majeur d\'intolérance\n• Patient à jeun\n• Anxiété\n• Produits spécifiques (NAD+, Magnésium)' },
      { title: '📋 Règles Pratiques par Produit', content: '• **ALA** : ne jamais perfuser à jeun + surveiller glycémie\n• **NAD+** : perfusion très lente obligatoire\n• **Mg** : toujours lent (risque d\'hypotension)\n• **Règle universelle** : « Si vous hésitez, ralentissez »' },
      { title: '📊 Statistique Clé', content: 'La **majorité des inconforts** rapportés en IV therapy sont liés à une **vitesse d\'administration trop rapide**, et non à une allergie vraie. Ralentir est la première et meilleure conduite à tenir.' },
    ],
  },
  402: {
    sections: [
      { title: '🚨 1. Malaise Vagal (le plus fréquent)', content: '**Déclencheurs** : anxiété, douleur, jeûne, déshydratation, fatigue, odeurs fortes\n\n**Conduite à tenir** :\n1. Arrêter la perfusion\n2. Décubitus dorsal (jambes surélevées si hypotension)\n3. Vérifier conscience / FC / TA / respiration\n4. Rassurer activement\n5. Réévaluer : si résolution rapide → reprise à débit réduit' },
      { title: '🚨 2. Intolérance au Débit', content: '**Symptômes** : chaleur, nausées, oppression\n\n**Test clinique clé** :\n• Le **ralentissement améliore immédiatement** les symptômes → intolérance au débit\n• Si pas d\'amélioration → penser à une hypersensibilité' },
      { title: '🚨 3. Choc Anaphylactique (exceptionnel mais critique)', content: '**Signes** : hypotension sévère, détresse respiratoire, bronchospasme, œdème laryngé\n\n**CAT** :\n1. Arrêter la perfusion\n2. Appeler les secours (SAMU)\n3. **Adrénaline IM immédiate**\n4. Oxygène\n5. Accès IV' },
      { title: '📋 Fréquence en Cabinet', content: '1. **Malaise vagal** ← le plus fréquent\n2. **Débit trop rapide**\n3. **Anxiété / panique**\n4. **Problème local IV**\n5. **Hypersensibilité**\n6. **Anaphylaxie** ← exceptionnelle mais critique\n\nAvant de conclure à une allergie grave : patient anxieux ? à jeun ? déshydraté ? débit rapide ? Mg ? NAD+ ? La majorité s\'améliore par arrêt, ralentissement, positionnement et réassurance.' },
    ],
  },
}

export default function KidLessonView() {
  const navigate = useNavigate()
  const { id } = useParams()
  const lessonId = Number(id)
  const { profile } = useAuth()

  if (profile?.banned_from_quiz) {
    return (
      <KidLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-extrabold mb-3" style={{ color: '#EF4444' }}>
            Accès aux cours révoqué
          </h1>
          <p className="text-sm text-gray-500 max-w-md mb-2">
            Tu ne peux pas accéder aux cours car tu as consommé ton crédit de tests.
          </p>
          <p className="text-sm font-bold mb-6" style={{ color: '#EF4444' }}>
            Contacte l'administrateur pour débloquer ton accès.
          </p>
          <button
            onClick={() => navigate('/medecin/lessons')}
            className="px-6 py-3 rounded-2xl text-white font-extrabold"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            Retour
          </button>
        </div>
      </KidLayout>
    )
  }

  const modules = curriculum[1] || []
  let lesson = null
  let topic = null
  for (const mod of modules) {
    for (const l of mod.lessons) {
      if (l.id === lessonId) {
        lesson = l
        topic = mod
        break
      }
    }
    if (lesson) break
  }

  if (!lesson) {
    return (
      <KidLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-4xl mb-4">📖</p>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Leçon non trouvée</h2>
          <button
            onClick={() => navigate('/medecin/lessons')}
            className="px-6 py-3 rounded-2xl text-white font-extrabold"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            Retour aux protocoles
          </button>
        </div>
      </KidLayout>
    )
  }

  const content = lessonContent[lessonId]
  const topicColor = topic?.color || '#1E3A5F'
  const topicBg = topic?.bg || '#EFF6FF'

  return (
    <KidLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button
            onClick={() => navigate('/medecin/lessons')}
            className="text-xs font-bold mb-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
            style={{ color: topicColor, backgroundColor: topicBg }}
          >
            ← Retour aux protocoles
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">{lesson.title}</h1>
          <p className="text-xs text-gray-400 font-semibold mt-1">
            {topic?.icon} {topic?.name} · {lesson.questions} questions
          </p>
        </div>
      </div>

      {/* Lesson content */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-5">
          {content?.sections?.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 p-5 sm:p-6 shadow-sm"
              style={{ borderColor: topic?.border || '#93C5FD' }}
            >
              <h2 className="text-lg font-extrabold text-gray-800 mb-3">{section.title}</h2>
              <div className="text-sm leading-relaxed text-gray-600 whitespace-pre-line font-medium">
                {section.content}
              </div>
            </div>
          ))}

          {!content && (
            <div className="bg-white rounded-2xl border-2 p-8 text-center shadow-sm" style={{ borderColor: '#93C5FD' }}>
              <p className="text-gray-400 font-semibold">Contenu de la leçon à venir...</p>
            </div>
          )}

          {/* Start Quiz Button */}
          <div className="flex justify-center pt-4 pb-6">
            <button
              onClick={() => navigate(`/medecin/quiz/${lesson.id}`)}
              className="px-10 py-4 rounded-2xl text-white font-extrabold text-lg transition-all duration-150 inline-flex items-center gap-3"
              style={{ backgroundColor: topicColor, boxShadow: `0 4px 14px ${topicColor}66` }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.85)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}
            >
              📝 Passer le QCM · {lesson.questions} questions
              <span className="text-xl">→</span>
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <div
          className="hidden lg:block w-64 shrink-0 bg-white rounded-2xl border-2 p-5 self-start sticky top-24 shadow-sm"
          style={{ borderColor: topic?.border || '#93C5FD' }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-4">
            Informations
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Module</p>
              <p className="text-sm font-bold text-gray-800">{topic?.name}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Leçon</p>
              <p className="text-sm font-bold text-gray-800">{lesson.title}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Questions</p>
              <p className="text-sm font-bold text-gray-800">{lesson.questions} QCM</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Temps estimé</p>
              <p className="text-sm font-bold text-gray-800">~{lesson.time} min</p>
            </div>
          </div>
      
        </div>
      </div>
    </KidLayout>
  )
}
