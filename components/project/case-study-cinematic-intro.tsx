"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { 
  ExternalLink, Github, Monitor, Briefcase, 
  Calendar, Activity, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project } from "@/types";
import { getCategoryLabel } from "@/lib/formatters/labels";
import { SystemBlueprintBackground } from "@/components/visual/system-blueprint-background";

interface CaseStudyCinematicIntroProps {
  project: Project;
}

export default function CaseStudyCinematicIntro({ project }: CaseStudyCinematicIntroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const shouldReduce = useReducedMotionSafe();

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduce ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const panelVariants: Variants = {
    hidden: { opacity: 0, scale: shouldReduce ? 1 : 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: shouldReduce ? 0 : 0.25 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 md:gap-8 border-b border-card-border pb-8 relative overflow-hidden rounded-2xl bg-foreground/[0.01] p-6"
    >
      <style jsx global>{`
        @keyframes blueprint-scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-blueprint-scan {
          animation: blueprint-scan 6s linear infinite;
        }
      `}</style>
      
      <SystemBlueprintBackground variant="subtle" density="low" className="opacity-[0.03] z-0" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 w-full">
        {/* Left Column: Heading and info */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Step 1: Category + Timeline */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono border-white/5 uppercase tracking-wider bg-white/[0.02] py-0.5">
              {getCategoryLabel(project.category)}
            </Badge>
            <span className="text-secondary font-mono text-xs">•</span>
            <span className="text-secondary font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {project.period}
            </span>
          </motion.div>
          
          {/* Step 2: Project Title Reveal */}
          <motion.h1 
            variants={itemVariants} 
            className="text-3xl md:text-5xl font-medium font-serif text-foreground tracking-tight leading-tight"
          >
            {project.title}
          </motion.h1>
          
          {/* Step 3: Description */}
          <motion.p 
            variants={itemVariants} 
            className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium"
          >
            {project.description}
          </motion.p>

          {/* Step 4: System Parameters card */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 bg-zinc-950/20 backdrop-blur-md border-white/5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-cyan-400" /> System Role
                  </span>
                  <span className="text-[11px] font-semibold text-foreground truncate">{project.role}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Monitor className="h-3 w-3 text-emerald-400" /> Client
                  </span>
                  <span className="text-[11px] font-semibold text-foreground truncate">{project.client || "Personal Project"}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Activity className="h-3 w-3 text-violet-400" /> Status
                  </span>
                  <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {project.status}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-muted font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                    <Award className="h-3 w-3 text-amber-400" /> Release
                  </span>
                  <span className="text-[11px] font-semibold font-mono text-foreground">{project.year}</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Step 5: Tech badges Stagger list */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[9px] font-mono border border-white/5 bg-white/[0.01] px-2 py-0.5 rounded-md badge-hover"
              >
                {tech}
              </span>
            ))}
          </motion.div>

          {/* Step 6: CTA Actions */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="primary" size="md" className="gap-2 text-xs font-bold shadow-md shadow-black/40">
                  <ExternalLink className="h-3.5 w-3.5" /> Launch Live Module
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="secondary" size="md" className="gap-2 text-xs font-bold">
                  <Github className="h-3.5 w-3.5" /> View Source Code
                </Button>
              </a>
            )}
          </motion.div>
        </div>

        {/* Right Column: Step 7 Featured Image or Blueprint fallback */}
        <motion.div 
          variants={panelVariants} 
          className="lg:col-span-5 w-full h-full relative"
        >
          {project.image && !imgError ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-card-border shadow-2xl bg-foreground/5 group">
              {/* Image Loading Shimmer fallback */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-zinc-950/80 animate-pulse border border-white/5 rounded-2xl flex items-center justify-center">
                  <span className="font-mono text-[10px] text-muted uppercase">Syncing media...</span>
                </div>
              )}
              
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImgError(true)}
              />
            </div>
          ) : (
            /* Premium Abstract Blueprint Placeholder Fallback */
            <BlueprintPlaceholder 
              slug={project.slug} 
              title={project.title} 
              year={project.year} 
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// BLUEPRINT PLACEHOLDER SUB-COMPONENT
// ═══════════════════════════════════════════
interface BlueprintPlaceholderProps {
  slug: string;
  title: string;
  year: string;
}

function BlueprintPlaceholder({ slug, title, year }: BlueprintPlaceholderProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 bg-[#050508] shadow-2xl flex items-center justify-center p-6 select-none group">
      {/* Blueprint grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(6,182,212,0.015)_1px,transparent_1px)] bg-[size:16px_16px] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

      {/* Animated blueprint scanner line */}
      <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent top-0 animate-blueprint-scan z-10" />

      {/* Technical vector circles */}
      <svg width="100%" height="100%" viewBox="0 0 160 90" className="absolute inset-0 z-0 opacity-40">
        <circle cx="80" cy="45" r="30" fill="none" stroke="rgba(6, 182, 212, 0.12)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-spin-slow-ccw" />
        <circle cx="80" cy="45" r="20" fill="none" stroke="rgba(6, 182, 212, 0.18)" strokeWidth="0.8" />
        <circle cx="80" cy="45" r="4" fill="rgba(6, 182, 212, 0.4)" />
        
        {/* Crosshair layout */}
        <line x1="10" y1="45" x2="150" y2="45" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="80" y1="5" x2="80" y2="85" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        
        <rect x="25" y="15" width="110" height="60" fill="none" stroke="rgba(6, 182, 212, 0.08)" strokeWidth="0.5" />
      </svg>

      {/* Blueprint text HUD */}
      <div className="relative w-full h-full z-10 font-mono text-[9px] text-secondary flex flex-col justify-between items-stretch">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] font-bold text-foreground tracking-tight leading-none truncate max-w-[150px]">
              {title}
            </span>
            <span className="text-[7px] text-cyan-400/50">MODEL_SPEC: {slug}.sys</span>
          </div>
          <Badge variant="outline" className="text-[6.5px] border-cyan-500/20 text-cyan-400 bg-cyan-950/20 px-1 py-0 rounded">
            SCHEMATIC
          </Badge>
        </div>

        <div className="flex justify-between items-end text-[7px] text-muted font-bold text-left">
          <div className="flex flex-col">
            <span>COORDS: X_42.09 / Y_78.11</span>
            <span>VER: 1.0.0_PRODUCTION</span>
          </div>
          <span>RELEASE: {year}</span>
        </div>
      </div>
    </div>
  );
}
