"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

interface OSWindowProps {
  title: string;
  subtitle?: string;
  status: "ACTIVE" | "ONLINE" | "STANDBY" | "RUNNING";
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  accent: "cyan" | "emerald" | "violet" | "blue" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

const ACCENT_MAP = {
  cyan: {
    border: "rgba(6, 182, 212, 0.08)",
    borderHover: "rgba(6, 182, 212, 0.3)",
    text: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.08)",
    dot: "bg-cyan-400",
    badge: "border-cyan-500/20 text-cyan-400 bg-cyan-500/5",
  },
  emerald: {
    border: "rgba(16, 185, 129, 0.08)",
    borderHover: "rgba(16, 185, 129, 0.3)",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.08)",
    dot: "bg-emerald-400",
    badge: "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
  },
  violet: {
    border: "rgba(139, 92, 246, 0.08)",
    borderHover: "rgba(139, 92, 246, 0.3)",
    text: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.08)",
    dot: "bg-violet-400",
    badge: "border-violet-500/20 text-violet-400 bg-violet-500/5",
  },
  blue: {
    border: "rgba(59, 130, 246, 0.08)",
    borderHover: "rgba(59, 130, 246, 0.3)",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.08)",
    dot: "bg-blue-400",
    badge: "border-blue-500/20 text-blue-400 bg-blue-500/5",
  },
  amber: {
    border: "rgba(245, 158, 11, 0.08)",
    borderHover: "rgba(245, 158, 11, 0.3)",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.08)",
    dot: "bg-amber-400",
    badge: "border-amber-500/20 text-amber-400 bg-amber-500/5",
  },
  rose: {
    border: "rgba(244, 63, 94, 0.08)",
    borderHover: "rgba(244, 63, 94, 0.3)",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.08)",
    dot: "bg-rose-400",
    badge: "border-rose-500/20 text-rose-400 bg-rose-500/5",
  },
};

const SIZE_MAP = {
  sm: "min-h-[180px]",
  md: "min-h-[220px]",
  lg: "min-h-[260px]",
};

export default function OSWindow({
  title,
  subtitle,
  status,
  icon: Icon,
  href,
  accent,
  size = "md",
  children,
  className,
}: OSWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotionSafe();
  
  // Mouse position tracking for cursor border glow
  const { x, y } = useMousePosition(containerRef);

  // Parallax Scroll calculations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Parallax translation offset: move card up slightly as scroll advances
  const parallaxOffset = useTransform(
    scrollYProgress, 
    [0, 1], 
    shouldReduce ? [0, 0] : [20, -20]
  );

  const colors = ACCENT_MAP[accent];

  return (
    <Link 
      href={href} 
      className="block select-none outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-2xl h-full"
    >
      <motion.div
        ref={containerRef}
        style={{ y: parallaxOffset }}
        whileHover={{ y: shouldReduce ? 0 : -4, scale: 1.005 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className={cn(
          "relative flex flex-col w-full h-full border border-white/5 bg-zinc-950/45 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer group shadow-lg shadow-black/35",
          SIZE_MAP[size],
          className
        )}
      >
        {/* Cursor spotlight border glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-[1px] rounded-2xl z-0"
          style={{
            background: `radial-gradient(150px circle at ${x}px ${y}px, ${colors.borderHover}, transparent 80%)`,
            padding: "1.5px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
            mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          }}
        />

        {/* Inner glow radial backdrop */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(200px circle at ${x}px ${y}px, ${colors.glow}, transparent 85%)`,
          }}
        />

        {/* Title bar header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/25 shrink-0 z-10 select-none">
          {/* Traffic light controllers */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70 border border-rose-500/10 transition-colors group-hover:bg-rose-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70 border border-amber-500/10 transition-colors group-hover:bg-amber-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70 border border-emerald-500/10 transition-colors group-hover:bg-emerald-500" />
          </div>

          {/* Centered System Monospace title */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-secondary font-bold tracking-widest uppercase">
            <Icon className={cn("h-3.5 w-3.5", colors.text)} />
            <span className="text-foreground/80 font-bold group-hover:text-white transition-colors">{title}</span>
          </div>

          {/* Status Badge */}
          <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wide uppercase", colors.badge)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", colors.dot, 
              (status === "RUNNING" || status === "ACTIVE") ? "animate-pulse" : ""
            )} />
            {status}
          </div>
        </div>

        {/* Main Content Body */}
        <div className="relative flex-1 p-6 z-10 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            {subtitle && (
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">
                {subtitle}
              </span>
            )}
            <div className="flex-1 w-full text-left">
              {children}
            </div>
          </div>

          {/* Micro Footer panel action details */}
          <div className="flex items-center justify-between text-[9px] font-mono text-muted pt-3 border-t border-white/5 select-none shrink-0">
            <span>SYS_LINK: /{accent}</span>
            <span className="group-hover:text-foreground transition-colors uppercase font-bold flex items-center gap-1">
              Initialize Module <span className="translate-x-0 group-hover:translate-x-0.5 transition-transform">→</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
