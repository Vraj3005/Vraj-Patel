"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProjectNodes, projectLinks, isNodeInCategory, ProjectNode } from "@/lib/projects/project-relationships";
import ProjectUniverseNode from "./project-universe-node";
import { getCategoryLabel } from "@/lib/formatters/labels";
import { X, ExternalLink, ArrowRight, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

interface ProjectUniverseProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function ProjectUniverse({
  selectedCategory,
  onCategoryChange,
}: ProjectUniverseProps) {
  const [nodes, setNodes] = useState<ProjectNode[]>([]);
  const [hoveredNodeSlug, setHoveredNodeSlug] = useState<string | null>(null);
  const [selectedNodeSlug, setSelectedNodeSlug] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduce = useReducedMotionSafe();

  // Load nodes on client mount
  useEffect(() => {
    setNodes(getProjectNodes());
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const selectedNode = nodes.find((n) => n.slug === selectedNodeSlug);

  // Compute set of connected slugs for the hovered node
  const getConnectedSlugs = (slug: string | null): Set<string> => {
    const connected = new Set<string>();
    if (!slug) return connected;

    projectLinks.forEach((link) => {
      if (link.source === slug) connected.add(link.target);
      if (link.target === slug) connected.add(link.source);
    });

    return connected;
  };

  const hoveredConnectedSlugs = getConnectedSlugs(hoveredNodeSlug);

  const handleNodeClick = (slug: string) => {
    setSelectedNodeSlug(slug);
  };

  const handleNodeHover = (slug: string) => {
    setHoveredNodeSlug(slug);
  };

  const handleNodeLeave = () => {
    setHoveredNodeSlug(null);
  };

  return (
    <div className="w-full relative flex flex-col gap-6 p-6 border border-white/5 rounded-3xl bg-black/25 backdrop-blur-md overflow-hidden select-none">
      {/* Blueprint background grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none z-0" />

      {/* HeaderHUD Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 z-10">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs text-secondary font-semibold uppercase tracking-widest">
            Project Constellation Map
          </span>
        </div>
        <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest hidden sm:block">
          Interactive Node Network v1.2
        </div>
      </div>

      {/* Main visualization grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative min-h-[380px] lg:min-h-[480px] z-10 w-full">
        
        {/* Left Side: SVG Constellation Map (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 bg-black/10 rounded-2xl border border-white/5 relative flex items-center justify-center min-h-[320px] lg:min-h-[450px]">
          
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full p-6 text-foreground/5 z-10 relative select-none"
          >
            {/* 1. Draw static and highlighted relationship lines */}
            <g>
              {projectLinks.map((link, idx) => {
                const sourceNode = nodes.find((n) => n.slug === link.source);
                const targetNode = nodes.find((n) => n.slug === link.target);
                if (!sourceNode || !targetNode) return null;

                // Determine highlight/dim states for connection lines
                const isLineActive =
                  (hoveredNodeSlug === link.source || hoveredNodeSlug === link.target) ||
                  (selectedNodeSlug === link.source || selectedNodeSlug === link.target);

                const isLineDimmed =
                  (hoveredNodeSlug && !isLineActive) ||
                  (selectedCategory !== "all" &&
                    (!isNodeInCategory(sourceNode.category, selectedCategory) ||
                      !isNodeInCategory(targetNode.category, selectedCategory)));

                return (
                  <g key={`link-${idx}`}>
                    {/* Background thicker hover detection bridge */}
                    <line
                      x1={`${sourceNode.x}%`}
                      y1={`${sourceNode.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke="transparent"
                      strokeWidth="6"
                      className="pointer-events-none"
                    />
                    
                    {/* Glowing / Pulse vector line */}
                    <line
                      x1={`${sourceNode.x}%`}
                      y1={`${sourceNode.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke={isLineActive ? "#22d3ee" : "rgba(255, 255, 255, 0.08)"}
                      strokeWidth={isLineActive ? 1.5 : 0.75}
                      strokeDasharray={isLineActive && !shouldReduce ? "3 3" : undefined}
                      className={cn("pointer-events-none", shouldReduce ? "transition-none" : "transition-all duration-300")}
                      style={{
                        opacity: isLineDimmed ? 0.15 : isLineActive ? 0.9 : 0.4,
                      }}
                    />
                  </g>
                );
              })}
            </g>

            {/* 2. Draw Project Nodes */}
            <g>
              {nodes.map((node) => {
                const isHovered = hoveredNodeSlug === node.slug;
                const isSelected = selectedNodeSlug === node.slug;
                
                // Determine highlighting details based on filter or interactions
                const isHighlighted =
                  hoveredConnectedSlugs.has(node.slug) ||
                  (selectedCategory !== "all" && isNodeInCategory(node.category, selectedCategory));

                const isDimmed =
                  (hoveredNodeSlug && !isHovered && !hoveredConnectedSlugs.has(node.slug)) ||
                  (!hoveredNodeSlug &&
                    selectedCategory !== "all" &&
                    !isNodeInCategory(node.category, selectedCategory));

                return (
                  <ProjectUniverseNode
                    key={node.slug}
                    slug={node.slug}
                    title={node.title}
                    category={node.category}
                    x={node.x}
                    y={node.y}
                    isHovered={isHovered}
                    isDimmed={isDimmed}
                    isHighlighted={isHighlighted}
                    isSelected={isSelected}
                    isMobile={isMobile}
                    onClick={handleNodeClick}
                    onMouseEnter={handleNodeHover}
                    onMouseLeave={handleNodeLeave}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right Side: Glassmorphic Project Preview Panel (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 flex flex-col justify-stretch">
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full flex flex-col justify-between p-6 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40 z-10"
              >
                {/* Panel Header */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] font-mono border-white/5 uppercase bg-white/5 cursor-pointer hover:bg-white/10 hover:text-white transition-colors"
                      onClick={() => {
                        const filterVal = selectedNode.category === "ecommerce" ? "client_software" : selectedNode.category;
                        onCategoryChange(filterVal);
                      }}
                    >
                      {getCategoryLabel(selectedNode.category)}
                    </Badge>
                    <button
                      onClick={() => setSelectedNodeSlug(null)}
                      className="p-1 hover:bg-white/5 rounded-lg text-secondary hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground tracking-tight leading-tight">
                    {selectedNode.title}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed">
                    {selectedNode.shortDescription}
                  </p>
                </div>

                {/* Relational Metrics */}
                {selectedNode.metrics && selectedNode.metrics.length > 0 && (
                  <div className="flex flex-col gap-2 my-4 border-y border-white/5 py-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono">
                      System Metrics
                    </span>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {selectedNode.metrics.slice(0, 2).map((m, mIdx) => (
                        <div key={mIdx} className="flex flex-col p-2 bg-black/20 border border-white/5 rounded-lg">
                          <span className="text-[9px] text-muted font-mono">{m.label}</span>
                          <span className="text-xs font-semibold text-foreground mt-0.5">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Problem / Solution HUD segment */}
                {(selectedNode.problem || selectedNode.solution) && (
                  <div className="flex flex-col gap-2.5 mb-4">
                    {selectedNode.problem && (
                      <div className="text-[10px] text-secondary leading-relaxed">
                        <span className="text-red-400 font-bold font-mono text-[9px] mr-1 uppercase">Challenge:</span>
                        {selectedNode.problem}
                      </div>
                    )}
                    {selectedNode.solution && (
                      <div className="text-[10px] text-secondary leading-relaxed">
                        <span className="text-emerald-400 font-bold font-mono text-[9px] mr-1 uppercase">Solution:</span>
                        {selectedNode.solution}
                      </div>
                    )}
                  </div>
                )}

                {/* Technologies List */}
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-secondary font-mono">
                    Technology Stack
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedNode.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-mono border border-white/5 px-2 py-0.5 rounded bg-white/[0.01] text-secondary hover:text-white hover:border-white/10 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {selectedNode.technologies.length > 5 && (
                      <span className="text-[9px] text-muted font-mono self-center px-1">
                        +{selectedNode.technologies.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Case Study / Links */}
                <div className="flex flex-col gap-2 pt-4 border-t border-white/5 mt-auto">
                  {selectedNode.slug !== "constructionos" ? (
                    <Link href={`/projects/${selectedNode.slug}`} className="w-full">
                      <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold">
                        View Case Study <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center p-2 border border-dashed border-white/5 rounded-lg bg-black/10">
                      <span className="font-mono text-[9px] text-cyan-400/50 uppercase tracking-widest">
                        Architecture Concept
                      </span>
                    </div>
                  )}
                  {selectedNode.liveUrl && selectedNode.liveUrl !== "#" && (
                    <a
                      href={selectedNode.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-foreground text-xs font-semibold rounded-xl transition-all cursor-pointer mt-1"
                    >
                      Launch Live App <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full min-h-[220px] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/[0.01]">
                <Layers className="h-8 w-8 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Select a Project Node
                </h4>
                <p className="text-[10px] text-secondary max-w-[200px] leading-relaxed">
                  Click on any node in the constellation to project its structural metrics and architecture details here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
