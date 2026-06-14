# Ivitaminacademy — Project Reference
**Plateforme de formation certifiante — Perfusions de vitamines IV**
Préparé par : Lahbabta Youssef | Transformation : Juin 2026

---

## Vue d'ensemble

Ivitaminacademy est une plateforme de formation médicale certifiante en français, basée sur le booklet :
**"BOOKLET DE MISE EN ROUTE — Perfusions de vitamines IV — Guide pratique médecin"**

Les médecins suivent 4 modules (19 leçons, 75 QCM), obtiennent des badges et impriment un certificat.
Un superviseur peut lier un ou plusieurs médecins et suivre leur progression en temps réel.

---

## Répertoires du projet

| Répertoire | Rôle |
|---|---|
| `ProteinProjectYchmael/` | **Principal** — dépôt git, source de vérité |
| `MathProject/` | Miroir — synchronisé via PowerShell `Copy-Item` |

Toute modification doit être faite dans `ProteinProjectYchmael/` puis synchronisée vers `MathProject/`.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Base de données / Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Routage | React Router v6 |
| Contexte Auth | `src/context/AuthContext.jsx` |
| Variables d'env | `client/.env.local` — `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` |
| Hébergement | Vercel (frontend) + Supabase (DB + Auth) |

---

## Rôles

| Valeur DB (enum) | Nom affiché | Description |
|---|---|---|
| `medecin` | Médecin | Apprenant — suit les modules, passe les QCM, obtient le certificat |
| `admin` | Admin | Accès complet à la plateforme |

> **Important :** Les chemins URL (`/kid/*`, `/parent/*`) sont conservés tels quels (routage uniquement).
> L'enum DB utilise `medecin` et `admin` uniquement.

---

## Routes

| Chemin | Garde rôle | Page |
|---|---|---|
| `/` | public | LandingPage |
| `/login` | public | SignInPage |
| `/signup` | public | SignUpPage |
| `/how` | public | HowItWorks |
| `/faq` | public | FAQ |
| `/privacy` | public | PrivacyTerms |
| `/admin/login` | public | AdminLoginPage |
| `/admin/dashboard` | admin | AdminDashboardPage |
| `/parent/dashboard` | superviseur | ParentDashboard |
| `/parent/lessons` | superviseur | ParentLessons |
| `/parent/reports` | superviseur | ParentReports |
| `/parent/profile` | superviseur | ParentProfile |
| `/parent/calculator` | superviseur | ParentCalculator |
| `/kid/dashboard` | medecin | KidDashboard |
| `/kid/lessons` | medecin | KidLessons |
| `/kid/quiz/:id` | medecin | KidQuiz |
| `/kid/progress` | medecin | KidProgress |
| `/kid/profile` | medecin | KidProfile |
| `/kid/certificate` | medecin | CertificatePage |
| `/medecin/calendar` | medecin | CalendarPage |
| `/certificate/verify/:code` | public (anon) | CertificateVerifyPage |

---

## Palette de couleurs

| Token | Hex | Usage |
|---|---|---|
| Navy primaire | `#1E3A5F` | Module 1, accent principal, navbar |
| Bleu | `#1D4ED8` | Module 2, accent secondaire |
| Navy sombre | `#0F2847` | Layout superviseur |
| Vert | `#065F46` | Module 3, états de succès |
| Rouge | `#991B1B` | Module 4, états d'erreur |
| Fond bleu clair | `#EFF6FF` | Fond des cartes |
| Bordure bleue | `#93C5FD` | Bordures des cartes |
| Ambre | `#FEF3C7` / `#FFF7ED` | Avertissements médicaux (conservé intentionnellement) |

---

## Structure du curriculum (`client/src/data/curriculum.js`)

Clé unique : `curriculum[1]` — pas de système de niveaux/grades.

```
4 modules × ~5 leçons × ~4-6 questions QCM = 18 leçons / 84 questions

Module 1 — Fondamentaux        (color: #1E3A5F, bg: #EFF6FF, border: #BFDBFE)  — 2 leçons / 11 questions
Module 2 — Protocoles          (color: #1D4ED8, bg: #EFF6FF, border: #93C5FD)  — 12 leçons / 58 questions
Module 3 — Mélanges & Pratique (color: #065F46, bg: #ECFDF5, border: #6EE7B7)  — 2 leçons / 7 questions
Module 4 — Sécurité & Urgences (color: #991B1B, bg: #FEF2F2, border: #FECACA) — 2 leçons / 11 questions
```

**Corrections de contenu (14 Juin 2026) — basées sur le booklet PDF :**
- Zinc : indications corrigées → `Immunité, peau, cheveux, cicatrisation`
- Sélénium : indications corrigées → `Antioxydant, immunité, thyroïde`
- Biotine : indications corrigées → `Cheveux, ongles, peau`
- Bleu de Méthylène : solvant corrigé → `Glucosé 250 à 500 ml` (pas "Dextrose 250 ml")

**Nouvelles questions ajoutées :**
- Glutathion : durée de perfusion (20-30 min)
- Biotine : injection IM douloureuse (consistance huileuse)
- NAD+ : contre-indications absolues (cancer actif, grossesse, allaitement, <18 ans)
- ALA : ne pas mélanger avec d'autres vitamines (propriétés chélatrices)
- Mélanges : produits à perfuser seuls (Glutathion, ALA, NAD+, Bleu de Méthylène)

Structure d'un objet topic :
```js
{
  id: number,
  title: string,
  color: string,
  bg: string,
  border: string,
  lessons: [{ id, title, questions: [{ q, options, correct, hint, explanation }] }]
}
```

---

## Schéma de base de données (`supabase/full_setup.sql`)

| Table | Colonnes clés | Notes |
|---|---|---|
| `profiles` | `id, name, email, role, avatar, streak_days, banned_from_quiz, quiz_cycle, booking_used, certificate_code, certificate_issued_at, certificate_score_pct` | `banned_from_quiz bool default false`, `quiz_cycle smallint default 1`, `booking_used bool default false`, `certificate_code uuid unique default gen_random_uuid()` |
| `topics` | `id, name, icon, sort_order` | |
| `lessons` | `id, topic_id, title, sort_order` | |
| `questions` | `id, lesson_id, question_text, options, correct_answer, hint, explanation` | |
| `progress` | `user_id, lesson_id, ...` | Legacy — conservé pour compatibilité |
| `user_progress` | `user_id, lesson_ref, score, completed, attempts, last_date` | Actif — `lesson_ref` = id numérique de la leçon (text) |
| `badges` | `id, name, icon, condition_type, condition_value` | 6 badges seedés |
| `user_badges` | `user_id, badge_id, earned_at` | |
| `time_slots` | `id, start_time, is_active, created_at` | Créés par admin ; `is_active` permet de désactiver sans supprimer |
| `bookings` | `id, user_id, slot_id, status, notes, created_at, updated_at` | `status`: `confirmed` / `cancelled` / `completed` |

---

## Services (`client/src/services/`)

| Fichier | Exports | Notes |
|---|---|---|
| `auth.js` | `signUp, signIn, signOut, getProfile, updateProfile, changePassword` | Wrapper Supabase Auth |
| `progress.js` | `saveProgress, getProgressMap, getProgress` | localStorage + upsert Supabase ; appelle `notify_superviseur_for_progress` |
| `family.js` | `getChildren, linkChildByCode, linkChild, unlinkChild` | Requête `supervisor_medecin` ; appelle `link_medecin_by_code` |
| `admin.js` | `importContent, getAdminDashboardData, activateMedecin, setMedecinStatus, updateProfileByAdmin, unbanMedecinFromQuiz, upsertProgressByAdmin, adminGetAllSlots, adminCreateSlot, adminDeactivateSlot, adminGetAllBookings, adminCreateBooking, adminCompleteBooking, adminCancelBooking, adminGrantBookingException` | Inclut les fonctions de gestion des réservations |
| `bookings.js` | `getActiveSlots, getBookedSlotIds, getMyBooking, createBooking, cancelBooking, rescheduleBooking` | Service côté médecin ; `getBookedSlotIds` appelle la RPC `get_booked_slot_ids()` |
| `certificates.js` | `saveCertificate(userId, scorePct)`, `verifyCertificate(code)` | `saveCertificate` est idempotent (filtre `IS NULL`) ; `verifyCertificate` appelle la RPC `verify_certificate` accessible en `anon` |

---

## Badges (seedés en DB + calculés en frontend)

| Icône | Nom | Condition |
|---|---|---|
| ⭐ | Apprenant rapide | 5 leçons complétées |
| 🔥 | En feu | 5 jours consécutifs |
| 🎯 | Précis | Score 100% à un quiz |
| 🚀 | Module complet | Terminer un module entier |
| 💎 | Diamant | 10 jours consécutifs |
| 🏆 | Certifié | Toute la formation complétée |

---

## Système de scoring global (`KidQuiz.jsx`)

Le médecin doit compléter les **18 leçons** de tous les modules avant qu'un score global soit calculé.

| Résultat | Condition | Action |
|---|---|---|
| Certificat disponible | toutes les leçons terminées + score ≥ 80% | `globalResult.type = 'pass'` |
| 2ème tentative | cycle 1 + score < 80% | `quiz_cycle` → 2 ; tous les quiz se réinitialisent |
| Accès banni | cycle 2 + score < 80% | `banned_from_quiz` → true |

**Formule :** `score global = ∑ bonnes réponses / ∑ questions totales × 100`

**Colonnes `profiles` utilisées :**
- `quiz_cycle` (`1` ou `2`) — détermine combien d'`attempts` sont requis pour considérer une leçon "faite ce cycle"
- `banned_from_quiz` — bloque l'accès aux quiz ET aux leçons/cours

**Helpers (`KidQuiz.jsx`, `CertificatePage.jsx`) :**
```js
isAllDoneForCycle(progressMap, cycle)  // toutes les leçons avec attempts >= cycle
calcGlobalScore(progressMap)           // { totalCorrect, totalQuestions, pct }
```

---

## Système de réservation (`/medecin/calendar` → `CalendarPage.jsx`)

**Règles métier :**

| Condition | Comportement |
|---|---|
| `profile.booking_used = true` OU `myBooking.status = 'completed'` | Écran "Session utilisée" — contacter l'admin |
| Réservation active et `slot.start_time > now` | Affiche la réservation + boutons Modifier / Annuler |
| Réservation active et `slot.start_time <= now` | Verrou — impossible de modifier |
| Aucune réservation active | Calendrier interactif avec créneaux disponibles |

**Prévention des conflits :**
- Index partiel `UNIQUE ON bookings(slot_id) WHERE status <> 'cancelled'` — pas de double-réservation
- RPC `get_booked_slot_ids()` — retourne les `slot_id` pris sans exposer l'identité des utilisateurs
- `booking_used = true` est positionné par l'admin via `adminCompleteBooking()` → protège contre les nouvelles réservations post-séance

**Contrôles admin (section "Réservations" dans AdminDashboardPage) :**
- Créer un créneau (datetime-local → UTC)
- Désactiver un créneau futur
- Marquer une réservation "Effectué" (→ `booking_used = true`)
- Annuler une réservation
- Accorder une exception (→ `booking_used = false`) pour permettre une nouvelle réservation

---

## Certificat (`/kid/certificate` → `CertificatePage.jsx`)

**Condition de déverrouillage :** `isAllDoneForCycle(progressMap, cycle) && globalPct >= 80`

| État | Écran |
|---|---|
| Toutes les leçons non terminées pour le cycle courant | Tracker de progression par module |
| Toutes terminées, score < 80% | "Certificat non disponible" + score affiché + guidage cycle |
| Toutes terminées, score ≥ 80% | Certificat PDF + badge score vert |

- Affiche le nom du médecin, la date, la grille 2×2 des modules, le score global, deux lignes de signature.
- Impression PDF via `window.print()` — classe `.no-print` masque la navigation et les boutons.
- Date du certificat = `last_date` la plus récente de `user_progress`.

---

## Avatars

**Médecin (défauts) :** `'👨‍⚕️', '👩‍⚕️', '🩺', '💉', '🧬'` + options génériques (20 total, grid-cols-5)
**Superviseur (défauts) :** `'🩺', '👩‍⚕️', '👨‍⚕️', '👩‍🔬', '👨‍🔬'` + options génériques

---

## ProtectedRoute

- État de chargement : fond `#EFF6FF`, texte `#1E3A5F`, "Chargement…"
- Mauvais rôle : `superviseur` → `/parent/dashboard`, `medecin` → `/kid/dashboard`
- Non authentifié : redirigé vers `/login`

---

## Structure des fichiers

```
ProteinProjectYchmael/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx           ✅ Ivitaminacademy — navy, français
│   │   │   ├── SignInPage.jsx            ✅ Ivitaminacademy — navy, français
│   │   │   ├── SignUpPage.jsx            ✅ rôles medecin/superviseur
│   │   │   ├── HowItWorks.jsx            ✅ Ivitaminacademy — 4 modules
│   │   │   ├── FAQ.jsx                   ✅ Ivitaminacademy — français
│   │   │   ├── PrivacyTerms.jsx          ✅ (à mettre à jour si nécessaire)
│   │   │   ├── KidDashboard.jsx          ✅ curriculum[1], navy, français
│   │   │   ├── KidLessons.jsx            ✅ ban screen + cycle-aware doneThisRound
│   │   │   ├── KidLessonView.jsx         ✅ vérification banned_from_quiz
│   │   │   ├── KidQuiz.jsx              ✅ scoring global 18 leçons, 2 cycles, ban
│   │   │   ├── KidProgress.jsx           ✅ curriculum[1], navy, français
│   │   │   ├── KidProfile.jsx            ✅ badges IV, avatars médicaux
│   │   │   ├── CertificatePage.jsx       ✅ garde score ≥ 80% + 3 écrans
│   │   │   ├── CalendarPage.jsx          ✅ calendrier mensuel + réservation/modification/annulation
│   │   │   ├── ParentDashboard.jsx       ✅ curriculum[1], navy, français
│   │   │   ├── ParentLessons.jsx         ✅ curriculum[1], navy, français
│   │   │   ├── ParentReports.jsx         ✅ curriculum[1], navy, français
│   │   │   ├── ParentProfile.jsx         ✅ avatars médicaux, français
│   │   │   ├── ParentCalculator.jsx      ✅ conservé
│   │   │   ├── AdminLoginPage.jsx        ✅ conservé
│   │   │   └── AdminDashboardPage.jsx    ✅ rôles medecin/superviseur, français
│   │   ├── components/
│   │   │   ├── KidLayout.jsx             ✅ nav Ivitaminacademy + Certificat
│   │   │   ├── ParentLayout.jsx          ✅ nav Ivitaminacademy
│   │   │   └── ProtectedRoute.jsx        ✅ rôles medecin/superviseur, français
│   │   ├── context/
│   │   │   └── AuthContext.jsx           ✅ inchangé
│   │   ├── services/
│   │   │   ├── supabaseClient.js         ✅ inchangé
│   │   │   ├── auth.js                   ✅ inchangé
│   │   │   ├── progress.js               ✅ notify_superviseur_for_progress
│   │   │   ├── family.js                 ✅ supervisor_medecin, link_medecin_by_code
│   │   │   ├── admin.js                  ✅ + fonctions admin booking (7 nouvelles)
│   │   │   └── bookings.js               ✅ service réservation côté médecin
│   │   └── data/
│   │       └── curriculum.js             ✅ 4 modules IV / 19 leçons / 75 QCM
│   ├── index.html                        ✅ lang="fr", titre "Ivitaminacademy"
│   └── .env.local                        ✅ clés Supabase (ne pas committer)
└── supabase/
    └── full_setup.sql                    ✅ schéma complet Ivitaminacademy + tables time_slots/bookings (section 17)
```

---

## Checklist de déploiement

- [ ] Créer un projet Supabase sur supabase.com
- [ ] Coller et exécuter `supabase/full_setup.sql` dans le SQL Editor
- [ ] Créer `client/.env.local` :
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] Désactiver "Confirm email" dans Supabase Auth → Providers → Email (pour les tests)
- [ ] `cd client && npm install && npm run dev`
- [ ] Déployer sur Vercel → ajouter les variables d'env dans le dashboard Vercel
