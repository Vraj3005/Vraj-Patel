'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, ShieldCheck, Zap } from 'lucide-react';
import { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProjectCaseCardProps {
  project: Project;
}

export default function ProjectCaseCard({ project }: ProjectCaseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  // Dynamic 3D rotation math based on hover coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const rotateX = -(y - yc) / 25;
    const rotateY = (x - xc) / 30;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setRotX(rotateX);
    setRotY(rotateY);
    setGlowX(percentX);
    setGlowY(percentY);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setGlowX(50);
    setGlowY(50);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className="w-full relative group select-none"
    >
      <Card className="p-6 md:p-8 bg-[#0a0a0c]/60 backdrop-blur-md border border-white/5 hover:border-white/15 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-6 h-full">
        {/* Dynamic gloss highlight */}
        <div
          style={{
            background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none transition-all duration-300"
        />

        {/* Card Header: Title & Meta */}
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-450">
              {project.category}
            </span>
            <Badge variant="outline" className="text-[9px] uppercase tracking-wide">
              {project.role}
            </Badge>
          </div>
          <h3 className="text-lg md:text-xl font-extrabold text-white group-hover:text-white transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Challenge Breakdown Panel (Problem & Solution) */}
        {project.challenges && project.challenges.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/1 rounded-xl border border-white/5 p-4 relative z-10">
            {/* Problem card */}
            <div className="flex flex-col gap-1.5 text-left border-b md:border-b-0 md:border-r border-white/5 pb-3 md:pb-0 md:pr-4">
              <span className="text-[9px] font-bold text-gray-400 flex items-center gap-1 font-mono tracking-wider">
                <ShieldCheck className="h-3 w-3 text-gray-400" /> THE CHALLENGE
              </span>
              <p className="text-[11px] text-gray-300 leading-relaxed font-semibold">
                {project.challenges[0].problem}
              </p>
            </div>
            
            {/* Solution card */}
            <div className="flex flex-col gap-1.5 text-left pt-3 md:pt-0 md:pl-4">
              <span className="text-[9px] font-bold text-white flex items-center gap-1 font-mono tracking-wider">
                <Zap className="h-3 w-3 text-white" /> THE SOLUTION
              </span>
              <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                {project.challenges[0].solution}
              </p>
            </div>
          </div>
        )}

        {/* Impact Metrics Block */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center relative z-10 border-t border-b border-white/5 py-4">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono">REALIZED IMPACT:</span>
            <div className="flex gap-4">
              {project.metrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/2 border border-white/5 rounded-xl">
                  <span className="text-xs font-black text-white">{metric.value}</span>
                  <span className="text-[9px] text-muted font-bold tracking-wider leading-none uppercase">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions: tech stack and click triggers */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 relative z-10">
          {/* Tech Tag Pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[9px] font-semibold text-gray-400 bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                {tech}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Launch Live Application"
              >
                <button className="p-2 border border-white/6 hover:border-white/12 bg-white/2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View GitHub Repository"
              >
                <button className="p-2 border border-white/6 hover:border-white/12 bg-white/2 hover:bg-white/5 rounded-lg text-muted hover:text-white transition-colors cursor-pointer">
                  <Github className="h-3.5 w-3.5" />
                </button>
              </a>
            )}
            <Link href={`/projects/${project.slug}`}>
              <Button variant="primary" size="sm" className="gap-1 text-[10px] py-1.5 px-3">
                Full Case Study <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
