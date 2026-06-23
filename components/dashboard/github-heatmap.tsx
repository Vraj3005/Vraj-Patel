'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { HeatmapCell } from '@/types/advanced';
import { Github, RefreshCw, Flame, Calendar, GitCommit } from 'lucide-react';

interface GithubHeatmapProps {
  username?: string;
}

import { parseDateString, alignDataToWeeks } from '@/lib/github/heatmap-utils';

export default function GithubHeatmap({ username }: GithubHeatmapProps) {
  const [account, setAccount] = useState<'combined' | 'personal' | 'academic'>('combined');
  const [data, setData] = useState<HeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const fetchContributions = (selectedAcc: typeof account, isInitial: boolean) => {
    if (isInitial) {
      setLoading(true);
    } else {
      setSyncing(true);
    }

    fetch(`/api/github/contributions?account=${selectedAcc}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch contributions');
        return res.json();
      })
      .then((payload) => {
        setData(payload.data || []);
      })
      .catch((err) => {
        console.error('Error fetching contributions:', err);
      })
      .finally(() => {
        setLoading(false);
        setSyncing(false);
      });
  };

  useEffect(() => {
    fetchContributions(account, true);
  }, [account]);

  const getColorClass = (level: HeatmapCell['level']) => {
    switch (level) {
      case 1: return 'fill-cyan-900/40 stroke-cyan-950/20';
      case 2: return 'fill-cyan-800/60 stroke-cyan-900/30';
      case 3: return 'fill-cyan-600/80 stroke-cyan-800/40';
      case 4: return 'fill-cyan-400 stroke-cyan-500/50 shadow-[0_0_8px_rgba(34,211,238,0.2)]';
      default: return 'fill-white/3 stroke-white/5';
    }
  };

  // 1. Calculate standard metrics directly from the raw chronological API data
  const totalCount = data.reduce((acc, c) => acc + c.count, 0);

  let currentStreak = 0;
  let maxStreak = 0;
  let busiestMonthStr = 'N/A';

  if (data.length > 0) {
    // Current streak calculation (active if contributed today or yesterday)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const hasRecent = data.some((d) => (d.date === todayStr || d.date === yesterdayStr) && d.count > 0);

    if (hasRecent) {
      for (let i = data.length - 1; i >= 0; i--) {
        const cell = data[i];
        if (cell.count > 0) {
          currentStreak++;
        } else {
          if (cell.date === todayStr) {
            continue;
          }
          break;
        }
      }
    }

    // Max streak calculation
    let tempStreak = 0;
    for (const cell of data) {
      if (cell.count > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) {
          maxStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }

    // Busiest month calculation
    const monthSums: Record<string, number> = {};
    data.forEach((cell) => {
      if (!cell.date) return;
      const [y, m] = cell.date.split('-');
      const date = new Date(Number(y), Number(m) - 1, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const key = `${monthName} ${y}`;
      monthSums[key] = (monthSums[key] || 0) + cell.count;
    });

    let maxMonthContributions = 0;
    Object.entries(monthSums).forEach(([month, sum]) => {
      if (sum > maxMonthContributions) {
        maxMonthContributions = sum;
        busiestMonthStr = `${month} (${sum})`;
      }
    });
  }

  // 2. Align data to starting Sunday and ending Saturday for consistent columns

  const weeks = alignDataToWeeks(data);

  // Determine months to label above weeks
  const monthLabels: { text: string; weekIdx: number }[] = [];
  let lastMonth = '';
  weeks.forEach((week, weekIdx) => {
    const validDay = week.find((d) => !(d as any).isPlaceholder);
    if (!validDay) return;
    const date = parseDateString(validDay.date);
    const monthName = date.toLocaleString('default', { month: 'short' });
    if (monthName !== lastMonth) {
      monthLabels.push({ text: monthName, weekIdx });
      lastMonth = monthName;
    }
  });

  if (loading) {
    return (
      <Card className="p-6 text-center text-xs font-mono text-secondary bg-card-bg/40 border-card-border h-[260px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-400" />
          <span>Synchronizing GitHub contribution calendar database...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-5">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Header and Switcher Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4 relative z-10 select-none">
        <div className="flex items-center gap-2">
          <Github className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">GitHub Activity Pipeline</h3>
          {syncing && <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400/80 ml-1" />}
        </div>
        
        {/* Switcher pills */}
        <div className="flex flex-wrap gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-xl">
          {[
            { id: 'combined', label: 'Combined' },
            { id: 'personal', label: 'Vraj3005 (Personal)' },
            { id: 'academic', label: '23bce377 (Academic)' }
          ].map((acc) => (
            <button
              key={acc.id}
              onClick={() => setAccount(acc.id as any)}
              className={`px-3 py-1 text-[10px] font-mono rounded-lg border transition-all duration-300 ${
                account === acc.id
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)] font-bold'
                  : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.04]'
              }`}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Heatmap Grid with dynamic HTML tooltips */}
      <div className="w-full overflow-x-auto scrollbar-none py-2 relative z-10">
        <svg width="735" height="110" className="mx-auto select-none overflow-visible">
          <g transform="translate(40, 25)">
            {/* Month labels at top */}
            {monthLabels.map((lbl, i) => (
              <text
                key={i}
                x={lbl.weekIdx * 13 + 4.5}
                y="-10"
                textAnchor="middle"
                className="fill-secondary text-[8.5px] font-mono font-medium"
              >
                {lbl.text}
              </text>
            ))}

            {/* Weekday labels on the left side */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
              // Standard GitHub behavior: print labels for Mon, Wed, Fri
              if (idx !== 1 && idx !== 3 && idx !== 5) return null;
              return (
                <text
                  key={day}
                  x="-12"
                  y={idx * 11 + 8}
                  textAnchor="end"
                  className="fill-secondary text-[8.5px] font-mono font-medium"
                >
                  {day}
                </text>
              );
            })}

            {/* Contribution Cells */}
            {weeks.map((week, weekIdx) => (
              <g key={weekIdx} transform={`translate(${weekIdx * 13}, 0)`}>
                {week.map((day, dayIdx) => {
                  const isPlaceholder = (day as any).isPlaceholder;
                  if (isPlaceholder) return null;

                  return (
                    <rect
                      key={day.date}
                      y={dayIdx * 11}
                      width="9"
                      height="9"
                      rx="1.5"
                      ry="1.5"
                      className={`transition-all duration-200 cursor-pointer ${getColorClass(day.level)} hover:scale-125 hover:stroke-cyan-300/30 hover:z-10`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const container = e.currentTarget.ownerSVGElement?.parentElement?.getBoundingClientRect();
                        if (container) {
                          setHoveredCell({
                            date: day.date,
                            count: day.count,
                            x: rect.left - container.left + rect.width / 2,
                            y: rect.top - container.top - 42
                          });
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </g>
            ))}
          </g>
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-end gap-1.5 px-2.5 mt-2.5 text-[9px] font-mono text-secondary select-none">
          <span>Less</span>
          <div className="h-2 w-2 rounded bg-white/3 border border-white/5" />
          <div className="h-2 w-2 rounded bg-cyan-900/40 border border-cyan-950/20" />
          <div className="h-2 w-2 rounded bg-cyan-800/60 border border-cyan-900/30" />
          <div className="h-2 w-2 rounded bg-cyan-600/80 border border-cyan-800/40" />
          <div className="h-2 w-2 rounded bg-cyan-400 border border-cyan-500/50" />
          <span>More</span>
        </div>

        {/* Custom Tooltip */}
        {hoveredCell && (
          <div
            className="absolute pointer-events-none z-50 bg-black/90 border border-cyan-500/30 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[9px] font-mono text-foreground flex flex-col gap-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-150"
            style={{
              left: `${hoveredCell.x}px`,
              top: `${hoveredCell.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="font-bold text-cyan-400 flex items-center gap-1">
              <GitCommit className="h-3 w-3" />
              {hoveredCell.count === 0 ? 'No contributions' : `${hoveredCell.count} contributions`}
            </div>
            <div className="text-secondary text-[8px]">{hoveredCell.date}</div>
          </div>
        )}
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative z-10">
        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/10 transition-all duration-300">
          <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-cyan-400">
            <GitCommit className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-secondary uppercase font-medium tracking-wider font-mono">Total Activity</span>
            <span className="text-sm font-bold text-foreground font-mono leading-none mt-1">{totalCount} commits</span>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/10 transition-all duration-300">
          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-500">
            <Flame className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-secondary uppercase font-medium tracking-wider font-mono">Current Streak</span>
            <span className="text-sm font-bold text-foreground font-mono leading-none mt-1">{currentStreak} days</span>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/10 transition-all duration-300">
          <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-500">
            <Flame className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-secondary uppercase font-medium tracking-wider font-mono">Maximum Streak</span>
            <span className="text-sm font-bold text-foreground font-mono leading-none mt-1">{maxStreak} days</span>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3 hover:border-cyan-500/10 transition-all duration-300">
          <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-secondary uppercase font-medium tracking-wider font-mono">Busiest Month</span>
            <span className="text-xs font-bold text-foreground font-mono leading-none mt-1 truncate max-w-[120px]" title={busiestMonthStr}>{busiestMonthStr}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

