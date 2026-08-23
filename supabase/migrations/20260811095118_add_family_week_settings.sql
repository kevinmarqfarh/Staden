create table public.planner_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  family_weeks_enabled boolean not null default false,
  family_week_anchor date not null,
  anchor_has_children boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint planner_settings_anchor_is_monday check (
    extract(isodow from family_week_anchor) = 1
  )
);
alter table public.planner_settings enable row level security;
alter table public.planner_settings force row level security;
revoke all on table public.planner_settings from public, anon;
grant select, insert, update, delete on table public.planner_settings to authenticated;
grant all on table public.planner_settings to service_role;
create policy "Users can select their own planner settings"
  on public.planner_settings for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own planner settings"
  on public.planner_settings for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own planner settings"
  on public.planner_settings for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own planner settings"
  on public.planner_settings for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
