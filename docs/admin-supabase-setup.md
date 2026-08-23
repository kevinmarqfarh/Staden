# STADEN admin — Supabase setup

The `/admin` workspace works in a local preview mode on `localhost`. Cloud publishing is deliberately unavailable until a Supabase user has the server-controlled `admin` role and the editorial migration has been applied.

## 1. Apply the migration

Review `supabase/migrations/20260823112422_editorial_admin_workspace.sql`, then apply it through the linked Supabase CLI project:

```bash
npx supabase db push --linked
```

The migration creates:

- `editorial_posts` and `editorial_post_items`
- RLS for public published content and authenticated admins
- the public `editorial-media` bucket with a 5 MB image limit
- admin-only upload, update, delete and listing policies

## 2. Create the first admin

Create the user through Supabase Auth, then assign the role with a trusted server/admin context. Do not put this operation in browser code.

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
  || '{"role":"admin"}'::jsonb
where email = 'replace-with-the-admin-email@example.com';
```

The user must sign out and back in so the refreshed JWT contains the claim.

## 3. Data API exposure

New Supabase projects may require tables to be explicitly exposed in the Data API settings. Keep `public` exposed for these two tables, or move them to a dedicated exposed schema and update the client. SQL grants and RLS are both required; grants do not bypass RLS.

## Security model

- The browser checks `user.app_metadata.role` for useful UI feedback.
- RLS calls `is_staden_admin()` for every write and is the actual authority.
- The publishable key is safe for the browser; never expose the service-role key.
- Storage uploads are limited by MIME type, size and the authenticated user's folder.
- Local drafts are browser-local and are not a backup or collaboration system.
