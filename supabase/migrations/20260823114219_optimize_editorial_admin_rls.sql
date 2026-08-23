-- Follow-up hardening from the Supabase Postgres review:
-- - the helper only reads the caller's JWT, so it does not need definer rights
-- - init-plan wrappers evaluate the admin claim once per statement
-- - the auth.users foreign key gets its own lookup/cascade index

create or replace function public.is_staden_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

create index if not exists editorial_posts_created_by_idx
  on public.editorial_posts (created_by)
  where created_by is not null;

drop policy "admins manage editorial posts" on public.editorial_posts;
create policy "admins manage editorial posts"
on public.editorial_posts
for all
to authenticated
using ((select public.is_staden_admin()))
with check ((select public.is_staden_admin()));

drop policy "admins manage editorial selections" on public.editorial_post_items;
create policy "admins manage editorial selections"
on public.editorial_post_items
for all
to authenticated
using ((select public.is_staden_admin()))
with check ((select public.is_staden_admin()));

drop policy "admins list editorial media" on storage.objects;
create policy "admins list editorial media"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'editorial-media'
  and (select public.is_staden_admin())
);

drop policy "admins upload editorial media to their folder" on storage.objects;
create policy "admins upload editorial media to their folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'editorial-media'
  and (select public.is_staden_admin())
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy "admins update their editorial media" on storage.objects;
create policy "admins update their editorial media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'editorial-media'
  and (select public.is_staden_admin())
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'editorial-media'
  and (select public.is_staden_admin())
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy "admins delete their editorial media" on storage.objects;
create policy "admins delete their editorial media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'editorial-media'
  and (select public.is_staden_admin())
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);
