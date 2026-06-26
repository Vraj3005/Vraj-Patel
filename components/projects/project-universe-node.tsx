"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";

export interface ProjectUniverseNodeProps {
  slug: string;
  title: string;
  category: string;
  x: number; // percentage coordinate (0-100)
  y: number; // percentage coordinate (0-100)
  isHovered: boolean;
  isDimmed: boolean;
  isHighlighted: boolean;
  isSelected: boolean;
  isMobile: boolean;
  onClick: (slug: string) => void;
  onMouseEnter: (slug: string) => void;
  onMouseLeave: () => void;
}

const CATEGORY_COLORS: Record<string, { stroke: string; fill: string; glow: string }> = {
  ai_automation: {
    stroke: "rgba(34, 211, 238, 0.6)",
    fill: "#22d3ee",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  erp_system: {
    stroke: "rgba(16, 185, 129, 0.6)",
    fill: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  quant_research: {
    stroke: "rgba(139, 92, 246, 0.6)",
    fill: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.4)",
  },
  ecommerce: {
    stroke: "rgba(59, 130, 246, 0.6)",
    fill: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  website: {
    stroke: "rgba(14, 165, 233, 0.6)",
    fill: "#0ea5e9",
    glow: "rgba(14, 165, 233, 0.4)",
  },
  dashboard: {
    stroke: "rgba(245, 158, 11, 0.6)",
    fill: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.4)",
  },
};

export default function ProjectUniverseNode({
  slug,
  title,
  category,
  x,
  y,
  isHovered,
  isDimmed,
  isHighlighted,
  isSelected,
  isMobile,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: ProjectUniverseNodeProps) {
  const shouldReduce = useReducedMotionSafe();

  // Get color map, fallback if undefined
  const colors = CATEGORY_COLORS[category] || {
    stroke: "rgba(156, 163, 175, 0.6)",
    fill: "#9ca3af",
    glow: "rgba(156, 163, 175, 0.3)",
  };

  const radius = isSelected ? 3.0 : isHovered ? 2.5 : isHighlighted ? 2.0 : 1.4;

  return (
    <g
      className={cn(
        "cursor-pointer select-none",
        shouldReduce ? "transition-none" : "transition-all duration-300",
        isDimmed ? "opacity-25" : "opacity-100"
      )}
      onClick={() => onClick(slug)}
      onMouseEnter={() => onMouseEnter(slug)}
      onMouseLeave={onMouseLeave}
    >
      <defs>
        <filter id={`glow-${slug}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. External Active Glow Aura (grows on hover/select) */}
      {(isHovered || isSelected || isHighlighted) && (
        <circle
          cx={`${x}%`}
          cy={`${y}%`}
          r={radius * 2.8}
          fill={colors.glow}
          className={cn(!shouldReduce && "animate-pulse")}
          style={{ animationDuration: "3s" }}
          opacity={isSelected ? 0.45 : isHovered ? 0.35 : 0.2}
          filter={shouldReduce ? undefined : `url(#glow-${slug})`}
        />
      )}

      {/* 2. Concentric Orbit Outer Ring */}
      <circle
        cx={`${x}%`}
        cy={`${y}%`}
        r={radius * 1.8}
        fill="none"
        stroke={colors.stroke}
        strokeWidth={isSelected ? 0.5 : 0.3}
        className={cn(
          shouldReduce ? "transition-none" : "transition-all duration-300",
          isHovered || isSelected ? "stroke-white/30 scale-105" : "opacity-40"
        )}
      />

      {/* 3. Glowing Core Node Dot */}
      <circle
        cx={`${x}%`}
        cy={`${y}%`}
        r={radius}
        fill={colors.fill}
        stroke="#ffffff"
        strokeWidth={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
        className={shouldReduce ? "transition-none" : "transition-all duration-300"}
      />

      {/* 4. Secondary small core highlight for selected node */}
      {isSelected && (
        <circle
          cx={`${x}%`}
          cy={`${y}%`}
          r="0.8"
          fill="#ffffff"
          className="pointer-events-none"
        />
      )}

      {/* 5. HUD Text Label */}
      {(!isMobile || isHovered || isSelected || isHighlighted) && (
        <text
          x={`${x}%`}
          y={`${y}%`}
          dy={radius + 4.0}
          textAnchor="middle"
          className={cn(
            "font-mono text-[3px] tracking-wide pointer-events-none select-none fill-foreground/60",
            shouldReduce ? "transition-none" : "transition-all duration-300",
            (isHovered || isSelected) && "fill-foreground font-semibold scale-105",
            (isHovered || isSelected) && !shouldReduce && "filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]",
            isHighlighted && "fill-foreground/80"
          )}
        >
          {title.split(" (")[0]} {/* Strip secondary labels like (AI Coldmail) for space */}
        </text>
      )}
    </g>
  );
}
