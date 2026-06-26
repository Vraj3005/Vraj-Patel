"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TECH_PROJECT_MAP, getRingLabel } from "@/lib/skills/tech-project-map";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { Layers, List, CircleDot, ChevronRight, ExternalLink, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function TechStackRings() {
  const [viewMode, setViewMode] = useState<"orbital" | "list">("orbital");
  const [hoveredTechId, setHoveredTechId] = useState<string | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string | null>("nextjs");
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduce = useReducedMotionSafe();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode("list");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedTech = TECH_PROJECT_MAP.find((t) => t.id === selectedTechId);

  // Group nodes by ring
  const rings = [1, 2, 3, 4, 5];

  // Helper to compute node positions on the rings
  const getCoordinates = (ring: number, index: number, total: number) => {
    // Radius values corresponding to ring number (scaled to 100 viewBox)
    const radiuses = [12, 21, 30, 39, 47];
    const radius = radiuses[ring - 1];
    
    // Stagger initial rotation offset per ring to prevent direct radial spoke alignment
    const offset = ring * 0.45;
    const angle = (index / total) * 2 * Math.PI + offset;
    
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    return { x, y };
  };



  return (
    <div className="w-full relative flex flex-col gap-6 p-6 border border-white/5 rounded-3xl bg-black/25 backdrop-blur-md overflow-hidden select-none">
      {styleTag}

      {/* Blueprint grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-0" />

      {/* Controller Header HUD */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs text-secondary font-semibold uppercase tracking-widest">
            Orbital Tech Stack Matrix
          </span>
        </div>
        
        {/* Toggle Mode button (hidden on mobile since list is enforced) */}
        {!isMobile && (
          <div className="flex items-center gap-1.5 p-0.5 border border-white/5 bg-black/40 rounded-xl">
            <button
              onClick={() => setViewMode("orbital")}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                viewMode === "orbital" ? "bg-white/5 text-cyan-400 border border-white/5" : "text-secondary hover:text-foreground"
              }`}
            >
              <CircleDot className="h-3 w-3" /> Orbital View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-[10px] font-mono font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                viewMode === "list" ? "bg-white/5 text-cyan-400 border border-white/5" : "text-secondary hover:text-foreground"
              }`}
            >
              <List className="h-3 w-3" /> List View
            </button>
          </div>
        )}
      </div>

      {/* Main visualization display grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative min-h-[380px] lg:min-h-[460px] z-10 w-full">
        
        {/* VIEW 1: Orbital Circle Diagram (Desktop only) */}
        {viewMode === "orbital" && !isMobile && (
          <div className="lg:col-span-7 bg-black/10 rounded-2xl border border-white/5 relative flex items-center justify-center min-h-[350px] lg:min-h-[420px] overflow-hidden">
            
            {/* SVG Orbital canvas container */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full max-w-[400px] max-h-[400px] p-4 text-foreground/5 z-10 relative overflow-visible"
            >
              <defs>
                <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* A. Outer orbit guidelines (rotating subtly if not reduced motion) */}
              <g className={shouldReduce ? "" : "animate-spin-slow-ccw"}>
                {rings.map((ring) => {
                  const radiuses = [12, 21, 30, 39, 47];
                  const radius = radiuses[ring - 1];
                  const isActiveRing = selectedTech?.ring === ring || hoveredTechId && TECH_PROJECT_MAP.find(t => t.id === hoveredTechId)?.ring === ring;

                  return (
                    <circle
                      key={`ring-line-${ring}`}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={isActiveRing ? "rgba(34, 211, 238, 0.12)" : "rgba(255, 255, 255, 0.02)"}
                      strokeWidth={isActiveRing ? 1 : 0.5}
                      strokeDasharray="4 6"
                      className="transition-colors duration-300"
                    />
                  );
                })}
              </g>

              {/* B. Central Node: Vraj Patel */}
              <g transform="translate(50, 50)" className="cursor-default">
                <circle cx="0" cy="0" r="4.5" fill="#082f49" stroke="#22d3ee" strokeWidth="1.5" filter="url(#nodeGlow)" />
                <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                <text x="0" y="-7" textAnchor="middle" className="font-mono text-[5px] fill-foreground/60 tracking-wider">
                  VRAJ
                </text>
              </g>

              {/* C. Render Orbit Nodes & Connection paths */}
              {rings.map((ring) => {
                const ringItems = TECH_PROJECT_MAP.filter((t) => t.ring === ring);
                return ringItems.map((tech, index) => {
                  const { x, y } = getCoordinates(ring, index, ringItems.length);
                  const isHovered = hoveredTechId === tech.id;
                  const isSelected = selectedTechId === tech.id;
                  
                  const fillHex = tech.category === "Frontend" ? "#22d3ee"
                                : tech.category === "Backend/DB" ? "#10b981"
                                : tech.category === "AI/Automation" ? "#3b82f6"
                                : tech.category === "Quant/Data" ? "#8b5cf6"
                                : "#f59e0b";

                  const size = isSelected ? 2.5 : isHovered ? 2.2 : 1.6;

                  return (
                    <g key={tech.id} className="cursor-pointer">
                      {/* Active Connection Line back to center */}
                      {(isHovered || isSelected) && (
                        <line
                          x1="50"
                          y1="50"
                          x2={x}
                          y2={y}
                          stroke={fillHex}
                          strokeWidth={isSelected ? 0.8 : 0.4}
                          strokeDasharray="2 2"
                          opacity={isSelected ? 0.75 : 0.45}
                        />
                      )}

                      {/* Interactive click catcher (invisible larger circle) */}
                      <circle
                        cx={x}
                        cy={y}
                        r="3.5"
                        fill="transparent"
                        onClick={() => setSelectedTechId(tech.id)}
                        onMouseEnter={() => setHoveredTechId(tech.id)}
                        onMouseLeave={() => setHoveredTechId(null)}
                      />

                      {/* Glowing halo */}
                      {(isHovered || isSelected) && (
                        <circle
                          cx={x}
                          cy={y}
                          r={size * 2}
                          fill={fillHex}
                          opacity={isSelected ? 0.3 : 0.25}
                          filter="url(#nodeGlow)"
                          className="pointer-events-none animate-pulse"
                        />
                      )}

                      {/* Center Node Dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={size}
                        fill={isSelected ? "#ffffff" : fillHex}
                        stroke={isSelected ? fillHex : "#ffffff"}
                        strokeWidth="0.4"
                        className="transition-all duration-300 pointer-events-none"
                      />

                      {/* Text node label (only showing on select/hover or Ring guidelines) */}
                      {(isHovered || isSelected || ring > 2) && (
                        <text
                          x={x}
                          y={y + size + 3}
                          textAnchor="middle"
                          className={`font-mono text-[3.8px] pointer-events-none select-none tracking-wide transition-all duration-300 ${
                            isSelected ? "fill-white font-bold" : "fill-foreground/50"
                          }`}
                        >
                          {tech.name}
                        </text>
                      )}
                    </g>
                  );
                });
              })}
            </svg>
          </div>
        )}

        {/* VIEW 2: Compact Category List (Default on Mobile, optional on Desktop) */}
        {(viewMode === "list" || isMobile) && (
          <div className="lg:col-span-7 flex flex-col gap-4 justify-start pr-1 max-h-[350px] lg:max-h-[420px] overflow-y-auto custom-scrollbar">
            {rings.map((ring) => {
              const ringItems = TECH_PROJECT_MAP.filter((t) => t.ring === ring);
              return (
                <div key={ring} className="flex flex-col gap-2 p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                  <span className="font-mono text-[9px] text-cyan-500/50 uppercase tracking-widest font-semibold">
                    {getRingLabel(ring)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ringItems.map((tech) => {
                      const isSelected = selectedTechId === tech.id;
                      const activeColor = tech.category === "Frontend" ? "border-cyan-500/30 text-cyan-400 bg-cyan-950/20"
                                        : tech.category === "Backend/DB" ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/20"
                                        : tech.category === "AI/Automation" ? "border-blue-500/30 text-blue-400 bg-blue-950/20"
                                        : tech.category === "Quant/Data" ? "border-violet-500/30 text-violet-400 bg-violet-950/20"
                                        : "border-amber-500/30 text-amber-400 bg-amber-950/20";
                      return (
                        <button
                          key={tech.id}
                          onClick={() => setSelectedTechId(tech.id)}
                          className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer select-none ${
                            isSelected
                              ? activeColor
                              : "border-white/5 bg-transparent text-secondary hover:text-foreground hover:border-white/15"
                          }`}
                        >
                          {tech.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Right Side: Proof & Projects Panel (Spans 5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            {selectedTech ? (
              <motion.div
                key={selectedTech.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col justify-between p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40 z-10"
              >
                {/* Header info */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono border-white/5 uppercase bg-white/5">
                      {getRingLabel(selectedTech.ring)}
                    </Badge>
                    <span className="text-[9px] font-mono text-cyan-400/50 uppercase tracking-widest">
                      Proof Card
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight">
                    {selectedTech.name}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed border-t border-white/5 pt-3">
                    {selectedTech.proof}
                  </p>
                </div>

                {/* Mapped Canonical Projects */}
                <div className="flex flex-col gap-2.5 mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono">
                    Related Case Implementations
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-1">
                    {selectedTech.projects.map((proj, pIdx) => {
                      // Stub projects like ask-vraj can link differently
                      const isStub = proj.isExternal;
                      
                      return (
                        <div 
                          key={pIdx} 
                          className="flex items-center justify-between p-2.5 bg-black/30 border border-white/5 hover:border-cyan-500/20 rounded-xl group transition-all duration-300"
                        >
                          <span className="text-xs font-semibold text-foreground group-hover:text-white transition-colors">
                            {proj.title}
                          </span>
                          
                          {!isStub ? (
                            <Link 
                              href={`/projects/${proj.slug}`} 
                              className="text-[10px] text-cyan-400/70 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors"
                            >
                              Details <ChevronRight className="h-3 w-3" />
                            </Link>
                          ) : (
                            <Link 
                              href={proj.slug} 
                              className="text-[10px] text-cyan-400/70 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors"
                            >
                              Launch <ExternalLink className="h-3 w-3" />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full min-h-[220px] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/[0.01]">
                <Layers className="h-8 w-8 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Select a Technology
                </h4>
                <p className="text-[10px] text-secondary max-w-[200px] leading-relaxed">
                  Click a technology node or chip to trace detailed proof maps and direct project credentials.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Inline component CSS overrides
const styleTag = (
  <style jsx global>{`
    @keyframes spin-slow-ccw {
      from {
        transform: translate(50px, 50px) rotate(0deg) translate(-50px, -50px);
      }
      to {
        transform: translate(50px, 50px) rotate(-360deg) translate(-50px, -50px);
      }
    }
    .animate-spin-slow-ccw {
      animation: spin-slow-ccw 180s linear infinite;
      transform-origin: 50px 50px;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `}</style>
);
