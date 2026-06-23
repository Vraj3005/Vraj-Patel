'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { ChevronRight, CornerDownLeft, Terminal } from 'lucide-react';
import { EventBus } from '@/lib/events/event-bus';

interface CommandShellProps {
  onExecuteCommand?: (cmd: string, result: string) => void;
}

export default function CommandShell({ onExecuteCommand }: CommandShellProps) {
  const [history, setHistory] = useState<{ text: string; type: 'input' | 'output' }[]>([
    { text: 'Portfolio system command console initialised.', type: 'output' },
    { text: 'Enter CLI commands (e.g. status, projects, metrics) to probe systems.', type: 'output' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const commandText = inputValue.trim();
    if (!commandText || isEvaluating) return;

    setIsEvaluating(true);
    setHistory((prev) => [...prev, { text: `$ ${commandText}`, type: 'input' }]);
    setInputValue('');

    const startMs = Date.now();
    let output = '';
    let success = true;

    try {
      const lower = commandText.toLowerCase();
      if (lower === 'status') {
        output = 'System status: ONLINE.\nDatabase nodes: 16 connected.\nSecurity parameters: active.';
      } else if (lower === 'projects') {
        output = 'Active project pipelines:\n- OutreachOps AI (AI Automation)\n- Enermass Solar Calculator (ERP)\n- Bhagwati ERP (ERP)\n- Driedhub Marketplace (E-commerce)\n- Marea website (E-commerce)';
      } else if (lower === 'metrics') {
        output = 'Core Telemetry Vitals:\nAvg API response latency: 120ms\nCache hits ratio: 94.2%\nThreat mitigations: active.';
      } else if (lower === 'clear') {
        setHistory([]);
        setIsEvaluating(false);
        return;
      } else {
        output = `command execution failed: "${commandText}" is not defined. Type 'status', 'projects', or 'metrics'.`;
        success = false;
      }

      // Log command execution telemetry asynchronously to Supabase
      const executionTime = Date.now() - startMs;
      const supabaseClient = supabase as any;
      await supabaseClient.from('cli_command_logs').insert({
        command: commandText.split(' ')[0] || 'unknown',
        args: commandText.split(' ').slice(1) || [],
        success,
        execution_time_ms: executionTime
      });

      // Dispatch command event to the Live Operations Console via EventBus
      await EventBus.publish(
        'cli',
        success ? 'success' : 'warning',
        `CLI Command executed: '${commandText}' (duration ${executionTime}ms, success: ${success})`,
        { success, duration: executionTime }
      );

      setHistory((prev) => [...prev, { text: output, type: 'output' }]);

      if (onExecuteCommand) {
        onExecuteCommand(commandText, output);
      }
    } catch (err) {
      console.error('Command terminal execution breakdown:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <Card className="p-0 overflow-hidden bg-black/60 border-white/10 rounded-2xl shadow-xl flex flex-col font-mono text-xs text-gray-300 h-[280px]">
      {/* Title */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-white/2 border-b border-white/5 relative z-10 select-none">
        <Terminal className="h-3.5 w-3.5 text-cyan-400" />
        <span className="text-secondary font-bold font-mono">CLI Command Shell</span>
      </div>

      {/* Terminal logs list */}
      <div ref={containerRef} className="flex-1 p-5 overflow-y-auto scrollbar-thin bg-black/35 flex flex-col gap-2 relative z-10">
        {history.map((line, idx) => (
          <div key={idx} className={line.type === 'input' ? 'text-cyan-400' : 'text-gray-300 whitespace-pre-wrap'}>
            {line.text}
          </div>
        ))}
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleCommandSubmit} className="flex items-center gap-2.5 px-5 py-3 border-t border-white/5 bg-black/50 relative z-10">
        <ChevronRight className="h-3.5 w-3.5 text-secondary shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 bg-transparent border-0 text-white placeholder-muted font-mono text-xs focus:ring-0 focus:outline-none py-0.5"
          disabled={isEvaluating}
        />
        <button type="submit" className="text-[9px] font-mono text-muted hover:text-white cursor-pointer" disabled={isEvaluating}>
          Execute <CornerDownLeft className="h-3 w-3 inline" />
        </button>
      </form>
    </Card>
  );
}
