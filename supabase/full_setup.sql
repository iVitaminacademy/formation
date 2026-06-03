-- =============================================================
-- Frazzl.kid — FULL DATABASE SETUP
-- Paste this entire file into Supabase SQL Editor and click Run.
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE everywhere.
-- =============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type user_role as enum ('kid', 'parent', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type badge_condition as enum ('lessons_completed', 'streak_days', 'perfect_score', 'topic_completed', 'grade_completed');
exception when duplicate_object then null; end $$;

-- =============================================================
-- 1. profiles
-- =============================================================
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  name           text not null default '',
  email          text,
  role           user_role not null default 'kid',
  grade          smallint check (grade in (4, 5)),
  avatar         text,
  streak_days    integer not null default 0,
  last_quiz_date timestamptz,
  link_code      text unique,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists idx_profiles_role on public.profiles(role);

-- Upgrade EXISTING profiles tables (the CREATE TABLE above is skipped if it
-- already exists, so new columns must be added explicitly).
alter table public.profiles add column if not exists avatar         text;
alter table public.profiles add column if not exists streak_days    integer not null default 0;
alter table public.profiles add column if not exists last_quiz_date timestamptz;
alter table public.profiles add column if not exists link_code      text;
do $$ begin
  alter table public.profiles add constraint profiles_link_code_key unique (link_code);
exception when duplicate_table then null; when duplicate_object then null; end $$;

-- =============================================================
-- 2. parent_child
-- =============================================================
create table if not exists public.parent_child (
  parent_id  uuid not null references public.profiles(id) on delete cascade,
  child_id   uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, child_id)
);
create index if not exists idx_parent_child_parent on public.parent_child(parent_id);
create index if not exists idx_parent_child_child  on public.parent_child(child_id);

-- =============================================================
-- 3. topics
-- =============================================================
create table if not exists public.topics (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  grade      smallint not null check (grade in (4, 5)),
  icon       text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
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
-- 6. progress  (legacy — kept for existing data)
-- =============================================================
create table if not exists public.progress (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed boolean not null default false,
  score     integer check (score between 0 and 100),
  attempts  integer not null default 0,
  last_date timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists idx_progress_user   on public.progress(user_id);
create index if not exists idx_progress_lesson on public.progress(lesson_id);

-- =============================================================
-- 7. user_progress  (active — stores progress by local lesson ref)
-- =============================================================
create table if not exists public.user_progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_ref text not null,
  score      integer check (score >= 0),
  completed  boolean not null default false,
  attempts   integer not null default 1,
  last_date  timestamptz not null default now(),
  unique (user_id, lesson_ref)
);
create index if not exists idx_user_progress_user on public.user_progress(user_id);

-- =============================================================
-- 8. badges
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
-- 9. user_badges
-- =============================================================
create table if not exists public.user_badges (
  user_id   uuid not null references public.profiles(id) on delete cascade,
  badge_id  uuid not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);
create index if not exists idx_user_badges_user on public.user_badges(user_id);

-- =============================================================
-- Triggers & helpers
-- =============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

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

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- =============================================================
-- Parent <-> Child linking via kid "link code"
-- =============================================================
-- Generate a short, unambiguous 6-char code (no I/L/O/0/1)
create or replace function public.gen_link_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  code     text;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, floor(random() * length(alphabet))::int + 1, 1);
    end loop;
    exit when not exists (select 1 from public.profiles where link_code = code);
  end loop;
  return code;
end $$;

-- Auto-assign a code to every new kid profile
create or replace function public.set_link_code()
returns trigger language plpgsql as $$
begin
  if new.role = 'kid' and (new.link_code is null or new.link_code = '') then
    new.link_code := public.gen_link_code();
  end if;
  return new;
end $$;

drop trigger if exists trg_profiles_link_code on public.profiles;
create trigger trg_profiles_link_code
  before insert on public.profiles
  for each row execute function public.set_link_code();

-- Backfill existing kids that have no code yet
update public.profiles
   set link_code = public.gen_link_code()
 where role = 'kid'
   and (link_code is null or link_code = '');

-- RPC: parent links a child by code (SECURITY DEFINER bypasses RLS safely)
create or replace function public.link_child_by_code(p_code text)
returns table (id uuid, name text, grade smallint, avatar text)
language plpgsql security definer set search_path = public as $$
declare
  v_child public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_child
    from public.profiles
   where upper(link_code) = upper(trim(p_code))
     and role = 'kid'
   limit 1;

  if v_child.id is null then
    raise exception 'No kid found with that code';
  end if;

  if v_child.id = auth.uid() then
    raise exception 'You cannot link your own account';
  end if;

  insert into public.parent_child (parent_id, child_id)
  values (auth.uid(), v_child.id)
  on conflict (parent_id, child_id) do nothing;

  return query
    select v_child.id, v_child.name, v_child.grade, v_child.avatar;
end $$;

grant execute on function public.link_child_by_code(text) to authenticated;

-- =============================================================
-- Row Level Security — enable on all tables
-- =============================================================
alter table public.profiles      enable row level security;
alter table public.parent_child  enable row level security;
alter table public.topics        enable row level security;
alter table public.lessons       enable row level security;
alter table public.questions     enable row level security;
alter table public.progress      enable row level security;
alter table public.user_progress enable row level security;
alter table public.badges        enable row level security;
alter table public.user_badges   enable row level security;

-- profiles
drop policy if exists "profiles_select_own_or_child" on public.profiles;
create policy "profiles_select_own_or_child" on public.profiles for select using (
  id = auth.uid() or public.is_admin()
  or exists (select 1 from public.parent_child pc where pc.parent_id = auth.uid() and pc.child_id = profiles.id)
);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles for insert with check (id = auth.uid());

-- parent_child
drop policy if exists "parent_child_select" on public.parent_child;
create policy "parent_child_select" on public.parent_child for select using (parent_id = auth.uid() or child_id = auth.uid() or public.is_admin());
drop policy if exists "parent_child_manage" on public.parent_child;
create policy "parent_child_manage" on public.parent_child for all using (parent_id = auth.uid() or public.is_admin()) with check (parent_id = auth.uid() or public.is_admin());

-- topics / lessons / questions (read-only for users, admin write)
drop policy if exists "topics_read"          on public.topics;    create policy "topics_read"          on public.topics    for select using (auth.role() = 'authenticated');
drop policy if exists "topics_admin_write"   on public.topics;    create policy "topics_admin_write"   on public.topics    for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "lessons_read"         on public.lessons;   create policy "lessons_read"         on public.lessons   for select using (auth.role() = 'authenticated');
drop policy if exists "lessons_admin_write"  on public.lessons;   create policy "lessons_admin_write"  on public.lessons   for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "questions_read"       on public.questions; create policy "questions_read"       on public.questions for select using (auth.role() = 'authenticated');
drop policy if exists "questions_admin_write" on public.questions; create policy "questions_admin_write" on public.questions for all using (public.is_admin()) with check (public.is_admin());

-- progress (legacy)
drop policy if exists "progress_select_own_or_child" on public.progress;
create policy "progress_select_own_or_child" on public.progress for select using (
  user_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.parent_child pc where pc.parent_id = auth.uid() and pc.child_id = progress.user_id)
);
drop policy if exists "progress_write_own" on public.progress;
create policy "progress_write_own" on public.progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- user_progress (active)
drop policy if exists "user_progress_all_own" on public.user_progress;
create policy "user_progress_all_own" on public.user_progress for all using (
  user_id = auth.uid() or public.is_admin()
) with check (
  user_id = auth.uid() or public.is_admin()
);
-- let a parent/admin READ a linked child's progress
drop policy if exists "user_progress_select_own_or_child" on public.user_progress;
create policy "user_progress_select_own_or_child" on public.user_progress for select using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (select 1 from public.parent_child pc where pc.parent_id = auth.uid() and pc.child_id = user_progress.user_id)
);

-- badges
drop policy if exists "badges_read"        on public.badges; create policy "badges_read"        on public.badges for select using (auth.role() = 'authenticated');
drop policy if exists "badges_admin_write" on public.badges; create policy "badges_admin_write" on public.badges for all using (public.is_admin()) with check (public.is_admin());

-- user_badges
drop policy if exists "user_badges_select_own_or_child" on public.user_badges;
create policy "user_badges_select_own_or_child" on public.user_badges for select using (
  user_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.parent_child pc where pc.parent_id = auth.uid() and pc.child_id = user_badges.user_id)
);
drop policy if exists "user_badges_insert_own" on public.user_badges;
create policy "user_badges_insert_own" on public.user_badges for insert with check (user_id = auth.uid());

-- =============================================================
-- 10. notifications  (parent alerts when a child makes progress)
-- =============================================================
create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  parent_id  uuid not null references public.profiles(id) on delete cascade,
  child_id   uuid not null references public.profiles(id) on delete cascade,
  type       text not null default 'progress',
  payload    jsonb,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notifications_parent on public.notifications(parent_id, created_at desc);
create index if not exists idx_notifications_child  on public.notifications(child_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_parent" on public.notifications;
create policy "notifications_select_parent" on public.notifications for select using (
  parent_id = auth.uid() or public.is_admin()
);

drop policy if exists "notifications_insert_child" on public.notifications;
create policy "notifications_insert_child" on public.notifications for insert with check (
  child_id = auth.uid()
  and exists (select 1 from public.parent_child pc where pc.parent_id = parent_id and pc.child_id = auth.uid())
);

drop policy if exists "notifications_update_parent" on public.notifications;
create policy "notifications_update_parent" on public.notifications for update using (parent_id = auth.uid() or public.is_admin()) with check (parent_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_delete_parent" on public.notifications;
create policy "notifications_delete_parent" on public.notifications for delete using (parent_id = auth.uid() or public.is_admin());

-- RPC: insert one notification per linked parent when a child saves progress.
-- SECURITY DEFINER so it works regardless of who triggers it.
create or replace function public.notify_parents_for_progress(
  p_child_id uuid,
  p_lesson_ref text,
  p_score integer,
  p_completed boolean,
  p_attempts integer,
  p_last_date timestamptz default now()
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (parent_id, child_id, type, payload, read, created_at)
  select pc.parent_id, p_child_id, 'progress',
    jsonb_build_object(
      'lesson_ref', p_lesson_ref,
      'score', p_score,
      'completed', p_completed,
      'attempts', p_attempts,
      'last_date', p_last_date
    ),
    false,
    coalesce(p_last_date, now())
  from public.parent_child pc
  where pc.child_id = p_child_id;
end $$;

grant execute on function public.notify_parents_for_progress(uuid, text, integer, boolean, integer, timestamptz) to authenticated;

-- Realtime: add notifications to the supabase_realtime publication so parents
-- receive live inserts. Guarded so it is safe to re-run.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end $$;

-- =============================================================
-- Done. All 10 tables created with RLS policies applied.
-- Includes: kid link_code (auto-generated + backfilled),
-- link_child_by_code() RPC, parent-read policy on user_progress,
-- and notifications (table + RPC + realtime publication).
-- =============================================================

-- Quick check: list kid codes after running
-- select name, role, link_code from public.profiles where role = 'kid';
