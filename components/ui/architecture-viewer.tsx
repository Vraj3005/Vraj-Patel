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
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'WebGL', 'TypeScript', 'Framer Motion'],
      description: 'Single-page surveyor workstation layout. Employs GPU-accelerated client WebGL shaders to compute coordinate trigonometry matrices in browser, avoiding heavy serverroundtrips.',
      keyMetric: 'WebGL load: <80ms'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Python', 'FastAPI', 'Pandas'],
      description: 'Modular calculations servers running on FastAPI. Manages the core quotation pricing matrices and coordinates scraper requests to inventory feeds.',
      keyMetric: 'Response time: ~45ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['PostgreSQL', 'SQLAlchemy'],
      description: 'Normalized database structure for client leads, regional solar coefficients, billing history, and supplier pricing lists.',
      keyMetric: '99.9% consistency rate'
    },
    ai: {
      title: 'Mathematical Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Geospatial coordinate arrays', 'Irradiance models'],
      description: 'Geospatial calculations to estimate shading factors and solar tilt optimizations based on regional coordinates.',
      keyMetric: '99.4% yield prediction accuracy'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel CDN', 'AWS EC2', 'GitHub Actions'],
      description: 'The Next.js frontend is served via Vercel Edge networks, and calculations servers run inside Docker containers on AWS EC2 nodes.',
      keyMetric: '99.98% uptime SLA'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['JWT auth', 'CORS restrictions', 'Webhook handshakes'],
      description: 'Enforces rigid CORS validation policies on the FastAPI servers, JWT token authorization, and cryptographic signature validations on supplier webhooks.',
      keyMetric: 'Zero CVE warnings'
    }
  },
  'bhagwati-interior-erp': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['React SPA', 'Redux Toolkit', 'Tailwind CSS'],
      description: 'Interactive designer budget tool and live progress layout screens. Uses dynamic form buffers to compute wood and metal pricing on-the-fly.',
      keyMetric: 'FPS: stable 60Hz'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Node.js', 'Express', 'PDFKit'],
      description: 'Express REST server hosting leads creation, designer kanbans, and serverless invoice PDF rendering engines.',
      keyMetric: 'Average API delay: 90ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['MongoDB Atlas', 'Mongoose'],
      description: 'Flexible JSON collections recording structural wood grades catalogs, furniture spec modifications, and clients details.',
      keyMetric: 'No-schema flexibility'
    },
    ai: {
      title: 'Automation Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Serverless billing triggers'],
      description: 'Standard rules engine mapping changes in interior materials specs directly to invoice ledgers.',
      keyMetric: 'Instant budget sync'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['AWS App Runner', 'AWS S3', 'Docker'],
      description: 'Node API is deployed via AWS App Runner containers. Rendered project attachments and customer PDFs write to secure AWS S3 buckets.',
      keyMetric: 'AWS pre-signed URLs'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Pre-signed S3 tokens', 'JSON schema validations'],
      description: 'Protects customer documents via pre-signed, short-lived AWS S3 URLs. Checks incoming admin mutations against rigid Zod models.',
      keyMetric: 'Role-based access'
    }
  },
  'constructionos-erp': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'IndexedDB', 'Tailwind CSS'],
      description: 'Client dashboard with offline-first support. Feeds timesheets and logs directly to indexedDB and syncs to server once connection is restored.',
      keyMetric: 'Offline buffer size: 50MB'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Go (Golang)', 'gRPC APIs', 'Goroutines'],
      description: 'High-speed Go microservices supporting concurrent worker requests, material tracking audits, and gRPC routes.',
      keyMetric: 'Concurrences: 10k+ req/sec'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['PostgreSQL', 'Redis WAL', 'CRDTs'],
      description: 'PostgreSQL database. Uses Conflict-free Replicated Data Types (CRDTs) to merge offline logs and updates Redis logs via Debezium pipeline.',
      keyMetric: 'Sync conflict rate: <0.1%'
    },
    ai: {
      title: 'Vision Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Computer Vision (planned)', 'OCR engines'],
      description: 'Automated steel reinforcement rebar counting utilizing image segmentation algorithms.',
      keyMetric: 'Under research'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Docker Swarm', 'VPS gateway', 'Nginx proxy'],
      description: 'Multi-tenant swarm node deployments across private VPS servers, balanced by Nginx reverse proxy buffers.',
      keyMetric: 'Multi-region deployment'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['RBAC checks', 'Immutable audit logs', 'HTTPS locks'],
      description: 'Immutable system audit trails tracking materials transfers. Secure role-based endpoint gating (RBAC) written in Go middleware.',
      keyMetric: 'Audit tampering blocked'
    }
  },
  'surendra-bus-body': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Three.js', 'Next.js', 'Draco Compression'],
      description: 'Interactive 3D coach configurations canvas. Draco compression processes structural GLTF files in-browser for immediate responsiveness.',
      keyMetric: 'Asset download payload: -75%'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Next.js Serverless Route API'],
      description: 'Lightweight contact request validations routing chassis configuration parameters to admin emails.',
      keyMetric: 'Cold start: ~120ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Static JSON catalogs'],
      description: 'No database storage server is used; config items are loaded from static, structured JSON files.',
      keyMetric: '0ms query latency'
    },
    ai: {
      title: 'Heuristics Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Three.js vector matrices'],
      description: 'Uses vector space calculations to map coordinate offsets for customized luxury seating distributions.',
      keyMetric: 'Perfect seats align'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge CDN'],
      description: 'Statically pre-rendered routes distributed across global edge nodes, ensuring minimal load delay.',
      keyMetric: 'LCP latency: <1.2s'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Honeypot form protection', 'Zod validation'],
      description: 'Honeypot inputs screen bot spam, while Zod schemas structure form details before compilation.',
      keyMetric: 'Spam forms blocked: 100%'
    }
  },
  'ecommerce-brand-websites': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js ISR', 'Tailwind CSS', 'GraphQL Client'],
      description: 'Incremental Static Regeneration pre-renders top selling item pages and lazy-generates the remaining pages upon request.',
      keyMetric: 'Static index hit rate: 94%'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Shopify Storefront GraphQL API'],
      description: 'Queries product catalogs and coordinates shopping carts via custom storefront GraphQL schemas.',
      keyMetric: 'Query latency: <110ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Shopify relational databases', 'Vercel KV cache'],
      description: 'Leverages Shopify transactional database pipelines for inventory, backed by Vercel KV caches for active user checkout sessions.',
      keyMetric: 'Edge cache hit: ~60%'
    },
    ai: {
      title: 'AI Optimization',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Algolia Search', 'Semantic cross-sellers'],
      description: 'Typo-tolerant search matching. Recommends alternative products based on shopping session embeddings.',
      keyMetric: 'Search latency: <40ms'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge network', 'Shopify CDN'],
      description: 'Fully hosted on Vercel with localized assets distribution, integrated with Shopify global checkout nodes.',
      keyMetric: 'Sub-second page loads'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Stripe 3DS tokens', 'Cryptographic signing'],
      description: 'Payment routes rely on iframe isolation and token signatures. Webhook listeners verify Shopify cryptographic parameters.',
      keyMetric: 'PCI-DSS Compliant routing'
    }
  },
  'ecommerce-business-dashboards': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'Recharts SVG', 'Radix UI'],
      description: 'Dashboard panels plotting sales performance, blended ROAS, and inventory health rates using optimized SVG Recharts grids.',
      keyMetric: 'Chart paint: <35ms'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Node.js', 'BullMQ queue', 'Redis pools'],
      description: 'Runs asynchronous BullMQ background workers to batch query Stripe, Shopify, and ad platforms APIs.',
      keyMetric: 'API rate limits bypass: 100%'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'Materialized Views'],
      description: 'Supabase PostgreSQL relational schemas with indexed views compiling multi-platform transactions instantly.',
      keyMetric: 'Query responses: <180ms'
    },
    ai: {
      title: 'Forecasting Layer',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Linear regression models'],
      description: 'Computes inventory depletion rates to warn merchants when stock is projected to run out.',
      keyMetric: 'Stockout forecasts'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Supabase hosting', 'Vercel Edge functions'],
      description: 'Ingestion routes run on serverless Vercel Edge functions, updating tables in Supabase cloud nodes.',
      keyMetric: 'Webhook sync: <30s'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['PostgreSQL RLS policies', 'OAuth 2.0 gates'],
      description: 'Secured via PostgreSQL Row Level Security (RLS) policies. Sensitive marketing and payout credentials stored under AES-256 wraps.',
      keyMetric: 'Strict data partitioning'
    }
  },
  'nf-lrd-regime-discovery': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'Plotly grids', 'TypeScript'],
      description: 'Visualizes structural market regimes and historical NIFTY 50 backtests using interactive Plotly charts.',
      keyMetric: 'UI renders: stable 60fps'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['FastAPI (Python)', 'Numba JIT compiler'],
      description: 'FastAPI server compiling hot mathematical computation loops to machine code vectors via Numba.',
      keyMetric: 'Simulation speedup: 25x'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['In-memory NumPy arrays', 'Parquet sheets'],
      description: 'Numerical compute lists are loaded directly in-memory using highly-indexed Parquet files.',
      keyMetric: '0ms database latency'
    },
    ai: {
      title: 'Machine Learning',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Hidden Markov Models (HMM)', 'GARCH models'],
      description: 'Hidden Markov Model (HMM) running Gaussian distributions to segment market volatility and returns vectors.',
      keyMetric: 'Win rate lift: +12%'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['AWS Lightsail VPS', 'Vercel CDN'],
      description: 'FastAPI calculations run continuously inside Python containers on AWS VPS, communicating with static Next.js frontend pages.',
      keyMetric: 'Calculations pipeline: <200ms'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['API keys isolation', 'Token authorizations'],
      description: 'Limits calculations execution access to authenticated API requests. Restricts FastAPI origins to portfolio domains.',
      keyMetric: 'CORS locked down'
    }
  },
  'mspe-volatility-engine': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Three.js', 'WebAssembly (C++)', 'Recharts'],
      description: 'Renders option implied volatility surface meshes in 3D using Draco-compressed Three.js vectors.',
      keyMetric: 'Mesh repaint: <45ms'
    },
    backend: {
      title: 'Backend Solver',
      icon: <Server className="h-4 w-4" />,
      tech: ['C++ WASM binary', 'Web Workers'],
      description: 'Mathematical solver compiled to WebAssembly (WASM), running options pricing in background Web Workers.',
      keyMetric: 'Greeks solved: 5,000+ /sec'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['In-memory struct arrays'],
      description: 'Calculated Greeks metrics are stored in-memory in C++ structure buffers, bypassing standard database layers.',
      keyMetric: 'Data latency: 0ms'
    },
    ai: {
      title: 'Solver Engine',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Newton-Raphson solvers', 'Cubic splines'],
      description: 'Newton-Raphson numerical solvers calculating implied volatilities, utilizing cubic splines to fill missing options.',
      keyMetric: 'Volatility accuracy: 99.98%'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Static Vercel CDN'],
      description: 'C++ code is compiled to WebAssembly binaries, bundled and served statically via Vercel CDN edge nodes.',
      keyMetric: 'Zero server dependencies'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Sandbox WASM runtime'],
      description: 'Calculations execute in sandboxed Web Worker contexts inside the client browser, mitigating server exploits.',
      keyMetric: '100% client-side safety'
    }
  },
  'btc-algo-trading': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'WebSockets client', 'Tailwind'],
      description: 'Real-time dashboard plotting Binance candlestick updates and momentum indicators via secure socket streams.',
      keyMetric: 'Feeds update: <100ms'
    },
    backend: {
      title: 'Backend Worker',
      icon: <Server className="h-4 w-4" />,
      tech: ['Node.js worker daemon', 'WebSockets server'],
      description: 'Node.js daemon tracking live exchange prices, computing trend signals, and pushing updates via WebSockets.',
      keyMetric: 'Signal execution: <120ms'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['PostgreSQL', 'TimescaleDB indices'],
      description: 'PostgreSQL database. Manages historical close levels and trade execution logs, indexed by timestamp metrics.',
      keyMetric: 'Sharpe ratio math: <50ms'
    },
    ai: {
      title: 'Signal Engine',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Trend momentum filters', 'Sharpe/Sortino math'],
      description: 'Algorithmic models tracking momentum breakouts. Position sizes adapt dynamically based on maximum drawdown indicators.',
      keyMetric: 'Alpha lift: +24.8%'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['AWS EC2 continuous node', 'AWS API Gateway'],
      description: 'The background worker service runs on AWS EC2 instances, pushing updates to the dashboard via AWS API Gateway WebSocket routes.',
      keyMetric: 'WebSocket throughput: 1k msg/sec'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['AES-256 API secrets', 'AWS security limits'],
      description: 'Encrypts private exchange API credentials using AES-256-GCM. Restricted AWS security groups filter database ingress.',
      keyMetric: 'Secrets stored in AWS KMS'
    }
  },
  'ai-cold-email-automation': {
    frontend: {
      title: 'Frontend Engine',
      icon: <Layout className="h-4 w-4" />,
      tech: ['Next.js', 'TypeScript', 'Tailwind UI'],
      description: 'Outbound monitoring desk listing parsed prospects, campaign configurations, and email sequences templates.',
      keyMetric: 'Table load: <60ms'
    },
    backend: {
      title: 'Backend Services',
      icon: <Server className="h-4 w-4" />,
      tech: ['Node.js API', 'LangChain JS', 'Vercel Cron'],
      description: 'Next.js API endpoints triggering LangChain extraction pipelines. Chron tasks trigger outbound email sends in batches.',
      keyMetric: 'Cron interval: 10 mins'
    },
    database: {
      title: 'Database Schema',
      icon: <Database className="h-4 w-4" />,
      tech: ['Supabase PostgreSQL', 'PostgreSQL triggers'],
      description: 'Supabase PostgreSQL relational tables. Monitors campaign status, prospective leads listings, and dispatch records.',
      keyMetric: 'Triggers throttling safety: 100%'
    },
    ai: {
      title: 'LLM Orchestration',
      icon: <Cpu className="h-4 w-4" />,
      tech: ['Gemini API (Flash/Pro)', 'Structured JSON'],
      description: 'LangChain pipelines crawlers scrape company pages, querying Gemini with strict Zod schemas to extract verified email context.',
      keyMetric: 'Structured compliance: 100%'
    },
    deployment: {
      title: 'Deployment Architecture',
      icon: <Globe className="h-4 w-4" />,
      tech: ['Vercel Edge functions', 'Supabase triggers'],
      description: 'LangChain routines run inside serverless Vercel functions, writing prospects records to a Supabase database instance.',
      keyMetric: 'Cold start: ~150ms'
    },
    security: {
      title: 'Security Audits',
      icon: <ShieldCheck className="h-4 w-4" />,
      tech: ['Prompt validation schemas', 'SMTP keys protection'],
      description: 'Strict Zod schemas filter LLM payloads, protecting against prompt injections. SMTP credentials encrypted at database level.',
      keyMetric: 'API calls rate-limited'
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
