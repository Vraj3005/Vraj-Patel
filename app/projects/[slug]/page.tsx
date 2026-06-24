'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ExternalLink, Github, Cpu, ShieldCheck, Zap, Database, 
  Sparkles, Terminal, User, Bot, Server, Award, CheckCircle, Lightbulb, Send
} from 'lucide-react';
import { projects } from '@/lib/data/projects';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCategoryLabel } from '@/lib/formatters/labels';
import dynamic from 'next/dynamic';
import ArchitectureViewer from '@/components/ui/architecture-viewer';

// Dynamically lazy-load large visualizers inside case studies
const SystemVisualizer = dynamic(() => import('@/components/visualizers/system-visualizer'), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-xs font-mono text-secondary">Initializing System visualization...</div>
});

const DataFlowExplorer = dynamic(() => import('@/components/visualizers/data-flow-explorer'), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-xs font-mono text-secondary">Initializing Data flow tracker...</div>
});

const SecurityVisualizer = dynamic(() => import('@/components/security/security-visualizer'), {
  ssr: false,
  loading: () => <div className="py-8 text-center text-xs font-mono text-secondary">Initializing Security stack profile...</div>
});

interface ProjectPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export default function ProjectCaseStudy({ params }: ProjectPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imgErrorSlug, setImgErrorSlug] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  // Unwrap params safely and initialize welcome message
  useEffect(() => {
    Promise.resolve(params).then((resolved) => {
      setSlug(resolved.slug);
      const foundProject = projects.find((p) => p.slug === resolved.slug);
      if (foundProject) {
        setMessages([
          {
            id: 'welcome',
            role: 'assistant',
            content: `Hi there! I can answer questions about Vraj's work on "${foundProject.title}". Ask me about its database schema, system architecture, how Vraj resolved its core bottlenecks, or what future updates are planned!`,
          },
        ]);
      }
    });
  }, [params]);

  const project = projects.find((p) => p.slug === slug);
  const isImgError = imgErrorSlug === slug;
  const imgSrc = (isImgError && project?.image)
    ? 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50" viewBox="0 0 100 50" style="background:%23000;"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23333" font-family="sans-serif" font-size="10">Vraj Patel Portfolio</text></svg>'
    : project?.image || '';

  // Auto-scroll chat thread to bottom
  const scrollToBottom = () => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isLoading]);

  if (slug && !project) {
    notFound();
  }

  if (!project) {
    return (
      <div className="py-20 text-center text-secondary font-mono text-xs">
        Loading case study parameters...
      </div>
    );
  }

  // Handle message send submission
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Package conversation history with project context prefixed to user prompt
      const chatHistory = messages.map((m) => ({
        role: m.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.content }],
      }));

      // Add project-specific context instructions in user request
      const promptWithContext = `[Context: Asking about Vraj's project "${project.title}"] ${textToSend}`;

      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptWithContext,
          history: chatHistory,
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            role: 'assistant',
            content: data.response,
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to fetch AI response.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: generateId(),
          role: 'assistant',
          content: 'I had trouble processing that query. Please ask me again or check the static details on this page.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 md:py-10 max-w-5xl mx-auto flex flex-col gap-10 md:gap-14 w-full">
      {/* 13. Back Button Navigation Link */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-foreground transition-colors font-mono"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Systems Directory
        </Link>
      </div>

      {/* 1. Hero Section */}
      <div className="flex flex-col gap-6 md:gap-8 border-b border-card-border pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading and info */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary font-mono">
                {getCategoryLabel(project.category)}
              </span>
              <span className="text-secondary font-mono text-xs">•</span>
              <span className="text-secondary font-mono text-xs font-semibold">{project.period}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-medium font-serif text-foreground tracking-tight">
              {project.title}
            </h1>
            
            <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium mt-1">
              {project.description}
            </p>

            {/* Quick Actions / 13. Links */}
            <div className="flex flex-wrap gap-3 mt-3">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary" size="md" className="gap-2 text-xs font-bold">
                    <ExternalLink className="h-3.5 w-3.5" /> Launch Live Module
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="secondary" size="md" className="gap-2 text-xs font-bold">
                    <Github className="h-3.5 w-3.5" /> View Source Code
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Featured Image */}
          <div className="lg:col-span-5 w-full">
            {project.image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-card-border shadow-md bg-foreground/5">
                <Image 
                  src={imgSrc} 
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  onError={() => {
                    if (slug) {
                      setImgErrorSlug(slug);
                    }
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Project Metadata Parameters & Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core parameters */}
        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-card-border pb-2 font-mono">
            System Parameters
          </h3>
          <div className="flex flex-col gap-3.5 text-xs font-medium">
            <div className="flex justify-between">
              <span className="text-secondary font-mono">My Role:</span>
              <span className="text-foreground font-bold">{project.role}</span>
            </div>
            {project.client && (
              <div className="flex justify-between">
                <span className="text-secondary font-mono">Client/Organization:</span>
                <span className="text-foreground font-bold">{project.client}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-secondary font-mono">Status:</span>
              <span className="text-foreground font-bold">{project.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary font-mono">Year:</span>
              <span className="text-foreground font-bold font-mono">{project.year}</span>
            </div>
          </div>
        </Card>

        {/* Realized Metrics Grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {project.metrics.map((metric, idx) => (
            <Card
              key={idx}
              className="p-5 flex flex-col items-center justify-center text-center gap-1.5"
            >
              <span className="text-2xl md:text-3xl font-black text-foreground font-serif">{metric.value}</span>
              <span className="text-[10px] text-secondary uppercase font-bold tracking-wider font-mono">
                {metric.label}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. Problem & 3. Why I Built It */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
            <ShieldCheck className="h-5 w-5 text-foreground shrink-0" /> 2. The Core Problem
          </h2>
          <p className="text-xs md:text-sm text-secondary leading-relaxed font-medium">
            {project.problem}
          </p>
        </Card>

        <Card className="p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
            <Award className="h-5 w-5 text-foreground shrink-0" /> 3. Why Vraj Built It
          </h2>
          <p className="text-xs md:text-sm text-secondary leading-relaxed font-medium">
            {project.whyBuilt}
          </p>
        </Card>
      </div>

      {/* 4. The Engineering Solution */}
      <Card className="p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
          <Zap className="h-5 w-5 text-foreground shrink-0" /> 4. The Engineering Solution
        </h2>
        <p className="text-xs md:text-sm text-secondary leading-relaxed font-medium">
          {project.solution}
        </p>
      </Card>

      {/* 6. System Architecture Explorer */}
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
          <Server className="h-5 w-5 text-foreground shrink-0" /> 6. System Architecture Explorer
        </h2>
        <p className="text-xs md:text-sm text-secondary leading-relaxed font-medium max-w-3xl">
          {project.architecture}
        </p>
        <SystemVisualizer projectSlug={project.slug} />
        
        {/* Render Data Flow Explorer if project has matching flow */}
        {['enermass-solar-calculator', 'bhagwati-interior-erp', 'outreachops-ai', 'driedhub-marketplace', 'mspe-volatility-engine', 'nf-lrd-regime-discovery', 'btc-algo-trading'].includes(project.slug) && (
          <div className="mt-4 pt-4 border-t border-card-border">
            <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider select-none mb-3 block">System Transaction Flow Progression</span>
            <DataFlowExplorer projectSlug={project.slug} allowFlowSwitching={false} />
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-card-border">
          <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider select-none mb-3 block">Alternative Static Tabbed Spec Matrix</span>
          <ArchitectureViewer slug={project.slug} />
        </div>

        <div className="mt-4 pt-4 border-t border-card-border">
          <span className="text-[10px] font-mono text-secondary uppercase font-bold tracking-wider select-none mb-3 block">Active Security Layer Stack Architecture</span>
          <SecurityVisualizer projectSlug={project.slug} />
        </div>
      </div>

      {/* 7. Database / Backend Logic & 5. Key Features */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        
        {/* Database */}
        <Card className="lg:col-span-3 p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
            <Database className="h-5 w-5 text-foreground shrink-0" /> 7. Database & Backend Logic
          </h2>
          <p className="text-xs md:text-sm text-secondary leading-relaxed font-medium">
            {project.dbBackendLogic}
          </p>
        </Card>

        {/* Features */}
        <Card className="lg:col-span-2 p-6 md:p-8 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
            <CheckCircle className="h-5 w-5 text-foreground shrink-0" /> 5. Key System Features
          </h2>
          <ul className="flex flex-col gap-3 text-xs text-secondary font-medium">
            {project.features.map((feature, idx) => (
              <li key={idx} className="flex gap-2.5 items-start">
                <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </Card>

      </div>

      {/* 8. UI Screens */}
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
          <Terminal className="h-5 w-5 text-foreground" /> 8. UI Workspaces & Screens
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {project.uiScreens.map((screen, idx) => (
            <Card key={idx} className="p-6 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-secondary font-mono uppercase tracking-wider">Workspace {idx + 1}</span>
              <h4 className="text-sm font-bold text-foreground font-serif">{screen.title}</h4>
              <p className="text-xs text-secondary leading-relaxed font-medium">
                {screen.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* 9. Tech Stack & 11. What I Learned */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tech Stack */}
        <Card className="p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-card-border pb-2 font-mono">
            9. Technologies Utilized
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </Card>

        {/* What I Learned */}
        <Card className="md:col-span-2 p-6 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-card-border pb-2 font-mono">
            11. Key Technical Insights
          </h3>
          <p className="text-xs text-secondary leading-relaxed font-medium">
            {project.whatILearned}
          </p>
        </Card>
      </div>

      {/* 10. Engineering Bottlenecks & Solutions (Challenges) */}
      <div className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
          <Cpu className="h-5 w-5 text-foreground" /> 10. Engineering Challenges & Solutions
        </h2>
        
        <div className="flex flex-col gap-6">
          {project.challenges.map((challenge, idx) => (
            <Card
              key={idx}
              className="p-0 overflow-hidden flex flex-col divide-y divide-card-border"
            >
              {/* Problem Column */}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-secondary font-mono tracking-wider">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-secondary" />
                  <span>CHALLENGE / BOTTLENECK</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed font-semibold">
                  {challenge.problem}
                </p>
              </div>
              
              {/* Solution Column */}
              <div className="p-5 bg-foreground/[0.01] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-foreground font-mono tracking-wider">
                  <Zap className="h-4 w-4 shrink-0 text-foreground" />
                  <span>IMPLEMENTED RESOLUTION</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed font-medium">
                  {challenge.solution}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 12. Future Improvements */}
      <Card className="p-6 md:p-8 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2 font-serif">
          <Lightbulb className="h-5 w-5 text-foreground" /> 12. Future Roadmap & Enhancements
        </h2>
        <ul className="flex flex-col gap-3 text-xs text-secondary font-medium">
          {project.futureImprovements.map((improvement, idx) => (
            <li key={idx} className="flex gap-2.5 items-start">
              <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-1.5 shrink-0" />
              <span className="leading-relaxed">{improvement}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* 14. Ask AI About This Project Widget */}
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex items-center justify-between border-b border-card-border pb-4 shrink-0">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
              <Sparkles className="h-4 w-4 text-foreground" /> System Telemetry Agent
            </span>
            <h2 className="text-xl md:text-2xl font-medium font-serif text-foreground tracking-tight flex items-center gap-2">
              Ask AI About {project.title}
            </h2>
          </div>
        </div>

        {/* Conversation Box */}
        <Card className="flex flex-col overflow-hidden p-0 relative min-h-[350px] max-h-[500px]">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

          {/* Messages Feed */}
          <div ref={feedRef} className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-thin relative z-10">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
                  >
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 ${
                        isUser
                          ? 'bg-foreground border-foreground text-background'
                          : 'bg-foreground/5 border-card-border text-foreground'
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-foreground text-background font-medium border border-foreground rounded-tr-none'
                          : 'bg-foreground/[0.03] text-foreground border border-card-border rounded-tl-none'
                      }`}
                    >
                      {message.content.split('\n').map((line, index) => (
                        <p key={index} className={index > 0 ? 'mt-2' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 self-start"
                >
                  <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-card-border flex items-center justify-center text-foreground shrink-0 animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-foreground/[0.03] border border-card-border rounded-2xl rounded-tl-none px-5 py-3.5 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inputs Bar */}
          <div className="p-4 border-t border-card-border bg-foreground/[0.01] relative z-10 flex flex-col gap-3.5">
            <div className="flex flex-wrap gap-2 select-none">
              <button
                type="button"
                onClick={() => handleSendMessage(`Explain the ${project.title} project simply in plain English, avoiding complex technical jargon.`)}
                className="text-[10px] font-bold text-sky-400 hover:text-white bg-sky-950/20 hover:bg-sky-900/40 border border-sky-900/30 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 font-mono"
              >
                <Lightbulb className="h-3 w-3 text-sky-400" /> Explain Simply
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Provide a deep technical breakdown of the ${project.title} project's core algorithms, data structures, and how Vraj resolved its performance bottlenecks.`)}
                className="text-[10px] font-bold text-cyan-400 hover:text-white bg-cyan-950/20 hover:bg-cyan-900/40 border border-cyan-900/30 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 font-mono"
              >
                <Cpu className="h-3 w-3 text-cyan-400" /> Explain Technically
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Summarize the ${project.title} project's value proposition for a recruiter, highlighting Vraj's role, quantitative impact metrics, and engineering mindset.`)}
                className="text-[10px] font-bold text-amber-400 hover:text-white bg-amber-955/20 hover:bg-amber-900/40 border border-amber-900/30 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 font-mono"
              >
                <Award className="h-3 w-3 text-amber-400" /> Explain for Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage(`Detail the system architecture layer structure of the ${project.title} project, focusing on frontend, backend, database schema, and security strategies.`)}
                className="text-[10px] font-bold text-emerald-400 hover:text-white bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/30 px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1 font-mono"
              >
                <Server className="h-3 w-3 text-emerald-400" /> Explain Architecture
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <Input
                type="text"
                placeholder={`Ask about system mechanics, trade-offs, or schemas used in ${project.title}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 flex items-center justify-center p-3 rounded-xl aspect-square"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': project.title,
            'operatingSystem': 'All',
            'applicationCategory': project.category === 'quant_research' ? 'FinanceApplication' : 'BusinessApplication',
            'description': project.shortDescription || project.description.substring(0, 160)
          })
        }}
      />
    </div>
  );
}
