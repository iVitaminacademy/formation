// Ivitaminacademy — Contenu pédagogique
// Source : Booklet de Mise en Route — Perfusions de vitamines IV
// Structure : curriculum[1] = array de 4 modules (topics), chacun avec ses leçons et QCM

export const curriculum = {
  1: [
    // ─────────────────────────────────────────────
    // MODULE 1 — FONDAMENTAUX
    // ─────────────────────────────────────────────
    {
      id: 1,
      name: 'Fondamentaux',
      icon: '📋',
      color: '#1E3A5F',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      lessons: [
        {
          id: 101,
          title: 'Règles Générales de Perfusion',
          questions: 5,
          time: 6,
          status: 'start',
          quiz: [
            {
              text: 'Quel solvant de dilution est considéré comme standard pour la majorité des perfusions IV de vitamines ?',
              options: ['NaCl 0,9%', 'Glucose 5%', 'Eau distillée', 'Ringer lactate'],
              correct: 'NaCl 0,9%',
              hint: 'C\'est la solution saline isotonique la plus couramment utilisée.',
              explanation: 'Le sérum salé NaCl 0,9% est le solvant standard. Le Glucose 5% est réservé à certains produits spécifiques comme le Bleu de Méthylène.',
            },
            {
              text: 'Quel volume est recommandé pour une perfusion courte ?',
              options: ['100 ou 250 ml', '500 ml', '1000 ml', '50 ml'],
              correct: '100 ou 250 ml',
              hint: 'Un volume plus faible = perfusion plus rapide.',
              explanation: 'Les volumes de 100 à 250 ml sont adaptés aux perfusions courtes. Le volume de 500 ml est préféré pour les perfusions lentes et le confort du patient.',
            },
            {
              text: 'Quelle est la durée moyenne d\'une perfusion IV de vitamines ?',
              options: ['30 à 60 minutes', '5 à 10 minutes', '2 à 4 heures', '10 à 20 minutes'],
              correct: '30 à 60 minutes',
              hint: 'Cette durée peut s\'allonger selon le caractère irritant du produit.',
              explanation: 'La durée standard est de 30 à 60 minutes. Elle peut être plus longue pour certains produits irritants ou pour des produits spéciaux comme le NAD+.',
            },
            {
              text: 'Quel produit peut nécessiter une perfusion allant jusqu\'à 210 minutes ?',
              options: ['NAD+', 'Vitamine C', 'Magnésium', 'Glutathion'],
              correct: 'NAD+',
              hint: 'C\'est un produit impliqué dans le métabolisme énergétique mitochondrial.',
              explanation: 'Le NAD+ est le produit nécessitant la durée de perfusion la plus longue, pouvant aller jusqu\'à 210 minutes selon la dose. Un débit trop rapide provoque des effets indésirables importants.',
            },
            {
              text: 'Dans quel cas préfère-t-on un volume de 500 ml ?',
              options: ['Perfusion lente et confort patient', 'Perfusion rapide d\'urgence', 'Petite dose de vitamine', 'Produit peu irritant uniquement'],
              correct: 'Perfusion lente et confort patient',
              hint: 'Plus le volume est grand, plus la perfusion est diluée et prolongée.',
              explanation: 'Le volume de 500 ml est indiqué pour les perfusions lentes afin d\'améliorer le confort du patient et d\'assurer une administration progressive des produits.',
            },
          ],
        },
        {
          id: 102,
          title: 'Philosophie de Sécurité — Titration',
          questions: 6,
          time: 7,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la philosophie fondamentale en perfusion de micronutriments IV ?',
              options: ['Raisonner en titration', 'Appliquer la dose standard maximale d\'emblée', 'Débuter à forte dose puis réduire', 'Standardiser uniquement selon le poids'],
              correct: 'Raisonner en titration',
              hint: 'Chaque patient réagit différemment à la même dose.',
              explanation: 'La règle la plus importante est de raisonner en titration, pas en "dose standard automatique". La tolérance individuelle varie selon le terrain, l\'hydratation, l\'état métabolique et les associations utilisées.',
            },
            {
              text: 'Comment doit être considérée la première minute de perfusion ?',
              options: ['Comme un test de tolérance clinique', 'Comme une phase d\'accélération progressive', 'Sans surveillance particulière', 'Comme une dose de charge efficace'],
              correct: 'Comme un test de tolérance clinique',
              hint: 'La mise en route ne doit jamais être brutale.',
              explanation: 'La première minute de perfusion doit être considérée comme un véritable test de tolérance clinique. Le médecin doit démarrer avec un débit très lent tout en observant attentivement le patient.',
            },
            {
              text: 'Quelle règle pratique s\'applique au médecin lors du démarrage d\'une perfusion ?',
              options: ['La main proche du débitmètre', 'Laisser le patient seul', 'Démarrer à débit maximal', 'Utiliser un minuteur automatique'],
              correct: 'La main proche du débitmètre',
              hint: 'Au moindre symptôme inhabituel, il faut pouvoir agir immédiatement.',
              explanation: '"La main proche du débitmètre" est la règle pratique essentielle : au moindre symptôme inhabituel, on ralentit immédiatement ou on arrête la perfusion.',
            },
            {
              text: 'Comment doit être pensée la première séance de perfusion IV ?',
              options: ['Comme une séance d\'évaluation de tolérance individuelle', 'Comme une séance maximale pour effet rapide', 'Comme une perfusion de diagnostic uniquement', 'Comme une séance de routine standard'],
              correct: 'Comme une séance d\'évaluation de tolérance individuelle',
              hint: 'La première perfusion ne doit jamais être une séance "maximale".',
              explanation: 'La première perfusion doit être une séance d\'évaluation de tolérance individuelle : doses les plus faibles, nombre limité de produits, vitesse d\'administration prudente.',
            },
            {
              text: 'Parmi les signes suivants, lequel doit alerter le médecin pendant la phase initiale ?',
              options: ['Oppression thoracique', 'Légère sensation de détente', 'Légère somnolence', 'Augmentation de la diurèse'],
              correct: 'Oppression thoracique',
              hint: 'Les signes d\'intolérance peuvent être subtils en début de perfusion.',
              explanation: 'L\'oppression thoracique fait partie des signes d\'alerte à surveiller : sensation de chaleur, nausées, malaise, anxiété brutale, vertiges, palpitations, douleur au point d\'injection.',
            },
            {
              text: 'Qu\'améliore l\'approche progressive en IV therapy ?',
              options: ['La sécurité, le confort patient et la confiance du praticien', 'Uniquement la vitesse d\'action du produit', 'Seulement le coût de la séance', 'La durée de conservation des produits'],
              correct: 'La sécurité, le confort patient et la confiance du praticien',
              hint: 'L\'approche progressive a plusieurs bénéfices simultanés.',
              explanation: 'L\'approche progressive améliore la sécurité, le confort patient, la confiance du praticien et la qualité globale de la prise en charge. En IV therapy, la vitesse est aussi importante que le choix du produit.',
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // MODULE 2 — PROTOCOLES
    // ─────────────────────────────────────────────
    {
      id: 2,
      name: 'Protocoles',
      icon: '💉',
      color: '#1D4ED8',
      bg: '#EFF6FF',
      border: '#93C5FD',
      lessons: [
        {
          id: 201,
          title: 'Vitamine C',
          questions: 6,
          time: 7,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la dose maximale couramment utilisée en cabinet IV pour indication esthétique (éclat de peau) ?',
              options: ['2 à 3 g', '500 mg', '10 g', '5 g'],
              correct: '2 à 3 g',
              hint: 'Pour indication préventive ou esthétique, la dose reste modérée.',
              explanation: 'En pratique courante IV cabinet, la dose max pour indication esthétique est de 2 à 3 g. Des doses plus élevées (>7g) nécessitent de vérifier le G6PD.',
            },
            {
              text: 'Quel solvant est recommandé pour la dilution de la Vitamine C IV ?',
              options: ['NaCl 0,9% (100, 250 ou 500 ml)', 'Dextrose 5% uniquement', 'Ringer lactate', 'NaCl 50 ml uniquement'],
              correct: 'NaCl 0,9% (100, 250 ou 500 ml)',
              hint: 'Le solvant standard est utilisé pour la Vitamine C.',
              explanation: 'La Vitamine C se dilue dans NaCl 0,9% en volume de 100, 250 ou 500 ml selon la dose et le débit souhaité.',
            },
            {
              text: 'Quelle précaution est indispensable avant d\'administrer des doses élevées (>7g) de Vitamine C ?',
              options: ['Éliminer un déficit G6PD', 'Vérifier la glycémie à jeun', 'Faire un ECG systématique', 'Mesurer la température corporelle'],
              correct: 'Éliminer un déficit G6PD',
              hint: 'Ce déficit enzymatique contre-indique les fortes doses de Vitamine C.',
              explanation: 'Le déficit en G6PD est une contre-indication aux fortes doses de Vitamine C IV car il peut provoquer une hémolyse. La fonction rénale doit également être vérifiée.',
            },
            {
              text: 'Parmi ces indications, laquelle ne correspond PAS à la Vitamine C IV ?',
              options: ['Traitement d\'une infection bactérienne', 'Fatigue', 'Immunité', 'Éclat de peau'],
              correct: 'Traitement d\'une infection bactérienne',
              hint: 'Les indications sont orientées prévention, bien-être et esthétique.',
              explanation: 'Les indications reconnues sont : fatigue, immunité, récupération et éclat de peau. Le traitement d\'une infection bactérienne n\'est pas une indication courante en cabinet IV.',
            },
            {
              text: 'Quelle est la durée recommandée pour une perfusion de Vitamine C ?',
              options: ['30 à 45 minutes', '5 à 10 minutes', '2 heures minimum', '90 à 120 minutes'],
              correct: '30 à 45 minutes',
              hint: 'C\'est une durée standard, dans la fourchette habituelle.',
              explanation: 'La Vitamine C s\'administre en 30 à 45 minutes. Une administration trop rapide peut provoquer une sensation de chaleur et une irritation veineuse.',
            },
            {
              text: 'Quel effet fréquent doit être anticipé et expliqué au patient avant la perfusion de Vitamine C ?',
              options: ['Goût métallique en bouche', 'Coloration bleue des urines', 'Odeur forte caractéristique', 'Flushing sévère persistant'],
              correct: 'Goût métallique en bouche',
              hint: 'Prévenir le patient à l\'avance évite une interprétation anxieuse.',
              explanation: 'Le goût métallique est fréquent, bénin et transitoire avec la Vitamine C IV. Prévenir le patient évite une réaction anxieuse inutile.',
            },
          ],
        },
        {
          id: 202,
          title: 'Complexe Vitamines B (Becozyme)',
          questions: 5,
          time: 6,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle particularité du Complexe Vitamines B peut être très mal tolérée chez certains patients ?',
              options: ['Son odeur très forte et caractéristique', 'Sa couleur rouge vive', 'Son goût sucré intense', 'Sa viscosité élevée'],
              correct: 'Son odeur très forte et caractéristique',
              hint: 'Ce symptôme peut même apparaître avant l\'administration.',
              explanation: 'L\'odeur très forte du Becozyme peut être extrêmement mal tolérée. Des symptômes (nausées, haut-le-cœur) peuvent même apparaître à l\'ouverture de l\'ampoule.',
            },
            {
              text: 'Quelles sont les indications principales du Complexe Vitamines B IV ?',
              options: ['Fatigue, stress, neuropathies', 'Éclat de peau, antioxydant, longévité', 'Crampes, hypotension, anxiété', 'Infections, fièvre, douleurs'],
              correct: 'Fatigue, stress, neuropathies',
              hint: 'Les vitamines B sont essentielles au métabolisme nerveux.',
              explanation: 'Le Complexe Vitamines B est indiqué pour la fatigue, le stress et les neuropathies, en lien avec le rôle des vitamines B dans le métabolisme énergétique et nerveux.',
            },
            {
              text: 'Comment préparer le Complexe Vitamines B chez un patient sensible aux odeurs ?',
              options: ['Ouvrir l\'ampoule loin du patient et préparer discrètement', 'Mélanger avec un désodorisant', 'Chauffer l\'ampoule avant ouverture', 'Utiliser un masque pour le patient'],
              correct: 'Ouvrir l\'ampoule loin du patient et préparer discrètement',
              hint: 'La gestion de l\'environnement est clé chez les patients sensibles.',
              explanation: 'Chez les patients sensibles, il faut ouvrir l\'ampoule loin du patient, préparer discrètement et perfuser lentement pour minimiser l\'exposition à l\'odeur.',
            },
            {
              text: 'Quel effet secondaire bénin et courant est à signaler au patient avec le Complexe Vitamines B ?',
              options: ['Coloration des urines', 'Coloration bleue des muqueuses', 'Hypotension sévère', 'Bradycardie'],
              correct: 'Coloration des urines',
              hint: 'Cet effet visible peut surprendre le patient.',
              explanation: 'La coloration des urines est un effet fréquent et bénin du Complexe Vitamines B, lié à la riboflavine (B2). Il faut en informer le patient au préalable.',
            },
            {
              text: 'Quelle est la dose maximale recommandée de Complexe Vitamines B (Becozyme) ?',
              options: ['2 ampoules', '5 ampoules', '1/2 ampoule', '10 ampoules'],
              correct: '2 ampoules',
              hint: 'La dose standard est 1 ampoule.',
              explanation: 'La dose va de 1 ampoule (min) à 2 ampoules (max), dans NaCl 250–500 ml, administrées en 30 à 45 minutes.',
            },
          ],
        },
        {
          id: 203,
          title: 'Magnésium IV',
          questions: 5,
          time: 6,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la précaution d\'administration la plus importante pour le Magnésium IV ?',
              options: ['Injection lente obligatoire', 'Administration rapide pour efficacité maximale', 'Pas besoin de dilution', 'Administrer uniquement à jeun'],
              correct: 'Injection lente obligatoire',
              hint: 'Le risque principal d\'une administration trop rapide est hémodynamique.',
              explanation: 'L\'injection lente est obligatoire pour le Magnésium IV. Une administration trop rapide peut provoquer hypotension, flushing, lourdeur corporelle et oppression.',
            },
            {
              text: 'Quel effet hémodynamique peut survenir si le Magnésium est perfusé trop rapidement ?',
              options: ['Hypotension', 'Hypertension', 'Tachycardie', 'Bradycardie sévère'],
              correct: 'Hypotension',
              hint: 'Le Magnésium est un vasodilatateur.',
              explanation: 'L\'hypotension transitoire est un effet connu du Magnésium IV perfusé trop vite. C\'est pourquoi la règle terrain est simple : "Toujours lent".',
            },
            {
              text: 'Quelles sont les indications du Magnésium IV ?',
              options: ['Stress, crampes, fatigue', 'Neuropathie, antioxydant, peau', 'Immunité, cheveux, ongles', 'Fatigue intense, longévité, récupération'],
              correct: 'Stress, crampes, fatigue',
              hint: 'Le Magnésium est impliqué dans la contraction musculaire et la gestion du stress.',
              explanation: 'Le Magnésium IV est indiqué pour le stress, les crampes et la fatigue. Il joue un rôle dans plus de 300 réactions enzymatiques.',
            },
            {
              text: 'Quelle est la "règle terrain" absolue pour le Magnésium IV ?',
              options: ['Toujours lent', 'Toujours rapide et concentré', 'Jamais seul, toujours en cocktail', 'Uniquement le matin à jeun'],
              correct: 'Toujours lent',
              hint: 'C\'est la règle la plus importante du guide pour ce produit.',
              explanation: '"Toujours lent" est la règle terrain du Magnésium. Le magnésium mal administré (trop vite) est une cause fréquente d\'inconfort en IV therapy.',
            },
            {
              text: 'Quel volume de dilution est recommandé pour le Magnésium IV ?',
              options: ['NaCl 250–500 ml', 'NaCl 50 ml', 'Dextrose 100 ml', 'NaCl 1000 ml'],
              correct: 'NaCl 250–500 ml',
              hint: 'Un volume suffisant assure une bonne dilution et une administration confortable.',
              explanation: 'Le Magnésium IV se dilue dans NaCl 250 à 500 ml pour permettre une administration lente (45 à 60 minutes) et réduire l\'irritation veineuse.',
            },
          ],
        },
        {
          id: 204,
          title: 'Zinc IV',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Pourquoi le Zinc doit-il toujours être dilué pour une administration IV ?',
              options: ['Pour éviter l\'irritation veineuse', 'Pour augmenter son efficacité', 'Pour masquer sa couleur', 'Pour réduire son coût'],
              correct: 'Pour éviter l\'irritation veineuse',
              hint: 'Le Zinc non dilué peut provoquer une réaction locale immédiate.',
              explanation: 'Le Zinc est toujours dilué car il peut provoquer une irritation veineuse à forte concentration, ainsi que des nausées rapides si l\'administration est trop concentrée.',
            },
            {
              text: 'Quelle est la dose minimale de Zinc IV recommandée ?',
              options: ['2 mg', '10 mg', '50 mg', '100 µg'],
              correct: '2 mg',
              hint: 'La dose minimale est bien inférieure à la dose maximale (10 mg).',
              explanation: 'La dose minimale est de 2 mg, la dose maximale est de 10 mg. Ces doses expriment bien la puissance du Zinc même à faibles concentrations.',
            },
            {
              text: 'Quelles sont les indications du Zinc IV ?',
              options: ['Immunité, peau, cheveux, cicatrisation', 'Fatigue intense, longévité, récupération', 'Neuropathies, carences B12', 'Stress, crampes, troubles du sommeil'],
              correct: 'Immunité, peau, cheveux, cicatrisation',
              hint: 'Le Zinc est impliqué dans la synthèse de la kératine et la réparation tissulaire.',
              explanation: 'Le Zinc IV est indiqué pour l\'immunité, la peau, les cheveux et la cicatrisation. Il joue un rôle essentiel dans la synthèse protéique, la kératine et la réparation des tissus.',
            },
            {
              text: 'Quel effet peut survenir si le Zinc est administré à trop forte concentration ?',
              options: ['Nausées rapides', 'Hypotension sévère', 'Coloration bleue des urines', 'Bradycardie'],
              correct: 'Nausées rapides',
              hint: 'C\'est un effet digestif rapide lié à la concentration.',
              explanation: 'Des nausées rapides peuvent survenir si le Zinc est administré trop concentré. Il est souvent mieux toléré bien dilué dans NaCl 250 ml.',
            },
          ],
        },
        {
          id: 205,
          title: 'Sélénium IV',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle précaution est absolument indispensable avec le Sélénium IV ?',
              options: ['Respecter strictement les doses (toxicité)', 'Toujours perfuser à jeun', 'Diluer uniquement dans Glucose 5%', 'Administrer en bolus IV direct'],
              correct: 'Respecter strictement les doses (toxicité)',
              hint: 'Le Sélénium a une fenêtre thérapeutique étroite.',
              explanation: 'Le respect strict des doses est essentiel pour le Sélénium car il présente une toxicité dose-dépendante. La fenêtre entre dose thérapeutique et dose toxique est relativement étroite.',
            },
            {
              text: 'Quelle est la dose maximale de Sélénium IV ?',
              options: ['100 µg', '1 mg', '10 mg', '500 µg'],
              correct: '100 µg',
              hint: 'Le Sélénium s\'exprime en microgrammes (µg), pas en milligrammes.',
              explanation: 'La dose maximale de Sélénium est de 100 µg. La dose minimale est de 20 µg. Ces doses en microgrammes reflètent le statut d\'oligo-élément du Sélénium.',
            },
            {
              text: 'Quelles sont les indications principales du Sélénium IV ?',
              options: ['Antioxydant, immunité, thyroïde', 'Crampes, stress, fatigue musculaire', 'Neuropathies, éclat de peau', 'Longévité, cognition, énergie'],
              correct: 'Antioxydant, immunité, thyroïde',
              hint: 'Le Sélénium est cofacteur d\'enzymes antioxydantes et joue un rôle dans la fonction thyroïdienne.',
              explanation: 'Le Sélénium IV est indiqué comme antioxydant, pour le soutien immunitaire et la fonction thyroïdienne. Il est cofacteur de la glutathion peroxydase et intervient dans la conversion des hormones thyroïdiennes.',
            },
            {
              text: 'Comment le Sélénium IV est-il généralement toléré ?',
              options: ['Généralement très bien toléré', 'Fréquemment mal toléré', 'Tolérance très variable', 'Souvent irritant'],
              correct: 'Généralement très bien toléré',
              hint: 'C\'est l\'un des produits avec le meilleur profil de tolérance.',
              explanation: 'Le Sélénium IV est généralement très bien toléré. Rarement, on peut observer un goût inhabituel ou une légère gêne digestive.',
            },
          ],
        },
        {
          id: 206,
          title: 'Glutathion IV',
          questions: 5,
          time: 6,
          status: 'locked',
          quiz: [
            {
              text: 'Pour le Glutathion IV, quelle est la recommandation principale d\'administration ?',
              options: ['Injecter lentement', 'Injecter en bolus rapide', 'Mélanger avec la Vitamine C', 'Perfuser uniquement le matin'],
              correct: 'Injecter lentement',
              hint: 'La vitesse d\'administration impacte directement la tolérance.',
              explanation: 'Le Glutathion doit être injecté lentement. Il est souvent mieux toléré quand l\'administration est progressive, réduisant le risque de nausées et de sensations de chaleur.',
            },
            {
              text: 'Quel goût inhabituel est fréquemment rapporté avec le Glutathion IV ?',
              options: ['Goût soufré', 'Goût métallique uniquement', 'Goût sucré', 'Aucun goût particulier'],
              correct: 'Goût soufré',
              hint: 'Le Glutathion contient des groupes soufrés dans sa structure chimique.',
              explanation: 'Un goût soufré ou inhabituel est fréquemment rapporté lors de l\'administration de Glutathion IV, en lien avec la structure du tripeptide (Glu-Cys-Gly).',
            },
            {
              text: 'Quelles sont les indications du Glutathion IV ?',
              options: ['Antioxydant, détox, peau', 'Fatigue intense, longévité, NAD+', 'Neuropathies, crampes, carences', 'Immunité, ongles, cheveux'],
              correct: 'Antioxydant, détox, peau',
              hint: 'Le Glutathion est le principal antioxydant intracellulaire.',
              explanation: 'Le Glutathion IV est indiqué pour ses propriétés antioxydantes, de détoxification et pour améliorer l\'éclat de la peau. C\'est le principal antioxydant intracellulaire.',
            },
            {
              text: 'Quel signe peut indiquer une administration trop rapide de Glutathion ?',
              options: ['Sensation subjective de "vide" ou faiblesse', 'Hypertension sévère', 'Coloration verte des urines', 'Bradycardie'],
              correct: 'Sensation subjective de "vide" ou faiblesse',
              hint: 'C\'est une sensation subjective atypique, rapidement résolutive.',
              explanation: 'Une sensation de "vide" ou de faiblesse peut survenir si le Glutathion est administré trop rapidement. Ralentir le débit résout généralement ce symptôme.',
            },
            {
              text: 'Quelle est la durée recommandée pour une perfusion de Glutathion IV ?',
              options: ['20 à 30 minutes', '60 à 90 minutes', '5 à 10 minutes', '45 à 60 minutes'],
              correct: '20 à 30 minutes',
              hint: 'Le Glutathion s\'administre plus rapidement que la majorité des autres produits.',
              explanation: 'Le Glutathion IV se perfuse en 20 à 30 minutes dans NaCl 100 à 250 ml. C\'est l\'une des durées les plus courtes du protocole. Adapter le débit selon la tolérance reste la règle.',
            },
          ],
        },
        {
          id: 207,
          title: 'Vitamine B12 Injectable',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Par quelles voies peut être administrée la Vitamine B12 injectable ?',
              options: ['IM ou IV lente', 'IV rapide uniquement', 'Voie sous-cutanée uniquement', 'Voie orale uniquement'],
              correct: 'IM ou IV lente',
              hint: 'Deux voies parentérales sont possibles selon le contexte.',
              explanation: 'La Vitamine B12 peut être administrée par voie IM (intramusculaire) ou IV lente. En IV, elle est diluée dans NaCl 100 ml et administrée en 30 à 45 minutes.',
            },
            {
              text: 'Quelle précaution est spécifiquement mentionnée pour la Vitamine B12 ?',
              options: ['Vérifier l\'indication réelle', 'Ne jamais dépasser 500 µg', 'Toujours avec Glucose 5%', 'Éviter chez les patients anxieux'],
              correct: 'Vérifier l\'indication réelle',
              hint: 'La B12 est parfois prescrite sans vérification préalable de carence.',
              explanation: 'Il faut vérifier l\'indication réelle avant d\'administrer la Vitamine B12 injectable. La carence doit être confirmée ou l\'indication clinique clairement établie.',
            },
            {
              text: 'Quelles sont les indications de la Vitamine B12 injectable ?',
              options: ['Carence, fatigue, neurologique', 'Éclat de peau, antioxydant, immunité', 'Crampes, stress, troubles du sommeil', 'Longévité, cognition, anti-âge'],
              correct: 'Carence, fatigue, neurologique',
              hint: 'La B12 est essentielle à la myéline et au métabolisme nerveux.',
              explanation: 'La Vitamine B12 injectable est indiquée pour les carences avérées, la fatigue et les manifestations neurologiques (neuropathies, troubles cognitifs liés à une carence).',
            },
            {
              text: 'Quel effet rare peut survenir avec la Vitamine B12 injectable ?',
              options: ['Agitation transitoire ou sensation d\'activation', 'Somnolence profonde', 'Hypotension sévère', 'Anaphylaxie fréquente'],
              correct: 'Agitation transitoire ou sensation d\'activation',
              hint: 'Cet effet est paradoxal pour un traitement de la fatigue.',
              explanation: 'Rarement, une agitation transitoire ou une sensation d\'activation peut être observée après injection de Vitamine B12. Cet effet est transitoire et bénin.',
            },
          ],
        },
        {
          id: 208,
          title: 'Biotine (B7) & Bépanthène (B5)',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la voie d\'administration de la Biotine injectable ?',
              options: ['IM (intramusculaire)', 'IV uniquement', 'Voie sous-cutanée', 'Perfusion IV lente obligatoire'],
              correct: 'IM (intramusculaire)',
              hint: 'La Biotine n\'est pas administrée en perfusion IV dans ce protocole.',
              explanation: 'La Biotine (B7) s\'administre par voie IM. La dose va de 5 mg (min) à 10 mg (max). Elle est très bien tolérée avec aucun inconfort spécifique fréquent.',
            },
            {
              text: 'Comment est généralement tolérée la Biotine injectable ?',
              options: ['Très bien tolérée, aucun inconfort spécifique fréquent', 'Souvent mal tolérée', 'Tolérance très variable', 'Fréquemment irritante'],
              correct: 'Très bien tolérée, aucun inconfort spécifique fréquent',
              hint: 'C\'est l\'un des produits avec le meilleur profil de tolérance.',
              explanation: 'La Biotine est très bien tolérée en pratique. Aucun inconfort spécifique fréquent n\'est rapporté, ce qui en fait un produit à faible risque.',
            },
            {
              text: 'Quelles sont les indications de la Biotine (B7) injectable ?',
              options: ['Cheveux, ongles, peau', 'Neuropathies, carences B12', 'Fatigue intense, longévité', 'Stress, crampes, immunité'],
              correct: 'Cheveux, ongles, peau',
              hint: 'La Biotine est connue sous le nom de "vitamine de la beauté".',
              explanation: 'La Biotine (B7) est indiquée pour améliorer l\'état des cheveux, des ongles et de la peau. Elle joue un rôle essentiel dans la synthèse de la kératine.',
            },
            {
              text: 'Quelle particularité de l\'injection intramusculaire de Biotine doit être anticipée ?',
              options: ['Parfois douloureuse (consistance huileuse)', 'Toujours indolore', 'Flushing systématique', 'Coloration au site d\'injection'],
              correct: 'Parfois douloureuse (consistance huileuse)',
              hint: 'Un conseil pratique simple aide à réduire cet inconfort.',
              explanation: 'L\'injection de Biotine peut être douloureuse en raison de sa consistance huileuse. Conseils pratiques : demander au patient de relâcher complètement le muscle ; marcher après l\'injection réduit l\'inconfort.',
            },
          ],
        },
        {
          id: 209,
          title: 'Complexe Multivitaminé IV',
          questions: 3,
          time: 4,
          status: 'locked',
          quiz: [
            {
              text: 'Quelles particularités fréquentes doit-on anticiper avec le Complexe Multivitaminé IV ?',
              options: ['Odeur marquée et couleur intense', 'Inodore et incolore', 'Goût sucré uniquement', 'Aucune particularité notable'],
              correct: 'Odeur marquée et couleur intense',
              hint: 'Ces caractéristiques sont liées à la composition en vitamines B.',
              explanation: 'Le Complexe Multivitaminé présente une odeur marquée et une couleur intense (liées aux vitamines B), pouvant provoquer des nausées chez les sujets sensibles ou anxieux.',
            },
            {
              text: 'Quelle est l\'indication principale du Complexe Multivitaminé IV ?',
              options: ['Fatigue globale', 'Fatigue musculaire uniquement', 'Neuropathies isolées', 'Carences spécifiques en B12'],
              correct: 'Fatigue globale',
              hint: 'Le terme "global" reflète la combinaison de plusieurs vitamines.',
              explanation: 'Le Complexe Multivitaminé IV est indiqué pour la fatigue globale, en apportant un soutien nutritionnel large grâce à la combinaison de plusieurs vitamines.',
            },
            {
              text: 'Quelle surveillance est recommandée lors de la perfusion du Complexe Multivitaminé ?',
              options: ['Surveiller les réactions', 'Aucune surveillance particulière', 'Surveiller uniquement la glycémie', 'Surveiller uniquement la TA'],
              correct: 'Surveiller les réactions',
              hint: 'Comme pour tout produit, la vigilance s\'impose.',
              explanation: 'Il est recommandé de surveiller les réactions lors de la perfusion du Complexe Multivitaminé, notamment chez les patients sensibles aux odeurs ou à tendance anxieuse.',
            },
          ],
        },
        {
          id: 210,
          title: 'NAD+ (500 mg)',
          questions: 6,
          time: 8,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la règle absolue d\'administration du NAD+ ?',
              options: ['Toujours en perfusion lente', 'Toujours en bolus rapide pour efficacité', 'Administrer uniquement chez patients âgés', 'Ne jamais dépasser 250 mg'],
              correct: 'Toujours en perfusion lente',
              hint: 'Le problème avec le NAD+ est presque toujours le débit.',
              explanation: '"Toujours perfusion lente" est la règle absolue du NAD+. Les effets indésirables sévères (oppression thoracique, palpitations, sensation de mort imminente) sont quasi exclusivement liés à un débit trop rapide.',
            },
            {
              text: 'Quelle durée est recommandée pour une perfusion de 500 mg de NAD+ ?',
              options: ['90 à 120 minutes', '30 à 45 minutes', '5 à 10 minutes', '2 à 3 heures minimum'],
              correct: '90 à 120 minutes',
              hint: 'Pour 250 mg = 60-75 min, donc 500 mg doit être proportionnellement plus long.',
              explanation: 'Pour 500 mg de NAD+, la durée recommandée est de 90 à 120 minutes. Pour 250 mg, c\'est 60 à 75 minutes. Ces durées longues sont essentielles.',
            },
            {
              text: 'Quel symptôme alarmant peut survenir chez les patients anxieux si le NAD+ est perfusé trop rapidement ?',
              options: ['Sensation de mort imminente', 'Somnolence profonde', 'Euphorie intense', 'Bradycardie asymptomatique'],
              correct: 'Sensation de mort imminente',
              hint: 'C\'est le symptôme le plus impressionnant, mais quasi exclusivement lié au débit.',
              explanation: 'Une sensation de mort imminente peut survenir chez certains patients anxieux avec un NAD+ trop rapide. La conduite pratique est de ralentir drastiquement — le problème est presque toujours le débit.',
            },
            {
              text: 'Quelles sont les indications du NAD+ IV ?',
              options: ['Fatigue intense, récupération, longévité', 'Éclat de peau, immunité de base', 'Neuropathies B12, crampes magnésium', 'Infections aiguës, fièvre, douleurs'],
              correct: 'Fatigue intense, récupération, longévité',
              hint: 'Le NAD+ est impliqué dans le métabolisme énergétique cellulaire profond.',
              explanation: 'Le NAD+ est indiqué pour la fatigue intense, la récupération et comme approche de longévité. Il joue un rôle central dans le métabolisme énergétique mitochondrial.',
            },
            {
              text: 'Quel solvant est recommandé pour la dilution du NAD+ ?',
              options: ['NaCl 500 ml', 'Dextrose 250 ml', 'NaCl 100 ml', 'Ringer 500 ml'],
              correct: 'NaCl 500 ml',
              hint: 'Un grand volume assure une dilution suffisante pour ce produit délicat.',
              explanation: 'Le NAD+ est dilué dans NaCl 500 ml. Ce grand volume contribue à une dilution suffisante et favorise l\'administration lente indispensable.',
            },
            {
              text: 'Quelles sont les contre-indications absolues du NAD+ IV ?',
              options: ['Cancer actif, grossesse, allaitement, moins de 18 ans', 'Hypertension et diabète', 'Allergie aux vitamines B uniquement', 'Insuffisance rénale légère'],
              correct: 'Cancer actif, grossesse, allaitement, moins de 18 ans',
              hint: 'Ces populations sont exclues des protocoles NAD+ pour des raisons de sécurité.',
              explanation: 'Le NAD+ IV est contre-indiqué en cas de cancer actif, de grossesse, d\'allaitement et chez les patients de moins de 18 ans. Ces contre-indications doivent être vérifiées systématiquement avant toute administration.',
            },
          ],
        },
        {
          id: 211,
          title: 'Acide Alpha-Lipoïque (ALA)',
          questions: 5,
          time: 6,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle précaution particulière concerne l\'Acide Alpha-Lipoïque et la glycémie ?',
              options: ['Ne jamais perfuser à jeun + surveiller la glycémie', 'Perfuser uniquement à jeun', 'Administrer après repas très copieux uniquement', 'La glycémie n\'est pas pertinente avec ce produit'],
              correct: 'Ne jamais perfuser à jeun + surveiller la glycémie',
              hint: 'L\'ALA peut agir sur la sensibilité à l\'insuline.',
              explanation: 'L\'ALA peut majorer l\'inconfort chez un patient à glycémie basse. Il ne faut jamais perfuser à jeun et il convient de surveiller la glycémie, particulièrement chez les diabétiques.',
            },
            {
              text: 'Quelles sont les indications de l\'Acide Alpha-Lipoïque IV ?',
              options: ['Neuropathie, antioxydant', 'Fatigue intense, longévité, récupération', 'Éclat de peau, immunité, stress', 'Crampes, cheveux, ongles'],
              correct: 'Neuropathie, antioxydant',
              hint: 'L\'ALA est particulièrement reconnu pour son action sur le système nerveux périphérique.',
              explanation: 'L\'Acide Alpha-Lipoïque est indiqué pour les neuropathies et comme antioxydant puissant. Il est particulièrement efficace dans les neuropathies diabétiques.',
            },
            {
              text: 'Quels effets fréquents peuvent survenir avec l\'Acide Alpha-Lipoïque IV ?',
              options: ['Sensation de faiblesse, nausées, tremblements', 'Coloration bleue des urines', 'Euphorie, sensation d\'activation', 'Bradycardie, hypotension marquée'],
              correct: 'Sensation de faiblesse, nausées, tremblements',
              hint: 'Ces effets peuvent être liés à une hypoglycémie relative.',
              explanation: 'Sensation de faiblesse, nausées, malaise vague et tremblements sont fréquents avec l\'ALA. Ces effets peuvent être liés à son action insulino-sensibilisante.',
            },
            {
              text: 'Quelle est la durée recommandée pour une perfusion d\'Acide Alpha-Lipoïque ?',
              options: ['30 à 60 minutes', '5 à 10 minutes', '2 heures minimum', '90 à 120 minutes'],
              correct: '30 à 60 minutes',
              hint: 'C\'est une durée dans la fourchette standard.',
              explanation: 'L\'ALA s\'administre en 30 à 60 minutes dans NaCl 250 ml. La surveillance de la glycémie est recommandée pendant et après la perfusion.',
            },
            {
              text: 'Quelle recommandation spécifique concerne les mélanges avec l\'Acide Alpha-Lipoïque ?',
              options: ['De préférence ne pas mélanger avec d\'autres vitamines', 'Toujours associer avec la Vitamine C', 'Compatible avec tous les minéraux IV', 'Mélanger systématiquement avec le Glutathion'],
              correct: 'De préférence ne pas mélanger avec d\'autres vitamines',
              hint: 'L\'ALA fait partie des produits à administrer de préférence seuls.',
              explanation: 'L\'ALA doit de préférence être administré seul dans sa poche. Prudence particulière avec les minéraux (magnésium, zinc, sélénium) en raison des propriétés chélatrices de l\'ALA, qui peut réduire leur biodisponibilité.',
            },
          ],
        },
        {
          id: 212,
          title: 'Bleu de Méthylène',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Dans quel solvant doit être dilué le Bleu de Méthylène ?',
              options: ['Glucosé 250 à 500 ml', 'NaCl 0,9% uniquement', 'Ringer lactate', 'NaCl 500 ml'],
              correct: 'Glucosé 250 à 500 ml',
              hint: 'C\'est le seul produit de la liste qui exige ce solvant glucosé.',
              explanation: 'Le Bleu de Méthylène se dilue dans du Glucosé (Dextrose) 250 à 500 ml uniquement. Il ne faut jamais le diluer dans du sérum physiologique (NaCl). C\'est le seul produit du protocole à exiger exclusivement un solvant glucosé.',
            },
            {
              text: 'Quelle interaction médicamenteuse importante est signalée pour le Bleu de Méthylène ?',
              options: ['Interactions avec les ISRS', 'Interactions avec les antihypertenseurs', 'Interactions avec les antibiotiques', 'Aucune interaction significative'],
              correct: 'Interactions avec les ISRS',
              hint: 'ISRS = Inhibiteurs Sélectifs de la Recapture de la Sérotonine (antidépresseurs).',
              explanation: 'Le Bleu de Méthylène peut interagir avec les ISRS en potentialisant le syndrome sérotoninergique. Cette interaction doit être vérifiée impérativement avant administration.',
            },
            {
              text: 'Quel effet visible bénin doit être signalé au patient avant la perfusion de Bleu de Méthylène ?',
              options: ['Coloration bleue/verte des urines et muqueuses', 'Coloration rouge des urines', 'Coloration jaune de la peau', 'Aucun effet visible'],
              correct: 'Coloration bleue/verte des urines et muqueuses',
              hint: 'La couleur caractéristique du produit se retrouve dans les sécrétions.',
              explanation: 'La coloration bleue/verte des urines et parfois des muqueuses est fréquente. Toujours prévenir le patient pour éviter une panique inutile.',
            },
            {
              text: 'Quelles sont les indications du Bleu de Méthylène IV ?',
              options: ['Fatigue, cognition', 'Immunité, peau, éclat', 'Crampes, neuropathies, carences', 'Longévité uniquement'],
              correct: 'Fatigue, cognition',
              hint: 'Le Bleu de Méthylène a des effets sur le métabolisme mitochondrial.',
              explanation: 'Le Bleu de Méthylène est indiqué pour la fatigue et la cognition. Il agit comme accepteur d\'électrons dans la chaîne respiratoire mitochondriale.',
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // MODULE 3 — MÉLANGES & PRATIQUE
    // ─────────────────────────────────────────────
    {
      id: 3,
      name: 'Mélanges & Pratique',
      icon: '⚗️',
      color: '#065F46',
      bg: '#ECFDF5',
      border: '#6EE7B7',
      lessons: [
        {
          id: 301,
          title: 'Mélanges — Règles de Compatibilité',
          questions: 4,
          time: 5,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle combinaison de produits est reconnue comme compatible en IV ?',
              options: ['Vit C + B + Mg', 'Bleu de Méthylène + NAD+', 'Sélénium + Zinc + ALA', 'Glutathion + Bleu de Méthylène'],
              correct: 'Vit C + B + Mg',
              hint: 'C\'est l\'un des mélanges les plus couramment utilisés en cabinet.',
              explanation: 'La combinaison Vit C + B + Mg est reconnue comme compatible. D\'autres associations validées : Vit C + Zinc, et B + Mg.',
            },
            {
              text: 'Quelle règle générale s\'applique aux mélanges IV de vitamines ?',
              options: ['Éviter trop de produits dans une seule poche', 'Plus il y a de produits, meilleur est l\'effet', 'Tous les produits sont compatibles entre eux', 'Seuls les mélanges à 4+ produits sont efficaces'],
              correct: 'Éviter trop de produits dans une seule poche',
              hint: 'La stabilité des mélanges est difficile à garantir.',
              explanation: 'Il faut éviter de mettre trop de produits dans une seule poche car les mélanges peuvent être instables. Il est préférable de tester progressivement.',
            },
            {
              text: 'Parmi ces associations, laquelle est aussi mentionnée comme compatible ?',
              options: ['B + Mg', 'NAD+ + Glutathion', 'Magnésium + Bleu de Méthylène', 'Zinc + ALA + Sélénium'],
              correct: 'B + Mg',
              hint: 'Ce mélange combine deux produits bien connus pour la fatigue.',
              explanation: 'B + Mg est une association compatible selon le guide, en plus de Vit C + B + Mg et Vit C + Zinc.',
            },
            {
              text: 'Quels produits doivent être administrés de préférence seuls dans leur poche de sérum ?',
              options: ['Glutathion, ALA, NAD+, Bleu de Méthylène', 'Vitamine C, Zinc, Sélénium', 'Complexe Vitamines B, Magnésium', 'Vitamine B12 uniquement'],
              correct: 'Glutathion, ALA, NAD+, Bleu de Méthylène',
              hint: 'Ces produits ont des propriétés physicochimiques particulières qui contre-indiquent les mélanges.',
              explanation: 'Par mesure de prudence et de stabilité physicochimique, le Glutathion, l\'ALA, le NAD+ et le Bleu de Méthylène doivent être perfusés séparément. Ils peuvent être administrés avant ou après une autre perfusion vitaminique, mais pas dans la même poche.',
            },
          ],
        },
        {
          id: 302,
          title: 'Durées Types, Conseils & Objectifs',
          questions: 3,
          time: 4,
          status: 'locked',
          quiz: [
            {
              text: 'Quelle est la durée type d\'une séance standard ?',
              options: ['30–45 minutes', '5–10 minutes', '2–4 heures', '60–90 minutes obligatoires'],
              correct: '30–45 minutes',
              hint: 'C\'est la durée la plus courante pour la majorité des produits.',
              explanation: 'Une séance standard dure 30 à 45 minutes. Le Magnésium et les cocktails nécessitent 45-60 minutes, et le NAD+ peut aller jusqu\'à 2-4 heures.',
            },
            {
              text: 'Quel volume est recommandé pour débuter avec un nouveau patient ou un nouveau produit ?',
              options: ['Préférer 250 ml au début', 'Toujours commencer avec 500 ml', 'Utiliser 100 ml pour aller plus vite', 'Le volume n\'a pas d\'importance'],
              correct: 'Préférer 250 ml au début',
              hint: 'Commencer modéré permet d\'évaluer la tolérance.',
              explanation: 'Il est recommandé de préférer 250 ml au début pour observer la tolérance, puis augmenter progressivement. Cette approche est au cœur de la philosophie de mise en route.',
            },
            {
              text: 'Quel est l\'objectif principal décrit dans le guide pour cette approche progressive ?',
              options: ['Mise en place rapide, sécurité maximale, protocoles simples et efficaces', 'Maximiser les doses le plus vite possible', 'Réduire le coût des séances', 'Minimiser le temps de présence du médecin'],
              correct: 'Mise en place rapide, sécurité maximale, protocoles simples et efficaces',
              hint: 'Les trois objectifs sont complémentaires et simultanés.',
              explanation: 'L\'objectif est triple : mise en place rapide, sécurité maximale et protocoles simples et efficaces. La progressivité est un outil au service de ces trois objectifs.',
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────
    // MODULE 4 — SÉCURITÉ & URGENCES
    // ─────────────────────────────────────────────
    {
      id: 4,
      name: 'Sécurité & Urgences',
      icon: '🚨',
      color: '#991B1B',
      bg: '#FEF2F2',
      border: '#FECACA',
      lessons: [
        {
          id: 401,
          title: 'Évaluation Pré-Perfusion & Effets par Produit',
          questions: 5,
          time: 7,
          status: 'locked',
          quiz: [
            {
              text: 'Parmi ces situations, laquelle contre-indique temporairement une séance de perfusion IV ?',
              options: ['Fièvre ou infection aiguë en cours', 'Légère fatigue chronique', 'Antécédent de carence en vitamine B12', 'Patient âgé de plus de 60 ans'],
              correct: 'Fièvre ou infection aiguë en cours',
              hint: 'L\'état clinique doit être stable avant toute perfusion.',
              explanation: 'Un patient fébrile ou en infection aiguë ne doit pas recevoir de perfusion IV. L\'évaluation pré-perfusion vérifie : absence de fièvre, patient hydraté, ayant mangé et cliniquement stable.',
            },
            {
              text: 'Quel facteur clinique augmente significativement le risque d\'intolérance à une perfusion IV ?',
              options: ['Déshydratation', 'Consommation modérée d\'eau avant la séance', 'Légère activité physique avant', 'Prise de vitamines orales le matin'],
              correct: 'Déshydratation',
              hint: 'L\'état d\'hydratation impacte directement la tolérance vasculaire.',
              explanation: 'La déshydratation est un facteur majeur d\'intolérance. Un patient déshydraté tolérera souvent moins bien une perfusion, même parfaitement réalisée. L\'hydratation préalable est recommandée.',
            },
            {
              text: 'Pour l\'Acide Alpha-Lipoïque, quelle règle pratique est absolue ?',
              options: ['Ne jamais perfuser à jeun', 'Toujours perfuser à jeun pour absorption maximale', 'Administrer uniquement après le repas du soir', 'Perfuser en bolus rapide'],
              correct: 'Ne jamais perfuser à jeun',
              hint: 'L\'ALA peut agir sur la glycémie.',
              explanation: 'L\'Acide Alpha-Lipoïque ne doit jamais être perfusé à jeun car il peut majorer un inconfort chez un patient à glycémie basse ou en état hypoglycémique relatif.',
            },
            {
              text: 'Quelle règle simple est recommandée lorsqu\'on hésite sur le débit d\'une perfusion ?',
              options: ['Si vous hésitez, ralentissez', 'Si vous hésitez, accélérez pour finir plus vite', 'Arrêtez la perfusion définitivement', 'Appelez immédiatement le SAMU'],
              correct: 'Si vous hésitez, ralentissez',
              hint: 'C\'est une règle pratique simple et universelle du guide.',
              explanation: '"Si vous hésitez, ralentissez" est une règle simple et sûre. Une perfusion plus lente est mieux tolérée, permet une meilleure observation clinique et améliore l\'expérience globale.',
            },
            {
              text: 'Quelle est la principale cause sous-jacente de la majorité des inconforts rapportés en IV therapy ?',
              options: ['Vitesse d\'administration trop rapide', 'Allergie vraie aux produits', 'Incompatibilité chimique', 'Mauvaise indication clinique'],
              correct: 'Vitesse d\'administration trop rapide',
              hint: 'C\'est lié à la technique d\'administration, pas au produit lui-même.',
              explanation: 'La majorité des inconforts sont liés à une vitesse d\'administration trop rapide, et non à une allergie vraie. C\'est pourquoi ralentir est souvent la première et meilleure conduite.',
            },
          ],
        },
        {
          id: 402,
          title: 'Conduite à Tenir face aux Réactions Aiguës',
          questions: 6,
          time: 8,
          status: 'locked',
          quiz: [
            {
              text: 'Quel est l\'événement aigu le plus fréquent en pratique ambulatoire lors d\'une perfusion IV ?',
              options: ['Malaise vagal', 'Choc anaphylactique', 'Réaction allergique sévère', 'Arrêt cardiaque'],
              correct: 'Malaise vagal',
              hint: 'Il est souvent déclenché par l\'anxiété ou la vue d\'une aiguille.',
              explanation: 'Le malaise vagal est de loin l\'événement aigu le plus fréquent. Déclencheurs : anxiété, douleur, jeûne, déshydratation, fatigue, odeurs fortes.',
            },
            {
              text: 'Quelle est la première conduite à tenir face à un malaise vagal ?',
              options: ['Arrêter la perfusion + décubitus dorsal (jambes surélevées si hypotension)', 'Accélérer la perfusion pour finir rapidement', 'Administrer de l\'adrénaline immédiatement', 'Appeler le SAMU en priorité absolue'],
              correct: 'Arrêter la perfusion + décubitus dorsal (jambes surélevées si hypotension)',
              hint: 'Les premières étapes sont simples et non médicamenteuses.',
              explanation: 'Face à un malaise vagal : 1) Arrêter la perfusion, 2) Décubitus dorsal (jambes surélevées si hypotension), 3) Vérifier conscience/FC/TA/respiration, 4) Rassurer activement.',
            },
            {
              text: 'Dans quel cas l\'adrénaline IM est-elle indiquée en urgence immédiate ?',
              options: ['Anaphylaxie avec hypotension sévère + détresse respiratoire', 'Simple urticaire isolé sans autre signe', 'Malaise vagal avec perte de connaissance brève', 'Nausées et vertiges seuls'],
              correct: 'Anaphylaxie avec hypotension sévère + détresse respiratoire',
              hint: 'L\'anaphylaxie est une urgence absolue avec signes ABC compromis.',
              explanation: 'Le choc anaphylactique (hypotension sévère, détresse respiratoire, bronchospasme, œdème laryngé) est une urgence absolue : arrêt perfusion, ABC, adrénaline IM immédiate, oxygène, accès IV.',
            },
            {
              text: 'Comment distinguer rapidement une intolérance au débit d\'une véritable allergie ?',
              options: ['Le ralentissement améliore immédiatement les symptômes', 'L\'urticaire est présente dans les deux cas', 'La mesure de la TA permet de trancher', 'Un test sanguin rapide est nécessaire'],
              correct: 'Le ralentissement améliore immédiatement les symptômes',
              hint: 'La réponse au ralentissement est le signe clinique clé.',
              explanation: 'Si les symptômes (chaleur, nausées, oppression) s\'améliorent rapidement en ralentissant, il s\'agit très probablement d\'une intolérance au débit et non d\'une allergie vraie.',
            },
            {
              text: 'Quel est l\'ordre pratique de fréquence des causes de malaise aigu en cabinet IV ?',
              options: ['Vagal → débit rapide → anxiété → problème local → hypersensibilité → anaphylaxie', 'Anaphylaxie → allergie → vagal → débit → anxiété', 'Hypersensibilité → vagal → débit → anxiété → problème local', 'Débit → vagal → allergie → anaphylaxie → anxiété'],
              correct: 'Vagal → débit rapide → anxiété → problème local → hypersensibilité → anaphylaxie',
              hint: 'La cause la plus grave est heureusement la plus rare.',
              explanation: 'En cabinet : 1-malaise vagal, 2-débit trop rapide, 3-anxiété/panique, 4-problème local IV, 5-hypersensibilité, 6-anaphylaxie. L\'anaphylaxie est exceptionnelle mais critique.',
            },
            {
              text: 'Avant de conclure à une allergie grave, quels facteurs cliniques simples doit-on d\'abord éliminer ?',
              options: ['Patient anxieux / à jeun / déshydraté / débit rapide / magnésium / NAD+', 'Faire un bilan allergologique complet immédiat', 'Appeler le fabricant du produit', 'Attendre 24 heures avant de réévaluer'],
              correct: 'Patient anxieux / à jeun / déshydraté / débit rapide / magnésium / NAD+',
              hint: 'C\'est le "réflexe clinique simple" du guide avant de penser allergie.',
              explanation: 'Avant de penser "allergie grave", se demander : patient anxieux ? à jeun ? déshydraté ? produit rapide ? magnésium ? NAD+ ? La majorité des incidents s\'améliorent par arrêt, ralentissement, positionnement et réassurance.',
            },
          ],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────
// Helper: retourne le quiz d'une leçon par son id numérique
// ─────────────────────────────────────────────────────────────────────
export function getQuizByLessonId(id) {
  const modules = curriculum[1];
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      if (lesson.id === id) {
        return {
          lessonTitle: lesson.title,
          topicName: mod.name,
          topicColor: mod.color,
          questions: lesson.quiz,
        };
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────
// Helper: liste à plat de toutes les leçons d'un niveau (toujours 1)
// ─────────────────────────────────────────────────────────────────────
export function getAllLessons(level = 1) {
  const modules = curriculum[level] || [];
  return modules.flatMap(mod => mod.lessons);
}

// ─────────────────────────────────────────────────────────────────────
// Disclaimer médical — affiché sur chaque fiche protocole
// ─────────────────────────────────────────────────────────────────────
export const MEDICAL_DISCLAIMER =
  'Ce guide est basé sur l\'usage courant. Les posologies doivent toujours être adaptées au patient, au contexte clinique, aux antécédents et aux bilans biologiques.';
