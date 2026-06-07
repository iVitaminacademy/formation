# MathMates — Update Log

All frontend changes are recorded here in chronological order.

---

## [2026-06-07] — Parent Answer Key modal + signup email field

### Changed
- `client/src/pages/ParentLessons.jsx` — the per-lesson **📖 Answer Key** button (formerly a dead "Teaching Guide" link to the unbuilt `/parent/teaching-guide/:id` route) now opens a `LessonAnswersModal`. The modal lists every question for the lesson with the **correct option highlighted**, plus each question's **hint** and **explanation**, and shows the child's **score** for that lesson in the header. Data comes from `curriculum.js` (`lesson.quiz`), no extra DB calls. Removed the unused `useNavigate` import.
- `client/src/pages/SignUpPage.jsx` — added a real **Email** input field. Previously the form auto-generated a fake address (`name+timestamp@frazzl.kid`), so users could never log in with their real email. Sign-up now uses the entered email directly and validates that it is present.

### Notes
- The Teaching Guide (Screen 7) is now considered done — implemented inline as the Answer Key modal rather than a separate `ParentTeachingGuide.jsx` page/route.
- Per-question kid answers are not stored (quiz state is local in `KidQuiz`), so the modal shows the correct answer key + lesson score, not the kid's individual selections.

### Validation
- `npm run build` passes successfully.

---

## [2026-06-06] — User-friendly error messages + network retry on sign-in pages

### Changed
- `client/src/pages/SignInPage.jsx` — added `friendlyError()` helper that maps raw Supabase error messages to human-readable text. Covers invalid credentials, network failures (including DNS/`ERR_NAME_NOT_RESOLVED`), email not confirmed, and rate limits. Replaced `err.message` fallback with `friendlyError(err)`.
- `client/src/pages/AdminLoginPage.jsx` — added `friendlyError()` with same patterns plus "already registered" case. Added `signInWithRetry()` helper that automatically retries sign-in up to 2 times on network errors (`failed to fetch`, `ERR_NAME_NOT_RESOLVED`) with a 1s/2s backoff. This handles intermittent DNS/connectivity issues that were causing raw "failed to fetch" errors.

### Validation
- `npm run build` passes successfully.

---

## [2026-06-06] — Parent calculator added

### Added
- `client/src/pages/ParentCalculator.jsx` — full calculator page for parents to help kids with math during quizzes. Features expression evaluation (handles +, −, ×, ÷, %, ±), history display, formatted output with thousand separators, backspace (⌫), clear (C), and a tips section. Styled to match parent mode colors.
- `client/src/App.jsx` — registered `/parent/calculator` route (protected, parent-only).
- `client/src/components/ParentLayout.jsx` — added "Calculator" nav item with 🧮 icon between Reports and Profile.

### Validation
- `npm run build` passes successfully.

---

## [2026-06-06] — Landing page redesign

### Changed
- `client/src/pages/LandingPage.jsx` — polished redesign with improved card section:
  - Logo: kept `/favicon.svg` at proper sizes (40px header, 80px hero) instead of the previous 128px blow-up
  - Background: changed from `#F0FDF4` to `#F4F6FA` (cool neutral slate)
  - Header: logo icon + "Frazzl.kid" text side by side with gap, mobile-responsive
  - ModeCard component: added decorative background circles, emoji glow effect, colored mode badges ("Kid Mode" / "Parent Mode"), 3 feature bullet lists per card with ✓ checkmarks, enhanced gradient illustration areas, improved hover lift animation, buttons with shadow transitions
  - Trust bar: emoji + colored text icons with better spacing
  - Footer: added with copyright line
  - Card titles changed to "I'm Learning" / "I'm Helping" with descriptive subtitles

### Validation
- `npm run build` passes successfully.

---

## [2026-06-06] — Admin dashboard change password

### Changed
- `client/src/pages/AdminDashboardPage.jsx` — added a "Change admin password" section in the right sidebar (above Database overview). The form has new password + confirm fields with client-side validation (both required, min 6 chars, must match) and calls the existing `changePassword()` from `services/auth.js` which uses `supabase.auth.updateUser()`. Success/error messages displayed inline; fields clear on success. Uses the same dark/light theme as the rest of the dashboard.

### Validation
- `npm run build` passes successfully.

---

## [2026-06-03] — Parent header avatar fix

### Changed
- `client/src/components/ParentLayout.jsx` — render authenticated user's avatar (`profile.avatar`) in the parent header so edits made on `/parent/profile` appear immediately after saving.

### Notes
- Mirrors `KidLayout.jsx` behavior which already reads `profile.avatar` from `AuthContext`.

---

## [2026-06-03] — Admin dashboard system added

### Changed
- `client/src/pages/AdminLoginPage.jsx` — added a dedicated admin-only login page for `admin@admin.com`, with Supabase auth + admin role checks and bootstrap fallback if the account is missing.
- `client/src/pages/AdminDashboardPage.jsx` — added the admin dashboard UI with KPIs, parent/child management, profile editing, progress editing, searchable parent-child cards, per-child unlink buttons, and persisted dark/light mode.
- `client/src/services/admin.js` — added admin data helpers for dashboard fetches, profile updates, progress updates, and parent-child linking/unlinking.
- `client/src/components/ProtectedRoute.jsx` — updated route guarding so admin users redirect to `/admin/dashboard`.
- `client/src/App.jsx` — registered `/admin/login` and `/admin/dashboard`.
- `supabase/full_setup.sql` — updated `user_progress` RLS policies to allow admin read/write access.

### Validation
- `npm run build` passes successfully after the admin updates.
- Remaining build output is the existing Vite chunk-size warning only.

---

## [2026-06-06] — Admin dashboard pagination added

### Changed
- `client/src/pages/AdminDashboardPage.jsx`
  - Parents with children section: paginated, 3 parents per page.
  - Independent students section: paginated, 5 students per page.
  - Relationship manager table: paginated, 5 rows per page.
  - Search resets pagination to page 1.

### Validation
- `npm run build` passes successfully.


## [2026-06-01] — Supabase Integration (Database + Auth)

**Decision:** Connect React directly to Supabase (no Express layer), protected by Row Level Security (RLS). Uses Supabase Auth instead of manual JWT.

### Added — database (`supabase/`)
- `supabase/schema.sql` — full PostgreSQL schema for all 8 entities (`profiles`, `parent_child`, `topics`, `lessons`, `questions`, `progress`, `badges`, `user_badges`). Built to scale: UUID keys, indexes on every FK + hot query path, enums, `updated_at` trigger, auto profile creation on signup (`handle_new_user`), and **RLS policies on every table**.
- `supabase/seed.sql` — starter badges, Grade 4 topics, sample lesson + question.

### Added — client
- Installed `@supabase/supabase-js`.
- `client/.env.example` — env var template (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- `src/services/supabaseClient.js` — singleton Supabase client.
- `src/services/auth.js` — signUp / signIn / Google OAuth / signOut / profile read+update.
- `src/services/lessons.js` — topics, lessons, questions queries.
- `src/services/progress.js` — upsert + read progress (one row per user/lesson).
- `src/services/badges.js` — catalog, earned, status, award.
- `src/services/family.js` — parent ↔ child linking + children list.
- `src/services/admin.js` — JSON bulk content import (`/admin/import` equivalent).
- `src/context/AuthContext.jsx` — session + profile provider, role exposed.
- `src/components/ProtectedRoute.jsx` — auth + role-based route guard.

### Changed
- `src/main.jsx` — wrapped app in `<AuthProvider>`.
- `src/App.jsx` — kid/parent routes wrapped in `<ProtectedRoute role=...>`.
- `src/pages/SignInPage.jsx` — real login, role-based redirect, error states, Google button wired.
- `src/pages/SignUpPage.jsx` — real signup with role + grade metadata, grade picker for kids, error/info states.
- `client/.gitignore` — ignore `.env*` except `.env.example`.

### Setup required (manual)
1. Create a Supabase project → run `supabase/schema.sql` then `supabase/seed.sql` in the SQL Editor.
2. Create `client/.env.local` with your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. (Optional) Enable Google provider in Supabase Auth for the Google buttons.

---

## [2026-06-01] — FAQ Page Created

**File:** `client/src/pages/FAQ.jsx`

### Changes
- Added a new FAQ page with questions and answers for Frazzl.kid, including general, subscription, and billing topics.
- Added the `/faq` route in `client/src/App.jsx`.
- Updated landing page navigation links to point to the new FAQ page.
- Added FAQ route documentation in `PROJECT.md`.

---

## [2026-06-01] — Landing Page Redesign

**File:** `client/src/pages/LandingPage.jsx`

### Changes
- Removed the `✨ Interactive Math Platform` badge that appeared above the hero title (not in the mockup)
- Nav links changed from `UPPERCASE + letter-spacing` to normal case (`About`, `How it works`, `FAQ`)
- Sign In button shape changed from pill (`rounded-full`) to rounded rectangle (`rounded-lg`)
- Logo `Math` color updated to dark navy `#1B1464` (was purple `#6B3FA0`)
- Page background updated from `#F6F0FF` to `#EDE8FF`
- Card illustration height increased from `150px` to `190px`
- Kid card: removed semi-transparent white circle behind emoji — plain large emoji only
- Parent card icon: emoji now placed inside a gray rounded-square box to match the system-style icon in the mockup
- Trust bar items: removed pill/card backgrounds — plain inline `icon + label` pairs only
- Layout max-width narrowed from `max-w-7xl` / `max-w-6xl` to `max-w-5xl` / `max-w-3xl`

---

## [2026-06-01] — Landing Page Layout Fix (Round 2)

**File:** `client/src/pages/LandingPage.jsx`

### Problem
Screenshot showed three issues:
1. `fun & simple` was wrapping onto two lines instead of one
2. Cards and header were not properly contained — Sign In button was clipping at wide viewports
3. Trust bar items were overlapping the bottom of the cards

### Changes
- Wrapped the entire page (header + main) in a single `mx-auto max-w-4xl` container so all elements are consistently constrained
- Added `whitespace-nowrap` to the `fun & simple` span — prevents mid-phrase line breaks
- Cards grid hardcoded to `grid-cols-2` (removed responsive `sm:` prefix) and constrained to `max-w-2xl`
- Parent card icon changed from `bg-gray-100` to `bg-white` with a subtle `box-shadow`
- Trust bar: increased top margin and used `gap-x-8 gap-y-2` for clean horizontal spacing

---

## [2026-06-01] — Sign In Page (New)

**File:** `client/src/pages/SignInPage.jsx` *(created)*

### Features
- Full-page lavender background (`#EDE8FF`) matching the landing page
- Three soft blurred gradient blobs as background decoration (purple, green, yellow)
- Centered white card with `rounded-3xl` and a purple drop-shadow
- MathMates logo + "Welcome back! 👋" heading
- Email field with envelope SVG icon and dynamic focus ring (purple)
- Password field with lock SVG icon + eye toggle (show/hide password)
- `Forgot password?` link aligned right of the password label
- `Remember me` checkbox with purple accent
- `Sign In →` CTA button with glow shadow (`#6B3FA0`)
- Divider + Google SSO button (UI only, no backend)
- Link to `/signup` (Sign Up page)
- Bottom hint strip showing "Sign in as: Kid • Parent"

---

## [2026-06-01] — Sign Up Page (New)

**File:** `client/src/pages/SignUpPage.jsx` *(created)*

### Features
- Same lavender + blob background as Sign In
- **Role selector**: two interactive cards ("I'm a Kid" / "I'm a Parent")
  - Selected card lifts with a drop-shadow, changes border + background
  - Drives the entire form's accent color (purple for Kid, green for Parent)
- Full Name, Email, Password fields with SVG icons and dynamic focus rings that adapt to selected role color
- **Password strength bar**: 3-segment animated bar (red → orange → green) with label (Weak / Fair / Strong)
- Terms & Privacy Policy checkbox
- CTA button label and color change with role: `🧒 Start Learning →` or `👨‍👧 Join as Parent →`
- Divider + Google SSO button (UI only)
- Link back to `/login` (Sign In page)

---

## [2026-06-01] — Kid Mode Full Color Overhaul (`/kid/*`)

**Files:** `KidLayout.jsx`, `KidDashboard.jsx`, `KidLessons.jsx`, `KidQuiz.jsx`, `KidProgress.jsx`, `KidProfile.jsx`

### Color role assignments across all kid pages
| Color      | Hex       | Used for                                                    |
|------------|-----------|-------------------------------------------------------------|
| Lime green | `#16A34A` | Navbar, active states, progress bars, "done", overall % stat |
| Orange     | `#F97316` | Dashboard banner, Multiplication topic, "start" badge        |
| Blue       | `#3B82F6` | Division topic, progress stat card                           |
| Hot pink   | `#EC4899` | Sidebar active nav item, Fractions topic, badges stat card   |
| Purple     | `#A855F7` | Geometry topic, current quiz progress dot                    |
| Red        | `#EF4444` | Wrong quiz answers, low-progress bars, streak display        |

### KidLayout.jsx
- Brand name: "MathMates Kid Mode" → "Frazzl.kid Kid Mode"
- Navbar background: purple `#6B3FA0` → lime green `#16A34A`
- Sidebar background: `#EDE4FF` → `#DCFCE7` (light lime)
- Sidebar border: `#D4B8F0` → `#86EFAC`
- Active nav item: purple → hot pink `#EC4899`
- Inactive nav hover: purple tint → lime green tint `#BBF7D0`
- Page background: `#F5F0FF` → `#F0FDF4`

### KidDashboard.jsx
- Welcome banner: purple gradient → orange gradient `#F97316 → #FB923C`
- Overall progress bar: purple → lime green gradient
- Grade button active: purple → lime green
- Each topic card gets its own color (orange / blue / hot pink / purple)
- Badges: each badge has its own color (orange / red / green)

### KidLessons.jsx
- Topic panel headers now use per-topic colors
- Grade toggle: purple → lime green
- "Start" status badge: purple → orange `#F97316`
- Lesson hover: purple tint → per-topic background color
- Lesson dot: start color → per-topic color

### KidQuiz.jsx
- Question card: purple tint → lime green tint `#F0FDF4`, border `#86EFAC`
- Hint button: purple → lime green
- Hint box: amber left border (unchanged — contextually correct)
- Progress dot (current): purple → purple `#A855F7` (kept — works as accent)
- Next / Try again button: purple → lime green
- Score: good = lime green, poor = red
- Right sidebar: active question highlight → lime green

### KidProgress.jsx
- Each stat card gets its own border color (lime / blue / orange / pink)
- Overall % value: purple → lime green
- Topic progress bars: now use per-topic colors
- Topic hover: purple tint → per-topic background
- Quiz score colors: green (≥80%) / orange (≥60%) / red (<60%)
- Recent quiz hover: purple tint → lime green tint

### KidProfile.jsx
- Avatar circle: purple bg/border → lime green
- Grade badge: purple → orange (fun, kid-appropriate)
- Streak color: amber → red (matches 🔥 icon)
- Parent mode toggle: purple → lime green
- All card borders: purple tint → lime green `#86EFAC`
- Settings hover: purple tint → lime green tint
- Each earned badge has its own color (orange star / red fire / green target)

---

## [2026-06-01] — Rebranding + Full Color Scheme Overhaul

**Files:** `client/src/pages/LandingPage.jsx`, `SignInPage.jsx`, `SignUpPage.jsx`

### Project rename
- "MathMates" → **"Frazzl.kid"** across all three pages
- Logo style: `Frazzl` in near-black `#111827` + `.kid` in lime green `#16A34A`

### New 6-color palette (replaces the purple-only scheme)
| Color     | Hex       | Used for                                      |
|-----------|-----------|-----------------------------------------------|
| Lime green | `#16A34A` | Brand primary, `.kid` logo, parent card/button, Sign In form accent |
| Orange    | `#F97316` | Kid mode card gradient & button               |
| Blue      | `#3B82F6` | Trust bar — "Progress tracking"               |
| Purple    | `#A855F7` | Header "Sign In" button                       |
| Hot pink  | `#EC4899` | Hero headline "fun & simple" accent           |
| Red / Orange | `#F97316` | Trust bar — "Badges & rewards"             |

### LandingPage.jsx
- Background changed from `#EDE8FF` (lavender) to `#F0FDF4` (light lime green — matches parent mode feel)
- Fixed syntax bug introduced by linter (duplicate JSX block + missing `return (` in ModeCard)
- Kid card: orange gradient `#FED7AA → #FB923C`, orange button `#F97316`
- Parent card: lime green gradient `#DCFCE7 → #86EFAC`, lime green button `#16A34A`
- Trust bar items each get a distinct color (lime, blue, hot pink, orange)

### SignInPage.jsx
- Logo updated to Frazzl.kid
- Accent color changed from purple `#6B3FA0` to lime green `#16A34A`
- Background: `#EDE8FF` → `#F0FDF4`
- Decorative blobs: lime green, orange, purple (replaces purple/green/yellow)
- Card shadow updated to lime green tint
- Bottom mode-hint strip: Kid in orange, Parent in lime green

### SignUpPage.jsx
- Logo updated to Frazzl.kid
- Kid role card: orange palette (`#F97316`, `#FFEDD5`, `#FB923C`)
- Parent role card: lime green palette (`#16A34A`, `#DCFCE7`, `#86EFAC`)
- Background: `#EDE8FF` → `#F0FDF4`
- Decorative blobs: lime green, orange, hot pink

---

## [2026-06-01] — Global CSS Reset Cleanup

**File:** `client/src/index.css`

### Problem
`* { margin: 0; padding: 0; }` appliqué sur tous les éléments était redondant et trop agressif :
- `@import "tailwindcss"` inclut déjà **Tailwind Preflight** qui remet à zéro les marges des éléments HTML standards
- Appliquer `margin: 0; padding: 0;` sur `*` écrasait aussi les espacements natifs des `<input>`, `<button>`, `<select>` — comportements potentiellement indésirables sur les formulaires

### Changes
- Supprimé `margin: 0;` et `padding: 0;` du sélecteur `*`
- Conservé uniquement `box-sizing: border-box` (étendu à `*::before` et `*::after` pour la cohérence)
- Tailwind Preflight gère désormais seul le reset des marges/paddings

---

## [2026-06-01] — Router Update

**File:** `client/src/App.jsx`

### Changes
- Imported `SignInPage` and `SignUpPage`
- Added public routes:
  - `/login` → `<SignInPage />`
  - `/signup` → `<SignUpPage />`

---

## [2026-06-02] — UI tweaks & How It Works page

### Changes
- `client/src/components/ParentLayout.jsx`: Replaced displayed brand `MathMates` with `Frazzl.kid` (Parent header).
- `client/src/pages/ParentDashboard.jsx`: Use authenticated `profile.name` (via `useAuth()`) for the displayed child/parent name; fallback to sample data when profile is not available.
- `client/src/pages/HowItWorks.jsx`: Added new standalone page to host the "How it works" content previously anchored from the landing page.
- `client/src/pages/LandingPage.jsx`: Updated the top navigation `How it works` link to navigate to `/how` instead of an anchor.
- `client/src/App.jsx`: Added `/how` route and imported `HowItWorks` page.

These edits were made to improve branding consistency and move longer informational content into a dedicated route for easier linking and sharing.

---

## [2026-06-02] — Parent Notifications (DB-backed)

### Added
- `supabase/create_notifications.sql` — SQL migration that creates the `notifications` table, row-level security policies, and the `notify_parents_for_progress()` RPC used to generate parent alerts when a child completes or updates lesson progress.

### Changed
- `client/src/services/progress.js` — after successfully upserting a `user_progress` row, the client now calls the `notify_parents_for_progress()` RPC so notifications are recorded server-side for linked parents.
- `client/src/pages/ParentProfile.jsx` — the Profile page now reads persistent notifications from the `notifications` table and subscribes to real-time inserts so parents see updates instantly. A local `Mark all read` last-seen cursor is used for quick unread UI.

### [2026-06-03] — Parent notifications UI refinements

### Changed
- `client/src/pages/ParentProfile.jsx` — notifications are now filtered by the selected child, only unread rows (`read = false`) are shown in the Recent Activity list, and read rows disappear after **Mark all read**.
- `client/src/pages/ParentProfile.jsx` — the Notifications menu item now displays an unread-count badge based on the selected child’s unread notification rows.
- `client/src/pages/ParentProfile.jsx` — the bell/icon badge was tightened so the unread count is visible directly on the Notifications icon.

### Result
- Parent notifications stay child-specific.
- The unread count matches `read = false` rows for the active child.
- Marking notifications as read clears them from the UI.

### Setup required (manual)
1. Run `supabase/create_notifications.sql` in the Supabase SQL Editor (re-run is safe).
2. The RPC is granted to the `authenticated` role; no further RLS changes should be required if you already ran `supabase/full_setup.sql`.

### Fix (2026-06-02, later) — realtime + read state
- **Root cause of "realtime not firing":** the new `notifications` table was not part of the `supabase_realtime` publication, so `postgres_changes` INSERT events never reached the parent. `create_notifications.sql` now adds the table to the publication (guarded `DO` block, safe to re-run). **You must re-run the migration** for live updates.
- `ParentProfile.jsx` — unread detection now uses the DB `read` flag (survives reloads / works cross-device), falling back to the local last-seen cursor only when `read` is unknown. Added an **unread count badge** in the Recent Activity header and disabled **Mark all read** when there's nothing unread.


## [2026-06-02] — Kid Sign Out

### Changes
- `client/src/components/KidLayout.jsx`: Added a `Sign Out` button in the top navbar for signed-in kids. The button calls `signOut()` from `AuthContext` and redirects to `/` on completion.

This ensures kids can log out from any `/kid/*` page.

---

## [2026-06-02] — Kid pages: show connected username

### Changes
- `client/src/pages/KidDashboard.jsx`: Greeting now uses the authenticated `profile.name` from `AuthContext` (falls back to sample `Emma`).
- `client/src/pages/KidProfile.jsx`: Profile header and avatar now read from `profile` when available; the Log Out button now calls `signOut()` and redirects to `/`.

These changes ensure the UI displays the currently signed-in kid's name and performs a proper sign-out.

---

## [2026-06-02] — Lessons content (local demo)

### Added
- `client/src/content/lessonsContent.js` — a local mapping of lesson IDs → quiz content used for quick demos (Grade 4 and Grade 5 example content).

### Changed
- `client/src/pages/KidLessons.jsx` — lessons entries now include `contentId` fields so lesson cards open the matching demo content when available.
- `client/src/pages/KidQuiz.jsx` — quiz now reads the route param (`/kid/quiz/:id`) and loads content from `lessonsContent.js` when a matching id is found (falls back to existing sample quiz otherwise).

Notes: This is an in-memory demo import so content appears immediately without needing to seed Supabase. For persistent storage, we can migrate these entries into `supabase/seed.sql` or use `src/services/admin.js` to bulk-import.

---

## [2026-06-02] — Per-user lesson status

### Changed
- `client/src/pages/KidLessons.jsx` — lessons now read the signed-in kid's progress via `getProgressMap(userId)` and display each lesson as `start` by default; lessons with a completed progress row are shown as `done`.

This makes lesson status specific to each kid profile. Progress is read from Supabase `progress` table; if you prefer a local demo-only mode, the existing in-memory `curriculum` entries remain usable.

---

## [2026-06-02] — Persist quiz completion

### Changed
- `client/src/pages/KidQuiz.jsx` — when a kid finishes a quiz the app now calls `saveProgress({ userId, lessonId, score, completed: true })` to persist the result to the Supabase `progress` table so lesson status updates for that profile.

Notes: If you want to record attempts (and not mark completed unless score ≥ X), we can adjust the logic (for example mark completed only for score ≥ 60%).

---

## [2026-06-02] — Immediate UI update when progress saved

### Changed
- `client/src/pages/KidQuiz.jsx` — dispatches a `progressUpdated` CustomEvent after successfully saving a progress row so other pages (like `KidLessons.jsx`) can update immediately.
- `client/src/pages/KidLessons.jsx` — listens for the `progressUpdated` event and updates the local `progressMap` for the lesson id provided in the event detail.

This ensures the lessons list reflects newly completed lessons immediately, without waiting for a full refresh.

---

## [2026-06-02] — Demo lesson DB mapping & local fallback

### Changed
- `client/src/services/lessons.js` — added `findLessonByTitle(title)` helper to look up a DB lesson UUID by title.
- `client/src/pages/KidQuiz.jsx` — when saving progress the app now attempts to map the local lesson title to a DB lesson and save using the DB lesson UUID; if no DB lesson is found the progress is saved to `localStorage` so demo lessons still appear completed for the signed-in kid.
- `client/src/pages/KidLessons.jsx` — merges any `localStorage` demo progress into the loaded progress map so demo lessons display as completed even if not seeded in Supabase.

This change keeps demo mode working while enabling persistence when lessons exist in the Supabase DB. If you want automatic creation of missing DB lessons, I can add that next (requires admin privileges or relaxed RLS policies).

---

## [2026-06-02] — Debugging: progress save/load

### Changed
- `client/src/services/progress.js` — `getProgressMap()` now normalizes `lesson_id` keys to numbers to avoid string/number mismatches when comparing with in-memory lesson ids.
- `client/src/pages/KidQuiz.jsx` — added a console log after successful `saveProgress()` to confirm the returned row.
- `client/src/pages/KidLessons.jsx` — added a console log after loading the progress map to show what the client received from Supabase.

These logs will help confirm whether progress rows are being saved and later read by the lessons page. After verifying, we can remove the logs.

---

## [2026-06-02] — How to seed demo lessons into Supabase

To persist the in-memory demo lessons into your Supabase project so progress saves to the DB, run the provided SQL seed:

- File: `supabase/seed_demo_lessons.sql` — idempotent SQL that inserts topics, lessons, and questions used by the demo content.

Run options:
- In the Supabase dashboard → SQL Editor: paste the contents of `supabase/seed_demo_lessons.sql` and execute.
- Or run locally (requires DB credentials):

```powershell
# from repo root
cd supabase
# set PGHOST/PGPORT/PGDATABASE/PGUSER/PGPASSWORD to point at your Supabase DB
node apply.mjs
```

Notes:
- The app's Row Level Security (RLS) policy restricts creating topics/lessons to admin users. If you run the SQL from the Supabase SQL Editor when signed in as a project admin the inserts will succeed. Alternatively set your profile role to `admin` in the DB for testing:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

After seeding, demo lesson progress will persist to the DB and `KidQuiz` will upsert progress rows normally.

 
---

## [2026-06-02] — Real Curriculum Content Loaded

**Files:** `src/data/curriculum.js` *(created)*, `KidLessons.jsx`, `KidQuiz.jsx`

### Added
- `src/data/curriculum.js` — single source of truth for all Grade 4 & 5 questions
  - Grade 4: 4 topics, 9 lessons, 29 questions (all with hint + explanation)
  - Grade 5: 4 topics, 8 lessons, 25 questions
  - `getQuizByLessonId(id)` helper — flat lookup by numeric lesson ID
- Topics covered (Grade 4): Place Value & Basic Math, Primes & Multi-digit Ops, Fractions, Geometry/Data/Finance
- Topics covered (Grade 5): Decimal Ops, Fraction Ops, Division & Algebra, Data/Patterns/Finance

### Changed
- `KidLessons.jsx` — imports from `curriculum.js` instead of hardcoded local array
- `KidQuiz.jsx` — imports `getQuizByLessonId` from `curriculum.js`, removed old `lessonsContent` dependency

---

## [2026-06-02] — Progress Persistence Fixed (Offline + Online)

**Files:** `src/services/progress.js`, `KidLessons.jsx`, `KidQuiz.jsx`

### Problem
1. `getProgressMap` threw when Supabase wasn't configured — no fallback
2. `saveProgress` did nothing if `user?.id` was undefined (not logged in)
3. KidLessons sequential unlock logic was broken — mapped ALL lessons to 'done' or 'start', never 'locked'
4. Score on ScorePage could be off-by-one (last answer not yet in state)

### Changes — `progress.js`
- **Dual-mode save**: always writes to `localStorage` first (key: `progress_${userId||'demo'}`), then also writes to Supabase if configured + userId is available
- **Dual-mode read**: `getProgressMap` merges localStorage + Supabase (if configured). Never throws — graceful offline fallback
- Removed dependency on `lessonsContent` (old title-matching hack)

### Changes — `KidLessons.jsx`
- **Sequential unlock logic**: for each lesson:
  - `completed in progressMap` → `'done'`
  - First lesson OR previous lesson done → `'start'` (unlocked)
  - Otherwise → `'locked'`
- Listens for `progressUpdated` custom event — unlocks next lesson immediately after quiz completes (no page reload needed)

### Changes — `KidQuiz.jsx`
- Removed complex DB lookup chain (`findLessonByTitle`, `findLessonByQuestionText`, `createLessonWithQuestions`)
- `handleNext` now calls `saveProgress({ userId: user?.id || 'demo', lessonId, score, completed: true })` — one line, always works
- Fixed score calculation — `finalScore` now computed from full `answered` map, not mid-state
- Dispatches `progressUpdated` event after save so KidLessons updates instantly

---

## [2026-06-02] — Progress DB Persistence Fix (FK Migration)

**Files:** `supabase/migration_progress_text_id.sql` *(new)*, `src/services/progress.js`

### Root cause
The `progress` table schema defined `lesson_id` as `uuid NOT NULL REFERENCES public.lessons(id)`.
Our curriculum uses local numeric IDs (101, 102…) which are not UUIDs and have no matching row in
the `lessons` table. Every `saveProgress` call threw a FK violation → caught silently → localStorage
only → progress lost on next login.

Supabase WAS configured (`.env.local` present with real keys), but saves never reached the DB.

### Fix — SQL migration (run ONCE in Supabase SQL Editor)

File: `supabase/migration_progress_text_id.sql`

```sql
ALTER TABLE public.progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_key;
ALTER TABLE public.progress DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey;
ALTER TABLE public.progress ALTER COLUMN lesson_id TYPE TEXT USING lesson_id::TEXT;
ALTER TABLE public.progress ADD CONSTRAINT progress_user_lesson_unique UNIQUE (user_id, lesson_id);
```

After this migration `lesson_id` is TEXT — stores '101', '102' etc. directly. No lessons table rows needed.

### Fix — `progress.js` rewrite

- `saveProgress`: stores `lesson_id` as TEXT string, writes localStorage first (instant UI), then upserts to Supabase
- `getProgressMap`: loads localStorage first (offline fallback), then merges Supabase rows on top (authoritative)
  — returns map keyed by NUMBER so `progressMap[lesson.id]` works directly in KidLessons
- Both functions check `isSupabaseConfigured && userId !== 'demo'` before touching Supabase
- Supabase data synced back to localStorage after each fetch so next offline visit has fresh data

### Setup step required
Run `supabase/migration_progress_text_id.sql` in the Supabase SQL Editor once, then progress
will persist to the DB on every quiz completion and reload correctly on re-login.

---

## [2026-06-02] — user_progress Table (Final DB Fix)

**Files:** `supabase/full_setup.sql` *(new)*, `supabase/create_user_progress.sql` *(new)*, `src/services/progress.js`

### Problem
The original `progress` table had `lesson_id uuid FK → lessons`. Local numeric IDs (101, 102…) caused FK violations silently — progress never reached the DB.

### Fix
- Created `supabase/full_setup.sql` — single file containing ALL 9 tables + RLS + triggers. Paste once in Supabase SQL Editor to set up the entire schema.
- Created `user_progress` table: `lesson_ref TEXT` (no FK), `score`, `completed`, `attempts`, `last_date`, unique on `(user_id, lesson_ref)`
- `progress.js` rewritten to target `user_progress` instead of `progress`

---

## [2026-06-02] — KidDashboard — Real Data from DB

**File:** `src/pages/KidDashboard.jsx`

### Changes
- Name + grade pulled from `profiles` table via `useAuth()`
- Overall % calculated live from `user_progress` (completed lessons ÷ total lessons)
- Per-topic progress bars calculated from `curriculum.js` + `user_progress`
- Badges computed from real data: Quick Learner (≥5 done), On Fire (streak ≥5), Accurate (100% score)
- Grade 4/5 switcher actually changes topic view
- Skeleton loading state while fetching
- Listens for `progressUpdated` event — updates instantly after quiz without page reload
- Shows "No badges yet" empty state instead of always showing hardcoded badges

---

## [2026-06-02] — KidProgress — Real Data from DB

**File:** `src/pages/KidProgress.jsx`

### Changes
- All 4 stat cards use live data: overall %, lessons completed, streak from `profiles.streak_days`, badge count
- Topic breakdown bars calculated from `user_progress` + `curriculum.js`
- Recent quizzes list built from completed lessons sorted by `last_date` desc (max 6 shown)
- Quiz dates shown as relative ("Today", "Yesterday", "3 days ago") from real `last_date`
- Quiz scores shown as real `score/total` from DB
- 🏅 medal shown for any quiz with 100% score
- Empty state shown when no quizzes completed yet
- Skeleton loading state while fetching
- Listens for both `progressUpdated` and `streakUpdated` events

---

## [2026-06-02] — Streak Tracking

**Files:** `src/services/progress.js`, `supabase/add_streak_column.sql` *(new)*

### Added
- `supabase/add_streak_column.sql` — adds `last_quiz_date timestamptz` column to `profiles` table
- `updateStreak(userId)` function in `progress.js`:
  - Reads `profiles.streak_days` + `profiles.last_quiz_date`
  - If last quiz was today → no change
  - If last quiz was yesterday → `streak_days + 1`
  - If gap > 1 day → reset to 1
  - Writes back to `profiles` and dispatches `streakUpdated` event
- `saveProgress` now calls `updateStreak` after every successful DB save
- `KidProgress` listens for `streakUpdated` → calls `refreshProfile()` so streak shows immediately

### SQL required
```sql
alter table public.profiles add column if not exists last_quiz_date timestamptz;
```

---

## [2026-06-02] — Responsive pass finalized + deploy note

**Files:** `client/src/components/KidLayout.jsx`, `ParentLayout.jsx`, `client/src/pages/KidProfile.jsx`, `ParentProfile.jsx`

### Verified responsive (already in code)
- `KidLayout` / `ParentLayout`: desktop sidebar (`hidden md:flex`) + mobile bottom tab bar (`md:hidden fixed bottom-0`); fluid navbar padding (`px-4 sm:px-8`); content `pb-24 md:pb-7` to clear the bottom bar; navbar labels hidden on small screens.
- Stat rows use `grid grid-cols-2 md:grid-cols-4/5`; two-column layouts use `flex-col lg:flex-row` with right panels `w-full lg:w-72/80`; `KidQuiz` tracker is `hidden lg:block`; `LandingPage` mode cards `grid-cols-1 sm:grid-cols-2`.

### Changed
- `KidProfile.jsx` + `ParentProfile.jsx` — badge grids changed from fixed `grid-cols-3` to `grid-cols-2 sm:grid-cols-3` so badge cards aren't cramped on small phones.

### Deploy note (action required)
- The responsive/advanced work is **uncommitted** on the `dev` branch; Vercel production builds from `main`, so the live site is stale. Commit the working tree and get it onto `main` (or point Vercel's production branch at `dev`) to make the live site responsive.

---

## [2026-06-02] — KidProfile — Real Data from DB

**File:** `src/pages/KidProfile.jsx`

### Problem
The page rendered a hardcoded user (`Emma Johnson`) and a static badge list — none of it reflected the signed-in kid or their real progress.

### Changes
- Header now reads `profile.name`, `profile.grade`, `profile.avatar`, and `profile.streak_days` from `AuthContext` (real signed-in kid).
- Loads `getProgressMap(user.id)` and computes **badges live from DB progress** via a `BADGE_DEFS` catalog with per-badge `check(stats)`:
  - ⭐ Quick Learner — ≥5 lessons completed
  - 🔥 On Fire — streak ≥ 5
  - 🎯 Accurate — any lesson scored 100%
  - 🚀 Rocket Start — any topic fully completed
  - 💎 Diamond — streak ≥ 10
  - 🏆 Champion — entire active grade completed
- `computeStats()` derives `doneCount`, `perfectAny`, `fullTopicAny`, `gradeComplete` from `curriculum[grade]` + `progressMap` (same logic family as `KidDashboard`/`KidProgress`).
- Earned/locked styling driven by computed `earned` flag (locked badges greyed via `LOCKED` palette + grayscale).
- Added loading skeleton for the badge grid.
- Live refresh: listens for `progressUpdated` (re-fetch progress) and `streakUpdated` (re-read profile) so badges update instantly after a quiz.
- Wired the **Help & FAQ** settings row to navigate to `/faq` (was a dead button).

---

## [2026-06-02] — KidProfile — Edit Profile (working)

**File:** `src/pages/KidProfile.jsx`

### Problem
The **Edit Profile** settings row did nothing when clicked.

### Changes
- Added an **Edit Profile modal** opened from the settings row.
- Lets the kid change their **name** (text input) and **avatar** (12-emoji picker grid with live preview).
- Saves via `updateProfile(user.id, { name, avatar })` (from `services/auth.js`) to the Supabase `profiles` table, then calls `refreshProfile()` so the header/avatar update immediately.
- Validation (name required), inline error message, `Saving…` state, click-outside / Cancel to dismiss.

---

## [2026-06-02] — Avatar shown everywhere (header + dashboard)

**Files:** `src/components/KidLayout.jsx`, `src/pages/KidDashboard.jsx`

### Problem
After changing the avatar in Edit Profile, the new emoji only showed on the Profile card — the top navbar and the Dashboard welcome banner still displayed a hardcoded 🧒.

### Changes
- `KidLayout.jsx` — navbar avatar now reads `profile.avatar` (falls back to 🧒); the header streak badge now reads real `profile.streak_days` (was hardcoded `5`).
- `KidDashboard.jsx` — welcome banner emoji now reads `profile.avatar`.
- Since both read from `AuthContext` and Edit Profile calls `refreshProfile()`, the avatar/streak update everywhere immediately after saving.

---

## [2026-06-02] — Parent ↔ Child linking via kid link code

**Files:** `supabase/link_child_code.sql` (new), `src/services/family.js`, `src/pages/KidProfile.jsx`, `src/pages/ParentProfile.jsx`

### Approach
Each kid gets a short unique **link code** (e.g. `AB3K7Q`). The parent types it on their profile to link. Linking runs through a `SECURITY DEFINER` RPC so RLS doesn't have to expose other profiles to the parent.

### DB (`supabase/link_child_code.sql` — run once in SQL editor)
- `profiles.link_code text unique` column.
- `gen_link_code()` — generates a 6-char code from an unambiguous alphabet (no I/L/O/0/1).
- Backfills existing kids + `trg_profiles_link_code` BEFORE INSERT trigger auto-assigns a code to every new kid.
- `link_child_by_code(p_code)` RPC — finds the kid by code, blocks self-link, inserts into `parent_child` (parent = `auth.uid()`), returns child id/name/grade/avatar. Granted to `authenticated`.
- New RLS policy `user_progress_select_own_or_child` so a parent can READ a linked child's progress (the old `user_progress_all_own` was own-rows only).

### Client
- `family.js` — added `linkChildByCode(code)` calling the RPC.
- `KidProfile.jsx` — shows the kid's link code with a Copy button ("share with your parent").
- `ParentProfile.jsx` — now fully real:
  - Loads linked children via `getChildren()`; shows list with avatar/grade/streak.
  - "Add a child by code" form → `linkChildByCode()`, with inline errors + auto-select the newly linked child.
  - Per-child **Unlink** button.
  - Child selector (click a child) drives the badges panel, which is computed from that child's **real DB progress** (same `BADGE_DEFS`/`computeStats` logic as the kid pages).
  - Removed hardcoded `Emma Johnson` / fake badges.

### Action required
Run `supabase/link_child_code.sql` in the Supabase SQL editor before testing.

---

## [2026-06-02] — Link-code migration folded into full_setup.sql + per-child progress summary

**Files:** `supabase/full_setup.sql`, `supabase/apply.mjs`, `src/pages/ParentProfile.jsx`

### DB
- The kid `link_code` feature is now part of `full_setup.sql` (single re-runnable file): columns, `gen_link_code()`, auto-assign trigger, backfill, `link_child_by_code()` RPC, and the parent-read `user_progress` policy.
- **Key fix:** added explicit `alter table ... add column if not exists` for `avatar`, `streak_days`, `last_quiz_date`, `link_code`. `CREATE TABLE IF NOT EXISTS` is skipped when the table already exists, so the new `link_code` column was never being created on existing databases — this is why the kid's code card didn't appear. The ALTERs upgrade existing tables.
- `apply.mjs` now also runs `add_streak_column.sql` and `link_child_code.sql`.

### Client
- `ParentProfile.jsx` — added a **per-child progress summary** (Overall %, Lessons done `x/total`, Day streak) above the badges, computed from the selected child's real `user_progress`. `computeStats` now also returns `total` + `overall`. Empty-state message when no child is selected.

---

## [2026-06-02] — ParentLessons wired to real data

**File:** `src/pages/ParentLessons.jsx`

### Problem
The page used a hardcoded `topics` array with fake lessons and `done` flags.

### Changes
- Topics & lessons now come from `curriculum[grade]` (real content shared with the kid pages).
- Completion (lesson ✓ + topic %) is computed from the **linked child's** real `user_progress` via `getChildren()` → `getProgressMap(childId)`.
- **Grade 4 / 5 switcher** is now functional (defaults to the active child's grade).
- **Child selector** dropdown appears when more than one child is linked; switching updates all completion.
- Added loading skeletons, an empty-state when no child is linked (still shows lesson content), and a "no lessons for this grade" fallback.
- Teaching Guide button still routes to `/parent/teaching-guide/:lessonId` (page not built yet).

---

## [2026-06-02] — ParentReports wired to real data

**File:** `src/pages/ParentReports.jsx`

### Problem
Hardcoded `stats`, `topics`, and `quizHistory` (fake "Emma Johnson" report).

### Changes
- `computeReport(progressMap, grade)` derives everything from the linked child's real `user_progress` + `curriculum`:
  - Summary: Overall %, Lessons completed `x/total`, Avg quiz score, Quizzes taken, Day streak (from `profiles.streak_days`).
  - Topic breakdown: per-topic %, lessons done, quizzes count, avg score.
  - Recent Quizzes: completed lessons sorted by `last_date` (top 8), with relative dates.
- **Weak Area Alerts** now data-driven: a topic is flagged when its avg score < 70% or it's started but < 40% complete (no longer flags untouched topics).
- Added **child selector** (when >1 linked), **Export PDF** via `window.print()`, plus loading/empty states (no child linked, no lessons, no quizzes).

---

## [2026-06-02] — ParentDashboard wired to real data

**File:** `src/pages/ParentDashboard.jsx`

### Problem
Hardcoded `child` + `topics` (fake "Emma Johnson").

### Changes
- `computeDashboard(progressMap, grade)` builds stat cards (Overall %, Lessons done, 🔥 Day streak, Weak topics) and the topic breakdown from the linked child's real `user_progress` + `curriculum`.
- Child card shows the child's real avatar/name/grade and a **"Active …" label derived from the latest `last_date`** in their progress.
- **Parent Suggestion** now targets the child's actual weakest started topic (lowest %).
- Added **child selector** (when >1 linked) and an empty-state when no child is linked.
- With this, all four parent pages (Dashboard, Lessons, Reports, Profile) run on real DB data.
