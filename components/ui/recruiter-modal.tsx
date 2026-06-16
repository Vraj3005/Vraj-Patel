'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Briefcase, Code, Terminal, Bot, TrendingUp, ShieldCheck, Copy, Check 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecruiterModal({ isOpen, onClose }: RecruiterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const bullets = [
    {
      icon: <Code className="h-4 w-4 text-sky-400" />,
      title: 'Full-Stack Development',
      subtitle: 'CSE Candidate at Nirma University',
      text: 'Architects robust responsive SPAs and high-concurrency microservices. Fluent in TypeScript, Python, Go (Golang), C++, and Next.js.'
    },
    {
      icon: <Terminal className="h-4 w-4 text-emerald-450" />,
      title: 'ERP & Client Software Builder',
      subtitle: 'Enermass Solar Calculator & Bhagwati Interior ERP',
      text: 'Built customized pricing engines. Sped up 3D roof shading estimations from 4.8s to <80ms via WebGL shaders. Saved designers 65% quote times.'
    },
    {
      icon: <Bot className="h-4 w-4 text-cyan-400" />,
      title: 'Autonomous AI Automation',
      subtitle: 'Lead Crawler Scrapers & Sequence Workers',
      text: 'Created multi-agent scraping workflows using Gemini API and LangChain. Implemented strict Zod schemas for structured JSON output integrity.'
    },
    {
      icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
      title: 'Quantitative Finance Research',
      subtitle: 'HMM Market Regime discovery & Implied Volatility skews',
      text: 'Designed statistical Hidden Markov Model (HMM) backtesters in Python (Numba compiled, 25x speed loops) and C++ WebAssembly options solvers.'
    },
    {
      icon: <ShieldCheck className="h-4 w-4 text-rose-400" />,
      title: 'Production Mindset & Security',
      subtitle: 'Bottlenecks Optimization & Row-Level database policies',
      text: 'Integrates Redis caching layers, Debezium Postgres WAL logs, and enforces strict PostgreSQL Row Level Security (RLS) query constraints.'
    }
  ];

  const handleCopySummary = () => {
    const summaryText = `Vraj Patel — Recruiter Summary Checklist:
1. Full-Stack Development: CSE Undergrad at Nirma University. Fluent in TypeScript, Next.js, Python, Go, and C++.
2. ERP & Client Software: Built Enermass Solar ERP and Bhagwati Interior ERP. Optimized WebGL shading engine from 4.8s to <80ms.
3. AI Automation: Programmed outbound scrapers utilizing Gemini API, LangChain, and Zod structured JSON schemas.
4. Quant Finance: Built HMM market regime analyzers (Numba optimized, 25x speedup) and C++ WASM options calculators.
5. Production Mindset: Focuses on performance tuning (BullMQ Redis, WAL logs) and database security (Supabase RLS).`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md no-print"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl bg-[#08080c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative"
          >
            {/* Background cyber grid */}
            <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 bg-white/2 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <Briefcase className="h-5 w-5 text-secondary" />
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-white font-serif tracking-wide leading-none">Recruiter Value Proposition</h3>
                  <span className="text-[10px] text-muted font-mono uppercase tracking-widest mt-1">Brief Summary Checklist</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 border border-white/5 hover:border-white/10 bg-white/2 hover:bg-white/5 rounded-lg text-secondary hover:text-white cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Bullets List */}
            <div className="flex-1 p-5 overflow-y-auto scrollbar-thin flex flex-col gap-4 relative z-10 max-h-[380px]">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex gap-4 items-start p-3 bg-white/1 border border-white/5 rounded-xl">
                  <div className="h-8 w-8 rounded-lg bg-white/3 border border-white/5 flex items-center justify-center shrink-0">
                    {b.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white tracking-wide">{b.title}</span>
                      <span className="text-[9px] font-mono text-muted uppercase font-semibold leading-none">{b.subtitle}</span>
                    </div>
                    <p className="text-[10.5px] text-secondary leading-relaxed font-medium mt-0.5">
                      {b.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-white/5 bg-white/2 flex items-center justify-between gap-3 relative z-10">
              <Button
                variant="ghost"
                onClick={handleCopySummary}
                className="text-[10.5px] font-mono font-bold flex items-center gap-1.5 py-1.5 px-3 border border-white/5 hover:border-white/15"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied Summary!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-secondary" /> Copy Quick Summary
                  </>
                )}
              </Button>

              <Button
                variant="primary"
                onClick={onClose}
                className="text-[10.5px] font-bold py-1.5 px-4 font-mono"
              >
                Done
              </Button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
