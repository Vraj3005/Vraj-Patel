'use client';

import { motion, Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Briefcase, GraduationCap, ChevronRight, Award, Server, Database, Layout } from 'lucide-react';

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
    organization: 'Pitbull Corporation',
    description: 'Engineered and delivered core client ERP platforms and e-commerce websites (Enermass Solar Calculator, Bhagwati Interior ERP, Driedhub Marketplace, Marea Luxury Storefront, and Surendra website) during a 2-month summer internship, designing database schemas and optimizing visual layouts.',
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

const skills = [
  {
    category: 'Languages',
    icon: <Server className="h-4 w-4 text-foreground" />,
    items: ['TypeScript', 'JavaScript', 'Go (Golang)', 'Python', 'C++', 'SQL'],
  },
  {
    category: 'Frontend Development',
    icon: <Layout className="h-4 w-4 text-foreground" />,
    items: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Three.js', 'Recharts', 'Redux Toolkit'],
  },
  {
    category: 'Backend & APIs',
    icon: <Database className="h-4 w-4 text-foreground" />,
    items: ['Node.js', 'Express', 'FastAPI', 'gRPC microservices', 'RESTful APIs', 'Zod validation'],
  },
  {
    category: 'Databases & Systems',
    icon: <Server className="h-4 w-4 text-foreground" />,
    items: ['PostgreSQL', 'Redis caching', 'Supabase', 'MongoDB Atlas', 'AWS S3', 'Docker'],
  },
];

export default function About() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-12 max-w-5xl mx-auto py-6 md:py-10"
    >
      {/* Intro Header */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono">Identity & Background</span>
        <h1 className="text-3xl md:text-4xl font-serif text-foreground tracking-tight font-medium">
          Engineering Scalable Business Systems
        </h1>
        <p className="text-sm md:text-base text-secondary leading-relaxed max-w-3xl mt-1 font-medium">
          I am Vraj Patel, a third-year Computer Science and Engineering student at Nirma University. 
          I focus on building functional business products—like custom ERP pipelines and quantitative visualizers—rather than toy projects. I enjoy bridging the gap between database designs and slick, interactive client interfaces.
        </p>
      </motion.div>

      {/* Grid: Academic profile card & values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="md:col-span-1">
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
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
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
        </motion.div>
      </div>

      {/* Technical Skill Matrix */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6">
        <h2 className="text-xl font-serif font-medium text-foreground tracking-tight flex items-center gap-2">
          <Server className="h-5 w-5 text-foreground" /> The Technical Skill Matrix
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((category) => (
            <Card key={category.category} className="p-5 flex flex-col gap-4 hover:border-foreground/15 transition-colors">
              <div className="flex items-center gap-2 border-b border-card-border pb-3">
                {category.icon}
                <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">{category.category}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((skill) => (
                  <Badge key={skill} variant="outline" className="text-[10px] py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Experience Timeline */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6">
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
      </motion.div>
    </motion.div>
  );
}
