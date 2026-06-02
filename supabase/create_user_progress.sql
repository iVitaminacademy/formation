-- =============================================================
-- Create user_progress table
-- Run this ONCE in the Supabase SQL Editor
-- =============================================================
-- This table stores lesson progress using a plain TEXT lesson_ref
-- (no FK to lessons table) so local numeric lesson IDs like '101'
-- can be saved directly without needing matching DB lesson rows.
-- =============================================================

create table if not exists public.user_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lesson_ref  text not null,
  score       integer check (score >= 0),
  completed   boolean not null default false,
  attempts    integer not null default 1,
  last_date   timestamptz not null default now(),
  unique (user_id, lesson_ref)
);

-- Index for fast per-user lookups
create index if not exists idx_user_progress_user
  on public.user_progress(user_id);

-- Enable Row Level Security
alter table public.user_progress enable row level security;

-- Users can only read and write their own progress rows
create policy "user_progress_all_own"
  on public.user_progress
  for all
  using  (user_id = auth.uid())
  with check (user_id = auth.uid());
