"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '@/lib/motion/use-reduced-motion-safe';

export default function SystemCoreFallback() {
  const shouldReduce = useReducedMotionSafe();

  return (
    <div className="w-full h-full min-h-[220px] md:min-h-[280px] flex items-center justify-center relative overflow-hidden bg-black/10 border border-white/5 rounded-2xl backdrop-blur-sm select-none">
      {/* Blueprint Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* SVG Blueprint Structure */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[280px] h-auto text-cyan-500/20"
      >
        <defs>
          <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.08)" />
            <stop offset="70%" stopColor="rgba(8, 47, 73, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.4)" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Central Core Globe */}
        <circle cx="150" cy="150" r="50" fill="url(#glassGrad)" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" />

        {/* Outer Orbit Rings */}
        <motion.circle
          cx="150"
          cy="150"
          r="80"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          animate={shouldReduce ? {} : { rotate: 360 }}
          transition={shouldReduce ? {} : {
            duration: 25,
            ease: "linear",
            repeat: Infinity
          }}
          style={{ originX: "150px", originY: "150px" }}
        />

        <motion.circle
          cx="150"
          cy="150"
          r="110"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.75"
          strokeDasharray="12 8"
          animate={shouldReduce ? {} : { rotate: -360 }}
          transition={shouldReduce ? {} : {
            duration: 35,
            ease: "linear",
            repeat: Infinity
          }}
          style={{ originX: "150px", originY: "150px" }}
        />

        {/* Nodes and Links */}
        <g>
          {/* Inner core pulse dot */}
          {!shouldReduce && (
            <motion.circle
              cx="150"
              cy="150"
              r="8"
              fill="rgba(34, 211, 238, 0.2)"
              animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              filter="url(#glow)"
            />
          )}
          <circle cx="150" cy="150" r="3" fill="#fff" opacity="0.8" />

          {/* Orbiting nodes */}
          {/* 1. AI Node */}
          <g>
            <line x1="150" y1="150" x2="100" y2="90" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="90" r="5" fill="#082f49" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
            <circle cx="100" cy="90" r="2" fill="#22d3ee" />
            <text x="100" y="78" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-cyan-400/80 tracking-wider">AI</text>
          </g>

          {/* 2. Full-Stack Node */}
          <g>
            <line x1="150" y1="150" x2="210" y2="100" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="210" cy="100" r="5" fill="#082f49" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
            <circle cx="210" cy="100" r="2" fill="#22d3ee" />
            <text x="210" y="88" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-cyan-400/80 tracking-wider">Full-Stack</text>
          </g>

          {/* 3. ERP Node */}
          <g>
            <line x1="150" y1="150" x2="220" y2="190" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="220" cy="190" r="5" fill="#082f49" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
            <circle cx="220" cy="190" r="2" fill="#22d3ee" />
            <text x="220" y="205" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-cyan-400/80 tracking-wider">ERP</text>
          </g>

          {/* 4. Quant Node */}
          <g>
            <line x1="150" y1="150" x2="80" y2="180" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="80" cy="180" r="5" fill="#082f49" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
            <circle cx="80" cy="180" r="2" fill="#22d3ee" />
            <text x="80" y="195" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-cyan-400/80 tracking-wider">Quant</text>
          </g>

          {/* 5. Dashboard Node */}
          <g>
            <line x1="150" y1="150" x2="150" y2="230" stroke="rgba(34, 211, 238, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="150" cy="230" r="5" fill="#082f49" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
            <circle cx="150" cy="230" r="2" fill="#22d3ee" />
            <text x="150" y="245" textAnchor="middle" className="font-mono text-[9px] font-semibold fill-cyan-400/80 tracking-wider">Dashboard</text>
          </g>
        </g>
      </svg>

      {/* Loading Overlay Details */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
        <span className="font-mono text-[9px] text-cyan-500/50 uppercase tracking-widest">Init Core Module...</span>
      </div>
    </div>
  );
}
