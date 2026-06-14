-- =============================================================
-- Ivitaminacademy — FULL DATABASE SETUP
-- Paste this entire file into Supabase SQL Editor and click Run.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE / DROP IF EXISTS.
-- =============================================================


-- =============================================================
-- 0. CLEANUP — remove every legacy object from previous versions.
--    Prevents old expiry triggers from ever running again.
-- =============================================================
drop trigger  if exists trg_prevent_status_escalation on public.profiles;
drop function if exists public.prevent_status_escalation()   cascade;
drop function if exists public.validate_medecin(uuid)        cascade;
drop function if exists public.renew_medecin_access(uuid)    cascade;
drop function if exists public.record_first_login(uuid)      cascade;
drop function if exists public.link_medecin_by_code(text)    cascade;
drop function if exists public.set_link_code()               cascade;

-- Drop the auth trigger + function BEFORE dropping the enum type.
-- handle_new_user() declares "v_role user_role", creating a tracked
-- PostgreSQL dependency. Without this, DROP TYPE user_role fails because
-- the function still depends on it, leaving the enum in an inconsistent state
-- and causing "Database error saving new user" on every signup.
drop trigger  if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.is_admin()        cascade;
drop function if exists public.set_updated_at()  cascade;

-- Drop columns that no longer exist in the schema
alter table if exists public.profiles drop column if exists first_login_at;
alter table if exists public.profiles drop column if exists link_code;

-- Drop old supervisor table if it still exists
drop table if exists public.supervisor_medecin cascade;
drop table if exists public.notifications       cascade;

-- Safely migrate the user_role enum.
-- Column dependency was already removed by dropping the function above.
-- Now convert the column to text so the table itself has no type dependency.
do $$ begin
  alter table public.profiles alter column role drop default;
  alter table public.profiles alter column role type text using role::text;
exception when others then null; end $$;

drop type if exists user_role_old;
drop type if exists user_role;
create type user_role as enum ('medecin', 'admin');


-- =============================================================
-- 1. Extensions
-- =============================================================
create extension if not exists "pgcrypto";


-- =============================================================
-- 2. Enums  (user_role already created in section 0)
-- =============================================================
do $$ begin
  create type badge_condition as enum (
    'lessons_completed',
    'streak_days',
    'perfect_score',
    'topic_completed',
    'grade_completed'
  );
exception when duplicate_object then null; end $$;


-- =============================================================
-- 3. profiles
-- =============================================================
create table if not exists public.profiles (
  id               uuid        primary key references auth.users(id) on delete cascade,
  name             text        not null default '',
  email            text,
  role             user_role   not null default 'medecin',
  status           text        not null default 'pending',
  avatar           text,
  streak_days      integer     not null default 0,
  last_quiz_date   timestamptz,
  banned_from_quiz boolean     not null default false,
  quiz_cycle       smallint    not null default 1,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint profiles_status_check check (status in ('pending', 'active'))
);

-- Convert role column back to enum type and restore its default
do $$ begin
  alter table public.profiles alter column role type user_role using role::text::user_role;
  alter table public.profiles alter column role set default 'medecin';
exception when others then null; end $$;

create index if not exists idx_profiles_role   on public.profiles(role);
create index if not exists idx_profiles_status on public.profiles(status);

-- Add columns that may be missing on existing installations
alter table public.profiles add column if not exists avatar         text;
alter table public.profiles add column if not exists streak_days    integer     not null default 0;
alter table public.profiles add column if not exists last_quiz_date timestamptz;
alter table public.profiles add column if not exists status         text        not null default 'pending';

-- Add quiz-ban and quiz-cycle columns (safe to run on existing installs)
alter table public.profiles add column if not exists banned_from_quiz boolean  not null default false;
alter table public.profiles add column if not exists quiz_cycle       smallint not null default 1;

-- Re-apply the check constraint safely
alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check check (status in ('pending', 'active'));


-- =============================================================
-- 4. topics  (formation modules)
-- =============================================================
create table if not exists public.topics (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  grade      smallint,
  icon       text,
  sort_order integer     not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_topics_sort on public.topics(sort_order);

do $$ begin
  alter table public.topics alter column grade drop not null;
exception when others then null; end $$;

do $$ begin
  alter table public.topics drop constraint if exists topics_grade_check;
exception when others then null; end $$;


-- =============================================================
-- 5. lessons
-- =============================================================
create table if not exists public.lessons (
  id              uuid        primary key default gen_random_uuid(),
  topic_id        uuid        not null references public.topics(id) on delete cascade,
  title           text        not null,
  content_text    text,
  sort_order      integer     not null default 0,
  unlock_after_id uuid        references public.lessons(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index if not exists idx_lessons_topic on public.lessons(topic_id, sort_order);


-- =============================================================
-- 6. questions  (QCM)
-- =============================================================
create table if not exists public.questions (
  id             uuid        primary key default gen_random_uuid(),
  lesson_id      uuid        not null references public.lessons(id) on delete cascade,
  question_text  text        not null,
  options        jsonb       not null default '[]'::jsonb,
  correct_answer text        not null,
  hint           text,
  explanation    text,
  teaching_steps jsonb       default '[]'::jsonb,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now()
);

create index if not exists idx_questions_lesson on public.questions(lesson_id, sort_order);


-- =============================================================
-- 7. progress  (legacy — kept for existing data)
-- =============================================================
create table if not exists public.progress (
  id        uuid        primary key default gen_random_uuid(),
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  lesson_id uuid        not null references public.lessons(id)  on delete cascade,
  completed boolean     not null default false,
  score     integer     check (score between 0 and 100),
  attempts  integer     not null default 0,
  last_date timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists idx_progress_user   on public.progress(user_id);
create index if not exists idx_progress_lesson on public.progress(lesson_id);


-- =============================================================
-- 8. user_progress  (active progress table)
-- =============================================================
create table if not exists public.user_progress (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  lesson_ref text        not null,
  score      integer     check (score >= 0),
  completed  boolean     not null default false,
  attempts   integer     not null default 1,
  last_date  timestamptz not null default now(),
  unique (user_id, lesson_ref)
);

create index if not exists idx_user_progress_user on public.user_progress(user_id);


-- =============================================================
-- 9. badges
-- =============================================================
create table if not exists public.badges (
  id              uuid           primary key default gen_random_uuid(),
  name            text           not null,
  icon            text,
  condition_type  badge_condition not null,
  condition_value integer        not null default 0,
  created_at      timestamptz    not null default now()
);


-- =============================================================
-- 10. user_badges
-- =============================================================
create table if not exists public.user_badges (
  user_id   uuid        not null references public.profiles(id) on delete cascade,
  badge_id  uuid        not null references public.badges(id)   on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create index if not exists idx_user_badges_user on public.user_badges(user_id);


-- =============================================================
-- 11. Trigger — auto-update updated_at on profiles
-- =============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- =============================================================
-- 12. Trigger — create profile row on new auth user
--     Admin accounts → status 'active' immediately.
--     Médecin accounts → status 'pending' (must be activated by admin).
-- =============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_role user_role;
begin
  -- Safely cast the role from metadata; default to 'medecin' on any failure.
  begin
    v_role := (new.raw_user_meta_data->>'role')::user_role;
  exception when others then
    v_role := null;
  end;
  if v_role is null then
    v_role := 'medecin'::user_role;
  end if;

  insert into public.profiles (id, email, name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    v_role,
    case when v_role = 'admin'::user_role then 'active' else 'pending' end
  )
  on conflict (id) do nothing;

  return new;
exception when others then
  -- Never block auth user creation even if profile insert fails.
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =============================================================
-- 13. Helper — is_admin() used in RLS policies
-- =============================================================
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;


-- =============================================================
-- 14. Row Level Security
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.topics        enable row level security;
alter table public.lessons       enable row level security;
alter table public.questions     enable row level security;
alter table public.progress      enable row level security;
alter table public.user_progress enable row level security;
alter table public.badges        enable row level security;
alter table public.user_badges   enable row level security;

-- ── profiles ──────────────────────────────────────────────────
drop policy if exists "profiles_select_own"  on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own"  on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

-- ── topics ────────────────────────────────────────────────────
drop policy if exists "topics_read"        on public.topics;
drop policy if exists "topics_admin_write" on public.topics;
create policy "topics_read"        on public.topics for select using (auth.role() = 'authenticated');
create policy "topics_admin_write" on public.topics for all    using (public.is_admin()) with check (public.is_admin());

-- ── lessons ───────────────────────────────────────────────────
drop policy if exists "lessons_read"        on public.lessons;
drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_read"        on public.lessons for select using (auth.role() = 'authenticated');
create policy "lessons_admin_write" on public.lessons for all    using (public.is_admin()) with check (public.is_admin());

-- ── questions ─────────────────────────────────────────────────
drop policy if exists "questions_read"        on public.questions;
drop policy if exists "questions_admin_write" on public.questions;
create policy "questions_read"        on public.questions for select using (auth.role() = 'authenticated');
create policy "questions_admin_write" on public.questions for all    using (public.is_admin()) with check (public.is_admin());

-- ── progress (legacy) ─────────────────────────────────────────
drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_write_own"  on public.progress;
create policy "progress_select_own" on public.progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "progress_write_own" on public.progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── user_progress ─────────────────────────────────────────────
drop policy if exists "user_progress_all_own" on public.user_progress;
create policy "user_progress_all_own" on public.user_progress
  for all
  using      (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ── badges ────────────────────────────────────────────────────
drop policy if exists "badges_read"        on public.badges;
drop policy if exists "badges_admin_write" on public.badges;
create policy "badges_read"        on public.badges for select using (auth.role() = 'authenticated');
create policy "badges_admin_write" on public.badges for all    using (public.is_admin()) with check (public.is_admin());

-- ── user_badges ───────────────────────────────────────────────
drop policy if exists "user_badges_select_own" on public.user_badges;
drop policy if exists "user_badges_insert_own" on public.user_badges;
create policy "user_badges_select_own" on public.user_badges
  for select using (user_id = auth.uid() or public.is_admin());
create policy "user_badges_insert_own" on public.user_badges
  for insert with check (user_id = auth.uid());


-- =============================================================
-- 15. Seed — badges (idempotent: only inserts if table is empty)
-- =============================================================
insert into public.badges (name, icon, condition_type, condition_value)
select name, icon, condition_type::badge_condition, condition_value
from (values
  ('Apprenant rapide', '⭐', 'lessons_completed',  5),
  ('En feu',           '🔥', 'streak_days',         5),
  ('Précision clinique','🎯', 'perfect_score',       1),
  ('Module validé',    '🚀', 'topic_completed',      1),
  ('Expert confirmé',  '💎', 'streak_days',         10),
  ('Certification IV', '🏆', 'grade_completed',      1)
) as v(name, icon, condition_type, condition_value)
where not exists (select 1 from public.badges limit 1);


-- =============================================================
-- 16. Seed — 4 formation modules (idempotent)
-- =============================================================
insert into public.topics (name, icon, sort_order)
select name, icon, sort_order
from (values
  ('Fondamentaux & Indications', '💉', 1),
  ('Protocoles & Posologies',    '📋', 2),
  ('Techniques & Matériel',      '🩺', 3),
  ('Sécurité & Complications',   '🛡️', 4)
) as v(name, icon, sort_order)
where not exists (select 1 from public.topics limit 1);


-- =============================================================
-- 17. Booking / Calendar system
-- =============================================================

-- Time slots (admin creates these)
create table if not exists public.time_slots (
  id         uuid        primary key default gen_random_uuid(),
  start_time timestamptz not null,
  is_active  boolean     not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_time_slots_start on public.time_slots(start_time);

-- Bookings (one per user; status: confirmed | cancelled | completed)
create table if not exists public.bookings (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  slot_id    uuid        not null references public.time_slots(id) on delete cascade,
  status     text        not null default 'confirmed'
             check (status in ('confirmed', 'cancelled', 'completed')),
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_bookings_user on public.bookings(user_id);
create index if not exists idx_bookings_slot on public.bookings(slot_id);

-- Prevent two active bookings for the same slot
create unique index if not exists bookings_slot_unique_active
  on public.bookings(slot_id) where status <> 'cancelled';

-- Track whether a user has consumed their one allowed booking session
alter table public.profiles add column if not exists booking_used boolean not null default false;

-- Security-definer RPC: any authenticated user can check which slots are taken
-- without learning who made the booking.
create or replace function public.get_booked_slot_ids()
returns table(slot_id uuid)
language sql stable security definer set search_path = public as $$
  select slot_id from public.bookings where status in ('confirmed', 'completed');
$$;

-- RLS
alter table public.time_slots enable row level security;
alter table public.bookings   enable row level security;

-- time_slots: authenticated read; admin full write
drop policy if exists "time_slots_read"  on public.time_slots;
drop policy if exists "time_slots_admin" on public.time_slots;
create policy "time_slots_read"  on public.time_slots for select using (auth.role() = 'authenticated');
create policy "time_slots_admin" on public.time_slots for all    using (public.is_admin()) with check (public.is_admin());

-- bookings: own rows + admin
drop policy if exists "bookings_own_or_admin" on public.bookings;
create policy "bookings_own_or_admin" on public.bookings
  for all
  using      (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());


-- =============================================================
-- 18. Backfill — create profile rows for any auth users who don't have one.
--     Idempotent: ON CONFLICT DO NOTHING.
--     Fixes users created when the handle_new_user trigger was broken.
-- =============================================================
insert into public.profiles (id, email, name, role, status)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'name', ''),
  case
    when (u.raw_user_meta_data->>'role') = 'admin' then 'admin'::user_role
    else 'medecin'::user_role
  end,
  case
    when (u.raw_user_meta_data->>'role') = 'admin' then 'active'
    else 'pending'
  end
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null
on conflict (id) do nothing;


-- =============================================================
-- Done.
-- Tables  : profiles · topics · lessons · questions ·
--           progress · user_progress · badges · user_badges ·
--           time_slots · bookings
-- Roles   : medecin (pending by default) · admin (active by default)
-- Expiry  : NONE — only admin can activate / deactivate accounts
-- =============================================================
