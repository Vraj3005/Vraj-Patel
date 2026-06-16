# Row Level Security (RLS) Policy Specifications

This document catalogs the PostgreSQL Row Level Security (RLS) policies configured for Vraj Patel's portfolio database architecture.

---

## 🔒 Security Principles
1. **Deny-by-Default**: Every table enables RLS explicitly. If no matching policy is found, queries are blocked.
2. **Admin Isolation**: Admin write access is bound to the `authenticated` role check (`auth.role() = 'authenticated'`).
3. **Public Exposure Filtering**: Public queries on Projects, Blog Posts, and Testimonials are constrained by the `status = 'published'` rule.
4. **Leakage Containment**: AI Chat logs, Resume downloads, Analytics data, and Contact messages are locked against public select/read permissions.

---

## 📄 Tables & Policies

### 1. `profiles`
- **Select**: Allowed for anyone (`true`).
- **All other actions**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 2. `skill_categories` & `skills`
- **Select**: Allowed for anyone (`true`).
- **All other actions**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 3. `projects`
- **Select**: Only allowed for public users if `status = 'published'`.
- **All other actions**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 4. `project_features`, `project_tech_stack`, `project_links`, and `case_studies`
- **Select**: Only allowed for public users if the associated parent `project_id` references a project record with `status = 'published'`.
- **All other actions**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 5. `blog_posts` & `testimonials`
- **Select**: Only allowed for public users if `status = 'published'`.
- **All other actions**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 6. `contact_messages`
- **Insert**: Allowed for anyone (`true`).
- **Select**: Requires admin authorization (`auth.role() = 'authenticated'`). Public users are blocked from listing or reading messages.
- **Update/Delete**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 7. `ai_chat_sessions` & `ai_chat_messages`
- **Insert**: Allowed for anyone (`true`).
- **Select**: Public users can read messages. In client routines, queries are explicitly filtered by the local session ID parameter.
- **Update/Delete**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 8. `resume_downloads` & `analytics_events`
- **Insert**: Allowed for anyone (`true`).
- **Select**: Requires admin authorization (`auth.role() = 'authenticated'`). Public users are blocked from reading logs.
- **Update/Delete**: Requires admin authorization (`auth.role() = 'authenticated'`).

### 9. `admin_notes`
- **All actions**: Gated. Requires admin authorization (`auth.role() = 'authenticated'`). Public users are blocked from reading or writing notes.
