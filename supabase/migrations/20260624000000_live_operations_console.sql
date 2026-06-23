-- Alter system_events to add is_public flag
alter table public.system_events add column if not exists is_public boolean default true not null;

-- Drop policy if exists and create select policy for public system_events
drop policy if exists "Allow public read safe system_events" on public.system_events;
create policy "Allow public read safe system_events" on public.system_events 
  for select using (is_public = true);

-- Add retention strategy function: prune logs older than 7 days
create or replace function public.prune_old_system_events()
returns trigger as $$
begin
  delete from public.system_events where created_at < now() - interval '7 days';
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to prune old events on insert (simple self-retention)
drop trigger if exists trigger_prune_old_system_events on public.system_events;
create trigger trigger_prune_old_system_events
  after insert on public.system_events
  for each statement
  execute procedure public.prune_old_system_events();

-- Enable Realtime replication for system_events table safely
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_rel pr 
      join pg_class c on c.oid = pr.prrelid 
      join pg_publication p on p.oid = pr.prpubid 
      where p.pubname = 'supabase_realtime' and c.relname = 'system_events'
    ) then
      alter publication supabase_realtime add table public.system_events;
    end if;
  end if;
end $$;
