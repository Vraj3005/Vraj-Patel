"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

export type AIStatus = "ready" | "listening" | "thinking" | "responding" | "error";

interface AICoreAvatarProps {
  status: AIStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-24 w-24"
};

const statusThemes = {
  ready: {
    gradientStart: "#06b6d4", // Cyan
    gradientEnd: "#10b981",   // Emerald
    glowColor: "rgba(6, 182, 212, 0.4)",
    ariaText: "AI Assistant is ready."
  },
  listening: {
    gradientStart: "#3b82f6", // Blue
    gradientEnd: "#06b6d4",   // Cyan
    glowColor: "rgba(59, 130, 246, 0.6)",
    ariaText: "AI Assistant is listening."
  },
  thinking: {
    gradientStart: "#8b5cf6", // Violet
    gradientEnd: "#ec4899",   // Pink/Rose
    glowColor: "rgba(139, 92, 246, 0.6)",
    ariaText: "AI Assistant is thinking."
  },
  responding: {
    gradientStart: "#f43f5e", // Rose
    gradientEnd: "#06b6d4",   // Cyan
    glowColor: "rgba(244, 63, 94, 0.7)",
    ariaText: "AI Assistant is responding."
  },
  error: {
    gradientStart: "#ef4444", // Red
    gradientEnd: "#f97316",   // Orange
    glowColor: "rgba(239, 68, 68, 0.5)",
    ariaText: "AI Assistant encountered an error."
  }
};

export default function AICoreAvatar({ status, size = "md", className }: AICoreAvatarProps) {
  const shouldReduce = useReducedMotionSafe();
  const theme = statusThemes[status] || statusThemes.ready;

  // Custom motion transitions matching states
  const getOrbTransition = (): any => {
    if (shouldReduce) return { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const };
    
    switch (status) {
      case "listening":
        return {
          scale: { duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const },
          rotate: { duration: 3, repeat: Infinity, ease: "linear" as const }
        };
      case "thinking":
        return {
          scale: { duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const },
          opacity: { duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const }
        };
      case "responding":
        return {
          scale: { duration: 0.35, repeat: Infinity, repeatType: "reverse", ease: "easeOut" as const },
          rotate: { duration: 1.5, repeat: Infinity, ease: "linear" as const }
        };
      case "error":
        return {
          opacity: { duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const }
        };
      case "ready":
      default:
        return {
          scale: { duration: 2.0, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const }
        };
    }
  };

  const getOrbVariants = (): Variants => {
    switch (status) {
      case "listening":
        return {
          animate: { scale: [0.95, 1.05], rotate: 360 }
        };
      case "thinking":
        return {
          animate: { scale: [0.85, 0.95], opacity: [0.7, 1] }
        };
      case "responding":
        return {
          animate: { scale: [0.98, 1.04], rotate: 360 }
        };
      case "error":
        return {
          animate: { scale: 0.9, opacity: [0.4, 0.9] }
        };
      case "ready":
      default:
        return {
          animate: { scale: [0.95, 1.02] }
        };
    }
  };

  const ringRotateDuration = shouldReduce ? 0 : status === "listening" ? 4 : status === "responding" ? 2 : 12;

  return (
    <div 
      className={cn("relative flex items-center justify-center shrink-0 select-none", sizeClasses[size], className)}
      role="img"
      aria-label={theme.ariaText}
    >
      {/* Screen Reader status indicator text */}
      <span className="sr-only" aria-live="polite">
        {theme.ariaText}
      </span>

      {/* SVG Canvas wrapper */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
      >
        <defs>
          <radialGradient id={`core-grad-${status}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.gradientStart} stopOpacity={0.9} />
            <stop offset="70%" stopColor={theme.gradientStart} stopOpacity={0.3} />
            <stop offset="100%" stopColor={theme.gradientEnd} stopOpacity={0} />
          </radialGradient>
          
          <linearGradient id={`ring-grad-${status}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.gradientStart} />
            <stop offset="100%" stopColor={theme.gradientEnd} stopOpacity={0.2} />
          </linearGradient>
        </defs>

        {/* Ambient Glow mesh circle */}
        {!shouldReduce && (
          <circle
            cx="50"
            cy="50"
            r="40"
            fill={`url(#core-grad-${status})`}
            className="blur-md opacity-60"
          />
        )}

        {/* Outer Orbit System Rings */}
        <motion.circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={`url(#ring-grad-${status})`}
          strokeWidth="1"
          strokeDasharray={status === "error" ? "2 8" : status === "listening" ? "12 4" : "4 6"}
          animate={ringRotateDuration > 0 ? { rotate: 360 } : {}}
          transition={ringRotateDuration > 0 ? { duration: ringRotateDuration, repeat: Infinity, ease: "linear" } : {}}
          style={{ transformOrigin: "50px 50px" }}
        />

        {status === "thinking" && (
          <motion.circle
            cx="50"
            cy="50"
            r="28"
            fill="none"
            stroke={theme.gradientStart}
            strokeWidth="0.5"
            strokeDasharray="2 3"
            animate={!shouldReduce ? { rotate: -360 } : {}}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}
          />
        )}

        {/* Neural nodes coordinates dots (Visible in md/lg sizes) */}
        {size !== "sm" && (
          <>
            <circle cx="50" cy="12" r="1.5" fill={theme.gradientStart} className="opacity-80" />
            <circle cx="88" cy="50" r="1.5" fill={theme.gradientEnd} className="opacity-80" />
            <circle cx="50" cy="88" r="1.5" fill={theme.gradientStart} className="opacity-80" />
            <circle cx="12" cy="50" r="1.5" fill={theme.gradientEnd} className="opacity-80" />
          </>
        )}

        {/* Glowing Central AI Core Orb */}
        <motion.circle
          cx="50"
          cy="50"
          r={size === "sm" ? "18" : size === "md" ? "16" : "14"}
          fill={`url(#core-grad-${status})`}
          stroke={status === "error" ? "#ef4444" : "rgba(255,255,255,0.05)"}
          strokeWidth="0.5"
          variants={getOrbVariants()}
          animate="animate"
          transition={getOrbTransition()}
          style={{ 
            transformOrigin: "50px 50px",
            filter: shouldReduce ? "none" : `drop-shadow(0 0 8px ${theme.glowColor})`
          }}
        />

        {/* Technical crosshairs overlay (Visible in lg size) */}
        {size === "lg" && (
          <>
            {/* Fine crosshairs lines */}
            <line x1="50" y1="38" x2="50" y2="34" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="50" y1="62" x2="50" y2="66" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="38" y1="50" x2="34" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
            <line x1="62" y1="50" x2="66" y2="50" stroke="white" strokeWidth="0.5" strokeOpacity="0.3" />
          </>
        )}
      </svg>
    </div>
  );
}
