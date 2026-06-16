-- Supabase PostgreSQL Migration: 20260617000000_init_schema.sql
-- Senior Backend Architect Database Setup for Vraj Patel's Portfolio

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. Create Enums & Types
-- ==========================================

create type project_category as enum (
  'client_software', 
  'erp_system', 
  'ecommerce', 
  'ai_automation', 
  'quant_research', 
  'website', 
  'dashboard'
);

create type publish_status as enum (
  'draft', 
  'published', 
  'archived'
);

create type contact_message_status as enum (
  'new', 
  'reviewed', 
  'replied', 
  'archived'
);

create type chat_message_role as enum (
  'user', 
  'assistant', 
  'system'
);

create type skill_proficiency as enum (
  'expert', 
  'advanced', 
  'intermediate'
);

-- ==========================================
-- 2. Create Trigger Function for updated_at
-- ==========================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- ==========================================
-- 3. Create Tables
-- ==========================================

-- Table: profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text unique not null,
  avatar_url text,
  bio text,
  cv_url text
);

-- Table: skill_categories
create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  display_order integer default 0
);

-- Table: skills
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  category_id uuid references public.skill_categories(id) on delete cascade not null,
  name text not null unique,
  proficiency_level skill_proficiency default 'intermediate'::skill_proficiency
);

-- Table: projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  slug text unique not null,
  title text not null,
  short_description text not null,
  description text not null,
  category project_category default 'client_software'::project_category not null,
  featured boolean default false not null,
  status publish_status default 'draft'::publish_status not null,
  banner_image_url text
);

-- Table: project_features
create table public.project_features (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  feature_text text not null
);

-- Table: project_tech_stack
create table public.project_tech_stack (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  technology_name text not null
);

-- Table: project_links
create table public.project_links (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  label text not null,
  url text not null
);

-- Table: case_studies
create table public.case_studies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_id uuid references public.projects(id) on delete cascade not null unique,
  problem_statement text not null,
  implemented_solution text not null,
  architecture_markdown text
);

-- Table: blog_posts
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.profiles(id) on delete set null,
  slug text unique not null,
  title text not null,
  content text not null,
  cover_image_url text,
  status publish_status default 'draft'::publish_status not null
);

-- Table: contact_messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status contact_message_status default 'new'::contact_message_status not null,
  rate_limit_ip text,
  spam_token_checked boolean default false
);

-- Table: ai_chat_sessions
create table public.ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  user_ip text
);

-- Table: ai_chat_messages
create table public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  session_id uuid references public.ai_chat_sessions(id) on delete cascade not null,
  role chat_message_role not null,
  content text not null
);

-- Table: resume_downloads
create table public.resume_downloads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_ip text,
  referral_source text
);

-- Table: testimonials
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_name text not null,
  author_title text not null,
  author_company text,
  endorsement text not null,
  author_avatar_url text,
  status publish_status default 'draft'::publish_status not null
);

-- Table: analytics_events
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_name text not null,
  event_data jsonb,
  session_ip text
);

-- Table: admin_notes
create table public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  admin_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  note_body text not null
);

-- ==========================================
-- 4. Hook triggers for auto-updating updated_at
-- ==========================================

create trigger trigger_profiles_updated_at before update on public.profiles for each row execute procedure update_updated_at_column();
create trigger trigger_skill_categories_updated_at before update on public.skill_categories for each row execute procedure update_updated_at_column();
create trigger trigger_skills_updated_at before update on public.skills for each row execute procedure update_updated_at_column();
create trigger trigger_projects_updated_at before update on public.projects for each row execute procedure update_updated_at_column();
create trigger trigger_project_features_updated_at before update on public.project_features for each row execute procedure update_updated_at_column();
create trigger trigger_project_tech_stack_updated_at before update on public.project_tech_stack for each row execute procedure update_updated_at_column();
create trigger trigger_project_links_updated_at before update on public.project_links for each row execute procedure update_updated_at_column();
create trigger trigger_case_studies_updated_at before update on public.case_studies for each row execute procedure update_updated_at_column();
create trigger trigger_blog_posts_updated_at before update on public.blog_posts for each row execute procedure update_updated_at_column();
create trigger trigger_contact_messages_updated_at before update on public.contact_messages for each row execute procedure update_updated_at_column();
create trigger trigger_ai_chat_sessions_updated_at before update on public.ai_chat_sessions for each row execute procedure update_updated_at_column();
create trigger trigger_ai_chat_messages_updated_at before update on public.ai_chat_messages for each row execute procedure update_updated_at_column();
create trigger trigger_resume_downloads_updated_at before update on public.resume_downloads for each row execute procedure update_updated_at_column();
create trigger trigger_testimonials_updated_at before update on public.testimonials for each row execute procedure update_updated_at_column();
create trigger trigger_analytics_events_updated_at before update on public.analytics_events for each row execute procedure update_updated_at_column();
create trigger trigger_admin_notes_updated_at before update on public.admin_notes for each row execute procedure update_updated_at_column();

-- ==========================================
-- 5. Row Level Security (RLS) Settings
-- ==========================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_features enable row level security;
alter table public.project_tech_stack enable row level security;
alter table public.project_links enable row level security;
alter table public.case_studies enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.ai_chat_sessions enable row level security;
alter table public.ai_chat_messages enable row level security;
alter table public.resume_downloads enable row level security;
alter table public.testimonials enable row level security;
alter table public.analytics_events enable row level security;
alter table public.admin_notes enable row level security;

-- Policies: Profiles (Public Read / Admin Write)
create policy "Allow public read profiles" on public.profiles for select using (true);
create policy "Allow admin write profiles" on public.profiles for all using (auth.role() = 'authenticated');

-- Policies: Skill Categories & Skills (Public Read / Admin Write)
create policy "Allow public read skill_categories" on public.skill_categories for select using (true);
create policy "Allow admin write skill_categories" on public.skill_categories for all using (auth.role() = 'authenticated');
create policy "Allow public read skills" on public.skills for select using (true);
create policy "Allow admin write skills" on public.skills for all using (auth.role() = 'authenticated');

-- Policies: Projects, features, tech, links & case studies (Public select only if published / Admin full access)
create policy "Allow public read published projects" on public.projects for select using (status = 'published');
create policy "Allow admin full write projects" on public.projects for all using (auth.role() = 'authenticated');

create policy "Allow public read project_features" on public.project_features for select using (exists (select 1 from public.projects where projects.id = project_features.project_id and projects.status = 'published'));
create policy "Allow admin write project_features" on public.project_features for all using (auth.role() = 'authenticated');

create policy "Allow public read project_tech_stack" on public.project_tech_stack for select using (exists (select 1 from public.projects where projects.id = project_tech_stack.project_id and projects.status = 'published'));
create policy "Allow admin write project_tech_stack" on public.project_tech_stack for all using (auth.role() = 'authenticated');

create policy "Allow public read project_links" on public.project_links for select using (exists (select 1 from public.projects where projects.id = project_links.project_id and projects.status = 'published'));
create policy "Allow admin write project_links" on public.project_links for all using (auth.role() = 'authenticated');

create policy "Allow public read case_studies" on public.case_studies for select using (exists (select 1 from public.projects where projects.id = case_studies.project_id and projects.status = 'published'));
create policy "Allow admin write case_studies" on public.case_studies for all using (auth.role() = 'authenticated');

-- Policies: Testimonials (Public Read published / Admin Write)
create policy "Allow public read published testimonials" on public.testimonials for select using (status = 'published');
create policy "Allow admin write testimonials" on public.testimonials for all using (auth.role() = 'authenticated');

-- Policies: Blog posts (Public Read published / Admin Write)
create policy "Allow public read published blog" on public.blog_posts for select using (status = 'published');
create policy "Allow admin write blog" on public.blog_posts for all using (auth.role() = 'authenticated');

-- Policies: Contact messages (Public can insert / Admin full access / Public cannot select)
create policy "Allow anonymous insert contact_messages" on public.contact_messages for insert with check (true);
create policy "Allow admin read/write contact_messages" on public.contact_messages for all using (auth.role() = 'authenticated');

-- Policies: AI sessions & Chat Messages (Public insert and read own session / Admin full access)
create policy "Allow anonymous insert ai_chat_sessions" on public.ai_chat_sessions for insert with check (true);
create policy "Allow anonymous read own ai_chat_sessions" on public.ai_chat_sessions for select using (true); -- scoped by session ID on client
create policy "Allow admin read/write ai_chat_sessions" on public.ai_chat_sessions for all using (auth.role() = 'authenticated');

create policy "Allow anonymous insert ai_chat_messages" on public.ai_chat_messages for insert with check (true);
create policy "Allow anonymous read own ai_chat_messages" on public.ai_chat_messages for select using (true); -- scoped by session ID on client
create policy "Allow admin read/write ai_chat_messages" on public.ai_chat_messages for all using (auth.role() = 'authenticated');

-- Policies: Resume downloads (Public insert / Admin select)
create policy "Allow anonymous insert resume_downloads" on public.resume_downloads for insert with check (true);
create policy "Allow admin read resume_downloads" on public.resume_downloads for select using (auth.role() = 'authenticated');

-- Policies: Analytics events (Public insert / Admin select)
create policy "Allow anonymous insert analytics_events" on public.analytics_events for insert with check (true);
create policy "Allow admin read analytics_events" on public.analytics_events for select using (auth.role() = 'authenticated');

-- Policies: Admin notes (Only authenticated admin can read/write)
create policy "Allow admin read/write admin_notes" on public.admin_notes for all using (auth.role() = 'authenticated');
