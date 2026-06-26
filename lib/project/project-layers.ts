export interface ProjectLayer {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  techTags: string[];
  iconName: "User" | "Cpu" | "Database" | "Sparkles" | "TrendingUp" | "FileText" | "LayoutDashboard" | "ShieldCheck" | "List" | "Coins" | "Mail" | "Network";
  accent: "cyan" | "blue" | "amber" | "violet" | "emerald" | "rose";
}

export const PROJECT_LAYERS: Record<string, ProjectLayer[]> = {
  "enermass-solar-calculator": [
    {
      id: "user-input",
      title: "User Input Layer",
      shortDesc: "Captures customer load requirements and site structural inputs.",
      detailedDesc: "Interactive client forms gather structural details such as local power loads, phase requirements, and roof layout dimensions to pre-size optimal panel capacity ranges.",
      techTags: ["Next.js", "React Hook Form", "Tailwind CSS"],
      iconName: "User",
      accent: "cyan"
    },
    {
      id: "calc-engine",
      title: "Solar Calculation Engine",
      shortDesc: "Applies sun hours state-coefficients to determine size parameters.",
      detailedDesc: "Utilizes a client-side coefficient matrix mapping sun hours, solar irradiance profiles, and panel specifications to output potential generation capacity metrics.",
      techTags: ["TypeScript", "Zustand Store"],
      iconName: "Cpu",
      accent: "blue"
    },
    {
      id: "subsidy-logic",
      title: "Pricing & Subsidy Logic",
      shortDesc: "Calculates local GST and central government subsidy schedules.",
      detailedDesc: "Performs instant cost assessments based on the national PM Surya Ghar subsidy brackets, calculating state-specific tax rates, net quotes, and ROI tables.",
      techTags: ["Zustand Store", "Formula Matrix"],
      iconName: "Coins",
      accent: "amber"
    },
    {
      id: "crm-ledger",
      title: "Customer & Project Data",
      shortDesc: "Maintains invoice data structures and quote state persistence.",
      detailedDesc: "Active quote details, client profile parameters, and invoice overrides are bound to relational tables and synced with browser memory stores.",
      techTags: ["LocalStorage", "Zustand Hydration"],
      iconName: "Database",
      accent: "emerald"
    },
    {
      id: "proposal-output",
      title: "Proposal Output Layer",
      shortDesc: "Compiles complete BOM matrices to print-ready PDF proposals.",
      detailedDesc: "Transforms configured system attributes into high-fidelity PDF spreadsheets, generating client brochures and raw invoice quotes instantly.",
      techTags: ["CSS Print Media", "window.print"],
      iconName: "FileText",
      accent: "rose"
    },
    {
      id: "erp-dashboard",
      title: "ERP Dashboard Gateway",
      shortDesc: "Admin console to modify base equipment rates and CRM pipelines.",
      detailedDesc: "Central management cockpit tracking leads states from drafts to active installations. Allows administrators to update pricing registers dynamically.",
      techTags: ["Next.js App Router", "Drizzle ORM"],
      iconName: "LayoutDashboard",
      accent: "violet"
    }
  ],
  "outreachops-ai": [
    {
      id: "lead-source",
      title: "Lead Source Layer",
      shortDesc: "Initiates outbound pipelines via client-defined targets lists.",
      detailedDesc: "Ingests targets list files containing client company names, websites, and emails to feed the background personalization pipeline.",
      techTags: ["Next.js Client", "CSV Parse"],
      iconName: "List",
      accent: "cyan"
    },
    {
      id: "sheets-ingestion",
      title: "Google Sheets Ingestion",
      shortDesc: "Fetches and synchronizes active targets from Google Spreadsheets.",
      detailedDesc: "Connects securely to remote Google Spreadsheets via official Google Sheets API, parsing headers and streaming rows to backend compute threads.",
      techTags: ["FastAPI Backend", "Google Sheets API", "Pydantic"],
      iconName: "Database",
      accent: "blue"
    },
    {
      id: "gemini-personalization",
      title: "Gemini Personalization Layer",
      shortDesc: "Crawls websites and drafts custom pitches using Gemini API.",
      detailedDesc: "Crawls and crawls targeted sites, extracts context text, and maps inputs to LLM prompt templates via Gemini Flash to compile tailored emails.",
      techTags: ["Google GenAI SDK", "Gemini API", "FastAPI"],
      iconName: "Sparkles",
      accent: "rose"
    },
    {
      id: "oauth-gateway",
      title: "Gmail OAuth Draft Gateway",
      shortDesc: "Verifies user access tokens to insert emails into draft folders.",
      detailedDesc: "Routes generated outreach pitches directly to Google account draft queues, utilizing secure OAuth 2.0 credentials tokens to prevent credential leaks.",
      techTags: ["Gmail OAuth API", "Token Manager"],
      iconName: "Mail",
      accent: "amber"
    },
    {
      id: "outbox-worker",
      title: "Outbox Workflow Sequencer",
      shortDesc: "Manages asynchronous scheduling and email rate limiting.",
      detailedDesc: "Polices campaign sequences, buffering message schedules dynamically to avoid exceeding public API rate limitations and SMTP thresholds.",
      techTags: ["FastAPI Async Tasks", "Queue Worker"],
      iconName: "Network",
      accent: "violet"
    },
    {
      id: "analytics-dashboard",
      title: "Tracking Dashboard",
      shortDesc: "Displays campaign queue telemetry and response analytics.",
      detailedDesc: "Presents campaign telemetry summaries (pending, sent, errors) in glassy charts, drawing performance logs directly from relational databases.",
      techTags: ["Next.js UI", "Supabase DB"],
      iconName: "LayoutDashboard",
      accent: "emerald"
    }
  ],
  "constructionos": [
    {
      id: "project-milestones",
      title: "Project Milestones Layer",
      shortDesc: "Tracks contractor schedules and project completion percentages.",
      detailedDesc: "Integrates project milestone tracking layouts, task schedules, and visual timelines showing active, delayed, or completed phases.",
      techTags: ["Next.js Client", "Gantt Charts"],
      iconName: "List",
      accent: "cyan"
    },
    {
      id: "worker-shifting",
      title: "Worker Shifting Scheduler",
      shortDesc: "Coordinates subcontractor shift schedules and attendance sheets.",
      detailedDesc: "Visualizes job-site labor distribution grids, managing worker registration logs, credentials, and real-time shifts dispatching panels.",
      techTags: ["Zustand Store", "Tailwind CSS"],
      iconName: "User",
      accent: "blue"
    },
    {
      id: "inventory-management",
      title: "Inventory Management Layer",
      shortDesc: "Monitors site supply logs (steel, wood, concrete).",
      detailedDesc: "Reconciles structural material balances across distinct sites. Flags low stocks and manages override locks for manual adjustments.",
      techTags: ["Drizzle ORM", "PostgreSQL"],
      iconName: "Database",
      accent: "amber"
    },
    {
      id: "purchase-orders",
      title: "Purchase Orders Pipeline",
      shortDesc: "Generates automated vendor requests based on project rates.",
      detailedDesc: "Tracks procurement cycles by auto-filling materials requisitions, calculating rates, and forwarding purchase orders to vendor endpoints.",
      techTags: ["FastAPI APIs", "Invoice Schema"],
      iconName: "Coins",
      accent: "rose"
    },
    {
      id: "finance-ledger",
      title: "Cost Sheet Ledger",
      shortDesc: "Monitors job-site expenses, invoicing, and profit margins.",
      detailedDesc: "Calculates total operational expenditures dynamically, comparing active billing, tax brackets, and payments history sheets against target profit metrics.",
      techTags: ["PostgreSQL Transactional", "BOM Logic"],
      iconName: "FileText",
      accent: "violet"
    },
    {
      id: "security-gateway",
      title: "Security & RLS Gateway",
      shortDesc: "Enforces role authentication and Row Level Security (RLS) rules.",
      detailedDesc: "Secures sensitive construction logs and payroll ledgers behind credentials checkpoints, filtering data access using Supabase RLS policies.",
      techTags: ["Supabase Auth", "Row Level Security"],
      iconName: "ShieldCheck",
      accent: "emerald"
    }
  ],
  "nf-lrd-regime-discovery": [
    {
      id: "data-ingestion",
      title: "Data Ingestion Pipeline",
      shortDesc: "Streams historical NIFTY 50 price vectors from financial APIs.",
      detailedDesc: "Polls and ingests daily historical stock index indices, checking arrays structural alignment, and caching data in local system memory matrices.",
      techTags: ["Python yfinance", "Pandas Datareader"],
      iconName: "Network",
      accent: "cyan"
    },
    {
      id: "feature-pipeline",
      title: "Feature Engineering Pipeline",
      shortDesc: "Calculates logarithmic returns, rolling averages, and drawdowns.",
      detailedDesc: "Vectorizes historical price records to generate time-series parameters, rolling statistics, standard deviation spreads, and trailing drawdown series.",
      techTags: ["NumPy Matrix Operations", "Pandas Series"],
      iconName: "Cpu",
      accent: "blue"
    },
    {
      id: "regime-classifier",
      title: "HMM Regime Classifier",
      shortDesc: "Runs Gaussian Hidden Markov Models to isolate market states.",
      detailedDesc: "Executes unsupervised machine learning clustering via Gaussian HMM to segment price trends into latent states (bullish, bearish, volatile).",
      techTags: ["Python hmmlearn", "scikit-learn"],
      iconName: "Sparkles",
      accent: "rose"
    },
    {
      id: "risk-analytics",
      title: "Risk Analytics Engine",
      shortDesc: "Computes Sharpe ratios, tail drawdowns, and transition likelihoods.",
      detailedDesc: "Analyzes covariance matrices and computes regime transition probabilities, outputting strategy metrics and max drawdowns stats.",
      techTags: ["NumPy", "SciPy Solver"],
      iconName: "Coins",
      accent: "amber"
    },
    {
      id: "backtester",
      title: "Strategy Backtest Layer",
      shortDesc: "Simulates adaptive strategy returns versus benchmarks.",
      detailedDesc: "Simulates trading execution over historical regimes, applying sector weighting logic and graphing relative returns growth dynamically.",
      techTags: ["Vectorized Backtesting", "Matplotlib Model"],
      iconName: "FileText",
      accent: "violet"
    },
    {
      id: "streamlit-board",
      title: "Streamlit Dashboard Output",
      shortDesc: "Renders data visualizations and sliders on interactive client views.",
      detailedDesc: "Renders visual layouts displaying regime segmentation plots, transition graphs, and configuration parameters sidebars to users.",
      techTags: ["Streamlit UI", "Plotly Charts"],
      iconName: "LayoutDashboard",
      accent: "emerald"
    }
  ],
  "mspe-volatility-engine": [
    {
      id: "market-data",
      title: "Market Option Chains",
      shortDesc: "Ingests option chains indices, strike ranges, and tickers.",
      detailedDesc: "Fetches structured option logs containing pricing histories, strike thresholds, implied parameters, and interest rate calendars.",
      techTags: ["FastAPI Backend", "requests Client"],
      iconName: "Network",
      accent: "cyan"
    },
    {
      id: "garch-forecast",
      title: "GARCH Volatility Forecast",
      shortDesc: "Estimates volatility clustering variance through statistical models.",
      detailedDesc: "Applies statistical modeling (GARCH 1,1) to analyze and project variance updates over rolling timelines, capturing historical market clusters.",
      techTags: ["Python arch Library", "FastAPI"],
      iconName: "Cpu",
      accent: "blue"
    },
    {
      id: "implied-skew",
      title: "Implied Volatility Surface",
      shortDesc: "Solves root-finding functions to map option smile skews.",
      detailedDesc: "Computes Option Greeks (Delta, Gamma, Vega, Theta) and calculates implied volatilities across exspiries using numerical root-finding algorithms.",
      techTags: ["SciPy Optimizers", "Black-Scholes Model"],
      iconName: "Coins",
      accent: "amber"
    },
    {
      id: "xgboost-predictor",
      title: "XGBoost Projection Engine",
      shortDesc: "Runs machine learning regressions to forecast surface shifts.",
      detailedDesc: "Passes options coordinates and historical variance vectors to XGBoost regressor pipelines to forecast volatility surface shifts.",
      techTags: ["scikit-learn", "XGBoost Regressor"],
      iconName: "Sparkles",
      accent: "rose"
    },
    {
      id: "plotly-3d-skew",
      title: "Plotly 3D Skew Canvas",
      shortDesc: "Renders hardware-accelerated 3D implied volatility meshes.",
      detailedDesc: "Transforms 2D strike matrices into hardware-accelerated 3D surface charts, letting options traders inspect skews across expiries.",
      techTags: ["Plotly.js Mesh3d", "Next.js UI"],
      iconName: "LayoutDashboard",
      accent: "emerald"
    },
    {
      id: "api-endpoints",
      title: "FastAPI Compute Endpoint",
      shortDesc: "Asynchronous backend routes processing computational payloads.",
      detailedDesc: "Exposes REST endpoints that receive option books, run Python calculation libraries, and stream structured JSON matrices under 80ms.",
      techTags: ["FastAPI Async Router", "Uvicorn Worker"],
      iconName: "FileText",
      accent: "violet"
    }
  ]
};
