do $migration$
declare
  realtime_table text;
  realtime_tables text[] := array[
    'user_profiles',
    'project_inquiries',
    'inquiry_messages',
    'site_services',
    'site_showcase_projects',
    'site_contact_info'
  ];
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    raise exception 'Supabase Realtime publication "supabase_realtime" is unavailable.';
  end if;

  foreach realtime_table in array realtime_tables loop
    if to_regclass(format('public.%I', realtime_table)) is null then
      raise exception 'Required table public.% is missing. Run its setup SQL before this migration.', realtime_table;
    end if;

    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = realtime_table
    ) then
      execute format('alter publication supabase_realtime add table public.%I', realtime_table);
    end if;
  end loop;
end;
$migration$;
