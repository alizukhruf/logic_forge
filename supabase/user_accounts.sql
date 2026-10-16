create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;
grant execute on function public.is_site_admin() to anon;

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.user_profiles (id, email, full_name, phone, created_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    new.created_at
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      phone = excluded.phone;
  return new;
end;
$$;

revoke all on function public.handle_new_user_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();

insert into public.user_profiles (id, email, full_name, phone, created_at)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'full_name', ''),
  coalesce(raw_user_meta_data ->> 'phone', ''),
  created_at
from auth.users
on conflict (id) do nothing;

drop policy if exists "Users can view own profile or admins can view all" on public.user_profiles;
create policy "Users can view own profile or admins can view all"
on public.user_profiles
for select
to authenticated
using (id = auth.uid() or public.is_site_admin());

grant usage on schema public to authenticated;
revoke all on public.user_profiles from anon, authenticated;
grant select on public.user_profiles to authenticated;
grant update (full_name, phone) on public.user_profiles to authenticated;

drop policy if exists "Users can update own profile or admins can update all" on public.user_profiles;
create policy "Users can update own profile or admins can update all"
on public.user_profiles
for update
to authenticated
using (id = auth.uid() or public.is_site_admin())
with check (id = auth.uid() or public.is_site_admin());

create or replace function public.validate_user_profile_phone()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if new.phone = '' then
    return new;
  end if;

  if new.phone !~ '^\+?[\d\s().-]+$'
    or length(regexp_replace(new.phone, '[^0-9]', '', 'g')) not between 7 and 15 then
    raise exception 'Enter a phone number with 7 to 15 digits using standard phone punctuation.'
      using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_user_profile_phone on public.user_profiles;
create trigger validate_user_profile_phone
before insert or update of phone on public.user_profiles
for each row execute procedure public.validate_user_profile_phone();
