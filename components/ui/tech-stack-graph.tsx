'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  type: 'tech' | 'project';
  x: number;
  y: number;
  color: string;
}

interface Edge {
  source: string;
  target: string;
}

export default function TechStackGraph() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Define nodes with relative coordinates for a 600x480 SVG viewbox
  const nodes: Node[] = [
    // Source Tech Nodes (Left side)
    { id: 'nextjs', label: 'Next.js', type: 'tech', x: 100, y: 100, color: '#38bdf8' }, // Cyan
    { id: 'supabase', label: 'Supabase', type: 'tech', x: 100, y: 210, color: '#34d399' }, // Emerald
    { id: 'python', label: 'Python', type: 'tech', x: 100, y: 320, color: '#fbbf24' }, // Amber
    { id: 'gemini', label: 'Gemini API', type: 'tech', x: 100, y: 430, color: '#60a5fa' }, // Blue

    // Target Project Nodes (Right side)
    { id: 'surendra', label: 'Surendra & Co.', type: 'project', x: 500, y: 50, color: '#e2e8f0' },
    { id: 'constructionos', label: 'ConstructionOS', type: 'project', x: 500, y: 110, color: '#e2e8f0' },
    { id: 'portfolio', label: 'Portfolio Site', type: 'project', x: 500, y: 170, color: '#e2e8f0' },
    { id: 'nflrd', label: 'NF-LRD Quant', type: 'project', x: 500, y: 230, color: '#e2e8f0' },
    { id: 'mspe', label: 'MSPE Greeks', type: 'project', x: 500, y: 290, color: '#e2e8f0' },
    { id: 'btcalgo', label: 'BTC-ALGO Execution', type: 'project', x: 500, y: 350, color: '#e2e8f0' },
    { id: 'askvraj', label: 'Ask Vraj AI', type: 'project', x: 500, y: 410, color: '#e2e8f0' },
    { id: 'coldemail', label: 'AI Cold Email', type: 'project', x: 500, y: 470, color: '#e2e8f0' },
  ];

  // Connections mapping
  const edges: Edge[] = [
    // Next.js -> Surendra, ConstructionOS, Portfolio
    { source: 'nextjs', target: 'surendra' },
    { source: 'nextjs', target: 'constructionos' },
    { source: 'nextjs', target: 'portfolio' },

    // Supabase -> ConstructionOS, Portfolio
    { source: 'supabase', target: 'constructionos' },
    { source: 'supabase', target: 'portfolio' },

    // Python -> NF-LRD, MSPE, BTC-ALGO
    { source: 'python', target: 'nflrd' },
    { source: 'python', target: 'mspe' },
    { source: 'python', target: 'btcalgo' },

    // Gemini API -> Ask Vraj, AI Cold Email
    { source: 'gemini', target: 'askvraj' },
    { source: 'gemini', target: 'coldemail' },
  ];

  // Helper to determine active states
  const isNodeConnected = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (hoveredNode === nodeId) return true;

    // Check if there is an edge connecting the hovered node and this node
    return edges.some(
      (edge) =>
        (edge.source === hoveredNode && edge.target === nodeId) ||
        (edge.source === nodeId && edge.target === hoveredNode)
    );
  };

  const isEdgeConnected = (edge: Edge) => {
    if (!hoveredNode) return true;
    return edge.source === hoveredNode || edge.target === hoveredNode;
  };

  const getActiveColor = () => {
    if (!hoveredNode) return 'rgba(255,255,255,0.08)';
    const node = nodes.find((n) => n.id === hoveredNode);
    if (node && node.type === 'tech') return node.color;
    
    // If hovering a project node, find the connected tech node color
    const connectedEdge = edges.find(e => e.target === hoveredNode);
    if (connectedEdge) {
      const tech = nodes.find(n => n.id === connectedEdge.source);
      if (tech) return tech.color;
    }
    return '#a855f7';
  };

  return (
    <div className="w-full bg-[#07070a] border border-white/5 rounded-2xl p-6 relative flex flex-col gap-5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.015),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4 shrink-0 relative z-10">
        <span className="text-[10px] text-muted font-mono uppercase tracking-widest font-bold">Systems Visualizer</span>
        <h3 className="text-base font-bold text-white font-serif">Tech Stack Architecture Graph</h3>
        <p className="text-[11px] text-muted leading-relaxed font-semibold">
          Hover over nodes to trace how core technologies link with production-grade project cases.
        </p>
      </div>

      {/* Graph Area */}
      <div className="w-full flex justify-center items-center relative z-10 select-none">
        <svg 
          viewBox="0 0 600 520" 
          className="w-full max-w-[560px] h-auto drop-shadow-2xl overflow-visible"
        >
          {/* Animated Glowing Definition filters */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Draw Connection Edges */}
          <g>
            {edges.map((edge, idx) => {
              const srcNode = nodes.find((n) => n.id === edge.source)!;
              const tgtNode = nodes.find((n) => n.id === edge.target)!;
              
              const active = isEdgeConnected(edge);
              const color = active ? srcNode.color : 'rgba(255, 255, 255, 0.04)';
              const strokeWidth = active ? 2.5 : 1.25;

              // Cubic bezier control points for curved paths instead of straight lines
              const xMid = (srcNode.x + tgtNode.x) / 2;
              const pathD = `M ${srcNode.x} ${srcNode.y} C ${xMid} ${srcNode.y}, ${xMid} ${tgtNode.y}, ${tgtNode.x} ${tgtNode.y}`;

              return (
                <g key={`edge-${idx}`}>
                  {/* Base path */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    className="transition-colors duration-300"
                    opacity={hoveredNode ? (active ? 0.95 : 0.15) : 0.4}
                  />

                  {/* Flowing animated dash overlays on active hover links */}
                  {active && hoveredNode && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={srcNode.color}
                      strokeWidth={3}
                      strokeDasharray="8 12"
                      className="animate-flow"
                      filter="url(#glow)"
                      style={{
                        animation: 'dash 1.2s linear infinite',
                        opacity: 1
                      }}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Draw Nodes */}
          <g>
            {nodes.map((node) => {
              const active = isNodeConnected(node.id);
              const isHovered = hoveredNode === node.id;
              const nodeColor = node.type === 'tech' ? node.color : getActiveColor();

              return (
                <g 
                  key={node.id}
                  className="cursor-pointer"
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer circle glow on active hovered node */}
                  {isHovered && (
                    <circle
                      cx={0}
                      cy={0}
                      r={node.type === 'tech' ? 14 : 10}
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth={1.5}
                      filter="url(#glow)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={0}
                    cy={0}
                    r={node.type === 'tech' ? 7 : 5}
                    fill={active ? nodeColor : '#1e293b'}
                    stroke={active ? nodeColor : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth={1.5}
                    className="transition-all duration-300"
                    opacity={hoveredNode ? (active ? 1.0 : 0.35) : 1.0}
                  />

                  {/* Node Label Card */}
                  <g 
                    transform={`translate(${node.type === 'tech' ? -18 : 18}, 0)`}
                    opacity={hoveredNode ? (active ? 1.0 : 0.3) : 0.85}
                    className="transition-all duration-300"
                  >
                    <text
                      x={0}
                      y={4}
                      fill={active ? (isHovered ? '#ffffff' : '#f1f5f9') : '#64748b'}
                      textAnchor={node.type === 'tech' ? 'end' : 'start'}
                      className="text-[10px] font-mono font-bold tracking-wide transition-colors"
                      style={{
                        textShadow: isHovered ? `0 0 8px ${nodeColor}` : 'none',
                        fontWeight: isHovered || active ? 700 : 500,
                      }}
                    >
                      {node.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
}
