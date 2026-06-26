"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HEALTH_MODULES } from "@/lib/health/public-health";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { 
  Monitor, Database, Sparkles, Github, Mail, 
  LayoutDashboard, Globe, Lock, Activity
} from "lucide-react";
import Link from "next/link";

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor, Database, Sparkles, Github, Mail, 
  LayoutDashboard, Globe, Lock
};

interface SystemHealthHudProps {
  className?: string;
}

export default function SystemHealthHud({ className }: SystemHealthHudProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const shouldReduce = useReducedMotionSafe();

  const filters = ["All", "App", "Data", "AI", "Security", "External"];

  // Filter modules
  const filteredModules = activeFilter === "All" 
    ? HEALTH_MODULES 
    : HEALTH_MODULES.filter(m => m.category === activeFilter);

  // Active hover node dependencies
  const hoveredModule = hoveredId ? HEALTH_MODULES.find(m => m.id === hoveredId) : null;

  const colorThemes = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20" },
    emerald: { text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", glow: "shadow-emerald-500/20" },
    amber: { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", glow: "shadow-amber-500/20" },
    violet: { text: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", glow: "shadow-violet-500/20" },
    rose: { text: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5", glow: "shadow-rose-500/20" },
    blue: { text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", glow: "shadow-blue-500/20" },
  };

  return (
    <div className={cn("w-full flex flex-col gap-5 relative select-none", className)}>
      
      {/* Category Tabs & Telemetry Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-card-border pb-3">
        <div className="flex items-center gap-2 font-mono text-[9px] text-muted tracking-wider uppercase font-bold">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" /> Public System Nodes HUD
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-1 bg-white/[0.01] border border-white/5 p-0.5 rounded-lg select-none">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-2.5 py-1 text-[9px] font-mono rounded transition-all cursor-pointer",
                activeFilter === filter
                  ? "bg-white/5 text-foreground font-bold border border-white/5"
                  : "text-secondary hover:text-foreground border border-transparent"
              )}
            >
              {filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic HUD grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative">
        {filteredModules.map((module) => {
          const Icon = IconMap[module.iconName] || Monitor;
          const theme = colorThemes[module.accent];

          // Determine hover highlight/dim relationships
          const isHovered = hoveredId === module.id;
          const isDependency = hoveredModule ? hoveredModule.dependencies.includes(module.id) : false;
          const isDimmed = hoveredId !== null && !isHovered && !isDependency;

          return (
            <Link
              key={module.id}
              href={module.href}
              className="block no-underline"
            >
              <motion.div
                onMouseEnter={() => setHoveredId(module.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "cursor-pointer p-4 rounded-xl border relative overflow-hidden transition-all duration-300 flex flex-col justify-between aspect-[4/3]",
                  isDimmed 
                    ? "opacity-30 blur-[0.2px] scale-[0.98] border-white/5 bg-zinc-950/10" 
                    : cn("bg-card-bg/40 backdrop-blur-md", isHovered || isDependency ? cn("scale-101 border-white/15", theme.glow) : "border-card-border"),
                  isHovered && "border-white/20"
                )}
                style={{
                  zIndex: isHovered || isDependency ? 20 : 10
                }}
              >
                {/* Radial gradient background on hover */}
                {isHovered && !shouldReduce && (
                  <div className={cn("absolute inset-0 opacity-10 pointer-events-none", theme.bg)} />
                )}

                {/* Top details */}
                <div className="flex justify-between items-start z-10 font-mono">
                  <span className="text-[7.5px] text-muted font-bold tracking-widest uppercase">
                    SYS::{module.id.toUpperCase()}
                  </span>
                  
                  {/* Icon wrapper */}
                  <div className={cn("p-1.5 rounded-lg border border-white/5 bg-white/[0.01]", isHovered || isDependency ? theme.text : "text-secondary")}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                {/* Title & info */}
                <div className="z-10 text-left mt-3 flex-1 flex flex-col justify-end">
                  <h4 className="text-xs font-bold text-foreground tracking-tight font-serif">
                    {module.name}
                  </h4>
                  <p className="text-[9px] text-secondary leading-relaxed font-medium mt-1 truncate">
                    {module.description}
                  </p>
                </div>

                {/* Footer status bar */}
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5 z-10 font-mono text-[8px] text-muted">
                  <span>CHECKED: {module.lastChecked}</span>
                  
                  {/* Status Badge with blinking pulse */}
                  <div className="flex items-center gap-1 font-bold">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full animate-pulse",
                      ["Online", "Protected", "Synced", "Available"].includes(module.status) 
                        ? "bg-emerald-500" 
                        : "bg-cyan-500"
                    )} />
                    <span className={cn(
                      "uppercase tracking-wider",
                      ["Online", "Protected", "Synced", "Available"].includes(module.status) 
                        ? "text-emerald-400" 
                        : "text-cyan-400"
                    )}>
                      {module.status}
                    </span>
                  </div>
                </div>

                {/* Render small dependency indicators on card boundary */}
                {isHovered && module.dependencies.length > 0 && (
                  <div className="absolute top-1 right-12 font-mono text-[6.5px] text-cyan-400 uppercase tracking-widest animate-pulse font-bold">
                    deps loaded
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
