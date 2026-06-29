'use client';

import { projects } from '@/lib/data/projects';
import ProjectCard from '@/components/project/project-card';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function FeaturedProjects() {
  // Select top featured projects to highlight on homepage
  const featuredList = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-12 md:py-16 flex flex-col gap-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Featured Engineering
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Case Studies & Systems
          </h2>
          <p className="text-xs text-muted max-w-xl leading-relaxed">
            A curated selection of production-grade business software and quantitative pipelines Vraj has designed, developed, and optimized.
          </p>
        </div>

        <Button href="/projects" variant="secondary" size="md" className="flex items-center gap-1.5 shrink-0">
          View All {projects.length} Projects <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredList.map((project) => (
          <div key={project.slug}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
