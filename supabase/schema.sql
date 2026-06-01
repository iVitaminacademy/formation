-- =============================================================
-- Frazzl.kid — Supabase schema (PostgreSQL)
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- Designed to scale: UUID keys, indexes on every FK + hot query path,
-- Row Level Security (RLS) on every table.
-- =============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";   -- gen_random_uuid()

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('kid', 'parent', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type badge_condition as enum ('lessons_completed', 'streak_days', 'perfect_score', 'topic_completed', 'grade_completed');
exception when duplicate_object then null; end $$;

-- =============================================================
-- 1. profiles  (1-to-1 with auth.users)
-- =============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  email       text,
  role        user_role not null default 'kid',
  grade       smallint check (grade in (4, 5)),
  avatar      text,
  streak_days integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_profiles_role on public.profiles(role);

-- =============================================================
-- 2. parent_child  (links a parent profile to a kid profile)
-- =============================================================
create table if not exists public.parent_child (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  child_id  uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, child_id)
);
create index if not exists idx_parent_child_parent on public.parent_child(parent_id);
create index if not exists idx_parent_child_child  on public.parent_child(child_id);

-- =============================================================
-- 3. topics
-- =============================================================
create table if not exists public.topics (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  grade       smallint not null check (grade in (4, 5)),
  icon        text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists idx_topics_grade on public.topics(grade, sort_order);

-- =============================================================
-- 4. lessons
-- =============================================================
create table if not exists public.lessons (
  id              uuid primary key default gen_random_uuid(),
  topic_id        uuid not null references public.topics(id) on delete cascade,
  title           text not null,
  content_text    text,
  sort_order      integer not null default 0,
  unlock_after_id uuid references public.lessons(id) on delete set null,
  created_at      timestamptz not null default now()
);
create index if not exists idx_lessons_topic on public.lessons(topic_id, sort_order);

-- =============================================================
-- 5. questions
-- =============================================================
create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  lesson_id      uuid not null references public.lessons(id) on delete cascade,
  question_text  text not null,
  options        jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  hint           text,
  explanation    text,
  teaching_steps jsonb default '[]'::jsonb,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists idx_questions_lesson on public.questions(lesson_id, sort_order);

-- =============================================================
-- 6. progress  (largest table at scale — one row per user per lesson)
-- =============================================================
create table if not exists public.progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  completed  boolean not null default false,
  score      integer check (score between 0 and 100),
  attempts   integer not null default 0,
  last_date  timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists idx_progress_user   on public.progress(user_id);
create index if not exists idx_progress_lesson on public.progress(lesson_id);

-- =============================================================
-- 7. badges  (catalog)
-- =============================================================
create table if not exists public.badges (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  icon            text,
  condition_type  badge_condition not null,
  condition_value integer not null default 0,
  created_at      timestamptz not null default now()
);

-- =============================================================
-- 8. user_badges  (earned badges)
-- =============================================================
create table if not exists public.user_badges (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
create index if not exists idx_user_badges_user on public.user_badges(user_id);

-- =============================================================
-- Helpers: updated_at trigger + new-user profile bootstrap
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

-- Auto-create a profile row whenever a new auth user signs up.
-- Reads name/role/grade from the signUp options.data metadata.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, role, grade)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'kid'),
    nullif(new.raw_user_meta_data->>'grade', '')::smallint
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Convenience helper used inside policies
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.profiles     enable row level security;
alter table public.parent_child enable row level security;
alter table public.topics       enable row level security;
alter table public.lessons      enable row level security;
alter table public.questions    enable row level security;
alter table public.progress     enable row level security;
alter table public.badges       enable row level security;
alter table public.user_badges  enable row level security;

-- ---------- profiles ----------
drop policy if exists "profiles_select_own_or_child" on public.profiles;
create policy "profiles_select_own_or_child" on public.profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.parent_child pc
      where pc.parent_id = auth.uid() and pc.child_id = profiles.id
    )
  );

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (id = auth.uid());

-- ---------- parent_child ----------
drop policy if exists "parent_child_select" on public.parent_child;
create policy "parent_child_select" on public.parent_child
  for select using (parent_id = auth.uid() or child_id = auth.uid() or public.is_admin());

drop policy if exists "parent_child_manage" on public.parent_child;
create policy "parent_child_manage" on public.parent_child
  for all using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid() or public.is_admin());

-- ---------- content: topics / lessons / questions ----------
-- Readable by any authenticated user; writable only by admins.
drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics
  for select using (auth.role() = 'authenticated');
drop policy if exists "topics_admin_write" on public.topics;
create policy "topics_admin_write" on public.topics
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons
  for select using (auth.role() = 'authenticated');
drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_admin_write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "questions_read" on public.questions;
create policy "questions_read" on public.questions
  for select using (auth.role() = 'authenticated');
drop policy if exists "questions_admin_write" on public.questions;
create policy "questions_admin_write" on public.questions
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- progress ----------
drop policy if exists "progress_select_own_or_child" on public.progress;
create policy "progress_select_own_or_child" on public.progress
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.parent_child pc
      where pc.parent_id = auth.uid() and pc.child_id = progress.user_id
    )
  );

drop policy if exists "progress_write_own" on public.progress;
create policy "progress_write_own" on public.progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- badges (catalog) ----------
drop policy if exists "badges_read" on public.badges;
create policy "badges_read" on public.badges
  for select using (auth.role() = 'authenticated');
drop policy if exists "badges_admin_write" on public.badges;
create policy "badges_admin_write" on public.badges
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- user_badges ----------
drop policy if exists "user_badges_select_own_or_child" on public.user_badges;
create policy "user_badges_select_own_or_child" on public.user_badges
  for select using (
    user_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.parent_child pc
      where pc.parent_id = auth.uid() and pc.child_id = user_badges.user_id
    )
  );

drop policy if exists "user_badges_insert_own" on public.user_badges;
create policy "user_badges_insert_own" on public.user_badges
  for insert with check (user_id = auth.uid());

-- =============================================================
-- Done. Next: run seed.sql for starter content (optional).
-- =============================================================
