"use client";

import React, { useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  radius?: number;
}

/**
 * A spotlight container that tracks cursor hover to project a subtle radial light.
 */
export function Spotlight({
  children,
  className,
  spotlightColor = "rgba(255, 255, 255, 0.05)",
  radius = 350,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(containerRef);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden group", className)}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(${radius}px circle at ${x}px ${y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
