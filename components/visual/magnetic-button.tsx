"use client";

import React, { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  range?: number;
}

/**
 * A Framer Motion magnetic button component that translates towards the cursor on hover.
 * Safely falls back to standard behavior when reduced motion is preferred.
 */
export function MagneticButton({
  children,
  className,
  range = 30,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduce = useReducedMotionSafe();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduce || !ref.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Relative coordinates from center of the button
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    // Apply a scaling factor to limit range translation
    setPosition({ x: x * (range / 100), y: y * (range / 100) });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={shouldReduce ? {} : { x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
