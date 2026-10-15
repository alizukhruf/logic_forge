create table if not exists public.site_contact_info (
  id text primary key check (id = 'public'),
  phone text not null,
  email text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_contact_info enable row level security;

drop policy if exists "Public can view contact info" on public.site_contact_info;
drop policy if exists "Authenticated users can manage contact info" on public.site_contact_info;
drop policy if exists "Admins can manage contact info" on public.site_contact_info;

create policy "Public can view contact info"
on public.site_contact_info
for select
to anon, authenticated
using (true);

create policy "Admins can manage contact info"
on public.site_contact_info
for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

grant usage on schema public to anon, authenticated;
grant select on public.site_contact_info to anon, authenticated;
grant insert, update, delete on public.site_contact_info to authenticated;

insert into public.site_contact_info (id, phone, email)
values ('public', '923440418249', 'alizukhruf07@gmail.com')
on conflict (id) do nothing;
