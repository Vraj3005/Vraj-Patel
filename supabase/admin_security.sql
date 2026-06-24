-- ====================================================================
-- SUPABASE POSTGRESQL DATABASE SECURITY & RLS POLICIES MIGRATION
-- Run this script inside your Supabase SQL Editor to secure all tables.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. Enable Row-Level Security (RLS) on all core tables
-- --------------------------------------------------------------------
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 2. Contact Inquiries (contact_messages)
-- --------------------------------------------------------------------
-- Public visitors must be allowed to submit inquiries.
-- Only the authorized admin email can view, update, or delete entries.
DROP POLICY IF EXISTS "Allow anonymous message inserts" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin to read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin to update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Allow admin to delete contact messages" ON contact_messages;

CREATE POLICY "Allow anonymous message inserts" ON contact_messages 
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin to read contact messages" ON contact_messages 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin to update contact messages" ON contact_messages 
  FOR UPDATE TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin to delete contact messages" ON contact_messages 
  FOR DELETE TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 3. AI Chat Sessions (ai_chat_sessions)
-- --------------------------------------------------------------------
-- Anyone can start a session (anonymous inserts).
-- Only the admin can inspect sessions history logs.
DROP POLICY IF EXISTS "Allow anonymous chat session inserts" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Allow admin to read chat sessions" ON ai_chat_sessions;
DROP POLICY IF EXISTS "Allow admin to manage chat sessions" ON ai_chat_sessions;

CREATE POLICY "Allow anonymous chat session inserts" ON ai_chat_sessions 
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin to read chat sessions" ON ai_chat_sessions 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin to manage chat sessions" ON ai_chat_sessions 
  FOR ALL TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 4. AI Chat Messages (ai_chat_messages)
-- --------------------------------------------------------------------
-- Anyone can append queries/answers to a session.
-- Only the admin can read other visitors' conversations.
DROP POLICY IF EXISTS "Allow anonymous chat message inserts" ON ai_chat_messages;
DROP POLICY IF EXISTS "Allow admin to read chat messages" ON ai_chat_messages;
DROP POLICY IF EXISTS "Allow admin to manage chat messages" ON ai_chat_messages;

CREATE POLICY "Allow anonymous chat message inserts" ON ai_chat_messages 
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin to read chat messages" ON ai_chat_messages 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin to manage chat messages" ON ai_chat_messages 
  FOR ALL TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 5. Analytics Events & Telemetry Logs (analytics_events)
-- --------------------------------------------------------------------
-- Anyone can report page views, clicks, etc.
-- Only the admin can inspect analytics metrics.
DROP POLICY IF EXISTS "Allow anonymous event inserts" ON analytics_events;
DROP POLICY IF EXISTS "Allow admin to read events" ON analytics_events;
DROP POLICY IF EXISTS "Allow admin to manage events" ON analytics_events;

CREATE POLICY "Allow anonymous event inserts" ON analytics_events 
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin to read events" ON analytics_events 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin to manage events" ON analytics_events 
  FOR ALL TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 6. Resume Download Trackers (resume_downloads)
-- --------------------------------------------------------------------
-- Logging downloads is open. Viewing counts is protected.
DROP POLICY IF EXISTS "Allow anonymous downloads logging" ON resume_downloads;
DROP POLICY IF EXISTS "Allow admin to read downloads" ON resume_downloads;

CREATE POLICY "Allow anonymous downloads logging" ON resume_downloads 
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow admin to read downloads" ON resume_downloads 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 7. Public Content Tables (projects, skills, blog_posts)
-- --------------------------------------------------------------------
-- Anyone can view projects, skills, and published blogs.
-- Only the admin (Vraj) can insert, update, or delete elements.

-- A. Projects
DROP POLICY IF EXISTS "Allow public read projects" ON projects;
DROP POLICY IF EXISTS "Allow admin manage projects" ON projects;
CREATE POLICY "Allow public read projects" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin manage projects" ON projects FOR ALL TO authenticated 
  USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- B. Skills
DROP POLICY IF EXISTS "Allow public read skills" ON skills;
DROP POLICY IF EXISTS "Allow admin manage skills" ON skills;
CREATE POLICY "Allow public read skills" ON skills FOR SELECT TO public USING (true);
CREATE POLICY "Allow admin manage skills" ON skills FOR ALL TO authenticated 
  USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- C. Blog Posts (Research Notes)
DROP POLICY IF EXISTS "Allow public read published blogs" ON blog_posts;
DROP POLICY IF EXISTS "Allow admin read all blogs" ON blog_posts;
DROP POLICY IF EXISTS "Allow admin manage blogs" ON blog_posts;

CREATE POLICY "Allow public read published blogs" ON blog_posts 
  FOR SELECT TO public USING (status = 'published');

CREATE POLICY "Allow admin read all blogs" ON blog_posts 
  FOR SELECT TO authenticated 
  USING (exists (select 1 from public.admin_users where id = auth.uid()));

CREATE POLICY "Allow admin manage blogs" ON blog_posts 
  FOR ALL TO authenticated 
  USING (exists (select 1 from public.admin_users where id = auth.uid()));

-- --------------------------------------------------------------------
-- 8. Audit Log Automation Trigger (Optional Setup)
-- --------------------------------------------------------------------
-- Create audit log helper log traces if you want to track changes
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  admin_email TEXT NOT NULL,
  action_performed TEXT NOT NULL,
  target_table TEXT NOT NULL,
  record_id TEXT
);

ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin read logs" ON admin_audit_logs 
  FOR SELECT TO authenticated USING (exists (select 1 from public.admin_users where id = auth.uid()));
CREATE POLICY "Allow admin insert logs" ON admin_audit_logs 
  FOR INSERT TO authenticated WITH CHECK (exists (select 1 from public.admin_users where id = auth.uid()));
