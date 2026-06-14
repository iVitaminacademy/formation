# Ivitaminacademy — Journal des transformations

---

## Session 5 — 14 Juin 2026 — Hotfix : full_setup.sql incompatible avec une nouvelle base

### `supabase/full_setup.sql` — Section 0

**Cause :** `DROP TRIGGER IF EXISTS trg_prevent_status_escalation ON public.profiles` échoue avec `42P01: relation "public.profiles" does not exist` sur une base vierge. `IF EXISTS` sur `DROP TRIGGER` supprime seulement l'erreur "trigger introuvable", pas l'erreur "table introuvable".

**Fix :** Le drop du trigger est maintenant encapsulé dans un bloc `DO $$ BEGIN ... EXCEPTION WHEN undefined_table THEN NULL END $$` — transparent sur une base existante, silencieux sur une base vierge.

---

## Session 5 — 14 Juin 2026 — QR Code de vérification des certificats

### Fonctionnalité
Chaque médecin ayant obtenu son certificat (score ≥ 80 %) dispose désormais d'un QR code unique affiché sur le certificat. Quand quelqu'un scanne le QR, il accède à une page publique de vérification (sans connexion requise) affichant le nom, la formation, le score et la date d'émission.

### SQL — `supabase/full_setup.sql` — Section 19

| Changement | Détail |
|---|---|
| `profiles.certificate_code uuid NOT NULL UNIQUE DEFAULT gen_random_uuid()` | UUID permanent, auto-généré à la création du profil, encodé dans le QR |
| `profiles.certificate_issued_at timestamptz` | Défini une seule fois lors de la première obtention du certificat |
| `profiles.certificate_score_pct int` | Score global (%) au moment de la délivrance |
| RPC `verify_certificate(p_code uuid)` | Retourne `{ valid, name, score_pct, issued_at, formation }` — `security definer`, accessible par `anon` sans authentification |

### Nouveaux fichiers

| Fichier | Description |
|---|---|
| `client/src/services/certificates.js` | `saveCertificate(userId, scorePct)` — idempotent (filtre `IS NULL`) ; `verifyCertificate(code)` — appelle le RPC anon |
| `client/src/pages/CertificateVerifyPage.jsx` | Page publique `/certificate/verify/:code` — affiche ✅ Certificat authentique ou ❌ Invalide, sans connexion requise |

### Fichiers modifiés

| Fichier | Changement |
|---|---|
| `client/src/pages/CertificatePage.jsx` | Import `react-qr-code` + `saveCertificate` ; `useEffect` qui persiste le certificat en DB (une seule fois) ; QR code affiché dans la carte certificat avec section "Vérification d'authenticité" |
| `client/src/App.jsx` | Import `CertificateVerifyPage` ; route publique `<Route path="/certificate/verify/:code" />` |
| `client/package.json` | Dépendance `react-qr-code` installée |


**Transformation de Frazzl.kid (math) → Ivitaminacademy (formation médicale)**
Développeur : Lahbabta Youssef

---

## Session 4 — 14 Juin 2026 — Hotfix : profil manquant + calendrier

### `client/src/services/auth.js` — `getProfile` plus défensif

- Remplacé `.single()` par `.maybeSingle()` — retourne `null` au lieu de lever une erreur 406 si aucune ligne n'existe
- Ajout d'un fallback : si le profil n'existe pas, création automatique à partir des métadonnées auth (`user_metadata.name`, `user_metadata.role`)
- Élimine la boucle d'erreurs `[Auth] failed to load profile: Cannot coerce the result to a single JSON object`

### `supabase/full_setup.sql` — Section 18 : backfill des profils orphelins

- Insère un profil pour tout utilisateur `auth.users` sans ligne correspondante dans `public.profiles`
- Idempotent (`ON CONFLICT DO NOTHING`)
- Corrige les comptes créés pendant la période où le trigger était cassé

---

## Session 4 — 14 Juin 2026 — Hotfix : "Database error saving new user"

### `supabase/full_setup.sql` — Correction du trigger `handle_new_user`

**Cause racine :** `handle_new_user()` déclare `v_role user_role`, créant une dépendance PostgreSQL sur l'enum. Lors d'un nouveau passage de `full_setup.sql`, `DROP TYPE user_role` échouait silencieusement (la dépendance n'était pas retirée), puis `CREATE TYPE user_role` échouait aussi (type déjà existant). La fonction se retrouvait dans un état incohérent → 500 à chaque inscription.

**Corrections :**

| Correction | Détail |
|---|---|
| Section 0 : drop du trigger et de la fonction AVANT le drop du type | `DROP TRIGGER on_auth_user_created`, `DROP FUNCTION handle_new_user()`, `DROP FUNCTION is_admin()`, `DROP FUNCTION set_updated_at()` ajoutés avant `DROP TYPE user_role` |
| Trigger plus défensif | Le cast `::user_role` est dans un bloc `BEGIN/EXCEPTION`, le corps entier a un `EXCEPTION WHEN OTHERS THEN RETURN NEW` — l'inscription auth ne peut plus retourner 500 |
| Cast explicite | `'medecin'::user_role` et `'admin'::user_role` au lieu de litéraux texte non typés dans le trigger |

---

## Session 4 — 14 Juin 2026 — Système de réservation (Calendrier)

### Nouveaux fichiers créés

| Fichier | Description |
|---|---|
| `client/src/services/bookings.js` | Service utilisateur : `getActiveSlots`, `getBookedSlotIds`, `getMyBooking`, `createBooking`, `cancelBooking`, `rescheduleBooking` |
| `client/src/pages/CalendarPage.jsx` | Page calendrier complète avec grille mensuelle, réservation, modification, annulation, écran "session utilisée" |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `client/src/components/KidLayout.jsx` | Ajout de l'item `Calendrier (📅)` dans la navigation (entre Certificat et Profil) |
| `client/src/App.jsx` | Ajout de l'import `CalendarPage` + route `/medecin/calendar` |
| `client/src/services/admin.js` | Ajout de `booking_used` dans la requête `getAdminDashboardData` + 7 nouvelles fonctions admin : `adminGetAllSlots`, `adminCreateSlot`, `adminDeactivateSlot`, `adminGetAllBookings`, `adminCreateBooking`, `adminCompleteBooking`, `adminCancelBooking`, `adminGrantBookingException` |
| `client/src/pages/AdminDashboardPage.jsx` | Section "Réservations & Créneaux" ajoutée : création de créneaux, liste des créneaux à venir, liste de toutes les réservations avec actions (Effectué / Annuler / Exception). Badge `📅 Session utilisée` dans la liste des utilisateurs. |
| `supabase/full_setup.sql` | Section 17 ajoutée : tables `time_slots` + `bookings`, colonne `profiles.booking_used`, index partiel `bookings_slot_unique_active`, RPC `get_booked_slot_ids()`, policies RLS |

### Règles métier implémentées

| Règle | Implémentation |
|---|---|
| 1 seul créneau actif par utilisateur | `booking_used = true` après complétion ; écran "session utilisée" affiché |
| Modification avant l'heure du créneau | `slot.start_time > now` → boutons Modifier / Annuler ; sinon verrou |
| Pas de double-réservation d'un créneau | Index partiel `UNIQUE ON bookings(slot_id) WHERE status <> 'cancelled'` |
| Verrou immédiat après réservation | `bookedIds` mis à jour localement + DB via unique index |
| Après séance effectuée → contacter admin | Écran dédié avec lien email |
| Admin peut créer des créneaux | `adminCreateSlot(startTime)` → table `time_slots` |
| Admin peut marquer une séance "effectuée" | `adminCompleteBooking` → `status = 'completed'` + `booking_used = true` |
| Admin peut accorder une exception | `adminGrantBookingException` → `booking_used = false` |

---

## Session 3 — 14 Juin 2026 (suite)

### `client/src/data/curriculum.js` — Corrections et ajouts QCM (basés sur le PDF booklet)

**Total questions : 79 → 84**

#### Corrections (réponses incorrectes ou incomplètes par rapport au PDF)

| Leçon | Question corrigée | Avant | Après |
|---|---|---|---|
| Zinc (204) | Indications | `Immunité, peau, cheveux` | `Immunité, peau, cheveux, cicatrisation` |
| Sélénium (205) | Indications | `Antioxydant, immunité` | `Antioxydant, immunité, thyroïde` |
| Biotine (208) | Indications | `Cheveux, ongles` | `Cheveux, ongles, peau` |
| Bleu de Méthylène (212) | Solvant de dilution | `Dextrose 250 ml` | `Glucosé 250 à 500 ml` |

#### Nouvelles questions ajoutées

| Leçon | Sujet | Réponse correcte |
|---|---|---|
| Glutathion (206) — Q5 | Durée de perfusion | `20 à 30 minutes` |
| Biotine (208) — Q4 | Injection IM douloureuse (consistance huileuse) | `Parfois douloureuse (consistance huileuse)` |
| NAD+ (210) — Q6 | Contre-indications absolues | `Cancer actif, grossesse, allaitement, moins de 18 ans` |
| ALA (211) — Q5 | Ne pas mélanger avec d'autres vitamines | `De préférence ne pas mélanger avec d'autres vitamines` |
| Mélanges (301) — Q4 | Produits à perfuser seuls dans leur poche | `Glutathion, ALA, NAD+, Bleu de Méthylène` |

#### Compteurs `questions` et `time` mis à jour

| Leçon | questions avant → après | time avant → après |
|---|---|---|
| Glutathion (206) | 4 → 5 | 5 → 6 |
| Biotine (208) | 3 → 4 | 4 → 5 |
| NAD+ (210) | 5 → 6 | 7 → 8 |
| ALA (211) | 4 → 5 | 5 → 6 |
| Mélanges (301) | 3 → 4 | 4 → 5 |

---

## Session 3 — 14 Juin 2026

### Système de scoring global + restrictions d'accès

---

### `supabase/full_setup.sql` — 3 corrections d'erreurs d'idempotence SQL

**Erreur 1 — `ERROR: 42710: type "user_role_old" already exists`**
- Cause : le script tentait de renommer `user_role` → `user_role_old` alors qu'il existait déjà.
- Fix : `DROP TYPE IF EXISTS user_role_old CASCADE` ajouté avant le renommage.

**Erreur 2 — `ERROR: 42703: column "role" does not exist`**
- Cause : `DROP TYPE user_role_old CASCADE` supprimait en cascade la colonne `profiles.role`.
- Fix : Suppression de l'approche rename ; conversion directe `role` en `text` avant `DROP TYPE`.

**Erreur 3 — `ERROR: 2BP01: cannot drop type user_role_old because other objects depend on it`**
- Cause : la valeur DEFAULT `'medecin'::user_role_old` de la colonne référençait encore l'ancien type.
- Fix : `ALTER COLUMN role DROP DEFAULT` ajouté avant la conversion en texte.

**Solution finale (section 0) :**
```sql
do $$ begin
  alter table public.profiles alter column role drop default;
  alter table public.profiles alter column role type text using role::text;
exception when others then null; end $$;
drop type if exists user_role_old;
drop type if exists user_role;
create type user_role as enum ('medecin', 'admin');
```

**Nouvelles colonnes ajoutées à `profiles` :**
```sql
banned_from_quiz  boolean  not null default false
quiz_cycle        smallint not null default 1
```
Ajoutées à la fois dans `CREATE TABLE IF NOT EXISTS` et via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (idempotent).

---

### `client/src/pages/KidQuiz.jsx` — Refonte complète du système de scoring

**Ancienne logique supprimée :**
- `MAX_ATTEMPTS`, `canRetry`, `handleRetry`, `BlockedScreen`, `bestScore`, `blocked`

**Nouveau système global :**
- Un médecin doit terminer les **18 leçons** (tous les modules) avant qu'un score global soit calculé.
- Score global = `∑ bonnes réponses / ∑ questions totales` sur l'ensemble du curriculum.
- Si ≥ 80% → certificat disponible.
- Si < 80% (cycle 1) → `quiz_cycle` passe à `2` ; le médecin peut retenter tous les quiz.
- Si < 80% (cycle 2) → `banned_from_quiz = true` ; accès aux tests ET aux cours révoqué.

**Helpers ajoutés :**
```js
isAllDoneForCycle(progressMap, cycle)   // toutes les leçons ≥ cycle.attempts
calcGlobalScore(progressMap)            // { totalCorrect, totalQuestions, pct }
countDoneForCycle(progressMap, cycle)   // nb de leçons terminées pour ce cycle
```

**`runGlobalCheck(allProg)`** — vérifie après chaque quiz si toutes les leçons du cycle courant sont faites, puis applique pass / fail_cycle1 / fail_cycle2.

**Pattern `profileRef`** — `useRef(profile)` mis à jour via `useEffect` pour éviter les closures stale dans le callback du timer.

**Nouveaux composants :**
- `AlreadyDoneScreen` — affiché si la leçon est déjà complétée pour le cycle courant.
- `GlobalResultPage` — 3 variantes : `pass` (certificat disponible), `fail_cycle1` (2ème tentative), `fail_cycle2` (banni).

**Ordre de rendu :**
```
loadingProgress → banned_from_quiz → alreadyDone → globalResult → ScorePage → quiz actif
```

---

### `client/src/pages/KidLessons.jsx` — Ecran de bannissement + cycle-aware

**Ajout `BannedFromLessonsScreen`** — affiché à la place de la liste des leçons si `profile.banned_from_quiz = true`.

**`doneThisRound(lesson)` mis à jour :**
```js
const r = progressMap[lesson.id]
return r?.completed && (r.attempts ?? 0) >= currentCycle
```
*(remplace l'ancienne logique basée sur `roundStart`)*

**Bannière cycle 2** — avertissement rouge affiché quand `currentCycle === 2`.

---

### `client/src/pages/KidLessonView.jsx` — Vérification d'accès banni

Ajout d'une vérification au début du composant :
```js
const { profile } = useAuth()
if (profile?.banned_from_quiz) {
  return <KidLayout>🚫 Accès aux cours révoqué — Contacte l'administrateur.</KidLayout>
}
```

---

### `client/src/pages/CertificatePage.jsx` — Réécriture complète

**Ancienne logique :** Débloqué si tous les modules sont à 100% (comptage de leçons complétées).

**Nouvelle logique :** Trois écrans distincts selon l'état de l'utilisateur :

| État | Écran affiché |
|---|---|
| Toutes les leçons non terminées pour le cycle courant | Tracker de progression (modules + barre) |
| Toutes terminées mais score global < 80% | "Certificat non disponible" avec score affiché |
| Toutes terminées ET score ≥ 80% | Certificat PDF avec badge de score |

**Helpers ajoutés :**
- `calcGlobalScore(progressMap)` — identique à KidQuiz
- `isAllDoneForCycle(progressMap, cycle)` — cycle-aware
- `computeModuleProgress(progressMap, cycle)` — pour le tracker de progression

**Badge de score sur le certificat :**
```
Score global : 63/79 — 80%
```

**Messages contextuels sur l'écran "insuffisant" :**
- Cycle 1 → "vous pouvez repasser une dernière fois"
- Cycle 2 → "contactez l'administrateur"

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
