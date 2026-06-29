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

function SystemNodeGraphic({ 
  id, 
  className, 
  isHovered, 
  color 
}: { 
  id: string; 
  className?: string; 
  isHovered: boolean; 
  color: string;
}) {
  const filterId = `glow-${id}`;
  const gradientId = `grad-${id}`;

  const renderContent = () => {
    switch (id) {
      case "app":
        return (
          <>
            {/* Screen frame */}
            <rect x="5" y="5" width="90" height="50" rx="3" stroke={`url(#${gradientId})`} strokeWidth="1" />
            <line x1="5" y1="15" x2="95" y2="15" stroke={`url(#${gradientId})`} strokeWidth="0.8" />
            
            {/* Window control dots */}
            <circle cx="11" cy="10" r="1.2" fill="#ef4444" opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="16" cy="10" r="1.2" fill="#f59e0b" opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="21" cy="10" r="1.2" fill="#10b981" opacity={isHovered ? 0.9 : 0.5} />
            
            {/* Wireframe Layout */}
            <line x1="10" y1="22" x2="25" y2="22" stroke={color} strokeWidth="1.2" opacity={isHovered ? 0.7 : 0.3} />
            <line x1="10" y1="28" x2="20" y2="28" stroke={`url(#${gradientId})`} strokeWidth="0.8" opacity={isHovered ? 0.6 : 0.2} />
            <line x1="10" y1="34" x2="22" y2="34" stroke={`url(#${gradientId})`} strokeWidth="0.8" opacity={isHovered ? 0.6 : 0.2} />
            
            {/* Main dashboard mockup inside screen */}
            <rect x="32" y="22" width="56" height="26" rx="1.5" stroke={color} strokeWidth="0.8" opacity={isHovered ? 0.6 : 0.3} fill={`${color}05`} />
            <line x1="38" y1="28" x2="82" y2="28" stroke={color} strokeWidth="1.5" filter={`url(#${filterId})`} opacity={isHovered ? 0.8 : 0.4} />
            <line x1="38" y1="35" x2="74" y2="35" stroke={color} strokeWidth="1" opacity={isHovered ? 0.6 : 0.3} />
            <line x1="38" y1="41" x2="62" y2="41" stroke={color} strokeWidth="1" opacity={isHovered ? 0.6 : 0.3} />
          </>
        );
      case "supabase":
        return (
          <>
            {/* Database cylinders */}
            <ellipse cx="50" cy="14" rx="24" ry="6" stroke={`url(#${gradientId})`} strokeWidth="1" />
            <ellipse cx="50" cy="14" rx="16" ry="4" stroke={color} strokeWidth="0.75" opacity={isHovered ? 0.6 : 0.3} />
            <path d="M26,14 L26,24 A24,6 0 0,0 74,24 L74,14" stroke={`url(#${gradientId})`} strokeWidth="1" />
            
            <path d="M26,24 L26,34 A24,6 0 0,0 74,34 L74,24" stroke={`url(#${gradientId})`} strokeWidth="1" />
            
            <path d="M26,34 L26,44 A24,6 0 0,0 74,44 L74,34" stroke={`url(#${gradientId})`} strokeWidth="1" />
            
            {/* Status led indicators */}
            <circle cx="34" cy="20" r="1.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.5} />
            <circle cx="34" cy="30" r="1.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.5} />
            <circle cx="34" cy="40" r="1.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.5} />

            <circle cx="40" cy="20" r="1.2" fill="#10b981" opacity={isHovered ? 0.9 : 0.4} />
            <circle cx="40" cy="30" r="1.2" fill="#10b981" opacity={isHovered ? 0.9 : 0.4} />
            <circle cx="40" cy="40" r="1.2" fill="#10b981" opacity={isHovered ? 0.9 : 0.4} />
            
            {/* Server racks connection lines */}
            <path d="M12,29 L26,24" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity={isHovered ? 0.6 : 0.2} />
            <path d="M88,29 L74,34" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" opacity={isHovered ? 0.6 : 0.2} />
            <circle cx="12" cy="29" r="2.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.8 : 0.4} />
            <circle cx="88" cy="29" r="2.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.8 : 0.4} />
          </>
        );
      case "ai":
        return (
          <>
            {/* Concentric node rings */}
            <circle cx="50" cy="30" r="6" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.6} />
            <circle cx="50" cy="30" r="15" stroke={color} strokeWidth="0.8" strokeDasharray="3 3" opacity={isHovered ? 0.6 : 0.3} />
            <circle cx="50" cy="30" r="26" stroke={`url(#${gradientId})`} strokeWidth="0.6" strokeDasharray="2 2" opacity={isHovered ? 0.5 : 0.2} />
            
            {/* Network connectors */}
            <line x1="50" y1="30" x2="20" y2="12" stroke={`url(#${gradientId})`} strokeWidth="1" />
            <line x1="50" y1="30" x2="80" y2="12" stroke={`url(#${gradientId})`} strokeWidth="1" />
            <line x1="50" y1="30" x2="25" y2="48" stroke={`url(#${gradientId})`} strokeWidth="1" />
            <line x1="50" y1="30" x2="75" y2="48" stroke={`url(#${gradientId})`} strokeWidth="1" />
            
            <circle cx="20" cy="12" r="3.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.85 : 0.4} />
            <circle cx="80" cy="12" r="3.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.85 : 0.4} />
            <circle cx="25" cy="48" r="4" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.85 : 0.4} />
            <circle cx="75" cy="48" r="3" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.85 : 0.4} />
            
            {/* Floating stars/sparkles */}
            <circle cx="50" cy="5" r="1.5" fill="#fff" opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="50" cy="55" r="1.5" fill="#fff" opacity={isHovered ? 0.9 : 0.5} />
          </>
        );
      case "github":
        return (
          <>
            {/* Main workflow trunk */}
            <line x1="12" y1="30" x2="88" y2="30" stroke={`url(#${gradientId})`} strokeWidth="1.5" />
            <circle cx="18" cy="30" r="4" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="50" cy="30" r="3" fill={color} opacity={isHovered ? 0.8 : 0.4} />
            <circle cx="82" cy="30" r="4" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.9 : 0.5} />
            
            {/* Branching path */}
            <path d="M18,30 C32,10 48,10 62,10 L76,10 C82,10 85,22 82,30" fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.2" />
            <circle cx="40" cy="10" r="2.5" fill="#fff" opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="62" cy="10" r="3" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.85 : 0.4} />
            
            {/* Merge node connection line */}
            <line x1="62" y1="10" x2="82" y2="30" stroke={color} strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity={isHovered ? 0.7 : 0.3} />
          </>
        );
      case "contact":
        return (
          <>
            {/* Outer envelope */}
            <rect x="25" y="16" width="50" height="28" rx="2.5" stroke={`url(#${gradientId})`} strokeWidth="1" fill={`${color}02`} />
            <path d="M25,16 L50,31 L75,16" stroke={`url(#${gradientId})`} strokeWidth="1" />
            
            {/* Signal waves dispatching */}
            <path d="M18,22 A7,7 0 0,0 18,38" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={isHovered ? 0.85 : 0.4} />
            <path d="M12,17 A14,14 0 0,0 12,43" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 1.5" opacity={isHovered ? 0.6 : 0.25} />
            
            <path d="M82,22 A7,7 0 0,1 82,38" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity={isHovered ? 0.85 : 0.4} />
            <path d="M88,17 A14,14 0 0,1 88,43" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" strokeDasharray="2 1.5" opacity={isHovered ? 0.6 : 0.25} />
            
            {/* Red alert bubble */}
            <circle cx="73" cy="18" r="3.5" fill="#ef4444" filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.6} />
          </>
        );
      case "dashboard":
        return (
          <>
            {/* Grid coordinates */}
            <line x1="12" y1="46" x2="88" y2="46" stroke={`url(#${gradientId})`} strokeWidth="1.2" />
            <line x1="12" y1="12" x2="12" y2="46" stroke={`url(#${gradientId})`} strokeWidth="1.2" />
            
            {/* Data Area Chart Area */}
            <path d="M12,38 L25,24 L38,32 L54,15 L70,26 L88,12" stroke={color} strokeWidth="1.8" fill="none" filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.55} />
            <path d="M12,38 L25,24 L38,32 L54,15 L70,26 L88,12 L88,46 L12,46 Z" fill={`url(#${gradientId})`} opacity={isHovered ? 0.15 : 0.05} strokeWidth="0" />
            
            {/* Grid ticks */}
            <circle cx="25" cy="24" r="2" fill="#fff" opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="54" cy="15" r="2" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.9 : 0.5} />
            <circle cx="88" cy="12" r="2.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.9 : 0.5} />
          </>
        );
      case "seo":
        return (
          <>
            {/* Global Web Sphere rings */}
            <ellipse cx="50" cy="30" rx="36" ry="12" stroke={`url(#${gradientId})`} strokeWidth="0.8" opacity={isHovered ? 0.7 : 0.3} />
            <ellipse cx="50" cy="30" rx="14" ry="24" stroke={`url(#${gradientId})`} strokeWidth="0.8" opacity={isHovered ? 0.7 : 0.3} />
            <circle cx="50" cy="30" r="24" stroke={`url(#${gradientId})`} strokeWidth="0.8" opacity={isHovered ? 0.6 : 0.3} />
            
            {/* Core map pins */}
            <line x1="50" y1="12" x2="50" y2="48" stroke={color} strokeWidth="1" opacity={isHovered ? 0.8 : 0.4} />
            <line x1="14" y1="30" x2="86" y2="30" stroke={color} strokeWidth="1" opacity={isHovered ? 0.8 : 0.4} />
            
            <circle cx="50" cy="30" r="3.5" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.6} />
            <circle cx="20" cy="20" r="2.5" fill={color} opacity={isHovered ? 0.8 : 0.4} />
            <circle cx="80" cy="40" r="2.5" fill={color} opacity={isHovered ? 0.8 : 0.4} />
          </>
        );
      case "auth":
        return (
          <>
            {/* Shield node outline */}
            <path d="M22,14 L22,25 C22,36 50,47 50,47 C50,47 78,36 78,25 L78,14 Z" stroke={`url(#${gradientId})`} strokeWidth="1" fill="none" />
            
            {/* Inner Lock system */}
            <rect x="40" y="24" width="20" height="14" rx="2" stroke={color} strokeWidth="1" fill={`${color}05`} />
            <path d="M45,24 L45,18 C45,14 55,14 55,18 L55,24" stroke={color} strokeWidth="1" fill="none" opacity={isHovered ? 0.9 : 0.5} />
            
            {/* Lock mechanism hole */}
            <circle cx="50" cy="30" r="1.8" fill={color} filter={`url(#${filterId})`} opacity={isHovered ? 0.95 : 0.6} />
            <line x1="50" y1="31.8" x2="50" y2="35.5" stroke={color} strokeWidth="1" opacity={isHovered ? 0.95 : 0.6} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg className={className} viewBox="0 0 100 60" fill="none" preserveAspectRatio="xMidYMin meet">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isHovered ? 0.25 : 0.1} />
          <stop offset="100%" stopColor={color} stopOpacity={isHovered ? 0.75 : 0.35} />
        </linearGradient>
      </defs>
      {renderContent()}
    </svg>
  );
}

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
    cyan: { text: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5", glow: "shadow-cyan-500/20", color: "#22d3ee" },
    emerald: { text: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5", glow: "shadow-emerald-500/20", color: "#34d399" },
    amber: { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5", glow: "shadow-amber-500/20", color: "#fbbf24" },
    violet: { text: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-500/5", glow: "shadow-violet-500/20", color: "#a78bfa" },
    rose: { text: "text-rose-400", border: "border-rose-500/20", bg: "bg-rose-500/5", glow: "shadow-rose-500/20", color: "#f43f5e" },
    blue: { text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5", glow: "shadow-blue-500/20", color: "#60a5fa" },
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
          const isDependency = false;
          const isDimmed = hoveredId !== null && !isHovered;

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
                  "cursor-pointer p-4 rounded-xl border relative overflow-hidden transition-all duration-300 flex flex-col justify-between aspect-[4/3] group",
                  isDimmed 
                    ? "opacity-30 blur-[0.2px] scale-[0.98] border-white/5 bg-zinc-950/10" 
                    : cn("backdrop-blur-md", isHovered ? cn("scale-101", theme.glow) : "border-card-border")
                )}
                style={{
                  zIndex: isHovered ? 20 : 10,
                  background: isDimmed 
                    ? undefined 
                    : (isHovered
                        ? `linear-gradient(135deg, rgba(12, 12, 16, 0.95) 0%, rgba(16, 16, 20, 0.98) 60%, ${theme.color}22 100%)`
                        : `linear-gradient(135deg, rgba(8, 8, 10, 0.95) 0%, rgba(10, 10, 12, 0.98) 70%, ${theme.color}0a 100%)`),
                  borderColor: isDimmed
                    ? undefined
                    : (isHovered
                        ? `${theme.color}40`
                        : undefined)
                }}
              >
                {/* Tech Dot Grid Background */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0" />

                {/* Background Schematic Illustration */}
                <SystemNodeGraphic 
                  id={module.id} 
                  isHovered={isHovered}
                  color={theme.color}
                  className={cn(
                    "absolute inset-0 w-full h-full pointer-events-none transition-all duration-300 z-0",
                    isHovered
                      ? "opacity-[0.85] scale-[1.02]"
                      : "opacity-[0.35]"
                  )}
                />

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
