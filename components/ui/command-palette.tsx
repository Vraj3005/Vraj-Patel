'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, FileText, Folder, User, Terminal, HelpCircle, Mail, 
  ShieldCheck, CornerDownLeft, Github, Award 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { projects, categories } from '@/lib/data/projects';

interface CommandItem {
  id: string;
  label: string;
  description: string;
  category: 'Navigation' | 'Project Categories' | 'Case Studies' | 'Actions';
  action: () => void;
  icon: React.ReactNode;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Core navigation commands
  const navigationCommands: CommandItem[] = [
    {
      id: 'nav-about',
      label: 'Go to About',
      description: 'Check Vraj\'s university background, timeline, and tech skills.',
      category: 'Navigation',
      action: () => { router.push('/about'); onClose(); },
      icon: <User className="h-4 w-4 text-primary" />,
    },
    {
      id: 'nav-projects',
      label: 'Go to Projects',
      description: 'Search and inspect Vraj\'s 10 major project cases.',
      category: 'Navigation',
      action: () => { router.push('/projects'); onClose(); },
      icon: <Folder className="h-4 w-4 text-secondary" />,
    },
    {
      id: 'nav-lab',
      label: 'Go to Lab Experiment',
      description: 'Run interactive strategy simulators and option volatility models.',
      category: 'Navigation',
      action: () => { router.push('/lab'); onClose(); },
      icon: <Terminal className="h-4 w-4 text-accent" />,
    },
    {
      id: 'nav-ai',
      label: 'Open Ask Vraj',
      description: 'Ask Vraj\'s chatbot about projects, notice periods, and GPA.',
      category: 'Navigation',
      action: () => { router.push('/ask-vraj'); onClose(); },
      icon: <HelpCircle className="h-4 w-4 text-cyan-400" />,
    },
    {
      id: 'nav-resume',
      label: 'Go to Resume',
      description: 'Interact with and print Vraj\'s single-page A4 resume.',
      category: 'Navigation',
      action: () => { router.push('/resume'); onClose(); },
      icon: <FileText className="h-4 w-4 text-amber-500" />,
    },
    {
      id: 'nav-contact',
      label: 'Go to Contact',
      description: 'Send direct messages and business inquiries to Vraj.',
      category: 'Navigation',
      action: () => { router.push('/contact'); onClose(); },
      icon: <Mail className="h-4 w-4 text-emerald-400" />,
    },
  ];

  // Category filter commands
  const categoryFilterCommands: CommandItem[] = categories
    .filter(cat => cat !== 'All')
    .map(cat => ({
      id: `filter-${cat.toLowerCase().replace(/\s+/g, '-')}`,
      label: `Filter projects: ${cat}`,
      description: `View Vraj's portfolio filtered by ${cat}.`,
      category: 'Project Categories' as const,
      action: () => {
        router.push(`/projects?category=${encodeURIComponent(cat)}`);
        onClose();
      },
      icon: <Award className="h-4 w-4 text-sky-400" />,
    }));

  // Dynamic Project Case Studies
  const caseStudyCommands: CommandItem[] = projects.map(proj => ({
    id: `project-${proj.slug}`,
    label: `Open Case Study: ${proj.title}`,
    description: `Read problem, architecture, backend logic, and challenges for ${proj.title}.`,
    category: 'Case Studies' as const,
    action: () => {
      router.push(`/projects/${proj.slug}`);
      onClose();
    },
    icon: <ShieldCheck className="h-4 w-4 text-lime-400" />,
  }));

  // System Actions
  const actionCommands: CommandItem[] = [
    {
      id: 'act-download-resume',
      label: 'Download Resume',
      description: 'Launch system print dialog directly from resume page.',
      category: 'Actions',
      action: () => {
        router.push('/resume');
        onClose();
        setTimeout(() => window.print(), 500);
      },
      icon: <FileText className="h-4 w-4 text-blue-400" />,
    },
    {
      id: 'act-github',
      label: 'View GitHub Profile',
      description: 'Open Vraj\'s public GitHub profile in a new window.',
      category: 'Actions',
      action: () => {
        window.open('https://github.com', '_blank');
        onClose();
      },
      icon: <Github className="h-4 w-4 text-indigo-400" />,
    },
    {
      id: 'act-clear',
      label: 'Action: Reset Session Storage',
      description: 'Clear system memory storage caches.',
      category: 'Actions',
      action: () => {
        sessionStorage.clear();
        onClose();
        alert('Caches cleared.');
      },
      icon: <Terminal className="h-4 w-4 text-rose-450" />,
    },
  ];

  const commands: CommandItem[] = [
    ...navigationCommands,
    ...categoryFilterCommands,
    ...caseStudyCommands,
    ...actionCommands,
  ];

  // Filter commands by typing matching
  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard shortcut keys triggers (Arrow controls, Enter execute, Esc exit)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);



  // Click outside listener
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-md"
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="w-full max-w-xl bg-[#09090d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[480px]"
          >
            {/* Input Line */}
            <div className="relative border-b border-white/5 bg-white/2 p-3.5 flex items-center gap-3">
              <Search className="h-4.5 w-4.5 text-muted shrink-0 ml-1" />
              <Input
                type="text"
                placeholder="Search actions, categories, or projects (e.g. Solar, HMM)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="flex-1 border-0 bg-transparent py-2 px-0 text-sm focus:ring-0 placeholder-muted focus:outline-none text-foreground"
              />
              <Badge variant="outline" className="text-[9px] font-mono py-0.5 border-white/10 select-none shrink-0">
                ESC
              </Badge>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin flex flex-col gap-0.5 max-h-[360px]">
              {filtered.length > 0 ? (
                filtered.map((cmd, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer select-none transition-all ${
                        isSelected ? 'bg-white/5 border border-white/10' : 'border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                          isSelected ? 'bg-white/5 border-white/15' : 'bg-white/2 border-white/5'
                        }`}>
                          {cmd.icon}
                        </div>
                        <div className="flex flex-col gap-0.5 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white tracking-wide">{cmd.label}</span>
                            <Badge variant="outline" className="text-[8px] font-mono uppercase border-white/5 px-1 py-0 bg-white/2 text-muted">
                              {cmd.category}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted leading-none font-medium mt-1">{cmd.description}</span>
                        </div>
                      </div>
                      
                      {isSelected && (
                        <span className="text-[9px] font-mono text-muted flex items-center gap-1 animate-pulse bg-white/3 px-1.5 py-0.5 border border-white/5 rounded-md">
                          Enter <CornerDownLeft className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-xs text-muted font-semibold">
                  No commands match your query.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-white/2 border-t border-white/5 px-4 py-3 flex items-center justify-between text-[10px] text-muted font-bold uppercase tracking-wider">
              <span>Use arrow keys to navigate</span>
              <span>Vraj Patel Port CLI v1.1</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

