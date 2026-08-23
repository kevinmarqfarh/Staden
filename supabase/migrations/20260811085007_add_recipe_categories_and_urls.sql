create table public.recipe_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 50),
  position bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  unique (user_id, name)
);
alter table public.recipes
  add column url text
    check (
      url is null
      or (
        char_length(url) <= 2048
        and url ~* '^https?://'
      )
    ),
  add column category_id uuid;
alter table public.recipes
  add constraint recipes_category_owner_fkey
  foreign key (category_id, user_id)
  references public.recipe_categories(id, user_id);
create index recipe_categories_user_position_idx
  on public.recipe_categories(user_id, position, created_at);
create index recipes_user_category_created_idx
  on public.recipes(user_id, category_id, created_at desc);
alter table public.recipe_categories enable row level security;
alter table public.recipe_categories force row level security;
revoke all on table public.recipe_categories from public, anon;
grant select, insert, update, delete on table public.recipe_categories to authenticated;
grant all on table public.recipe_categories to service_role;
create policy "Users can select their own recipe categories"
  on public.recipe_categories for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can insert their own recipe categories"
  on public.recipe_categories for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can update their own recipe categories"
  on public.recipe_categories for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "Users can delete their own recipe categories"
  on public.recipe_categories for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
