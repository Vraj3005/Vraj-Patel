"use client";

import React, { useRef } from "react";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { cn } from "@/lib/utils";

interface CursorBorderCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderColor?: string;
  radius?: number;
}

/**
 * A glassmorphic card component with a glowing border that follows the user's cursor.
 */
export function CursorBorderCard({
  children,
  className,
  containerClassName,
  borderColor = "rgba(255, 255, 255, 0.12)",
  radius = 160,
}: CursorBorderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition(cardRef);

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/5 bg-zinc-900/50 p-6 backdrop-blur-md group",
        containerClassName
      )}
    >
      {/* Dynamic border spotlight background mask */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-[1px] rounded-xl z-0"
        style={{
          background: `radial-gradient(${radius}px circle at ${x}px ${y}px, ${borderColor}, transparent 80%)`,
          padding: "1px",
          WebkitMask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)",
        }}
      />
      
      {/* Interactive inner radial reflection background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(${radius * 1.5}px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.02), transparent 80%)`,
        }}
      />

      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
}
