'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Eye, Bot, Download, Mail, Clock, ShieldCheck } from 'lucide-react';

interface VitalsData {
  totalViews: number;
  totalAiQueries: number;
  totalResumeDownloads: number;
  totalInquiries: number;
  avgLatency: number;
  systemHealth: string;
  isDemoMode?: boolean;
}

interface DashboardVitalsProps {
  data: VitalsData | null;
  loading: boolean;
}

export default function DashboardVitals({ data, loading }: DashboardVitalsProps) {
  if (loading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Card
            key={idx}
            className="p-5 flex flex-col gap-3 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md animate-pulse"
          >
            <div className="h-4 w-12 bg-white/5 rounded" />
            <div className="h-6 w-20 bg-white/5 rounded mt-2" />
            <div className="h-3 w-16 bg-white/5 rounded mt-1" />
          </Card>
        ))}
      </div>
    );
  }

  const isDemo = !!data.isDemoMode;

  const cards = [
    {
      title: 'Page Views',
      value: isDemo ? 'Demo Mode' : data.totalViews.toLocaleString(),
      desc: 'Total visitor views',
      icon: <Eye className="h-4 w-4 text-cyan-400" />,
    },
    {
      title: 'AI Queries',
      value: isDemo ? 'Demo Mode' : data.totalAiQueries.toLocaleString(),
      desc: 'Ask Vraj inquiries',
      icon: <Bot className="h-4 w-4 text-cyan-400" />,
    },
    {
      title: 'CV Downloads',
      value: isDemo ? 'Demo Mode' : data.totalResumeDownloads.toLocaleString(),
      desc: 'Resume PDF pulls',
      icon: <Download className="h-4 w-4 text-cyan-400" />,
    },
    {
      title: 'Inquiries',
      value: isDemo ? 'Demo Mode' : data.totalInquiries.toLocaleString(),
      desc: 'Contact messages',
      icon: <Mail className="h-4 w-4 text-cyan-400" />,
    },
    {
      title: 'API Latency',
      value: isDemo ? 'Demo Mode' : `${data.avgLatency} ms`,
      desc: 'Average server speed',
      icon: <Clock className="h-4 w-4 text-cyan-400" />,
    },
    {
      title: 'Health Core',
      value: isDemo ? 'Demo Mode' : data.systemHealth,
      desc: 'Operational uptime',
      icon: <ShieldCheck className="h-4 w-4 text-cyan-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full">
      {cards.map((c, idx) => (
        <Card
          key={idx}
          className="p-5 flex flex-col gap-3 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md hover:border-cyan-500/20 group transition-all"
        >
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
              {c.title}
            </span>
            <div className="p-1.5 rounded-lg bg-white/3 border border-white/5 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/10 transition-colors">
              {c.icon}
            </div>
          </div>
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-xl font-bold text-foreground font-mono tracking-tight">
              {c.value}
            </span>
            <span className="text-[8px] font-mono text-secondary uppercase">
              {c.desc}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
