# Frazzl.kid — Project Tracker
**Kid & Parent Math Learning Platform | Grades 4 & 5**
Prepared by: Lahbabta Yousef | Started: May 2026

---

## Stack

| Layer | Technology | Status |
|---|---|---|
| Frontend | React.js (Vite) | ✅ Running |
| Database + Auth | Supabase (PostgreSQL + Auth) | ✅ Running — user_progress saving live |
| Hosting (frontend) | Vercel | 🔄 Deployed — production branch = `main`, root dir = `client`, env vars set. ⚠ Live site builds from `main`; latest responsive/DB work lives uncommitted on `dev` and must be merged to `main` to go live. |
| Content | Admin JSON import via `src/services/admin.js` | ✅ Service written |
| ~~Backend (Express)~~ | **Removed** — Supabase handles API + Auth directly | — |

> **Architecture decision (2026-06-01):** Express backend dropped entirely. Supabase's auto-generated REST API + built-in Auth replaces all planned Express routes. Hosting simplified to 2 services: Vercel (frontend) + Supabase (DB + Auth).

---

## Folder Structure

```
MathProject/
├── client/                                    ← React (Vite) ✅
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx                ✅ Done — responsive
│   │   │   ├── SignInPage.jsx                 ✅ Done — Supabase auth wired
│   │   │   ├── SignUpPage.jsx                 ✅ Done — role + grade, Supabase auth wired
│   │   │   ├── FAQ.jsx                        ✅ Done
│   │   │   ├── KidDashboard.jsx               ✅ Done — responsive, real DB data
│   │   │   ├── KidLessons.jsx                 ✅ Done — responsive, real progress unlock
│   │   │   ├── KidQuiz.jsx                    ✅ Done — responsive, saves to DB
│   │   │   ├── KidProgress.jsx                ✅ Done — responsive, real DB data + streak
│   │   │   ├── KidProfile.jsx                 ✅ Done — responsive, real DB badges + profile
│   │   │   ├── ParentDashboard.jsx            ✅ Done — real child stats, topics, suggestion
│   │   │   ├── ParentLessons.jsx              ✅ Done — curriculum + linked child progress, grade switcher
│   │   │   ├── ParentReports.jsx              ✅ Done — real child report (stats, topics, quizzes, weak alerts)
│   │   │   ├── ParentProfile.jsx              ✅ Done — real linked children + link-by-code + child badges
│   │   │   └── ParentTeachingGuide.jsx        ⬜ Not started
│   │   ├── components/
│   │   │   ├── KidLayout.jsx                  ✅ Done — mobile bottom nav
│   │   │   ├── ParentLayout.jsx               ✅ Done — mobile bottom nav
│   │   │   └── ProtectedRoute.jsx             ✅ Done — auth + role guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx                ✅ Done — session + profile + role
│   │   ├── services/
│   │   │   ├── supabaseClient.js              ✅ Done
│   │   │   ├── auth.js                        ✅ Done — signUp/signIn/signOut/Google/profile
│   │   │   ├── lessons.js                     ✅ Done — topics, lessons, questions
│   │   │   ├── progress.js                    ✅ Done — dual-mode save (localStorage + Supabase), streak update
│   │   │   ├── badges.js                      ✅ Done — catalog, earned, award
│   │   │   ├── family.js                      ✅ Done — parent ↔ child linking
│   │   │   └── admin.js                       ✅ Done — JSON bulk import
│   │   ├── data/
│   │   │   └── curriculum.js                  ✅ Done — all Grade 4 & 5 questions with hints & explanations
│   │   └── hooks/                             ⬜ Not started
│   ├── index.html                             ✅ Updated
│   ├── index.css                              ✅ Updated — CSS reset cleaned
│   ├── vite.config.js                         ✅ Updated
│   ├── .env.example                           ✅ Added
│   └── package.json
├── supabase/
│   ├── schema.sql                             ✅ Done — 8 tables, RLS, indexes, triggers
│   ├── seed.sql                               ✅ Done — badges, Grade 4 topics, sample data
│   ├── full_setup.sql                         ✅ Done — all 9 tables in one file (run once in SQL Editor)
│   ├── create_user_progress.sql               ✅ Done — user_progress table (TEXT lesson_ref, no FK)
│   ├── add_streak_column.sql                  ✅ Done — adds last_quiz_date to profiles
│   ├── link_child_code.sql                    ✅ Done — kid link_code + link_child_by_code RPC + parent-read RLS
│   └── migration_progress_text_id.sql         ✅ Done — legacy migration (superseded by full_setup.sql)
├── UPDATES.md                                 ✅ Chronological change log
├── PROJECT.md                                 ✅ This file
└── README.md
```

---

## Dependencies Installed (client)

| Package | Purpose |
|---|---|
| vite + @vitejs/plugin-react | Build tool & React plugin |
| react + react-dom | UI framework |
| tailwindcss + @tailwindcss/vite | Styling (v4) |
| react-router-dom | Client-side routing |
| @supabase/supabase-js | Supabase client (DB + Auth) |

---

## Routes (client)

| Path | Component | Auth | Status |
|---|---|---|---|
| `/` | LandingPage | Public | ✅ Done |
| `/login` | SignInPage | Public | ✅ Done |
| `/signup` | SignUpPage | Public | ✅ Done |
| `/faq` | FAQ | Public | ✅ Done |
| `/kid/dashboard` | KidDashboard | 🔒 Kid only | ✅ Done |
| `/kid/lessons` | KidLessons | 🔒 Kid only | ✅ Done |
| `/kid/quiz/:id` | KidQuiz | 🔒 Kid only | ✅ Done |
| `/kid/progress` | KidProgress | 🔒 Kid only | ✅ Done |
| `/kid/profile` | KidProfile | 🔒 Kid only | ✅ Done |
| `/parent/dashboard` | ParentDashboard | 🔒 Parent only | ✅ Done |
| `/parent/lessons` | ParentLessons | 🔒 Parent only | ✅ Done |
| `/parent/reports` | ParentReports | 🔒 Parent only | ✅ Done |
| `/parent/profile` | ParentProfile | 🔒 Parent only | ✅ Done |
| `/parent/teaching-guide/:lessonId` | ParentTeachingGuide | 🔒 Parent only | ⬜ Not started |

---

## Auth Flow

```
Landing page
  ├── "Start learning" (Kid card)  → /signup?role=kid
  ├── "Enter Parent Mode" (Parent) → /signup?role=parent
  └── "Sign In" (navbar)           → /login

SignUpPage
  - Role picker (Kid / Parent)
  - Kid: Full name + email + password + grade selector
  - Parent: Full name + email + password
  - Supabase signUp() → stores role + grade in profiles table
  - On success → redirect to /kid/dashboard or /parent/dashboard

SignInPage
  - Email + password (or Google OAuth)
  - Supabase signInWithPassword()
  - Role read from profiles table → redirect to correct dashboard

ProtectedRoute
  - Wraps all /kid/* and /parent/* routes
  - Checks session + role → redirects to /login if not authenticated
  - Redirects wrong role to correct dashboard
```

---

## Database Entities (Supabase / PostgreSQL)

| Table | Key Fields | Notes |
|---|---|---|
| profiles | id (= auth.users.id), name, email, role, grade, avatar | Auto-created on signup via trigger |
| parent_child | parent_id, child_id | Links parent to one or more children |
| topics | id, name, grade, icon, order | Math topics per grade |
| lessons | id, topic_id, title, content_text, order, unlock_after_id | Sequential unlock |
| questions | id, lesson_id, question_text, options (JSON), correct_answer, hint, explanation, teaching_steps (JSON) | All content fields |
| progress | id, user_id, lesson_id, completed, score, attempts, last_date | One row per user/lesson (upsert) |
| badges | id, name, icon, condition_type, condition_value | Badge definitions |
| user_badges | user_id, badge_id, earned_at | Earned badges per child |

> **No `password_hash` column** — passwords handled entirely by Supabase Auth (`auth.users`), never stored in `profiles`.

---

## Supabase API — replaces Express endpoints

| Old Express route | Supabase equivalent | Service file |
|---|---|---|
| `POST /auth/register` | `supabase.auth.signUp()` | `auth.js` |
| `POST /auth/login` | `supabase.auth.signInWithPassword()` | `auth.js` |
| `GET /lessons?grade=4` | `supabase.from('lessons').select().eq('grade',4)` | `lessons.js` |
| `GET /lessons/:id/questions` | `supabase.from('questions').select().eq('lesson_id',id)` | `lessons.js` |
| `POST /progress` | `supabase.from('progress').upsert()` | `progress.js` |
| `GET /progress/:childId` | `supabase.from('progress').select().eq('user_id',id)` | `progress.js` |
| `GET /badges/:userId` | `supabase.from('user_badges').select()` | `badges.js` |
| `POST /admin/import` | bulk insert via service function | `admin.js` |

---

## Screens

| # | Screen | Mode | File | Status |
|---|---|---|---|---|
| 1 | Landing — Mode Selection | Public | LandingPage.jsx | ✅ Done |
| — | Sign In | Public | SignInPage.jsx | ✅ Done |
| — | Sign Up | Public | SignUpPage.jsx | ✅ Done |
| — | FAQ | Public | FAQ.jsx | ✅ Done |
| 2 | Kid Dashboard | Kid | KidDashboard.jsx | ✅ Done |
| 3 | Lessons Page | Kid | KidLessons.jsx | ✅ Done |
| 4 | Quiz / Practice Screen | Kid | KidQuiz.jsx | ✅ Done |
| 5 | Progress Page | Kid | KidProgress.jsx | ✅ Done |
| 6 | Parent Dashboard | Parent | ParentDashboard.jsx | ✅ Done |
| 6b | Lessons & Guides | Parent | ParentLessons.jsx | ✅ Done |
| 6c | Reports | Parent | ParentReports.jsx | ✅ Done |
| 7 | Parent Teaching Guide | Parent | ParentTeachingGuide.jsx | ⬜ Not started |
| 8 | Profile & Settings (Kid) | Kid | KidProfile.jsx | ✅ Done |
| 8b | Profile & Settings (Parent) | Parent | ParentProfile.jsx | ✅ Done |

---

## Project Phases

### Phase 1 — Foundation ✅ Done
- [x] Init `/client` (Vite + React)
- [x] Install Tailwind CSS v4 + React Router
- [x] Landing page (Screen 1) — responsive
- [x] Design system: Nunito font, color tokens, shared layouts

### Phase 2 — Kid Side ✅ Done
- [x] KidLayout — mobile bottom nav + desktop sidebar
- [x] Kid Dashboard (Screen 2)
- [x] Lessons Page (Screen 3) — sequential unlock, grade switcher
- [x] Quiz / Practice Screen (Screen 4) — hint, feedback, progress dots, score page
- [x] Progress Page (Screen 5) — stats, topic bars, quiz history
- [x] Kid Profile (Screen 8) — badges grid, mode toggle, settings
- [x] Full responsive pass — all kid pages

### Phase 3 — Parent Side 🔄 In Progress
- [x] ParentLayout — mobile bottom nav + desktop sidebar
- [x] Parent Dashboard (Screen 6)
- [x] Lessons & Guides page
- [x] Reports page
- [x] Parent Profile & Settings (Screen 8b)
- [x] Full responsive pass — all parent pages
- [ ] Teaching Guide (Screen 7) ← **next**

### Phase 4 — Auth ✅ Done
- [x] SignInPage — email/password + Google UI, Supabase wired
- [x] SignUpPage — role picker, grade selector, Supabase wired
- [x] AuthContext — session + profile + role exposed
- [x] ProtectedRoute — auth + role-based guard on all /kid/* and /parent/*
- [x] Routes `/login` and `/signup` added to App.jsx

### Phase 5 — Supabase Backend ✅ Schema done / 🔄 Integration pending
- [x] `supabase/schema.sql` — 8 tables, RLS policies, indexes, triggers
- [x] `supabase/seed.sql` — badges, Grade 4 topics, sample lesson
- [x] All service files written (`auth`, `lessons`, `progress`, `badges`, `family`, `admin`)
- [ ] Connect Supabase project → add `.env.local` with real keys
- [ ] Replace mock data in all pages with real service calls
- [ ] Test RLS policies end-to-end

### Phase 6 — QA & Launch ⬜ Not started
- [ ] End-to-end testing (kid + parent flows)
- [ ] Bug fixes
- [ ] Deploy frontend → Vercel
- [ ] Client review + content upload (JSON import)

---

## Design System

### Brand (Frazzl.kid)
- Logo: `Frazzl` in dark `#111827` + `.kid` in lime green `#16A34A`

### Kid Mode
- Navbar: `#16A34A` (lime green)
- Background: `#F0FDF4`
- Sidebar bg: `#DCFCE7`
- Active nav: `#EC4899` (hot pink)
- Topics: Orange `#F97316` / Blue `#3B82F6` / Pink `#EC4899` / Purple `#A855F7`

### Parent Mode
- Navbar: `#2D7A4F` (dark green)
- Background: `#F0FAF4`
- Sidebar bg: `#E8F7EE`
- Border accent: `#C8E6D4`

### Shared
- Font: Nunito (Google Fonts)
- Breakpoints: `sm` 640px / `md` 768px / `lg` 1024px
- Responsive pattern: `flex-col lg:flex-row` for two-column layouts
- Mobile nav: bottom bar (`md:hidden`) + desktop sidebar (`hidden md:flex`)
- Progress colors: green ≥50%, orange 20–49%, red <20%
- Score colors: green ≥80%, orange 60–79%, red <60%

---

## Shared Components

| Component | File | Used by |
|---|---|---|
| KidLayout | components/KidLayout.jsx | All `/kid/*` pages |
| ParentLayout | components/ParentLayout.jsx | All `/parent/*` pages |
| ProtectedRoute | components/ProtectedRoute.jsx | All authenticated routes in App.jsx |

---

## Badge Conditions

| Badge | Icon | Condition |
|---|---|---|
| Quick Learner | ⭐ | Complete 5 lessons |
| On Fire | 🔥 | 5-day streak |
| Accurate | 🎯 | Score 100% on a quiz |
| Rocket Start | 🚀 | Complete a full topic |
| Diamond | 💎 | 10-day streak |
| Champion | 🏆 | Complete full Grade 4 |

---

## Key Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-31 | Vite + React | Faster builds, modern tooling |
| 2026-05-31 | Tailwind CSS v4 | No config file, Vite plugin |
| 2026-05-31 | Nunito font | Kid-friendly, matches brand |
| 2026-05-31 | KidLayout + ParentLayout components | Avoid repeating navbar/sidebar per page |
| 2026-06-01 | Express backend dropped → Supabase only | Eliminates Railway/Render hosting, reduces to 2 services |
| 2026-06-01 | Supabase Auth replaces manual JWT | Built-in session, Google OAuth, RLS ties to auth.uid() |
| 2026-06-01 | `profiles` table auto-created via trigger | Keeps role/grade in sync with Supabase auth.users |
| 2026-06-01 | Rebranded MathMates → Frazzl.kid | Client decision |
| 2026-06-01 | Full responsive pass — all pages | Mobile-first delivery requirement |
| 2026-06-01 | Quiz state local (useState) | No backend needed to demo; will POST on lesson complete |

---

## Setup Checklist (for deployment)

- [ ] Create Supabase project at supabase.com
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Run `supabase/seed.sql` in SQL Editor
- [ ] Create `client/.env.local`:
  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=your-anon-key
  ```
- [ ] (Optional) Enable Google provider in Supabase Auth dashboard
- [ ] `cd client && npm install && npm run dev`
- [ ] Deploy to Vercel → add env vars in Vercel dashboard

---

## Progress Tracking Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Done
- ❌ Blocked
