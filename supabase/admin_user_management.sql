create or replace function public.delete_site_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  target_role text;
begin
  if auth.uid() is null or not public.is_site_admin() then
    raise exception 'Only site administrators can delete user accounts.'
      using errcode = '42501';
  end if;

  if target_user_id is null then
    raise exception 'A user account is required.'
      using errcode = '22023';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Administrators cannot delete their own account.'
      using errcode = '42501';
  end if;

  select role
  into target_role
  from public.user_profiles
  where id = target_user_id;

  if not found then
    raise exception 'The requested user account does not exist.'
      using errcode = 'P0002';
  end if;

  if target_role is distinct from 'user' then
    raise exception 'Administrator accounts cannot be deleted here.'
      using errcode = '42501';
  end if;

  delete from auth.users
  where id = target_user_id;

  if not found then
    raise exception 'The requested authentication account does not exist.'
      using errcode = 'P0002';
  end if;
end;
$$;

revoke all on function public.delete_site_user(uuid) from public, anon;
grant execute on function public.delete_site_user(uuid) to authenticated;
