create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  event_date date not null,
  start_time time,
  notes text check (notes is null or char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.health_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  plan_type text not null check (plan_type in ('food', 'training')),
  title text not null check (char_length(title) between 1 and 240),
  details text check (details is null or char_length(details) <= 2000),
  completed boolean not null default false,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.health_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  habit_type text not null default 'general' check (habit_type in ('general', 'food', 'training')),
  active boolean not null default true,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);
create table public.health_habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null,
  log_date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, habit_id, log_date),
  foreign key (habit_id, user_id)
    references public.health_habits(id, user_id)
    on delete cascade
);
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  ingredients text not null default '' check (char_length(ingredients) <= 5000),
  instructions text not null default '' check (char_length(instructions) <= 8000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  completed boolean not null default false,
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index calendar_events_user_date_idx on public.calendar_events(user_id, event_date);
create index health_plans_user_date_type_idx on public.health_plans(user_id, plan_date, plan_type);
create index health_habits_user_type_idx on public.health_habits(user_id, habit_type, position);
create index health_habit_logs_user_date_idx on public.health_habit_logs(user_id, log_date);
create index recipes_user_created_idx on public.recipes(user_id, created_at desc);
create index shopping_items_user_position_idx on public.shopping_items(user_id, position);
alter table public.calendar_events enable row level security;
alter table public.calendar_events force row level security;
alter table public.health_plans enable row level security;
alter table public.health_plans force row level security;
alter table public.health_habits enable row level security;
alter table public.health_habits force row level security;
alter table public.health_habit_logs enable row level security;
alter table public.health_habit_logs force row level security;
alter table public.recipes enable row level security;
alter table public.recipes force row level security;
alter table public.shopping_items enable row level security;
alter table public.shopping_items force row level security;
revoke all on table public.calendar_events from public, anon;
revoke all on table public.health_plans from public, anon;
revoke all on table public.health_habits from public, anon;
revoke all on table public.health_habit_logs from public, anon;
revoke all on table public.recipes from public, anon;
revoke all on table public.shopping_items from public, anon;
grant select, insert, update, delete on table public.calendar_events to authenticated;
grant select, insert, update, delete on table public.health_plans to authenticated;
grant select, insert, update, delete on table public.health_habits to authenticated;
grant select, insert, update, delete on table public.health_habit_logs to authenticated;
grant select, insert, update, delete on table public.recipes to authenticated;
grant select, insert, update, delete on table public.shopping_items to authenticated;
grant all on table public.calendar_events to service_role;
grant all on table public.health_plans to service_role;
grant all on table public.health_habits to service_role;
grant all on table public.health_habit_logs to service_role;
grant all on table public.recipes to service_role;
grant all on table public.shopping_items to service_role;
create policy "Users can select their own calendar events"
  on public.calendar_events for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own calendar events"
  on public.calendar_events for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own calendar events"
  on public.calendar_events for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own calendar events"
  on public.calendar_events for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can select their own health plans"
  on public.health_plans for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own health plans"
  on public.health_plans for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own health plans"
  on public.health_plans for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own health plans"
  on public.health_plans for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can select their own health habits"
  on public.health_habits for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own health habits"
  on public.health_habits for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own health habits"
  on public.health_habits for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own health habits"
  on public.health_habits for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can select their own habit logs"
  on public.health_habit_logs for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own habit logs"
  on public.health_habit_logs for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own habit logs"
  on public.health_habit_logs for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own habit logs"
  on public.health_habit_logs for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can select their own recipes"
  on public.recipes for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own recipes"
  on public.recipes for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own recipes"
  on public.recipes for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own recipes"
  on public.recipes for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can select their own shopping items"
  on public.shopping_items for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own shopping items"
  on public.shopping_items for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own shopping items"
  on public.shopping_items for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own shopping items"
  on public.shopping_items for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
