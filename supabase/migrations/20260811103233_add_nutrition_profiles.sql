create table public.nutrition_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sex text not null default 'male' check (sex in ('female', 'male')),
  age smallint not null default 30 check (age between 18 and 100),
  height_cm numeric(5, 1) not null default 180 check (height_cm between 100 and 250),
  weight_kg numeric(5, 1) not null default 80 check (weight_kg between 30 and 350),
  activity_level text not null default 'moderate' check (activity_level in ('low', 'moderate', 'active')),
  goal text not null default 'maintain' check (goal in ('lose', 'maintain', 'gain')),
  supplement_notes text not null default '' check (char_length(supplement_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.nutrition_profiles enable row level security;
alter table public.nutrition_profiles force row level security;
revoke all on table public.nutrition_profiles from public, anon;
grant select, insert, update, delete on table public.nutrition_profiles to authenticated;
grant all on table public.nutrition_profiles to service_role;
create policy "Users can select their own nutrition profile"
  on public.nutrition_profiles for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own nutrition profile"
  on public.nutrition_profiles for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own nutrition profile"
  on public.nutrition_profiles for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own nutrition profile"
  on public.nutrition_profiles for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
