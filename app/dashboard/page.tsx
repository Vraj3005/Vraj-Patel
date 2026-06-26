'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardVitals from '@/components/dashboard/dashboard-vitals';
import FeaturedSummary from '@/components/dashboard/featured-summary';
import TechDistribution from '@/components/dashboard/tech-distribution';
import MetricsCharts from '@/components/metrics/metrics-charts';
import ComplexityCards from '@/components/metrics/complexity-cards';
import GithubHeatmap from '@/components/dashboard/github-heatmap';
import { Card } from '@/components/ui/card';
import {
  LayoutDashboard,
  BarChart3,
  Network,
  Terminal,
  Bot,
  ChevronRight,
  RefreshCw,
  FolderKanban
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/telemetry/stats');
        if (!res.ok) throw new Error('Stats retrieval failed');
        const payload = await res.json();
        
        setStats(payload.stats || null);
        setTimeline(payload.timeline || []);
        setRecentEvents(payload.recentEvents || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [refreshTrigger]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedTech(null);
  };

  const formatEventTime = (timestamp: string) => {
    try {
      const d = new Date(timestamp);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'N/A';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'success':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-800/30';
      case 'warning':
        return 'text-amber-400 bg-amber-950/20 border-amber-800/30';
      case 'error':
        return 'text-rose-400 bg-rose-950/20 border-rose-800/30';
      case 'trace':
        return 'text-purple-400 bg-purple-950/20 border-purple-800/30';
      default:
        return 'text-cyan-400 bg-cyan-950/20 border-cyan-800/30';
    }
  };
  return (
    <div className="flex flex-col gap-8 py-6 md:py-10 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-card-border pb-6 gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <LayoutDashboard className="h-4 w-4 text-cyan-400" /> Platform Observability Console
          </span>
          <h1 className="text-3xl md:text-4xl font-medium font-serif text-foreground tracking-tight">
            Engineering Intelligence
          </h1>
          <p className="text-xs md:text-sm text-secondary max-w-xl font-medium">
            Aggregated diagnostics showing real-time visit flows, options mathematics parameters, and developer commits telemetry.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2.5 bg-white/2 border border-card-border p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                : 'text-secondary hover:text-foreground border border-transparent'
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> High-Level Overview
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                : 'text-secondary hover:text-foreground border border-transparent'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> System Analytics
          </button>
          
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            disabled={loading}
            className="p-2 text-secondary hover:text-foreground disabled:opacity-50 transition-all cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stats Cards (Visible on both tabs) */}
      <DashboardVitals data={stats} loading={loading} />

      {/* Tab Contents */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Mid section: Showcase summary & distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="lg:col-span-1">
                  <FeaturedSummary
                    selectedCategory={selectedCategory}
                    selectedTech={selectedTech}
                    onClearFilters={handleClearFilters}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TechDistribution
                    onSelectCategory={setSelectedCategory}
                    onSelectTech={setSelectedTech}
                    selectedCategory={selectedCategory}
                    selectedTech={selectedTech}
                  />
                </div>
              </div>

              {/* Bottom section: Commit Pipeline & Live Events Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Heatmap */}
                <div className="lg:col-span-2">
                  <GithubHeatmap username="vrajpatel" />
                </div>
                
                {/* Recent events preview */}
                <Card className="lg:col-span-1 p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col justify-between gap-5 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
                  <div className="flex flex-col relative z-10 border-b border-card-border pb-3">
                    <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
                      Observability Feed
                    </span>
                    <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
                      Recent Activity Logs
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10 overflow-y-auto max-h-[220px] scrollbar-thin">
                    {loading ? (
                      Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="h-10 w-full bg-white/5 rounded animate-pulse" />
                      ))
                    ) : recentEvents.length === 0 ? (
                      <div className="text-center text-xs font-mono text-secondary py-8">
                        No activity recorded yet.
                      </div>
                    ) : (
                      recentEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex flex-col gap-1 text-[10px] font-mono border-b border-white/5 pb-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded border ${getSeverityColor(event.severity)}`}>
                              {event.severity.toUpperCase()}
                            </span>
                            <span className="text-muted text-[8px]">
                              {formatEventTime(event.timestamp)}
                            </span>
                          </div>
                          <span className="text-secondary truncate mt-0.5" title={event.message}>
                            {event.message}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <Link href="/systems" className="relative z-10">
                    <button className="w-full py-2.5 border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 text-[10px] text-white font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1">
                      Developer Operations Console <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6 w-full"
            >
              {/* Detailed metrics charts */}
              <MetricsCharts timelineData={timeline} statsData={stats} />

              {/* Complexity section */}
              <div className="flex flex-col gap-2 mt-4 border-t border-card-border pt-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-secondary flex items-center gap-1">
                  <FolderKanban className="h-4 w-4 text-cyan-400" /> Architectural blueprints
                </span>
                <h3 className="text-lg font-bold font-serif text-foreground">
                  Project Structural Complexity Tiers
                </h3>
                <p className="text-xs text-secondary max-w-xl">
                  Deep-dive descriptions of high-tier subsystems running in production.
                </p>
                <ComplexityCards />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-card-border pt-8 mt-4 select-none">
        <Link href="/terminal" className="group">
          <Card className="p-4 bg-card-bg/20 border-card-border hover:border-cyan-500/20 hover:bg-cyan-500/[0.01] transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/3 border border-white/5 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/10 text-cyan-400">
                <Terminal className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground font-serif">CLI Mode Terminal</span>
                <span className="text-[9px] font-mono text-secondary uppercase">Explore via developer shell</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </Card>
        </Link>

        <Link href="/ask-vraj" className="group">
          <Card className="p-4 bg-card-bg/20 border-card-border hover:border-cyan-500/20 hover:bg-cyan-500/[0.01] transition-all flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/3 border border-white/5 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/10 text-cyan-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground font-serif">AI Assistant chatbot</span>
                <span className="text-[9px] font-mono text-secondary uppercase">Ask custom project queries</span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </Card>
        </Link>
      </div>
    </div>
  );
}
