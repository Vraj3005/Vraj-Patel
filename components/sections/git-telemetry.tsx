'use client';

import { Card } from '@/components/ui/card';
import { GitBranch, CheckCircle } from 'lucide-react';

export default function GitTelemetry() {
  const columns = Array.from({ length: 24 });
  const rows = Array.from({ length: 7 });

  const getIntensityClass = (cIdx: number, rIdx: number) => {
    const val = (cIdx * rIdx + cIdx * 3 + rIdx * 7) % 7;
    if (val === 0) return 'bg-white/[0.02]';
    if (val < 3) return 'bg-white/[0.08]';
    if (val < 5) return 'bg-white/[0.2]';
    return 'bg-white/[0.5]';
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contribution Grid */}
        <Card className="lg:col-span-2 p-6 flex flex-col gap-5 justify-between">
          <div className="flex items-center justify-between border-b border-card-border pb-3">
            <span className="text-xs font-medium text-foreground uppercase tracking-wider font-mono">
              Contributions
            </span>
          </div>

          <div className="flex flex-col gap-1 overflow-x-auto pb-2 scrollbar-thin">
            {rows.map((_, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                {columns.map((_, cIdx) => (
                  <div
                    key={cIdx}
                    className={`h-2.5 w-2.5 rounded-sm ${getIntensityClass(cIdx, rIdx)}`}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-muted font-medium uppercase tracking-wide font-mono">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-sm bg-white/[0.02]" />
              <div className="h-2 w-2 rounded-sm bg-white/[0.08]" />
              <div className="h-2 w-2 rounded-sm bg-white/[0.2]" />
              <div className="h-2 w-2 rounded-sm bg-white/[0.5]" />
            </div>
            <span>More</span>
          </div>
        </Card>

        {/* Status */}
        <Card className="lg:col-span-1 p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-medium text-foreground uppercase tracking-wider border-b border-card-border pb-3 block font-mono">
              Status
            </span>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Portfolio</span>
                <span className="text-foreground font-mono font-medium flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Deployed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Stack</span>
                <span className="text-foreground font-mono font-medium">Next.js + TS</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Hosting</span>
                <span className="text-foreground font-mono font-medium">Vercel Edge</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs mt-2">
            <div className="bg-white/[0.02] border border-card-border rounded-xl py-3 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted uppercase font-medium tracking-wider font-mono">Projects</span>
              <span className="text-foreground font-bold text-sm">10+</span>
            </div>
            <div className="bg-white/[0.02] border border-card-border rounded-xl py-3 flex flex-col gap-0.5">
              <span className="text-[10px] text-muted uppercase font-medium tracking-wider font-mono">Clients</span>
              <span className="text-foreground font-bold text-sm">5+</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
