'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server } from 'lucide-react';

interface MetricSnapshot {
  time: string;
  value: number;
}

export default function MetricsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [latencyData, setLatencyData] = useState<MetricSnapshot[]>([]);
  const [memoryData, setMemoryData] = useState<MetricSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLatencyDemo, setIsLatencyDemo] = useState(false);
  const [isMemoryDemo, setIsMemoryDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabaseClient = supabase as any;

    const fetchMetrics = async () => {
      try {
        setLoading(true);

        // 1. Fetch latency snapshots
        const { data: latencyRes } = await supabaseClient
          .from('metrics_snapshots')
          .select('created_at, metric_value')
          .eq('metric_name', 'api_latency_ms')
          .order('created_at', { ascending: false })
          .limit(10);

        if (latencyRes && latencyRes.length > 0) {
          const formatted = latencyRes.reverse().map((m: any) => ({
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: Number(m.metric_value)
          }));
          setLatencyData(formatted);
          setIsLatencyDemo(false);
        } else {
          // Fallback static metrics points
          setLatencyData([
            { time: '18:10', value: 110 },
            { time: '18:20', value: 135 },
            { time: '18:30', value: 95 },
            { time: '18:40', value: 120 },
            { time: '18:50', value: 118 }
          ]);
          setIsLatencyDemo(true);
        }

        // 2. Fetch memory allocation snapshots
        const { data: memoryRes } = await supabaseClient
          .from('metrics_snapshots')
          .select('created_at, metric_value')
          .eq('metric_name', 'process_heap_used_mb')
          .order('created_at', { ascending: false })
          .limit(10);

        if (memoryRes && memoryRes.length > 0) {
          const formatted = memoryRes.reverse().map((m: any) => ({
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: Number(m.metric_value)
          }));
          setMemoryData(formatted);
          setIsMemoryDemo(false);
        } else {
          // Fallback static metrics points
          setMemoryData([
            { time: '18:10', value: 42.5 },
            { time: '18:20', value: 43.1 },
            { time: '18:30', value: 41.8 },
            { time: '18:40', value: 45.2 },
            { time: '18:50', value: 44.9 }
          ]);
          setIsMemoryDemo(true);
        }
      } catch (err) {
        console.error('Failed to query metrics snapshots:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-secondary">
        Compiling charts telemetry data models...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* API Latency Chart */}
      <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-card-border pb-3 mb-2 relative z-10">
          <Activity className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">API Response Latency</h3>
          {isLatencyDemo && (
            <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded ml-auto">
              Demo Mode
            </span>
          )}
        </div>
        <div className="w-full h-48 relative z-10">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={latencyData}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} unit="ms" />
              <Tooltip
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '10px' }}
                itemStyle={{ color: '#22d3ee', fontFamily: 'monospace', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#colorLatency)" />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-white/2 rounded-xl animate-pulse" />
          )}
        </div>
      </Card>

      {/* Heap Memory Allocation Chart */}
      <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-card-border pb-3 mb-2 relative z-10">
          <Server className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">Memory Allocation (Heap)</h3>
          {isMemoryDemo && (
            <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded ml-auto">
              Demo Mode
            </span>
          )}
        </div>
        <div className="w-full h-48 relative z-10">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={memoryData}>
              <defs>
                <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} />
              <YAxis stroke="#6b7280" fontSize={10} tickLine={false} unit="MB" />
              <Tooltip
                contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '10px' }}
                itemStyle={{ color: '#3b82f6', fontFamily: 'monospace', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMemory)" />
            </AreaChart>
          </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-white/2 rounded-xl animate-pulse" />
          )}
        </div>
      </Card>
    </div>
  );
}
