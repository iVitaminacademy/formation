-- =============================================================
-- Frazzl.kid — seed data (optional starter content)
-- Run AFTER schema.sql in the Supabase SQL Editor.
-- Idempotent: re-running will not duplicate rows.
-- =============================================================

-- ---------- Badges (matches PROJECT.md) ----------
insert into public.badges (name, icon, condition_type, condition_value)
select v.name, v.icon, v.condition_type::badge_condition, v.condition_value
from (values
  ('Quick Learner', '⭐', 'lessons_completed', 5),
  ('On Fire',       '🔥', 'streak_days',        5),
  ('Accurate',      '🎯', 'perfect_score',      100),
  ('Rocket Start',  '🚀', 'topic_completed',    1),
  ('Diamond',       '💎', 'streak_days',        10),
  ('Champion',      '🏆', 'grade_completed',    4)
) as v(name, icon, condition_type, condition_value)
where not exists (select 1 from public.badges b where b.name = v.name);

-- ---------- Grade 4 topics ----------
insert into public.topics (name, grade, icon, sort_order)
select v.name, 4, v.icon, v.sort_order
from (values
  ('Multiplication', '✖️', 1),
  ('Division',       '➗', 2),
  ('Fractions',      '🍕', 3),
  ('Geometry',       '📐', 4)
) as v(name, icon, sort_order)
where not exists (select 1 from public.topics t where t.name = v.name and t.grade = 4);

-- ---------- A couple of starter lessons + a sample question ----------
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Multiplication' and grade = 4 limit 1;
  if v_topic is not null and not exists (
      select 1 from public.lessons where topic_id = v_topic and title = 'Times Tables: 2 to 5'
  ) then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Times Tables: 2 to 5', 'Learn the multiplication tables from 2 to 5.', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values (
      v_lesson,
      'What is 3 × 4?',
      '["10","11","12","14"]'::jsonb,
      '12',
      'Think of 3 groups of 4.',
      '3 × 4 means adding 4 three times: 4 + 4 + 4 = 12.',
      1
    );
  end if;
end $$;

-- =============================================================
-- To make yourself an admin (so you can import content from the app):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- =============================================================
