"use client";

import React, { useEffect, useState } from "react";
import { 
  Terminal, Activity, Cpu, HardDrive
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ═══════════════════════════════════════════
// PROJECTS PREVIEW
// ═══════════════════════════════════════════
export function ProjectsPreview() {
  return (
    <div className="flex flex-col gap-3 font-mono text-[11px] text-secondary w-full h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/10 transition-colors">
          <span className="text-foreground font-semibold flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            OutreachOps AI
          </span>
          <Badge variant="outline" className="text-[9px] border-cyan-500/20 text-cyan-400 bg-cyan-950/20 px-1.5 py-0">
            RUNNING
          </Badge>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/10 transition-colors">
          <span className="text-foreground font-semibold flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Interior Design ERP
          </span>
          <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 bg-emerald-950/20 px-1.5 py-0">
            ACTIVE
          </Badge>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-cyan-500/10 transition-colors">
          <span className="text-foreground font-semibold flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Solar Sizing Calculator
          </span>
          <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 bg-emerald-950/20 px-1.5 py-0">
            ACTIVE
          </Badge>
        </div>
      </div>
      <div className="flex items-center justify-between px-1 text-[9px] text-muted font-bold mt-1">
        <span>CORE: NEXT.JS / FASTAPI / DRIZZLE</span>
        <span>10+ TOTAL SYSTEMS</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SYSTEMS PREVIEW
// ═══════════════════════════════════════════
export function SystemsPreview() {
  return (
    <div className="relative w-full h-[100px] flex items-center justify-center bg-black/10 border border-white/5 rounded-xl overflow-hidden group/sys">
      {/* Schematic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:12px_12px] opacity-60 pointer-events-none" />
      
      <svg width="100%" height="100%" viewBox="0 0 160 80" className="relative z-10 w-full h-full p-2 overflow-visible">
        {/* Animated flow path */}
        <path 
          d="M 20 40 L 50 20 L 110 20 L 140 40 L 110 60 L 50 60 Z" 
          fill="none" 
          stroke="rgba(16, 185, 129, 0.15)" 
          strokeWidth="0.8" 
        />
        <path 
          d="M 20 40 L 50 20 L 110 20 L 140 40 L 110 60 L 50 60 Z" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="1.2" 
          strokeDasharray="4 20"
          className="animate-pulse"
          style={{
            animation: "flow-dash 10s linear infinite"
          }}
        />

        {/* Center cross lines */}
        <line x1="20" y1="40" x2="140" y2="40" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="80" y1="10" x2="80" y2="70" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

        {/* Connection nodes */}
        <g className="cursor-default">
          <circle cx="20" cy="40" r="3" fill="#10b981" />
          <text x="20" y="47" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">AI</text>
        </g>
        <g>
          <circle cx="50" cy="20" r="2.5" fill="#3b82f6" />
          <text x="50" y="15" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">DB</text>
        </g>
        <g>
          <circle cx="110" cy="20" r="2.5" fill="#f59e0b" />
          <text x="110" y="15" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">API</text>
        </g>
        <g>
          <circle cx="140" cy="40" r="3" fill="#8b5cf6" />
          <text x="140" y="47" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">AUTH</text>
        </g>
        <g>
          <circle cx="110" cy="60" r="2.5" fill="#ec4899" />
          <text x="110" y="67" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">QUANT</text>
        </g>
        <g>
          <circle cx="50" cy="60" r="2.5" fill="#14b8a6" />
          <text x="50" y="67" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 font-bold uppercase tracking-wider">ERP</text>
        </g>

        {/* Center core */}
        <circle cx="80" cy="40" r="4.5" fill="#022c22" stroke="#10b981" strokeWidth="1" className="animate-pulse" />
        <circle cx="80" cy="40" r="1.5" fill="#ffffff" />
      </svg>
      <style jsx>{`
        @keyframes flow-dash {
          to {
            stroke-dashoffset: -240;
          }
        }
      `}</style>
    </div>
  );
}

// ═══════════════════════════════════════════
// AI ASSISTANT PREVIEW
// ═══════════════════════════════════════════
export function AIAssistantPreview() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Vraj Patel builds custom enterprise ERPs and quantitative trading dashboards. Ask me about his tech stack or experience...";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index));
      index = (index + 1) % (fullText.length + 10);
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 font-mono text-[10px] w-full h-full select-none">
      <div className="flex items-center gap-1.5 text-blue-400 font-bold">
        <Activity className="h-3 w-3 animate-pulse" />
        <span>ask_vraj_llm.model</span>
      </div>
      <div className="bg-black/35 border border-white/5 rounded-lg p-3 min-h-[72px] flex flex-col gap-1.5 leading-relaxed text-secondary">
        <div>
          <span className="text-blue-400 font-bold">query: </span>
          <span className="text-foreground">Who is Vraj Patel?</span>
        </div>
        <div className="text-[10px]">
          <span className="text-emerald-400 font-bold">model: </span>
          <span>{typedText}</span>
          <span className="inline-block w-1.5 h-3 ml-0.5 bg-blue-400 cursor-blink" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TELEMETRY DASHBOARD PREVIEW
// ═══════════════════════════════════════════
export function TelemetryDashboardPreview() {
  const [metrics, setMetrics] = useState({ cpu: 5, ram: 0.12, views: 180 });
  const [waveSeed, setWaveSeed] = useState(0);

  useEffect(() => {
    // 1. Fetch real page views count from database stats
    fetch('/api/telemetry/stats')
      .then(res => res.json())
      .then(payload => {
        if (payload.success && payload.stats) {
          setMetrics(prev => ({
            ...prev,
            views: payload.stats.totalViews || prev.views
          }));
        }
      })
      .catch(() => {});

    // 2. Measure client CPU load via requestAnimationFrame (FPS)
    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 60;
    let rAFHandle: number;

    const measureFps = () => {
      const now = performance.now();
      frameCount++;
      if (now >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (now - lastTime));
        frameCount = 0;
        lastTime = now;
      }
      rAFHandle = requestAnimationFrame(measureFps);
    };
    rAFHandle = requestAnimationFrame(measureFps);

    // 3. Periodic metric check interval
    const interval = setInterval(() => {
      // Calculate CPU load: lower FPS correlates to busy main thread
      const currentCpu = Math.max(2, Math.min(99, Math.round(100 - (fps / 60) * 100 + (Math.random() * 4))));

      // Retrieve browser memory heap size if supported
      const perf = typeof window !== 'undefined' ? (window.performance as any) : null;
      const heap = perf && perf.memory ? perf.memory.usedJSHeapSize : null;
      const currentRam = heap
        ? parseFloat((heap / (1024 * 1024 * 1024)).toFixed(3))
        : parseFloat((0.082 + Math.random() * 0.012).toFixed(3));

      setMetrics(prev => ({
        ...prev,
        cpu: currentCpu,
        ram: currentRam
      }));
      setWaveSeed(s => s + 1);
    }, 2000);

    return () => {
      cancelAnimationFrame(rAFHandle);
      clearInterval(interval);
    };
  }, []);

  // Generate dynamic wave path coordinates based on CPU/RAM load
  const wavePath = (() => {
    const amp1 = 8 + (metrics.cpu / 20);
    const amp2 = 6 + (metrics.ram * 10);
    const phase = waveSeed * 0.5;
    
    const y1 = Math.round(18 + Math.sin(phase) * amp1);
    const y2 = Math.round(12 + Math.cos(phase + 1) * amp2);
    const y3 = Math.round(20 + Math.sin(phase + 2) * amp1);
    const y4 = Math.round(10 + Math.cos(phase + 3) * amp2);
    
    return `M0 25 Q 20 ${y1}, 45 ${y2} T 90 ${y3} T 135 ${y4} L 150 30 L 150 30 L 0 30 Z`;
  })();

  return (
    <div className="flex flex-col gap-3 font-mono w-full h-full select-none">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1 p-2 bg-white/[0.02] border border-white/5 rounded-lg items-center text-center">
          <Cpu className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-[8px] text-muted font-bold uppercase tracking-wider">CPU LOAD</span>
          <span className="text-[11px] font-bold text-foreground">{metrics.cpu}%</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-white/[0.02] border border-white/5 rounded-lg items-center text-center">
          <HardDrive className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-[8px] text-muted font-bold uppercase tracking-wider">MEM LOAD</span>
          <span className="text-[11px] font-bold text-foreground">{metrics.ram}GB</span>
        </div>
        <div className="flex flex-col gap-1 p-2 bg-white/[0.02] border border-white/5 rounded-lg items-center text-center">
          <Activity className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
          <span className="text-[8px] text-muted font-bold uppercase tracking-wider">PAGE VIEWS</span>
          <span className="text-[11px] font-bold text-foreground">{metrics.views}</span>
        </div>
      </div>

      <div className="relative w-full h-[32px] bg-black/20 border border-white/5 rounded-lg overflow-hidden flex items-end">
        <svg width="100%" height="100%" viewBox="0 0 150 30" preserveAspectRatio="none" className="w-full h-full">
          <path
            d={wavePath}
            fill="rgba(139, 92, 246, 0.08)"
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="0.8"
            className="transition-all duration-1000 ease-in-out"
          />
          <line x1="0" y1="15" x2="150" y2="15" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// RESUME PREVIEW
// ═══════════════════════════════════════════
export function ResumePreview() {
  return (
    <div className="flex flex-col gap-2.5 font-mono text-[10px] text-secondary w-full h-full">
      <div className="flex flex-col gap-1.5 border-l border-white/10 pl-3 ml-1.5 relative">
        <div className="absolute -left-[4.5px] top-1 h-2 w-2 rounded-full bg-amber-400" />
        <span className="text-[8px] text-muted font-bold uppercase">2026 - Internship</span>
        <span className="text-foreground font-semibold">Software Intern @ Pitbull Corp</span>
        <span className="text-[9px]">Delivered 5 enterprise client storefronts and ERP trackers.</span>
      </div>
      
      <div className="flex flex-col gap-1.5 border-l border-white/10 pl-3 ml-1.5 relative">
        <div className="absolute -left-[4.5px] top-1 h-2 w-2 rounded-full bg-zinc-600" />
        <span className="text-[8px] text-muted font-bold uppercase">2023 - 2027</span>
        <span className="text-foreground font-semibold">B.Tech CSE @ Nirma University</span>
        <span className="text-[9px]">Focus: Algorithms, Databases, Systems. CGPA: 7.98 / 10.</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TERMINAL PREVIEW
// ═══════════════════════════════════════════
export function TerminalPreview() {
  return (
    <div className="flex flex-col gap-2 font-mono text-[10px] text-secondary bg-black/20 border border-white/5 rounded-lg p-3 min-h-[96px] w-full h-full">
      <div className="flex items-center gap-1.5 border-b border-white/5 pb-1 text-muted text-[9px] font-bold">
        <Terminal className="h-3.5 w-3.5 text-rose-400" />
        <span>vraj_kernel_shell.sh</span>
      </div>
      <div className="flex flex-col gap-1 text-[9px]">
        <div>
          <span className="text-rose-400">guest@vraj-port:~$</span> <span className="text-foreground">ssh core.vraj.patel</span>
        </div>
        <div className="text-muted">Connecting to core.vraj.patel:22...</div>
        <div>
          <span className="text-emerald-400">Connection established. Welcome guest.</span>
        </div>
        <div>
          <span className="text-rose-400">core@vraj:~$</span> <span className="text-foreground">sys_diagnostic --full</span>
        </div>
        <div className="text-secondary font-semibold">
          AI: <span className="text-cyan-400">ONLINE</span> | DB: <span className="text-emerald-400">CONNECTED</span> | SYSTEM: <span className="text-blue-400">SECURE</span>
        </div>
      </div>
    </div>
  );
}
