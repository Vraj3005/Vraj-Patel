"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";

export type BlueprintDensity = "low" | "medium" | "high";
export type BlueprintVariant = "hero" | "systems" | "dashboard" | "subtle";

interface SystemBlueprintBackgroundProps {
  density?: BlueprintDensity;
  showLabels?: boolean;
  animated?: boolean;
  variant?: BlueprintVariant;
  className?: string;
}

interface BlueprintNode {
  x: string;
  y: string;
  label: string;
}

interface BlueprintLink {
  from: number;
  to: number;
}

// Deterministic node templates to prevent hydration mismatches
const VARIANT_NODES: Record<BlueprintVariant, BlueprintNode[]> = {
  hero: [
    { x: "15%", y: "25%", label: "AI_CORE_LLM" },
    { x: "50%", y: "15%", label: "API_GATEWAY" },
    { x: "85%", y: "35%", label: "DB_ROUTER_SQL" },
    { x: "30%", y: "75%", label: "AUTH_GATE_RLS" },
    { x: "70%", y: "70%", label: "QUANT_SOLVER" },
  ],
  systems: [
    { x: "10%", y: "20%", label: "LB_REVERSE_PROXY" },
    { x: "40%", y: "15%", label: "SYS_ORCHESTRATOR" },
    { x: "70%", y: "30%", label: "REDIS_CACHE_POOL" },
    { x: "90%", y: "60%", label: "SUPABASE_DB_CLUSTER" },
    { x: "25%", y: "75%", label: "CLI_SHELL_DEVT_V2" },
    { x: "60%", y: "80%", label: "TELEMETRY_INGEST" },
  ],
  dashboard: [
    { x: "8%", y: "45%", label: "CLIENT_HTTPS" },
    { x: "32%", y: "35%", label: "EVENT_BUS" },
    { x: "65%", y: "55%", label: "METRIC_AGGREGATOR" },
    { x: "92%", y: "45%", label: "REALTIME_SOCKET_STREAM" },
  ],
  subtle: [
    { x: "20%", y: "40%", label: "SUBNET_NODE_A" },
    { x: "80%", y: "60%", label: "SUBNET_NODE_B" },
  ],
};

const VARIANT_LINKS: Record<BlueprintVariant, BlueprintLink[]> = {
  hero: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 1 },
    { from: 4, to: 2 },
    { from: 0, to: 3 },
    { from: 3, to: 4 },
  ],
  systems: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 4, to: 1 },
    { from: 5, to: 4 },
    { from: 5, to: 3 },
    { from: 0, to: 4 },
  ],
  dashboard: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ],
  subtle: [
    { from: 0, to: 1 },
  ],
};

export function SystemBlueprintBackground({
  density = "medium",
  showLabels = true,
  animated = true,
  variant = "subtle",
  className,
}: SystemBlueprintBackgroundProps) {
  const shouldReduce = useReducedMotionSafe();
  const isAnimated = animated && !shouldReduce;

  // Determine grid size based on density prop
  const getGridSize = () => {
    switch (density) {
      case "low":
        return 90;
      case "high":
        return 40;
      case "medium":
      default:
        return 65;
    }
  };

  const gridSize = getGridSize();
  const nodes = VARIANT_NODES[variant] || VARIANT_NODES.subtle;
  const links = VARIANT_LINKS[variant] || VARIANT_LINKS.subtle;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none select-none overflow-hidden z-[0] w-full h-full",
        className
      )}
    >
      <style jsx global>{`
        @keyframes blueprint-dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-blueprint-flow {
          animation: blueprint-dash 3s infinite linear;
        }
      `}</style>

      <svg width="100%" height="100%" className="w-full h-full text-foreground/3">
        <defs>
          {/* Main Blueprint Grid Pattern */}
          <pattern
            id={`grid-${variant}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
            {density !== "low" && (
              <circle cx="0" cy="0" r="1" fill="currentColor" fillOpacity="0.4" />
            )}
          </pattern>
        </defs>

        {/* 1. Grid backdrop layer */}
        <rect width="100%" height="100%" fill={`url(#grid-${variant})`} opacity="0.35" />

        {/* 2. Connection lines */}
        <g opacity="0.5" className="text-foreground/5">
          {links.map((link, idx) => {
            const fromNode = nodes[link.from];
            const toNode = nodes[link.to];
            if (!fromNode || !toNode) return null;

            return (
              <g key={`link-${idx}`}>
                {/* Static grid line vectors */}
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Animated data pulses */}
                {isAnimated && (
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="rgba(16, 185, 129, 0.2)"
                    strokeWidth="1.5"
                    strokeDasharray="5 15"
                    className="animate-blueprint-flow"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 3. Node circles and system text */}
        <g opacity="0.6">
          {nodes.map((node, idx) => (
            <g key={`node-${idx}`} className="text-foreground/10">
              {/* Outer halo */}
              <circle
                cx={node.x}
                cy={node.y}
                r="7"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />

              {/* Inner core node dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r="3"
                fill="currentColor"
                className="text-foreground/30"
              />

              {/* Glowing animated node status if animated */}
              {isAnimated && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.4)"
                  strokeWidth="1"
                  className="animate-ping"
                  style={{ animationDuration: "3s" }}
                />
              )}

              {/* Node Monospace HUD Label */}
              {showLabels && (
                <text
                  x={node.x}
                  y={node.y}
                  dy="-12"
                  textAnchor="middle"
                  className="fill-foreground/45 font-mono text-[8px] tracking-widest select-none pointer-events-none"
                >
                  {node.label}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
