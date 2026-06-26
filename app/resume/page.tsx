'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Mail, Phone, MapPin } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { EventBus } from '@/lib/events/event-bus';

export default function Resume() {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handlePrint = async () => {
    window.print();
    try {
      if (isSupabaseConfigured) {
        const supabaseClient = supabase as any;
        await supabaseClient.from('resume_downloads').insert({
          user_ip: 'anonymous',
          referral_source: document.referrer || 'direct'
        });
      }
      
      await EventBus.publish(
        'portfolio',
        'success',
        'Resume PDF print/save action triggered.',
        { referral: document.referrer || 'direct' }
      );
    } catch (err) {
      console.warn('Failed to log resume download telemetry:', err);
    }
  };

  const handleCopySummary = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const shortSummaryText = `Highly technical CSE student at Nirma University. Architects robust web applications, custom pricing ERP platforms (Enermass, Bhagwati), and quantitative market research tools (regime discovery, options pricing engines).`;

  const fullStackSummaryText = `Computer Science Undergrad with proven expertise building client ERP architectures. Experienced shipping next-generation full-stack solutions, custom pricing matrices, and database query optimizations. Proficient with Next.js, Express, FastAPI, PostgreSQL, and Supabase RLS policies.`;

  const aiSummaryText = `AI/Automation developer specialized in Google GenAI SDK integrations and LLM workflow operations. Experienced scraping target company pages using Gemini API with structured JSON output configurations. Proficient configuring robust async background task handlers.`;

  const quantSummaryText = `Quantitative developer and mathematical modeler. Built Hidden Markov Model (HMM) volatility trackers for NIFTY 50 (hmmlearn, statsmodels) and Option implied volatility calculators using Python math solver pipelines (FastAPI, NumPy, Pandas).`;

  return (
    <div className="py-6 md:py-10 max-w-4xl mx-auto w-full flex flex-col gap-8 px-4 sm:px-6">
      {/* Interactive PDF Control Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6 no-print shrink-0">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary font-mono">Academic & Career Record</span>
          <h1 className="text-xl md:text-2xl font-medium font-serif text-foreground tracking-tight">Vraj Patel Resume</h1>
        </div>
        <Button
          onClick={handlePrint}
          variant="primary"
          size="md"
          className="flex items-center justify-center gap-2 self-start sm:self-auto font-bold"
        >
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </Button>
      </div>

      {/* Resume Intelligence Dashboard */}
      <div className="bg-card-bg border border-card-border rounded-2xl p-5 no-print flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.01),transparent_60%)] pointer-events-none" />
        <div className="flex items-center justify-between border-b border-white/5 pb-2.5 relative z-10">
          <span className="text-[10px] text-muted font-mono uppercase font-bold tracking-wider">Resume Intelligence Console</span>
          {copyStatus && (
            <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
              ✓ {copyStatus} copied to clipboard!
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 relative z-10">
          <button
            onClick={() => handleCopySummary('Short Summary', shortSummaryText)}
            className="flex flex-col items-center justify-center p-3 text-center border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all gap-0.5"
          >
            <span className="text-white font-bold text-xs">Short Bio</span>
            <span className="text-[9px] text-muted font-mono">General summary</span>
          </button>
          
          <button
            onClick={() => handleCopySummary('Full-Stack Summary', fullStackSummaryText)}
            className="flex flex-col items-center justify-center p-3 text-center border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all gap-0.5"
          >
            <span className="text-white font-bold text-xs">Full-Stack Summary</span>
            <span className="text-[9px] text-muted font-mono">Web stack spec</span>
          </button>

          <button
            onClick={() => handleCopySummary('AI Automation Summary', aiSummaryText)}
            className="flex flex-col items-center justify-center p-3 text-center border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all gap-0.5"
          >
            <span className="text-white font-bold text-xs">AI Automation</span>
            <span className="text-[9px] text-muted font-mono">Agent structures</span>
          </button>

          <button
            onClick={() => handleCopySummary('Quant Summary', quantSummaryText)}
            className="flex flex-col items-center justify-center p-3 text-center border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all gap-0.5"
          >
            <span className="text-white font-bold text-xs">Quant Research</span>
            <span className="text-[9px] text-muted font-mono">Finance & math</span>
          </button>

          <button
            onClick={handlePrint}
            className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-3 text-center border border-cyan-500/20 bg-cyan-950/15 hover:bg-cyan-900/35 text-cyan-400 hover:text-cyan-300 rounded-xl cursor-pointer transition-all gap-0.5"
          >
            <span className="font-bold text-xs flex items-center gap-1"><Printer className="h-3 w-3.5" /> Download PDF</span>
            <span className="text-[9px] font-mono">Launch A4 print</span>
          </button>
        </div>
      </div>

      {/* Main Resume Card Sheet */}
      <Card className="p-8 md:p-12 shadow-2xl relative print-container overflow-hidden">
        {/* Decorative corner accent on screen, hidden on print */}
        <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-foreground/5 to-transparent pointer-events-none rounded-bl-full no-print" />

        <div className="flex flex-col gap-8">
          
          {/* Section 1: Header / Name / Title */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-card-border pb-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl md:text-3xl font-bold font-serif text-foreground print:text-black tracking-tight">Vraj Patel</h2>
              <span className="text-xs md:text-sm font-semibold tracking-wider text-secondary print:text-primary uppercase">
                Full-Stack Architect · AI/ERP Systems Builder · Quant Research Enthusiast
              </span>
            </div>
            
            {/* Quick contact rows */}
            <div className="flex flex-col gap-1.5 text-xs text-secondary print:text-gray-800 font-semibold font-mono">
              <a href="mailto:patelvrajpatel30@gmail.com" className="flex items-center gap-2 hover:underline">
                <Mail className="h-3.5 w-3.5 text-foreground print:text-black" /> patelvrajpatel30@gmail.com
              </a>
              <a href="tel:+917990251191" className="flex items-center gap-2 hover:underline">
                <Phone className="h-3.5 w-3.5 text-foreground print:text-black" /> +91 79902 51191
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-foreground print:text-black" /> Gujarat, India
              </span>
            </div>
          </div>

          {/* Section 2: Summary / Bio */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground print:text-black border-b border-card-border pb-1 font-mono">
              Professional Profile
            </h3>
            <p className="text-xs md:text-sm text-secondary print:text-gray-700 leading-relaxed font-medium">
              Highly technical Computer Science and Engineering student at Nirma University, specialized in architecting and shipping production-level business ERP models, high-performance Next.js and Node.js APIs, and quantitative research projection tools. Skilled in system performance tuning, structured AI multi-agent prompts, database optimizations, and client communication.
            </p>
          </div>

          {/* Section 3: Education */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground print:text-black border-b border-card-border pb-1 font-mono">
              Education
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start text-xs md:text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold font-serif text-foreground print:text-black">Bachelor of Technology (B.Tech) - Computer Science & Engineering</span>
                  <span className="text-secondary print:text-gray-700 font-medium">Nirma University · Gujarat, India</span>
                </div>
                <div className="flex flex-col items-end text-[10px] md:text-xs font-bold text-secondary print:text-primary font-mono">
                  <span>2023 - 2027</span>
                  <span>CGPA: 7.98 / 10.0</span>
                </div>
              </div>
              <p className="text-xs text-secondary print:text-gray-600 leading-relaxed font-medium">
                Core coursework: Data Structures & Algorithms, Database Management Systems, System Design, Computer Networks, Operating Systems, Quantitative Finance modeling.
              </p>
            </div>
          </div>

          {/* Section 3.5: Professional Experience */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground print:text-black border-b border-card-border pb-1 font-mono">
              Professional Experience
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start text-xs md:text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold font-serif text-foreground print:text-black">Software Engineering Intern</span>
                  <span className="text-secondary print:text-gray-700 font-medium">Pitbull Corporation · Gujarat, India</span>
                </div>
                <div className="flex flex-col items-end text-[10px] md:text-xs font-bold text-secondary print:text-primary font-mono">
                  <span>May 2026 - Jul 2026</span>
                </div>
              </div>
              <p className="text-xs text-secondary print:text-gray-600 leading-relaxed font-medium">
                Engineered and delivered core client ERP systems and B2B layouts (Bhagwati Interior ERP, Enermass Solar Calculator, Driedhub, Marea, and Surendra website). Built performant data sync logic, automated GST invoice pipelines, and optimized Three.js/scroll rendering interfaces.
              </p>
            </div>
          </div>

          {/* Section 4: Projects (Resume format) */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground print:text-black border-b border-card-border pb-1 font-mono">
              Key Project Portfolio
            </h3>
            
            <div className="flex flex-col gap-4">
              {/* Project 1: OutreachOps AI */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold font-serif text-foreground print:text-black">OutreachOps AI (AI Coldmail) · <span className="text-[10px] text-muted italic">100% Personal Project</span></span>
                  <span className="text-[10px] font-bold text-secondary print:text-primary font-mono">Feb 2026 - Apr 2026</span>
                </div>
                <p className="text-secondary print:text-gray-700 leading-relaxed text-[11px] md:text-xs font-medium">
                  Developed an autonomous outbound personalization email campaign SaaS. Integrated Gemini API structured JSON mode to scrape lead details, personalize drafts, and sequence dispatches via Gmail OAuth APIs.
                </p>
              </div>

              {/* Project 2: MSPE */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold font-serif text-foreground print:text-black">Market Surface Projection Engine (MSPE) · <span className="text-[10px] text-muted italic">100% Personal Project</span></span>
                  <span className="text-[10px] font-bold text-secondary print:text-primary font-mono">Oct 2025 - Dec 2025</span>
                </div>
                <p className="text-secondary print:text-gray-700 leading-relaxed text-[11px] md:text-xs font-medium">
                  Built options pricing and volatility surface modeling web calculator. Created FastAPI mathematics backend using GARCH, Pandas, and statsmodels models, visualizing 3D skews in-browser.
                </p>
              </div>

              {/* Project 3: NF-LRD */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold font-serif text-foreground print:text-black">NF-LRD NIFTY 50 Regime Discovery · <span className="text-[10px] text-muted italic">100% Personal Project</span></span>
                  <span className="text-[10px] font-bold text-secondary print:text-primary font-mono">Sep 2025 - Nov 2025</span>
                </div>
                <p className="text-secondary print:text-gray-700 leading-relaxed text-[11px] md:text-xs font-medium">
                  Designed quantitative research platform to segment Nifty 50 market trend transitions using Hidden Markov Models (HMM). Implemented statistical feature extraction and analytics using statsmodels and hmmlearn libraries.
                </p>
              </div>

              {/* Project 4: Enermass */}
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold font-serif text-foreground print:text-black">Enermass Solar Calculator & ERP · <span className="text-[10px] text-muted italic">Collaboration Project</span></span>
                  <span className="text-[10px] font-bold text-secondary print:text-primary font-mono">May 2026 - Jun 2026</span>
                </div>
                <p className="text-secondary print:text-gray-700 leading-relaxed text-[11px] md:text-xs font-medium">
                  Co-engineered a client-side rooftop solar capacity and pricing calculator. Implemented state-specific government subsidy formulas (PM Surya Ghar brackets) and dynamic material inventory cost configurations.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Technical Competencies */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground print:text-black border-b border-card-border pb-1 font-mono">
              Technical Skill Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="flex flex-col gap-1.5">
                <span className="text-secondary print:text-gray-600 font-bold uppercase text-[9px] tracking-wide font-mono">Systems & Languages:</span>
                <span className="text-foreground print:text-black font-semibold">
                  TypeScript, Python, SQL, JavaScript, HTML/CSS
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-secondary print:text-gray-600 font-bold uppercase text-[9px] tracking-wide font-mono">Frameworks & Tools:</span>
                <span className="text-foreground print:text-black font-semibold">
                  Next.js, Node.js, Express, FastAPI, PostgreSQL, MongoDB Atlas, Docker
                </span>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
