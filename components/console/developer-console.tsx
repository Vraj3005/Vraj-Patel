'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { EventBus } from '@/lib/events/event-bus';
import { LiveEventMessage } from '@/types/advanced';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import {
  Terminal,
  Search,
  Pause,
  Play,
  Trash2,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Cpu,
  Database,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Activity,
  Clock
} from 'lucide-react';

interface DeveloperConsoleProps {
  adminMode?: boolean;
}

export default function DeveloperConsole({ adminMode = false }: DeveloperConsoleProps) {
  const [logs, setLogs] = useState<LiveEventMessage[]>([]);
  const [pausedQueue, setPausedQueue] = useState<LiveEventMessage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const receivedIds = useRef<Set<string>>(new Set());

  // 1. Fetch initial logs from database/JSON gateway
  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/telemetry/log?limit=150`);
      if (!res.ok) throw new Error('Failed to retrieve operations telemetry.');
      const payload = await res.json();
      
      const initialLogs: LiveEventMessage[] = payload.data || [];
      
      // Deduplicate and record initial event IDs
      initialLogs.forEach((log) => {
        receivedIds.current.add(log.id);
      });
      
      setLogs(initialLogs);
    } catch (err) {
      console.error('Error seeding initial telemetry logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Hook local EventBus + Supabase Realtime subscriptions
  useEffect(() => {
    fetchLogs();

    // Handler to process incoming events
    const handleNewEvent = (newEvent: LiveEventMessage) => {
      // Prevent duplication (if already received via Realtime or EventBus)
      if (receivedIds.current.has(newEvent.id)) return;
      receivedIds.current.add(newEvent.id);

      // Verify privacy controls (RLS simulation for offline modes)
      if (!adminMode && newEvent.is_public === false) {
        return;
      }

      if (isPaused) {
        setPausedQueue((prev) => [...prev, newEvent]);
      } else {
        setLogs((prev) => {
          const next = [...prev, newEvent];
          return next.slice(-200); // Cap buffer
        });
      }
    };

    // Sub A: Local EventBus subscription
    const unsubscribeBus = EventBus.subscribe((newEvent) => {
      handleNewEvent(newEvent);
    });

    // Sub B: Supabase Realtime postgres_changes subscription
    let realtimeChannel: any = null;

    if (isSupabaseConfigured) {
      try {
        const supabaseClient = supabase as any;
        realtimeChannel = supabaseClient
          .channel('public:system_events')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'system_events',
            },
            (payload: any) => {
              const row = payload.new;
              if (row) {
                const event: LiveEventMessage = {
                  id: row.id,
                  timestamp: row.created_at,
                  type: row.event_type as any,
                  severity: row.severity as any,
                  message: row.message,
                  metadata: row.metadata,
                  is_public: row.is_public,
                };
                handleNewEvent(event);
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Failed to initialize Supabase Realtime telemetry channel:', err);
      }
    }

    return () => {
      unsubscribeBus();
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [fetchLogs, isPaused, adminMode]);

  // Scroll console view to bottom on new logs (only if live)
  useEffect(() => {
    if (!isPaused && !isLoading) {
      consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isPaused, isLoading]);

  // Clean log buffer
  const handleClearLogs = () => {
    setLogs([]);
    setPausedQueue([]);
    receivedIds.current.clear();
  };

  // Toggle Pause/Resume
  const handleTogglePause = () => {
    if (isPaused) {
      // Releasing paused events queue into main logs stream
      if (pausedQueue.length > 0) {
        setLogs((prev) => {
          const next = [...prev, ...pausedQueue];
          return next.slice(-200);
        });
        setPausedQueue([]);
      }
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  // Toggle expanded details
  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 3. Filtering Log Pipeline
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Text Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesMsg = log.message.toLowerCase().includes(query);
        const matchesMeta = log.metadata ? JSON.stringify(log.metadata).toLowerCase().includes(query) : false;
        const matchesType = log.type.toLowerCase().includes(query);
        const matchesSev = log.severity.toLowerCase().includes(query);
        if (!matchesMsg && !matchesMeta && !matchesType && !matchesSev) return false;
      }

      // Source Filter
      if (filterSource !== 'all' && log.type !== filterSource) return false;

      // Severity Filter
      if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;

      return true;
    });
  }, [logs, searchQuery, filterSource, filterSeverity]);

  // 4. Counts Aggregations (for Metrics Pills widgets)
  const statsCounts = useMemo(() => {
    const sourceCounts: Record<string, number> = {
      portfolio: 0,
      'ask-vraj': 0,
      contact: 0,
      metrics: 0,
      'github-sync': 0,
      cli: 0,
      analytics: 0,
      admin: 0
    };

    const severityCounts: Record<string, number> = {
      info: 0,
      success: 0,
      warning: 0,
      error: 0,
      trace: 0
    };

    logs.forEach((log) => {
      if (sourceCounts[log.type] !== undefined) {
        sourceCounts[log.type]++;
      }
      if (severityCounts[log.severity] !== undefined) {
        severityCounts[log.severity]++;
      }
    });

    return { sourceCounts, severityCounts };
  }, [logs]);

  // Helper styles mappings
  const getSeverityBadge = (severity: LiveEventMessage['severity']) => {
    switch (severity) {
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'error':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'trace':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityIcon = (severity: LiveEventMessage['severity']) => {
    switch (severity) {
      case 'success':
        return <CheckCircle className="h-3 w-3 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 shrink-0" />;
      case 'error':
        return <XCircle className="h-3 w-3 shrink-0" />;
      case 'trace':
        return <Activity className="h-3 w-3 shrink-0" />;
      default:
        return <Info className="h-3 w-3 shrink-0" />;
    }
  };

  const getSourceStyle = (type: LiveEventMessage['type']) => {
    switch (type) {
      case 'portfolio':
        return 'text-sky-300 bg-sky-500/10 border-sky-500/25';
      case 'ask-vraj':
        return 'text-violet-300 bg-violet-500/10 border-violet-500/25';
      case 'contact':
        return 'text-teal-300 bg-teal-500/10 border-teal-500/25';
      case 'metrics':
        return 'text-pink-300 bg-pink-500/10 border-pink-500/25';
      case 'github-sync':
        return 'text-orange-300 bg-orange-500/10 border-orange-500/25';
      case 'cli':
        return 'text-lime-300 bg-lime-500/10 border-lime-500/25';
      case 'analytics':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/25';
      case 'admin':
        return 'text-red-300 bg-red-500/10 border-red-500/25';
      default:
        return 'text-gray-300 bg-gray-500/10 border-gray-500/25';
    }
  };

  // JSON pretty syntax highlighter
  const renderPrettyJson = (data: Record<string, any>) => {
    const jsonStr = JSON.stringify(data, null, 2);
    return (
      <pre className="text-[10px] leading-relaxed font-mono whitespace-pre-wrap select-text text-white/80 p-3 bg-black/40 border border-white/5 rounded-lg overflow-x-auto">
        {jsonStr.split('\n').map((line, i) => {
          // Color code brackets, keys, string values, booleans
          let coloredLine = <span key={i}>{line}</span>;
          if (line.includes('":')) {
            const parts = line.split('":');
            const key = parts[0] + '"';
            const val = parts[1];
            
            let valColor = 'text-cyan-300';
            if (val.includes('true') || val.includes('false')) {
              valColor = 'text-amber-400';
            } else if (!isNaN(parseFloat(val.trim().replace(',', '')))) {
              valColor = 'text-purple-400';
            } else if (val.includes('null')) {
              valColor = 'text-red-400';
            }
            
            coloredLine = (
              <span key={i}>
                <span className="text-sky-300">{key}</span>:
                <span className={valColor}>{val}</span>
              </span>
            );
          }
          return (
            <span key={i} className="block">
              {coloredLine}
            </span>
          );
        })}
      </pre>
    );
  };

  return (
    <Card className="p-0 overflow-hidden bg-black/70 border-white/10 rounded-2xl shadow-2xl relative min-h-[500px] flex flex-col font-mono text-xs text-gray-300">
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-white/5 bg-white/2 relative z-10 p-4 gap-4 select-none">
        
        {/* Pulsing state node name */}
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-foreground font-bold font-mono uppercase tracking-wider text-[11px]">
            Live Operations Desk
          </span>
          <div className="flex items-center gap-1.5 ml-2 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            <span className={`h-1.5 w-1.5 rounded-full ${isPaused ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-ping'}`} />
            <span className="text-[9px] font-bold text-secondary tracking-widest uppercase">
              {isPaused ? 'PAUSED' : 'LIVE'}
            </span>
          </div>
          {adminMode && (
            <Badge variant="outline" className="text-[7.5px] border-red-500/25 bg-red-500/5 text-red-400 py-0 uppercase font-black tracking-widest shrink-0">
              Admin Mode
            </Badge>
          )}
        </div>

        {/* Actions Controls panel */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative shrink-0 w-full sm:w-44">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
              <Search className="h-3 w-3" />
            </div>
            <input
              type="text"
              placeholder="Search logs metadata..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-[30px] pr-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-foreground font-bold font-mono focus:border-cyan-500/50 outline-none transition-colors placeholder:text-gray-600"
            />
          </div>

          {/* Filter Source Dropdown */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-[10px] text-foreground font-bold font-mono px-2 py-1 outline-none focus:border-cyan-500/50 cursor-pointer w-28 shrink-0"
          >
            <option value="all">ALL SOURCES</option>
            <option value="portfolio">PORTFOLIO</option>
            <option value="ask-vraj">ASK-VRAJ AI</option>
            <option value="contact">CONTACT FORM</option>
            <option value="cli">TERMINAL CLI</option>
            <option value="metrics">METRICS TRACE</option>
            <option value="github-sync">GITHUB SYNC</option>
            <option value="analytics">ANALYTICS</option>
            {adminMode && <option value="admin">ADMIN CONTROL</option>}
          </select>

          {/* Filter Severity Dropdown */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg text-[10px] text-foreground font-bold font-mono px-2 py-1 outline-none focus:border-cyan-500/50 cursor-pointer w-28 shrink-0"
          >
            <option value="all">ALL SEVERITIES</option>
            <option value="info">INFO</option>
            <option value="success">SUCCESS</option>
            <option value="warning">WARNING</option>
            <option value="error">ERROR</option>
            <option value="trace">TRACE</option>
          </select>

          {/* Pause/Resume stream button */}
          <button
            onClick={handleTogglePause}
            className={`p-1.5 rounded-lg border cursor-pointer transition-all flex items-center justify-center gap-1 text-[10px] font-bold ${
              isPaused
                ? 'border-yellow-500/20 bg-yellow-500/5 text-yellow-500 hover:bg-yellow-500/10'
                : 'border-white/10 hover:border-white/20 text-secondary hover:text-foreground hover:bg-white/5'
            }`}
            title={isPaused ? 'Resume stream' : 'Pause stream'}
          >
            {isPaused ? (
              <>
                <Play className="h-3 w-3" />
                {pausedQueue.length > 0 && (
                  <span className="bg-yellow-500 text-black text-[8px] font-black px-1 rounded-full animate-bounce">
                    +{pausedQueue.length}
                  </span>
                )}
              </>
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>

          {/* Clear log buffer button */}
          <button
            onClick={handleClearLogs}
            className="p-1.5 text-secondary hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg hover:bg-red-500/5 cursor-pointer flex items-center justify-center"
            title="Wipe screen buffer"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 2. Interactive Aggregate Summary Metrics Pills */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-2.5 bg-black/30 border-b border-white/5 relative z-10 text-[9px] overflow-x-auto select-none no-scrollbar shrink-0">
        <span className="text-secondary font-black flex items-center gap-1 uppercase tracking-wider text-[8px] mr-1">
          <Filter className="h-2.5 w-2.5" /> Quick filters:
        </span>
        
        {/* Source count pills */}
        {Object.entries(statsCounts.sourceCounts)
          .filter(([_, count]) => count > 0)
          .map(([source, count]) => {
            const isSelected = filterSource === source;
            return (
              <button
                key={source}
                onClick={() => setFilterSource(isSelected ? 'all' : source)}
                className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-white/2 border-white/5 text-secondary hover:text-foreground hover:bg-white/5'
                }`}
              >
                {source.toUpperCase()}: <span className="text-white">{count}</span>
              </button>
            );
          })}

        {/* Severity count pills */}
        {Object.entries(statsCounts.severityCounts)
          .filter(([_, count]) => count > 0)
          .map(([sev, count]) => {
            const isSelected = filterSeverity === sev;
            return (
              <button
                key={sev}
                onClick={() => setFilterSeverity(isSelected ? 'all' : sev)}
                className={`px-2 py-0.5 rounded-full border transition-all cursor-pointer font-bold ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-white/2 border-white/5 text-secondary hover:text-foreground hover:bg-white/5'
                }`}
              >
                {sev.toUpperCase()}: <span className="text-white">{count}</span>
              </button>
            );
          })}

        {(filterSource !== 'all' || filterSeverity !== 'all' || searchQuery !== '') && (
          <button
            onClick={() => {
              setFilterSource('all');
              setFilterSeverity('all');
              setSearchQuery('');
            }}
            className="text-cyan-400 hover:text-cyan-300 font-bold ml-auto hover:underline cursor-pointer tracking-wider"
          >
            RESET
          </button>
        )}
      </div>

      {/* 3. Logs Feed Stream */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[500px] min-h-[350px] scrollbar-thin flex flex-col gap-2.5 relative z-10 bg-black/40">
        {isLoading ? (
          <div className="h-full flex-1 flex flex-col items-center justify-center text-secondary py-24 gap-3">
            <RefreshCw className="h-6 w-6 text-cyan-400 animate-spin" />
            <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-secondary">
              Establishing telemetry channel connections...
            </span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="h-full flex-1 flex flex-col items-center justify-center text-secondary py-24 gap-2 border border-dashed border-white/5 rounded-2xl bg-black/20">
            <AlertCircle className="h-5 w-5 text-secondary animate-pulse" />
            <span className="font-bold text-[10px] uppercase tracking-wider text-secondary">
              No telemetry events cataloged in current view.
            </span>
            <p className="text-[9px] text-gray-600 font-semibold max-w-xs text-center leading-relaxed">
              Log events populate automatically as you browse the portfolio pages, interact with CLI command shell, or test form submissions.
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedIds.has(log.id);
            const formattedTime = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
            const formattedDate = new Date(log.timestamp).toLocaleDateString([], {
              month: 'short',
              day: 'numeric'
            });

            return (
              <div
                key={log.id}
                className="flex flex-col border border-white/5 bg-black/20 rounded-xl overflow-hidden hover:border-white/10 hover:bg-white/[0.01] transition-all"
              >
                {/* Log Row Header */}
                <div
                  onClick={() => handleToggleExpand(log.id)}
                  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 px-4 py-3 cursor-pointer select-none"
                >
                  {/* Metadata block (Chevron + Time + Source + Severity) */}
                  <div className="flex items-center flex-wrap gap-2 shrink-0 select-none">
                    {/* Expand Chevron */}
                    <div className="text-secondary shrink-0">
                      {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </div>

                    {/* Timestamp */}
                    <span className="text-[10px] text-gray-500 tracking-wider shrink-0 select-none">
                      [{formattedDate} {formattedTime}]
                    </span>

                    {/* Source Badge */}
                    <Badge variant="outline" className={`text-[8.5px] uppercase font-bold tracking-wider py-0 px-2 rounded-md shrink-0 border border-white/5 ${getSourceStyle(log.type)}`}>
                      {log.type}
                    </Badge>

                    {/* Severity Badge */}
                    <Badge variant="outline" className={`text-[8.5px] font-black uppercase tracking-wider py-0.5 px-2 rounded-md shrink-0 border flex items-center gap-1.5 ${getSeverityBadge(log.severity)}`}>
                      {getSeverityIcon(log.severity)}
                      {log.severity}
                    </Badge>
                  </div>

                  {/* Message & Meta Badge block */}
                  <div className="flex items-start gap-2 flex-1 min-w-0 md:ml-1">
                    {/* Message text with wrap/overflow handling */}
                    <span className="text-foreground font-semibold text-[11px] break-words whitespace-pre-wrap flex-1 min-w-0">
                      {log.message}
                    </span>

                    {/* Indicators for metadata */}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <Badge variant="outline" className="text-[7.5px] border-white/5 text-gray-500 py-0 tracking-widest uppercase shrink-0 font-bold bg-white/2 select-none self-center">
                        META
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Log Row Details (Expanded) */}
                {isExpanded && (
                  <div className="px-11 pb-4 pt-1 bg-black/30 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-bold text-secondary uppercase tracking-widest font-mono">
                        Detailed log message
                      </span>
                      <p className="text-[11px] text-white/90 leading-relaxed font-sans select-text">
                        {log.message}
                      </p>
                    </div>

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[8px] font-bold text-secondary uppercase tracking-widest font-mono">
                          Telemetry Metadata context
                        </span>
                        {renderPrettyJson(log.metadata)}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/5 pt-3.5 text-[9px] text-gray-500 select-none">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3.5 w-3.5 text-secondary" /> Trace ID: {log.id}
                      </span>
                      <span className="flex items-center gap-1">
                        <Database className="h-3.5 w-3.5 text-secondary" /> Privacy: {log.is_public === false ? 'Secure/Internal' : 'Public Operational'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-secondary" /> Epoch Time: {new Date(log.timestamp).getTime()}ms
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={consoleEndRef} />
      </div>
    </Card>
  );
}
