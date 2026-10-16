create table if not exists public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  business_name text,
  service text not null,
  budget text,
  timeline text,
  details text not null,
  is_read boolean not null default false,
  status text not null default 'new'
);

alter table public.project_inquiries enable row level security;

alter table public.project_inquiries
  add column if not exists is_read boolean not null default false,
  add column if not exists status text not null default 'new',
  add column if not exists user_id uuid references auth.users(id) on delete set null;

update public.project_inquiries
set status = 'new'
where status is null or status not in ('new', 'processing', 'completed', 'rejected', 'closed');

alter table public.project_inquiries
  alter column status set default 'new';

alter table public.project_inquiries
  drop constraint if exists project_inquiries_status_check;

alter table public.project_inquiries
  add constraint project_inquiries_status_check
  check (status in ('new', 'processing', 'completed', 'rejected', 'closed'));

update public.project_inquiries as inquiry
set user_id = auth_user.id
from auth.users as auth_user
where inquiry.user_id is null
  and lower(inquiry.email) = lower(auth_user.email);

drop policy if exists "Allow anonymous inserts" on public.project_inquiries;
drop policy if exists "Allow inquiry submissions" on public.project_inquiries;
drop policy if exists "Authenticated users can view inquiries" on public.project_inquiries;
drop policy if exists "Authenticated users can update inquiries" on public.project_inquiries;
drop policy if exists "Authenticated users can delete inquiries" on public.project_inquiries;
drop policy if exists "Users and guests can submit inquiries" on public.project_inquiries;
drop policy if exists "Only admins can view inquiries" on public.project_inquiries;
drop policy if exists "Users can view their own inquiries" on public.project_inquiries;
drop policy if exists "Only admins can update inquiries" on public.project_inquiries;
drop policy if exists "Only admins can delete inquiries" on public.project_inquiries;

create policy "Users and guests can submit inquiries"
on public.project_inquiries
for insert
to anon, authenticated
with check (
  (auth.uid() is null and user_id is null)
  or (auth.uid() is not null and (user_id is null or user_id = auth.uid()))
);

create policy "Only admins can view inquiries"
on public.project_inquiries
for select
to authenticated
using (public.is_site_admin());

create policy "Users can view their own inquiries"
on public.project_inquiries
for select
to authenticated
using (user_id = auth.uid());

create policy "Only admins can update inquiries"
on public.project_inquiries
for update
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

create policy "Only admins can delete inquiries"
on public.project_inquiries
for delete
to authenticated
using (public.is_site_admin());

grant usage on schema public to anon, authenticated;
grant insert on public.project_inquiries to anon, authenticated;
grant select, update, delete on public.project_inquiries to authenticated;

create table if not exists public.inquiry_messages (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.project_inquiries(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  sender_role text not null check (sender_role in ('user', 'admin')),
  body text not null check (char_length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.inquiry_messages enable row level security;

drop policy if exists "Inquiry participants can read messages" on public.inquiry_messages;
drop policy if exists "Inquiry participants can send messages" on public.inquiry_messages;

create policy "Inquiry participants can read messages"
on public.inquiry_messages
for select
to authenticated
using (
  public.is_site_admin()
  or exists (
    select 1
    from public.project_inquiries inquiry
    where inquiry.id = inquiry_id
      and inquiry.user_id = auth.uid()
  )
);

create policy "Inquiry participants can send messages"
on public.inquiry_messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and (
    (sender_role = 'admin' and public.is_site_admin())
    or (
      sender_role = 'user'
      and exists (
        select 1
        from public.project_inquiries inquiry
        where inquiry.id = inquiry_id
          and inquiry.user_id = auth.uid()
      )
    )
  )
);

grant select, insert on public.inquiry_messages to authenticated;
