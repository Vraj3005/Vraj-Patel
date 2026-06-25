'use client';

import { Card } from '@/components/ui/card';
import { GitBranch, CheckCircle } from 'lucide-react';
import GithubHeatmap from '@/components/dashboard/github-heatmap';

export default function GitTelemetry() {
  return (
    <section className="py-12 md:py-16 flex flex-col gap-8">
      <div className="flex flex-col gap-2 max-w-xl">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <GitBranch className="h-3.5 w-3.5 text-secondary" /> Activity
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          GitHub Activity
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Real Dynamic Heatmap Column */}
        <div className="lg:col-span-2">
          <GithubHeatmap username="Vraj3005" />
        </div>

        {/* Status */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between gap-4 bg-card-bg/40 border-card-border backdrop-blur-md">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-foreground uppercase tracking-wider border-b border-card-border pb-3 block font-mono">
              Status Snapshot
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Portfolio</span>
                <span className="text-foreground font-mono font-medium flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Deployed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Core Stack</span>
                <span className="text-foreground font-mono font-medium">Next.js + Tailwind</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Data Sync</span>
                <span className="text-foreground font-mono font-medium">Supabase Realtime</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2">
            <div className="bg-white/[0.02] border border-card-border rounded-xl py-3 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted uppercase font-medium tracking-wider font-mono">Projects</span>
              <span className="text-foreground font-bold text-sm">11 Real</span>
            </div>
            <div className="bg-white/[0.02] border border-card-border rounded-xl py-3 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted uppercase font-medium tracking-wider font-mono">Clients</span>
              <span className="text-foreground font-bold text-sm">5 Deployed</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
