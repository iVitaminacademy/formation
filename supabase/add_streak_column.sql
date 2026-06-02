-- Add last_quiz_date to profiles so streak can be tracked.
-- Safe to run multiple times.
alter table public.profiles
  add column if not exists last_quiz_date timestamptz;
