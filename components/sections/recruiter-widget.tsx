'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronRight, FileDown, Calendar, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface QAPair {
  question: string;
  answer: string;
}

const recruiterQAs: QAPair[] = [
  {
    question: 'When is Vraj available for full-time employment?',
    answer: 'Vraj graduates from Nirma University in May 2026. He is available for immediate full-time software engineering roles or internships starting immediately.',
  },
  {
    question: 'Is he willing to relocate for work?',
    answer: 'Yes. Vraj is fully open to relocation to major tech hubs (Bangalore, Pune, Mumbai, Hyderabad, NCR) or international offers, as well as remote/hybrid setups.',
  },
  {
    question: 'What is his core tech stack expertise?',
    answer: 'Full-stack engineering: Next.js/React on the frontend; Go (Golang), Node.js, and FastAPI (Python) on the backend; coupled with PostgreSQL, Redis, and Supabase for caching/data layers.',
  },
  {
    question: 'What sets Vraj apart from standard computer science graduates?',
    answer: 'He builds real-world production business software. He has shipped customized ERP modules directly to clients (solar calculators, construction management, interior design trackers) and runs algorithmic trading backtest suites.',
  },
];

export default function RecruiterWidget() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <Card className="w-full max-w-4xl mx-auto my-12 overflow-hidden border border-white/5 bg-[#0a0a0c]/60 shadow-glass">
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
        
        {/* Left Side: Interactive FAQ Panel */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-white animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">Recruiter Fast-Track Portal</h3>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Click a parameter card to inspect Vraj&apos;s candidacy parameters instantly:
          </p>

          <div className="flex flex-col gap-3">
            {recruiterQAs.map((qa, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                    isActive ? 'border-white/20 bg-white/5' : 'border-white/5 bg-[#0a0a0c]/40 hover:border-white/10 hover:bg-[#0a0a0c]/60'
                  }`}
                  onClick={() => setActiveIndex(isActive ? null : index)}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between p-4 select-none">
                    <span className="text-xs font-semibold text-white tracking-wide">{qa.question}</span>
                    <ChevronRight
                      className={`h-4 w-4 text-muted transition-transform duration-200 ${
                        isActive ? 'rotate-90 text-white' : ''
                      }`}
                    />
                  </div>

                  {/* Body Expand */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-4 pb-4 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/5">
                          {qa.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Fast Actions (CTA Grid) */}
        <div className="lg:w-80 p-6 md:p-8 bg-transparent flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">Direct Actions</h4>
            <p className="text-xs text-muted leading-relaxed">
              Short-circuit the standard hiring process by executing direct triggers:
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/resume" className="w-full">
              <Button className="w-full justify-center gap-2" variant="primary" size="md">
                <FileDown className="h-4 w-4" /> Download A4 Resume
              </Button>
            </Link>
            <Link href="/contact" className="w-full">
              <Button className="w-full justify-center gap-2" variant="secondary" size="md">
                <Calendar className="h-4 w-4" /> Schedule Interview
              </Button>
            </Link>
            <Link href="/ask-vraj" className="w-full">
              <Button className="w-full justify-center gap-2" variant="secondary" size="md">
                <Send className="h-4 w-4" /> Ask AI agent a question
              </Button>
            </Link>
          </div>

          <div className="border-t border-white/5 pt-4 text-[10px] text-muted text-center leading-relaxed">
            Verified Nirma CSE Academic Record
            <br />
            Status: <span className="text-white font-semibold">Ready to onboard</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
