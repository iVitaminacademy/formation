-- ============================================================
-- Migration: allow progress to be saved with local lesson IDs
-- ============================================================
-- The original schema used `lesson_id uuid FK → lessons(id)`.
-- Because lessons are loaded from the frontend curriculum file
-- (not seeded into the DB yet), every progress save failed with
-- a FK violation. This migration removes that constraint and
-- converts lesson_id to TEXT so numeric local IDs like '101'
-- can be stored directly.
--
-- Run this ONCE in the Supabase SQL editor before using the app.
-- Safe to run on a fresh or existing project.
-- ============================================================

-- 1. Drop the unique constraint that depends on lesson_id type
ALTER TABLE public.progress
  DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_key;

-- 2. Drop the FK constraint
ALTER TABLE public.progress
  DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey;

-- 3. Change lesson_id column type to TEXT
ALTER TABLE public.progress
  ALTER COLUMN lesson_id TYPE TEXT USING lesson_id::TEXT;

-- 4. Re-add the unique constraint (user + lesson, still enforced)
ALTER TABLE public.progress
  ADD CONSTRAINT progress_user_lesson_unique UNIQUE (user_id, lesson_id);

-- 5. Verify
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'progress'
  AND column_name  = 'lesson_id';
-- Expected result: lesson_id | text
