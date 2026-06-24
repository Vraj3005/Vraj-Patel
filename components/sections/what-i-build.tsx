'use client';

import { Card } from '@/components/ui/card';
import { Globe, ShoppingBag, BarChart3, Database, Calculator, Cpu, LineChart, TrendingUp, Sparkles } from 'lucide-react';

interface SpecialtyCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const specialties: SpecialtyCard[] = [
  {
    icon: <Globe className="h-5 w-5 text-white" />,
    title: 'Business Websites',
    description: 'High-conversion, SEO-optimized presentation portals for commercial enterprises.',
  },
  {
    icon: <ShoppingBag className="h-5 w-5 text-white" />,
    title: 'E-commerce Platforms',
    description: 'Headless static checkout flows integrated with global payment networks.',
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-white" />,
    title: 'Admin Dashboards',
    description: 'Real-time telemetry and management controls backed by relational database views.',
  },
  {
    icon: <Database className="h-5 w-5 text-white" />,
    title: 'ERP Systems',
    description: 'Custom internal resource scheduling and supply chain tracking ledgers.',
  },
  {
    icon: <Calculator className="h-5 w-5 text-white" />,
    title: 'Quotation Calculators',
    description: 'Fast mathematical calculators driven by Zustand LocalState persistent calculations for instant quote generation.',
  },
  {
    icon: <Cpu className="h-5 w-5 text-white" />,
    title: 'AI Automation Tools',
    description: 'Outbound campaigns driven by structured LLM outputs, Google GenAI SDK, and Zod parsers.',
  },
  {
    icon: <LineChart className="h-5 w-5 text-white" />,
    title: 'Quant Research Dashboards',
    description: 'Probability density models and historical regime-switching charts.',
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-white" />,
    title: 'Trading Analytics Platforms',
    description: 'Algorithmic signal dashboards displaying real-time cryptocurrency telemetry.',
  },
];

export default function WhatIBuild() {
  return (
    <section className="py-12 md:py-16 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2.5 max-w-xl">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-gray-400" /> Specialization
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          What Systems I Build
        </h2>
        <p className="text-xs md:text-sm text-muted leading-relaxed">
          I don&apos;t build generic templates. I engineer focused business assets that track material chains, calculate parameters in real time, and process market data.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specialties.map((item, idx) => (
          <Card
            key={idx}
            className="p-5 bg-[#0a0a0c]/60 border border-white/5 flex flex-col gap-3.5 hover:border-white/15 hover:shadow-md transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center">
              {item.icon}
            </div>
            <div className="flex flex-col gap-1 text-left">
              <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
              <p className="text-[11px] text-muted leading-relaxed font-semibold">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
