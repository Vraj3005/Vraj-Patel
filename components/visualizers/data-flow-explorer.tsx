'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataFlow } from '@/types/advanced';
import { DATA_FLOWS } from '@/lib/visualizer/flow-data';
import {
  Play, Pause, RotateCcw, ArrowRight, ArrowLeft, ShieldAlert,
  Cpu, Activity, Database, CheckCircle2, ChevronRight, X, Terminal, Code
} from 'lucide-react';

interface DataFlowExplorerProps {
  projectSlug?: string;
  allowFlowSwitching?: boolean;
}

export default function DataFlowExplorer({
  projectSlug,
  allowFlowSwitching = true
}: DataFlowExplorerProps) {
  // Find initial flow
  const initialFlow = DATA_FLOWS.find(f => f.projectSlug === projectSlug) || DATA_FLOWS[0];
  const [activeFlow, setActiveFlow] = useState<DataFlow>(initialFlow);
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'overview' | 'technical' | 'recruiter'>('overview');
  const [isRunning, setIsRunning] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if slug changes
  useEffect(() => {
    if (projectSlug) {
      const match = DATA_FLOWS.find(f => f.projectSlug === projectSlug);
      if (match) {
        setActiveFlow(match);
        setActiveStepIdx(0);
        setIsRunning(false);
      }
    }
  }, [projectSlug]);

  const activeStep = activeFlow.steps[activeStepIdx] || activeFlow.steps[0];
  const stepsCount = activeFlow.steps.length;

  // Simulator interval loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setActiveStepIdx((prev) => {
          if (prev >= stepsCount - 1) {
            setIsRunning(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, stepsCount]);

  const handlePlayToggle = () => {
    if (activeStepIdx >= stepsCount - 1) {
      setActiveStepIdx(0);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setActiveStepIdx(0);
    setIsRunning(false);
  };

  const handleNext = () => {
    setIsRunning(false);
    if (activeStepIdx < stepsCount - 1) {
      setActiveStepIdx(activeStepIdx + 1);
    }
  };

  const handlePrev = () => {
    setIsRunning(false);
    if (activeStepIdx > 0) {
      setActiveStepIdx(activeStepIdx - 1);
    }
  };

  // Helper to generate mock JSON requests logs for detail drawer
  const getMockJSONLog = (flowId: string, stepSeq: number) => {
    switch (flowId) {
      case 'enermass-solar-calculator':
        if (stepSeq === 1) {
          return {
            event: "SURVEYOR_INPUTS_CAPTURED",
            timestamp: new Date().toISOString(),
            payload: {
              inputs: { state: "Gujarat", area_sqm: 145.5, monthly_bill_inr: 5800 },
              overrides: { panel_type: "Mono-PERC-450W", count: 16 }
            },
            status: "DRAFT_SAVED"
          };
        }
        if (stepSeq === 2) {
          return {
            event: "SCHEMA_VALIDATION_PASSED",
            timestamp: new Date().toISOString(),
            engine: "Zod v4.4.3 Parser",
            schema: "SolarIntakeSchema",
            payload_status: "SANITIZED_IMMUTABLE",
            execution_time: "0.4ms"
          };
        }
        if (stepSeq === 3) {
          return {
            event: "SUBSIDY_CALCULATIONS_COMPLETED",
            timestamp: new Date().toISOString(),
            inputs: { kw_capacity: 7.2, selected_state: "Gujarat" },
            math_engine: "PM_Surya_Ghar_Matrix",
            calculations: {
              raw_cost_inr: 288000,
              central_subsidy_inr: 78000,
              net_cost_inr: 210000,
              roi_years: 4.8
            }
          };
        }
        if (stepSeq === 4) {
          return {
            event: "LOCAL_PERSIST_SAVE",
            timestamp: new Date().toISOString(),
            cache_provider: "Zustand LocalStorage Persist",
            key: "vraj-solar-quote-store",
            serialized_size_bytes: 1024,
            integrity_checksum: "md5_a72c84b12df"
          };
        }
        return {
          event: "PDF_BROCHURE_EXPORTED",
          timestamp: new Date().toISOString(),
          styles: "Print letterhead A4 optimization rules",
          output_type: "application/pdf",
          size_kb: 342,
          actions: ["WhatsApp shares enqueued", "CRM update triggered"]
        };

      case 'outreachops-ai':
        if (stepSeq === 1) {
          return {
            event: "CAMPAIGN_BATCH_LOADED",
            timestamp: new Date().toISOString(),
            campaign_id: "cmp_sales_ops_ai_2026",
            leads_loaded_count: 50,
            status: "ENQUEUED"
          };
        }
        if (stepSeq === 2) {
          return {
            event: "FASTAPI_ROUTER_MUTATION",
            timestamp: new Date().toISOString(),
            method: "POST",
            route: "/api/v1/campaigns/run",
            payload: { campaign_id: "cmp_sales_ops_ai_2026", threads: 5 },
            client_ip: "127.0.0.1"
          };
        }
        if (stepSeq === 3) {
          return {
            event: "PYDANTIC_VALIDATION_COMPLETED",
            timestamp: new Date().toISOString(),
            module: "CampaignIntakeSchema",
            results: "VALID_SANITIZED",
            latency: "1.1ms"
          };
        }
        if (stepSeq === 4) {
          return {
            event: "GOOGLE_SHEETS_SYNC",
            timestamp: new Date().toISOString(),
            connector: "gspread Python Client",
            spreadsheet_id: "sheet_active_leads_register",
            active_row: 14,
            fields_synced: ["Company", "Website", "Outbound_Pitch"]
          };
        }
        if (stepSeq === 5) {
          return {
            event: "GEMINI_MODEL_GENERATE",
            timestamp: new Date().toISOString(),
            sdk: "@google/genai",
            model: "gemini-3.1-flash-lite",
            temperature: 0.2,
            prompt_tokens_estimate: 840,
            generation_time_ms: 810,
            output_structure: "JSON_Structured_Apparel_Pitch"
          };
        }
        if (stepSeq === 6) {
          return {
            event: "SUPABASE_LOG_RECORDED",
            timestamp: new Date().toISOString(),
            database: "Supabase Postgres",
            table: "outbound_campaigns_history",
            logged_fields: { status: "DRAFT_AI_COMPOSED", retry_count: 0 }
          };
        }
        return {
          event: "SMTP_EMAIL_DISPATCHED",
          timestamp: new Date().toISOString(),
          auth_method: "Gmail OAuth 2.0 API Pipeline",
          sender: "vraj@pitbullcorp.com",
          message_id: "msg_oauth_gmail_83f2a",
          status: "SENT"
        };

      case 'bhagwati-interior-erp':
        if (stepSeq === 1) {
          return {
            event: "MILESTONE_UPDATE_FORM_SUBMIT",
            timestamp: new Date().toISOString(),
            fields: { site_id: "site_bi_491", step_index: 3, task: "Woodwork Completed" }
          };
        }
        if (stepSeq === 2) {
          return {
            event: "SESSION_JWT_VALIDATED",
            timestamp: new Date().toISOString(),
            provider: "NextAuth session hook",
            decrypted_claims: { user_id: "usr_designer_vraj", role: "admin", exp: 1782293881 }
          };
        }
        if (stepSeq === 3) {
          return {
            event: "SERVER_ACTION_INVOKED",
            timestamp: new Date().toISOString(),
            action_name: "updateSiteMilestoneAction",
            origin: "React Server Action RPC",
            status: "PROCESSING"
          };
        }
        if (stepSeq === 4) {
          return {
            event: "ZOD_SERVER_SCHEMA_VERIFIED",
            timestamp: new Date().toISOString(),
            schema: "MilestoneUpdateInput",
            validation: "SUCCESS",
            execution_ms: 0.8
          };
        }
        if (stepSeq === 5) {
          return {
            event: "UPSTASH_REDIS_SYNC",
            timestamp: new Date().toISOString(),
            cache_provider: "Upstash Redis",
            command: "SETEX cost_matrix_site_bi_491 7200 active_json",
            latency: "4.8ms"
          };
        }
        if (stepSeq === 6) {
          return {
            event: "DRIZZLE_SQL_INSERT",
            timestamp: new Date().toISOString(),
            orm: "Drizzle Client SQL",
            query: "UPDATE site_milestones SET status = 'completed' WHERE id = 'site_bi_491'",
            transaction: "SUPABASE_POSTGRES_TRANSACT_OK"
          };
        }
        if (stepSeq === 7) {
          return {
            event: "QSTASH_WEBHOOK_ENQUEUED",
            timestamp: new Date().toISOString(),
            broker: "Upstash QStash",
            topic: "milestone-reminders-topic",
            task_id: "qstash_job_82b4a",
            hmac_signature: "sha256=9f2bc401fde"
          };
        }
        return {
          event: "RESEND_EMAIL_DISPATCHED",
          timestamp: new Date().toISOString(),
          provider: "Resend SDK",
          api_message_id: "re_msg_84bcfde",
          recipient: "admin@bhagwatiinteriors.com",
          status: "DELIVERED"
        };

      case 'ask-vraj':
        if (stepSeq === 1) {
          return {
            event: "CHAT_PROMPT_INPUT_APPENDED",
            timestamp: new Date().toISOString(),
            raw_prompt: "Explain Vraj's AI capabilities",
            length: 32
          };
        }
        if (stepSeq === 2) {
          return {
            event: "LOCAL_CHAT_THREAD_PERSISTED",
            timestamp: new Date().toISOString(),
            caching: "LocalStorage",
            messages_count: 5,
            allocated_kb: 1.4
          };
        }
        if (stepSeq === 3) {
          return {
            event: "EDGE_RUNTIME_API_ROUTING",
            timestamp: new Date().toISOString(),
            method: "POST",
            route: "/api/ask",
            runtime: "Edge_serverless_v8",
            content_type: "application/json"
          };
        }
        if (stepSeq === 4) {
          return {
            event: "PROMPT_ZOD_SANITY_GATE",
            timestamp: new Date().toISOString(),
            limits: { max_chars: 1000, current: 32 },
            verification: "SUCCESS"
          };
        }
        if (stepSeq === 5) {
          return {
            event: "CONTEXT_INTERPOLATION_COMPLETED",
            timestamp: new Date().toISOString(),
            rules_injected: ["Do not hallucinate", "Focus on Vraj Patel credentials"],
            grounding_data_kb: 12.4
          };
        }
        if (stepSeq === 6) {
          return {
            event: "GEMINI_CONTENT_STREAM_OPENED",
            timestamp: new Date().toISOString(),
            model: "gemini-3.1-flash-lite",
            stream: true,
            status: "STREAM_CONNECTED"
          };
        }
        if (stepSeq === 7) {
          return {
            event: "STREAM_TOKEN_DISPATCH",
            timestamp: new Date().toISOString(),
            chunk_bytes: 64,
            token_status: "WRITING_TO_BUFFER"
          };
        }
        return {
          event: "AUDIT_TELEMETRY_LOGGED",
          timestamp: new Date().toISOString(),
          client: "createSimpleSupabaseClient",
          table: "telemetry_logs",
          inputs_logged: "true",
          cookie_dependency: "none_isolated"
        };

      case 'portfolio-contact':
        if (stepSeq === 1) {
          return {
            event: "CONTACT_FORM_INPUT",
            timestamp: new Date().toISOString(),
            fields: { name: "John Doe", email: "john@example.com", message: "Inquiry details" }
          };
        }
        if (stepSeq === 2) {
          return {
            event: "ZOD_GATEWAY_SANITIZATION",
            timestamp: new Date().toISOString(),
            validator: "Zod parse",
            status: "CLEAN_PASS"
          };
        }
        if (stepSeq === 3) {
          return {
            event: "SUPABASE_CONTACT_INSERT",
            timestamp: new Date().toISOString(),
            table: "contacts",
            db_status: "ROW_CREATED",
            rls_audit: "RLS_ENFORCED_ANON_INSERT"
          };
        }
        return {
          event: "SMTP_MAIL_SENT",
          timestamp: new Date().toISOString(),
          smtp_host: "smtp.gmail.com",
          sender: "portfolio-mailer@vraj.dev",
          status: "SUCCESS"
        };

      case 'nf-lrd-regime-discovery':
        if (stepSeq === 1) {
          return {
            event: "STREAMLIT_PARAMS_RESET",
            timestamp: new Date().toISOString(),
            hidden_states: 4,
            covariance_type: "full"
          };
        }
        if (stepSeq === 2) {
          return {
            event: "YFINANCE_DATAFRAME_DOWNLOADED",
            timestamp: new Date().toISOString(),
            ticker: "^NSEI",
            download_rows: 1250,
            latency_ms: 480
          };
        }
        if (stepSeq === 3) {
          return {
            event: "PARQUET_FILE_QUERY",
            timestamp: new Date().toISOString(),
            path: "local_cache/nifty50_returns.parquet",
            records_read: 5000,
            load_time: "4.2ms"
          };
        }
        if (stepSeq === 4) {
          return {
            event: "GAUSSIAN_HMM_TRAINED",
            timestamp: new Date().toISOString(),
            library: "hmmlearn.hmm",
            algorithm: "Baum-Welch expectation maximization",
            converged: true,
            iterations: 18,
            log_likelihood: 4812.82
          };
        }
        if (stepSeq === 5) {
          return {
            event: "NUMPY_BACKTEST_SIMULATED",
            timestamp: new Date().toISOString(),
            matrix: "vectorized_returns",
            leveraged: false,
            sharpe_ratio: 1.84,
            cagr: "16.4%"
          };
        }
        return {
          event: "PLOTLY_CHART_MESHED",
          timestamp: new Date().toISOString(),
          renderer: "Streamlit st.plotly_chart",
          points: 1250,
          memory_kb: 512
        };

      case 'driedhub-marketplace':
        if (stepSeq === 1) {
          return {
            event: "CART_SUBMITTED",
            timestamp: new Date().toISOString(),
            items: [
              { item_id: "df_cashews_01", qty: 2, unit_price: 450 },
              { item_id: "df_almonds_03", qty: 1, unit_price: 600 }
            ],
            total_price_inr: 1500
          };
        }
        if (stepSeq === 2) {
          return {
            event: "STOCK_AVAILABILITY_AUDIT",
            timestamp: new Date().toISOString(),
            stock_check: "SUCCESS",
            pricing_audit: "CATALOG_MATCH"
          };
        }
        if (stepSeq === 3) {
          return {
            event: "RAZORPAY_ORDER_CREATED",
            timestamp: new Date().toISOString(),
            order_id: "order_rzp_94bf29a",
            amount_in_paise: 150000,
            currency: "INR",
            status: "created"
          };
        }
        if (stepSeq === 4) {
          return {
            event: "RAZORPAY_SIGNATURE_VERIFIED",
            timestamp: new Date().toISOString(),
            payment_id: "pay_rzp_81cd92a",
            signature: "hmac_sha256_b412ea8...",
            status: "AUTHENTICATED"
          };
        }
        return {
          event: "SUPABASE_ORDER_PERSISTED",
          timestamp: new Date().toISOString(),
          table: "orders",
          order_id: "order_rzp_94bf29a",
          status: "PAID",
          rls_check: "RLS_VERIFIED_USER_INSERT"
        };

      case 'mspe-volatility-engine':
        if (stepSeq === 1) {
          return {
            event: "FRONTEND_SELECTIONS_CAPTURED",
            timestamp: new Date().toISOString(),
            parameters: { ticker: "Nifty 50", strikes: [19500, 19600, 19700], expiries: ["2026-07-02"] },
            status: "DRAFT_LOADED"
          };
        }
        if (stepSeq === 2) {
          return {
            event: "FASTAPI_PRICING_ROUTER_MUTATION",
            timestamp: new Date().toISOString(),
            endpoint: "/api/v1/pricing/compute",
            method: "POST",
            latency: "1.2ms"
          };
        }
        if (stepSeq === 3) {
          return {
            event: "NUMPY_GREEKS_COMPUTED",
            timestamp: new Date().toISOString(),
            mathematics: "Vectorized Black-Scholes solver",
            results: { delta: [0.55, 0.48, 0.39], gamma: [0.002, 0.002, 0.001], vega: [14.2, 13.8, 12.5] }
          };
        }
        if (stepSeq === 4) {
          return {
            event: "GARCH_VARIANCE_MODELLING_COMPLETED",
            timestamp: new Date().toISOString(),
            spec: "GARCH(1,1)",
            parameters: { omega: 0.000002, alpha: 0.08, beta: 0.90 },
            forecast_volatility: "14.85%"
          };
        }
        if (stepSeq === 5) {
          return {
            event: "XGBOOST_SKEW_PROJECTION_SUCCESS",
            timestamp: new Date().toISOString(),
            model: "XGBoost Regressor v2.1",
            input_features_count: 8,
            predicted_iv_skew: [0.145, 0.141, 0.138]
          };
        }
        return {
          event: "PLOTLY_3D_MESH_GENERATED",
          timestamp: new Date().toISOString(),
          axes: { x: "strike", y: "time_to_expiry", z: "implied_volatility" },
          points_plotted: 120,
          render_engine: "WebGL-hardware-accelerated"
        };

      case 'btc-algo-trading':
        if (stepSeq === 1) {
          return {
            event: "STREAMLIT_AUTOREFRESH_TICK",
            timestamp: new Date().toISOString(),
            refresh_id: "tick_83bf2a",
            polling_interval_seconds: 10
          };
        }
        if (stepSeq === 2) {
          return {
            event: "EXCHANGE_CANDLES_FETCHED",
            timestamp: new Date().toISOString(),
            url: "https://api.binance.com/api/v3/klines",
            params: { symbol: "BTCUSDT", interval: "1h", limit: 200 },
            bytes_received: 48900
          };
        }
        if (stepSeq === 3) {
          return {
            event: "PANDAS_DATAFRAME_CLEANSED",
            timestamp: new Date().toISOString(),
            rows_before: 200,
            null_removed: 0,
            log_returns_computed: true
          };
        }
        if (stepSeq === 4) {
          return {
            event: "TECHNICAL_INDICATORS_COMPUTED",
            timestamp: new Date().toISOString(),
            computations: ["SMA_50", "EMA_200", "drawdowns"],
            last_values: { btc_close: 68412.5, sma_50: 67912.8, ema_200: 65120.4 }
          };
        }
        if (stepSeq === 5) {
          return {
            event: "SIGNAL_ENGINE_EVALUATED",
            timestamp: new Date().toISOString(),
            conditions: { cross_above: true, trend_bullish: true },
            active_signal: "BUY",
            strength: "0.85/1.0"
          };
        }
        return {
          event: "PLOTLY_CHART_UPDATED",
          timestamp: new Date().toISOString(),
          traces: ["Price", "SMA_50", "EMA_200", "Buy_Triggers"],
          interactive_nodes_count: 200
        };

      default:
        return {
          event: "MODULE_GENERIC_TICKER",
          timestamp: new Date().toISOString(),
          status: "ONLINE"
        };
    }
  };

  const currentFlowAccentColor = activeFlow.accentColor;

  return (
    <Card className="p-6 relative overflow-hidden bg-card-bg/40 border-card-border backdrop-blur-md flex flex-col gap-6 w-full">
      {/* Inline animations styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes pulseTrack {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
        .animate-pulse-track {
          animation: pulseTrack 2s ease-in-out infinite;
        }
      `}} />

      {/* Header Controller */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-card-border pb-4 gap-3 z-10 select-none">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-[18px] w-[18px] animate-pulse" style={{ color: currentFlowAccentColor }} /> Transaction Data Flow Explorer
          </h3>
          <span className="text-[10px] font-mono text-secondary">
            Trace step-by-step pipeline transformations and validations
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Perspective View Selector */}
          <div className="flex bg-white/2 border border-card-border rounded-lg p-0.5 font-mono text-[9px] font-bold">
            {(['overview', 'technical', 'recruiter'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2.5 py-1.5 rounded-md uppercase transition-all cursor-pointer ${viewMode === mode
                  ? 'bg-white/5 text-white shadow-sm'
                  : 'text-secondary hover:text-foreground'
                  }`}
              >
                {mode === 'overview' ? 'Overview' : mode === 'technical' ? 'Tech' : 'Recruiter'}
              </button>
            ))}
          </div>

          {/* Flow switching dropdown */}
          {allowFlowSwitching && !projectSlug && (
            <select
              value={activeFlow.id}
              onChange={(e) => {
                const match = DATA_FLOWS.find(f => f.id === e.target.value);
                if (match) {
                  setActiveFlow(match);
                  setActiveStepIdx(0);
                  setIsRunning(false);
                }
              }}
              className="bg-card-bg border border-card-border text-white font-mono text-[10px] font-bold py-1.5 px-3 rounded-lg focus:outline-none focus:border-white/20 cursor-pointer"
            >
              {DATA_FLOWS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name.replace(' Generation Workflow', '').replace(' Project Workflow', '').replace(' Query Pipeline', '').replace(' Ingestion & Analysis Pipeline', '').replace(' Submission Pipeline', '').replace(' Order Checkout Pipeline', '')}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Flow Content */}
      <div className="flex flex-col gap-6 w-full relative">
        {/* Desktop Horizontal Swimlane (md and above) */}
        <div className="hidden md:flex flex-col gap-3 relative py-4 px-2 w-full border border-card-border bg-black/45 rounded-xl overflow-hidden select-none">
          <div className="absolute inset-0 cyber-grid opacity-[0.02] pointer-events-none" />

          <span className="text-[8px] font-mono font-bold tracking-widest text-muted px-2 uppercase">FLOW PROGRESSION SWIMLANES</span>

          <div className="relative flex items-center justify-between px-10 h-16 w-full">
            {/* Timeline Track Connectors */}
            <div className="absolute left-10 right-10 h-1 bg-white/5 rounded-full pointer-events-none">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(activeStepIdx / (stepsCount - 1)) * 100}%`,
                  backgroundColor: currentFlowAccentColor,
                  boxShadow: `0 0 10px ${currentFlowAccentColor}`
                }}
              />
            </div>

            {/* Glowing animated data packet circle */}
            <div className="absolute left-10 right-10 h-0 w-auto pointer-events-none z-10">
              <motion.div
                className="h-3 w-3 -mt-1.5 rounded-full absolute"
                style={{
                  backgroundColor: currentFlowAccentColor,
                  boxShadow: `0 0 12px ${currentFlowAccentColor}`,
                  x: "-50%"
                }}
                animate={{
                  left: `${(activeStepIdx / (stepsCount - 1)) * 100}%`
                }}
                transition={{ type: "spring", stiffness: 90, damping: 15 }}
              />
            </div>

            {/* Render Milestone Node points */}
            {activeFlow.steps.map((step, idx) => {
              const isActive = idx === activeStepIdx;
              const isPast = idx < activeStepIdx;

              return (
                <div
                  key={step.sequence}
                  onClick={() => {
                    setIsRunning(false);
                    setActiveStepIdx(idx);
                  }}
                  className="flex flex-col items-center relative z-20 cursor-pointer group"
                >
                  <div
                    className="h-7 w-7 rounded-full border flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-300 bg-black"
                    style={{
                      borderColor: isActive
                        ? currentFlowAccentColor
                        : isPast
                          ? `${currentFlowAccentColor}66`
                          : 'rgba(255, 255, 255, 0.08)',
                      boxShadow: isActive ? `0 0 12px ${currentFlowAccentColor}44` : 'none',
                      color: isActive ? '#ffffff' : isPast ? '#a3a3a3' : '#737373'
                    }}
                  >
                    {step.sequence}
                  </div>
                  <span
                    className="absolute -bottom-6 text-[8px] font-mono text-center tracking-tight truncate max-w-[80px] select-none pointer-events-none group-hover:text-foreground transition-colors"
                    style={{
                      color: isActive ? '#ffffff' : '#737373',
                      fontWeight: isActive ? 'bold' : 'normal'
                    }}
                  >
                    {step.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Card & Information Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Card Deck Panel */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeFlow.id}-${activeStepIdx}-${viewMode}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full p-6 border border-card-border bg-foreground/[0.015] rounded-xl flex flex-col gap-5 relative overflow-hidden"
              >
                {/* Visual side accent border */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: currentFlowAccentColor }}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-card-border/40 pb-3 gap-2.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] font-mono uppercase font-bold tracking-widest text-secondary flex items-center gap-1">
                      STEP {activeStep.sequence} OF {stepsCount} <ChevronRight className="h-2 w-2" /> {activeStep.nodeId.toUpperCase()} NODE
                    </span>
                    <h4 className="text-sm font-bold text-foreground font-serif">
                      {viewMode === 'technical' && activeStep.technicalView?.title
                        ? activeStep.technicalView.title
                        : viewMode === 'recruiter' && activeStep.recruiterView?.title
                          ? activeStep.recruiterView.title
                          : activeStep.title}
                    </h4>
                  </div>

                  {activeStep.latencyMs && (
                    <Badge variant="outline" className="text-[8px] font-mono shrink-0 px-2 py-0.5 font-bold uppercase tracking-wider">
                      LATENCY: {activeStep.latencyMs}ms
                    </Badge>
                  )}
                </div>

                <p className="text-[11.5px] text-secondary leading-relaxed font-semibold">
                  {viewMode === 'technical' && activeStep.technicalView?.description
                    ? activeStep.technicalView.description
                    : viewMode === 'recruiter' && activeStep.recruiterView?.description
                      ? activeStep.recruiterView.description
                      : activeStep.description}
                </p>

                {/* Data Transforms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-card-border/40 pt-4 font-mono text-[10.5px]">
                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/2 text-left">
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1 select-none">
                      <Code className="h-3 w-3 text-sky-400" /> INPUT DATA
                    </span>
                    <span className="text-foreground leading-relaxed font-bold break-all">
                      {activeStep.input}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/2 text-left">
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1 select-none">
                      <Cpu className="h-3 w-3 text-cyan-400" /> TRANSFORMATION
                    </span>
                    <span className="text-foreground leading-relaxed font-bold">
                      {activeStep.action}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/[0.01] border border-white/2 text-left">
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1 select-none">
                      <Database className="h-3 w-3 text-emerald-400" /> OUTPUT STATE
                    </span>
                    <span className="text-foreground leading-relaxed font-bold">
                      {activeStep.output}
                    </span>
                  </div>
                </div>

                {/* Perspective Metric if available */}
                {(viewMode === 'technical' && activeStep.technicalView?.metric) && (
                  <div className="text-[9.5px] font-mono text-cyan-400 bg-cyan-950/10 border border-cyan-900/30 p-2.5 rounded-lg select-none">
                    <strong>Tech Specification:</strong> {activeStep.technicalView.metric}
                  </div>
                )}
                {(viewMode === 'recruiter' && activeStep.recruiterView?.metric) && (
                  <div className="text-[9.5px] font-mono text-emerald-400 bg-emerald-950/10 border border-emerald-900/30 p-2.5 rounded-lg select-none">
                    <strong>Recruiter Impact:</strong> {activeStep.recruiterView.metric}
                  </div>
                )}
                {(viewMode === 'overview' && activeStep.businessView?.metric) && (
                  <div className="text-[9.5px] font-mono text-amber-500 bg-amber-950/10 border border-amber-900/30 p-2.5 rounded-lg select-none">
                    <strong>Overview Insight:</strong> {activeStep.businessView.metric}
                  </div>
                )}

                {/* Security Audit Notations Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-card-border/40 pt-4">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-secondary">
                    <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                    <span className="font-semibold text-left">
                      <strong>Security Protocol:</strong> {activeStep.securityNote}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-[9px] font-mono font-bold text-cyan-400 hover:text-white border-b border-cyan-500/20 hover:border-white transition-colors cursor-pointer select-none py-0.5 shrink-0"
                  >
                    EXPAND TRANSACTION DATA LOGS 📋
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Simulation Controls Panel */}
            <div className="flex items-center justify-between border border-card-border bg-white/[0.01] rounded-xl p-3.5 select-none">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={activeStepIdx === 0}
                  className="p-2 border border-card-border rounded-lg text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={handlePlayToggle}
                  className="px-4 py-2 border border-card-border rounded-lg text-white hover:bg-white/5 flex items-center gap-2 text-[10px] font-mono font-bold cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-3 w-3 text-amber-500" /> PAUSE LOOP
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3 text-emerald-400" /> PLAY SIMULATION
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  disabled={activeStepIdx === stepsCount - 1}
                  className="p-2 border border-card-border rounded-lg text-secondary hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={handleReset}
                className="p-2 border border-card-border rounded-lg text-secondary hover:text-white flex items-center gap-1.5 text-[9px] font-mono font-bold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> RESET
              </button>
            </div>
          </div>

          {/* Right Sidebar: Mobile Vertical List Timeline / Interactive log log (Desktop only) */}
          <div className="lg:col-span-4 flex flex-col gap-3 font-mono text-[9px] select-none text-left w-full h-full">
            <span className="text-secondary font-bold uppercase tracking-wider px-1">Pipeline Steps Checklist</span>

            <div className="flex flex-col gap-2 bg-black/25 border border-card-border rounded-xl p-3 max-h-[360px] overflow-y-auto w-full scrollbar-thin">
              {activeFlow.steps.map((step, idx) => {
                const isActive = idx === activeStepIdx;
                const isPast = idx < activeStepIdx;

                return (
                  <div
                    key={step.sequence}
                    onClick={() => {
                      setIsRunning(false);
                      setActiveStepIdx(idx);
                    }}
                    className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${isActive
                      ? 'bg-white/5 border-white/20 shadow-sm'
                      : 'border-card-border/40 hover:border-white/10'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center font-bold text-[8px]`}
                        style={{
                          borderColor: isActive ? currentFlowAccentColor : isPast ? `${currentFlowAccentColor}66` : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#ffffff' : '#737373'
                        }}
                      >
                        {isPast ? <CheckCircle2 className="h-3 w-3" style={{ color: currentFlowAccentColor }} /> : step.sequence}
                      </div>
                      <span className={isActive ? 'text-white font-bold' : 'text-secondary font-medium'}>
                        {step.title}
                      </span>
                    </div>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full animate-ping" style={{ backgroundColor: currentFlowAccentColor }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Slide-Over Drawer Panel */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm pointer-events-auto">
            {/* Click outside to close */}
            <div className="flex-1" onClick={() => setIsDrawerOpen(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="w-full max-w-lg h-full border-l border-card-border bg-card-bg/95 backdrop-blur-md p-6 shadow-2xl flex flex-col gap-5 select-text text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-card-border pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="h-[18px] w-[18px] text-cyan-400" />
                  <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">Transaction Data Ledger</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 border border-card-border rounded-lg text-secondary hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 font-mono text-[10.5px] scrollbar-thin">
                <div className="flex flex-col gap-1 p-3.5 bg-black/45 border border-card-border rounded-lg">
                  <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">Metadata Context</span>
                  <div className="flex justify-between border-b border-white/2 pb-1 mt-1">
                    <span className="text-secondary">Pipeline:</span>
                    <span className="text-white font-bold">{activeFlow.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/2 pb-1">
                    <span className="text-secondary">Active Node:</span>
                    <span className="text-white font-bold uppercase">{activeStep.nodeId}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/2 pb-1">
                    <span className="text-secondary">Step Index:</span>
                    <span className="text-white font-bold">{activeStep.sequence} of {stepsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Security Protocol:</span>
                    <span className="text-amber-500 font-bold">{activeStep.securityNote}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 p-3.5 bg-black/45 border border-card-border rounded-lg">
                  <div className="flex justify-between items-center border-b border-white/2 pb-1.5">
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-widest">Simulated JSON payload</span>
                    <span className="text-[7.5px] text-cyan-400 font-black tracking-widest bg-cyan-950/20 px-2 py-0.5 rounded">REST_RPC</span>
                  </div>

                  <pre className="text-foreground leading-relaxed overflow-x-auto text-[9.5px] p-2 bg-black/25 rounded border border-white/2 font-mono scrollbar-thin select-text">
                    {JSON.stringify(getMockJSONLog(activeFlow.id, activeStep.sequence), null, 2)}
                  </pre>
                </div>

                <div className="flex flex-col gap-2 p-3.5 bg-black/45 border border-card-border rounded-lg text-secondary">
                  <span className="text-[8px] font-bold text-foreground uppercase tracking-widest">Transaction Security Validation Audit</span>
                  <p className="leading-relaxed text-[9.5px]">
                    This transaction represents verified payloads processed during system runtimes. To protect Vraj Patel&apos;s portfolio integrity, security filters are evaluated on server components.
                  </p>
                  <ul className="list-disc list-inside text-[9.5px] flex flex-col gap-1 mt-1 pl-1">
                    <li>Cross-Site Scripting (XSS) Sanitization on input frames</li>
                    <li>Secure token headers authentication verification gateways</li>
                    <li>Restricted SQL transaction parameters writes using Row-Level Security (RLS)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Card>
  );
}
