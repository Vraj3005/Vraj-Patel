"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

interface ContextNode {
  id: string;
  name: string;
  count: string;
  detail: string;
  color: string;
  bgGlow: string;
  // Trigonometric placement coordinates for radius=58 on a 140x140 canvas (centered at 70,70)
  x: number;
  y: number;
}

const CONTEXT_NODES: ContextNode[] = [
  {
    id: "projects",
    name: "Projects Context",
    count: "10 Systems Mapped",
    detail: "Canonical databases from enermass, outreachops, constructionos, mspe, and nflrd loaded.",
    color: "#06b6d4", // Cyan
    bgGlow: "rgba(6, 182, 212, 0.4)",
    x: 29,
    y: 29
  },
  {
    id: "skills",
    name: "Skills Matrix",
    count: "22 Tech Nodes Mapped",
    detail: "Concentric orbit proof matrices (frontend, database, artificial intelligence, tools) verified.",
    color: "#10b981", // Emerald
    bgGlow: "rgba(16, 185, 129, 0.4)",
    x: 111,
    y: 29
  },
  {
    id: "resume",
    name: "Credentials Core",
    count: "Nirma CSE Registry",
    detail: "Educational indicators, core GPA, notice timelines, and recruiter triggers synchronized.",
    color: "#f59e0b", // Amber
    bgGlow: "rgba(245, 158, 11, 0.4)",
    x: 111,
    y: 111
  },
  {
    id: "systems",
    name: "Systems Pipeline",
    count: "8 Core Operations",
    detail: "Data flow layers, validation sequences, server pipelines, and security stacks indexed.",
    color: "#8b5cf6", // Violet
    bgGlow: "rgba(139, 92, 246, 0.4)",
    x: 29,
    y: 111
  }
];

interface AIStatusRingProps {
  children: React.ReactNode;
  className?: string;
}

export default function AIStatusRing({ children, className }: AIStatusRingProps) {
  const [hoveredNode, setHoveredNode] = useState<ContextNode | null>(null);
  const shouldReduce = useReducedMotionSafe();

  return (
    <div className={cn("relative flex items-center justify-center select-none", className)}>
      
      {/* Outer SVG Orbit Ring */}
      <svg
        viewBox="0 0 140 140"
        className="w-[180px] h-[180px] sm:w-[200px] h-[200px] absolute z-0"
      >
        <defs>
          <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#050508" stopOpacity={0} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
          </radialGradient>
        </defs>

        {/* Outer dotted connection ring */}
        <circle
          cx="70"
          cy="70"
          r="58"
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Node to center connectors (Glows slightly when node hovered) */}
        {CONTEXT_NODES.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1="70"
              y1="70"
              x2={node.x}
              y2={node.y}
              stroke={node.color}
              strokeWidth={isHovered ? "0.8" : "0.3"}
              strokeDasharray={isHovered ? "none" : "2 4"}
              className="opacity-30 transition-all duration-300"
            />
          );
        })}

        {/* Outer Orbit Context Node Dots */}
        {CONTEXT_NODES.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Invisible interactive hover pad */}
              <circle
                cx={node.x}
                cy={node.y}
                r="10"
                fill="transparent"
              />
              
              {/* Pulsing ring wrapper */}
              {!shouldReduce && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? "6" : "3.5"}
                  fill="none"
                  stroke={node.color}
                  strokeWidth="0.5"
                  className="opacity-60 transition-all duration-300"
                />
              )}

              {/* Glowing center dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? "3.5" : "2"}
                fill={node.color}
                style={{
                  filter: shouldReduce ? "none" : `drop-shadow(0 0 4px ${node.bgGlow})`
                }}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>

      {/* Central Avatar Component inside the ring */}
      <div className="relative z-10 p-8">
        {children}
      </div>

      {/* Floating telemetry info block */}
      <div className="absolute top-[88%] left-1/2 -translate-x-1/2 w-full max-w-[280px] text-center z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {hoveredNode ? (
            <motion.div
              key={hoveredNode.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="p-3.5 rounded-xl border border-white/5 bg-zinc-950/90 backdrop-blur-md shadow-2xl font-mono text-[9px] text-left flex flex-col gap-1 w-full"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-1">
                <span className="font-bold text-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
                  {hoveredNode.name}
                </span>
                <span className="text-[7.5px] uppercase tracking-wider text-muted font-bold">
                  {hoveredNode.count}
                </span>
              </div>
              <p className="text-secondary text-[8.5px] leading-relaxed font-medium">
                {hoveredNode.detail}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default-hud"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="font-mono text-[7px] text-muted tracking-widest uppercase font-bold"
            >
              Hover context nodes for telemetry
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
