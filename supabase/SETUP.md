# Supabase Setup — Frazzl.kid

Direct React → Supabase integration, protected by Row Level Security (RLS).

## 1. Create the project
1. Go to https://supabase.com → **New project**.
2. Pick a strong database password and a region close to your users.
3. Wait for it to finish provisioning.

## 2. Create the database
1. Open **SQL Editor** → **New query**.
2. Paste the contents of `schema.sql` and **Run**.
3. (Optional) Paste `seed.sql` and **Run** for starter content.

## 3. Get your API keys
**Project Settings → API**. Copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public** key → `VITE_SUPABASE_ANON_KEY`

> The anon key is safe in the browser — RLS controls what each user can read/write.

## 4. Configure the client
Create `client/.env.local` (not committed):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then restart the dev server: `npm run dev` (inside `client/`).

## 5. (Optional) Auth settings
- **Authentication → Providers → Email**: for instant testing, turn **off**
  "Confirm email" so signups log in immediately. Turn it back on for production.
- **Authentication → Providers → Google**: enable + add credentials to use the
  "Continue with Google" buttons.

## 6. Make yourself an admin (to import content from the app)
After signing up once, run in the SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Admins can use `src/services/admin.js → importContent()` to bulk-load topics,
lessons, and questions from JSON.

## How it scales
- **Indexes** on every foreign key and hot query path (`progress(user_id)`,
  `questions(lesson_id, sort_order)`, etc.).
- **One row per user per lesson** in `progress` (unique constraint) keeps the
  biggest table lean and upsert-friendly.
- **RLS** runs in the database, so security holds no matter how many clients hit it.
- Supabase manages connection pooling and read replicas as you grow.

## Service layer (where queries live)
| File | Responsibility |
|---|---|
| `src/services/supabaseClient.js` | Client singleton |
| `src/services/auth.js` | Signup, login, profile |
| `src/services/lessons.js` | Topics, lessons, questions |
| `src/services/progress.js` | Save / read progress |
| `src/services/badges.js` | Badge catalog + earned |
| `src/services/family.js` | Parent ↔ child links |
| `src/services/admin.js` | JSON content import |
