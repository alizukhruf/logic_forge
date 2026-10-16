create table if not exists public.site_contact_info (
  id text primary key check (id = 'public'),
  phone text not null,
  email text not null,
  telegram_username text not null default '@ZenVicSolutions',
  telegram_url text not null default 'https://t.me/ZenVicSolutions',
  facebook_username text not null default 'Zenvic Solutions Page',
  facebook_url text not null default 'https://www.facebook.com/zenvicsolutions',
  instagram_username text not null default '@zenvicsolutions',
  instagram_url text not null default 'https://www.instagram.com/zenvicsolutions/',
  linkedin_username text not null default 'Zenvic Solutions',
  linkedin_url text not null default 'https://www.linkedin.com/company/zenvic-solutions/',
  updated_at timestamptz not null default now()
);

alter table public.site_contact_info
  add column if not exists telegram_username text not null default '@ZenVicSolutions',
  add column if not exists telegram_url text not null default 'https://t.me/ZenVicSolutions',
  add column if not exists facebook_username text not null default 'Zenvic Solutions Page',
  add column if not exists facebook_url text not null default 'https://www.facebook.com/zenvicsolutions',
  add column if not exists instagram_username text not null default '@zenvicsolutions',
  add column if not exists instagram_url text not null default 'https://www.instagram.com/zenvicsolutions/',
  add column if not exists linkedin_username text not null default 'Zenvic Solutions',
  add column if not exists linkedin_url text not null default 'https://www.linkedin.com/company/zenvic-solutions/';

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

insert into public.site_contact_info (
  id, phone, email,
  telegram_username, telegram_url,
  facebook_username, facebook_url,
  instagram_username, instagram_url,
  linkedin_username, linkedin_url
)
values (
  'public', '923440418249', 'alizukhruf07@gmail.com',
  '@ZenVicSolutions', 'https://t.me/ZenVicSolutions',
  'Zenvic Solutions Page', 'https://www.facebook.com/zenvicsolutions',
  '@zenvicsolutions', 'https://www.instagram.com/zenvicsolutions/',
  'Zenvic Solutions', 'https://www.linkedin.com/company/zenvic-solutions/'
)
on conflict (id) do nothing;
