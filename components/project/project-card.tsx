'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { Project } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../theme-provider';
import { getCategoryLabel } from '@/lib/formatters/labels';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);
  const [imgSrc, setImgSrc] = useState(project.image || '');
  const { theme } = useTheme();

  // Dynamic 3D rotation math based on hover coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;

    // Constrain max rotation to 8 degrees
    const rotateX = -(y - yc) / 18;
    const rotateY = (x - xc) / 22;

    // Calculate radial gloss highlights %
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

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        transition: 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className="h-full cursor-pointer group select-none"
    >
      <Card className="h-full flex flex-col justify-between hover:border-foreground/25 group transition-all duration-300 relative overflow-hidden">
        {/* Dynamic glass refraction gloss overlay */}
        <div
          style={{
            background: theme === 'dark' 
              ? `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)`
              : `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(0, 0, 0, 0.015) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none transition-all duration-300 z-20"
        />

        <div className="flex flex-col gap-4 relative z-10">
          {/* Featured Image */}
          {project.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-card-border mb-1 bg-foreground/5">
              <Image 
                src={imgSrc} 
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                onError={() => {
                  setImgSrc('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50" style="background:%23000;"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23333" font-family="sans-serif" font-size="10">Vraj Patel Portfolio</text></svg>');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          {/* Category & Status */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary font-mono">
              {getCategoryLabel(project.category)} • {project.year}
            </span>
            <Badge
              variant={
                project.status === 'Live'
                  ? 'accent'
                  : project.status === 'Private'
                  ? 'outline'
                  : 'primary'
              }
              className="text-[9px] font-semibold py-0.5"
            >
              {project.status}
            </Badge>
          </div>

          {/* Title & Description */}
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-bold text-foreground font-serif group-hover:text-foreground transition-colors flex items-center gap-1.5">
              {project.title}
            </h3>
            <p className="text-xs text-secondary leading-relaxed line-clamp-3 font-medium">
              {project.shortDescription}
            </p>
          </div>

          {/* Top Metrics Summary */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-foreground/5 rounded-xl border border-card-border my-1">
              {project.metrics.slice(0, 3).map((metric, idx) => (
                <div key={idx} className="flex flex-col gap-0.5 text-center">
                  <span className="text-xs font-black text-foreground">{metric.value}</span>
                  <span className="text-[8px] text-secondary uppercase font-bold tracking-wider leading-none font-mono">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Tech List and Link Indicator */}
        <div className="mt-5 pt-4 border-t border-card-border flex flex-col gap-3.5 relative z-10">
          {/* Tech list */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[9px] font-semibold text-secondary bg-foreground/5 border border-card-border px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="text-[8px] text-secondary font-bold self-center font-mono">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Actions & Links Bar */}
          <div className="flex items-center justify-between text-xs font-semibold text-secondary">
            <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Github className="h-3.5 w-3.5" /> Code
                </a>
              )}
            </div>

            <div className="flex items-center gap-1 group-hover:text-foreground group-hover:translate-x-1 transition-all">
              Case Study <ArrowRight className="h-3 w-3 text-foreground" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
