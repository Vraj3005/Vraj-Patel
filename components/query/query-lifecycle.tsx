'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase/client';
import { RequestTraceRecord } from '@/types/advanced';
import { 
  Activity, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Search, Info 
} from 'lucide-react';

interface StaticWorkflowStage {
  name: string;
  component: string;
  durationMs: number;
  status: 'success' | 'warning' | 'error' | 'optional';
  recruiterExplanation: string;
  technicalExplanation: string;
  codeSnippet: string;
  language: string;
}

interface StaticWorkflow {
  id: string;
  title: string;
  description: string;
  method: string;
  path: string;
  totalDurationMs: number;
  stages: StaticWorkflowStage[];
}

const STATIC_WORKFLOWS: Record<string, StaticWorkflow> = {
  'ask-vraj': {
    id: 'ask-vraj',
    title: 'Ask Vraj AI Query',
    description: 'Traces prompt evaluation from client search inputs to stateless Gemini streaming responses.',
    method: 'POST',
    path: '/api/ask',
    totalDurationMs: 1130,
    stages: [
      {
        name: 'Client Dispatch & Validation',
        component: 'Client Browser UI',
        durationMs: 5,
        status: 'success',
        recruiterExplanation: 'Validates input constraints (non-empty fields, max lengths) to ensure prompt validity before sending.',
        technicalExplanation: 'React Hook Form evaluates inputs, preventing submissions that violate min/max character lengths.',
        language: 'typescript',
        codeSnippet: `const aiQuerySchema = z.object({
  prompt: z.string().min(3).max(350),
  sessionId: z.string().uuid()
});`
      },
      {
        name: 'IP Rate Limiting (In-Memory Check)',
        component: 'Middleware Layer',
        durationMs: 28,
        status: 'success',
        recruiterExplanation: 'Limits IP addresses to 10 queries per minute to manage API costs and prevent spam.',
        technicalExplanation: 'API route checks in-memory Map counters, blocking client IP addresses from proceeding on limits overflow.',
        language: 'typescript',
        codeSnippet: `if (isRateLimited(ip, 10, 60 * 1000)) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}`
      },
      {
        name: 'Context Enrichment assembly',
        component: 'Server Business Logic',
        durationMs: 120,
        status: 'success',
        recruiterExplanation: 'Retrieves Vraj\'s background context, projects list, and resume details to form the model context.',
        technicalExplanation: 'Injects localized markdown profile context and project mappings into system instruction buffers.',
        language: 'typescript',
        codeSnippet: `const context = getLocalPortfolioContext();
const systemPrompt = \`\${basePrompt}\\n\\nContext:\\n\${context}\`;`
      },
      {
        name: 'Gemini Generative API Call',
        component: 'External LLM Gateway',
        durationMs: 932,
        status: 'success',
        recruiterExplanation: 'Dispatches compiled prompts to Google Gemini API to yield dynamic text streams.',
        technicalExplanation: 'Sends payload using server-only process env keys, returning readable token streams.',
        language: 'typescript',
        codeSnippet: `const result = await model.generateContentStream({
  contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
});`
      },
      {
        name: 'Database Telemetry Write',
        component: 'Supabase Event Log',
        durationMs: 45,
        status: 'success',
        recruiterExplanation: 'Logs the transaction asynchronously for dashboard analytics (no visitor IP is stored).',
        technicalExplanation: 'Fires background write task to system_events table using cookie-less simple Supabase client.',
        language: 'typescript',
        codeSnippet: `await supabase.from('system_events').insert({
  event_type: 'ask-vraj',
  message: 'AI query processed successfully',
  is_public: true
});`
      }
    ]
  },
  contact: {
    id: 'contact',
    title: 'Contact Form Submission',
    description: 'Traces client-side messages through input sanitization, database insert, and server telemetry logging.',
    method: 'POST',
    path: '/api/contact',
    totalDurationMs: 268,
    stages: [
      {
        name: 'Input Sanitization',
        component: 'Server Sanitizer',
        durationMs: 8,
        status: 'success',
        recruiterExplanation: 'HTML-escapes form values (name, email, text) to block SQL or script injections.',
        technicalExplanation: 'Server API sanitizes input characters using Regex replacements before writing database logs.',
        language: 'typescript',
        codeSnippet: `const cleanMessage = rawMessage
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');`
      },
      {
        name: 'Database Storage (Postgres Write)',
        component: 'Supabase Database',
        durationMs: 230,
        status: 'success',
        recruiterExplanation: 'Inserts contact details securely in Supabase. DB policies block unauthorized public reads.',
        technicalExplanation: 'SQL INSERT statement executes, governed by Row-Level Security rules blocking public SELECT queries.',
        language: 'sql',
        codeSnippet: `ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public submission insertions" ON contact_messages
  FOR INSERT WITH CHECK (true);`
      },
      {
        name: 'Server Telemetry Logging',
        component: 'Server Observability Logger',
        durationMs: 15,
        status: 'success',
        recruiterExplanation: 'Records the successful contact form submission to system event logs for administration dashboards.',
        technicalExplanation: 'Executes ServerLogger.logEvent helper to write transaction records into database audit tables.',
        language: 'typescript',
        codeSnippet: `await ServerLogger.logEvent(
  'contact',
  'success',
  \`Contact inquiry cataloged successfully: "\${subject.substring(0, 30)}..."\`,
  { subjectPreview: subject.substring(0, 30) },
  true
);`
      },
      {
        name: 'Browser UI success update',
        component: 'Client Feedback UI',
        durationMs: 15,
        status: 'success',
        recruiterExplanation: 'Clears form fields, pops up success notifications, and triggers telemetry trackers.',
        technicalExplanation: 'Updates component states, triggering toast notification modules and reloading fields.',
        language: 'typescript',
        codeSnippet: `if (res.ok) {
  toast.success("Inquiry submitted successfully!");
  reset(); // clears react-hook-form inputs
}`
      }
    ]
  },
  'resume-download': {
    id: 'resume-download',
    title: 'Resume Download Tracking',
    description: 'Traces download trigger logging and delivery of CV PDF assets.',
    method: 'GET',
    path: '/resume',
    totalDurationMs: 241,
    stages: [
      {
        name: 'Download Click Capture',
        component: 'Client Event Handler',
        durationMs: 1,
        status: 'success',
        recruiterExplanation: 'Detects the download action on the resume interface.',
        technicalExplanation: 'Client button onClick fires and logs event telemetry details.',
        language: 'typescript',
        codeSnippet: `<button onClick={handleDownload}>Download CV</button>`
      },
      {
        name: 'Tracer Logging',
        component: 'Telemetry Logger API',
        durationMs: 60,
        status: 'success',
        recruiterExplanation: 'Fires background POST request to logs tracking database.',
        technicalExplanation: 'Dispatches route logging without blocking UI file delivery streams.',
        language: 'typescript',
        codeSnippet: `await fetch('/api/telemetry/log', {
  method: 'POST',
  body: JSON.stringify({ source: 'portfolio', type: 'resume' })
});`
      },
      {
        name: 'Audit Table Insertion',
        component: 'Supabase Database',
        durationMs: 180,
        status: 'success',
        recruiterExplanation: 'Appends download tracking record inside Supabase to aggregate resume downloads metrics.',
        technicalExplanation: 'Inserts stats data dynamically to db registry tracks.',
        language: 'sql',
        codeSnippet: `INSERT INTO resume_downloads (downloaded_at, ip_hash) 
VALUES (NOW(), 'anonymized_ip');`
      }
    ]
  },
  'github-sync': {
    id: 'github-sync',
    title: 'GitHub Sync Pipeline',
    description: 'Traces automated hourly scraper and contribution cache mutations.',
    method: 'CRON',
    path: 'Background Task',
    totalDurationMs: 1075,
    stages: [
      {
        name: 'Cron Trigger',
        component: 'Supabase Scheduler',
        durationMs: 0,
        status: 'success',
        recruiterExplanation: 'Triggers hourly refresh to maintain synchronized contribution calendars.',
        technicalExplanation: 'Database schedules or Vercel API cron hooks trigger get request endpoints.',
        language: 'json',
        codeSnippet: `{
  "schedule": "0 * * * *",
  "target": "/api/github/contributions"
}`
      },
      {
        name: 'Parallel API Scraping',
        component: 'External GitHub Scraper',
        durationMs: 820,
        status: 'success',
        recruiterExplanation: 'Scrapes contributions history lists in parallel for Vraj\'s two separate usernames.',
        technicalExplanation: 'Triggers parallel fetches to jogruber contributions API endpoints.',
        language: 'typescript',
        codeSnippet: `const [data1, data2] = await Promise.all([
  fetchContributions('Vraj3005'),
  fetchContributions('23bce377-debug')
]);`
      },
      {
        name: 'Grid normalizations & Sorts',
        component: 'Sync Logic',
        durationMs: 15,
        status: 'success',
        recruiterExplanation: 'Sorts chronological grids, handles overlaps, and sets activity color levels.',
        technicalExplanation: 'Sorts raw calendar objects chronologically ascending and matches bounds.',
        language: 'typescript',
        codeSnippet: `const sorted = [...rawData].sort((a, b) => a.date.localeCompare(b.date));
return sorted.slice(-371);`
      },
      {
        name: 'Database Cache upsert',
        component: 'Supabase Cache Table',
        durationMs: 240,
        status: 'success',
        recruiterExplanation: 'Saves compiled contribution calendar to caching database to prevent GitHub rate-limiting.',
        technicalExplanation: 'Saves JSON array payload to caching database on username key constraints.',
        language: 'sql',
        codeSnippet: `INSERT INTO github_contributions_cache (username, contribution_data)
VALUES ('vraj_combined', '[...]')
ON CONFLICT (username) DO UPDATE SET contribution_data = EXCLUDED.contribution_data;`
      }
    ]
  }
};

export default function QueryLifecycle() {
  const [mode, setMode] = useState<'blueprint' | 'tracer'>('blueprint');
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('ask-vraj');
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);

  // Tracer states
  const [traces, setTraces] = useState<RequestTraceRecord[]>([]);
  const [activeTraceId, setActiveTraceId] = useState<string | null>(null);
  const [loadingTraces, setLoadingTraces] = useState(false);
  const [activeTraceStepIndex, setActiveTraceStepIndex] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch real traces when Tracer mode is selected
  useEffect(() => {
    if (mode !== 'tracer') return;

    const fetchTraces = async () => {
      setLoadingTraces(true);
      const supabaseClient = supabase as any;
      try {
        const { data, error } = await supabaseClient
          .from('request_traces')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (data && data.length > 0 && !error) {
          const parsed = data.map((t: any) => ({
            id: t.id,
            timestamp: t.created_at,
            path: t.path,
            method: t.method,
            statusCode: t.status_code,
            totalDurationMs: Number(t.duration_ms),
            steps: t.steps || []
          }));
          setTraces(parsed);
          setActiveTraceId(parsed[0].id);
          setActiveTraceStepIndex(0);
          setIsDemoMode(false);
        } else {
          // Local fallback seeded trace data
          const defaultTraces: RequestTraceRecord[] = [
            {
              id: 'tr-1',
              timestamp: new Date().toISOString(),
              path: '/api/ask',
              method: 'POST',
              statusCode: 200,
              totalDurationMs: 1005,
              steps: [
                { name: 'init_request', durationMs: 0, status: 'success', timestamp: new Date(Date.now() - 1005).toISOString(), metadata: { message: 'Trace started.' } },
                { name: 'validate_inputs_zod', durationMs: 5, status: 'success', timestamp: new Date(Date.now() - 1000).toISOString() },
                { name: 'query_ip_rate_limit_memory', durationMs: 30, status: 'success', timestamp: new Date(Date.now() - 970).toISOString() },
                { name: 'load_context_data', durationMs: 120, status: 'success', timestamp: new Date(Date.now() - 850).toISOString(), metadata: { file: 'portfolioContext.ts' } },
                { name: 'call_google_genai_api', durationMs: 850, status: 'success', timestamp: new Date(Date.now() - 0).toISOString(), metadata: { model: 'gemini-3.1-flash-lite' } }
              ]
            },
            {
              id: 'tr-2',
              timestamp: new Date(Date.now() - 60000).toISOString(),
              path: '/api/contact',
              method: 'POST',
              statusCode: 200,
              totalDurationMs: 278,
              steps: [
                { name: 'init_request', durationMs: 0, status: 'success', timestamp: new Date(Date.now() - 60278).toISOString() },
                { name: 'validate_inputs_zod', durationMs: 12, status: 'success', timestamp: new Date(Date.now() - 60266).toISOString() },
                { name: 'insert_contact_message', durationMs: 240, status: 'success', timestamp: new Date(Date.now() - 60026).toISOString() },
                { name: 'server_telemetry_logging', durationMs: 26, status: 'success', timestamp: new Date(Date.now() - 60000).toISOString() }
              ]
            }
          ];
          setTraces(defaultTraces);
          setActiveTraceId(defaultTraces[0].id);
          setActiveTraceStepIndex(0);
          setIsDemoMode(true);
        }
      } catch (err) {
        console.error('Failed to query request traces from Supabase:', err);
      } finally {
        setLoadingTraces(false);
      }
    };

    fetchTraces();
  }, [mode]);

  const activeWorkflow = STATIC_WORKFLOWS[activeWorkflowId] || STATIC_WORKFLOWS['ask-vraj'];
  const activeStage = activeWorkflow.stages[activeStageIndex] || activeWorkflow.stages[0];

  const activeTrace = traces.find((t) => t.id === activeTraceId);
  const activeTraceStep = activeTrace?.steps[activeTraceStepIndex] || activeTrace?.steps[0];

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/25';
      case 'error': return 'text-red-550 bg-red-500/10 border-red-500/25';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
    }
  };

  return (
    <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-6 font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-4 relative z-10 select-none">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">
            Query Lifecycle Tracer {mode === 'tracer' && isDemoMode && '(Demo Mode)'}
          </h3>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl self-end md:self-auto shrink-0">
          <button
            onClick={() => setMode('blueprint')}
            className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border flex items-center gap-1.5 transition-all duration-300 ${
              mode === 'blueprint'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)] font-bold'
                : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
            }`}
          >
            <Info className="h-3 w-3" /> System Blueprints
          </button>
          <button
            onClick={() => setMode('tracer')}
            className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border flex items-center gap-1.5 transition-all duration-300 ${
              mode === 'tracer'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)] font-bold'
                : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
            }`}
          >
            <Search className="h-3 w-3" /> Real-time Tracer
          </button>
        </div>
      </div>

      {/* Workflow Tabs (Only visible in Blueprint/Static Mode) */}
      {mode === 'blueprint' && (
        <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.01] border border-white/5 rounded-xl relative z-10 overflow-x-auto scrollbar-none select-none">
          {Object.values(STATIC_WORKFLOWS).map((wf) => (
            <button
              key={wf.id}
              onClick={() => {
                setActiveWorkflowId(wf.id);
                setActiveStageIndex(0);
              }}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg border transition-all duration-300 shrink-0 ${
                activeWorkflowId === wf.id
                  ? 'bg-white/5 text-foreground border-white/10 font-bold shadow-md'
                  : 'bg-transparent text-secondary border-transparent hover:text-foreground hover:bg-white/[0.03]'
              }`}
            >
              {wf.title}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch relative z-10">
        
        {/* Left/Sidebar: Workflow pipeline stages or Live traces queue */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {mode === 'blueprint' ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1 select-none">
                <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-900/30 text-[9px] uppercase leading-none">{activeWorkflow.method}</span>
                  {activeWorkflow.path}
                </span>
                <p className="text-[11px] text-secondary leading-relaxed font-medium mt-1">
                  {activeWorkflow.description}
                </p>
              </div>

              {/* Vertical timeline of Blueprint stages */}
              <div className="relative pl-6 border-l border-white/5 flex flex-col gap-3 mt-3 ml-2.5 select-none">
                {activeWorkflow.stages.map((stage, idx) => {
                  const isActive = idx === activeStageIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStageIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl border relative transition-all duration-305 flex flex-col gap-0.5 ${
                        isActive
                          ? 'bg-cyan-500/5 border-cyan-500/30 text-foreground shadow-[0_0_10px_rgba(6,182,212,0.05)]'
                          : 'bg-white/[0.01] border-white/5 text-secondary hover:bg-white/[0.03] hover:border-white/10 hover:text-foreground'
                      }`}
                    >
                      {/* Connection node point */}
                      <div className={`absolute -left-[30px] top-4.5 h-2 w-2 rounded-full border transition-all duration-300 ${
                        isActive ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'bg-background border-white/20'
                      }`} />

                      <span className="text-[11.5px] font-bold tracking-tight">{stage.name}</span>
                      <div className="flex items-center justify-between text-[9px] font-mono text-secondary mt-0.5">
                        <span>{stage.component}</span>
                        <span>{stage.durationMs}ms</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Tracer / Live queue
            <div className="flex flex-col gap-3 select-none">
              <span className="text-[10px] text-secondary uppercase font-semibold font-mono tracking-wider pb-1 border-b border-white/5">
                Active Ingestion Queue
              </span>

              {loadingTraces ? (
                <div className="py-12 text-center text-xs font-mono text-secondary flex items-center justify-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>Scanning trace index...</span>
                </div>
              ) : traces.length === 0 ? (
                <div className="py-12 text-center text-xs font-mono text-secondary">
                  No trace logs discovered in index.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {traces.map((trace) => {
                    const isActive = trace.id === activeTraceId;
                    return (
                      <button
                        key={trace.id}
                        onClick={() => {
                          setActiveTraceId(trace.id);
                          setActiveTraceStepIndex(0);
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border flex flex-col gap-2 transition-all duration-300 ${
                          isActive
                            ? 'bg-cyan-500/5 border-cyan-500/35 text-foreground shadow-[0_0_10px_rgba(6,182,212,0.05)]'
                            : 'bg-white/[0.01] border-white/5 text-secondary hover:bg-white/[0.04] hover:border-white/10 hover:text-foreground'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[11px] font-bold font-mono">
                          <span className="flex items-center gap-1.5">
                            <span className="px-1 py-0.5 rounded bg-cyan-950/40 text-[9px] uppercase leading-none border border-cyan-900/30 text-cyan-400">
                              {trace.method}
                            </span>
                            <span className="truncate max-w-[110px]" title={trace.path}>
                              {trace.path}
                            </span>
                          </span>
                          <span className="text-[10px] text-foreground font-semibold">{trace.totalDurationMs}ms</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-secondary mt-0.5">
                          <span>Status: <span className="text-foreground font-bold">{trace.statusCode}</span></span>
                          <span>{new Date(trace.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Panel: Active Step Detail Card */}
        <div className="lg:col-span-3">
          {mode === 'blueprint' ? (
            activeStage ? (
              <Card className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between gap-5 h-full">
                <div className="flex flex-col gap-4">
                  {/* Stage title */}
                  <div className="flex justify-between items-start gap-4 border-b border-card-border pb-3 select-none">
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-foreground font-mono">
                        {activeStage.name}
                      </h4>
                      <span className="text-[9px] font-mono text-secondary">
                        Pipeline Phase Spec Matrix
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold rounded-full uppercase shrink-0 ${getStatusColorClass(activeStage.status)}`}>
                      {activeStage.status}
                    </span>
                  </div>

                  {/* Component and duration info */}
                  <div className="grid grid-cols-2 gap-3.5 text-[10px] font-mono text-secondary select-none">
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5">
                      <span className="text-[8.5px] uppercase font-semibold text-secondary tracking-wider block">Executing Node</span>
                      <span className="text-foreground font-bold font-sans mt-0.5 block truncate">{activeStage.component}</span>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-lg p-2.5">
                      <span className="text-[8.5px] uppercase font-semibold text-secondary tracking-wider block">Average Latency</span>
                      <span className="text-cyan-400 font-bold mt-0.5 block">~ {activeStage.durationMs} ms</span>
                    </div>
                  </div>

                  {/* Narratives */}
                  <div className="flex flex-col gap-1.5 mt-1 select-none">
                    <span className="text-[9.5px] text-secondary uppercase font-semibold font-mono tracking-wider">
                      Stage Description
                    </span>
                    <p className="text-[11px] text-secondary leading-relaxed font-medium bg-white/[0.01] border border-white/3 rounded-xl p-3">
                      {activeStage.technicalExplanation}
                    </p>
                  </div>
                </div>

                {/* Code Block Snippet */}
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[9.5px] text-secondary uppercase font-semibold font-mono tracking-wider select-none">
                    Architecture Reference
                  </span>
                  <div className="relative rounded-xl border border-card-border overflow-hidden bg-black/60 max-h-[180px] overflow-y-auto font-mono text-[9.5px] text-left leading-relaxed text-secondary p-3.5 scrollbar-thin">
                    <pre className="whitespace-pre overflow-x-auto">
                      <code>{activeStage.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-secondary bg-white/[0.01] border border-white/5 rounded-2xl select-none">
                Select a pipeline stage.
              </div>
            )
          ) : (
            // Live Tracer details panel
            activeTrace ? (
              <Card className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between gap-5 h-full">
                <div className="flex flex-col gap-4">
                  
                  {/* Trace Header */}
                  <div className="flex justify-between items-start gap-4 border-b border-card-border pb-3 select-none">
                    <div className="flex flex-col gap-0.5">
                      <h4 className="text-xs font-bold text-foreground font-mono flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950/40 text-[9px] border border-cyan-900/30 text-cyan-400 uppercase leading-none">{activeTrace.method}</span>
                        {activeTrace.path}
                      </h4>
                      <span className="text-[9px] font-mono text-secondary">
                        Trace ID: <span className="text-foreground font-mono text-[8px] font-semibold">{activeTrace.id}</span>
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 border text-[9px] font-mono font-bold rounded-full uppercase shrink-0 ${
                      activeTrace.statusCode === 200
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : 'bg-red-500/10 text-red-500 border-red-500/25'
                    }`}>
                      Status: {activeTrace.statusCode}
                    </span>
                  </div>

                  {/* Execution Timeline Map */}
                  <div className="flex flex-col gap-2.5 mt-1 select-none">
                    <span className="text-[9.5px] text-secondary uppercase font-semibold font-mono tracking-wider">
                      Execution Steps Trace
                    </span>
                    <div className="flex flex-col gap-2">
                      {activeTrace.steps.map((step, idx) => {
                        const isStepActive = idx === activeTraceStepIndex;
                        return (
                          <button
                            key={idx}
                            onClick={() => setActiveTraceStepIndex(idx)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                              isStepActive
                                ? 'bg-cyan-500/5 border-cyan-500/30 text-foreground'
                                : 'bg-transparent border-white/5 text-secondary hover:border-white/10 hover:text-foreground'
                            }`}
                          >
                            <span className="text-[11px] font-semibold flex items-center gap-2">
                              {step.status === 'success' ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              ) : step.status === 'warning' ? (
                                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                              )}
                              {step.name}
                            </span>
                            <span className="text-[9px] font-mono font-semibold">{step.durationMs}ms</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step metadata */}
                  {activeTraceStep && activeTraceStep.metadata && Object.keys(activeTraceStep.metadata).length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <span className="text-[9.5px] text-secondary uppercase font-semibold font-mono tracking-wider select-none">
                        Active Step Metadata
                      </span>
                      <div className="relative rounded-xl border border-card-border overflow-hidden bg-black/60 max-h-[140px] overflow-y-auto font-mono text-[9px] text-left leading-relaxed text-secondary p-3.5 scrollbar-thin">
                        <pre className="whitespace-pre overflow-x-auto">
                          <code>{JSON.stringify(activeTraceStep.metadata, null, 2)}</code>
                        </pre>
                      </div>
                    </div>
                  )}

                </div>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center text-xs font-mono text-secondary bg-white/[0.01] border border-white/5 rounded-2xl select-none py-20">
                Select a trace from the sidebar log queue.
              </div>
            )
          )}
        </div>

      </div>
    </Card>
  );
}

