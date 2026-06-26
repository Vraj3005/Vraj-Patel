"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECT_LAYERS } from "@/lib/project/project-layers";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { 
  User, Cpu, Database, Sparkles, TrendingUp, 
  FileText, LayoutDashboard, ShieldCheck, List, 
  Coins, Mail, Network, Layers, ChevronDown, ChevronUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dynamic Icon Map Component
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Cpu, Database, Sparkles, TrendingUp, 
  FileText, LayoutDashboard, ShieldCheck, List, 
  Coins, Mail, Network
};

interface ProjectExplodedViewProps {
  projectSlug: string;
}

export default function ProjectExplodedView({ projectSlug }: ProjectExplodedViewProps) {
  const layers = PROJECT_LAYERS[projectSlug];
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [spreadProgress, setSpreadProgress] = useState(0.1); // range [0, 1]
  const [mobileExpandedIdx, setMobileExpandedIdx] = useState<number | null>(0);
  const shouldReduce = useReducedMotionSafe();



  // 1. Scroll spread calculation for desktop
  useEffect(() => {
    if (!layers || layers.length === 0) return;
    const handleScroll = () => {
      if (!containerRef.current || window.innerWidth < 1024) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const elementHeight = rect.height;
      const viewportHeight = window.innerHeight;
      
      // Calculate how far the container is through the scroll journey
      // Element starts entering from bottom: rect.top = viewportHeight
      // Element finishes leaving from top: rect.bottom = 0
      const totalDist = elementHeight + viewportHeight;
      const scrolledDist = viewportHeight - rect.top;
      
      const ratio = scrolledDist / totalDist;
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      
      // We want the spread to map:
      // Starts closed (0.1) -> separates fully in the middle (1.0) -> stays open
      setSpreadProgress(clampedRatio);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [layers]);

  // 2. IntersectionObserver to detect active detail step
  useEffect(() => {
    if (!layers || layers.length === 0) return;
    if (window.innerWidth < 1024) return;

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -45% 0px", // Trigger when center of item crosses center viewport
      threshold: 0.1,
    };

    const observers = layers.map((_, idx) => {
      const el = document.getElementById(`exploded-step-${projectSlug}-${idx}`);
      if (!el) return null;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveIdx(idx);
        }
      }, observerOptions);

      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, [layers, projectSlug]);



  const colorThemes = {
    cyan: { text: "text-cyan-400", border: "border-cyan-500/20", glow: "shadow-cyan-500/20", bg: "bg-cyan-500/5", borderActive: "border-cyan-400" },
    blue: { text: "text-blue-400", border: "border-blue-500/20", glow: "shadow-blue-500/20", bg: "bg-blue-500/5", borderActive: "border-blue-400" },
    amber: { text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/20", bg: "bg-amber-500/5", borderActive: "border-amber-400" },
    violet: { text: "text-violet-400", border: "border-violet-500/20", glow: "shadow-violet-500/20", bg: "bg-violet-500/5", borderActive: "border-violet-400" },
    emerald: { text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/20", bg: "bg-emerald-500/5", borderActive: "border-emerald-400" },
    rose: { text: "text-rose-400", border: "border-rose-500/20", glow: "shadow-rose-500/20", bg: "bg-rose-500/5", borderActive: "border-rose-400" },
  };

  // If no layers are defined for the project, skip rendering
  if (!layers || layers.length === 0) return null;

  return (
    <div 
      ref={containerRef}
      className="flex flex-col gap-6 w-full relative border-t border-card-border pt-10"
    >
      {/* Title & Section intro */}
      <div className="flex flex-col gap-1.5 text-left mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <Layers className="h-4 w-4" /> System Core Blueprint
        </span>
        <h2 className="text-xl md:text-2xl font-medium font-serif text-foreground tracking-tight">
          Scroll-Based Project Exploded View
        </h2>
        <p className="text-xs text-secondary leading-relaxed max-w-2xl font-medium">
          Inspect Vraj&apos;s system architecture layers dynamically. As you scroll, the application separates into logical components, outlining the stack, data flows, and technical details.
        </p>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* LEFT COLUMN: Sticky Isometric Graphic (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-5 relative">
          <div 
            ref={leftPanelRef}
            className="sticky top-28 h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-foreground/[0.01] p-6 shadow-2xl relative"
          >
            {/* Ambient Background Schematics */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Status indicators */}
            <div className="absolute top-4 left-4 font-mono text-[8px] text-muted flex flex-col gap-0.5">
              <span>EXPLODED_RENDER: PROJECTION_3D</span>
              <span className="flex items-center gap-1">
                STATUS: <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
              </span>
            </div>
            
            <div className="absolute top-4 right-4 font-mono text-[8px] text-muted text-right">
              <span>SPREAD_FACTOR: {(spreadProgress * 100).toFixed(0)}%</span>
            </div>

            {/* Core isometric stack viewport container */}
            <div 
              className="relative w-full max-w-[280px] aspect-[4/5] flex items-center justify-center"
              style={{
                perspective: shouldReduce ? "none" : "1200px",
              }}
            >
              {/* Isometric Rotation Wrapper */}
              <div 
                className="relative w-full h-full flex items-center justify-center transition-transform duration-500"
                style={{
                  transform: shouldReduce 
                    ? "none" 
                    : "rotateX(55deg) rotateZ(-40deg) skewX(5deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Connecting wireframe columns at the corners of cards */}
                {!shouldReduce && (
                  <>
                    <div className="absolute w-[0.5px] h-[75%] bg-white/5 left-[10%] top-[10%] z-0" style={{ transform: "translateZ(-100px)" }} />
                    <div className="absolute w-[0.5px] h-[75%] bg-white/5 right-[10%] top-[10%] z-0" style={{ transform: "translateZ(-100px)" }} />
                    <div className="absolute w-[0.5px] h-[75%] bg-white/5 left-[10%] bottom-[10%] z-0" style={{ transform: "translateZ(-100px)" }} />
                    <div className="absolute w-[0.5px] h-[75%] bg-white/5 right-[10%] bottom-[10%] z-0" style={{ transform: "translateZ(-100px)" }} />
                  </>
                )}

                {/* Layer Cards */}
                {layers.map((layer, idx) => {
                  const isActive = idx === activeIdx;
                  
                  // Compute dynamic Z separation offset
                  // Base spacing + incremental spread progress from scroll
                  const baseSpacing = 38;
                  const spreadInc = spreadProgress * 75;
                  
                  // Center the stack around Z = 0
                  const middleIdx = (layers.length - 1) / 2;
                  const zValue = (idx - middleIdx) * (baseSpacing + spreadInc);
                  
                  // Active card gets extra lift in 3D space
                  const activeLift = isActive ? 28 : 0;
                  
                  const theme = colorThemes[layer.accent];
                  const Icon = IconMap[layer.iconName] || Cpu;

                  return (
                    <div
                      key={layer.id}
                      className={cn(
                        "absolute w-[240px] h-[100px] rounded-xl border p-3 flex flex-col justify-between select-none transition-all duration-300 font-mono",
                        isActive 
                          ? cn("bg-zinc-900/95 shadow-2xl scale-[1.03] border-white/30", theme.borderActive, theme.glow)
                          : cn("bg-zinc-950/75 backdrop-blur-md opacity-65 hover:opacity-90 hover:scale-[1.01] hover:border-white/15", theme.border)
                      )}
                      style={{
                        transform: shouldReduce 
                          ? `translateY(${(idx - middleIdx) * 115}px)` 
                          : `translateZ(${zValue + activeLift}px)`,
                        zIndex: layers.length - idx,
                      }}
                    >
                      {/* Grid background inside card */}
                      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none rounded-xl" />

                      {/* Header details */}
                      <div className="flex justify-between items-start z-10">
                        <span className="text-[7.5px] text-muted tracking-widest font-bold">
                          LAYER_0{idx + 1} :: {layer.id.toUpperCase()}
                        </span>
                        <div className={cn("p-1 rounded bg-white/5", isActive ? theme.text : "text-muted")}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      {/* Title & Accent border */}
                      <div className="z-10 text-left mt-2">
                        <div className={cn("text-[10px] font-bold tracking-tight truncate", isActive ? "text-foreground font-semibold" : "text-secondary")}>
                          {layer.title}
                        </div>
                      </div>

                      {/* Footer tags */}
                      <div className="flex justify-between items-end text-[6.5px] text-muted z-10">
                        <span className="truncate max-w-[120px]">{layer.techTags.slice(0, 2).join(" | ")}</span>
                        <span>[ACTIVE_0{activeIdx + 1}]</span>
                      </div>

                      {/* Custom active glow mesh */}
                      {isActive && !shouldReduce && (
                        <div className={cn("absolute inset-0 rounded-xl pointer-events-none border opacity-40 animate-pulse", theme.borderActive)} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Narrative detail sections (Desktop) / Vertical Timeline with Accordions (Mobile Fallback) */}
        <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
          
          {/* MOBILE TIMELINE FALLBACK (< 1024px) */}
          <div className="lg:hidden flex flex-col gap-3">
            {layers.map((layer, idx) => {
              const isExpanded = mobileExpandedIdx === idx;
              const theme = colorThemes[layer.accent];
              const Icon = IconMap[layer.iconName] || Cpu;

              return (
                <Card 
                  key={layer.id}
                  className={cn(
                    "border transition-all duration-300 relative text-left",
                    isExpanded ? cn("bg-zinc-950/60", theme.borderActive) : "bg-zinc-950/20 border-white/5"
                  )}
                >
                  {/* Card click trigger header */}
                  <button
                    type="button"
                    onClick={() => setMobileExpandedIdx(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between font-mono text-xs text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-1.5 rounded-lg border", isExpanded ? cn(theme.bg, theme.borderActive, theme.text) : "border-white/5 text-muted")}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] text-muted tracking-wider uppercase font-bold">Layer 0{idx + 1}</span>
                        <span className={cn("font-bold font-serif text-sm tracking-tight text-foreground", isExpanded && theme.text)}>
                          {layer.title}
                        </span>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted" /> : <ChevronDown className="h-4 w-4 text-muted" />}
                    </div>
                  </button>

                  {/* Expanded Body Drawer */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-3 border-t border-white/5 mt-1">
                          <p className="text-xs text-secondary leading-relaxed font-medium">
                            {layer.detailedDesc}
                          </p>
                          
                          {/* Tech list */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {layer.techTags.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-[9px] font-mono border-white/5 py-0.5">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>

          {/* DESKTOP STORY PANELS (>= 1024px) */}
          <div className="hidden lg:flex flex-col gap-10">
            {layers.map((layer, idx) => {
              const isActive = idx === activeIdx;
              const theme = colorThemes[layer.accent];
              const Icon = IconMap[layer.iconName] || Cpu;

              return (
                <div
                  key={layer.id}
                  id={`exploded-step-${projectSlug}-${idx}`}
                  className={cn(
                    "min-h-[45vh] flex flex-col justify-center items-start border-l border-white/5 pl-6 relative transition-opacity duration-300 text-left py-10",
                    isActive ? "opacity-100" : "opacity-30"
                  )}
                >
                  {/* Vertical line indicator track */}
                  {isActive && (
                    <motion.div 
                      layoutId="active-exploded-line"
                      className={cn("absolute left-[-1px] top-0 bottom-0 w-[2px]", 
                        layer.accent === "cyan" && "bg-cyan-500",
                        layer.accent === "blue" && "bg-blue-500",
                        layer.accent === "amber" && "bg-amber-500",
                        layer.accent === "violet" && "bg-violet-500",
                        layer.accent === "emerald" && "bg-emerald-500",
                        layer.accent === "rose" && "bg-rose-500"
                      )}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Header Badge tag */}
                  <span className="font-mono text-[9px] text-muted tracking-widest uppercase font-bold flex items-center gap-1.5 mb-2">
                    <Icon className={cn("h-3.5 w-3.5", isActive ? theme.text : "text-muted")} />
                    LAYER 0{idx + 1} :: {layer.id.toUpperCase()}
                  </span>

                  {/* Layer Title */}
                  <h3 className={cn("text-xl md:text-2xl font-bold font-serif tracking-tight mb-3 transition-colors duration-300", isActive ? "text-foreground" : "text-secondary")}>
                    {layer.title}
                  </h3>

                  {/* Small Short Description summary */}
                  <div className="font-mono text-[10px] text-muted tracking-tight mb-4 flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {layer.shortDesc}
                  </div>

                  {/* Comprehensive Detailed Description explanation */}
                  <p className="text-xs md:text-sm text-secondary leading-relaxed mb-5 font-medium max-w-xl">
                    {layer.detailedDesc}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {layer.techTags.map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="outline" 
                        className={cn(
                          "text-[9px] font-mono py-0.5 border-white/5 uppercase transition-all duration-300",
                          isActive ? "bg-white/[0.02] border-white/10" : "opacity-80"
                        )}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
