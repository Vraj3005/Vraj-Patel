'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Search, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const CommandPalette = dynamic(() => import('@/components/ui/command-palette'), { ssr: false });
const RecruiterModal = dynamic(() => import('@/components/ui/recruiter-modal'), { ssr: false });

const navItems = [
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Systems', path: '/systems' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Lab', path: '/lab' },
  { label: 'Ask AI', path: '/ask-vraj' },
  { label: 'Terminal', path: '/terminal' },
  { label: 'Resume', path: '/resume' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full px-4 py-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-card-bg/80 backdrop-blur-md border border-card-border w-full rounded-2xl px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 text-foreground group">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
            <span className="text-black font-bold text-sm">VP</span>
          </div>
          <span className="tracking-tight text-sm font-semibold hidden sm:inline">
            Vraj Patel
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={`relative px-3.5 py-2 text-xs font-medium tracking-wide transition-colors duration-200 cursor-pointer rounded-lg hover:text-foreground ${
                    isActive ? 'text-foreground bg-white/5' : 'text-secondary'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-1 left-3.5 right-3.5 h-[1.5px] bg-foreground rounded-full"
                    />
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => setIsCmdOpen(true)}
            className="p-2 border border-card-border bg-card-bg rounded-lg hover:bg-white/5 text-secondary hover:text-foreground transition-colors cursor-pointer no-print"
            title="Search (Ctrl+K)"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Recruiter button */}
          <button
            onClick={() => setIsRecruiterOpen(true)}
            className="px-3.5 py-1.5 border border-cyan-500/20 bg-cyan-950/15 hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer no-print flex items-center gap-1.5"
            title="Summarize for Recruiter"
          >
            <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> Recruiter Mode
          </button>

          <Link href="/contact" className="no-print">
            <Button variant="primary" size="sm" className="flex items-center gap-1">
              Contact <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-1.5 no-print">
          <button
            onClick={() => setIsRecruiterOpen(true)}
            className="p-2 text-cyan-400 hover:text-cyan-300 cursor-pointer"
            title="Recruiter Mode"
          >
            <Briefcase className="h-[18px] w-[18px] text-cyan-400" />
          </button>
          <button
            onClick={() => setIsCmdOpen(true)}
            className="p-2 text-secondary hover:text-foreground cursor-pointer"
            title="Search"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-secondary hover:text-foreground focus:outline-none cursor-pointer"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-card-bg border border-card-border mt-3 rounded-2xl p-5 flex flex-col gap-4 shadow-xl md:hidden absolute left-4 right-4"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium tracking-wide flex items-center justify-between transition-colors ${
                      isActive ? 'bg-white/5 text-foreground' : 'text-secondary hover:bg-white/5 hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive && <div className="h-1.5 w-1.5 rounded-full bg-foreground" />}
                  </Link>
                );
              })}
            </div>
            <hr className="border-card-border" />
            
            {/* Mobile Recruiter Mode trigger */}
            <button
              onClick={() => { setIsRecruiterOpen(true); setIsOpen(false); }}
              className="px-4 py-3 border border-cyan-500/20 bg-cyan-950/10 hover:bg-cyan-950/25 text-cyan-400 text-xs font-mono font-bold rounded-xl text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Briefcase className="h-3.5 w-3.5 text-cyan-400" /> Recruiter Mode
            </button>

            <Link href="/contact" onClick={() => setIsOpen(false)}>
              <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-1">
                Contact <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette isOpen={isCmdOpen} onClose={() => setIsCmdOpen(false)} />
      <RecruiterModal isOpen={isRecruiterOpen} onClose={() => setIsRecruiterOpen(false)} />
    </nav>
  );
}
