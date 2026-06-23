'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Info, Server, Cpu, Layers, Activity, Shield, GitCommit } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Dynamically lazy-loaded heavy visualizers
const SystemVisualizer = dynamic(() => import('@/components/visualizers/system-visualizer'), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-xs font-mono text-secondary">Initializing System visualizer context...</div>
});

const SecurityVisualizer = dynamic(() => import('@/components/security/security-visualizer'), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-xs font-mono text-secondary">Initializing Security layer stack...</div>
});

const QueryLifecycle = dynamic(() => import('@/components/query/query-lifecycle'), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-xs font-mono text-secondary">Initializing Request lifecycle logs...</div>
});

const DeveloperConsole = dynamic(() => import('@/components/console/developer-console'), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-xs font-mono text-secondary">Initializing Developer telemetry logs...</div>
});

export default function SystemsPlayground() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'security' | 'lifecycle' | 'telemetry'>('architecture');

  return (
    <div className="flex flex-col gap-8 py-6 md:py-10 max-w-5xl mx-auto w-full px-4 sm:px-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-card-border pb-6 shrink-0 select-none">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <Network className="h-4 w-4 text-foreground" /> Systems Exploration Desk
        </span>
        <h1 className="text-3xl md:text-4xl font-medium font-serif text-foreground tracking-tight">
          System Control Center
        </h1>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          Inspect Vraj Patel&apos;s architectural frameworks, interactive security layers, and real-time backend operations from a unified console.
        </p>
      </div>

      {/* Control Tabs switcher */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.01] border border-white/5 rounded-xl select-none max-w-md relative z-20">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-305 flex items-center justify-center gap-1.5 ${
            activeTab === 'architecture'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]'
              : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
          }`}
        >
          <Network className="h-3.5 w-3.5" /> Architecture
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-305 flex items-center justify-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]'
              : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
          }`}
        >
          <Shield className="h-3.5 w-3.5" /> Security Stack
        </button>
        <button
          onClick={() => setActiveTab('lifecycle')}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-305 flex items-center justify-center gap-1.5 ${
            activeTab === 'lifecycle'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]'
              : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
          }`}
        >
          <GitCommit className="h-3.5 w-3.5" /> Request Flow
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 px-3 py-2 text-xs font-mono rounded-lg border transition-all duration-305 flex items-center justify-center gap-1.5 ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold shadow-[0_0_8px_rgba(6,182,212,0.1)]'
              : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
          }`}
        >
          <Activity className="h-3.5 w-3.5" /> Telemetry Log
        </button>
      </div>

      {/* Dynamic Tab Views */}
      <div className="w-full relative z-10 min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'architecture' && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <SystemVisualizer allowProjectSwitching={true} />
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <SecurityVisualizer />
            </motion.div>
          )}

          {activeTab === 'lifecycle' && (
            <motion.div
              key="lifecycle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <QueryLifecycle />
            </motion.div>
          )}

          {activeTab === 'telemetry' && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4 w-full"
            >
              <div className="border-b border-card-border pb-3 select-none">
                <h2 className="text-xl font-medium font-serif text-foreground tracking-tight flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" /> Live System Telemetry Stream
                </h2>
                <p className="text-xs text-secondary mt-1 max-w-2xl font-medium">
                  Review actual application activity from the portfolio in real time. Public visitors only see public-safe operational events.
                </p>
              </div>
              <DeveloperConsole adminMode={false} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-card-border">
        <Card className="p-5 flex flex-col gap-3 bg-card-bg/40 border-card-border backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-card-border pb-2 text-foreground font-serif font-bold text-xs select-none">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Interactive Controls</span>
          </div>
          <p className="text-[10px] text-secondary leading-relaxed font-mono">
            Switch between views inside each tab. Toggle Recruiter Mode to see business impact, or Technical Mode to inspect security code snippets.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-3 bg-card-bg/40 border-card-border backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-card-border pb-2 text-foreground font-serif font-bold text-xs select-none">
            <Server className="h-4 w-4 text-emerald-450" />
            <span>Risk Management</span>
          </div>
          <p className="text-[10px] text-secondary leading-relaxed font-mono">
            Review detailed threat matrix logs mapping the mitigation vectors of each defense layer, detailing SOC2-level compliance status.
          </p>
        </Card>

        <Card className="p-5 flex flex-col gap-3 bg-card-bg/40 border-card-border backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-card-border pb-2 text-foreground font-serif font-bold text-xs select-none">
            <Cpu className="h-4 w-4 text-fuchsia-400" />
            <span>Real-Time Logs</span>
          </div>
          <p className="text-[10px] text-secondary leading-relaxed font-mono">
            Tuning client events writes logs to the Telemetry tab in real time. Submit a contact form or query Ask Vraj to watch the pipeline fire.
          </p>
        </Card>
      </div>
    </div>
  );
}
