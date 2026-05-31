# MathMates — Project Tracker
**Kid & Parent Math Learning Platform | Grades 4 & 5**
Prepared by: Lahbabta Yousef | Started: May 2026

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express |
| Database | Supabase (hosted PostgreSQL) |
| Auth | JWT — role-based (kid / parent) |
| Hosting (frontend) | Vercel |
| Hosting (backend) | Railway or Render |
| Content | Admin JSON import (client uploads once) |

---

## Folder Structure

```
MathProject/
├── client/                              ← React (Vite) ✅ initialized
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx          ✅ Done
│   │   │   ├── ParentDashboard.jsx      ✅ Done
│   │   │   ├── ParentLessons.jsx        ✅ Done
│   │   │   ├── ParentReports.jsx        ✅ Done
│   │   │   ├── ParentProfile.jsx        ✅ Done
│   │   │   ├── ParentTeachingGuide.jsx  ⬜ Not started
│   │   │   ├── KidDashboard.jsx         ✅ Done
│   │   │   ├── KidLessons.jsx           ✅ Done
│   │   │   ├── KidQuiz.jsx              ✅ Done
│   │   │   ├── KidProgress.jsx          ✅ Done
│   │   │   ├── KidProfile.jsx           ✅ Done
│   │   │   ├── Login.jsx                ⬜ Not started
│   │   │   └── Register.jsx             ⬜ Not started
│   │   ├── components/
│   │   │   ├── ParentLayout.jsx         ✅ Done
│   │   │   └── KidLayout.jsx            ✅ Done
│   │   ├── context/                     ⬜ Not started
│   │   ├── hooks/                       ⬜ Not started
│   │   └── services/                    ⬜ Not started
│   ├── index.html                       ✅ Updated
│   ├── index.css                        ✅ Updated
│   ├── vite.config.js                   ✅ Updated
│   └── package.json
├── server/                              ⬜ Not started
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   └── package.json
├── PROJECT.md
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

---

## Routes (client)

| Path | Component | Status |
|---|---|---|
| `/` | LandingPage | ✅ Done |
| `/parent/dashboard` | ParentDashboard | ✅ Done |
| `/parent/lessons` | ParentLessons | ✅ Done |
| `/parent/reports` | ParentReports | ✅ Done |
| `/parent/profile` | ParentProfile | ✅ Done |
| `/parent/teaching-guide/:lessonId` | ParentTeachingGuide | ⬜ Not started |
| `/kid/dashboard` | KidDashboard | ✅ Done |
| `/kid/lessons` | KidLessons | ✅ Done |
| `/kid/quiz/:id` | KidQuiz | ✅ Done |
| `/kid/progress` | KidProgress | ✅ Done |
| `/kid/profile` | KidProfile | ✅ Done |
| `/login` | Login | ⬜ Not started |
| `/register` | Register | ⬜ Not started |

---

## Database Entities (Supabase / PostgreSQL)

| Table | Key Fields |
|---|---|
| users | id, name, email, password_hash, role, grade, avatar |
| parent_child | parent_id, child_id |
| topics | id, name, grade, icon, order |
| lessons | id, topic_id, title, content_text, order, unlock_after_id |
| questions | id, lesson_id, question_text, options (JSON), correct_answer, hint, explanation, teaching_steps (JSON) |
| progress | id, user_id, lesson_id, completed, score, attempts, last_date |
| badges | id, name, icon, condition_type, condition_value |
| user_badges | user_id, badge_id, earned_at |

---

## API Endpoints

| Method | Route | Purpose |
|---|---|---|
| POST | /auth/register | Create kid or parent account |
| POST | /auth/login | Login → returns JWT |
| GET | /lessons?grade=4 | Fetch all lessons for a grade |
| GET | /lessons/:id/questions | Fetch questions for a lesson |
| POST | /progress | Save completed lesson + score |
| GET | /progress/:childId | Full progress report for a child |
| GET | /badges/:userId | Earned and unearned badges |
| POST | /admin/import | Upload lesson/question JSON (client content) |

---

## Screens

| # | Screen | Mode | File | Status |
|---|---|---|---|---|
| 1 | Mode Selection & Login (Landing) | Public | LandingPage.jsx | ✅ Done |
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
| — | Login | Public | Login.jsx | ⬜ Not started |
| — | Register | Public | Register.jsx | ⬜ Not started |

---

## Project Phases

### Phase 1 — Foundation ✅ Done
- [x] Init `/client` (Vite + React)
- [x] Install Tailwind CSS v4 + React Router
- [x] Landing page (Screen 1)
- [x] Design system: color tokens, Nunito font, shared layouts

### Phase 2 — Kid Side ✅ Done
- [x] KidLayout — shared purple navbar + sidebar
- [x] Kid Dashboard (Screen 2)
- [x] Lessons Page (Screen 3) — sequential unlock, status badges, grade switcher
- [x] Quiz / Practice Screen (Screen 4) — hint, feedback, progress dots, score page
- [x] Progress Page (Screen 5) — stats, topic bars, quiz history
- [x] Kid Profile (Screen 8) — badges grid, mode toggle, settings
- [ ] Backend: lessons API, progress API, badge logic
- [ ] Streak counter logic
- [ ] Sequential lesson unlock logic

### Phase 3 — Parent Side 🔄 In Progress
- [x] ParentLayout — shared green navbar + sidebar
- [x] Parent Dashboard (Screen 6)
- [x] Lessons & Guides page
- [x] Reports page
- [x] Parent Profile & Settings (Screen 8b)
- [ ] Teaching Guide (Screen 7) ← next
- [ ] Content loader: JSON import

### Phase 4 — Auth 🔄 Pending
- [ ] Login page
- [ ] Register page (kid + parent flows)
- [ ] JWT auth context
- [ ] Protected routes

### Phase 5 — Backend ⬜ Not started
- [ ] Express server setup
- [ ] Supabase schema + seed data
- [ ] All API endpoints
- [ ] Replace mock data with real API calls

### Phase 6 — QA & Launch ⬜ Not started
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] Deploy frontend → Vercel
- [ ] Deploy backend → Railway/Render
- [ ] Client review

---

## Design System

### Kid Mode (Purple)
- Primary: `#6B3FA0`
- Background: `#F5F0FF`
- Sidebar bg: `#EDE4FF`
- Border accent: `#D4B8F0`

### Parent Mode (Green)
- Primary: `#2D7A4F`
- Background: `#F0FAF4`
- Sidebar bg: `#E8F7EE`
- Border accent: `#C8E6D4`

### Shared
- Font: Nunito (Google Fonts)
- Layout: sticky navbar + sidebar (w-48/w-52) + scrollable main
- Progress colors: green ≥50%, orange 20–49%, red <20%
- Score colors: green ≥80%, orange 60–79%, red <60%

---

## Shared Components

| Component | File | Used by |
|---|---|---|
| KidLayout | components/KidLayout.jsx | KidDashboard, KidLessons, KidQuiz, KidProgress, KidProfile |
| ParentLayout | components/ParentLayout.jsx | ParentDashboard, ParentLessons, ParentReports, ParentProfile |

---

## Quiz Logic (KidQuiz.jsx)

- State: `current`, `selected`, `showHint`, `answered`, `quizDone`
- On select: immediately highlights answer + saves to `answered` map
- Correct → green feedback + explanation shown
- Wrong → red on selected, green on correct + explanation shown
- Progress dots: purple = current, green = correct, red = wrong
- After last question → ScorePage with stars (3=90%+, 2=70%+, 1=below)
- Retry resets all state

## Badge Conditions

| Badge | Icon | Condition | Mock state |
|---|---|---|---|
| Quick Learner | ⭐ | Complete 5 lessons | ✅ Earned |
| On Fire | 🔥 | 5-day streak | ✅ Earned |
| Accurate | 🎯 | Score 100% on a quiz | ✅ Earned |
| Rocket Start | 🚀 | Complete a full topic | 🔒 Locked |
| Diamond | 💎 | 10-day streak | 🔒 Locked |
| Champion | 🏆 | Complete full Grade 4 | 🔒 Locked |

---

## Key Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-05-31 | Supabase over raw PostgreSQL | Managed hosting, less infra |
| 2026-05-31 | Vite + React | Faster builds, modern tooling |
| 2026-05-31 | Tailwind CSS v4 | No config file, Vite plugin |
| 2026-05-31 | Nunito font | Kid-friendly, rounded, matches purple theme |
| 2026-05-31 | ParentLayout + KidLayout components | Avoid repeating navbar+sidebar per page |
| 2026-05-31 | Mock data on all frontend pages | Backend not started — swap to API in Phase 5 |
| 2026-05-31 | `/admin/import` endpoint added | Client provides content as JSON once |
| 2026-05-31 | Quiz state fully local (useState) | No backend needed to demo; will POST on submit |

---

## Progress Tracking Legend
- ⬜ Not started
- 🔄 In progress
- ✅ Done
- ❌ Blocked
