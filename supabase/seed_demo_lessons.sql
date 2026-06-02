-- =============================================================
-- Demo lessons seed generated from client/src/content/lessonsContent.js
-- Run this AFTER schema.sql and seed.sql to insert demo topics/lessons/questions
-- Idempotent: checks by lesson title and topic name to avoid duplicates.
-- =============================================================

-- Helper: insert topic if missing and return its id
do $$
declare
  v_topic uuid;
begin
  -- Grade 4 topics used by demo
  if not exists (select 1 from public.topics where name = 'Place Value' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Place Value', 4, '🔢', 100);
  end if;
  if not exists (select 1 from public.topics where name = 'Arithmetic' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Arithmetic', 4, '➕', 200);
  end if;
  if not exists (select 1 from public.topics where name = 'Number Theory' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Number Theory', 4, '🔎', 300);
  end if;
  if not exists (select 1 from public.topics where name = 'Multiply / Divide' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Multiply / Divide', 4, '✖️', 400);
  end if;
  if not exists (select 1 from public.topics where name = 'Fractions' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Fractions', 4, '🍕', 500);
  end if;
  if not exists (select 1 from public.topics where name = 'Geometry' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Geometry', 4, '📐', 600);
  end if;
  if not exists (select 1 from public.topics where name = 'Money & Data' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Money & Data', 4, '💰', 700);
  end if;
  if not exists (select 1 from public.topics where name = 'Problem Solving' and grade = 4) then
    insert into public.topics (name, grade, icon, sort_order) values ('Problem Solving', 4, '🧠', 800);

  -- Grade 5 topics used by demo
  if not exists (select 1 from public.topics where name = 'Decimals' and grade = 5) then
    insert into public.topics (name, grade, icon, sort_order) values ('Decimals', 5, '🔢', 100);
  end if;
  if not exists (select 1 from public.topics where name = 'Fractions' and grade = 5) then
    insert into public.topics (name, grade, icon, sort_order) values ('Fractions', 5, '🍕', 200);
  end if;
end $$;

-- Insert lessons and questions for Grade 4 demo (titles match lessonsContent.js)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Place Value' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Place Value & Decimals') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Place Value & Decimals', 'Demo content imported from lessonsContent.js', 10)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'What is the value of the digit 5 in 4,567,890?', '["5","500","5,000","500,000"]'::jsonb, '500,000', 'Look at the commas to find the place value name.', 'The 5 is in the hundred-thousands place (5 × 100,000 = 500,000).', 1),
      (v_lesson, 'Write 3.75 in expanded form.', '["3 + 0.7 + 0.05","3 + 0.75","3.7 + 0.05","3 + 7 + 5"]'::jsonb, '3 + 0.7 + 0.05', 'Break the number into ones + tenths + hundredths.', '3 is ones, 7 is tenths (0.7), 5 is hundredths (0.05).', 2),
      (v_lesson, 'Compare 0.45 and 0.4 using >, <, or =.', '["0.45 > 0.4","0.45 < 0.4","0.45 = 0.4","0.45 ≥ 0.4"]'::jsonb, '0.45 > 0.4', 'Add a zero to 0.4 to make it 0.40 and compare.', '0.45 is forty-five hundredths which is greater than forty hundredths (0.40).', 3);
  end if;

  select id into v_topic from public.topics where name = 'Arithmetic' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Basic Math — Operations') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Basic Math — Operations', 'Demo content imported from lessonsContent.js', 20)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, '567 + 389 = ?', '["946","956","976","966"]'::jsonb, '956', 'Start from the right (ones place).', 'Add hundreds, tens, then ones: 567 + 389 = 956.', 1),
      (v_lesson, '912 − 478 = ?', '["424","434","444","414"]'::jsonb, '434', 'Use borrowing when needed.', 'Subtract using borrowing: 912 − 478 = 434.', 2),
      (v_lesson, '24 × 13 = ?', '["312","302","292","322"]'::jsonb, '312', 'Break 13 into 10 + 3.', '24×10=240, 24×3=72, total 312.', 3);
  end if;

  select id into v_topic from public.topics where name = 'Number Theory' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Prime and Composite') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Prime and Composite', 'Demo content imported from lessonsContent.js', 30)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'Is 23 prime or composite?', '["Prime","Composite","Neither","Both"]'::jsonb, 'Prime', 'Check divisibility from 2 up to √23.', '23 has only 1 and 23 as factors.', 1),
      (v_lesson, 'Is 49 prime or composite?', '["Prime","Composite","Both","Neither"]'::jsonb, 'Composite', 'Try dividing by 7.', '49 = 7 × 7 so it is composite.', 2),
      (v_lesson, 'List a prime number between 30 and 50.', '["31","32","33","34"]'::jsonb, '31', 'Test divisibility by small primes.', '31 is a prime; others like 32 are even.', 3);
  end if;

  select id into v_topic from public.topics where name = 'Multiply / Divide' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Multi-digit Multiplication & Division') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Multi-digit Multiplication & Division', 'Demo content imported from lessonsContent.js', 40)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, '456 × 24 = ?', '["10,944","11,024","9,944","10,444"]'::jsonb, '10,944', 'Break 24 into 20 + 4.', '456×20=9,120 and 456×4=1,824; sum 10,944.', 1),
      (v_lesson, '1,248 ÷ 32 = ?', '["39","38","40","36"]'::jsonb, '39', 'How many groups of 32 fit into 1,248?', '32×39=1,248.', 2);
  end if;

  select id into v_topic from public.topics where name = 'Fractions' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Fractions — Equivalence & Comparison') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Fractions — Equivalence & Comparison', 'Demo content imported from lessonsContent.js', 50)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'Are 2/3 and 4/6 equivalent?', '["Yes","No","Sometimes","Only with decimals"]'::jsonb, 'Yes', 'Simplify or cross-multiply.', '4/6 simplifies to 2/3.', 1),
      (v_lesson, 'Compare 3/5 and 5/8 using >, <, or =.', '["3/5 < 5/8","3/5 > 5/8","3/5 = 5/8","Cannot compare"]'::jsonb, '3/5 < 5/8', 'Convert to decimals or cross-multiply.', '3/5=0.6; 5/8=0.625 so 0.6 < 0.625.', 2);
  end if;

  select id into v_topic from public.topics where name = 'Geometry' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Geometry & Measurement') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Geometry & Measurement', 'Demo content imported from lessonsContent.js', 60)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'Perimeter of rectangle 12cm by 7cm?', '["38 cm","24 cm","84 cm","19 cm"]'::jsonb, '38 cm', 'Perimeter = 2×(l+w).', '2×(12+7)=38 cm.', 1),
      (v_lesson, 'Area of rectangle 15cm by 10cm?', '["150 cm²","25 cm²","1500 cm²","100 cm²"]'::jsonb, '150 cm²', 'Area = length × width.', '15×10=150.', 2);
  end if;

  select id into v_topic from public.topics where name = 'Money & Data' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Data & Financial Literacy') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Data & Financial Literacy', 'Demo content imported from lessonsContent.js', 70)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'You earn $25 and spend $12. How much left?', '["$13","$12","$37","$14"]'::jsonb, '$13', 'Income minus expenses.', '25 − 12 = 13.', 1),
      (v_lesson, 'Monday sold 15 toys, Tuesday 23. How many more?', '["8","7","9","6"]'::jsonb, '8', 'Subtract Monday from Tuesday.', '23 − 15 = 8.', 2);
  end if;

  select id into v_topic from public.topics where name = 'Problem Solving' and grade = 4 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Mathematical Word Problems') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Mathematical Word Problems', 'Demo content imported from lessonsContent.js', 80)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'Rectangle 15ft × 8ft area?', '["120","23","30","100"]'::jsonb, '120', 'Area = length × width.', '15×8=120.', 1),
      (v_lesson, 'Car travels 180 miles in 3 hours. Speed?', '["60 mph","55 mph","50 mph","90 mph"]'::jsonb, '60 mph', 'Divide distance by time.', '180 ÷ 3 = 60.', 2);
  end if;
end $$;

-- Grade 5 demo lessons
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Decimals' and grade = 5 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Decimals & Place Value (Grade 5)') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Decimals & Place Value (Grade 5)', 'Demo content imported from lessonsContent.js', 10)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, 'Order 0.405, 0.45, 0.4 from smallest to largest.', '["0.4, 0.405, 0.45","0.405, 0.4, 0.45","0.45, 0.405, 0.4","0.4, 0.45, 0.405"]'::jsonb, '0.4, 0.405, 0.45', 'Add zeros to compare decimals.', '0.400 < 0.405 < 0.450.', 1),
      (v_lesson, '6.78 × 100 = ?', '["678","67.8","6,780","6.78"]'::jsonb, '678', 'Move decimal two places right.', 'Multiplying by 100 shifts decimal right twice.', 2);
  end if;

  select id into v_topic from public.topics where name = 'Fractions' and grade = 5 limit 1;
  if v_topic is not null and not exists (select 1 from public.lessons where title = 'Fraction Operations (Grade 5)') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Fraction Operations (Grade 5)', 'Demo content imported from lessonsContent.js', 20)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order)
    values
      (v_lesson, '2/3 + 3/4 = ?', '["17/12","5/7","1","11/12"]'::jsonb, '17/12', 'Common denominator 12.', '8/12 + 9/12 = 17/12 = 1 5/12.', 1),
      (v_lesson, '3/5 × 4/7 = ?', '["12/35","7/20","3/35","1"]'::jsonb, '12/35', 'Multiply numerators and denominators.', '3×4 / 5×7 = 12/35.', 2);
  end if;
end $$;

-- End of demo seed
-- Demo lessons seeding for Frazzl.kid
-- Adds topics, lessons, and questions from client/src/content/lessonsContent.js
-- Safe to run repeatedly; checks for existence before inserting.
-- Run this in the Supabase SQL editor, or run `node supabase/apply.mjs` with DB env vars.

-- Grade 4: Place Value & Decimals (101)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Place Value' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Place Value', 4, '', 100) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Place Value & Decimals') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Place Value & Decimals', 'Imported demo lesson: Place Value & Decimals', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'What is the value of the digit 5 in 4,567,890?', '["5","500","5,000","500,000"]'::jsonb, '500,000', 'Look at the commas to find the place value name.', 'The 5 is in the hundred-thousands place (5 × 100,000 = 500,000).', 1),
      (v_lesson, 'Write 3.75 in expanded form.', '["3 + 0.7 + 0.05","3 + 0.75","3.7 + 0.05","3 + 7 + 5"]'::jsonb, '3 + 0.7 + 0.05', 'Break the number into ones + tenths + hundredths.', '3 is ones, 7 is tenths (0.7), 5 is hundredths (0.05).', 2),
      (v_lesson, 'Compare 0.45 and 0.4 using >, <, or =.', '["0.45 > 0.4","0.45 < 0.4","0.45 = 0.4","0.45 ≥ 0.4"]'::jsonb, '0.45 > 0.4', 'Add a zero to 0.4 to make it 0.40 and compare.', '0.45 is forty-five hundredths which is greater than forty hundredths (0.40).', 3);
  end if;
end $$;

-- Grade 4: Basic Math — Operations (102)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Arithmetic' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Arithmetic', 4, '', 110) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Basic Math — Operations') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Basic Math — Operations', 'Imported demo lesson: Basic Math — Operations', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, '567 + 389 = ?', '["946","956","976","966"]'::jsonb, '956', 'Start from the right (ones place).', 'Add hundreds, tens, then ones: 567 + 389 = 956.', 1),
      (v_lesson, '912 − 478 = ?', '["424","434","444","414"]'::jsonb, '434', 'Use borrowing when needed.', 'Subtract using borrowing: 912 − 478 = 434.', 2),
      (v_lesson, '24 × 13 = ?', '["312","302","292","322"]'::jsonb, '312', 'Break 13 into 10 + 3.', '24×10=240, 24×3=72, total 312.', 3);
  end if;
end $$;

-- Grade 4: Prime and Composite (103)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Number Theory' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Number Theory', 4, '', 120) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Prime and Composite') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Prime and Composite', 'Imported demo lesson: Prime and Composite', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'Is 23 prime or composite?', '["Prime","Composite","Neither","Both"]'::jsonb, 'Prime', 'Check divisibility from 2 up to √23.', '23 has only 1 and 23 as factors.', 1),
      (v_lesson, 'Is 49 prime or composite?', '["Prime","Composite","Both","Neither"]'::jsonb, 'Composite', 'Try dividing by 7.', '49 = 7 × 7 so it is composite.', 2),
      (v_lesson, 'List a prime number between 30 and 50.', '["31","32","33","34"]'::jsonb, '31', 'Test divisibility by small primes.', '31 is a prime; others like 32 are even.', 3);
  end if;
end $$;

-- Grade 4: Multi-digit Multiplication & Division (104)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Multiply / Divide' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Multiply / Divide', 4, '', 130) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Multi-digit Multiplication & Division') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Multi-digit Multiplication & Division', 'Imported demo lesson: Multi-digit Multiplication & Division', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, '456 × 24 = ?', '["10,944","11,024","9,944","10,444"]'::jsonb, '10,944', 'Break 24 into 20 + 4.', '456×20=9,120 and 456×4=1,824; sum 10,944.', 1),
      (v_lesson, '1,248 ÷ 32 = ?', '["39","38","40","36"]'::jsonb, '39', 'How many groups of 32 fit into 1,248?', '32×39=1,248.', 2);
  end if;
end $$;

-- Grade 4: Fractions — Equivalence & Comparison (105)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Fractions' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Fractions', 4, '', 140) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Fractions — Equivalence & Comparison') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Fractions — Equivalence & Comparison', 'Imported demo lesson: Fractions — Equivalence & Comparison', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'Are 2/3 and 4/6 equivalent?', '["Yes","No","Sometimes","Only with decimals"]'::jsonb, 'Yes', 'Simplify or cross-multiply.', '4/6 simplifies to 2/3.', 1),
      (v_lesson, 'Compare 3/5 and 5/8 using >, <, or =.', '["3/5 < 5/8","3/5 > 5/8","3/5 = 5/8","Cannot compare"]'::jsonb, '3/5 < 5/8', 'Convert to decimals or cross-multiply.', '3/5=0.6; 5/8=0.625 so 0.6 < 0.625.', 2);
  end if;
end $$;

-- Grade 4: Geometry & Measurement (106)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Geometry' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Geometry', 4, '', 150) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Geometry & Measurement') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Geometry & Measurement', 'Imported demo lesson: Geometry & Measurement', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'Perimeter of rectangle 12cm by 7cm?', '["38 cm","24 cm","84 cm","19 cm"]'::jsonb, '38 cm', 'Perimeter = 2×(l+w).', '2×(12+7)=38 cm.', 1),
      (v_lesson, 'Area of rectangle 15cm by 10cm?', '["150 cm²","25 cm²","1500 cm²","100 cm²"]'::jsonb, '150 cm²', 'Area = length × width.', '15×10=150.', 2);
  end if;
end $$;

-- Grade 4: Data & Financial Literacy (107)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Money & Data' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Money & Data', 4, '', 160) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Data & Financial Literacy') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Data & Financial Literacy', 'Imported demo lesson: Data & Financial Literacy', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'You earn $25 and spend $12. How much left?', '["$13","$12","$37","$14"]'::jsonb, '$13', 'Income minus expenses.', '25 − 12 = 13.', 1),
      (v_lesson, 'Monday sold 15 toys, Tuesday 23. How many more?', '["8","7","9","6"]'::jsonb, '8', 'Subtract Monday from Tuesday.', '23 − 15 = 8.', 2);
  end if;
end $$;

-- Grade 4: Mathematical Word Problems (108)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Problem Solving' and grade = 4 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Problem Solving', 4, '', 170) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Mathematical Word Problems') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Mathematical Word Problems', 'Imported demo lesson: Mathematical Word Problems', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'Rectangle 15ft × 8ft area?', '["120","23","30","100"]'::jsonb, '120', 'Area = length × width.', '15×8=120.', 1),
      (v_lesson, 'Car travels 180 miles in 3 hours. Speed?', '["60 mph","55 mph","50 mph","90 mph"]'::jsonb, '60 mph', 'Divide distance by time.', '180 ÷ 3 = 60.', 2);
  end if;
end $$;

-- Grade 5: Decimals & Place Value (201)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Decimals' and grade = 5 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Decimals', 5, '', 200) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Decimals & Place Value (Grade 5)') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Decimals & Place Value (Grade 5)', 'Imported demo lesson: Decimals & Place Value (Grade 5)', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, 'Order 0.405, 0.45, 0.4 from smallest to largest.', '["0.4, 0.405, 0.45","0.405, 0.4, 0.45","0.45, 0.405, 0.4","0.4, 0.45, 0.405"]'::jsonb, '0.4, 0.405, 0.45', 'Add zeros to compare decimals.', '0.400 < 0.405 < 0.450.', 1),
      (v_lesson, '6.78 × 100 = ?', '["678","67.8","6,780","6.78"]'::jsonb, '678', 'Move decimal two places right.', 'Multiplying by 100 shifts decimal right twice.', 2);
  end if;
end $$;

-- Grade 5: Fraction Operations (202)
do $$
declare
  v_topic uuid;
  v_lesson uuid;
begin
  select id into v_topic from public.topics where name = 'Fractions' and grade = 5 limit 1;
  if v_topic is null then
    insert into public.topics (name, grade, icon, sort_order) values ('Fractions', 5, '', 210) returning id into v_topic;
  end if;

  if not exists (select 1 from public.lessons where topic_id = v_topic and title = 'Fraction Operations (Grade 5)') then
    insert into public.lessons (topic_id, title, content_text, sort_order)
    values (v_topic, 'Fraction Operations (Grade 5)', 'Imported demo lesson: Fraction Operations (Grade 5)', 1)
    returning id into v_lesson;

    insert into public.questions (lesson_id, question_text, options, correct_answer, hint, explanation, sort_order) values
      (v_lesson, '2/3 + 3/4 = ?', '["17/12","5/7","1","11/12"]'::jsonb, '17/12', 'Common denominator 12.', '8/12 + 9/12 = 17/12 = 1 5/12.', 1),
      (v_lesson, '3/5 × 4/7 = ?', '["12/35","7/20","3/35","1"]'::jsonb, '12/35', 'Multiply numerators and denominators.', '3×4 / 5×7 = 12/35.', 2);
  end if;
end $$;

-- Done.
-- After running this file, demo lessons will exist in Supabase and progress saves will persist to the DB.
-- If your Supabase RLS policies prevent writes, you may need to mark your profile as admin:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- or run this file from an admin context (Supabase SQL editor logged in as a project admin or using apply.mjs with appropriate DB credentials).
