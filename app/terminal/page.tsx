'use client';

import React from 'react';
import CLITerminal from '@/components/console/cli-terminal';
import { Card } from '@/components/ui/card';
import { Terminal, Command } from 'lucide-react';
import { PageTitleReveal } from '@/components/motion/page-transition';

export default function TerminalPage() {
  return (
    <div className="flex flex-col gap-8 py-6 md:py-10 w-full mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-3 border-b border-card-border pb-6 shrink-0 select-none">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <Terminal className="h-4 w-4 text-cyan-400" /> System Command Center
        </span>
        <PageTitleReveal className="text-3xl md:text-4xl font-medium font-serif text-foreground tracking-tight">
          Interactive CLI Terminal
        </PageTitleReveal>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          A fully interactive command-driven terminal shell to probe system architectures, verify security layers, execute transaction flow traces, and chat with Ask Vraj AI.
        </p>
      </div>

      {/* Main Grid: Terminal + Help Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Terminal Area */}
        <div className="lg:col-span-8 flex flex-col gap-4 w-full">
          <CLITerminal />
          
          <div className="flex flex-wrap items-center justify-between text-[10px] text-secondary font-mono px-1">
            <span>Press <kbd className="bg-white/5 px-1 py-0.5 rounded border border-white/10 text-white font-bold">TAB</kbd> to cycle autocomplete matches</span>
            <span>Type <span className="text-white font-bold">clear</span> to reset screen logs</span>
          </div>
        </div>

        {/* Quick Help Panel Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 w-full select-none">
          <Card className="p-5 bg-card-bg/40 border-card-border backdrop-blur-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold font-mono text-foreground uppercase border-b border-card-border pb-2 flex items-center gap-1.5">
              <Command className="h-4 w-4 text-cyan-400" /> CLI Command Quick Reference
            </h3>
            
            <p className="text-[10px] text-secondary font-medium leading-relaxed font-mono">
              Type any command below in the input prompt or click one to execute it automatically:
            </p>

            <div className="flex flex-col gap-3 font-mono text-[9.5px]">
              <div>
                <span className="text-secondary font-black block text-[8px] uppercase tracking-wider mb-1">GENERAL KEYS</span>
                <ul className="flex flex-col gap-1 text-white">
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">help</code> - list all commands
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">whoami</code> - show bio details
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">contact</code> - show contacts
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-secondary font-black block text-[8px] uppercase tracking-wider mb-1">PROJECT DETAILS</span>
                <ul className="flex flex-col gap-1 text-white">
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">project list</code> - display all project slugs
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">project tech &lt;slug&gt;</code> - view technical stack
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">project flow &lt;slug&gt;</code> - trace data pipeline
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-secondary font-black block text-[8px] uppercase tracking-wider mb-1">ADVANCED DIAGNOSTICS</span>
                <ul className="flex flex-col gap-1 text-white">
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">show metrics</code> - view TTY vitals
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">show heatmap</code> - draw commits grid
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">show security &lt;slug&gt;</code> - audit security layers
                  </li>
                </ul>
              </div>

              <div>
                <span className="text-secondary font-black block text-[8px] uppercase tracking-wider mb-1">AI TELEMETRY CHAT</span>
                <ul className="flex flex-col gap-1 text-white">
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">ask &quot;&lt;question&gt;&quot;</code> - chat with Gemini
                  </li>
                  <li>
                    <code className="text-cyan-400 font-bold bg-white/2 px-1 rounded">recruiter-summary</code> - pitch candidate vitals
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
