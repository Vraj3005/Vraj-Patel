'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Network, Database, Cpu, Sparkles } from 'lucide-react';

export default function ComplexityCards() {
  const architectures = [
    {
      title: 'Implied Volatility Solver smile & Skew',
      project: 'MSPE Greeks & Volatility Engine',
      tech: 'FastAPI / Plotly.js / GARCH / XGBoost',
      desc: 'Solves options Black-Scholes implied volatilities via Newton-Raphson solvers in Python FastAPI, generating 3D surfaces rendered in Plotly.js canvas with hardware accelerations.',
      icon: <TrendingIcon />,
      tier: 'Tier 1 Algorithm'
    },
    {
      title: 'Redis Cache & QStash Worker pipeline',
      project: 'Bhagwati Interior ERP',
      tech: 'Upstash Redis / QStash Queue / Prisma',
      desc: 'Implements asynchronous queues to coordinate catalog price revisions and prevent concurrent SQLite write transactions locks, syncing client ledgers and invoice status notifications.',
      icon: <QueueIcon />,
      tier: 'Tier 2 Systems'
    },
    {
      title: 'Hydrated State-Coefficient Matrix',
      project: 'Enermass Solar Calculator & ERP',
      tech: 'Zustand Store / LocalStorage Hydration',
      desc: 'Computes state-by-state subsidies (PM Surya Ghar brackets) and complex invoice quantities overrides entirely on the client, caching active drafts offline in LocalStorage.',
      icon: <ClientIcon />,
      tier: 'Tier 2 Frontend'
    },
    {
      title: 'Async Scraper & Structured LLM Audits',
      project: 'OutreachOps AI',
      tech: 'FastAPI / Pydantic / Google GenAI SDK',
      desc: 'Orchestrates concurrent scraper tasks via Python asyncio. Invokes Gemini SDK models with strict Pydantic validation schemas to compile personalized pitches.',
      icon: <AiIcon />,
      tier: 'Tier 1 AI Ops'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
      {architectures.map((arch, idx) => (
        <Card
          key={idx}
          className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md hover:border-cyan-500/20 group transition-all flex flex-col gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-3 select-none">
            <span className="text-[8px] font-mono font-bold bg-cyan-950/30 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded-full">
              {arch.tier}
            </span>
          </div>

          <div className="flex gap-4 items-start relative z-10">
            <div className="p-2.5 rounded-xl bg-white/3 border border-white/5 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/10 text-cyan-400 transition-colors">
              {arch.icon}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                {arch.project}
              </span>
              <h4 className="text-sm font-bold font-serif text-foreground mt-0.5">
                {arch.title}
              </h4>
            </div>
          </div>

          <p className="text-[11px] text-secondary leading-relaxed font-medium pl-14">
            {arch.desc}
          </p>

          <div className="flex items-center gap-1.5 pl-14 mt-1 border-t border-white/5 pt-3">
            <span className="text-[8px] font-mono text-muted uppercase">Tech Stack:</span>
            <span className="text-[9px] font-mono text-foreground font-semibold">
              {arch.tech}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Small inline SVGs to minimize imports
function TrendingIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function ClientIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

function AiIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096L3 15.187m6 5.813l6-5.813M12 3.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 3.75zM12 18a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0112 18zM4.5 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zm12 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H17.25A.75.75 0 0116.5 12z" />
    </svg>
  );
}
