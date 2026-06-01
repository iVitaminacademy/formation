# MathMates — Update Log

All frontend changes are recorded here in chronological order.

---

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
