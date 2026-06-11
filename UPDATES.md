# Ivitaminacademy — Journal des transformations
**Transformation de Frazzl.kid (math) → Ivitaminacademy (formation médicale)**
Développeur : Lahbabta Youssef

---

## Session 2 — Juin 2026 (suite)

### `supabase/full_setup.sql` — Réécriture complète (3 passes)

**Passe 1 — Contenu médical initial**
- Remplacé tout le schéma Frazzl.kid/math par le schéma Ivitaminacademy
- Seed : 6 badges médicaux + 4 topics IV Médic
- En-tête et commentaires mis à jour

**Passe 2 — Renommage enum + table**
- Enum `user_role` : `'kid'` → `'medecin'`, `'parent'` → `'superviseur'`
- Table `parent_child` → `supervisor_medecin` (toutes les références)
- Trigger `set_link_code` : condition `new.role = 'medecin'`
- Backfill : `where role = 'medecin'`
- RPC `link_parent_child_by_code` → `link_medecin_by_code(p_code text)`
- RPC `notify_parents_for_progress` → `notify_superviseur_for_progress(p_medecin_id, ...)`
- Indexes renommés : `idx_supervisor_medecin_superviseur`, `idx_supervisor_medecin_medecin`

**Passe 3 — Renommage colonnes**
- `parent_id` → `superviseur_id` (dans `supervisor_medecin`, `notifications`, toutes les policies RLS, RPCs)
- `child_id` → `medecin_id` (même périmètre)
- Commentaire final : `select name, role, link_code from public.profiles where role = 'medecin';`

---

### `client/src/services/family.js` — Réécriture complète

- Table : `supervisor_medecin`
- Colonnes : `superviseur_id`, `medecin_id`
- RPC : `link_medecin_by_code({ p_code })`
- Exports conservés : `getChildren`, `linkChildByCode`, `linkChild`, `unlinkChild`
- Commentaires traduits en français

---

### `client/src/services/progress.js` — Modifié

- RPC : `notify_parents_for_progress` → `notify_superviseur_for_progress`
- Paramètre : `p_child_id` → `p_medecin_id`

---

### `client/src/services/admin.js` — Modifié

- Table : `parent_child` → `supervisor_medecin`
- Colonnes dans les selects Supabase : `superviseur_id`, `medecin_id`
- Alias : `superviseur:superviseur_id(...)`, `medecin:medecin_id(...)`
- `linkParentChild(superviseurId, medecinId)` : payload `{ superviseur_id, medecin_id }`, `onConflict: 'superviseur_id,medecin_id'`
- `unlinkParentChild` : `.eq('superviseur_id', ...)`, `.eq('medecin_id', ...)`
- `getParentChildLinksForAdmin` : select `superviseur_id`, `medecin_id`

---

### `client/src/App.jsx` — Modifié

- 5 routes `role="parent"` → `role="superviseur"`
- 6 routes `role="kid"` → `role="medecin"`
- Commentaires : `{/* Parent */}` → `{/* Superviseur */}`, `{/* Kid */}` → `{/* Médecin */}`
- Chemins URL `/kid/*` et `/parent/*` **conservés inchangés**

---

### `client/src/components/ProtectedRoute.jsx` — Modifié

- Commentaire de type : `'kid' | 'parent'` → `'medecin' | 'superviseur'`
- Comparaison rôle : `profile.role === 'parent'` → `profile.role === 'superviseur'`
- Redirections URL `/parent/dashboard` et `/kid/dashboard` conservées

---

### `client/src/pages/SignUpPage.jsx` — Modifié

- `ROLES[0].id` : `'kid'` → `'medecin'`
- `ROLES[1].id` : `'parent'` → `'superviseur'`
- État initial : `useState('kid')` → `useState('medecin')`
- Toutes les comparaisons `role === 'kid'` → `role === 'medecin'`

---

### `client/src/pages/SignInPage.jsx` — Modifié

- `profile.role === 'parent'` → `profile.role === 'superviseur'`

---

### `client/src/pages/AdminDashboardPage.jsx` — Modifié (étendu)

- Toutes les comparaisons `=== 'kid'` → `=== 'medecin'` (replace_all)
- Toutes les comparaisons `=== 'parent'` → `=== 'superviseur'` (replace_all)
- État par défaut `role: 'kid'` → `role: 'medecin'`
- `!== 'kid'` → `!== 'medecin'`
- Options select : `value="medecin">médecin`, `value="superviseur">superviseur`
- `roleCounts` par défaut : `{ medecin: 0, superviseur: 0, admin: 0 }`
- Labels StatCard : "Total utilisateurs", "Superviseurs actifs", "Médecins indépendants", "Série moyenne"
- Titre de section : "Superviseurs & médecins liés"
- Placeholder de recherche : "Rechercher superviseur ou médecin"
- Pill : "X médecin(s) lié(s)"
- État vide : "Aucun médecin lié."
- Accesseurs de données : `row.superviseur_id`, `row.medecin_id`, `row.superviseur?.name`, `row.medecin?.name`
- `l.child_id` → `l.medecin_id`, `l.parent_id` → `l.superviseur_id`

---

### `client/src/pages/HowItWorks.jsx` — Réécriture complète

- Remplacé le contenu Frazzl.kid (mathématiques, parents, enfants)
- Nouveau contenu Ivitaminacademy :
  - Hero : "Comment fonctionne Ivitaminacademy ?"
  - Section Mode Médecin (5 étapes numérotées)
  - Section Mode Superviseur (5 étapes numérotées)
  - 4 cartes de modules colorées (navy, bleu, vert, rouge)
  - Section avertissement médical en ambre
- Fond : `#F0F4F8`, accent `#1E3A5F`

---

### `client/src/pages/FAQ.jsx` — Réécriture complète

- Remplacé le contenu Frazzl.kid (mathématiques, parents, enfants)
- 14 questions-réponses en français pour Ivitaminacademy :
  - Qu'est-ce qu'Ivitaminacademy ?
  - Les 4 modules de formation
  - Format QCM et rétroaction
  - Obtention du certificat
  - Mode superviseur et code de liaison
  - Confidentialité et données médicales
- Section avertissement médical en bas de page

---

## Session 2 — Début Juin 2026

*(Début de la session consacrée à la transformation Ivitaminacademy)*

### Objectif global

Transformer la plateforme d'apprentissage des mathématiques **Frazzl.kid** en **Ivitaminacademy** — plateforme de formation certifiante pour médecins sur les perfusions de vitamines IV, basée sur le booklet de 24 pages.

---

## Session 1 — Mai 2026

### `client/index.html` — Modifié

- Langue : `lang="en"` → `lang="fr"`
- Titre : `"MathMates"` → `"Ivitaminacademy"`
- Meta description mise à jour

---

### `client/src/data/curriculum.js` — Réécriture complète

- Suppression du système de grades (grade 4 / grade 5)
- Clé unique `curriculum[1]`
- 4 modules × ~5 leçons × ~4 questions QCM = 19 leçons / 75 questions
- Contenu basé sur le booklet IV :
  - Module 1 : Fondamentaux & Indications (`#1E3A5F`)
  - Module 2 : Protocoles & Posologies (`#1D4ED8`)
  - Module 3 : Techniques & Matériel (`#065F46`)
  - Module 4 : Sécurité & Complications (`#991B1B`)
- Format des questions : `{ q, options, correct, hint, explanation }`

---

### `client/src/pages/LandingPage.jsx` — Réécriture complète

- Hero : "Ivitaminacademy", sous-titre formation médicale, palette navy
- Features : 4 modules, QCM, certificat, superviseur
- CTA en français

---

### `client/src/pages/SignInPage.jsx` — Réécriture complète (session 1)

- Titre "Se connecter", bouton "Connexion"
- Couleurs navy `#1E3A5F`

---

### `client/src/pages/SignUpPage.jsx` — Réécriture complète (session 1)

- Titre "Créer un compte"
- Sélecteur de rôle (Médecin / Superviseur) avec icônes médicales
- Couleurs navy

---

### `client/src/components/KidLayout.jsx` — Modifié

- Titre nav : "Ivitaminacademy"
- Items de nav : Tableau de bord, Modules, Progression, Profil, Certificat
- Couleur : `#1E3A5F`

---

### `client/src/components/ParentLayout.jsx` — Modifié

- Titre nav : "Ivitaminacademy — Superviseur"
- Items de nav : Tableau de bord, Modules, Rapports, Profil, Calculatrice
- Couleur : `#0F2847`

---

### `client/src/pages/KidDashboard.jsx` — Réécriture complète

- `curriculum[1]` (suppression grade)
- Textes français : "Votre formation", "Modules", "Progression globale", "Jours consécutifs"
- Palette navy + couleurs par module

---

### `client/src/pages/KidLessons.jsx` — Réécriture complète

- `curriculum[1]`, 4 cartes de modules colorées
- Texte : "Leçons & Modules", "Commencer", "Continuer"

---

### `client/src/pages/KidQuiz.jsx` — Réécriture complète

- QCM 4 options, rétroaction immédiate
- Texte : "Question", "Vérifier", "Suivant", "Voir l'explication"
- Couleurs : vert (#065F46) correct, rouge (#991B1B) incorrect

---

### `client/src/pages/KidProgress.jsx` — Réécriture complète

- `curriculum[1]`, barres de progression par module
- Texte : "Ma progression", "Leçons complétées", "Score moyen"

---

### `client/src/pages/KidProfile.jsx` — Réécriture complète

- Avatars médicaux par défaut : `'👨‍⚕️', '👩‍⚕️', '🩺', '💉', '🧬'`
- 6 badges médicaux affichés
- Texte : "Mon profil", "Modifier l'avatar", "Mes badges"

---

### `client/src/pages/CertificatePage.jsx` — Nouveau fichier

- Débloqué quand les 4 modules sont complétés à 100%
- Grille 2×2 des 4 modules avec couleurs
- Deux lignes de signature, logo/icône médical
- Impression PDF via `window.print()` + `.no-print`
- Classe CSS `@media print` pour masquer la nav

---

### `client/src/pages/ParentDashboard.jsx` — Réécriture complète

- Liste des médecins liés + leur progression
- `curriculum[1]`, palette `#0F2847`
- Texte : "Tableau de bord superviseur", "Médecins suivis"

---

### `client/src/pages/ParentLessons.jsx` — Réécriture complète

- Vue superviseur des modules/leçons (lecture seule)
- `curriculum[1]`

---

### `client/src/pages/ParentReports.jsx` — Réécriture complète

- Rapports de progression par médecin
- Sélecteur de médecin, graphiques de progression
- `curriculum[1]`

---

### `client/src/pages/ParentProfile.jsx` — Réécriture complète

- Avatars médicaux superviseur : `'🩺', '👩‍⚕️', '👨‍⚕️', '👩‍🔬', '👨‍🔬'`
- Code de liaison du superviseur affiché
- Texte : "Profil superviseur"

---

### `client/src/pages/ParentCalculator.jsx` — Conservé

- Calculatrice de dosage IV conservée (correspond au contenu médical)

---

### `client/src/components/ProtectedRoute.jsx` — Modifié (session 1)

- Texte de chargement : "Chargement…"
- Fond `#EFF6FF`, texte `#1E3A5F`

---

## Règles de transformation appliquées

1. **Enum DB** : `kid` → `medecin`, `parent` → `superviseur` — partout dans le SQL et le JS
2. **Table DB** : `parent_child` → `supervisor_medecin`
3. **Colonnes DB** : `parent_id` → `superviseur_id`, `child_id` → `medecin_id`
4. **RPCs** : `link_parent_child_by_code` → `link_medecin_by_code`, `notify_parents_for_progress` → `notify_superviseur_for_progress`
5. **Chemins URL** `/kid/*` et `/parent/*` — **intentionnellement conservés** (routage uniquement, pas des valeurs de rôle)
6. **Curriculum** : `curriculum[grade]` → `curriculum[1]` (clé unique, pas de système de niveaux)
7. **Couleurs** : palette arc-en-ciel → palette navy médicale `#1E3A5F`
8. **Langue** : anglais → français partout dans l'UI
9. **Contenu** : mathématiques → perfusions de vitamines IV (basé sur le booklet de 24 pages)

---

## Règles de synchronisation

Tous les changements sont faits dans `ProteinProjectYchmael/` (dépôt git).
Synchronisation vers `MathProject/` via PowerShell :

```powershell
Copy-Item -Path "ProteinProjectYchmael\client\src\*" -Destination "MathProject\client\src\" -Recurse -Force
Copy-Item -Path "ProteinProjectYchmael\supabase\*" -Destination "MathProject\supabase\" -Recurse -Force
```
