-- Hardening RLS policies on public.system_events table
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert system_events" ON public.system_events;
DROP POLICY IF EXISTS "Allow admin manage system_events" ON public.system_events;
DROP POLICY IF EXISTS "Allow public read safe system_events" ON public.system_events;
DROP POLICY IF EXISTS "Allow admin read system_events" ON public.system_events;

-- 1. Public SELECT is restricted to safe public logs
CREATE POLICY "Allow public read safe system_events" ON public.system_events
  FOR SELECT TO public USING (is_public = true);

-- 2. Admin SELECT allows viewing all logs
CREATE POLICY "Allow admin read system_events" ON public.system_events
  FOR SELECT TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- 3. Admin ALL controls (update/delete) for database cleanup
CREATE POLICY "Allow admin manage system_events" ON public.system_events
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Note: No INSERT policy is created for public or authenticated roles.
-- This ensures that only the Server/service_role client can insert system events.
