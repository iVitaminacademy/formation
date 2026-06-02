-- =============================================================
-- Child <-> Parent linking via a kid "link code"
-- Run this ONCE in the Supabase SQL Editor. Safe to re-run.
-- =============================================================
-- A kid gets a short unique code (e.g. "AB3K7Q") shown on their
-- profile. The parent types it in to link. Linking goes through a
-- SECURITY DEFINER RPC so it works without exposing other profiles
-- to the parent (RLS otherwise hides them).
-- =============================================================

-- 1. link_code column on profiles ------------------------------------------
alter table public.profiles
  add column if not exists link_code text unique;

-- 2. Code generator: 6 chars from an unambiguous alphabet -------------------
create or replace function public.gen_link_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; -- no I,L,O,0,1
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

-- 3. Backfill existing kids that have no code yet ---------------------------
update public.profiles
   set link_code = public.gen_link_code()
 where role = 'kid'
   and (link_code is null or link_code = '');

-- 4. Auto-assign a code to every new kid profile ----------------------------
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

-- 5. RPC: parent links a child by code --------------------------------------
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

-- 6. Let parents READ their linked child's progress -------------------------
-- (the existing "user_progress_all_own" policy only covers a user's own rows)
drop policy if exists "user_progress_select_own_or_child" on public.user_progress;
create policy "user_progress_select_own_or_child" on public.user_progress
for select using (
  user_id = auth.uid()
  or exists (
    select 1 from public.parent_child pc
     where pc.parent_id = auth.uid()
       and pc.child_id  = user_progress.user_id
  )
);
