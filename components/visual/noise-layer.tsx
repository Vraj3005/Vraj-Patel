import React from "react";
import { cn } from "@/lib/utils";

interface NoiseLayerProps {
  className?: string;
  opacity?: number;
}

/**
 * A hardware-accelerated static CSS noise overlay that creates an engineering texture feel.
 */
export function NoiseLayer({ className, opacity = 0.02 }: NoiseLayerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-[1] select-none mix-blend-overlay",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
      }}
    />
  );
}
