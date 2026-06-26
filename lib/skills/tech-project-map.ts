export interface ProjectRef {
  title: string;
  slug: string;
  isExternal?: boolean;
}

export interface TechItem {
  id: string;
  name: string;
  ring: number; // 1 to 5
  category: "Frontend" | "Backend/DB" | "AI/Automation" | "Quant/Data" | "Tools";
  proof: string;
  projects: ProjectRef[];
}

export const TECH_PROJECT_MAP: TechItem[] = [
  // Ring 1: Frontend
  {
    id: "nextjs",
    name: "Next.js",
    ring: 1,
    category: "Frontend",
    proof: "Core web framework used to build production portals. Implemented dynamic routes, middleware API gateways, and hydration-safe SSR states.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "Marea Luxury Fashion", slug: "marea-website" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },
  {
    id: "react",
    name: "React",
    ring: 1,
    category: "Frontend",
    proof: "Leveraged advanced state hooks (useState, useEffect, useMemo), custom context structures, and React Three Fiber 3D canvases.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" },
      { title: "Marea Luxury Fashion", slug: "marea-website" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },
  {
    id: "typescript",
    name: "TypeScript",
    ring: 1,
    category: "Frontend",
    proof: "Maintained complete type-safety across database models, event routers, schema validations, and options Greeks numerical pipelines.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" }
    ]
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    ring: 1,
    category: "Frontend",
    proof: "Designed unified UI design systems, glassy responsive elements, dark modes, and print-media PDF templates.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Marea Luxury Fashion", slug: "marea-website" },
      { title: "Surendra & Co. Website", slug: "surendra-bus-body" }
    ]
  },
  {
    id: "framer-motion",
    name: "Framer Motion",
    ring: 1,
    category: "Frontend",
    proof: "Created custom layout overlays, route transition blurs, spotlight cursor bounds, and smooth springs.",
    projects: [
      { title: "Surendra & Co. Website", slug: "surendra-bus-body" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },

  // Ring 2: Backend/DB
  {
    id: "nodejs",
    name: "Node.js",
    ring: 2,
    category: "Backend/DB",
    proof: "Constructed API backend endpoints, database connector integrations, webhook verifications, and email queues.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" }
    ]
  },
  {
    id: "fastapi",
    name: "FastAPI",
    ring: 2,
    category: "Backend/DB",
    proof: "Engineered high-performance python API compute endpoints running asynchronous background workers and options math algorithms.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" }
    ]
  },
  {
    id: "supabase",
    name: "Supabase",
    ring: 2,
    category: "Backend/DB",
    proof: "Configured PostgreSQL databases, customer table structures, secured Row Level Security (RLS) policies, and authenticated login channels.",
    projects: [
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" },
      { title: "Marea Luxury Fashion", slug: "marea-website" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    ring: 2,
    category: "Backend/DB",
    proof: "Designed relational tables, triggers, indexes, and optimized query transactions for inventory ledgers and telemetry log lists.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" }
    ]
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    ring: 2,
    category: "Backend/DB",
    proof: "Managed database queries and schema migration scripts, eliminating SQL write injection vulnerabilities.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" }
    ]
  },

  // Ring 3: AI/Automation
  {
    id: "gemini",
    name: "Gemini API",
    ring: 3,
    category: "AI/Automation",
    proof: "Leveraged model intelligence to crawl/personalize marketing copy, audit logs, and power conversational portfolios.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },
  {
    id: "google-genai",
    name: "Google GenAI SDK",
    ring: 3,
    category: "AI/Automation",
    proof: "Implemented structured model response schemas using Pydantic models to ensure validation accuracy during AI runs.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "Ask Vraj AI", slug: "ask-vraj", isExternal: true }
    ]
  },
  {
    id: "gmail-oauth",
    name: "Gmail OAuth API",
    ring: 3,
    category: "AI/Automation",
    proof: "Configured Google OAuth 2.0 user sequences to securely send outbound email campaigns and drafts dynamically.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" }
    ]
  },
  {
    id: "sheets-api",
    name: "Google Sheets API",
    ring: 3,
    category: "AI/Automation",
    proof: "Integrated Google Sheets APIs (using gspread) to synchronize leads metadata and campaigns log updates.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" }
    ]
  },

  // Ring 4: Quant/Data
  {
    id: "python",
    name: "Python",
    ring: 4,
    category: "Quant/Data",
    proof: "Core language used for quantitative options math solvers, vector backtests, data processing streams, and model fitting.",
    projects: [
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" },
      { title: "NF-LRD Quant", slug: "nf-lrd-regime-discovery" },
      { title: "BTC-ALGO Trading", slug: "btc-algo-trading" }
    ]
  },
  {
    id: "pandas",
    name: "Pandas",
    ring: 4,
    category: "Quant/Data",
    proof: "Cleaned options chain databases, preprocessed index data, forward-filled gaps, and computed logarithmic returns profiles.",
    projects: [
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" },
      { title: "NF-LRD Quant", slug: "nf-lrd-regime-discovery" },
      { title: "BTC-ALGO Trading", slug: "btc-algo-trading" }
    ]
  },
  {
    id: "numpy",
    name: "NumPy",
    ring: 4,
    category: "Quant/Data",
    proof: "Vectorized risk matrices, computed Option Greeks mathematical variables, and evaluated portfolio transition stats in-memory.",
    projects: [
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" },
      { title: "NF-LRD Quant", slug: "nf-lrd-regime-discovery" },
      { title: "BTC-ALGO Trading", slug: "btc-algo-trading" }
    ]
  },
  {
    id: "statsmodels",
    name: "statsmodels / arch",
    ring: 4,
    category: "Quant/Data",
    proof: "Fitted Gaussian statistical models (GARCH) and Markov regression matrices to detect market volatility regimes.",
    projects: [
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" },
      { title: "NF-LRD Quant", slug: "nf-lrd-regime-discovery" }
    ]
  },
  {
    id: "streamlit",
    name: "Streamlit",
    ring: 4,
    category: "Quant/Data",
    proof: "Developed analytical dashboards with Plotly grids to visualize market transitions and test portfolios.",
    projects: [
      { title: "NF-LRD Quant", slug: "nf-lrd-regime-discovery" },
      { title: "BTC-ALGO Trading", slug: "btc-algo-trading" }
    ]
  },

  // Ring 5: Tools
  {
    id: "github",
    name: "GitHub",
    ring: 5,
    category: "Tools",
    proof: "Utilized for version control, collaborative code reviews, branches reconciliation, and automated deployment integrations.",
    projects: [
      { title: "OutreachOps AI", slug: "outreachops-ai" },
      { title: "MSPE Volatility Engine", slug: "mspe-volatility-engine" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" }
    ]
  },
  {
    id: "vercel",
    name: "Vercel",
    ring: 5,
    category: "Tools",
    proof: "Primary cloud deployment platform. Maintained production serverless builds, edge handlers, SSL details, and environment configurations.",
    projects: [
      { title: "Enermass Solar Calculator", slug: "enermass-solar-calculator" },
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "OutreachOps AI", slug: "outreachops-ai" }
    ]
  },
  {
    id: "docker",
    name: "Docker",
    ring: 5,
    category: "Tools",
    proof: "Containerized local development networks, including PostgreSQL servers and Redis caching instances.",
    projects: [
      { title: "Bhagwati Interior ERP", slug: "bhagwati-interior-erp" },
      { title: "Driedhub Marketplace", slug: "driedhub-marketplace" }
    ]
  }
];

export const getRingLabel = (ring: number): string => {
  switch (ring) {
    case 1: return "Frontend Dev";
    case 2: return "Backend & DB";
    case 3: return "AI & Automation";
    case 4: return "Quant & Data";
    case 5: return "Tools & Deployment";
    default: return `Ring ${ring}`;
  }
};
