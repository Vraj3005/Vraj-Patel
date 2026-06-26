"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";

interface FloatingGlowProps {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
  duration?: number;
}

/**
 * A floating blur glow element that animates gently over time.
 * Automatically halts background animation if prefers-reduced-motion is active.
 */
export function FloatingGlow({
  className,
  color = "bg-emerald-500/10",
  size = 300,
  delay = 0,
  duration = 10,
}: FloatingGlowProps) {
  const shouldReduce = useReducedMotionSafe();

  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none filter blur-[80px]", color, className)}
      style={{
        width: size,
        height: size,
      }}
      animate={
        shouldReduce
          ? {}
          : {
              x: [0, 50, -30, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.15, 0.9, 1],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
