'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTitleReveal, SectionStagger, SectionItem } from '@/components/motion/page-transition';
import { BookOpen, Calendar, Briefcase, GraduationCap, ChevronRight, Award, Server, Layout, Database } from 'lucide-react';
import dynamic from 'next/dynamic';
import skillsData from '@/db/skills.json';

const TechStackGraph = dynamic(() => import('@/components/ui/tech-stack-graph'), {
  ssr: false,
  loading: () => <div className="w-full min-h-[480px] bg-[#07070a] border border-white/5 rounded-2xl animate-pulse" />
});

interface SkillGroup {
  category: string;
  items: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Languages': <Server className="h-4 w-4 text-foreground" />,
  'Frontend Development': <Layout className="h-4 w-4 text-foreground" />,
  'Backend & APIs': <Database className="h-4 w-4 text-foreground" />,
  'Databases & Systems': <Server className="h-4 w-4 text-foreground" />,
};

const skills = (skillsData as SkillGroup[]).map((s) => ({
  category: s.category,
  icon: categoryIcons[s.category] || <Server className="h-4 w-4 text-foreground" />,
  items: s.items,
}));

interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  description: string;
  type: 'academic' | 'client' | 'research';
}

const timeline: ExperienceItem[] = [
  {
    period: 'May 2026 - Jul 2026',
    role: 'Software Engineering Intern',
    organization: 'Software Consultancy Agency',
    description: 'Engineered and delivered core client ERP platforms and e-commerce websites (Solar Sizing Calculator, Interior Design ERP, Afghan Anjeer Marketplace, Clothing Brand Luxury Storefront, and Bus Body Builder website) during a 2-month summer internship, designing database schemas and optimizing visual layouts.',
    type: 'client',
  },
  {
    period: 'Sep 2025 - Nov 2025',
    role: 'Solo Quant Researcher',
    organization: 'NIFTY 50 Regime Discovery',
    description: 'Developed Python-based Hidden Markov Models (HMM) to classify market price regimes and run performance backtesting dashboards.',
    type: 'research',
  },
  {
    period: 'Aug 2023 - May 2027',
    role: 'B.Tech Undergrad in CSE',
    organization: 'Nirma University',
    description: 'Specializing in data structures, algorithms, databases, and systems. Completed coursework in advanced algorithms, database management, and operating systems.',
    type: 'academic',
  },
];



export default function About() {
  return (
    <SectionStagger className="flex flex-col gap-12 w-full py-6 md:py-10">
      {/* Intro Header */}
      <SectionItem className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono">Identity & Background</span>
        <PageTitleReveal className="text-3xl md:text-4xl font-serif text-foreground tracking-tight font-medium">
          About Vraj Patel
        </PageTitleReveal>
        <p className="text-sm md:text-base text-secondary leading-relaxed max-w-3xl mt-1 font-medium">
          I am Vraj Patel, a 4th year Computer Science and Engineering student at Nirma University.
          I focus on building functional business products—like custom ERP pipelines and quantitative visualizers—rather than toy projects. I enjoy bridging the gap between database designs and slick, interactive client interfaces. Vraj Patel’s work includes client ERP systems, business dashboards, e-commerce websites, AI outreach automation, and market analytics platforms.
        </p>
      </SectionItem>

      {/* Grid: Academic profile card & values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionItem className="md:col-span-1">
          <Card className="h-full p-6 flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-foreground/5 border border-card-border flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-secondary font-bold uppercase tracking-wider font-mono">Institution</span>
              <h3 className="text-base font-bold text-foreground">Nirma University</h3>
              <p className="text-xs text-secondary font-medium">B.Tech in Computer Science & Engineering</p>
            </div>
            <div className="flex flex-col gap-1 border-t border-card-border pt-4">
              <span className="text-xs text-secondary font-bold uppercase tracking-wider font-mono">Expected Completion</span>
              <span className="text-xs text-foreground font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-secondary" /> May 2027
              </span>
            </div>
            <div className="flex flex-col gap-1 border-t border-card-border pt-4">
              <span className="text-xs text-secondary font-bold uppercase tracking-wider font-mono">Key Research Interest</span>
              <span className="text-xs text-foreground font-semibold flex items-center gap-1.5 font-serif">
                <Award className="h-3.5 w-3.5 text-foreground" /> Algorithmic Trading Systems
              </span>
            </div>
          </Card>
        </SectionItem>

        <SectionItem className="md:col-span-2">
          <Card className="h-full p-6 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="h-10 w-10 rounded-xl bg-foreground/5 border border-card-border flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-base font-bold text-foreground font-serif">My Engineering Principles</h3>
              <ul className="flex flex-col gap-3 text-xs text-secondary font-medium">
                <li className="flex gap-2">
                  <ChevronRight className="h-4 w-4 text-foreground shrink-0" />
                  <span><strong>Solve Real Problems First:</strong> Toy code belongs in notebooks. I prefer building fully-functioning tools that handle billing, material supply chains, or options implied volatilities.</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="h-4 w-4 text-foreground shrink-0" />
                  <span><strong>Optimize Bottlenecks:</strong> If a page load or response takes more than 500ms, it needs optimization. I prioritize performance using database indexes, client-side caching, and asynchronous backend pipelines.</span>
                </li>
                <li className="flex gap-2">
                  <ChevronRight className="h-4 w-4 text-foreground shrink-0" />
                  <span><strong>Strict Validation Rules:</strong> A system is only as good as its data model. I rely on strict Zod models, PostgreSQL checks, and TypeScript types to ensure stability in production.</span>
                </li>
              </ul>
            </div>
          </Card>
        </SectionItem>
      </div>

      {/* Technical Skill Matrix */}
      <SectionItem className="flex flex-col gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-tight flex items-center gap-2">
          <Server className="h-5 w-5 text-foreground" /> The Technical Skill Matrix
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full mx-auto">
          {/* Left Column: Interactive network graph */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <TechStackGraph />
          </div>

          {/* Right Column: Badged list */}
          <div className="lg:col-span-6 flex flex-col gap-5 justify-center">
            {skills.map((category) => (
              <div key={category.category} className="flex flex-col gap-2.5">
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  <div className="flex items-center gap-2 text-secondary">
                    {category.icon}
                    <span className="text-[10px] font-bold uppercase tracking-widest font-mono">{category.category}</span>
                  </div>
                  <div className="flex-1 h-px bg-card-border" />
                </div>
                <div className="flex flex-wrap gap-1.5 pl-6">
                  {category.items.map((item) => (
                    <Badge key={item} variant="outline" className="badge-hover text-xs py-1 px-2.5 cursor-default select-none border-white/5 bg-white/2 text-white/90">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionItem>

      {/* Experience Timeline */}
      <SectionItem className="flex flex-col gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-tight flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-foreground" /> Engineering Timeline
        </h2>
        
        <div className="relative pl-6 border-l border-card-border flex flex-col gap-8">
          {timeline.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full border border-foreground bg-background flex items-center justify-center transition-transform group-hover:scale-110">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-secondary font-mono bg-foreground/5 border border-card-border px-2.5 py-0.5 rounded-full">
                    {item.period}
                  </span>
                  <Badge variant={item.type === 'academic' ? 'outline' : item.type === 'research' ? 'primary' : 'secondary'} className="text-[9px] uppercase tracking-wider py-0.5">
                    {item.type}
                  </Badge>
                </div>
                
                <h3 className="text-sm font-bold text-foreground group-hover:text-foreground transition-colors">
                  {item.role} <span className="text-secondary font-medium">@ {item.organization}</span>
                </h3>
                
                <p className="text-xs text-secondary leading-relaxed max-w-3xl font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionItem>
    </SectionStagger>
  );
}
