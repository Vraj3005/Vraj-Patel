"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RouteLoaderProps {
  active: boolean;
}

/**
 * A cinematic HUD route loader that displays a top-edge progress scanline 
 * and a system status syncing indicator in the top right during navigation.
 */
export function RouteLoader({ active }: RouteLoaderProps) {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
          {/* Top-edge scanner bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-500 to-emerald-500/20 origin-left"
          />
          
          {/* HUD Status Text in top-right */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-4 right-4 bg-zinc-950/80 border border-emerald-500/35 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-mono text-emerald-400 flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.08)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="tracking-wider">SYS_SYNC: CONNECTING...</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
