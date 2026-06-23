-- Supabase PostgreSQL Migration: 20260623000000_advanced_features.sql
-- Database structures for Advanced Portfolio Features (Vraj Patel's Portfolio)

-- ==========================================
-- 1. Create Tables
-- ==========================================

-- Table: system_events
create table public.system_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  event_type text not null,       -- 'cli_command', 'telemetry_trace', 'api_request', 'security_audit', 'github_sync'
  severity text not null,         -- 'info', 'warning', 'error', 'critical'
  message text not null,
  metadata jsonb default '{}'::jsonb not null
);

-- Table: request_traces
create table public.request_traces (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  path text not null,
  method text not null,
  status_code integer not null,
  duration_ms numeric(10, 2) not null,
  ip_hash text not null,
  steps jsonb default '[]'::jsonb not null
);

-- Table: project_architectures
create table public.project_architectures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_slug text not null unique,
  nodes jsonb default '[]'::jsonb not null,
  edges jsonb default '[]'::jsonb not null
);

-- Table: project_data_flows
create table public.project_data_flows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  project_slug text not null,
  flow_name text not null,
  steps jsonb default '[]'::jsonb not null
);

-- Table: security_layers
create table public.security_layers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique,
  description text not null,
  layer_order integer not null,
  status text default 'active' not null, -- 'active', 'bypassed', 'audit'
  metrics jsonb default '{}'::jsonb not null
);

-- Table: metrics_snapshots
create table public.metrics_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  metric_name text not null,
  metric_value numeric(14, 4) not null,
  tags jsonb default '{}'::jsonb not null
);

-- Table: github_contributions_cache
create table public.github_contributions_cache (
  id uuid primary key default gen_random_uuid(),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text not null unique,
  contribution_data jsonb default '[]'::jsonb not null
);

-- Table: cli_command_logs
create table public.cli_command_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  command text not null,
  args text[] default '{}'::text[] not null,
  success boolean default true not null,
  execution_time_ms integer not null
);

-- Table: dashboard_widgets
create table public.dashboard_widgets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  widget_type text not null,
  layout_config jsonb default '{}'::jsonb not null,
  is_public boolean default true not null
);

-- ==========================================
-- 2. Hook triggers for auto-updating updated_at
-- ==========================================
create trigger trigger_project_architectures_updated_at before update on public.project_architectures for each row execute procedure update_updated_at_column();
create trigger trigger_github_contributions_cache_updated_at before update on public.github_contributions_cache for each row execute procedure update_updated_at_column();

-- ==========================================
-- 3. Create Indexes for Queries Optimizations
-- ==========================================
create index idx_request_traces_path_created on public.request_traces (path, created_at desc);
create index idx_metrics_snapshots_name_created on public.metrics_snapshots (metric_name, created_at desc);
create index idx_system_events_type_created on public.system_events (event_type, created_at desc);
create index idx_cli_command_logs_created on public.cli_command_logs (created_at desc);

-- ==========================================
-- 4. Enable Row Level Security (RLS)
-- ==========================================
alter table public.system_events enable row level security;
alter table public.request_traces enable row level security;
alter table public.project_architectures enable row level security;
alter table public.project_data_flows enable row level security;
alter table public.security_layers enable row level security;
alter table public.metrics_snapshots enable row level security;
alter table public.github_contributions_cache enable row level security;
alter table public.cli_command_logs enable row level security;
alter table public.dashboard_widgets enable row level security;

-- ==========================================
-- 5. Row Level Security Policies
-- ==========================================

-- Policies: system_events (Anonymous Insert / Admin Select & Full)
create policy "Allow anonymous insert system_events" on public.system_events for insert with check (true);
create policy "Allow admin read/write system_events" on public.system_events for all using (auth.role() = 'authenticated');

-- Policies: request_traces (Anonymous Insert / Admin Select & Full)
create policy "Allow anonymous insert request_traces" on public.request_traces for insert with check (true);
create policy "Allow public read aggregate request duration" on public.request_traces for select using (true);
create policy "Allow admin read/write request_traces" on public.request_traces for all using (auth.role() = 'authenticated');

-- Policies: project_architectures (Public Read / Admin Write)
create policy "Allow public read project_architectures" on public.project_architectures for select using (true);
create policy "Allow admin write project_architectures" on public.project_architectures for all using (auth.role() = 'authenticated');

-- Policies: project_data_flows (Public Read / Admin Write)
create policy "Allow public read project_data_flows" on public.project_data_flows for select using (true);
create policy "Allow admin write project_data_flows" on public.project_data_flows for all using (auth.role() = 'authenticated');

-- Policies: security_layers (Public Read / Admin Write)
create policy "Allow public read security_layers" on public.security_layers for select using (true);
create policy "Allow admin write security_layers" on public.security_layers for all using (auth.role() = 'authenticated');

-- Policies: metrics_snapshots (Public Read / Admin Write)
create policy "Allow public read metrics_snapshots" on public.metrics_snapshots for select using (true);
create policy "Allow admin write metrics_snapshots" on public.metrics_snapshots for all using (auth.role() = 'authenticated');

-- Policies: github_contributions_cache (Public Read / Admin Write)
create policy "Allow public read github_contributions_cache" on public.github_contributions_cache for select using (true);
create policy "Allow admin write github_contributions_cache" on public.github_contributions_cache for all using (auth.role() = 'authenticated');

-- Policies: cli_command_logs (Anonymous Insert / Admin Select & Full)
create policy "Allow anonymous insert cli_command_logs" on public.cli_command_logs for insert with check (true);
create policy "Allow admin read/write cli_command_logs" on public.cli_command_logs for all using (auth.role() = 'authenticated');

-- Policies: dashboard_widgets (Public Read / Admin Write)
create policy "Allow public read dashboard_widgets" on public.dashboard_widgets for select using (is_public = true);
create policy "Allow admin write dashboard_widgets" on public.dashboard_widgets for all using (auth.role() = 'authenticated');
