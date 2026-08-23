create table public.workout_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_date date not null,
  exercise_key text not null default 'other'
    check (char_length(exercise_key) between 1 and 50),
  exercise_name text not null
    check (char_length(btrim(exercise_name)) between 1 and 120),
  exercise_type text not null
    check (exercise_type in ('cardio', 'strength', 'other')),
  duration_minutes numeric(6, 1)
    check (duration_minutes is null or duration_minutes between 0.1 and 1440),
  intensity_level numeric(6, 1)
    check (intensity_level is null or intensity_level between 0 and 100),
  heart_rate integer
    check (heart_rate is null or heart_rate between 30 and 260),
  weight_kg numeric(7, 2)
    check (weight_kg is null or weight_kg between 0 and 1000),
  sets integer
    check (sets is null or sets between 1 and 100),
  reps integer
    check (reps is null or reps between 1 and 1000),
  rpe numeric(3, 1)
    check (rpe is null or rpe between 1 and 10),
  notes text not null default ''
    check (char_length(notes) <= 500),
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workout_entries_user_date_position_idx
  on public.workout_entries(user_id, workout_date, position);
alter table public.workout_entries enable row level security;
alter table public.workout_entries force row level security;
revoke all on table public.workout_entries from public, anon, authenticated;
grant select, insert, update, delete on table public.workout_entries to authenticated;
grant all on table public.workout_entries to service_role;
create policy "Users can select their own workout entries"
  on public.workout_entries for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own workout entries"
  on public.workout_entries for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own workout entries"
  on public.workout_entries for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own workout entries"
  on public.workout_entries for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
