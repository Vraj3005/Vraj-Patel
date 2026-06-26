'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Code, TrendingUp, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="py-12 md:py-20 flex flex-col items-center text-center gap-6"
    >
      {/* Specialty Badges */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2.5">
        <Badge variant="primary" className="flex items-center gap-1 py-1 px-3">
          <Code className="h-3 w-3" /> Full-Stack Architect
        </Badge>
        <Badge variant="secondary" className="flex items-center gap-1 py-1 px-3">
          <Cpu className="h-3 w-3" /> AI & ERP Systems Builder
        </Badge>
        <Badge variant="accent" className="flex items-center gap-1 py-1 px-3">
          <TrendingUp className="h-3 w-3" /> Quant Research Enthusiast
        </Badge>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl text-white leading-tight md:leading-tight"
      >
        Engineering High-Performance{' '}
        <span className="text-gradient-purple font-black">Digital Systems</span> and{' '}
        <span className="text-gradient-cyan font-black">Financial Tools</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-sm md:text-base text-muted max-w-2xl leading-relaxed font-medium"
      >
        I design and deploy end-to-end ERP structures for commercial operations, automated multi-agent AI scripts, and GARCH mathematical volatility projection models. Currently pursuing my 4th year in CSE at Nirma University.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mt-2">
        <Link href="/projects">
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            Explore System Case Studies <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/ask-vraj">
          <Button variant="secondary" size="lg" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-400" /> Challenge My AI Assistant
          </Button>
        </Link>
      </motion.div>

      {/* Dashboard Preview / Recruiter Stats Overlay */}
      <motion.div
        variants={itemVariants}
        className="w-full max-w-5xl mt-12 glass-panel rounded-2xl overflow-hidden shadow-3xl border border-white/8 relative"
      >
        {/* Window controls */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-white/2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-muted font-mono ml-4">vraj-patel-core-telemetry.sys</span>
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-black/30 text-left">
          <div className="p-6 flex flex-col gap-1.5">
            <span className="text-xs text-muted font-semibold tracking-wider uppercase">Systems Deployed</span>
            <span className="text-2xl md:text-3xl font-black text-white">10+</span>
            <span className="text-[10px] text-accent font-semibold flex items-center gap-1">Active Production Logs</span>
          </div>
          <div className="p-6 flex flex-col gap-1.5">
            <span className="text-xs text-muted font-semibold tracking-wider uppercase">Industry ERPs</span>
            <span className="text-2xl md:text-3xl font-black text-white">4 Modules</span>
            <span className="text-[10px] text-accent font-semibold">Managing Supply & Leads</span>
          </div>
          <div className="p-6 flex flex-col gap-1.5">
            <span className="text-xs text-muted font-semibold tracking-wider uppercase">Average Page Speed</span>
            <span className="text-2xl md:text-3xl font-black text-white">&lt; 1.2s</span>
            <span className="text-[10px] text-accent font-semibold">Headless SSR optimized</span>
          </div>
          <div className="p-6 flex flex-col gap-1.5">
            <span className="text-xs text-muted font-semibold tracking-wider uppercase">AI Automation</span>
            <span className="text-2xl md:text-3xl font-black text-white">Workflow</span>
            <span className="text-[10px] text-accent font-semibold">With Zod parsing</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
