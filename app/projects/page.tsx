'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { projects, categories } from '@/lib/data/projects';
import ProjectCard from '@/components/project/project-card';
import { Search, FolderGit2, X } from 'lucide-react';
import { getCategoryLabel } from '@/lib/formatters/labels';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Parse category parameter on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) {
        const matched = categories.find(c => c.toLowerCase() === cat.toLowerCase());
        if (matched) {
          setTimeout(() => {
            setSelectedCategory(matched);
          }, 0);
        }
      }
    }
  }, []);

  // Filter projects by both text search and selected category filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col gap-10 py-6 md:py-10 max-w-5xl mx-auto w-full">
      {/* Intro section */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono flex items-center gap-1.5">
          <FolderGit2 className="h-4 w-4 text-foreground" /> Systems Directory
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight font-medium">
          Case Studies & Software Architecture
        </h1>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          Search and inspect detailed technical implementation details for the core projects built, deployed, and designed by Vraj Patel.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Text Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-secondary pointer-events-none" />
          <Input
            type="text"
            placeholder="Search by project name, tech (e.g. Next.js, Python)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-9 py-2.5 bg-foreground/3 text-foreground border-card-border"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 p-0.5 text-secondary hover:text-foreground rounded-md cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Short Summary Counter */}
        <div className="text-xs text-secondary font-semibold tracking-wide shrink-0 font-mono">
          Showing <span className="text-foreground font-bold">{filteredProjects.length}</span> of {projects.length} systems
        </div>
      </Card>

      {/* Category selector grid */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-xs font-semibold tracking-wide rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-foreground/30 bg-foreground/5 text-foreground shadow-sm'
                  : 'border-card-border bg-card-bg text-secondary hover:border-foreground/15 hover:text-foreground'
              }`}
            >
              {category === 'all' ? 'All' : getCategoryLabel(category)}
            </button>
          );
        })}
      </div>

      {/* Projects List Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.slug} variants={itemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card className="py-20 text-center flex flex-col items-center justify-center border-dashed border-card-border bg-card-bg">
          <FolderGit2 className="h-12 w-12 text-secondary mb-4 animate-pulse" />
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-1">No matching architectures found</h3>
          <p className="text-xs text-secondary max-w-sm font-semibold">
            Try adjusting your text search filters or choose a different category from the filters above.
          </p>
        </Card>
      )}
    </div>
  );
}
