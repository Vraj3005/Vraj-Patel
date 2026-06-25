# Vraj Patel — Premium Portfolio & Enterprise Systems Control Center

This is a production-hardened, over-engineered portfolio website and administration console built for Vraj Patel, a Computer Science student at Nirma University. The project highlights his expertise in **Full-Stack Development**, **Enterprise ERP Engineering**, **Autonomous AI Agents**, and **Quantitative Finance Research**.

The UI uses a custom-tuned, dark glassmorphism design built using Tailwind CSS v4.0 and Framer Motion, utilizing deep slate grids, glowing particle lines, and responsive micro-interactions to create a premium product feel.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Core Framework** | Next.js App Router (v16.2.x), React 19 |
| **Styling & Motion** | Tailwind CSS (v4.0.x), Framer Motion (v12.x), Lucide Icons |
| **State & Forms** | React Hook Form, Zod schema validation, TanStack Query |
| **Backend & DB** | Supabase PostgreSQL Client (with local JSON filesystem fallback) |
| **Intelligence Layer** | Google Gemini API (`gemini-2.5-flash`), Zod structured output |
| **Options & Math Engine** | Options pricing mathematical models, Python backtesters |
| **Visualization** | Recharts (drawdowns, equity curves, Monte Carlo curves), Custom SVG network graph |
| **Testing** | Vitest testing framework (lightweight headless unit & route integration tests) |

---

## ⚡ Main Features & Pages

1. **Command Palette (`Ctrl+K` / `Cmd+K`)**: Keyboard-navigable finder letting visitors instantly browse case studies, trigger recruiter exports, clear cache records, and open pages.
2. **Interactive Developer Terminal**: Unix-like command shell on the homepage supporting standard utilities (`whoami`, `projects --quant`, `skills --fullstack`) and the `ask "<question>"` command, which streams Gemini API responses token-by-token.
3. **Interactive Tech Stack Graph**: SVGs displaying relationships between projects and technology dependencies, with active glows and highlighted paths on hover.
4. **Quant Strategy Playground (`/lab`)**: Includes a Strategy Simulator (leverage/slippage drag parameters), Position Risk Calculator, and Monte Carlo Equity Curves simulator.
5. **Project Architecture Viewer (`/projects/[slug]`)**: Tabbed breakdown outlining Frontend, Backend, Database, AI/Math Layer, Deployment, and Security details for all 10 projects.
6. **Ask Vraj Assistant (`/ask-vraj` & Widget)**: Conversational page and floating widget allowing queries about Vraj's background, education, and projects, backed by the Gemini API.
7. **Inquiries Inbox (`/inbox`)**: A secure, passcode-gated console for Vraj to inspect contact inquiries.

---

## 💾 1. Supabase Setup Guide

The application uses Supabase PostgreSQL as its main database. If Supabase environment variables are missing, the system will fall back to reading and writing local data logs in `db/messages.json`.

### Step 1: Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://supabase.com/).
2. Click **New Project**, choose a name, configure a secure password, and select a regional host closest to your users.
3. Once provisioned, locate the project API keys in your settings dashboard under **Settings > API**.

### Step 2: Initialize Database Schemas
Navigate to the **SQL Editor** in your Supabase dashboard and run the following queries to create tables, status enums, and configure Row-Level Security (RLS) policies:

```sql
-- 1. Table: Contact Inquiries
create table public.contact_inquiries (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    subject text not null,
    message text not null,
    status text default 'unread'::text check (status in ('unread', 'read', 'archived')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for inquiries
alter table public.contact_inquiries enable row level security;

-- Insert Policy: Anyone can submit messages via contact forms
create policy "Allow anonymous submissions" 
on public.contact_inquiries for insert 
with check (true);

-- Read Policy: Only authenticated admin role can view submissions
create policy "Allow admins to read inquiries" 
on public.contact_inquiries for select 
using (auth.role() = 'authenticated');

-- Delete Policy: Only admins can delete logs
create policy "Allow admins to delete inquiries" 
on public.contact_inquiries for delete 
using (auth.role() = 'authenticated');


-- 2. Table: AI Logs
create table public.ai_logs (
    id uuid default gen_random_uuid() primary key,
    session_id text,
    prompt text not null,
    response text not null,
    user_ip text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for AI logs
alter table public.ai_logs enable row level security;

-- Insert Policy: Anyone can log AI prompts
create policy "Allow anonymous logging" 
on public.ai_logs for insert 
with check (true);

-- Read Policy: Only authenticated admin role can read AI logs
create policy "Allow admins to read AI logs" 
on public.ai_logs for select 
using (auth.role() = 'authenticated');
```

---

## 🧠 2. Gemini API Setup Guide

The conversational features (`/ask-vraj` and the AI widget) query the **Google Gemini API** (`gemini-2.5-flash`) to stream responses.

### Step 1: Obtain a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Log in with your Google account and click **Get API Key**.
3. Create a key and copy the token string.

### Step 2: System Prompt & Safety Rails
The backend API route in [app/api/ask/route.ts](file:///c:/Users/vishv/OneDrive/Desktop/Vraj_Port/app/api/ask/route.ts) initializes the model with detailed developer instructions:
- Pre-injects context regarding Vraj Patel's education (Nirma University, CSE), GPA (8.7), technologies, and deep specifications for the 10 featured projects.
- Enforces a professional, developer-focused persona.
- Restricts responses to approved information, returning *"I am only allowed to answer questions based on Vraj Patel's approved portfolio context"* if queries attempt to jailbreak or query unrelated subjects.
- Streams the output token-by-token to the client interface using server-sent events.

---

## 📬 3. Inquiries Inbox Usage Guide

The inbox console (`/inbox`) serves as Vraj's private message center.

### Accessing the Inbox
1. Navigate to `/inbox` or `/dashboard` in your browser.
2. The application will redirect you to `/login`. Sign in using your registered Supabase administrator credentials.
3. Access is authorized only if your authenticated user ID exists in the `public.admin_users` table in your database.

---

## 🔑 4. Environment Variables

Create a `.env.local` file in your project root using the templates outlined below:

```bash
# Supabase Integration (Get these from your Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Gemini API Key (Get this from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key

# Upstash Redis (For serverless rate limiting)
UPSTASH_REDIS_REST_URL=your-upstash-redis-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-rest-token

# GitHub API Credentials (Requires a fine-grained token with read-only scope for contribution/repo metadata only)
GITHUB_TOKEN=your-github-personal-access-token
```

---

## 💻 5. Local Development

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed on your system.

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the application in the browser.

### Run Testing Suite
The project uses `vitest` for test coverage.
```bash
# Run tests in headless mode
npm run test

# Run tests in watch mode
npx vitest
```

### TypeScript Validation
```bash
npm run typecheck
```

### Linter Checks
```bash
npm run lint
```

### Production Bundling (Verification Build)
```bash
npm run build
```

---

## 🚀 6. Production Deployment

The project is structured to deploy on **Vercel** with minimal configuration.

1. Push your repository to GitHub.
2. Link the repository to your [Vercel Dashboard](https://vercel.com).
3. Set the required **Environment Variables** in the Vercel project settings.
4. Click **Deploy**. Vercel will build the static layouts, bundle Javascript modules, and deploy API serverless functions globally.

---

## 🛡️ 8. Security Hardening Checklist

- [x] **Content Security Policy (CSP)**: Set headers via `next.config.ts` to restrict external resources and prevent Cross-Site Scripting (XSS).
- [x] **Rate Throttling**: Added a memory-cached sliding-window rate-limiter on endpoints:
  - Contact submissions are restricted to 3 runs per 5 minutes per IP.
  - AI Assistant queries are limited to 10 queries per minute per IP.
- [x] **Zod Validation**: All requests submitted to `/api/contact` and `/api/ask` are validated using strict Zod schemas, returning `400` on any malformed formats.
- [x] **Supabase Row-Level Security (RLS)**: Public tables enforce rigid read/write policy parameters, restricting selective select actions to authenticated administrative accounts.
- [x] **Credential Obfuscation**: The administration router utilizes server-only environment checks. Passcodes and Gemini keys are never leaked to client bundles.

---

## 📈 9. Future Roadmap

1. **Geospatial Pre-mapping (Enermass Solar ERP)**: Integrate Google Solar API and satellite mapping tools to automatically pre-calculate building shade profiles before a site survey.
2. **Advanced Volatility Analytics**: Update options pricing metrics models to support SABR Volatility models and compute implied probability distribution curves dynamically.
3. **Smart CRM Dispatching**: Connect recruiter form submissions directly to automated email workflows that respond with customizable, profile-matched resume files.
4. **Outbox Semantic scoring (AI outreach)**: Utilize vector embeddings to analyze leads lists, sorting outreach prioritizations based on relevance matches.
