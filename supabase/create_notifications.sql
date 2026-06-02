-- =============================================================
-- Notifications: server-side persistent parent notifications
-- Run this in the Supabase SQL editor (or include in full_setup.sql)
-- =============================================================

-- Table: public.notifications
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

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies
drop policy if exists "notifications_select_parent" on public.notifications;
create policy "notifications_select_parent" on public.notifications for select using (
  parent_id = auth.uid() or public.is_admin()
);

drop policy if exists "notifications_insert_child" on public.notifications;
-- Allow a child to insert notifications for their linked parents only
create policy "notifications_insert_child" on public.notifications for insert with check (
  child_id = auth.uid()
  and exists (select 1 from public.parent_child pc where pc.parent_id = parent_id and pc.child_id = auth.uid())
);

drop policy if exists "notifications_update_parent" on public.notifications;
create policy "notifications_update_parent" on public.notifications for update using (parent_id = auth.uid() or public.is_admin()) with check (parent_id = auth.uid() or public.is_admin());

drop policy if exists "notifications_delete_parent" on public.notifications;
create policy "notifications_delete_parent" on public.notifications for delete using (parent_id = auth.uid() or public.is_admin());

-- RPC: notify_parents_for_progress(child_id, lesson_ref, score, completed, attempts, last_date)
-- Inserts one notification per linked parent for the provided child
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

-- =============================================================
-- Realtime: add the table to the supabase_realtime publication so
-- parents receive INSERTs live. Without this, postgres_changes never fires.
-- Guarded so it is safe to re-run.
-- =============================================================
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

-- End of notifications migration
