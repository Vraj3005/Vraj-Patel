import { VisualNode, VisualEdge } from '@/types/advanced';

/**
 * Resolver for retrieving project system visualizer graphs.
 * Serves real architectural specifications statically to guarantee zero-latency
 * and absolute reliability across local and production deployment scopes.
 */
export class GraphDataResolver {
  /**
   * Fetch nodes and edges layout lists for the System Visualizer
   */
  public static async getArchitectureGraph(
    projectSlug: string
  ): Promise<{ nodes: VisualNode[]; edges: VisualEdge[] }> {
    // Serve high-fidelity static configurations directly for performance and reliability
    return this.generateStaticGraph(projectSlug);
  }

  /**
   * Static configurations mapping coordinate paths and architectural specifications per project
   */
  private static generateStaticGraph(
    slug: string
  ): { nodes: VisualNode[]; edges: VisualEdge[] } {
    let nodes: VisualNode[] = [];
    let edges: VisualEdge[] = [];

    // Base coordinate presets for visual consistency in mapping
    const cols = {
      user: 80,
      frontend: 220,
      validation: 360,
      api: 380,
      ai: 560,
      db: 560,
      external: 720
    };

    if (slug === 'enermass-solar-calculator') {
      nodes = [
        { id: 'user', label: 'Installer Surveyor', type: 'user', status: 'online', x: cols.user, y: 250, details: { description: 'Sales surveyor operating on-site.', client: 'Mobile Web Browser' } },
        { id: 'ui', label: 'Sizing Frontend UI', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { stack: 'Next.js, React, Tailwind CSS', state: 'Zustand Store Context' } },
        { id: 'zod', label: 'Quote Validator', type: 'validation', status: 'online', x: cols.validation, y: 130, details: { engine: 'Zod Inputs Schema Check', latency: '0ms (Immediate Client Gate)' } },
        { id: 'state', label: 'Zustand Sizing Store', type: 'frontend', status: 'online', x: cols.api, y: 250, details: { function: 'BOM modifications tracker', capacity: 'Active pricing states context' } },
        { id: 'math', label: 'Subsidy Math Engine', type: 'ai', status: 'online', x: cols.db, y: 180, details: { logic: 'PM Surya Ghar Indian States Matrices', calculation: 'Capacity sizing, simple ROI coefficients' } },
        { id: 'local', label: 'LocalStorage Persist', type: 'database', status: 'online', x: cols.db, y: 370, details: { database: 'Client-side Zustand Persist Store', capacity: 'Quotes draft JSON strings' } },
        { id: 'pdf', label: 'Proposal PDF Exporter', type: 'external', status: 'online', x: cols.external, y: 250, details: { generator: 'Print-optimized CSS letterheads', action: 'Direct browser compiled PDF brochure' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Select templates' },
        { id: 'e2', source: 'ui', target: 'zod', animated: true, flowSpeed: 'fast', label: 'BOM modifications' },
        { id: 'e3', source: 'ui', target: 'state', animated: true, flowSpeed: 'fast' },
        { id: 'e4', source: 'state', target: 'math', animated: true, flowSpeed: 'fast', label: 'Calculate capacity' },
        { id: 'e5', source: 'state', target: 'local', animated: false, label: 'Cache draft quotes' },
        { id: 'e6', source: 'math', target: 'pdf', animated: true, flowSpeed: 'normal', label: 'Compile PDF sheet' },
        { id: 'e7', source: 'state', target: 'pdf', animated: true, flowSpeed: 'normal' }
      ];
    } else if (slug === 'outreachops-ai') {
      nodes = [
        { id: 'user', label: 'Campaign Manager', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Sales Operations Agent', action: 'Initiate lead campaigns' } },
        { id: 'ui', label: 'Outreach Dashboard', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { stack: 'Next.js App Router, Tailwind CSS', state: 'React Query data hydration' } },
        { id: 'api', label: 'FastAPI Core Server', type: 'api', status: 'online', x: cols.api, y: 250, details: { framework: 'Python FastAPI asynchronous endpoints', processing: 'Scrapes landing pages' } },
        { id: 'validation', label: 'Pydantic Schema Gate', type: 'validation', status: 'online', x: cols.api, y: 130, details: { check: 'Pydantic input settings parsing' } },
        { id: 'sheets', label: 'Google Sheets API', type: 'external', status: 'online', x: cols.db, y: 130, details: { integration: 'gspread data library synchronization' } },
        { id: 'ai', label: 'Gemini LLM Copywriter', type: 'ai', status: 'online', x: cols.db, y: 250, details: { model: 'Google GenAI SDK structured JSON response models' } },
        { id: 'db', label: 'Supabase Postgres', type: 'database', status: 'online', x: cols.db, y: 370, details: { log: 'Campaign outbound status history lists database' } },
        { id: 'smtp', label: 'Gmail OAuth 2.0 API', type: 'external', status: 'online', x: cols.external, y: 250, details: { transport: 'OAuth 2.0 authorized SMTP pipeline dispatches' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Configure settings' },
        { id: 'e2', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Trigger campaigns run' },
        { id: 'e3', source: 'api', target: 'validation', animated: true, flowSpeed: 'fast' },
        { id: 'e4', source: 'api', target: 'sheets', animated: true, flowSpeed: 'normal', label: 'Sync active leads' },
        { id: 'e5', source: 'api', target: 'ai', animated: true, flowSpeed: 'fast', label: 'Personalize copy' },
        { id: 'e6', source: 'api', target: 'db', animated: false, label: 'Write send status' },
        { id: 'e7', source: 'api', target: 'smtp', animated: true, flowSpeed: 'normal', label: 'Sequence SMTP mail' }
      ];
    } else if (slug === 'bhagwati-interior-erp') {
      nodes = [
        { id: 'user', label: 'Studio Designer', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Project Manager / Interior Designer', action: 'Upload site specifications' } },
        { id: 'ui', label: 'Next.js Studio View', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { library: 'Tailwind CSS, shadcn/ui components', animation: 'Framer Motion dashboard views' } },
        { id: 'auth', label: 'NextAuth Session Gate', type: 'auth', status: 'online', x: cols.frontend, y: 130, details: { gateway: 'Bcryptjs hashed passwords validation', middleware: 'JWT Session tokens verify' } },
        { id: 'actions', label: 'Server Actions Router', type: 'api', status: 'online', x: cols.api, y: 250, details: { protocol: 'Type-safe React Server Actions', engine: 'Next.js backend server endpoints' } },
        { id: 'validation', label: 'Zod Body Validator', type: 'validation', status: 'online', x: cols.api, y: 130, details: { check: 'Input payload parsing rules', model: 'Site update schedules schema' } },
        { id: 'redis', label: 'Upstash Redis Cache', type: 'database', status: 'online', x: cols.db, y: 130, details: { keys: 'Active wood materials lists', ttl: '2 hours key refresh intervals' } },
        { id: 'db', label: 'Supabase Postgres', type: 'database', status: 'online', x: cols.db, y: 250, details: { tables: 'Sites registers, task metrics, item catalogs', orm: 'Drizzle ORM transactions' } },
        { id: 'qstash', label: 'QStash Worker Queue', type: 'external', status: 'online', x: cols.external, y: 250, details: { cron: 'Scheduled worker queues', task: 'Cron events scheduler trigger' } },
        { id: 'resend', label: 'Resend Mail API', type: 'external', status: 'online', x: cols.external, y: 370, details: { channel: 'SMTP emails dispatcher', format: 'Direct notifications alerts' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'View design catalogs' },
        { id: 'e2', source: 'ui', target: 'auth', animated: false, label: 'Sign-in credentials' },
        { id: 'e3', source: 'ui', target: 'actions', animated: true, flowSpeed: 'fast', label: 'Save design cost' },
        { id: 'e4', source: 'actions', target: 'validation', animated: true, flowSpeed: 'fast' },
        { id: 'e5', source: 'actions', target: 'redis', animated: true, flowSpeed: 'fast', label: 'Query materials cache' },
        { id: 'e6', source: 'actions', target: 'db', animated: false, label: 'Transact site records' },
        { id: 'e7', source: 'actions', target: 'qstash', animated: true, flowSpeed: 'normal', label: 'Queue notice' },
        { id: 'e8', source: 'qstash', target: 'resend', animated: true, flowSpeed: 'normal' }
      ];
    } else if (slug === 'driedhub-marketplace') {
      nodes = [
        { id: 'user', label: 'Retail Buyer', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Customer browsing marketplace', action: 'Purchase dry fruits' } },
        { id: 'ui', label: 'Driedhub Storefront', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { stack: 'Next.js App Router, Tailwind CSS', state: 'Zustand cart checkout context' } },
        { id: 'auth', label: 'Supabase Auth sessions', type: 'auth', status: 'online', x: cols.frontend, y: 130, details: { engine: 'Supabase email & OTP logins', state: 'Browser cookies session store' } },
        { id: 'api', label: 'Next.js Checkout API', type: 'api', status: 'online', x: cols.api, y: 250, details: { route: '/api/checkout serverless lambda', validation: 'Secure request payload checks' } },
        { id: 'rzp', label: 'Razorpay Checkout SDK', type: 'external', status: 'online', x: cols.db, y: 250, details: { client: 'Razorpay checkout overlay integrations', status: 'Secure payments signature verify' } },
        { id: 'db', label: 'Supabase PostgreSQL DB', type: 'database', status: 'online', x: cols.external, y: 250, details: { schema: 'Public schema inventory, orders & customer profiles', security: 'Row Level Security policy constraints' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Select products' },
        { id: 'e2', source: 'ui', target: 'auth', animated: false },
        { id: 'e3', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Initialize order checkout' },
        { id: 'e4', source: 'api', target: 'rzp', animated: true, flowSpeed: 'fast', label: 'Request payment token' },
        { id: 'e5', source: 'rzp', target: 'db', animated: true, flowSpeed: 'normal', label: 'Sync order billing record' }
      ];
    } else if (slug === 'driedhub-admin-dashboard') {
      nodes = [
        { id: 'user', label: 'Admin Inventory Lead', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Store Owner / Operator', action: 'Update product lists & pricing' } },
        { id: 'ui', label: 'Admin ERP Panel', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { framework: 'Next.js Admin Console SPA', layouts: 'Grid tables data displays' } },
        { id: 'auth', label: 'Admin Guard Sessions', type: 'auth', status: 'online', x: cols.frontend, y: 130, details: { verification: 'Supabase Service role tokens validation', status: 'Restrict access to admin users' } },
        { id: 'api', label: 'Inventory API Routes', type: 'api', status: 'online', x: cols.api, y: 250, details: { routes: '/api/admin/products routes handlers', transactions: 'BOM invoice approvals' } },
        { id: 'db', label: 'Supabase Postgres DB', type: 'database', status: 'online', x: cols.db, y: 250, details: { data: 'Orders registers, products stock, margin configs', security: 'Enforce full read/write admin rules' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Manage stock levels' },
        { id: 'e2', source: 'ui', target: 'auth', animated: false },
        { id: 'e3', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Flush stock updates' },
        { id: 'e4', source: 'api', target: 'db', animated: true, flowSpeed: 'fast' }
      ];
    } else if (slug === 'marea-website') {
      nodes = [
        { id: 'user', label: 'Fashion Shopper', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Visitor', action: 'Purchase luxury apparel' } },
        { id: 'ui', label: 'Marea Luxe Portal', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { design: 'Glassmorphic catalog collections display', library: 'Tailwind CSS + Framer Motion animations' } },
        { id: 'cms', label: 'TipTap WYSIWYG Content', type: 'frontend', status: 'online', x: cols.frontend, y: 130, details: { editor: 'Rich text CMS inputs parser', rendering: 'Parse design notes dynamically' } },
        { id: 'api', label: 'Next.js API Server', type: 'api', status: 'online', x: cols.api, y: 250, details: { router: 'Next.js Serverless endpoints router', validator: 'Stripe webhook triggers receiver' } },
        { id: 'stripe', label: 'Stripe Payments API', type: 'external', status: 'online', x: cols.db, y: 250, details: { pipeline: 'Stripe redirect link checkout session', check: 'Card transaction processing' } },
        { id: 'db', label: 'Supabase Collections DB', type: 'database', status: 'online', x: cols.external, y: 250, details: { schema: 'Luxury apparel catalog pricing, orders & customer details', security: 'Row Level Security policy audits' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Select designer bags' },
        { id: 'e2', source: 'ui', target: 'cms', animated: false },
        { id: 'e3', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Initiate payments checkout' },
        { id: 'e4', source: 'api', target: 'stripe', animated: true, flowSpeed: 'fast', label: 'Redirect to Stripe billing' },
        { id: 'e5', source: 'stripe', target: 'db', animated: true, flowSpeed: 'normal', label: 'Confirm payment receipt' }
      ];
    } else if (slug === 'marea-admin-dashboard') {
      nodes = [
        { id: 'user', label: 'Store Manager', type: 'user', status: 'online', x: cols.user, y: 250, details: { action: 'Curate catalog collections & analyze analytics sales logs' } },
        { id: 'ui', label: 'Marea Admin Panel', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { framework: 'Next.js Admin Console dashboard', features: 'Sales widgets, charts, and CMS editor' } },
        { id: 'auth', label: 'Admin Guard Sessions', type: 'auth', status: 'online', x: cols.frontend, y: 130, details: { verify: 'Supabase authenticated token parser' } },
        { id: 'api', label: 'Marea Admin API Routes', type: 'api', status: 'online', x: cols.api, y: 250, details: { endpoints: 'Admin analytics data loaders API', actions: 'Dnd-kit catalogs list update' } },
        { id: 'db', label: 'Supabase Postgres DB', type: 'database', status: 'online', x: cols.db, y: 250, details: { contents: 'Products assets, sales ledger, collections settings', access: 'Restricted admin actions only' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Edit collection order' },
        { id: 'e2', source: 'ui', target: 'auth', animated: false },
        { id: 'e3', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast' },
        { id: 'e4', source: 'api', target: 'db', animated: true, flowSpeed: 'fast', label: 'Save collection layout' }
      ];
    } else if (slug === 'surendra-bus-body') {
      nodes = [
        { id: 'user', label: 'Corporate Client', type: 'user', status: 'online', x: cols.user, y: 250, details: { role: 'Bus fleet owner looking for bus customization', action: 'Inquire quote' } },
        { id: 'ui', label: 'Surendra Portal UI', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { stack: 'Next.js Frontend show page, Tailwind CSS', layout: 'Responsive portfolio grids' } },
        { id: 'validation', label: 'Contact Form Validator', type: 'validation', status: 'online', x: cols.api, y: 130, details: { library: 'React Hook Form validations checks', target: 'Check email and phone parameters' } },
        { id: 'api', label: 'Email forward API Router', type: 'api', status: 'online', x: cols.api, y: 250, details: { endpoint: '/api/contact mail sender route', provider: 'Nodemailer transport server' } },
        { id: 'mail', label: 'Corporate Mail inbox', type: 'external', status: 'online', x: cols.external, y: 250, details: { target: 'Recieves contact detail alerts', status: 'Outlook / Gmail inbox receipt' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Submit contact message form' },
        { id: 'e2', source: 'ui', target: 'validation', animated: true, flowSpeed: 'fast' },
        { id: 'validation', source: 'validation', target: 'api', animated: true, flowSpeed: 'fast' },
        { id: 'e3', source: 'api', target: 'mail', animated: true, flowSpeed: 'normal', label: 'Deliver email notification' }
      ];
    } else if (slug === 'mspe-volatility-engine') {
      nodes = [
        { id: 'user', label: 'Derivative Trader', type: 'user', status: 'online', x: cols.user, y: 250, details: { goal: 'Visualize options implied volatility smiles structures' } },
        { id: 'ui', label: 'React Volatility Surface', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { canvas: 'Hardware accelerated Plotly.js 3D meshes', update: 'Autorefresh data sockets polling' } },
        { id: 'api', label: 'FastAPI Calculator Router', type: 'api', status: 'online', x: cols.api, y: 250, details: { server: 'Asynchronous Python FastAPI processes', engine: 'Pandas & NumPy option matrices' } },
        { id: 'cors', label: 'CORS Headers Gate', type: 'validation', status: 'online', x: cols.api, y: 130, details: { check: 'Restrict requests origin to portfolio domain', security: 'CORS response configuration' } },
        { id: 'solver', label: 'Newton-Raphson IV Engine', type: 'ai', status: 'online', x: cols.db, y: 130, details: { math: 'Root-finding equations iterations', solver: 'Black-Scholes implied volatilities solver' } },
        { id: 'garch', label: 'GARCH Variance Modeler', type: 'ai', status: 'online', x: cols.db, y: 250, details: { forecasting: 'GARCH (arch) volatility variance forecasts', states: 'Volatility clustering analysis' } },
        { id: 'db', label: 'Asyncpg PostgreSQL', type: 'database', status: 'online', x: cols.db, y: 370, details: { connector: 'Python asyncpg database queries pools', indexes: 'Spot asset pricing records database' } },
        { id: 'ml', label: 'XGBoost Skew Forecaster', type: 'ai', status: 'online', x: cols.external, y: 250, details: { algorithm: 'XGBoost ML modeling regression targets', inputs: 'Greeks plus historical ratios' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Rotate 3D mesh' },
        { id: 'e2', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Request Greeks' },
        { id: 'e3', source: 'api', target: 'cors', animated: true, flowSpeed: 'fast' },
        { id: 'e4', source: 'api', target: 'solver', animated: true, flowSpeed: 'fast', label: 'Solve IV roots' },
        { id: 'e5', source: 'api', target: 'garch', animated: true, flowSpeed: 'normal', label: 'Analyze clusters' },
        { id: 'e6', source: 'api', target: 'db', animated: false, label: 'Async SQL queries' },
        { id: 'e7', source: 'garch', target: 'ml', animated: true, flowSpeed: 'normal', label: 'XGBoost regression' }
      ];
    } else if (slug === 'nf-lrd-regime-discovery') {
      nodes = [
        { id: 'user', label: 'Research Analyst', type: 'user', status: 'online', x: cols.user, y: 250, details: { focus: 'Evaluate Nifty 50 market states transitions' } },
        { id: 'ui', label: 'Streamlit Controls UI', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { framework: 'Python Streamlit web panel dashboards', layout: 'Interactive sliders & multi-tabs' } },
        { id: 'yfinance', label: 'Yahoo Finance API', type: 'external', status: 'online', x: cols.api, y: 130, details: { feed: 'Daily closing indexes data fetch', limit: 'Public API quota bounds' } },
        { id: 'hmm', label: 'Gaussian HMM Classifier', type: 'ai', status: 'online', x: cols.api, y: 250, details: { engine: 'hmmlearn statistical package routines', state: 'Dynamic transition matrices' } },
        { id: 'parquet', label: 'Local Parquet Series', type: 'database', status: 'online', x: cols.db, y: 370, details: { storage: 'Historical vectors pricing data files', read: 'Pandas load methods' } },
        { id: 'backtester', label: 'Vectorized Backtest Engine', type: 'backend', status: 'online', x: cols.db, y: 250, details: { matrix: 'Numpy log-returns vectorizations', logic: 'Compare HMM regime strategies against buy-and-hold' } },
        { id: 'metrics', label: 'Regime Analytics Metrics', type: 'analytics', status: 'online', x: cols.external, y: 250, details: { output: 'Plotly drawdown area curves', variables: 'Sharpe ratio, max drawdown calculations' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Select regimes count' },
        { id: 'e2', source: 'ui', target: 'hmm', animated: true, flowSpeed: 'normal', label: 'Fit HMM parameters' },
        { id: 'e3', source: 'hmm', target: 'yfinance', animated: true, flowSpeed: 'normal', label: 'Fetch updates' },
        { id: 'e4', source: 'hmm', target: 'parquet', animated: false, label: 'Read archives' },
        { id: 'e5', source: 'hmm', target: 'backtester', animated: true, flowSpeed: 'fast', label: 'Feed regimes' },
        { id: 'e6', source: 'backtester', target: 'metrics', animated: true, flowSpeed: 'normal', label: 'Plot results' }
      ];
    } else if (slug === 'btc-algo-trading') {
      nodes = [
        { id: 'user', label: 'Crypto Investor', type: 'user', status: 'online', x: cols.user, y: 250, details: { view: 'Monitor live algorithmic indicator crossovers signals' } },
        { id: 'ui', label: 'Streamlit Desk Panel', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { framework: 'Python Streamlit frontend templates layout', refresh: 'Autorefresh data poll loops' } },
        { id: 'daemon', label: 'Async Signals Daemon', type: 'backend', status: 'online', x: cols.api, y: 250, details: { process: 'Continuous Python background worker processes', thread: 'Multi-threaded indicator solver' } },
        { id: 'exchange', label: 'Binance Tick API', type: 'external', status: 'online', x: cols.api, y: 130, details: { endpoint: 'Binance public REST API ticker queries', timeout: 'Auto-retry connections handler' } },
        { id: 'indicators', label: 'Indicators Engine', type: 'ai', status: 'online', x: cols.db, y: 250, details: { analysis: 'Moving Average crossover trend algorithms', compute: 'Vectorized Pandas technical matrix' } },
        { id: 'cache', label: 'Flat CSV Signals Cache', type: 'database', status: 'online', x: cols.db, y: 370, details: { type: 'Local structured CSV logs sheet', buffers: 'Price candlestick histories' } },
        { id: 'alerts', label: 'Telegram Webhook Pusher', type: 'external', status: 'online', x: cols.external, y: 250, details: { target: 'Push signal switches warnings to chats', api: 'Telegram Bot API webhook requests' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Monitor indicators' },
        { id: 'e2', source: 'ui', target: 'cache', animated: false, label: 'Poll signal logs' },
        { id: 'e3', source: 'daemon', target: 'exchange', animated: true, flowSpeed: 'normal', label: 'Fetch klines' },
        { id: 'e4', source: 'daemon', target: 'indicators', animated: true, flowSpeed: 'fast', label: 'Solve crossovers' },
        { id: 'e5', source: 'daemon', target: 'cache', animated: false, label: 'Write csv' },
        { id: 'e6', source: 'daemon', target: 'alerts', animated: true, flowSpeed: 'normal', label: 'Telegram alerts' }
      ];
    } else if (slug === 'ask-vraj') {
      nodes = [
        { id: 'user', label: 'Recruiter / Visitor', type: 'user', status: 'online', x: cols.user, y: 250, details: { location: 'Global visitor terminal', action: 'Inquire Vraj qualifications' } },
        { id: 'ui', label: 'Interactive Chat UI', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { widget: 'Fixed corner bubble + full ask-vraj page view', animations: 'Framer Motion reveal lists' } },
        { id: 'history', label: 'Sessions Memory', type: 'database', status: 'online', x: cols.frontend, y: 130, details: { store: 'Conversation history JSON objects list', type: 'LocalStorage cache' } },
        { id: 'api', label: 'Server API (/api/ask)', type: 'api', status: 'online', x: cols.api, y: 250, details: { router: 'Next.js Edge Runtime POST API Handler', connection: 'Simple cookie-less database client pool' } },
        { id: 'validation', label: 'Prompt Zod Gate', type: 'validation', status: 'online', x: cols.api, y: 130, details: { checks: 'Maximum inputs length constraints', filters: 'Zod parse results' } },
        { id: 'ai', label: 'Gemini API Engine', type: 'ai', status: 'online', x: cols.db, y: 250, details: { sdk: '@google/genai library client', model: 'gemini-3.1-flash-lite text generation pipelines' } },
        { id: 'analytics', label: 'Telemetry Tracker', type: 'analytics', status: 'online', x: cols.external, y: 250, details: { trace: 'Tracks API request traces lifecycle', save: 'Write asynchronous logs to Supabase' } },
        { id: 'rls', label: 'Supabase RLS Policies', type: 'auth', status: 'online', x: cols.db, y: 370, details: { gate: 'Row Level Security policy checks', policy: 'Anonymous insert only, admin read' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal', label: 'Submit query' },
        { id: 'e2', source: 'ui', target: 'api', animated: true, flowSpeed: 'fast', label: 'Post prompts' },
        { id: 'e3', source: 'ui', target: 'history', animated: false },
        { id: 'e4', source: 'api', target: 'validation', animated: true },
        { id: 'e5', source: 'validation', target: 'ai', animated: true, flowSpeed: 'fast', label: 'Invoke LLM' },
        { id: 'e6', source: 'ai', target: 'analytics', animated: true, flowSpeed: 'normal', label: 'Record metrics' },
        { id: 'e7', source: 'api', target: 'rls', animated: false }
      ];
    } else {
      // General portfolio boilerplate fallback
      nodes = [
        { id: 'user', label: 'Visitor Portfolio', type: 'user', status: 'online', x: cols.user, y: 250, details: { browser: 'Standard desktop user viewport browser' } },
        { id: 'ui', label: 'Next.js App Server', type: 'frontend', status: 'online', x: cols.frontend, y: 250, details: { architecture: 'Server Components layout + Client UI routes' } },
        { id: 'db', label: 'PostgreSQL Database', type: 'database', status: 'online', x: cols.db, y: 250, details: { client: 'Supabase PostgreSQL cloud databases transaction' } }
      ];

      edges = [
        { id: 'e1', source: 'user', target: 'ui', animated: true, flowSpeed: 'normal' },
        { id: 'e2', source: 'ui', target: 'db', animated: false }
      ];
    }

    return { nodes, edges };
  }
}
