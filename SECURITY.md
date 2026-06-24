# Portfolio Production Security Handbook

This document outlines the security architecture, data isolation boundaries, and Row-Level Security (RLS) configurations implemented across the portfolio.

---

## 🔒 1. Row-Level Security (RLS) Model
All tables in the database are fully protected by PostgreSQL Row-Level Security (RLS). We divide database structures into two categories:

### A. Public Content Tables
* **Tables**: `profiles`, `skill_categories`, `skills`, `projects`, `project_features`, `project_tech_stack`, `project_links`, `case_studies`, `testimonials`, `blog_posts`, `project_architectures`, `project_data_flows`, `security_layers`, `metrics_snapshots`, `github_contributions_cache`, `dashboard_widgets`.
* **Public Access**: Read-only (`SELECT`). Where applicable, public select is constrained to records marked with publish states (e.g. `status = 'published'`).
* **Admin Access**: Authenticated admin users have full write access (`INSERT`, `UPDATE`, `DELETE`) verified against the `admin_users` table.

### B. Private Data & Logs Tables
* **Tables**: `contact_messages`, `ai_chat_sessions`, `ai_chat_messages`, `system_events`, `request_traces`, `cli_command_logs`, `admin_notes`, `analytics_events`.
* **Public Access**: Public users are permitted to **Insert-Only** where required (such as sending contact forms, logging telemetry page visits, or adding AI chat prompts). **Public read (SELECT) access is completely blocked.**
* **Admin Access**: Only users whose IDs exist in the `public.admin_users` table have `SELECT` or write privileges on these tables.
* **RLS Check Clause**: All security policies verify admin status dynamically by matching the authenticated session ID:
  ```sql
  USING (exists (select 1 from public.admin_users where id = auth.uid()))
  ```
  *No personal email address is hardcoded inside source-controlled SQL schemas.*

---

## 🔑 2. Admin Access & Authentication Model

1. **Database-Backed Admin Table**: Admin identity is managed in the `public.admin_users` table, which maps authenticated user IDs (`auth.users.id`). 
2. **Server-Side API Verification**: Backend endpoints (like the Operations telemetry route `/api/telemetry/log`) verify administrative sessions by querying `admin_users` for the user's ID. If the check fails or if the database is disconnected, the server fails closed (`isAdmin = false`).
3. **Inbox Passcode Gateway**:
   * Programmatic checks on the `/api/contact/inbox` endpoint require a matching `INBOX_PASSCODE` in the payload.
   * **Fail-Closed Design**: If the `INBOX_PASSCODE` environment variable is missing on the server, the endpoint aborts execution, logs a configuration warning on the server console, and returns `500 Internal Server Error`, protecting visitor messages from public exposure.

---

## 🛡️ 3. Client-Side Safeguards & Secrets Isolation
* **Strict Client Scope**: Client-side files inside the React component tree must only query Supabase using the public anonymous key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`).
* **No Service Role on Client**: The `SUPABASE_SERVICE_ROLE_KEY` bypasses all database RLS rules and is strictly kept server-side inside `lib/supabase/admin.ts` (marked with `server-only` conventions where appropriate). It must **never** be imported, logged, or exposed in frontend client files.

---

## 📋 4. Required Environment Variables

To run the application with full security features enabled, ensure the following variables are configured:

| Variable | Scope | Purpose |
| :--- | :--- | :--- |
| `INBOX_PASSCODE` | Server-only | Secret passcode used to authenticate and decrypt the `/inbox` message view. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Database service role key used by API routes to bypass RLS and read logs or inquiries. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Your Supabase database endpoint URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Anonymous API key used for public database writes/reads. |
| `GEMINI_API_KEY` | Server-only | Google AI Studio API key for Ask Vraj AI queries. |
