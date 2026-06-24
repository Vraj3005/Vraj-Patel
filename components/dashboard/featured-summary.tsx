'use client';

import React from 'react';
import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Code2, Link2, ExternalLink } from 'lucide-react';
import { getCategoryLabel } from '@/lib/formatters/labels';

interface FeaturedSummaryProps {
  selectedCategory: string | null;
  selectedTech: string | null;
  onClearFilters: () => void;
}

export default function FeaturedSummary({
  selectedCategory,
  selectedTech,
  onClearFilters
}: FeaturedSummaryProps) {
  // Filter projects based on selectedCategory or selectedTech
  const filteredProjects = projects.filter((project) => {
    if (selectedCategory && selectedCategory !== 'all') {
      if (project.category !== selectedCategory) {
        return false;
      }
    }
    if (selectedTech) {
      if (!project.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  return (
    <Card className="p-6 bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-5 h-full">
      <div className="flex justify-between items-center border-b border-card-border pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold font-mono text-secondary uppercase tracking-wider">
            Repository Showcase
          </span>
          <h3 className="text-sm font-bold text-foreground font-serif tracking-tight mt-0.5">
            Featured Systems Summary
          </h3>
        </div>
        {(selectedCategory || selectedTech) && (
          <button
            onClick={onClearFilters}
            className="text-[9px] font-mono text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 bg-cyan-950/15 px-2 py-1 rounded transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-secondary">
          No projects matching the selected criteria.
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredProjects.map((project) => {
            const isLive = project.status === 'Live';
            return (
              <div
                key={project.slug}
                className="group border border-white/5 bg-white/2 hover:border-cyan-500/20 hover:bg-cyan-500/[0.01] rounded-xl p-3.5 transition-all flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-foreground font-serif">
                      {project.title}
                    </span>
                    <span className="text-[8px] font-mono text-secondary uppercase">
                      {getCategoryLabel(project.category)} {project.client ? `| ${project.client}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-1.5 w-1.5 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isLive ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                        isLive ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                    </span>
                    <span className="text-[9px] font-mono text-secondary">
                      {project.status}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-secondary leading-relaxed font-medium">
                  {project.shortDescription}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="text-[8px] font-mono bg-white/3 border border-white/5 text-secondary px-1.5 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 5 && (
                    <span className="text-[8px] font-mono text-muted px-1">
                      +{project.technologies.length - 5} more
                    </span>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 mt-0.5">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-[8px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 transition-colors"
                    >
                      Case Study <ArrowUpRight className="h-2 w-2" />
                    </Link>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[8px] font-mono text-secondary hover:text-foreground flex items-center gap-0.5 transition-colors"
                      >
                        Live Preview <ExternalLink className="h-2 w-2" />
                      </a>
                    )}
                  </div>
                  <span className="text-[8px] font-mono text-muted">
                    {project.period}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
