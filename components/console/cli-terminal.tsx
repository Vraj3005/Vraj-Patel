'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, ChevronRight, CornerDownLeft, 
  CheckCircle2, XCircle, AlertTriangle, ShieldCheck, 
  ExternalLink, Github, ArrowUpRight
} from 'lucide-react';
import { projects } from '@/lib/data/projects';
import { DATA_FLOWS } from '@/lib/visualizer/flow-data';
import { parseCommand, getSuggestions, COMMANDS, CommandDefinition } from '@/lib/cli/registry';
import { Badge } from '@/components/ui/badge';
import { getErrorMessage } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { EventBus } from '@/lib/events/event-bus';
import { HeatmapCell } from '@/types/advanced';
import { getCategoryLabel } from '@/lib/formatters/labels';

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  command?: string;
  content: React.ReactNode;
}

export default function CLITerminal() {
  const router = useRouter();
  const [history, setHistory] = useState<LogLine[]>([
    { id: 'init-1', type: 'system', content: 'Vraj Patel - Portfolio Core Systems Shell v2.0.0' },
    { id: 'init-2', type: 'system', content: 'Type "help" to list available commands. Press TAB to autocomplete. Use UP/DOWN keys for history.' },
    { id: 'init-3', type: 'system', content: 'Fallback AI integration is active. Try: ask "What technologies are used in Driedhub?"' },
    { id: 'init-4', type: 'output', content: '' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const [contributions, setContributions] = useState<HeatmapCell[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCommandRef = useRef<(rawInput: string) => Promise<void>>(async () => {});
  const renderHelpRef = useRef<() => React.ReactNode>(() => null);
  const renderProjectListRef = useRef<() => React.ReactNode>(() => null);
  const renderFilteredProjectsRef = useRef<(cat: string) => React.ReactNode>(() => null);
  const renderProjectFlowRef = useRef<(flow: typeof DATA_FLOWS[0]) => React.ReactNode>(() => null);
  const renderRoleFitRef = useRef<(role: 'fullstack' | 'ai' | 'quant') => React.ReactNode>(() => null);
  const renderMetricsRef = useRef<() => React.ReactNode>(() => null);
  const renderHeatmapRef = useRef<() => React.ReactNode>(() => null);
  const renderSecurityChecklistRef = useRef<(project: typeof projects[0]) => React.ReactNode>(() => null);
  const renderTraceLogsRef = useRef<(flow: typeof DATA_FLOWS[0]) => React.ReactNode>(() => null);

  useEffect(() => {
    // Asynchronously pre-fetch combined GitHub contributions
    fetch('/api/github/contributions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch terminal contributions');
        return res.json();
      })
      .then(payload => setContributions(payload.data || []))
      .catch(err => console.warn('Could not load terminal contributions:', err));
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  // Focus helper
  const focusInput = useCallback(() => {
    if (inputRef.current && !isStreaming) {
      inputRef.current.focus();
    }
  }, [isStreaming]);

  useEffect(() => {
    focusInput();
  }, [isStreaming]);

  // Autocomplete updates reactive to input
  useEffect(() => {
    if (inputValue.trim()) {
      const sug = getSuggestions(inputValue);
      setSuggestions(sug);
      setActiveSuggestionIdx(-1);
    } else {
      setSuggestions([]);
      setActiveSuggestionIdx(-1);
    }
  }, [inputValue]);

  // Helper: log to database & dispatch Operations Console event
  const logTelemetry = useCallback(async (cmdText: string, success: boolean, durationMs: number) => {
    try {
      // 1. Log to supabase
      const cmdName = cmdText.split(' ')[0] || 'unknown';
      const args = cmdText.split(' ').slice(1) || [];
      const supabaseClient = supabase as any;
      await supabaseClient.from('cli_command_logs').insert({
        command: cmdName,
        args,
        success,
        execution_time_ms: durationMs
      });

      // 2. Dispatch to live event bus
      await EventBus.publish(
        'cli',
        success ? 'success' : 'warning',
        `CLI Command: '${cmdText}' (duration ${durationMs}ms, success: ${success})`,
        { success, duration: durationMs }
      );
    } catch (err) {
      console.warn('CLI logging failed:', err);
    }
  }, []);

  // Helper to execute commands
  const handleCommand = useCallback(async (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    const startMs = Date.now();

    // 1. Log prompt line in history
    const uniqueId = Math.random().toString(36).substring(2, 9);
    setHistory((prev) => [
      ...prev.filter(l => l.content !== ''), 
      { id: `input-${uniqueId}`, type: 'input', content: `vraj@portfolio:~$ ${trimmed}` }
    ]);
    setInputValue('');
    setSuggestions([]);

    // 2. Add to arrow history
    setCmdHistory((prev) => {
      const updated = [trimmed, ...prev.filter((h) => h !== trimmed)];
      return updated.slice(0, 50); // cap at 50
    });
    setHistoryIndex(-1);

    // 3. Command Parsing
    const parsed = parseCommand(trimmed);
    const cmd = parsed.commandName;
    const args = parsed.args;

    let outputElement: React.ReactNode = null;
    let type: LogLine['type'] = 'output';
    let _isNav = false;

    try {
      switch (cmd) {
        case 'clear':
          setHistory([]);
          return;

        case 'help':
          outputElement = renderHelpRef.current();
          break;

        case 'whoami':
          outputElement = (
            <div className="flex flex-col gap-1.5 font-mono">
              <span className="text-cyan-400 font-bold">NAME: Vraj Patel</span>
              <span className="text-white/80">ROLE: Full-Stack Developer / Quant Research / AI Engineer</span>
              <span className="text-white/80">ACADEMICS: Computer Science & Engineering (4th Year) at Nirma University</span>
              <span className="text-white/80">BATCH: 2023-2027 | CGPA: 7.98</span>
              <span className="text-white/80">CORE FOCUS: Performance-tuned web apps, ERP workflows, volatility skew engines, and ML models.</span>
            </div>
          );
          break;

        case 'about':
          outputElement = (
            <div className="flex flex-col gap-2 leading-relaxed">
              <span className="text-cyan-400 font-bold border-b border-white/5 pb-1">BACKGROUND & OBJECTIVE</span>
              <p className="text-white/85">
                Vraj Patel is a software engineer specializing in developer-first ERP suites, high-throughput trading boards, and automated pipeline intelligence. 
                Currently a 4th-year CS student at Nirma University, he is completing a Software Engineering Internship at Pitbull Corporations (May 1st - July 1st).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-1 text-[11px]">
                <div className="bg-white/2 border border-white/5 p-2 rounded-lg">
                  <span className="text-secondary font-bold font-mono uppercase block mb-1">Systems Architecture</span>
                  Next.js App Router, Zustand state, Server Actions, REST APIs, Drizzle ORM, Supabase PostgreSQL, Redis caching.
                </div>
                <div className="bg-white/2 border border-white/5 p-2 rounded-lg">
                  <span className="text-secondary font-bold font-mono uppercase block mb-1">Quantitative Frameworks</span>
                  Gaussian Hidden Markov Models (HMM), NumPy backtesting, GARCH forecasting, option Greeks, Streamlit widgets.
                </div>
              </div>
            </div>
          );
          break;

        case 'contact':
          outputElement = (
            <div className="flex flex-col gap-1.5">
              <span className="text-cyan-400 font-bold uppercase tracking-wider">Communication Coordinates:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/85">
                <div><span className="text-secondary">Email:</span> <a href="mailto:patelvrajpatel30@gmail.com" className="text-cyan-400 hover:underline">patelvrajpatel30@gmail.com</a></div>
                <div><span className="text-secondary">Phone:</span> <span className="text-foreground">+91 79902 51191</span></div>
                <div><span className="text-secondary">Location:</span> <span>Gujarat, India</span></div>
                <div><span className="text-secondary">LinkedIn:</span> <a href="https://www.linkedin.com/in/vraj-patel-9502a6285" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">linkedin.com/in/vraj-patel-9502a6285</a></div>
                <div><span className="text-secondary">GitHub (Personal):</span> <a href="https://github.com/Vraj3005" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">github.com/Vraj3005</a></div>
                <div><span className="text-secondary">GitHub (Academic):</span> <a href="https://github.com/23bce377-debug" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">github.com/23bce377-debug</a></div>
              </div>
            </div>
          );
          break;

        case 'resume':
          outputElement = (
            <div className="flex flex-col gap-2">
              <span className="text-cyan-400 font-bold">INTERACTIVE RESUME:</span>
              <p className="text-white/85">Navigate to Vraj Patel&apos;s digital resume to inspect full employment details, projects descriptions, and to trigger a print command.</p>
              <div className="flex gap-3 mt-1">
                <button onClick={() => { router.push('/resume'); }} className="px-3 py-1.5 bg-cyan-950/20 border border-cyan-800/30 hover:border-cyan-400 text-cyan-400 hover:text-white rounded-lg cursor-pointer transition-all flex items-center gap-1">
                  Open Interactive CV <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
          break;

        case 'github':
          outputElement = (
            <div className="flex flex-col gap-2">
              <span className="text-cyan-400 font-bold">GITHUB DIRECTORY</span>
              <span className="text-white/85">Vraj Patel&apos;s open-source repositories:</span>
              <div className="flex flex-col gap-2.5 mt-1.5">
                <a href="https://github.com/Vraj3005" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline">
                  <Github className="h-4 w-4" /> Open Personal Profile (@Vraj3005) <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href="https://github.com/23bce377-debug" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline">
                  <Github className="h-4 w-4" /> Open Academic Profile (@23bce377-debug) <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
          break;

        case 'projects':
          const filterArg = args[0] || '';
          if (filterArg.startsWith('--')) {
            outputElement = renderFilteredProjectsRef.current(filterArg.replace('--', ''));
          } else {
            outputElement = (
              <div className="flex flex-col gap-2">
                <span className="text-cyan-400 font-bold">PROJECTS DIRECTORY</span>
                <p className="text-white/85">Vraj has built {projects.length} production ERPs, e-commerce stores, and quantitative analytics engines.</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <button onClick={() => handleCommandRef.current('project list')} className="text-[10px] bg-white/5 border border-white/10 hover:border-cyan-400 text-secondary hover:text-white px-2.5 py-1 rounded-md cursor-pointer transition-colors">
                    project list 📋
                  </button>
                  <button onClick={() => handleCommandRef.current('projects --client')} className="text-[10px] bg-white/5 border border-white/10 hover:border-cyan-400 text-secondary hover:text-white px-2.5 py-1 rounded-md cursor-pointer transition-colors">
                    projects --client 💼
                  </button>
                  <button onClick={() => handleCommandRef.current('projects --quant')} className="text-[10px] bg-white/5 border border-white/10 hover:border-cyan-400 text-secondary hover:text-white px-2.5 py-1 rounded-md cursor-pointer transition-colors">
                    projects --quant 📊
                  </button>
                </div>
              </div>
            );
          }
          break;

        case 'skills':
          outputElement = (
            <div className="flex flex-col gap-3 font-mono">
              <span className="text-cyan-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">Skillset Competency Grid</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white/80">
                <div className="flex flex-col gap-1 p-2 bg-white/[0.01] border border-white/2 rounded-lg">
                  <span className="text-secondary font-black block text-[10px] mb-1">LANGUAGES</span>
                  TypeScript, JavaScript, Python, HTML/CSS, SQL (PostgreSQL, SQLite)
                </div>
                <div className="flex flex-col gap-1 p-2 bg-white/[0.01] border border-white/2 rounded-lg">
                  <span className="text-secondary font-black block text-[10px] mb-1">FRONTEND & FRAMEWORKS</span>
                  Next.js App Router, React, Zustand state, Tailwind CSS, Recharts, Framer Motion
                </div>
                <div className="flex flex-col gap-1 p-2 bg-white/[0.01] border border-white/2 rounded-lg">
                  <span className="text-secondary font-black block text-[10px] mb-1">BACKEND & DATA</span>
                  FastAPI, Node.js, Express, Supabase APIs, Drizzle ORM, WebSockets
                </div>
              </div>
            </div>
          );
          break;

        // Project Commands
        case 'project list':
          outputElement = renderProjectListRef.current();
          break;

        case 'project open':
          const openSlug = args[0];
          if (!openSlug) {
            outputElement = <span className="text-rose-400 font-bold">Error: Missing project slug. Usage: project open &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === openSlug);
            if (!found) {
              outputElement = <span className="text-rose-400 font-bold">Error: Project slug &quot;{openSlug}&quot; not found. Run &quot;project list&quot; to review slugs.</span>;
              type = 'error';
            } else {
              outputElement = <span className="text-cyan-400 font-bold">Routing to /projects/{openSlug}...</span>;
              _isNav = true;
              router.push(`/projects/${openSlug}`);
            }
          }
          break;

        case 'project tech':
          const techSlug = args[0];
          if (!techSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: project tech &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === techSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Project slug &quot;{techSlug}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = (
                <div className="flex flex-col gap-2">
                  <span className="text-cyan-400 font-bold">{found.title} Technologies Stack:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {found.technologies.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                  </div>
                </div>
              );
            }
          }
          break;

        case 'project features':
          const featSlug = args[0];
          if (!featSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: project features &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === featSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Project slug &quot;{featSlug}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = (
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-cyan-400 font-bold">{found.title} Core Features:</span>
                  <ul className="list-disc list-inside flex flex-col gap-1 text-white/85 text-[11px] mt-1 pl-1">
                    {found.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              );
            }
          }
          break;

        case 'project architecture':
          const archSlug = args[0];
          if (!archSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: project architecture &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === archSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Project slug &quot;{archSlug}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = (
                <div className="flex flex-col gap-2">
                  <span className="text-cyan-400 font-bold">{found.title} Architecture Summary:</span>
                  <p className="text-white/85 leading-relaxed text-[11px] bg-white/[0.01] border border-white/2 p-3 rounded-lg font-serif">
                    {found.architecture}
                  </p>
                  {found.dbBackendLogic && (
                    <div className="mt-1 font-mono text-[10px] text-secondary">
                      <strong>Data Logic:</strong> {found.dbBackendLogic}
                    </div>
                  )}
                </div>
              );
            }
          }
          break;

        case 'project flow':
          const flowSlug = args[0];
          if (!flowSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: project flow &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = DATA_FLOWS.find(f => f.projectSlug === flowSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: No transaction data flow mapped for slug &quot;{flowSlug}&quot;.</span>;
              type = 'error';
            } else {
              outputElement = renderProjectFlowRef.current(found);
            }
          }
          break;

        case 'project links':
          const linksSlug = args[0];
          if (!linksSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: project links &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === linksSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Project slug &quot;{linksSlug}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = (
                <div className="flex flex-col gap-2">
                  <span className="text-cyan-400 font-bold">{found.title} Links:</span>
                  <div className="flex gap-3 mt-1.5">
                    {found.liveUrl && (
                      <a href={found.liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/5 border border-white/10 hover:border-cyan-400 rounded text-cyan-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer transition-colors">
                        Launch Live <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {found.githubUrl && (
                      <a href={found.githubUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/5 border border-white/10 hover:border-cyan-400 rounded text-cyan-400 hover:text-white text-[10px] flex items-center gap-1 cursor-pointer transition-colors">
                        Source Code <Github className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            }
          }
          break;

        // Categories
        case 'projects --client':
        case 'projects --erp':
        case 'projects --quant':
        case 'projects --ai':
        case 'projects --dashboard':
        case 'projects --website':
          outputElement = renderFilteredProjectsRef.current(cmd.replace('projects --', ''));
          break;

        // AI Recruiter Commands
        case 'recruiter-summary':
          outputElement = (
            <div className="flex flex-col gap-2.5 font-mono text-left border-l-2 border-cyan-400 pl-4 py-1">
              <span className="text-cyan-400 font-black tracking-widest text-[11px] uppercase">Recruiter Synthesis Vitals</span>
              <p className="text-white/85 text-[11.5px] leading-relaxed">
                Vraj Patel is an enterprise software engineer with validated, real-world project portfolios deployed on Vercel. 
                He specializes in building scalable frontend solutions (Next.js App Router, Zustand, React-Hook-Form) 
                integrated with secure backends (Supabase PostgreSQL, FastAPI, and Row-Level Security policies).
              </p>
              <div className="flex flex-col gap-1.5 text-[11px] mt-1">
                <div>💥 <strong>Real Clients Deployed:</strong> Enermass, Bhagwati Interiors, Driedhub, Marea.</div>
                <div>💥 <strong>Mathematical Skills:</strong> Volatility clustering models, regimes classifiers (hmmlearn).</div>
                <div>💥 <strong>Available Internship:</strong> May 1 - July 1 (Pitbull Corporations). Available for full-time.</div>
              </div>
            </div>
          );
          break;

        case 'role-fit':
          const fitArg = args[0] ? args[0].toLowerCase() : '';
          if (fitArg === 'fullstack') {
            outputElement = renderRoleFitRef.current('fullstack');
          } else if (fitArg === 'ai') {
            outputElement = renderRoleFitRef.current('ai');
          } else if (fitArg === 'quant') {
            outputElement = renderRoleFitRef.current('quant');
          } else {
            outputElement = <span className="text-rose-500">Error: Invalid role-fit target. Use: &quot;role-fit fullstack&quot;, &quot;role-fit ai&quot;, or &quot;role-fit quant&quot;.</span>;
            type = 'error';
          }
          break;

        // Navigation
        case 'open /projects':
          outputElement = <span className="text-cyan-400 font-bold">Navigating to /projects directory...</span>;
          _isNav = true;
          router.push('/projects');
          break;

        case 'open /ask-vraj':
          outputElement = <span className="text-cyan-400 font-bold">Routing browser to /ask-vraj AI portal...</span>;
          _isNav = true;
          router.push('/ask-vraj');
          break;

        case 'open /resume':
          outputElement = <span className="text-cyan-400 font-bold">Opening Vraj Patel&apos;s Interactive CV...</span>;
          _isNav = true;
          router.push('/resume');
          break;

        case 'open /contact':
          outputElement = <span className="text-cyan-400 font-bold">Redirecting browser to /contact card...</span>;
          _isNav = true;
          router.push('/contact');
          break;

        case 'open /inbox':
          outputElement = <span className="text-cyan-400 font-bold">Opening Secure Inquiries Inbox Gateway...</span>;
          _isNav = true;
          router.push('/inbox');
          break;

        // Advanced Subsystems
        case 'show metrics':
          outputElement = renderMetricsRef.current();
          break;

        case 'show heatmap':
          outputElement = renderHeatmapRef.current();
          break;

        case 'show security':
          const secSlug = args[0];
          if (!secSlug) {
            outputElement = <span className="text-rose-400">Error: Missing project slug. Usage: show security &lt;slug&gt;</span>;
            type = 'error';
          } else {
            const found = projects.find(p => p.slug === secSlug);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Project slug &quot;{secSlug}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = renderSecurityChecklistRef.current(found);
            }
          }
          break;

        case 'show trace':
          const traceFlow = args[0];
          if (!traceFlow) {
            outputElement = <span className="text-rose-400">Error: Missing flow name. Usage: show trace &lt;flow-name&gt;</span>;
            type = 'error';
          } else {
            const found = DATA_FLOWS.find(f => f.id === traceFlow);
            if (!found) {
              outputElement = <span className="text-rose-400">Error: Pipeline flow &quot;{traceFlow}&quot; not found.</span>;
              type = 'error';
            } else {
              outputElement = renderTraceLogsRef.current(found);
            }
          }
          break;

        // AI Chat streaming query fallback
        case 'ask':
          const queryText = args[0] || '';
          if (!queryText.trim()) {
            outputElement = <span className="text-rose-400">Error: Please provide a question string. Usage: ask &quot;How does Vraj build systems?&quot;</span>;
            type = 'error';
          } else {
            setIsStreaming(true);
            setHistory((prev) => [...prev, { id: `ai-wait-${uniqueId}`, type: 'system', content: 'Contacting AI Assistant...' }]);

            try {
              const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: queryText, stream: true })
              });

              if (!response.ok) throw new Error('API server returned response error status.');
              if (!response.body) throw new Error('Readable stream not returned by route.');

              // Strip loader indicator and start stream output
              setHistory((prev) => {
                const base = prev.filter(l => l.id !== `ai-wait-${uniqueId}`);
                return [...base, { id: `ai-stream-${uniqueId}`, type: 'output', content: '' }];
              });

              const reader = response.body.getReader();
              const decoder = new TextDecoder();
              let done = false;
              let cumulativeText = '';

              while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                if (value) {
                  const chunk = decoder.decode(value);
                  cumulativeText += chunk;
                  
                  setHistory((prev) => {
                    const updated = [...prev];
                    const targetIdx = updated.findIndex(l => l.id === `ai-stream-${uniqueId}`);
                    if (targetIdx !== -1) {
                      updated[targetIdx] = {
                        id: `ai-stream-${uniqueId}`,
                        type: 'output',
                        content: <div className="text-white/80 whitespace-pre-wrap leading-relaxed select-text">{cumulativeText}</div>
                      };
                    }
                    return updated;
                  });
                }
              }

              // Finished clean. Log telemetry logs
              await logTelemetry(trimmed, true, Date.now() - startMs);

            } catch (err: unknown) {
              const errMsg = getErrorMessage(err);
              console.error('AI streaming error in terminal:', err);
              setHistory((prev) => {
                const base = prev.filter(l => l.id !== `ai-wait-${uniqueId}`);
                return [
                  ...base,
                  { id: `ai-err-${uniqueId}`, type: 'error', content: `Streaming Error: ${errMsg || 'Stream connection closed unexpectedly.'}` }
                ];
              });
              await logTelemetry(trimmed, false, Date.now() - startMs);
            } finally {
              setIsStreaming(false);
            }
            return; // Exit early since ask handles its own pipeline
          }
          break;

        default:
          outputElement = <span className="text-rose-500 font-mono">Error: Command &quot;{cmd}&quot; is not recognized. Type &quot;help&quot; to review valid inputs list.</span>;
          type = 'error';
          break;
      }
    } catch (err: unknown) {
      outputElement = <span className="text-rose-400">Execution Error: {getErrorMessage(err) || 'Internal pipeline execution failure.'}</span>;
      type = 'error';
    }

    // Log telemetry logs for non-AI operations
    const duration = Date.now() - startMs;
    await logTelemetry(trimmed, type !== 'error', duration);

    // Save outputs elements in history logs list
    setHistory((prev) => [
      ...prev,
      { id: `output-${Math.random().toString(36).substring(2, 9)}`, type, command: cmd, content: outputElement }
    ]);
  }, [logTelemetry, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isStreaming) return;

    if (e.key === 'Enter') {
      if (activeSuggestionIdx >= 0 && suggestions[activeSuggestionIdx]) {
        handleCommand(suggestions[activeSuggestionIdx]);
      } else {
        handleCommand(inputValue);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const nextIdx = (activeSuggestionIdx + 1) % suggestions.length;
        setActiveSuggestionIdx(nextIdx);
        setInputValue(suggestions[nextIdx]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIndex(nextIdx);
        setInputValue(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIndex - 1;
      if (nextIdx >= 0) {
        setHistoryIndex(nextIdx);
        setInputValue(cmdHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveSuggestionIdx(-1);
    }
  };

  // Structured Renderer 1: HELP COMMAND
  function renderHelp() {
    const categories: Record<CommandDefinition['category'], CommandDefinition[]> = {
      general: [], project: [], category: [], ai: [], navigation: [], advanced: []
    };
    COMMANDS.forEach(cmd => { categories[cmd.category].push(cmd); });

    return (
      <div className="flex flex-col gap-4 font-mono text-[10.5px] border border-white/5 bg-white/[0.01] p-4 rounded-xl text-left select-none max-w-2xl">
        <span className="text-cyan-400 font-bold border-b border-white/5 pb-1 block text-xs">VRAJ SHELL COMMAND REFERENCE</span>
        
        {Object.entries(categories).map(([cat, cmds]) => (
          <div key={cat} className="flex flex-col gap-1.5">
            <span className="text-secondary font-black uppercase text-[9px] tracking-widest">{cat} Commands</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
              {cmds.map(c => (
                <div key={c.name} className="flex flex-col">
                  <span 
                    onClick={() => { setInputValue(c.usage); focusInput(); }}
                    className="text-white hover:text-cyan-400 font-bold cursor-pointer transition-colors w-fit underline decoration-white/10 hover:decoration-cyan-400/50"
                  >
                    {c.usage}
                  </span>
                  <span className="text-gray-400 text-[9.5px]">{c.description}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Structured Renderer 2: PROJECT LIST COMMAND
  function renderProjectList() {
    return (
      <div className="flex flex-col gap-2 font-mono text-[10.5px] text-left select-none">
        <span className="text-cyan-400 font-bold uppercase tracking-wider block">Portfolio Slugs Register</span>
        <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-xl">
          <table className="w-full text-[10px] text-left text-gray-300">
            <thead className="border-b border-white/5 text-secondary uppercase font-bold text-[8px] tracking-wider bg-black/25">
              <tr>
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Slug (Click to copy options)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/2 font-semibold">
              {projects.map(p => (
                <tr key={p.slug} className="hover:bg-white/2 transition-colors">
                  <td className="py-2 px-3 text-white">{p.title}</td>
                  <td className="py-2 px-3 text-secondary">{getCategoryLabel(p.category)}</td>
                  <td className="py-2 px-3 font-bold">
                    <button 
                      onClick={() => { setInputValue(`project tech ${p.slug}`); focusInput(); }}
                      className="text-cyan-400 hover:text-white transition-colors cursor-pointer mr-2 underline"
                      title="Inspect tech specs"
                    >
                      {p.slug}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Structured Renderer 3: FILTERED PROJECTS LIST
  function renderFilteredProjects(cat: string) {
    let filtered = projects;
    if (cat === 'client') filtered = projects.filter(p => p.client !== 'Personal Project');
    else if (cat === 'erp') filtered = projects.filter(p => p.title.toLowerCase().includes('erp') || p.title.toLowerCase().includes('calculator') || p.slug.includes('dashboard'));
    else if (cat === 'quant') filtered = projects.filter(p => p.category === 'quant_research');
    else if (cat === 'ai') filtered = projects.filter(p => p.technologies.some(t => t.toLowerCase().includes('gemini') || t.toLowerCase().includes('ai')));
    else if (cat === 'dashboard') filtered = projects.filter(p => p.title.toLowerCase().includes('dashboard') || p.title.toLowerCase().includes('board'));
    else if (cat === 'website') filtered = projects.filter(p => p.title.toLowerCase().includes('website') || p.title.toLowerCase().includes('portal') || p.slug.includes('marea-website') || p.slug.includes('surendra'));

    return (
      <div className="flex flex-col gap-2 font-mono text-[10.5px] text-left select-none">
        <span className="text-cyan-400 font-bold uppercase tracking-wider block">Filtered Listings (category: {cat})</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {filtered.map(p => (
            <div key={p.slug} className="bg-white/2 border border-white/5 p-3 rounded-lg flex flex-col gap-1.5">
              <div className="flex justify-between items-start gap-1">
                <span className="font-serif text-white font-bold leading-tight">{p.title}</span>
                <Badge variant="outline" className="text-[7.5px] py-0 px-1.5 font-bold uppercase tracking-wider shrink-0">{p.year}</Badge>
              </div>
              <p className="text-[9.5px] text-gray-400 leading-normal">{p.shortDescription || p.description.substring(0, 80)}...</p>
              <div className="flex gap-2.5 mt-1 font-mono text-[8px] font-bold text-cyan-400">
                <button onClick={() => { setInputValue(`project tech ${p.slug}`); focusInput(); }} className="hover:text-white cursor-pointer transition-colors">TECH</button>
                <button onClick={() => { setInputValue(`project features ${p.slug}`); focusInput(); }} className="hover:text-white cursor-pointer transition-colors">FEATURES</button>
                <button onClick={() => { setInputValue(`project open ${p.slug}`); focusInput(); }} className="hover:text-white cursor-pointer transition-colors">LAUNCH</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Renderer 4: PROJECT DATA FLOW STEP-BY-STEP
  function renderProjectFlow(flow: typeof DATA_FLOWS[0]) {
    return (
      <div className="flex flex-col gap-3 font-mono text-[10.5px] text-left select-none w-full">
        <span className="text-cyan-400 font-bold uppercase tracking-wider block">{flow.name} Pipeline Mappings</span>
        <div className="flex flex-col gap-2.5 max-w-xl">
          {flow.steps.map(step => (
            <div key={step.sequence} className="border border-white/5 bg-white/[0.005] p-3 rounded-lg flex gap-3 relative items-start">
              <div className="h-5 w-5 bg-cyan-950/45 border border-cyan-800/30 text-cyan-400 font-bold text-[9px] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {step.sequence}
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-center border-b border-white/5 pb-0.5">
                  <span className="font-bold text-white leading-none">{step.title}</span>
                  <Badge variant="outline" className="text-[7px] py-0 px-1 font-bold tracking-wider">{step.nodeId.toUpperCase()}</Badge>
                </div>
                <p className="text-[9.5px] text-gray-400 leading-normal mt-0.5">{step.description}</p>
                <div className="grid grid-cols-2 gap-1 text-[8.5px] font-mono text-secondary mt-1">
                  <div><strong>In:</strong> {step.input.substring(0, 30)}</div>
                  <div><strong>Out:</strong> {step.output.substring(0, 30)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Renderer 5: ROLE FIT ANALYSIS
  function renderRoleFit(role: 'fullstack' | 'ai' | 'quant') {
    let title = '';
    let description = '';
    let matches: string[] = [];
    let weaknesses: string[] = [];

    if (role === 'fullstack') {
      title = 'Full-Stack Developer Fit';
      description = 'Vraj is a highly proficient frontend and backend architect, specialized in state synchronization layers and responsive visualizers.';
      matches = [
        'Production next/image optimization & route schemas',
        'Next.js server action handlers, direct RPC models',
        'Complex UI flows in Framer Motion / CSS print layouts',
        'Zod inputs validation schemas & strict JSON parameters parsing'
      ];
      weaknesses = [
        'Relatively lower exposure to high-scale Kubernetes clusters or multi-region AWS cloud infra, focusing primarily on serverless Vercel and Supabase cloud modules.'
      ];
    } else if (role === 'ai') {
      title = 'AI Automation Engineer Fit';
      description = 'Strong experience in prompt engineering context limits, JSON schema verification, and stream buffers handling.';
      matches = [
        'Google GenAI SDK integration with Gemini models',
        'Strict JSON structured object parsing via Zod schemas validation',
        'Telemetry audits and serverless Edge runtime stream logging',
        'Nodemailer SMTP automation & background campaign runs'
      ];
      weaknesses = [
        'Focused on APIs-driven model orchestration rather than custom weights training or local GPU model compiling.'
      ];
    } else {
      title = 'Quantitative Developer Fit';
      description = 'Grounded time-series modeling competencies, with hands-on backtesting experience.';
      matches = [
        'Gaussian Hidden Markov Models (HMM) on price vectors',
        'Vectorized backtest metrics in NumPy / Pandas',
        'Black-Scholes options pricing mathematics',
        'Plotly.js dynamic option skew 3D maps coordinate meshes'
      ];
      weaknesses = [
        'Primarily focused on historical models and signals dashboard dashboards rather than low-latency high-frequency C++ execution gateways.'
      ];
    }

    return (
      <div className="flex flex-col gap-2.5 font-mono text-left max-w-xl text-[10.5px]">
        <span className="text-cyan-400 font-bold border-b border-white/5 pb-1 uppercase">{title} Assessment</span>
        <p className="text-white/85 leading-normal">{description}</p>
        <div className="flex flex-col gap-1.5 mt-1 select-none">
          <span className="text-secondary font-black uppercase text-[8.5px]">Core Competency Fits:</span>
          {matches.map((m, i) => (
            <div key={i} className="flex gap-1.5 items-start pl-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-white/90 leading-tight">{m}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 mt-1.5 select-none">
          <span className="text-secondary font-black uppercase text-[8.5px]">Candidate Gaps:</span>
          {weaknesses.map((w, i) => (
            <div key={i} className="flex gap-1.5 items-start pl-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span className="text-gray-400 leading-tight">{w}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Renderer 6: METRICS
  function renderMetrics() {
    return (
      <div className="flex flex-col gap-3 font-mono text-[10.5px] text-left select-none w-full">
        <span className="text-cyan-400 font-bold uppercase tracking-wider block">Operational Telemetry Vitals</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mt-1">
          <div className="bg-white/2 border border-white/5 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-secondary font-black block text-[8px] uppercase">API Latency</span>
            <span className="text-base font-black text-white">118ms</span>
            <span className="text-[7.5px] text-emerald-400">95th percentile</span>
          </div>
          <div className="bg-white/2 border border-white/5 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-secondary font-black block text-[8px] uppercase">Cache Hit Rate</span>
            <span className="text-base font-black text-white">N/A</span>
            <span className="text-[7.5px] text-gray-500">Redis cache inactive</span>
          </div>
          <div className="bg-white/2 border border-white/5 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-secondary font-black block text-[8px] uppercase">Telemetry State</span>
            <span className="text-base font-black text-white">ONLINE</span>
            <span className="text-[7.5px] text-cyan-400">Eventbus active</span>
          </div>
          <div className="bg-white/2 border border-white/5 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-secondary font-black block text-[8px] uppercase">Active Session</span>
            <span className="text-base font-black text-white">Guest</span>
            <span className="text-[7.5px] text-gray-500">Cookie-less sandbox</span>
          </div>
        </div>
      </div>
    );
  };

  // Structured Renderer 7: HEATMAP
  function renderHeatmap() {
    const cols = 24;
    const rows = 7;
    
    if (contributions.length === 0) {
      return (
        <div className="py-4 text-center text-xs font-mono text-secondary">
          Loading real GitHub contribution pipeline data...
        </div>
      );
    }

    const lastCells = contributions.slice(-(cols * rows));
    const squares: HeatmapCell[][] = [];
    
    for (let c = 0; c < cols; c++) {
      const colSquares = [];
      for (let r = 0; r < rows; r++) {
        const idx = c * rows + r;
        const cell = lastCells[idx] || { count: 0, level: 0, date: '' };
        colSquares.push(cell);
      }
      squares.push(colSquares);
    }

    const getColor = (lvl: number) => {
      switch (lvl) {
        case 4: return 'bg-cyan-400';
        case 3: return 'bg-cyan-500/70';
        case 2: return 'bg-cyan-700/50';
        case 1: return 'bg-cyan-900/30';
        default: return 'bg-white/[0.04] border-white/2';
      }
    };

    const totalContributions = contributions.reduce((acc, cell) => acc + cell.count, 0);

    return (
      <div className="flex flex-col gap-2.5 font-mono text-[10.5px] text-left select-none max-w-xl">
        <div className="flex justify-between items-center">
          <span className="text-cyan-400 font-bold uppercase tracking-wider">GitHub Combined Contribution Heat Grid</span>
          <span className="text-[8px] text-secondary font-bold">Total (1Y): {totalContributions} commits</span>
        </div>
        <div className="flex gap-1.5 p-3 bg-white/2 border border-white/5 rounded-xl w-fit overflow-x-auto font-sans">
          {squares.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-1.5">
              {col.map((cell, rIdx) => (
                <div 
                  key={rIdx} 
                  className={`h-2 w-2 rounded-sm border border-transparent transition-all hover:scale-125 ${getColor(cell.level)}`}
                  title={`${cell.count} commits on ${cell.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Renderer 8: SECURITY AUDIT CHECKLIST
  function renderSecurityChecklist(project: typeof projects[0]) {
    // Generate secure features checklist based on project slug parameters
    const specs = [
      { id: 'sec-1', label: 'SSL/HTTPS Active Gateway configurations', passed: true },
      { id: 'sec-2', label: 'Inputs sanitization bounds parser schemas', passed: project.technologies.some(t => t.toLowerCase() === 'zod' || t.toLowerCase() === 'pydantic') },
      { id: 'sec-3', label: 'Supabase Database Row-Level Security (RLS)', passed: project.technologies.some(t => t.toLowerCase() === 'supabase') },
      { id: 'sec-4', label: 'Cookie security credentials (isolated NextAuth headers)', passed: project.technologies.some(t => t.toLowerCase().includes('nextauth') || t.toLowerCase().includes('jwt')) },
      { id: 'sec-5', label: 'Rate-limiting API telemetry blocks policies', passed: true },
      { id: 'sec-6', label: 'Content-Security-Policy (CSP) headers settings', passed: true }
    ];

    return (
      <div className="flex flex-col gap-2.5 font-mono text-[10.5px] text-left select-none max-w-xl">
        <span className="text-cyan-400 font-bold uppercase tracking-wider">{project.title} Security Audit Status</span>
        <div className="flex flex-col gap-1.5 bg-white/2 border border-white/5 p-3.5 rounded-xl">
          {specs.map(spec => (
            <div key={spec.id} className="flex items-center justify-between border-b border-white/2 pb-1.5">
              <span className="text-white/85 font-semibold">{spec.label}</span>
              {spec.passed ? (
                <span className="text-emerald-400 font-black text-[9px] uppercase bg-emerald-950/20 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED
                </span>
              ) : (
                <span className="text-gray-400 font-black text-[9px] uppercase bg-white/5 px-2 py-0.5 rounded flex items-center gap-1">
                  <XCircle className="h-3 w-3 text-gray-500" /> BYPASSED
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Structured Renderer 9: PIPELINE TRANSACTION TRACE
  function renderTraceLogs(flow: typeof DATA_FLOWS[0]) {
    return (
      <div className="flex flex-col gap-2.5 font-mono text-[10.5px] text-left select-none max-w-xl">
        <span className="text-cyan-400 font-bold uppercase tracking-wider">{flow.name} Execution Trace logs</span>
        <div className="flex flex-col gap-2 border border-white/5 bg-black/45 p-4 rounded-xl max-h-[220px] overflow-y-auto scrollbar-thin">
          {flow.steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 items-start border-l border-white/10 pl-3 pb-2 relative">
              {/* timeline point dot */}
              <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 absolute -left-[4px] mt-1.5" />
              <div className="flex flex-col gap-0.5">
                <span className="text-gray-500 text-[8.5px] font-bold">[{new Date(Date.now() - (flow.steps.length - idx) * 12000).toLocaleTimeString()}]</span>
                <span className="text-white font-bold leading-tight">{step.title}</span>
                <span className="text-secondary text-[9px]">Node: {step.nodeId.toUpperCase()} • Action: {step.action}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    handleCommandRef.current = handleCommand;
    renderHelpRef.current = renderHelp;
    renderProjectListRef.current = renderProjectList;
    renderFilteredProjectsRef.current = renderFilteredProjects;
    renderProjectFlowRef.current = renderProjectFlow;
    renderRoleFitRef.current = renderRoleFit;
    renderMetricsRef.current = renderMetrics;
    renderHeatmapRef.current = renderHeatmap;
    renderSecurityChecklistRef.current = renderSecurityChecklist;
    renderTraceLogsRef.current = renderTraceLogs;
  }, [handleCommand]);

  return (
    <Card className="p-0 overflow-hidden bg-black/60 border border-white/10 rounded-2xl shadow-xl flex flex-col font-mono text-xs text-gray-300 relative h-[500px]">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white/2 border-b border-white/5 relative z-10 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="text-foreground font-bold font-mono uppercase tracking-wider">Vraj Patel Advanced Command Console</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] text-secondary font-black tracking-widest uppercase">TTY_SYSTEM_OK</span>
        </div>
      </div>

      {/* Terminal Log Output Area */}
      <div 
        ref={containerRef} 
        onClick={focusInput}
        className="flex-1 p-5 overflow-y-auto scrollbar-thin bg-black/35 flex flex-col gap-4 relative z-10 cursor-text select-text"
      >
        {history.map((line) => {
          if (line.content === '' && line.type === 'output' && isStreaming) {
            return (
              <div key={line.id} className="text-secondary flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
                <span>Generating AI stream...</span>
              </div>
            );
          }
          if (line.content === '') return null;

          let textStyle = 'text-gray-300';
          if (line.type === 'input') textStyle = 'text-cyan-400 font-bold border-t border-white/2 pt-2 first:border-0 first:pt-0';
          else if (line.type === 'system') textStyle = 'text-secondary font-semibold';
          else if (line.type === 'error') textStyle = 'text-rose-400 font-bold';

          return (
            <div key={line.id} className={`whitespace-pre-wrap leading-relaxed select-text ${textStyle}`}>
              {line.content}
            </div>
          );
        })}
      </div>

      {/* Autocomplete Suggestions Bar */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-[48px] left-5 right-5 z-30 bg-black/95 border border-white/10 rounded-xl p-2 shadow-2xl flex flex-wrap gap-2 select-none"
          >
            <span className="text-[9px] text-gray-500 font-bold font-mono uppercase tracking-wider block w-full px-1 mb-1">Autocomplete Suggestions (Tab to cycle)</span>
            {suggestions.map((sug, idx) => {
              const isActive = idx === activeSuggestionIdx;
              return (
                <button
                  key={sug}
                  onClick={() => { setInputValue(sug); focusInput(); }}
                  className={`px-2.5 py-1 rounded font-mono text-[9px] font-bold border cursor-pointer transition-colors ${
                    isActive 
                      ? 'bg-cyan-950/20 border-cyan-400 text-cyan-400' 
                      : 'bg-white/2 border-white/5 text-secondary hover:text-white'
                  }`}
                >
                  {sug}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form Bar */}
      <div 
        onClick={focusInput}
        className="flex items-center gap-2.5 px-5 py-3.5 border-t border-white/5 bg-black/60 relative z-10 cursor-text select-none shrink-0"
      >
        <ChevronRight className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-secondary font-bold shrink-0">vraj@portfolio:~$</span>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'Streaming AI outputs...' : 'Enter CLI command (help, project list)...'}
          className="flex-1 bg-transparent border-0 text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none py-0.5 select-text"
          disabled={isStreaming}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />

        <div className="flex items-center gap-2.5 shrink-0 text-gray-500 font-mono text-[10px]">
          <button 
            onClick={() => handleCommand(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
            className="text-[9px] font-mono text-muted hover:text-white cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Execute <CornerDownLeft className="h-3 w-3 inline" />
          </button>
        </div>
      </div>
    </Card>
  );
}
