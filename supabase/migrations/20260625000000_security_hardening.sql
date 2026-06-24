-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE SECURITY & RLS POLICIES MIGRATION
-- Hardening Phase: Consolidated Dynamic RLS & Admin Validation
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Create admin_users Table (No email is hardcoded inside SQL checks)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop duplicate select policies for admin_users
DROP POLICY IF EXISTS "Allow select admin_users for admin" ON public.admin_users;
DROP POLICY IF EXISTS "Allow authenticated read admin_users" ON public.admin_users;

-- Establish select policy for admin_users
CREATE POLICY "Allow authenticated read admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow admin manage admin_users" ON public.admin_users
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- --------------------------------------------------------------------
-- 2. Consolidate & Clean competing policies on private/log tables
-- --------------------------------------------------------------------

-- Table: contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin read/write contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow anonymous message inserts" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin to update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admin to delete contact messages" ON public.contact_messages;

CREATE POLICY "Allow anonymous insert contact_messages" ON public.contact_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage contact_messages" ON public.contact_messages
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: ai_chat_sessions
ALTER TABLE public.ai_chat_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert ai_chat_sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous read own ai_chat_sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Allow admin read/write ai_chat_sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Allow anonymous chat session inserts" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Allow admin to read chat sessions" ON public.ai_chat_sessions;
DROP POLICY IF EXISTS "Allow admin to manage chat sessions" ON public.ai_chat_sessions;

CREATE POLICY "Allow anonymous insert ai_chat_sessions" ON public.ai_chat_sessions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage ai_chat_sessions" ON public.ai_chat_sessions
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: ai_chat_messages
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert ai_chat_messages" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Allow anonymous read own ai_chat_messages" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Allow admin read/write ai_chat_messages" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Allow anonymous chat message inserts" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Allow admin to read chat messages" ON public.ai_chat_messages;
DROP POLICY IF EXISTS "Allow admin to manage chat messages" ON public.ai_chat_messages;

CREATE POLICY "Allow anonymous insert ai_chat_messages" ON public.ai_chat_messages
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage ai_chat_messages" ON public.ai_chat_messages
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: system_events
ALTER TABLE public.system_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert system_events" ON public.system_events;
DROP POLICY IF EXISTS "Allow admin read/write system_events" ON public.system_events;
DROP POLICY IF EXISTS "Allow public read safe system_events" ON public.system_events;

CREATE POLICY "Allow anonymous insert system_events" ON public.system_events
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage system_events" ON public.system_events
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: request_traces
ALTER TABLE public.request_traces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert request_traces" ON public.request_traces;
DROP POLICY IF EXISTS "Allow public read aggregate request duration" ON public.request_traces;
DROP POLICY IF EXISTS "Allow admin read/write request_traces" ON public.request_traces;

CREATE POLICY "Allow anonymous insert request_traces" ON public.request_traces
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage request_traces" ON public.request_traces
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: resume_downloads
ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert resume_downloads" ON public.resume_downloads;
DROP POLICY IF EXISTS "Allow admin read resume_downloads" ON public.resume_downloads;
DROP POLICY IF EXISTS "Allow anonymous downloads logging" ON public.resume_downloads;
DROP POLICY IF EXISTS "Allow admin to read downloads" ON public.resume_downloads;

CREATE POLICY "Allow anonymous insert resume_downloads" ON public.resume_downloads
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage resume_downloads" ON public.resume_downloads
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow admin read analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow anonymous event inserts" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow admin to read events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow admin to manage events" ON public.analytics_events;

CREATE POLICY "Allow anonymous insert analytics_events" ON public.analytics_events
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage analytics_events" ON public.analytics_events
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: cli_command_logs
ALTER TABLE public.cli_command_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert cli_command_logs" ON public.cli_command_logs;
DROP POLICY IF EXISTS "Allow admin read/write cli_command_logs" ON public.cli_command_logs;

CREATE POLICY "Allow anonymous insert cli_command_logs" ON public.cli_command_logs
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin manage cli_command_logs" ON public.cli_command_logs
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: admin_notes
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admin read/write admin_notes" ON public.admin_notes;

CREATE POLICY "Allow admin manage admin_notes" ON public.admin_notes
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- --------------------------------------------------------------------
-- 3. Update public content tables to enforce admin_users verification
-- --------------------------------------------------------------------

-- Table: projects
DROP POLICY IF EXISTS "Allow admin full write projects" ON public.projects;
DROP POLICY IF EXISTS "Allow admin manage projects" ON public.projects;
CREATE POLICY "Allow admin manage projects" ON public.projects
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: profiles
DROP POLICY IF EXISTS "Allow admin write profiles" ON public.profiles;
CREATE POLICY "Allow admin manage profiles" ON public.profiles
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: skill_categories
DROP POLICY IF EXISTS "Allow admin write skill_categories" ON public.skill_categories;
CREATE POLICY "Allow admin manage skill_categories" ON public.skill_categories
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: skills
DROP POLICY IF EXISTS "Allow admin write skills" ON public.skills;
CREATE POLICY "Allow admin manage skills" ON public.skills
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: project_features
DROP POLICY IF EXISTS "Allow admin write project_features" ON public.project_features;
CREATE POLICY "Allow admin manage project_features" ON public.project_features
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: project_tech_stack
DROP POLICY IF EXISTS "Allow admin write project_tech_stack" ON public.project_tech_stack;
CREATE POLICY "Allow admin manage project_tech_stack" ON public.project_tech_stack
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: project_links
DROP POLICY IF EXISTS "Allow admin write project_links" ON public.project_links;
CREATE POLICY "Allow admin manage project_links" ON public.project_links
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: case_studies
DROP POLICY IF EXISTS "Allow admin write case_studies" ON public.case_studies;
CREATE POLICY "Allow admin manage case_studies" ON public.case_studies
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: testimonials
DROP POLICY IF EXISTS "Allow admin write testimonials" ON public.testimonials;
CREATE POLICY "Allow admin manage testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: blog_posts
DROP POLICY IF EXISTS "Allow admin write blog" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow admin manage blogs" ON public.blog_posts;
CREATE POLICY "Allow admin manage blog_posts" ON public.blog_posts
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: project_architectures
DROP POLICY IF EXISTS "Allow admin write project_architectures" ON public.project_architectures;
CREATE POLICY "Allow admin manage project_architectures" ON public.project_architectures
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: project_data_flows
DROP POLICY IF EXISTS "Allow admin write project_data_flows" ON public.project_data_flows;
CREATE POLICY "Allow admin manage project_data_flows" ON public.project_data_flows
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: security_layers
DROP POLICY IF EXISTS "Allow admin write security_layers" ON public.security_layers;
CREATE POLICY "Allow admin manage security_layers" ON public.security_layers
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: metrics_snapshots
DROP POLICY IF EXISTS "Allow admin write metrics_snapshots" ON public.metrics_snapshots;
CREATE POLICY "Allow admin manage metrics_snapshots" ON public.metrics_snapshots
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- Table: github_contributions_cache
DROP POLICY IF EXISTS "Allow admin write github_contributions_cache" ON public.github_contributions_cache;
CREATE POLICY "Allow admin manage github_contributions_cache" ON public.github_contributions_cache
  FOR ALL TO authenticated USING (
    exists (select 1 from public.admin_users where id = auth.uid())
  );
