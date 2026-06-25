'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projects } from '@/lib/data/projects';
import AIPreview from '@/components/sections/ai-preview';
import GitTelemetry from '@/components/sections/git-telemetry';
import { getCategoryLabel } from '@/lib/formatters/labels';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-elements';
import dynamic from 'next/dynamic';

const InteractiveTerminal = dynamic(() => import('@/components/ui/interactive-terminal'), {
  ssr: false,
  loading: () => <div className="w-full min-h-[220px] bg-black/45 border border-white/5 rounded-xl animate-pulse" />
});

const TechStackGraph = dynamic(() => import('@/components/ui/tech-stack-graph'), {
  ssr: false,
  loading: () => <div className="w-full min-h-[480px] bg-[#07070a] border border-white/5 rounded-2xl animate-pulse" />
});

const RecruiterModal = dynamic(() => import('@/components/ui/recruiter-modal'), { ssr: false });
import { motion, Variants } from 'framer-motion';
import {
  Code, Database, Server, Cpu, Globe,
  ArrowRight, Download, MapPin, Github, Mail, Linkedin,
  GraduationCap, Layout, ArrowUpRight, Terminal, Briefcase
} from 'lucide-react';

const techStack = [
  { category: 'Languages', icon: <Code className="h-3.5 w-3.5" />, items: ['TypeScript', 'JavaScript', 'Python', 'SQL'] },
  { category: 'Web', icon: <Globe className="h-3.5 w-3.5" />, items: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Three.js'] },
  { category: 'Backend', icon: <Server className="h-3.5 w-3.5" />, items: ['Node.js', 'Express', 'FastAPI', 'REST APIs'] },
  { category: 'Data & Infra', icon: <Database className="h-3.5 w-3.5" />, items: ['PostgreSQL', 'Supabase', 'MongoDB', 'Docker', 'AWS'] },
  { category: 'AI / ML', icon: <Cpu className="h-3.5 w-3.5" />, items: ['Gemini API', 'OpenAI API'] },
];

export default function Home() {
  const [isRecruiterOpen, setIsRecruiterOpen] = useState(false);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-20 md:gap-28 w-full max-w-6xl mx-auto py-8"
    >
      {/* ═══════════════════════════════════════════
          HERO — Full-Width Intro + Side Terminal
          ═══════════════════════════════════════════ */}
      <motion.section variants={itemVariants} className="no-print">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Main Hero — 3 cols */}
          <motion.div
            className="card-interactive lg:col-span-3 p-8 md:p-12 flex flex-col justify-between gap-10"
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center gap-2.5">
              <motion.span
                className="h-2 w-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-[11px] font-medium text-secondary tracking-widest uppercase font-mono">
                Available for Opportunities
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.05] tracking-tight">
                Vraj Patel
              </h1>
              <p className="text-base md:text-lg text-secondary max-w-lg leading-relaxed">
                3rd year CSE student at Nirma University. I build full-stack applications,
                ERP systems, and quantitative research platforms.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsRecruiterOpen(true)}
                className="px-4 py-2 border border-cyan-500/20 bg-cyan-950/15 hover:bg-cyan-900/30 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-cyan-950/5 relative overflow-hidden"
              >
                <Briefcase className="h-4 w-4 text-cyan-400" /> Summarize for Recruiter
              </button>
              <Link href="/resume">
                <Button variant="primary" size="md" className="flex items-center gap-2">
                  <Download className="h-4 w-4" /> Resume
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="secondary" size="md" className="flex items-center gap-2">
                  Projects <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Terminal — 2 cols */}
          <motion.div
            className="card-interactive lg:col-span-2 p-6 flex flex-col gap-4 overflow-hidden h-[340px] lg:h-auto justify-between"
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 shrink-0">
              <div className="flex items-center gap-1.5">
                <motion.div className="h-3 w-3 rounded-full bg-[#ff5f57]" whileHover={{ scale: 1.3 }} />
                <motion.div className="h-3 w-3 rounded-full bg-[#febc2e]" whileHover={{ scale: 1.3 }} />
                <motion.div className="h-3 w-3 rounded-full bg-[#28c840]" whileHover={{ scale: 1.3 }} />
              </div>
              <span className="text-[10px] text-muted ml-2 font-mono flex items-center gap-1 uppercase tracking-wider font-bold">
                <Terminal className="h-3 w-3" /> system console
              </span>
            </div>

            <div className="flex-1 flex flex-col mt-2">
              <InteractiveTerminal />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          INFO ROW — Stats, Education, Location + Socials
          ═══════════════════════════════════════════ */}
      <motion.section variants={itemVariants} className="no-print">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {/* Stats — Projects */}
          <motion.div
            className="card-interactive p-6 flex flex-col justify-center gap-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <AnimatedCounter target={10} suffix="+" className="text-4xl font-bold text-foreground" />
            <span className="text-[11px] text-muted uppercase tracking-widest font-mono">Projects</span>
          </motion.div>

          {/* Stats — Clients */}
          <motion.div
            className="card-interactive p-6 flex flex-col justify-center gap-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <AnimatedCounter target={5} suffix="+" className="text-4xl font-bold text-foreground" />
            <span className="text-[11px] text-muted uppercase tracking-widest font-mono">Client Systems</span>
          </motion.div>

          {/* Education */}
          <motion.div
            className="card-interactive p-6 flex flex-col justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <GraduationCap className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-medium text-foreground">B.Tech CSE</p>
              <p className="text-[11px] text-muted font-mono mt-0.5">Nirma University</p>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xs text-muted font-mono">CGPA</span>
              <AnimatedCounter target={798} divisor={100} decimals={2} className="text-sm font-bold text-foreground font-mono" duration={1200} />
            </div>
          </motion.div>

          {/* Location + Socials */}
          <motion.div
            className="card-interactive p-6 flex flex-col justify-between gap-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">Ahmedabad, IN</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="https://github.com/Vraj3005" target="_blank" rel="noopener noreferrer"
                className="icon-glow h-8 w-8 rounded-lg border border-card-border bg-card-bg flex items-center justify-center text-secondary"
                title="GitHub (Personal)">
                <Github className="h-3.5 w-3.5" />
              </a>
              <a href="https://github.com/23bce377-debug" target="_blank" rel="noopener noreferrer"
                className="icon-glow h-8 w-8 rounded-lg border border-cyan-500/20 bg-cyan-950/10 hover:bg-cyan-900/20 flex items-center justify-center text-cyan-400 hover:text-cyan-300"
                title="GitHub (Academic/Debug)">
                <Github className="h-3.5 w-3.5" />
              </a>
              <a href="https://www.linkedin.com/in/vraj-patel-9502a6285" target="_blank" rel="noopener noreferrer"
                className="icon-glow h-8 w-8 rounded-lg border border-card-border bg-card-bg flex items-center justify-center text-secondary"
                title="LinkedIn">
                <Linkedin className="h-3.5 w-3.5" />
              </a>
              <a href="mailto:patelvrajpatel30@gmail.com"
                className="icon-glow h-8 w-8 rounded-lg border border-card-border bg-card-bg flex items-center justify-center text-secondary"
                title="Email">
                <Mail className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          TECH STACK
          ═══════════════════════════════════════════ */}
      <motion.section variants={itemVariants} className="flex flex-col gap-10">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono">Toolkit</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">Technical Stack</h2>
          <div className="flex items-center gap-2 mt-1">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-muted uppercase tracking-widest font-mono">Always Improving</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-6xl mx-auto">
          {/* Left Column: Interactive network graph */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <TechStackGraph />
          </div>

          {/* Right Column: Badged list */}
          <div className="lg:col-span-6 flex flex-col gap-5 justify-center">
            {techStack.map((category, catIdx) => (
              <motion.div
                key={category.category}
                className="flex flex-col gap-2.5"
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: catIdx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
              >
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          SELECTED PROJECTS
          ═══════════════════════════════════════════ */}
      <motion.section variants={itemVariants} className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" /> Work
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">Selected Projects</h2>
          </div>
          <Link href="/projects">
            <Button variant="secondary" size="sm" className="flex items-center gap-1.5">
              All Projects <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredProjects.map((project, idx) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <div className="card-interactive p-6 flex flex-col gap-4 h-full group-hover:border-[#444]">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {getCategoryLabel(project.category)}
                    </Badge>
                    <motion.div
                      className="h-6 w-6 rounded-md bg-white/[0.03] border border-card-border flex items-center justify-center text-muted"
                      whileHover={{ scale: 1.2 }}
                    >
                      <ArrowUpRight className="h-3 w-3 group-hover:text-foreground transition-colors" />
                    </motion.div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-white transition-colors">{project.title}</h3>
                    <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                      {project.shortDescription}
                    </p>
                  </div>

                  {project.metrics && project.metrics.length > 0 && (
                    <div className="flex items-center gap-4 text-xs">
                      {project.metrics.slice(0, 2).map((m, mIdx) => (
                        <span key={mIdx} className="text-secondary font-mono">
                          <span className="text-foreground font-medium">{m.value}</span> {m.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-card-border">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono font-medium text-muted border border-card-border px-2 py-0.5 rounded-md badge-hover"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-[10px] text-muted font-mono self-center">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          AI PREVIEW
          ═══════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <AIPreview />
      </motion.div>

      {/* ═══════════════════════════════════════════
          GITHUB ACTIVITY
          ═══════════════════════════════════════════ */}
      <motion.div variants={itemVariants}>
        <GitTelemetry />
      </motion.div>

      {/* ═══════════════════════════════════════════
          BOTTOM CTAs
          ═══════════════════════════════════════════ */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print mb-6">
        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <Card className="p-8 flex flex-col gap-4 justify-between h-full">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Layout className="h-3.5 w-3.5" /> Resume
              </span>
              <h3 className="text-lg font-semibold text-foreground">Need a PDF?</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Single-page A4, ATS-compatible format.
              </p>
            </div>
            <Link href="/resume" className="self-start mt-2">
              <Button variant="primary" size="md" className="flex items-center gap-2">
                View Resume <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <Card className="p-8 flex flex-col gap-4 justify-between h-full">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-secondary uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Contact
              </span>
              <h3 className="text-lg font-semibold text-foreground">Let&apos;s work together</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Open for internships, freelance, and collaborations.
              </p>
            </div>
            <Link href="/contact" className="self-start mt-2">
              <Button variant="secondary" size="md" className="flex items-center gap-2">
                Send Message <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </Card>
        </motion.div>
      </motion.section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': 'Vraj Patel',
            'url': 'https://vrajpatel.dev',
            'email': 'patelvrajpatel30@gmail.com',
            'telephone': '+91 79902 51191',
            'jobTitle': 'Full-Stack Architect & Quant Research Developer',
            'alumniOf': {
              '@type': 'CollegeOrUniversity',
              'name': 'Nirma University'
            },
            'sameAs': [
              'https://github.com/Vraj3005',
              'https://github.com/23bce377-debug',
              'https://www.linkedin.com/in/vraj-patel-9502a6285'
            ]
          })
        }}
      />

      <RecruiterModal isOpen={isRecruiterOpen} onClose={() => setIsRecruiterOpen(false)} />
    </motion.div>
  );
}
