"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/motion/use-reduced-motion-safe";
import { cn } from "@/lib/utils";
import { 
  User, Monitor, ShieldCheck, Cpu, Database, 
  Sparkles, Activity, Lock, Network
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StoryStep {
  title: string;
  codeName: string;
  accent: "cyan" | "blue" | "amber" | "violet" | "emerald" | "rose";
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

const STEPS: StoryStep[] = [
  {
    title: "User / Business Input",
    codeName: "input.raw",
    accent: "cyan",
    desc: "The entry gateway where system triggers arise. This covers custom form submissions, CSV/Excel lead list updates, dashboard filters, or LLM chat query triggers.",
    icon: User,
    details: [
      "Secured client-side form captures",
      "Bulk spreadsheet schema ingestion",
      "Asynchronous webhook receivers"
    ]
  },
  {
    title: "Frontend Interface",
    codeName: "client.view",
    accent: "blue",
    desc: "Vibrant and interactive client views designed using Next.js, Tailwind CSS, and Framer Motion. Ensures zero layout shifts and premium dark glassmorphism surfaces.",
    icon: Monitor,
    details: [
      "Next.js App Router route maps",
      "Responsive tailwind-custom grids",
      "Hardware-accelerated springs & hovers"
    ]
  },
  {
    title: "Validation Gateway",
    codeName: "validation.layer",
    accent: "amber",
    desc: "Rigorous entry parser verifying and sanitizing datasets. Employs strict validation schemas and database check rules to block invalid transactions.",
    icon: ShieldCheck,
    details: [
      "Strict runtime validation schemas",
      "Preventing SQL write injection",
      "PostgreSQL constraints & check gates"
    ]
  },
  {
    title: "API & Server Logic",
    codeName: "server.api",
    accent: "violet",
    desc: "Serverless server handlers and FastAPI async controllers running backend tasks. Computes Options Greeks formulas and coordinates dispatch routines.",
    icon: Cpu,
    details: [
      "FastAPI asynchronous compute loops",
      "Background worker compute thread sets",
      "Serverless API route coordinators"
    ]
  },
  {
    title: "Database Ledger",
    codeName: "database.db",
    accent: "emerald",
    desc: "High-performance relational tables managed via PostgreSQL and Supabase. Relies on structured schemas, optimized indexes, and secure Row Level Security (RLS).",
    icon: Database,
    details: [
      "Relational integrity tables",
      "Indexed queries under 50ms FCP",
      "Row Level Security (RLS) credentials"
    ]
  },
  {
    title: "AI & Automation Layer",
    codeName: "ai_pipeline.exe",
    accent: "rose",
    desc: "Intelligent automation routines linking Gemini model parsing queues, Google Sheets lead synchronization pipelines, and secure OAuth draft handlers.",
    icon: Sparkles,
    details: [
      "Structured output Pydantic schemas",
      "Google Sheets lead log pipelines",
      "Automated Gmail OAuth draft buffers"
    ]
  },
  {
    title: "Telemetry & Logs",
    codeName: "telemetry.log",
    accent: "cyan",
    desc: "Real-time event tracking and system metrics. Visualizes visitor clicks, system status flags, and performance variables on observability dashboards.",
    icon: Activity,
    details: [
      "Visitor session telemetry trackers",
      "Hardware load metrics streams",
      "Real-time JSON event logging panels"
    ]
  },
  {
    title: "Secure Admin Operations",
    codeName: "admin_console.sh",
    accent: "violet",
    desc: "Protected management cockpit featuring login verification gates, remote server diagnostic shells, audit logging registries, and ledger overrides.",
    icon: Lock,
    details: [
      "Protected administrator routes",
      "Secure root console overrides",
      "Audit logging security check registries"
    ]
  }
];

const ACCENT_COLORS = {
  cyan: {
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "rgba(6, 182, 212, 0.4)",
    fill: "fill-cyan-400",
    bg: "bg-cyan-950/20 border-cyan-500/20",
    rgb: "6, 182, 212"
  },
  blue: {
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "rgba(59, 130, 246, 0.4)",
    fill: "fill-blue-400",
    bg: "bg-blue-950/20 border-blue-500/20",
    rgb: "59, 130, 246"
  },
  amber: {
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "rgba(245, 158, 11, 0.4)",
    fill: "fill-amber-400",
    bg: "bg-amber-950/20 border-amber-500/20",
    rgb: "245, 158, 11"
  },
  violet: {
    border: "border-violet-500/20",
    text: "text-violet-400",
    glow: "rgba(139, 92, 246, 0.4)",
    fill: "fill-violet-400",
    bg: "bg-violet-950/20 border-violet-500/20",
    rgb: "139, 92, 246"
  },
  emerald: {
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "rgba(16, 185, 129, 0.4)",
    fill: "fill-emerald-400",
    bg: "bg-emerald-950/20 border-emerald-500/20",
    rgb: "16, 185, 129"
  },
  rose: {
    border: "border-rose-500/20",
    text: "text-rose-400",
    glow: "rgba(244, 63, 94, 0.4)",
    fill: "fill-rose-400",
    bg: "bg-rose-950/20 border-rose-500/20",
    rgb: "244, 63, 94"
  }
};

export default function ScrollArchitectureStory() {
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduce = useReducedMotionSafe();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cards = document.querySelectorAll("[data-story-step]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-story-step") || "0", 10);
            setActiveStep(index);
          }
        });
      },
      {
        rootMargin: "-45% 0px -45% 0px", // Focus middle slice of the viewport
        threshold: 0.1
      }
    );

    cards.forEach((card) => observer.observe(card));
    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [isMobile]);


  // Animate elements variant mapping
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col gap-12 w-full relative select-none">
      {/* Title Header HUD */}
      <div className="flex flex-col items-center text-center gap-2 border-b border-card-border pb-6 shrink-0 relative overflow-hidden select-none">
        <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Network className="h-3.5 w-3.5 text-cyan-400" /> Pipeline Flow
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          How I Build Software Systems
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-secondary tracking-wide font-mono">
            Scroll down to watch a data pipeline traverse the 8 core layers of system architecture.
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE TIMELINE FALLBACK (< 1024px)
          ═══════════════════════════════════════════ */}
      {isMobile ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col pl-6 border-l border-white/5 relative gap-10"
        >
          {STEPS.map((step, idx) => {
            const colors = ACCENT_COLORS[step.accent];
            const StepIcon = step.icon;

            return (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="relative flex flex-col gap-3 group"
              >
                {/* Timeline Connector node dot */}
                <div className={cn(
                  "absolute -left-[32px] top-1.5 h-3.5 w-3.5 rounded-full border bg-background flex items-center justify-center transition-transform group-hover:scale-110",
                  colors.border
                )}>
                  <div className={cn("h-1.5 w-1.5 rounded-full", colors.fill)} />
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className={cn("text-[9px] font-mono border uppercase", colors.bg)}>
                      {step.codeName}
                    </Badge>
                    <span className="text-[9px] font-mono text-muted uppercase font-bold tracking-widest">
                      Layer 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
                    <StepIcon className={cn("h-4 w-4 shrink-0", colors.text)} />
                    {step.title}
                  </h3>

                  <p className="text-xs text-secondary leading-relaxed leading-normal mt-0.5">
                    {step.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {step.details.map((detail, dIdx) => (
                      <span 
                        key={dIdx} 
                        className="text-[9px] font-mono text-muted border border-white/5 bg-white/[0.01] px-2 py-0.5 rounded-md"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* ═══════════════════════════════════════════
           DESKTOP SCROLL STORY SYSTEM (>= 1024px)
           ═══════════════════════════════════════════ */
        <div className="grid grid-cols-12 gap-8 items-start relative w-full">
          {/* Sticky left panel (architecture visualization board) */}
          <div className="col-span-5 sticky top-28 h-[460px] flex flex-col justify-center border border-white/5 bg-zinc-950/25 backdrop-blur-md rounded-2xl p-6 overflow-hidden">
            {/* Grid overlay background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.005)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.005)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

            {/* Vertical connector line */}
            <div className="absolute left-[44px] top-10 bottom-10 w-[1.5px] bg-gradient-to-b from-white/[0.01] via-white/10 to-white/[0.01] pointer-events-none" />

            {/* Steps container */}
            <div className="relative z-10 w-full flex flex-col gap-2.5">
              {STEPS.map((step, idx) => {
                const colors = ACCENT_COLORS[step.accent];
                const isActive = activeStep === idx;
                const StepIcon = step.icon;
                
                const bgDotMap = {
                  cyan: "bg-cyan-400 shadow-cyan-400/50",
                  blue: "bg-blue-400 shadow-blue-400/50",
                  amber: "bg-amber-400 shadow-amber-400/50",
                  violet: "bg-violet-400 shadow-violet-400/50",
                  emerald: "bg-emerald-400 shadow-emerald-400/50",
                  rose: "bg-rose-400 shadow-rose-400/50",
                };

                const bgDot = bgDotMap[step.accent];

                return (
                  <motion.div
                    key={idx}
                    animate={{
                      x: isActive ? (shouldReduce ? 0 : [0, 4, 0]) : 0,
                    }}
                    transition={{
                      x: { repeat: Infinity, duration: 3, ease: "easeInOut" }
                    }}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2 rounded-lg border transition-all duration-300 relative",
                      isActive
                        ? cn("bg-zinc-950/60 shadow-sm shadow-black/20", colors.bg)
                        : "bg-zinc-950/20 border-white/5"
                    )}
                  >
                    {/* Visual Connector Node mapping to the vertical line */}
                    <div className="flex items-center justify-center w-4 h-4 shrink-0 relative">
                      <div className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300 z-10 shadow-sm",
                        isActive ? bgDot : "bg-white/10"
                      )} />
                      {isActive && (
                        <span className={cn(
                          "absolute inset-0 rounded-full animate-ping opacity-60 bg-current",
                          colors.text
                        )} />
                      )}
                    </div>

                    {/* Icon */}
                    <div className={cn("p-1 rounded bg-white/[0.01] border border-white/5 shrink-0 flex items-center justify-center",
                      isActive ? colors.text : "text-secondary/35"
                    )}>
                      <StepIcon className="h-3.5 w-3.5" />
                    </div>

                    {/* Monospace Code name details */}
                    <span className={cn(
                      "font-mono text-[9px] font-bold tracking-wider transition-colors truncate flex-1 text-left",
                      isActive ? "text-foreground" : "text-secondary/40"
                    )}>
                      {step.codeName}
                    </span>

                    {/* Right pulse indicator */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn("h-1 w-1 rounded-full transition-all duration-300",
                        isActive ? bgDot : "bg-white/5"
                      )} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right side scrollable story narrative (7 columns) */}
          <div className="col-span-7 flex flex-col items-stretch pr-4 relative">
            {STEPS.map((step, idx) => {
              const colors = ACCENT_COLORS[step.accent];
              const StepIcon = step.icon;
              const isActive = activeStep === idx;

              return (
                <div 
                  key={idx}
                  data-story-step={idx}
                  className="min-h-[65vh] flex items-center py-16 first:pt-4 last:pb-[30vh]"
                >
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0.25,
                      scale: isActive ? 1 : 0.98,
                      x: isActive ? 0 : (shouldReduce ? 0 : 5)
                    }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="w-full"
                  >
                    <Card className={cn(
                      "p-6 transition-all duration-300 bg-zinc-950/20 backdrop-blur-md",
                      isActive ? "border-white/10 shadow-lg shadow-black/30" : "border-white/5"
                    )}>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={cn("text-[9px] font-mono border uppercase tracking-wider", 
                            isActive ? colors.bg : "border-white/5 bg-transparent text-secondary"
                          )}>
                            {step.codeName}
                          </Badge>
                          <span className="text-[10px] font-mono text-muted uppercase font-bold tracking-widest">
                            Layer 0{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground tracking-tight flex items-center gap-2.5">
                          <StepIcon className={cn("h-5 w-5 transition-colors shrink-0", 
                            isActive ? colors.text : "text-secondary"
                          )} />
                          {step.title}
                        </h3>

                        <p className="text-xs text-secondary leading-relaxed leading-normal mt-1">
                          {step.desc}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                          {step.details.map((detail, dIdx) => (
                            <span 
                              key={dIdx} 
                              className={cn(
                                "text-[9px] font-mono border px-2.5 py-1 rounded-md transition-all duration-300 badge-hover",
                                isActive ? "border-white/10 bg-white/[0.02] text-foreground" : "border-white/5 bg-transparent text-muted"
                              )}
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
