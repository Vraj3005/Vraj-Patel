import React from "react";
import { cn } from "@/lib/utils";

interface GridLayerProps {
  className?: string;
  gridSize?: number;
  opacity?: number;
}

/**
 * A responsive background grid pattern with a radial center focus mask.
 */
export function GridLayer({ className, gridSize = 40, opacity = 0.05 }: GridLayerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-[0] bg-[linear-gradient(to_right,rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,1)_1px,transparent_1px)]",
        className
      )}
      style={{
        backgroundSize: `${gridSize}px ${gridSize}px`,
        opacity,
        maskImage: `radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)`,
        WebkitMaskImage: `radial-gradient(ellipse 60% 50% at 50% 50%, #000 60%, transparent 100%)`,
      }}
    />
  );
}
