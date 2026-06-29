'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VisualNode, VisualEdge } from '@/types/advanced';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, Layout, Server, Cpu, Database, Network, ShieldCheck, 
  CheckCircle, Activity, Terminal, Globe, Info, Zap, AlertCircle, HelpCircle
} from 'lucide-react';
import { getErrorMessage } from '@/lib/utils';

interface SystemVisualizerProps {
  projectSlug?: string;
  allowProjectSwitching?: boolean;
}

const PROJECT_LIST = [
  { slug: 'solar-sizing-calculator', name: 'Solar Sizing Calculator & ERP' },
  { slug: 'outreachops-ai', name: 'OutreachOps AI (AI Coldmail)' },
  { slug: 'interior-design-erp', name: 'Interior Design ERP' },
  { slug: 'anjeer-marketplace', name: 'Afghan Anjeer Marketplace' },
  { slug: 'anjeer-admin-dashboard', name: 'Afghan Anjeer Marketplace Admin ERP' },
  { slug: 'clothing-brand-website', name: 'Clothing Brand Storefront' },
  { slug: 'clothing-brand-admin', name: 'Clothing Brand Admin ERP' },
  { slug: 'bus-body-builder-website', name: 'Bus Body Builder Bus Body Website' },
  { slug: 'mspe-volatility-engine', name: 'MSPE Volatility Engine' },
  { slug: 'nf-lrd-regime-discovery', name: 'NF-LRD Regime Discovery' },
  { slug: 'btc-algo-trading', name: 'BTC-ALGO Trading Board' },
  { slug: 'ask-vraj', name: 'Ask Vraj AI Assistant' }
];

export default function SystemVisualizer({ 
  projectSlug = 'solar-sizing-calculator', 
  allowProjectSwitching = false 
}: SystemVisualizerProps) {
  const [activeProject, setActiveProject] = useState(projectSlug);
  const [layer, setLayer] = useState<'overview' | 'technical' | 'recruiter'>('overview');
  const [nodes, setNodes] = useState<VisualNode[]>([]);
  const [edges, setEdges] = useState<VisualEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<VisualEdge | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync state if prop changes
  useEffect(() => {
    if (projectSlug) {
      setActiveProject(projectSlug);
    }
  }, [projectSlug]);

  // Fetch nodes/edges data dynamically from server-side API proxy
  useEffect(() => {
    const fetchGraphData = async () => {
      setLoading(true);
      setError(null);
      setSelectedNode(null);
      setSelectedEdge(null);
      
      try {
        const response = await fetch(`/api/visualizer?slug=${activeProject}&layer=${layer}`);
        if (!response.ok) {
          throw new Error(`Server returned error status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err: unknown) {
        console.error('Failed to load system architecture data map:', err);
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [activeProject, layer]);

  const getNodeIcon = (type: VisualNode['type']) => {
    switch (type) {
      case 'user': return <User className="h-3.5 w-3.5 text-sky-400" />;
      case 'frontend': return <Layout className="h-3.5 w-3.5 text-cyan-400" />;
      case 'backend': return <Server className="h-3.5 w-3.5 text-emerald-400" />;
      case 'api': return <Server className="h-3.5 w-3.5 text-teal-400" />;
      case 'validation': return <CheckCircle className="h-3.5 w-3.5 text-amber-500" />;
      case 'auth': return <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />;
      case 'database': return <Database className="h-3.5 w-3.5 text-blue-400" />;
      case 'ai': return <Cpu className="h-3.5 w-3.5 text-fuchsia-400" />;
      case 'analytics': return <Activity className="h-3.5 w-3.5 text-orange-500" />;
      case 'admin': return <Terminal className="h-3.5 w-3.5 text-rose-500" />;
      case 'external': return <Globe className="h-3.5 w-3.5 text-gray-400" />;
      default: return <Info className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const getEdgeAnimationClass = (edge: VisualEdge) => {
    if (!edge.animated) return '';
    if (edge.flowSpeed === 'fast') return 'flow-animated flow-fast';
    if (edge.flowSpeed === 'slow') return 'flow-animated flow-slow';
    return 'flow-animated';
  };

  // Determine if a node/edge is currently highlighted
  const isNodeDimmed = (nodeId: string) => {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId) return false;
    // Check if connected
    return !edges.some(e => 
      (e.source === hoveredNode && e.target === nodeId) ||
      (e.target === hoveredNode && e.source === nodeId)
    );
  };

  const isEdgeHighlighted = (edge: VisualEdge) => {
    if (selectedEdge?.id === edge.id) return true;
    if (!hoveredNode) return false;
    return edge.source === hoveredNode || edge.target === hoveredNode;
  };

  const getConnectedEdgesCount = (nodeId: string) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId).length;
  };

  return (
    <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-5 w-full">
      {/* Dynamic inline styles for SVG animated particle flows */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowParticles {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        .flow-animated {
          stroke-dasharray: 6, 6;
          animation: flowParticles 1.2s linear infinite;
        }
        .flow-slow {
          animation-duration: 2.5s;
        }
        .flow-fast {
          animation-duration: 0.6s;
        }
      `}} />

      {/* Header Controllers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-card-border pb-4 gap-3 z-10">
        <div className="flex flex-col gap-1 select-none">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2">
            <Network className="h-[18px] w-[18px] text-cyan-400 animate-pulse" /> Systems Architect Mapping
          </h3>
          <span className="text-[10px] font-mono text-secondary">
            Visualize technical nodes and data flow pipelines
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* Optional Project Switcher */}
          {(allowProjectSwitching || !projectSlug) && (
            <select
              value={activeProject}
              onChange={(e) => setActiveProject(e.target.value)}
              className="bg-card-bg border border-card-border text-white font-mono text-[10px] font-bold py-1.5 px-3 rounded-lg focus:outline-none focus:border-white/20 cursor-pointer"
            >
              {PROJECT_LIST.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name.replace(' & ERP', '').replace(' Signals Board', '').replace(' Discovery', '')}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Graph Content */}
      <div className="w-full relative min-h-[350px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 py-20 text-xs font-mono text-secondary">
            <div className="h-5 w-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Resolving coordinate matrices matrices...</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-2.5 text-center py-20">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <span className="text-xs font-mono text-rose-400 font-semibold">{error}</span>
            <button 
              onClick={() => setLayer(layer)} 
              className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/20 px-3 py-1 rounded hover:bg-cyan-900/30 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : nodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center py-20 text-xs font-mono text-secondary">
            No system nodes defined for this configuration.
          </div>
        ) : (
          <div className="flex flex-col gap-5 w-full">
            {/* Desktop Graphical SVG View */}
            <div className="hidden md:block w-full aspect-[8/5] relative border border-card-border rounded-xl bg-black/45 overflow-hidden" ref={canvasRef}>
              <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
              
              {/* Legend overlay */}
              <div className="absolute top-3 left-3 bg-black/60 border border-card-border p-2.5 rounded-lg flex flex-col gap-1.5 text-[8px] font-mono text-secondary z-20 pointer-events-none select-none">
                <span className="text-foreground font-bold border-b border-card-border pb-1 mb-0.5">LEGEND KEY</span>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-400" /> <span>User Client</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-cyan-400" /> <span>Frontend UI</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> <span>Server / API</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> <span>AI / Model</span></div>
                <div className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-blue-400" /> <span>Database</span></div>
              </div>

              {/* Edge/Connection Lines Canvas */}
              <svg viewBox="0 0 800 500" className="absolute inset-0 w-full h-full pointer-events-none select-none z-10">
                <defs>
                  <linearGradient id="edgeGradDefault" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                  </linearGradient>
                  <linearGradient id="edgeGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {edges.map((edge) => {
                  const src = nodes.find((n) => n.id === edge.source);
                  const tgt = nodes.find((n) => n.id === edge.target);
                  if (!src || !tgt) return null;

                  const isHigh = isEdgeHighlighted(edge);
                  const isDim = hoveredNode && !isHigh;

                  return (
                    <g key={edge.id} className="transition-all duration-300">
                      {/* Interactive click boundary path */}
                      <path
                        d={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                        stroke="transparent"
                        strokeWidth={14}
                        fill="none"
                        className="cursor-pointer pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNode(null);
                          setSelectedEdge(edge);
                        }}
                      />
                      {/* Visual rendering path */}
                      <path
                        d={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                        stroke={isHigh ? 'url(#edgeGradActive)' : 'url(#edgeGradDefault)'}
                        strokeWidth={isHigh ? 2 : 1}
                        fill="none"
                        className={`${getEdgeAnimationClass(edge)} transition-all duration-300`}
                        style={{ opacity: isDim ? 0.15 : 1 }}
                      />
                      {/* Flowing particle along path */}
                      {edge.animated !== false && (
                        <circle
                          r={isHigh ? 3 : 2.5}
                          fill={isHigh ? '#22d3ee' : '#0891b2'}
                          style={{ 
                            opacity: isDim ? 0.15 : 0.85,
                            filter: 'drop-shadow(0 0 4px #06b6d4)'
                          }}
                        >
                          <animateMotion
                            path={`M ${src.x} ${src.y} L ${tgt.x} ${tgt.y}`}
                            dur={edge.flowSpeed === 'fast' ? '1.0s' : edge.flowSpeed === 'slow' ? '3.5s' : '2.0s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Render HTML Nodes overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {nodes.map((node) => {
                  const isDim = isNodeDimmed(node.id);
                  const isSel = selectedNode?.id === node.id;
                  const isHov = hoveredNode === node.id;

                  return (
                    <div
                      key={node.id}
                      style={{ 
                        left: `${(node.x / 800) * 100}%`, 
                        top: `${(node.y / 500) * 100}%` 
                      }}
                      className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 select-none"
                    >
                      <motion.div
                        className={`w-32 px-3 py-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-1 ${
                          isSel
                            ? 'bg-cyan-950/45 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.25)] text-cyan-300'
                            : isHov
                            ? 'bg-card-bg/95 border-foreground/30 shadow-[0_0_12px_rgba(255,255,255,0.06)] text-white scale-[1.03]'
                            : 'bg-card-bg/85 border-card-border text-foreground hover:border-foreground/10'
                        }`}
                        style={{ opacity: isDim ? 0.35 : 1 }}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        onClick={() => {
                          setSelectedEdge(null);
                          setSelectedNode(node);
                        }}
                        layoutId={`node-card-${node.id}`}
                      >
                        <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono">
                          {getNodeIcon(node.type)}
                          <span className="truncate w-full">{node.label}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-0.5">
                          <span className="text-[7px] font-mono text-muted uppercase tracking-wider">
                            {node.type === 'ai' ? 'ML/MATH' : node.type}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-400' : 'bg-amber-500 animate-pulse'}`} />
                            <span className="text-[7px] font-mono text-secondary uppercase font-semibold leading-none">
                              {node.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Fallback List Layout (Viewports < 768px) */}
            <div className="block md:hidden w-full flex flex-col gap-3 font-mono text-[10px] text-gray-300">
              <span className="text-secondary font-bold uppercase tracking-wider select-none">Architectural Nodes Log</span>
              
              <div className="flex flex-col gap-2.5">
                {nodes.map((node) => (
                  <Card 
                    key={node.id} 
                    onClick={() => {
                      setSelectedEdge(null);
                      setSelectedNode(node);
                    }}
                    className={`p-3.5 flex flex-col gap-2 cursor-pointer transition-all border ${
                      selectedNode?.id === node.id 
                        ? 'border-cyan-500/50 bg-cyan-950/15 text-cyan-300' 
                        : 'border-card-border bg-card-bg/60 text-foreground'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 font-bold">
                        {getNodeIcon(node.type)}
                        <span>{node.label}</span>
                      </div>
                      <Badge variant="outline" className="text-[7px] uppercase font-mono px-2 py-0.5">{node.type}</Badge>
                    </div>
                    
                    {node.details?.description && (
                      <p className="text-[9.5px] text-secondary leading-relaxed font-medium">
                        {node.details.description}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Interactive Details Specifications Panel Overlay */}
            <AnimatePresence>
              {(selectedNode || selectedEdge) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 p-5 border border-card-border bg-foreground/[0.015] rounded-xl text-xs font-mono text-secondary relative overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => {
                        setSelectedNode(null);
                        setSelectedEdge(null);
                      }}
                      className="text-secondary hover:text-white cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>

                  {selectedNode && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 border-b border-card-border pb-2.5">
                        {getNodeIcon(selectedNode.type)}
                        <span className="text-foreground font-black text-sm">{selectedNode.label}</span>
                        <span className="text-[8px] font-bold text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">
                          {selectedNode.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] text-muted uppercase font-bold tracking-wider">Functional Overview</span>
                          <p className="text-secondary leading-relaxed font-semibold">
                            {selectedNode.details?.description || selectedNode.details?.logic || selectedNode.details?.system || 'System node executes operations within parameters.'}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 border-t md:border-t-0 md:border-l border-card-border pt-3 md:pt-0 md:pl-4">
                          <span className="text-[9px] text-muted uppercase font-bold tracking-wider">Specifications Registers</span>
                          <div className="flex flex-col gap-2.5 font-mono text-[10.5px]">
                            {selectedNode.details && Object.entries(selectedNode.details).filter(([k]) => k !== 'description').map(([key, val]) => (
                              <div key={key} className="flex justify-between border-b border-white/2 pb-1">
                                <span className="text-muted capitalize">{key.replace('_', ' ')}:</span>
                                <span className="text-foreground font-bold truncate max-w-[180px]">{val}</span>
                              </div>
                            ))}
                            <div className="flex justify-between border-b border-white/2 pb-1">
                              <span className="text-muted">Node Status:</span>
                              <span className="text-emerald-400 uppercase font-black">{selectedNode.status}</span>
                            </div>
                            <div className="flex justify-between pb-1">
                              <span className="text-muted">Connected Pipelines:</span>
                              <span className="text-foreground font-bold">{getConnectedEdgesCount(selectedNode.id)} paths</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 text-[9px] text-sky-400 bg-sky-950/10 border border-sky-900/30 p-2.5 rounded-lg select-none">
                        <Zap className="h-3.5 w-3.5" />
                        <span>Recruiter Tip: Ask the **Ask Vraj** assistant on this page: *&quot;Explain Vraj&apos;s contributions on the {selectedNode.label} of {PROJECT_LIST.find(p => p.slug === activeProject)?.name}&quot;* to learn more details.</span>
                      </div>
                    </div>
                  )}

                  {selectedEdge && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2 border-b border-card-border pb-2">
                        <HelpCircle className="h-4 w-4 text-cyan-400" />
                        <span className="text-foreground font-black">Connection Definition</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 font-bold text-foreground">
                          <span className="text-secondary font-mono">{nodes.find(n => n.id === selectedEdge.source)?.label}</span>
                          <span className="text-cyan-400">➔</span>
                          <span className="text-secondary font-mono">{nodes.find(n => n.id === selectedEdge.target)?.label}</span>
                        </div>
                        <p className="text-secondary leading-relaxed font-semibold">
                          {selectedEdge.label ? `Data pipe communicates relationship parameters: "${selectedEdge.label}".` : 'Data stream routes execution variables between components.'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[9px] font-mono text-muted">
                          <span>Animation Flow: <span className="text-foreground font-bold uppercase">{selectedEdge.animated ? 'Active Stream' : 'Static Call'}</span></span>
                          <span>•</span>
                          <span>Pipeline ID: <span className="text-foreground font-bold">{selectedEdge.id}</span></span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Card>
  );
}
