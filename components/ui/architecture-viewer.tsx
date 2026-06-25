'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layout, Server, Database, Cpu, Globe, ShieldCheck 
} from 'lucide-react';

interface LayerDetails {
  title: string;
  icon: React.ReactNode;
  tech: string[];
  description: string;
  keyMetric?: string;
}

interface ProjectArchitecture {
  frontend: LayerDetails;
  backend: LayerDetails;
  database: LayerDetails;
  ai: LayerDetails;
  deployment: LayerDetails;
  security: LayerDetails;
}

const architectureData: Record<string, ProjectArchitecture> = {
  'enermass-solar-calculator': {
    frontend: {
      title: 'Frontend Sizing UI',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'React', 'Zustand', 'Tailwind CSS', 'TypeScript'],
      description: 'Client-side rooftop solar calculator interface. Manages custom panel selections, inline quantity overrides, and margin adjustments dynamically.',
      keyMetric: 'Sizing Store: Zustand'
    },
    backend: {
      title: 'Backend Controller',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js API routes', 'TypeScript'],
      description: 'Exposes API handlers for quote dispatches, lead details saving, and global master rates database overrides.',
      keyMetric: 'API response: <120ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Drizzle ORM'],
      description: 'Stores materials master lists, saved client quotes, lead status changes, and geographic parameters registers.',
      keyMetric: 'Sync: LocalStorage + DB'
    },
    ai: {
      title: 'Mathematical Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Subsidy Logic', 'State coefficient matrix'],
      description: 'Calculates central government subsidies (PM Surya Ghar brackets) and Simple Payback ROI ratios dynamically client-side.',
      keyMetric: 'Indian States: 28 mapped'
    },
    deployment: {
      title: 'Deployment Infrastructure',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge CDN'],
      description: 'Served statically using Next.js Incremental Static Regeneration (ISR) and distributed across Vercel edge networks.',
      keyMetric: 'Hosted on Vercel CDN'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Supabase Auth', 'Gated Admin sessions'],
      description: 'Protects administrative routes, restricting settings defaults overrides and rate master tables modification to authorized accounts.',
      keyMetric: 'Protected Admin Routes'
    }
  },
  'outreachops-ai': {
    frontend: {
      title: 'Frontend Dashboard',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Recharts'],
      description: 'Sales operations dashboard. Visualizes campaign lead sheets, edit queues, generated email drafts, and response rates charts.',
      keyMetric: 'Interactive Grids'
    },
    backend: {
      title: 'Backend Controller',
      icon: <Server className="h-4 w-4" />,
      tech: ['FastAPI (Python)', 'Pydantic Settings', 'gspread', 'Gmail API'],
      description: 'Exposes Python endpoints to sync lead files from Google Sheets, trigger LLM generation queues, and dispatch emails via Gmail APIs.',
      keyMetric: 'FastAPI Backend (async)'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase Postgres', 'Row Level Security'],
      description: 'Logs active campaigns, outbound drafts, leads lists, and schedule records. Restricts database writes using RLS checks.',
      keyMetric: 'Supabase Postgres'
    },
    ai: {
      title: 'AI Personalization',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Google GenAI SDK', 'Structured JSON Outputs'],
      description: 'Scrapes target company landing pages and generates tailored pitches. Uses Gemini Structured Output mode to parse JSON variables.',
      keyMetric: 'Gemini Generative API'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge CDN (Frontend)', 'Render (Backend VPS)', 'Docker'],
      description: 'Vercel Edge serves the dashboard. The FastAPI backend compiles inside Docker containers and deploys to Render VPS instances.',
      keyMetric: 'Containerized Backend'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Supabase Auth', 'Google OAuth 2.0', 'DNC filters checks'],
      description: 'Authenticates administrative logins before email approvals. Connects securely via Gmail OAuth scopes to route dispatches.',
      keyMetric: 'OAuth 2.0 Secure'
    }
  },
  'bhagwati-interior-erp': {
    frontend: {
      title: 'Frontend Dashboard',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 16', 'Tailwind CSS v4', 'shadcn/ui', 'Framer Motion'],
      description: 'Real-time studio designer dashboard displaying active sites, catalogs registers, designer profiles, and expense charts.',
      keyMetric: 'Material Catalog Cards'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js Server Actions', 'Drizzle ORM'],
      description: 'Processes database queries, material catalog rate edits, designer task updates, and automated GST billing reports.',
      keyMetric: 'Drizzle ORM'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['PostgreSQL (Supabase)', 'Drizzle Schema'],
      description: 'PostgreSQL database. Stores structured schemas for sites progress, transport details, and item catalogues.',
      keyMetric: 'Supabase PostgreSQL'
    },
    ai: {
      title: 'AI Advisor Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Google Gemini API', 'Context Prompting'],
      description: 'Generates business analytics and efficiency advisories checking active project budgets, deadlines, and stock warnings.',
      keyMetric: 'Gemini Analytics'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel CDN', 'Supabase Cloud'],
      description: 'Frontend is distributed dynamically via Vercel Edge networks, and database transactions route to Supabase cloud instances.',
      keyMetric: 'Vercel Serverless'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Bcryptjs Hashing', 'NextAuth.js', 'Route Middleware'],
      description: 'Gated workspace access restricted using NextAuth authentication middleware and session checks.',
      keyMetric: 'NextAuth Credentials'
    }
  },
  'driedhub-marketplace': {
    frontend: {
      title: 'Frontend Storefront',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'Zustand', 'Tailwind CSS', 'Resend'],
      description: 'Consumer marketplace storefront. Features static catalogs, search indexing, responsive grids, and Google login callbacks.',
      keyMetric: 'Static pages (ISR)'
    },
    backend: {
      title: 'Backend Controller',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js API routes', 'Razorpay SDK', 'Resend'],
      description: 'Coordinates customer shopping carts, stock validations, Resend email notices, and Razorpay transaction requests.',
      keyMetric: 'Checkout: Razorpay SDK'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Transactional Locks'],
      description: 'Supabase Postgres tables mapping product catalogs, inventory levels, cart sessions, and client profiles.',
      keyMetric: 'Supabase DB'
    },
    ai: {
      title: 'Search Indexing',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Typo-tolerant heuristics'],
      description: 'Standard product query completion matching, checking input queries against cached product vectors.',
      keyMetric: 'Typo-tolerant matching'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge CDN'],
      description: 'Served statically using Next.js Incremental Static Regeneration (ISR) to distribute pages across Vercel nodes.',
      keyMetric: 'Distributed storefront'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Google OAuth 2.0', 'Supabase Auth', 'Signature verification'],
      description: 'Protects payment callbacks using Razorpay webhook signature hashes, and isolates user credentials in Supabase Auth.',
      keyMetric: 'Webhook verification'
    }
  },
  'driedhub-admin-dashboard': {
    frontend: {
      title: 'Frontend Interface',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 14', 'Radix UI', 'Recharts SVG', 'Tailwind CSS'],
      description: 'Internal operations dashboard illustrating order metrics, returns logs, shipment records, and sales charts.',
      keyMetric: 'Recharts Metrics'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js API routes', 'Supabase Client'],
      description: 'Processes inventory updates, shipping logistics updates, customer search queries, and inventory tracking scripts.',
      keyMetric: 'REST API endpoints'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Materialized Views'],
      description: 'Supabase PostgreSQL database storing sales logs and historical order inventories, optimizing analytics tables.',
      keyMetric: 'DB: Supabase Postgres'
    },
    ai: {
      title: 'Forecasting Logic',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Stock depleting estimation'],
      description: 'Calculates basic stock depletion intervals checking average sales volume and current warehouse totals.',
      keyMetric: 'Automated warnings'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel'],
      description: 'Dashboard is deployed via Vercel platform, updating databases asynchronously on Supabase hosting instances.',
      keyMetric: 'Dashboard deployment'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Session checks', 'Row Level Security'],
      description: 'Protects admin workflows using Next.js backend middleware session gates. Restricts database writes using RLS checks.',
      keyMetric: 'RLS Protected'
    }
  },
  'marea-website': {
    frontend: {
      title: 'Frontend Interface',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 16', 'Framer Motion', 'Lenis', 'GSAP', 'Zustand'],
      description: 'Cinematic brand editorial interface. Scroll animations, custom cursors, media galleries, and typography reveal timelines.',
      keyMetric: 'GSAP Anim: 60fps'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js App Router', 'Supabase SDK', 'Resend'],
      description: 'Processes luxury collection catalogues and synchronizes user cart states via serverless functions.',
      keyMetric: 'Serverless dispatches'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Row Level Security'],
      description: 'Relational PostgreSQL schema managing collection catalog variables and client profiles files.',
      keyMetric: 'Supabase Postgres'
    },
    ai: {
      title: 'Visual Enhancements',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Scroll-driven easing', 'GSAP ScrollTrigger'],
      description: 'Calculates scroll coordinates offsets to drive smooth visual transitions and easing galleries in-browser.',
      keyMetric: 'GSAP ScrollTrigger'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge network'],
      description: 'Hosted on Vercel Edge networks to deliver global assets, static frames, and styles instantly.',
      keyMetric: 'Edge Distribution'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Supabase Auth', 'HTTPS locks'],
      description: 'Gated customer profile sheets and carts via Supabase auth state checks.',
      keyMetric: 'Secure account logins'
    }
  },
  'marea-admin-dashboard': {
    frontend: {
      title: 'Frontend Interface',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 14', 'Radix UI', 'TanStack Table', 'dnd-kit'],
      description: 'Rich catalog and layout editing workspace. Supports sortable listings and drag-and-drop homepage adjustments.',
      keyMetric: 'TanStack Table grids'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js API routes', 'TipTap Editor', 'Supabase Client'],
      description: 'Coordinates catalog updates, HTML filtering schemas, image attachment keys, and editorial block placements.',
      keyMetric: 'TipTap integration'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Audit logs'],
      description: 'Postgres tables recording active catalog descriptions, order status records, and staff modification logs.',
      keyMetric: 'PostgreSQL tables'
    },
    ai: {
      title: 'Content Indexing',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Catalog query parsing'],
      description: 'Organizes products categories configurations using structural metadata matrices.',
      keyMetric: 'Organized catalogs'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel'],
      description: 'Administrative client dashboard deployed to Vercel, linking with Supabase storage buckets.',
      keyMetric: 'Deployed: Vercel'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Supabase RLS policies', 'Role authorization'],
      description: 'Enforces Row Level Security (RLS) policies. Restricts sorting mutations to authorized administrative accounts.',
      keyMetric: 'Role-based access locks'
    }
  },
  'surendra-bus-body': {
    frontend: {
      title: 'Frontend Portal',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 16', 'Framer Motion', 'Lenis', 'Resend'],
      description: 'Cinematic brand presentation page showcasing manufacturing setups and interactive seating layouts.',
      keyMetric: 'Lenis Scroll Easing'
    },
    backend: {
      title: 'Backend Controller',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js Serverless Route'],
      description: 'Coordinates client design estimates submissions, routing configuration details to administrative mail boxes.',
      keyMetric: 'Resend Mail API'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Static JSON catalogs'],
      description: 'Bypasses database server overhead by using static JSON catalog structures.',
      keyMetric: '0ms query delay'
    },
    ai: {
      title: 'Configuration Algebra',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Vector matrices calculations'],
      description: 'Runs layout dimensions offset equations inside client viewport to ensure seating configurations align correctly.',
      keyMetric: 'Visual form layouts'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge CDN'],
      description: 'Statically pre-rendered routes distributed across global Edge networks, ensuring immediate response.',
      keyMetric: 'CDN pre-rendered'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Zod validations', 'Honeypot form logs'],
      description: 'Blocks automated script submissions using client honeypot parameters, validating form models via Zod.',
      keyMetric: 'Validation: Zod'
    }
  },
  'mspe-volatility-engine': {
    frontend: {
      title: 'Frontend Surface',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js 16', 'React Plotly', 'Tailwind CSS v4'],
      description: 'Dynamic math visualizer charting option implied volatility surfaces and risk projections.',
      keyMetric: '3D Plotly surfaces'
    },
    backend: {
      title: 'Backend Solver',
      icon: <Server className="h-4 w-4" />,
      tech: ['FastAPI (Python)', 'Pandas', 'NumPy'],
      description: 'Calculates options Greeks metrics and pricing estimations. Runs on FastAPI backend processes.',
      keyMetric: 'Python FastAPI'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Asyncpg PostgreSQL', 'In-memory caching'],
      description: 'Stores historical underlying listings price points, utilizing in-memory structures to resolve pricing queries.',
      keyMetric: 'Asyncpg Postgres'
    },
    ai: {
      title: 'Quant Solvers Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['GARCH modeling', 'Newton-Raphson methods', 'Cubic Splines'],
      description: 'Employs Newton-Raphson solvers to determine Black-Scholes implied volatilities, GARCH indicators, and spline fittings.',
      keyMetric: 'GARCH (arch) models'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel (Frontend)', 'FastAPI server Docker'],
      description: 'Frontend is hosted on Vercel, and Python mathematics servers compile inside Docker containers.',
      keyMetric: 'Containerized Python API'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['API keys validation', 'CORS origin headers'],
      description: 'Blocks unauthorized execution routes. Restricts FastAPI access origins to portfolio web addresses.',
      keyMetric: 'CORS locked down'
    }
  },
  'nf-lrd-regime-discovery': {
    frontend: {
      title: 'Frontend Dashboard',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Streamlit', 'Plotly charts'],
      description: 'Displays historical regime transitions and backtest simulations charts using dynamic Streamlit controls.',
      keyMetric: 'Streamlit dashboard'
    },
    backend: {
      title: 'Calculations Engine',
      icon: <Server className="h-4 w-4" />,
      tech: ['Python Pipeline', 'hmmlearn', 'statsmodels'],
      description: 'Executes mathematical feature engineering calculations pipelines, returning NIFTY 50 close logs.',
      keyMetric: 'Python pipeline'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Parquet files', 'Pandas dataframes'],
      description: 'Numerical compute lists are loaded in-memory from indexed Parquet databases files.',
      keyMetric: 'Local Parquet files'
    },
    ai: {
      title: 'Regime Clusterers',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Hidden Markov Models (HMM)', 'scipy statistics'],
      description: 'Employs Hidden Markov Models (HMM) running Gaussian probabilities distributions to partition market trend regimes.',
      keyMetric: 'Gaussian HMM model'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Streamlit Cloud', 'Python execution logs'],
      description: 'Streamlit dashboards deploy directly to Python cloud instances, hosting analytical engines continuously.',
      keyMetric: 'Hosted Streamlit'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Environment security limits'],
      description: 'Protects API parameters and keys via server environment variable mappings.',
      keyMetric: 'Locked parameters'
    }
  },
  'btc-algo-trading': {
    frontend: {
      title: 'Frontend Portal',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Streamlit', 'Plotly charts', 'streamlit-autorefresh'],
      description: 'Algorithmic execution desk plotting cryptocurrency trends indexes, open balances, and signals.',
      keyMetric: 'Streamlit autorefresh'
    },
    backend: {
      title: 'Backend Daemon',
      icon: <Server className="h-4 w-4" />,
      tech: ['Python worker daemon', 'Multi-threading'],
      description: 'Continuous background daemons query live exchange APIs, running trend equations, and buffering signal registers.',
      keyMetric: 'Streamlit backend'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Pandas dataframes', 'CSV logs cache'],
      description: 'Caches historical closing price points inside flat CSV sheets, loading structures directly into Python memory.',
      keyMetric: 'Local CSV cache'
    },
    ai: {
      title: 'Signal Modeling',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Quantitative trend filters'],
      description: 'Momentum strategy filters tracking close updates to identify signal breakout triggers.',
      keyMetric: 'Momentum strategy'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Render Cloud VPS'],
      description: 'Background worker scripts and dashboard panels run on Render Cloud platform instances.',
      keyMetric: 'Deployed: Render'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Environment variables lock'],
      description: 'Restricts API access tokens using server-only parameters.',
      keyMetric: 'Gated indicators'
    }
  }
};

interface ArchitectureViewerProps {
  slug: string;
}

type LayerKey = keyof ProjectArchitecture;

export default function ArchitectureViewer({ slug }: ArchitectureViewerProps) {
  const [activeLayer, setActiveLayer] = useState<LayerKey>('frontend');
  const projectData = architectureData[slug];

  if (!projectData) {
    return (
      <div className="py-6 text-center text-xs text-muted font-mono border border-dashed border-card-border rounded-xl">
        No architecture details compiled for slug: {slug}
      </div>
    );
  }

  const layersList: { key: LayerKey; label: string; icon: React.ReactNode }[] = [
    { key: 'frontend', label: 'Frontend', icon: <Layout className="h-4 w-4" /> },
    { key: 'backend', label: 'Backend', icon: <Server className="h-4 w-4" /> },
    { key: 'database', label: 'Database', icon: <Database className="h-4 w-4" /> },
    { key: 'ai', label: 'AI / Math Layer', icon: <Cpu className="h-4 w-4" /> },
    { key: 'deployment', label: 'Deployment', icon: <Globe className="h-4 w-4" /> },
    { key: 'security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const currentDetails = projectData[activeLayer];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 items-stretch no-print">
      {/* Left side: Navigation Cards */}
      <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 shrink-0 w-full md:w-56 scrollbar-thin">
        {layersList.map((layer) => {
          const isSelected = activeLayer === layer.key;
          const details = projectData[layer.key];
          
          return (
            <button
              key={layer.key}
              onClick={() => setActiveLayer(layer.key)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl border text-left cursor-pointer transition-all duration-200 shrink-0 md:shrink-1 w-auto md:w-full ${
                isSelected
                  ? 'border-white/20 bg-white/5 text-white shadow-md'
                  : 'border-card-border bg-card-bg text-secondary hover:border-white/10 hover:text-foreground'
              }`}
            >
              <div className={`p-1.5 rounded-lg border transition-colors ${
                isSelected ? 'bg-white/5 border-white/10 text-white' : 'bg-white/2 border-white/5 text-secondary'
              }`}>
                {layer.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold font-mono tracking-wide leading-tight">{layer.label}</span>
                {details.keyMetric && (
                  <span className="text-[9px] text-muted font-mono leading-none">{details.keyMetric}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Right side: Active details display */}
      <div className="flex-1 min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full bg-card-bg border border-card-border rounded-2xl p-6 flex flex-col justify-between gap-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.015),transparent_60%)] pointer-events-none" />

            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex items-center justify-between border-b border-card-border pb-3">
                <div className="flex items-center gap-2 text-foreground font-serif font-bold text-base">
                  {currentDetails.icon}
                  <span>{currentDetails.title}</span>
                </div>
                {currentDetails.keyMetric && (
                  <span className="text-[10px] font-mono text-muted bg-white/2 border border-white/5 px-2 py-0.5 rounded-md font-bold">
                    {currentDetails.keyMetric}
                  </span>
                )}
              </div>

              <p className="text-xs text-secondary leading-relaxed font-medium">
                {currentDetails.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-card-border relative z-10">
              <span className="text-[9px] text-muted font-mono uppercase tracking-wider font-bold">Technologies Employed</span>
              <div className="flex flex-wrap gap-1.5">
                {currentDetails.tech.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono font-medium text-white/90 border border-white/5 bg-white/2 px-2.5 py-0.5 rounded-md hover:border-white/15 hover:bg-white/5 transition-all cursor-default"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
