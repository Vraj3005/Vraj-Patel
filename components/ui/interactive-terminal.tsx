'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CornerDownLeft } from 'lucide-react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'system';
}

export default function InteractiveTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Vraj Patel Systems Shell v1.2', type: 'system' },
    { text: 'Type "help" to view available commands. Use Up/Down arrows for history.', type: 'system' },
    { text: 'Try asking the AI: ask "What client software has Vraj built?"', type: 'system' },
    { text: '', type: 'output' }
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isStreaming, setIsStreaming] = useState(false);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const focusInput = useCallback(() => {
    if (inputRef.current && !isStreaming) {
      inputRef.current.focus();
    }
  }, [isStreaming]);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const handleCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add command to history
    setHistory(prev => [...prev.filter(l => l.text !== ''), { text: `vraj@portfolio:~$ ${trimmed}`, type: 'input' }]);
    setInput('');

    // Append to cmdHistory list
    setCmdHistory(prev => {
      const next = [trimmed, ...prev.filter(h => h !== trimmed)];
      return next.slice(0, 50); // Keep last 50
    });
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commandName === 'clear') {
      setHistory([]);
      return;
    }

    if (commandName === 'help') {
      setHistory(prev => [
        ...prev,
        { text: 'Available commands:', type: 'system' },
        { text: '  whoami             - Display background summary', type: 'output' },
        { text: '  projects --client  - List client software & enterprise ERPs', type: 'output' },
        { text: '  projects --quant   - List quantitative research projects', type: 'output' },
        { text: '  skills --fullstack - Inspect web development competencies', type: 'output' },
        { text: '  skills --ai        - View AI engineering capabilities', type: 'output' },
        { text: '  contact            - Output direct communication coordinates', type: 'output' },
        { text: '  resume             - Open CV & printing utilities', type: 'output' },
        { text: '  ask "<question>"   - Stream Gemini responses about Vraj', type: 'output' },
        { text: '  clear              - Wipe terminal logs screen', type: 'output' },
        { text: '', type: 'output' }
      ]);
      return;
    }

    if (commandName === 'whoami') {
      setHistory(prev => [
        ...prev,
        { text: 'Name: Vraj Patel', type: 'system' },
        { text: 'Role: Full-Stack Architect / Quant Research / AI Automation Engineer', type: 'output' },
        { text: 'Academics: CSE Undergrad (3rd year) at Nirma University | CGPA: 7.98', type: 'output' },
        { text: 'Core Focus: Building performant ERP engines, full-stack SPAs, offline synchronization layers, and volatility calculators.', type: 'output' },
        { text: '', type: 'output' }
      ]);
      return;
    }

    if (commandName === 'projects') {
      const arg = args[0] ? args[0].toLowerCase() : '';
      if (arg === '--client') {
        setHistory(prev => [
          ...prev,
          { text: 'Client Software & Custom ERP platforms (Collaborations):', type: 'system' },
          { text: '1. Enermass Solar Calculator & ERP (Live) - 3D rooftop shading models and materials management.', type: 'output' },
          { text: '2. Bhagwati Interior ERP (Live) - Designer material logs, real-time budgets, and PDF quotation compiler.', type: 'output' },
          { text: '3. Driedhub Marketplace & ERP (Live) - DTC dried fruit marketplace integrated with Razorpay and custom metrics board.', type: 'output' },
          { text: '4. Marea Luxury Fashion & ERP (Live) - Editorial fashion storefront utilizing GSAP scroll triggers and drag-drop admin board.', type: 'output' },
          { text: '5. Surendra & Co. Website (Live) - Coach manufacturer presentation portal with interactive options configuration.', type: 'output' },
          { text: '', type: 'output' }
        ]);
      } else if (arg === '--quant') {
        setHistory(prev => [
          ...prev,
          { text: 'Quantitative Research Implementations:', type: 'system' },
          { text: '1. NF-LRD (Live) - NIFTY 50 latent market regime segments classification. Hidden Markov Models with Numba vectorized optimization (25x speedup).', type: 'output' },
          { text: '2. MSPE (Live) - Volatility smile mesh visualizer. Root-finding Black-Scholes implied volatilities solver written in C++ WebAssembly.', type: 'output' },
          { text: '3. BTC-ALGO (Live) - Bitcoin trend-momentum algorithmic signals execution panel connected to exchange WebSockets feeds.', type: 'output' },
          { text: '', type: 'output' }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { text: 'Error: Invalid arguments. Run "projects --client" or "projects --quant".', type: 'error' },
          { text: '', type: 'output' }
        ]);
      }
      return;
    }

    if (commandName === 'skills') {
      const arg = args[0] ? args[0].toLowerCase() : '';
      if (arg === '--fullstack') {
        setHistory(prev => [
          ...prev,
          { text: 'Full-Stack competency matrix:', type: 'system' },
          { text: '  Languages: TypeScript, JavaScript, Python, Go, C++, SQL', type: 'output' },
          { text: '  Frameworks: Next.js (App Router), React, Node.js, Express, FastAPI, gRPC, Tailwind CSS, Recharts', type: 'output' },
          { text: '  Infrastructure: PostgreSQL, Redis cache layers, Supabase backend databases, MongoDB Atlas, AWS S3/EC2, Docker containerization', type: 'output' },
          { text: '', type: 'output' }
        ]);
      } else if (arg === '--ai') {
        setHistory(prev => [
          ...prev,
          { text: 'AI & Automation tools stack:', type: 'system' },
          { text: '  Models: Gemini Pro/Flash API integration, OpenAI GPT models, Anthropic Claude, custom model embeddings', type: 'output' },
          { text: '  Orchestration: LangChain pipelines, strict Zod schemas for Structured JSON verification, scheduled CRON outreach sequences', type: 'output' },
          { text: '', type: 'output' }
        ]);
      } else {
        setHistory(prev => [
          ...prev,
          { text: 'Error: Invalid arguments. Run "skills --fullstack" or "skills --ai".', type: 'error' },
          { text: '', type: 'output' }
        ]);
      }
      return;
    }

    if (commandName === 'contact') {
      setHistory(prev => [
        ...prev,
        { text: 'Vraj Patel Contacts details:', type: 'system' },
        { text: '  Email:    patelvrajpatel30@gmail.com', type: 'output' },
        { text: '  Phone:    +91 79902 51191', type: 'output' },
        { text: '  Location: Gujarat, India', type: 'output' },
        { text: '  GitHub (Personal): https://github.com/Vraj3005', type: 'output' },
        { text: '  GitHub (Academic): https://github.com/23bce377-debug', type: 'output' },
        { text: '  LinkedIn:          https://www.linkedin.com/in/vraj-patel-9502a6285', type: 'output' },
        { text: '', type: 'output' }
      ]);
      return;
    }

    if (commandName === 'resume') {
      setHistory(prev => [
        ...prev,
        { text: 'Resume Gateway:', type: 'system' },
        { text: '  Interactive CV Route: Navigate to "/resume" page', type: 'output' },
        { text: '  PDF Export: Trigger system print parameters', type: 'output' },
        { text: '', type: 'output' }
      ]);
      return;
    }

    if (commandName === 'ask') {
      // Extract prompt between quotes
      const commandLine = trimmed;
      const firstQuoteIdx = commandLine.indexOf('"');
      const lastQuoteIdx = commandLine.lastIndexOf('"');
      
      let promptText = '';
      if (firstQuoteIdx !== -1 && lastQuoteIdx !== -1 && firstQuoteIdx < lastQuoteIdx) {
        promptText = commandLine.substring(firstQuoteIdx + 1, lastQuoteIdx);
      } else {
        // Fallback to arguments merge
        promptText = args.join(' ');
      }

      if (!promptText.trim()) {
        setHistory(prev => [
          ...prev,
          { text: 'Error: Please provide a question. Usage: ask "What is NF-LRD?"', type: 'error' },
          { text: '', type: 'output' }
        ]);
        return;
      }

      setIsStreaming(true);
      setHistory(prev => [...prev, { text: 'Contacting system telemetry agent...', type: 'system' }]);

      try {
        const response = await fetch('/api/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptText,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to stream response.');
        }

        if (!response.body) {
          throw new Error('No response body returned from stream endpoint.');
        }

        // Initialize streaming line
        setHistory(prev => {
          const base = prev.filter(l => l.text !== 'Contacting system telemetry agent...');
          return [...base, { text: '', type: 'output' }];
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
            
            setHistory(prev => {
              const next = [...prev];
              // Update last line
              next[next.length - 1] = { text: cumulativeText, type: 'output' };
              return next;
            });
          }
        }

        // Add spacer
        setHistory(prev => [...prev, { text: '', type: 'output' }]);

      } catch (err: unknown) {
        console.error('Terminal AI Error:', err);
        const errMessage = err instanceof Error ? err.message : String(err);
        setHistory(prev => {
          const base = prev.filter(l => l.text !== 'Contacting system telemetry agent...');
          return [
            ...base,
            { text: `Error: Stream connection closed unexpectedly. Details: ${errMessage}`, type: 'error' },
            { text: '', type: 'output' }
          ];
        });
      } finally {
        setIsStreaming(false);
      }
      return;
    }

    // Command not found
    setHistory(prev => [
      ...prev,
      { text: `Error: Command "${commandName}" not recognized. Type "help" to check available list.`, type: 'error' },
      { text: '', type: 'output' }
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      
      const nextIdx = historyIndex + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIndex - 1;
      if (nextIdx >= 0) {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="w-full flex-1 flex flex-col font-mono text-[12px] bg-black/45 border border-white/5 rounded-xl p-4 overflow-hidden relative cursor-text min-h-[220px] select-text"
      onClick={focusInput}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 scrollbar-thin max-h-[190px]"
      >
        {history.map((line, idx) => {
          if (line.text === '' && idx === history.length - 1 && isStreaming) {
            return (
              <div key={idx} className="text-secondary flex items-center gap-1.5 animate-pulse">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>Buffering response stream...</span>
              </div>
            );
          }
          if (line.text === '') return null;
          
          let colorClass = 'text-white/75';
          if (line.type === 'input') colorClass = 'text-secondary/90 font-semibold';
          else if (line.type === 'system') colorClass = 'text-cyan-400/90 font-medium';
          else if (line.type === 'error') colorClass = 'text-rose-400/90';

          return (
            <div key={idx} className={`whitespace-pre-wrap leading-relaxed break-words ${colorClass}`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Input prompt */}
      <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/5 no-print shrink-0 relative">
        <span className="text-emerald-500 font-semibold select-none">vraj@portfolio:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          aria-label="Developer Terminal input prompt"
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 text-white select-text"
          placeholder={isStreaming ? 'AI is composing response...' : 'Type commands e.g. whoami, help...'}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {!isStreaming && (
          <button 
            onClick={() => handleCommand(input)}
            disabled={!input.trim()}
            aria-label="Run command"
            className="p-1 border border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5 rounded-md text-muted hover:text-white transition-all cursor-pointer shrink-0"
            title="Execute (Enter)"
          >
            <CornerDownLeft className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}
