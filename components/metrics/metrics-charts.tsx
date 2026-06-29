'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { projects } from '@/lib/data/projects';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface MetricsChartsProps {
  timelineData: any[];
  statsData: {
    totalViews: number;
    totalAiQueries: number;
    totalResumeDownloads: number;
    totalInquiries: number;
    avgLatency: number;
    systemHealth: string;
    isDemoMode?: boolean;
  } | null;
}

// Complexity mapping for the projects
const projectComplexities: Record<string, {
  ui: number;
  backend: number;
  db: number;
  ai: number;
  quant: number;
}> = {
  'solar-sizing-calculator': { ui: 90, backend: 70, db: 65, ai: 10, quant: 60 },
  'outreachops-ai': { ui: 60, backend: 90, db: 70, ai: 95, quant: 10 },
  'interior-design-erp': { ui: 75, backend: 85, db: 80, ai: 50, quant: 20 },
  'anjeer-marketplace': { ui: 80, backend: 80, db: 85, ai: 20, quant: 10 },
  'anjeer-admin-dashboard': { ui: 85, backend: 70, db: 75, ai: 15, quant: 10 },
  'clothing-brand-website': { ui: 95, backend: 65, db: 60, ai: 10, quant: 0 },
  'clothing-brand-admin': { ui: 85, backend: 75, db: 75, ai: 10, quant: 0 },
  'bus-body-builder-website': { ui: 70, backend: 30, db: 20, ai: 10, quant: 0 },
  'mspe-volatility-engine': { ui: 80, backend: 85, db: 45, ai: 50, quant: 95 },
  'nf-lrd-regime-discovery': { ui: 50, backend: 70, db: 30, ai: 75, quant: 90 },
  'btc-algo-trading': { ui: 45, backend: 65, db: 25, ai: 30, quant: 80 }
};

export default function MetricsCharts({ timelineData, statsData }: MetricsChartsProps) {
  const [selectedSlug, setSelectedSlug] = useState<string>('solar-sizing-calculator');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prepare radar chart data for selected project
  const currentComplexity = projectComplexities[selectedSlug] || { ui: 50, backend: 50, db: 50, ai: 50, quant: 50 };
  
  const radarData = [
    { subject: 'Frontend / UI / UX', score: currentComplexity.ui, fullMark: 100 },
    { subject: 'Backend / API', score: currentComplexity.backend, fullMark: 100 },
    { subject: 'DB / Caching', score: currentComplexity.db, fullMark: 100 },
    { subject: 'AI / LLM Ops', score: currentComplexity.ai, fullMark: 100 },
    { subject: 'Quant / Algorithms', score: currentComplexity.quant, fullMark: 100 }
  ];

  // Aggregate average complexities for comparison bar chart
  const averageComplexityData = [
    {
      name: 'UI/UX',
      Average: Math.round(Object.values(projectComplexities).reduce((acc, c) => acc + c.ui, 0) / Object.keys(projectComplexities).length),
      Max: 95
    },
    {
      name: 'Backend/API',
      Average: Math.round(Object.values(projectComplexities).reduce((acc, c) => acc + c.backend, 0) / Object.keys(projectComplexities).length),
      Max: 90
    },
    {
      name: 'DB/Caching',
      Average: Math.round(Object.values(projectComplexities).reduce((acc, c) => acc + c.db, 0) / Object.keys(projectComplexities).length),
      Max: 85
    },
    {
      name: 'AI/LLM Ops',
      Average: Math.round(Object.values(projectComplexities).reduce((acc, c) => acc + c.ai, 0) / Object.keys(projectComplexities).length),
      Max: 95
    },
    {
      name: 'Quant/Math',
      Average: Math.round(Object.values(projectComplexities).reduce((acc, c) => acc + c.quant, 0) / Object.keys(projectComplexities).length),
      Max: 95
    }
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Timeline Analytics */}
      <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex justify-between items-center relative z-10 border-b border-card-border pb-3 mb-2 select-none">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-foreground font-serif tracking-tight">
              Engagement & Telemetry Trends (7 Days)
            </h3>
            {statsData?.isDemoMode && (
              <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded ml-2">
                Demo Mode
              </span>
            )}
          </div>
          <span className="text-[9px] font-mono text-secondary uppercase">
            Hourly updates synced
          </span>
        </div>

        <div className="h-64 w-full relative z-10">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#0a0a0a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#9ca3af', fontSize: '10px', fontFamily: 'monospace' }}
                itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Area
                type="monotone"
                dataKey="Page Views"
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorViews)"
                name="Page Views"
              />
              <Area
                type="monotone"
                dataKey="AI Queries"
                stroke="#a855f7"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#colorAi)"
                name="AI Queries"
              />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-white/2 rounded-xl animate-pulse" />
          )}
        </div>
      </Card>

      {/* Sub-grid: Radar Complexity vs Comparison bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Project Radar Complexity */}
        <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center relative z-10 border-b border-card-border pb-3 select-none">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
                Complexity Profile
              </span>
              <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
                Architecture Radar Plot (Self-assessed)
              </h3>
            </div>
            
            {/* Project Dropdown Selector */}
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="bg-[#0e0e11] border border-white/15 text-white text-[10px] font-mono font-semibold py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-cyan-500/30 cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title.split(' (')[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="h-64 w-full relative z-10 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={8} tickLine={false} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={8} />
                  <Radar
                    name="Complexity Score"
                    dataKey="score"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#22d3ee', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-white/2 rounded-xl animate-pulse" />
            )}
          </div>
        </Card>

        {/* Global Average Architecture Complexity (Bar Chart) */}
        <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="flex flex-col relative z-10 select-none border-b border-card-border pb-3">
            <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
              Cross-Platform Benchmarks
            </span>
            <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
              Average vs Max Complexity (Self-assessed)
            </h3>
          </div>

          <div className="h-64 w-full relative z-10">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={averageComplexityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} />
                  <YAxis stroke="#6b7280" fontSize={9} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: '#0a0a0a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="Average" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="Max" fill="#8b5cf6" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-white/2 rounded-xl animate-pulse" />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
