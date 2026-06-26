"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Briefcase, Layers, Brain, LineChart, GraduationCap, Terminal, Monitor } from "lucide-react";
import OSWindow from "./os-window";
import {
  ProjectsPreview,
  SystemsPreview,
  AIAssistantPreview,
  TelemetryDashboardPreview,
  ResumePreview,
  TerminalPreview
} from "./os-module-preview";

export default function OSWindowGrid() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="flex flex-col gap-8 w-full relative z-10 no-print">
      {/* OS Section Header HUD */}
      <div className="flex flex-col items-center text-center gap-2">
        <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5 text-cyan-400" /> System Desktop
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
          Portfolio Operating System
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] text-secondary tracking-wide font-mono">
            Explore projects, systems, AI assistant, resume, and dashboards through a modular interface.
          </span>
        </div>
      </div>

      {/* 12-Column Responsive Windows Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full mt-4"
      >
        {/* ROW 1: Projects (7 cols) + Systems (5 cols) */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7">
          <OSWindow
            title="projects.sys"
            subtitle="Enterprise Apps & Custom Products"
            status="ONLINE"
            icon={Briefcase}
            href="/projects"
            accent="cyan"
            className="min-h-[220px]"
          >
            <ProjectsPreview />
          </OSWindow>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-5">
          <OSWindow
            title="systems.blueprint"
            subtitle="Architectural Connection Matrices"
            status="ACTIVE"
            icon={Layers}
            href="/systems"
            accent="emerald"
            className="min-h-[220px]"
          >
            <SystemsPreview />
          </OSWindow>
        </motion.div>

        {/* ROW 2: AI Agent (6 cols) + Telemetry (6 cols) */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-6">
          <OSWindow
            title="ai_agent.exe"
            subtitle="Autonomous Conversational Chat"
            status="RUNNING"
            icon={Brain}
            href="/ask-vraj"
            accent="blue"
            className="min-h-[210px]"
          >
            <AIAssistantPreview />
          </OSWindow>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-6">
          <OSWindow
            title="telemetry.dashboard"
            subtitle="Real-time Observability Parameters"
            status="ACTIVE"
            icon={LineChart}
            href="/dashboard"
            accent="violet"
            className="min-h-[210px]"
          >
            <TelemetryDashboardPreview />
          </OSWindow>
        </motion.div>

        {/* ROW 3: Resume (5 cols) + Terminal (7 cols) */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-5">
          <OSWindow
            title="resume.pdf"
            subtitle="Academic Profile & Experience"
            status="STANDBY"
            icon={GraduationCap}
            href="/resume"
            accent="amber"
            className="min-h-[210px]"
          >
            <ResumePreview />
          </OSWindow>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-7">
          <OSWindow
            title="terminal.sh"
            subtitle="Interactive Console Shell"
            status="ACTIVE"
            icon={Terminal}
            href="/terminal"
            accent="rose"
            className="min-h-[210px]"
          >
            <TerminalPreview />
          </OSWindow>
        </motion.div>
      </motion.div>
    </section>
  );
}
