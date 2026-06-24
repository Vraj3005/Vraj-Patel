'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal, ChevronRight, CornerDownLeft, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'system';
}

export default function TerminalLogs() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Connecting to security portal: guest@vraj.patel...', type: 'system' },
    { text: 'Auth keys: verified successfully (guest session).', type: 'system' },
    { text: 'System diagnostics core loaded. Type "help" for a list of shell commands.', type: 'system' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Evaluate shell queries
  const handleEvaluateCommand = (commandText: string) => {
    const trimmed = commandText.trim().toLowerCase();
    if (!trimmed) return;

    const newLines: TerminalLine[] = [{ text: `$ ${commandText}`, type: 'input' }];

    switch (trimmed) {
      case 'help':
        newLines.push({
          text: 'Supported system shell utilities:\n- about    : General bio summary & Nirma credentials\n- skills   : Technical skill matrix details\n- projects : Summary of the 10 production projects\n- contact  : Direct mailbox addresses\n- clear    : Clear console outputs',
          type: 'output',
        });
        break;
      case 'about':
        newLines.push({
          text: 'Candidate: Vraj Patel\nPosition: Full-Stack Architect / Quant Dev\nEducation: B.Tech CSE (3rd Year), Nirma University\nCGPA: 7.98/10.0\nBio: Custom ERP systems developer, options volatility smile modeling, and LLM automation scripts builder.',
          type: 'output',
        });
        break;
      case 'skills':
        newLines.push({
          text: 'Core technology competencies:\n- Languages : TypeScript, JavaScript, Python, SQL\n- Front-end : Next.js, React, Tailwind, Framer Motion, Three.js\n- Back-end  : Node.js, Express, FastAPI, REST APIs\n- Databases : PostgreSQL, Supabase, MongoDB Atlas\n- AI/Quant  : Gemini SDK, Black-Scholes Greek modeling',
          type: 'output',
        });
        break;
      case 'projects':
        newLines.push({
          text: 'Production Cases Shipped:\n1. OutreachOps AI (Autonomous B2B outbound campaign SaaS)\n2. Enermass Solar Calculator (Fast mathematical tilt & shading model)\n3. NF-LRD Quant regime switches classifier (Hidden Markov Models)\n4. MSPE implied option volatility smile visualizer (3D Plotly rendering)\n5. Driedhub Marketplace (DTC e-commerce & Razorpay payments)\nVisit the "/projects" tab for full technical analyses.',
          type: 'output',
        });
        break;
      case 'contact':
        newLines.push({
          text: 'Communication routes active:\n- Primary Mailbox: contact@vraj.io\n- Direct Message : Navigate to the "/contact" form to send a pipeline lead.\n- AI Agent Helper: Challenge my Gemini Flash bot in the "/ask-vraj" portal.',
          type: 'output',
        });
        break;
      case 'clear':
        setHistory([]);
        setInputValue('');
        return;
      default:
        newLines.push({
          text: `bash: command not found: "${commandText}". Type "help" to view options.`,
          type: 'output',
        });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputValue('');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 p-0 bg-black/50 border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/2 border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="text-xs text-muted font-mono ml-4 flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-primary" /> guest@vraj-portfolio-shell.sys
          </span>
        </div>
        <div className="text-[10px] text-muted font-bold font-mono uppercase tracking-wide">
          Interactive CLI
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="p-6 h-72 overflow-y-auto font-mono text-xs md:text-sm text-gray-300 flex flex-col gap-2.5 scrollbar-thin bg-black/30 relative z-10">
        {history.map((line, idx) => {
          if (line.type === 'input') {
            return (
              <div key={idx} className="flex items-center gap-2 text-white font-bold">
                <ChevronRight className="h-4 w-4 text-secondary shrink-0" />
                <span>{line.text}</span>
              </div>
            );
          }
          if (line.type === 'system') {
            return (
              <div key={idx} className="text-primary font-medium opacity-80 leading-relaxed">
                {line.text}
              </div>
            );
          }
          return (
            <div key={idx} className="text-gray-400 whitespace-pre-wrap leading-relaxed border-l border-white/5 pl-3">
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Suggested commands shortcut buttons */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/2 flex flex-wrap gap-2 items-center relative z-10">
        <span className="text-[9px] text-muted font-bold uppercase tracking-wider">Quick Commands:</span>
        {['help', 'about', 'skills', 'projects', 'contact'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleEvaluateCommand(cmd)}
            className="px-2.5 py-1 text-[10px] font-mono text-gray-300 hover:text-white bg-white/5 border border-white/8 rounded-md hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Play className="h-2 w-2 text-accent" /> {cmd}
          </button>
        ))}
      </div>

      {/* Command Input line */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleEvaluateCommand(inputValue);
        }}
        className="flex items-center gap-2.5 px-6 py-4 border-t border-white/5 bg-black/40 relative z-10"
      >
        <ChevronRight className="h-4 w-4 text-secondary shrink-0" />
        <input
          type="text"
          placeholder="Type command (e.g. skills)..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 bg-transparent border-0 text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none py-1"
        />
        <button
          type="submit"
          className="text-[9px] font-mono text-muted flex items-center gap-1 bg-white/3 border border-white/5 px-2.5 py-1 rounded-md hover:text-white cursor-pointer"
        >
          Execute <CornerDownLeft className="h-3 w-3" />
        </button>
      </form>
    </Card>
  );
}
