create table if not exists public.site_showcase_projects (
  slug text primary key,
  name text not null,
  category text not null,
  description text not null,
  tech text[] not null default '{}',
  goals text[] not null default '{}',
  features text[] not null default '{}',
  image_path text not null,
  image_alt text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_showcase_projects enable row level security;

drop policy if exists "Public can view showcase projects" on public.site_showcase_projects;
drop policy if exists "Authenticated users can manage showcase projects" on public.site_showcase_projects;
drop policy if exists "Admins can manage showcase projects" on public.site_showcase_projects;

create policy "Public can view showcase projects"
on public.site_showcase_projects
for select
to anon, authenticated
using (true);

create policy "Admins can manage showcase projects"
on public.site_showcase_projects
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_showcase_projects to anon, authenticated;
grant insert, update, delete on public.site_showcase_projects to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-showcase-images',
  'site-showcase-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view showcase images" on storage.objects;
drop policy if exists "Authenticated users can upload showcase images" on storage.objects;
drop policy if exists "Authenticated users can update showcase images" on storage.objects;
drop policy if exists "Authenticated users can delete showcase images" on storage.objects;
drop policy if exists "Admins can upload showcase images" on storage.objects;
drop policy if exists "Admins can update showcase images" on storage.objects;
drop policy if exists "Admins can delete showcase images" on storage.objects;

create policy "Public can view showcase images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'site-showcase-images');

create policy "Admins can upload showcase images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'site-showcase-images' and public.is_site_admin());

create policy "Admins can update showcase images"
on storage.objects
for update
to authenticated
using (bucket_id = 'site-showcase-images' and public.is_site_admin())
with check (bucket_id = 'site-showcase-images' and public.is_site_admin());

create policy "Admins can delete showcase images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'site-showcase-images' and public.is_site_admin());
