import { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'enermass-solar-calculator',
    title: 'Enermass Solar Calculator & ERP',
    category: 'ERP Systems',
    shortDescription: 'Enterprise solar modeling engine and resource planning ERP that generates precise solar quotes and optimizes project materials.',
    description: 'An enterprise-grade SaaS platform built for solar installers and engineers. It includes a custom geospatial layout model to compute solar irradiance, shading factors, and optimal panel tilt. The backend functions as an ERP, managing inventory procurement, material tracking, and client invoicing in real-time.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Python', 'FastAPI', 'Framer Motion'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/enermass.webp',
    role: 'Lead Full-Stack Architect',
    period: 'Nov 2025 - Mar 2026',
    client: 'Enermass Energies Pvt. Ltd.',
    metrics: [
      { label: 'Forecast Accuracy', value: '99.4%' },
      { label: 'Quotes Generated', value: '20,000+' },
      { label: 'Design Time Saved', value: '65%' }
    ],
    problem: 'Surveyors manually computed roof tilts and estimated shade loss with calculators on-site, which led to incorrect pricing proposals and margin leakage.',
    whyBuilt: 'The project was built to standardize on-site measurements, accelerate quote-to-contract durations from days to minutes, and protect installer profit margins.',
    solution: 'Implemented browser-compiled coordinate trigonometry shaders to automate tilt and shade loss estimation, feeding into an automated dynamic billing proposal dispatching system.',
    features: [
      'Interactive 3D roof mapping and shading loss simulation.',
      'Auto-generation of Bill of Materials (BOM) linked directly with regional suppliers.',
      'Proprietary net-metering computation supporting complex utility tariffs.',
      'Dynamic workflow dispatching for on-site solar surveyors and installers.'
    ],
    architecture: 'Next.js App Router serves as the core dashboard. Fast mathematical operations are written as modular Python sub-services (using FastAPI), while PostgreSQL manages relational database schemas for client leads, solar calculations, and invoice models.',
    dbBackendLogic: 'The PostgreSQL database holds structured tables for client leads, materials inventory, and regional solar coefficients. Calculations query geographic coordinates to fetch regional solar values, dynamically pricing invoices using real-time supplier scrapers.',
    uiScreens: [
      { title: 'Telemetry Board', description: 'Centralized admin feed tracking surveyor leads, active installs, and project margins.' },
      { title: 'Interactive Layout Designer', description: 'Canvas UI letting engineers place virtual solar panels on roof profiles to calculate shading.' },
      { title: 'Billing Center', description: 'Interactive ledger calculating BOM margins, government subsidies, and exporting PDF quotes.' }
    ],
    challenges: [
      {
        problem: 'Calculating roof shading losses and panel orientation physics in-browser in real time was slow and crashed standard web workers.',
        solution: 'Offloaded trigonometry calculations to GPU-accelerated client WebGL shaders, reducing calculation time from 4.8 seconds to under 80 milliseconds.'
      },
      {
        problem: 'Frequent price fluctuations of solar materials led to inaccurate quotes.',
        solution: 'Implemented real-time supplier inventory API webhooks and automated daily pricing scrapers, feeding an incremental inventory model.'
      }
    ],
    whatILearned: 'Acquired in-depth knowledge of geospatial coordinate systems, client-side resource scheduling, WebGL performance constraints, and enterprise invoice compliance.',
    futureImprovements: [
      'Integrate satellite imagery APIs to pre-fill layout plans before on-site surveyor visits.',
      'Configure auto-routing surveyor dispatcher schedules using route planning algorithms.'
    ],
    featured: true
  },
  {
    slug: 'bhagwati-interior-erp',
    title: 'Bhagwati Interior ERP',
    category: 'Client Software',
    shortDescription: 'Custom client and project management software for interior architecture studios, tracking budgets, materials, and invoicing.',
    description: 'A dedicated internal enterprise planning software developed for Bhagwati Interior. This ERP tracks material sourcing, designer tasks, customer specifications, dynamic budgets, and generates high-fidelity PDFs for quotations and invoices.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Redux Toolkit', 'AWS S3'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/bhagwati.webp',
    role: 'Solo Full-Stack Developer',
    period: 'Jul 2025 - Oct 2025',
    client: 'Bhagwati Interior',
    metrics: [
      { label: 'Designer Productivity', value: '3x Speedup' },
      { label: 'Budget Discrepancies', value: '< 2%' },
      { label: 'Active Projects', value: '150+' }
    ],
    problem: 'Designers frequently changed furniture material selections and wood grades without logging costs, creating significant budget overruns and invoicing delays.',
    whyBuilt: 'This system was commissioned to reconcile design choices with billing ledgers instantly, ensuring studio margin safety and professional customer invoices.',
    solution: 'Created a centralized material specifications registry with write-locking, binding dynamic specification modifications directly to contract proposals.',
    features: [
      'Interior material specifications ledger tracking wood, metals, and fabrics.',
      'Client portal showcasing real-time visual progress updates and stage approvals.',
      'Custom invoice PDF engine rendering custom designs instantly.',
      'Project management board with role-based task delegation.'
    ],
    architecture: 'Client runs a clean SPA dashboard built with React. Server uses Node.js and Express deployed on AWS App Runner, communicating with MongoDB Atlas. File storage leverages secure pre-signed AWS S3 URLs.',
    dbBackendLogic: 'Uses MongoDB collections to hold client files, project nodes, and dynamic catalog lists. The flexible schemas allow designers to append unstructured design notes while preserving pricing constraints.',
    uiScreens: [
      { title: 'Material Registry Console', description: 'Lists active material codes, wood grades, and wholesale pricing parameters.' },
      { title: 'Designer Task Board', description: 'A Kanban dashboard delegating site layout reviews and client material approvals.' },
      { title: 'Client Portal View', description: 'A secure, responsive page letting clients inspect visual stage updates and click approvals.' }
    ],
    challenges: [
      {
        problem: 'Generating complex, layout-perfect PDF quotations with high-res interior photos was consuming excessive server memory.',
        solution: 'Moved PDF compilation to a serverless lambda architecture, utilizing headless Chromium to render the template and write directly to AWS S3.'
      },
      {
        problem: 'Designers struggled to calculate custom modular kitchen layouts.',
        solution: 'Created an interactive kitchen builder module that automatically translates layout shapes (L-shape, U-shape) into material cost estimation sheets.'
      }
    ],
    whatILearned: 'Mastered serverless compilation loops, flexible document database modeling, and managing file storage keys safely.',
    futureImprovements: [
      'Build a custom WebGL 3D floor plan layout compiler matching items to live inventory catalogs.',
      'Integrate automatic SMS reminder notifications for customer approval confirmations.'
    ],
    featured: true
  },
  {
    slug: 'constructionos-erp',
    title: 'ConstructionOS / Construction ERP',
    category: 'ERP Systems',
    shortDescription: 'Multi-tenant cloud ERP for site construction scheduling, labor tracking, compliance alerts, and audit trails.',
    description: 'A robust construction management software designed to bridge the gap between back-office accounting and on-site field engineers. ConstructionOS enables project managers to track concrete pours, equipment leases, raw inventory logs, and subcontractor working hours.',
    technologies: ['Next.js', 'Go (Golang)', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'gRPC'],
    status: 'In Development',
    year: '2026',
    image: '/images/projects/constructionos.webp',
    role: 'Backend & System Architect',
    period: 'Dec 2025 - Feb 2026',
    metrics: [
      { label: 'Inventory Sync', value: '99.9%' },
      { label: 'Cost Savings', value: '15%' },
      { label: 'Daily Field Logs', value: '450+' }
    ],
    problem: 'On-site construction managers suffered from frequent sync conflicts, missing safety compliance logs, and slow inventory ledger computations across multiple remote sites.',
    whyBuilt: 'This system was built to provide a secure multi-tenant scheduling node that streamlines Indian construction logistics, labor laws audit trails, and inventory compliance.',
    solution: 'Designed high-concurrency Go microservices, an offline-first indexedDB storage interface with CRDT synchronization, and a Redis WAL synchronization layer.',
    features: [
      'Multi-tenant project control panel with secure role-based workflows.',
      'Offline-first labor attendance registry with digital signature support.',
      'Real-time inventory ledger tracking steel, cement, and aggregates.',
      'Compliance alerts and immutable audit logs checking local labor laws.'
    ],
    architecture: 'Backend utilizes high-performance Go microservices communicating via gRPC. Frontend is standard Next.js utilizing static layouts, connecting via WebSockets for real-time status boards.',
    dbBackendLogic: 'PostgreSQL holds normalized tables for tenants, inventory logs, and compliance audits. Writes feed into Redis logs for real-time stats updates, and sync triggers run checks against CRDT formats.',
    uiScreens: [
      { title: 'Tenant Control Room', description: 'Lists multi-site project summaries, active concrete volumes, and compliance tickers.' },
      { title: 'Labor Attendance Tracker', description: 'Tablet-friendly page with offline synchronization for worker logs.' },
      { title: 'Audit Logs Feed', description: 'An unalterable log monitoring safety reports and material transfers.' }
    ],
    challenges: [
      {
        problem: 'On-site connectivity was spotty, resulting in lost daily logs and sync conflicts.',
        solution: 'Developed an offline-first indexedDB storage layer using CRDTs (Conflict-free Replicated Data Types) to merge conflicting offline inputs seamlessly.'
      },
      {
        problem: 'PostgreSQL database query response degraded when calculating real-time inventory values across 80 sites.',
        solution: 'Created material aggregates inside Redis caching layers, updating asynchronously via PostgreSQL write-ahead logs (WAL) through Debezium.'
      }
    ],
    whatILearned: 'Acquired advanced expertise in writing fast Go microservices, multi-tenant database partitioning, and sync conflict resolution algorithms.',
    futureImprovements: [
      'Develop automatic image parsing to count steel bars using computer vision models.',
      'Add geofencing alerts to prevent worker check-ins outside site coordinate radiuses.'
    ],
    featured: true
  },
  {
    slug: 'surendra-bus-body',
    title: 'Surendra & Co. Website',
    category: 'Websites',
    shortDescription: 'Premium business website for a bus body builder and coach manufacturer, featuring an interactive configuration board.',
    description: 'A customer-facing presentation and business portal built for Surendra & Co. Bus Body Builders. The application allows fleet operators to configure custom bus chassis options, seating layout styles, and request customized manufacturing estimates.',
    technologies: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS', 'Zod'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/surendra.webp',
    role: 'Lead Developer',
    period: 'Aug 2025 - Sep 2025',
    client: 'Surendra & Co.',
    metrics: [
      { label: 'Unique Visitors', value: '150,000+' },
      { label: 'Lead Conversion', value: '4.2x' },
      { label: 'LCP Load Time', value: '< 1.2s' }
    ],
    problem: 'Surendra & Co. lacked a modern web presence and had to manually explain coach configurations to B2B fleet clients over phone calls.',
    whyBuilt: 'This portal was built to establish a cinematic digital brand identity and allow clients to submit structured chassis configuration parameters.',
    solution: 'Designed a Next.js landing page with high-performance 3D seat layout configurations, smooth scroll effects, and Zod-validated input pipelines.',
    features: [
      'Premium business landing page with cinematic parallax scrolling.',
      'B2B estimation request router checking dynamic seat counts.',
      'Draco-compressed 3D bus interior viewer powered by Three.js.',
      'Manufacturing capabilities layout showing production lines.'
    ],
    architecture: 'Static Next.js pages optimized for maximal speed. Interactive elements load dynamically in the browser, communicating with a lightweight Serverless Contact API routing leads to an internal CRM.',
    dbBackendLogic: 'Serverless API route parses specifications, maps parameters to predefined configuration templates, validates models using Zod, and routes files to email handlers.',
    uiScreens: [
      { title: 'Cinematic Landing Page', description: 'Features smooth scrolling and interactive grids of manufactured buses.' },
      { title: 'Interior Configurator Console', description: 'A slider interface letting buyers choose seat patterns and chassis dimensions in 3D.' },
      { title: 'Technical Capability Hub', description: 'Highlights sheet metal bending, paint shops, and assembly lines.' }
    ],
    challenges: [
      {
        problem: 'Initial loading of 3D models took 15+ seconds, leading to a high user bounce rate.',
        solution: 'Optimized the 3D assets pipeline by implementing Draco compression and lazy-loading models based on viewport intersections.'
      }
    ],
    whatILearned: 'Gained expertise in rendering Three.js geometries efficiently, loading Draco buffers, and writing responsive fluid CSS layouts.',
    futureImprovements: [
      'Add real-time pricing indicators that adjust as buyers toggle luxury seat materials.',
      'Support full exterior bus painting customization preview options.'
    ],
    featured: false
  },
  {
    slug: 'ecommerce-brand-websites',
    title: 'E-commerce Brand Websites',
    category: 'E-commerce',
    shortDescription: 'High-speed headless e-commerce architectures designed to scale conversion rates and maximize performance.',
    description: 'A collection of bespoke headless e-commerce sites developed for high-end local DTC brands. Engineered for sub-second page loads, custom cart logic, and high conversion checkouts integrated with local payment Gateways.',
    technologies: ['Next.js', 'GraphQL', 'Shopify Storefront API', 'Tailwind CSS', 'Radix UI', 'Stripe'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/ecommerce-brand.webp',
    role: 'Full-Stack Developer',
    period: 'Ongoing',
    metrics: [
      { label: 'Conversion Lift', value: '28%' },
      { label: 'LCP Load Time', value: '< 1.1s' },
      { label: 'Orders Processed', value: '50,000+' }
    ],
    problem: 'Clients using standard templates suffered from slow loading speeds, high cart drop-off rates, and rigid custom checkout constraints.',
    whyBuilt: 'These headless platforms were designed to optimize Core Web Vitals, maximize mobile conversion rates, and allow unique customized checkout paths.',
    solution: 'Replaced standard shop platforms with a fast React/Next.js frontend that fetches product details dynamically via GraphQL, caching static catalog indices.',
    features: [
      'Incremental Static Regeneration (ISR) ensuring instantly cached product pages.',
      'Optimized checkout flow with local payment gateways (Razorpay/Stripe).',
      'Unified search engine utilizing Algolia for instant typo-tolerant results.',
      'Highly custom promotion and discount logic computed client-side and verified server-side.'
    ],
    architecture: 'Headless Next.js storefront querying Shopify APIs using GraphQL. Real-time updates utilize Serverless Next.js edge functions. Analytics are tracked securely on Vercel Edge.',
    dbBackendLogic: 'Bypasses standard database lookup limits by querying cached Shopify products tables. Local API routines handle cart sessions using secure serverless cookies.',
    uiScreens: [
      { title: 'Interactive Product Catalog', description: 'A fast filtering page that updates catalogs instantly on key press.' },
      { title: 'Bespoke Cart Console', description: 'Slide-out cart showing dynamic discount updates and shipping targets.' },
      { title: 'Headless Checkout Page', description: 'A single-step form checking user coordinates and routing checkouts.' }
    ],
    challenges: [
      {
        problem: 'DTC client had 10,000+ variants resulting in Next.js build timeouts during static generation.',
        solution: 'Implemented hybrid rendering, statically pre-rendering top 10% selling items and lazy-generating the remaining products upon request.'
      }
    ],
    whatILearned: 'Mastered headless commerce API integrations, writing clean GraphQL schemas, and writing sub-second checkouts.',
    futureImprovements: [
      'Integrate AI-driven product cross-selling modules inside the slide-out cart.',
      'Add support for multi-currency pricing tables matching local buyer geo-locations.'
    ],
    featured: true
  },
  {
    slug: 'ecommerce-business-dashboards',
    title: 'E-commerce Business Dashboards',
    category: 'Dashboards',
    shortDescription: 'Internal dashboards for e-commerce businesses to manage products, orders, customers, inventory, and business performance.',
    description: 'A premium SaaS analytics dashboard that aggregates orders, shipping data, ad accounts (Facebook, Google), and computes true profitability in real-time. Designed as a unified control center for e-commerce operators.',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Recharts', 'Tailwind CSS', 'OAuth 2.0'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/ecommerce-dash.webp',
    role: 'Creator & Lead Developer',
    period: 'Jan 2026 - Present',
    metrics: [
      { label: 'Query Latency', value: '< 180ms' },
      { label: 'Sync Delay', value: '< 30s' },
      { label: 'API Integrations', value: '5 APIs' }
    ],
    problem: 'E-commerce operators had to manually compile spreadsheets from Shopify, Stripe, and ad accounts to compute true net profits, losing critical hours every week.',
    whyBuilt: 'This panel was designed to automate profit calculations, monitor real-time fulfillment logs, and alert operators about running low on inventory.',
    solution: 'Built an aggregation engine querying ad platform metrics and order data, calculating ad spend efficiency, margins, and customer lifetime value cohorts.',
    features: [
      'Interactive cohort analysis charts tracking Customer Lifetime Value (LTV).',
      'Real-time webhook ingestion engine from multiple shop providers.',
      'Ad Spend ROI tracking directly overlaid with sales chart grids.',
      'Inventory depletion warnings driven by basic forecasting algorithms.'
    ],
    architecture: 'Next.js App Router for frontend layouts. Supabase PostgreSQL serves as the primary data store with schema level row-security. Chart components are built with Recharts, optimized for responsive screens.',
    dbBackendLogic: 'Calculates data aggregates inside Supabase SQL views, indexing order timestamps, payment payouts, and marketing costs to compute true metrics instantly.',
    uiScreens: [
      { title: 'Profit Control Board', description: 'Displays live net sales, ad spends, blends ROAS, and inventory health rates.' },
      { title: 'Cohort Analytics Engine', description: 'Recharts line charts showing customer retention profiles.' },
      { title: 'Fulfillment Control Desk', description: 'Monitor incoming orders, shipping categories, and package tracking logs.' }
    ],
    challenges: [
      {
        problem: 'Combining high-volume API requests from Facebook Ads, Google Ads, and Shopify caused extreme API rate-limiting issues.',
        solution: 'Built an asynchronous queue system using BullMQ and Redis, fetching data in batches using randomized jitter offsets.'
      }
    ],
    whatILearned: 'Gained advanced knowledge of writing PostgreSQL aggregation queries, optimizing SVG chart rendering, and handling OAuth 2.0 token refreshes.',
    futureImprovements: [
      'Incorporate machine learning forecasting models to predict inventory depletion dates.',
      'Add automated Slack notifications warning managers about ROI drops.'
    ],
    featured: false
  },
  {
    slug: 'nf-lrd-regime-discovery',
    title: 'NF-LRD',
    category: 'Quant Research',
    shortDescription: 'NIFTY 50 Latent Market Regime Discovery and Risk Intelligence Platform using machine learning models to detect structural market regimes.',
    description: 'A proprietary quantitative analysis dashboard built to classify NIFTY 50 price movements into structural regimes (bullish, bearish, high-volatility, low-volatility) using statistical models, allowing for adaptive algorithm allocation.',
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Next.js', 'TypeScript', 'FastAPI', 'Plotly'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/nflrd.webp',
    role: 'Quant Developer / Researcher',
    period: 'Sep 2025 - Nov 2025',
    metrics: [
      { label: 'Information Ratio Lift', value: '+0.68' },
      { label: 'Regime Classifications', value: '12 Classes' },
      { label: 'Backtest Validity', value: '99.9%' }
    ],
    problem: 'Trading algorithms optimized for calm markets lose significant capital during high-volatility regime shifts, requiring automatic model reallocation.',
    whyBuilt: 'This platform was designed to dynamically segment historical market regimes using Hidden Markov Models (HMM), allowing for automated portfolio risk profiling.',
    solution: 'Built a modular Python service running Pandas feature engineering pipelines, predicting regime transitions, and displaying simulations on a React frontend.',
    features: [
      'Hidden Markov Models (HMM) running on historic NIFTY 50 daily returns data.',
      'Dynamic trading rule allocations based on predicted regime transitions.',
      'Interactive backtesting suite with slippage and transaction cost calculators.',
      'Volatility clustering analysis using GARCH models.'
    ],
    architecture: 'Python-based compute layer exposed through FastAPI endpoints. The Next.js dashboard visualizes the probability density curves and historical regime charts using custom interactive plotting.',
    dbBackendLogic: 'Uses lightweight database stores to save historical close metrics. Compute pipelines run directly in-memory using numpy array vectors for performance.',
    uiScreens: [
      { title: 'Regime Probability Plot', description: 'Line charts mapping structural market regime probabilities over time.' },
      { title: 'Backtester Suite Panel', description: 'Run simulations checking returns curves vs buy-and-hold benchmarks.' },
      { title: 'Risk Indicators Console', description: 'Displays volatility, correlations matrix, and GARCH forecast values.' }
    ],
    challenges: [
      {
        problem: 'Standard Python statistical libraries were slow when running multi-decade walk-forward optimization runs.',
        solution: 'Vectorized historical calculations using NumPy and leveraged Numba to compile hot loops into machine code, resulting in a 25x speedup.'
      }
    ],
    whatILearned: 'Developed a deep understanding of Hidden Markov Models, mathematical matrix vectorizations, and options Greeks pricing metrics.',
    futureImprovements: [
      'Extend models to classify international indices (like SPY or QQQ) in real-time.',
      'Implement deep learning LSTM models to cross-reference regime classifications.'
    ],
    featured: true
  },
  {
    slug: 'mspe-volatility-engine',
    title: 'MSPE',
    category: 'Quant Research',
    shortDescription: 'Real-time option implied volatility surface visualizer, portfolio risk modeler, and probability-based projection engine.',
    description: 'An option pricing and volatility surface modeling tool. It computes real-time Black-Scholes implied volatilities, interpolates missing option chain data using cubic splines, and visualizes the volatility skew and smile in 3D.',
    technologies: ['React', 'TypeScript', 'Three.js', 'WebAssembly (C++)', 'Tailwind CSS', 'Recharts'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/mspe.webp',
    role: 'Solo Developer',
    period: 'Oct 2025 - Dec 2025',
    metrics: [
      { label: 'Greeks Calculated', value: '5000+ /sec' },
      { label: 'Surface Render Delay', value: '< 45ms' },
      { label: 'Accuracy vs. Market', value: '99.98%' }
    ],
    problem: 'Computing options implied volatility skew surfaces is mathematically expensive, causing browser interfaces to lag during high-frequency data streams.',
    whyBuilt: 'Vraj built MSPE to visualize options implied volatility smile surfaces in 3D, calculate options Greeks instantly, and run portfolio risk projection matrices.',
    solution: 'Designed a high-speed C++ engine compiled to WebAssembly, running calculations in background web workers, rendered using Three.js.',
    features: [
      'High-performance WebAssembly engine calculating options Greeks (Delta, Gamma, Vega, Theta).',
      'Real-time 3D implied volatility surface plotting using Three.js.',
      'Cubic spline interpolation to fill gaps in options lists.',
      'Volatility smile tracking against strike prices and expirations.'
    ],
    architecture: 'Next.js rendering with specialized canvas contexts. The core mathematical solver is compiled from C++ to a WASM binary, loaded dynamically at runtime. Rendering leverages Three.js libraries.',
    dbBackendLogic: 'Retrieves stock price indexes via WebSockets, streaming calculations directly to client-side memory structures, bypassing standard database layers to keep latency sub-millisecond.',
    uiScreens: [
      { title: '3D Volatility Surface Map', description: 'An interactive 3D mesh rendering the implied volatility surface across strikes and expiries.' },
      { title: 'Volatility Smile Chart', description: 'A Recharts line plot illustrating the classic options implied volatility smile.' },
      { title: 'Option Greeks Chain', description: 'Lists real-time bids, asks, delta, gamma, vega, and computed volatilities.' }
    ],
    challenges: [
      {
        problem: 'Numerical root-finding algorithms (Newton-Raphson) for implied volatility were lagging when processing raw option chains in pure JS.',
        solution: 'Wrote option chain calculations in C++ and compiled them to WebAssembly, running calculations in parallel using Web Workers.'
      }
    ],
    whatILearned: 'Gained expertise in linking C++ modules to React WebAssembly interfaces, utilizing Web Workers, and rendering custom 3D web surfaces.',
    futureImprovements: [
      'Incorporate Sabr Volatility modeling to match market skews during extreme stress events.',
      'Add historical volatility comparison curves overlays.'
    ],
    featured: true
  },
  {
    slug: 'btc-algo-trading',
    title: 'BTC-ALGO',
    category: 'Quant Research',
    shortDescription: 'Bitcoin algorithmic trading dashboard displaying live signal generation, backtesting metrics, and risk monitoring.',
    description: 'An execution dashboard displaying real-time cryptocurrency signals generated by a custom momentum-trend algorithmic model. Tracks trade entries, exits, win-rate, drawdown metrics, and live portfolio distribution.',
    technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets', 'Binance API', 'Tailwind CSS'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/btcalgo.webp',
    role: 'Quant Developer',
    period: 'Nov 2025 - Jan 2026',
    metrics: [
      { label: 'Alpha vs. BTC HODL', value: '+24.8%' },
      { label: 'Signal Latency', value: '< 100ms' },
      { label: 'Winning Trades', value: '62.4%' }
    ],
    problem: 'Retail crypto traders lack clean tools to inspect algorithmic signals, backtest strategies with transaction slippage, and track risk metrics in real-time.',
    whyBuilt: 'BTC-ALGO was built to visualize a custom Bitcoin momentum strategy, backtest options, and stream live signals directly from exchanges.',
    solution: 'Designed a Node.js daemon tracking live prices via Binance WebSockets, running statistical signals calculations, and streaming values to a Next.js board.',
    features: [
      'Live trading signal dispatching with Telegram integration.',
      'WebSocket connection to Binance and Bybit feeds for microsecond charts.',
      'Automated risk management checking maximum drawdown and position sizes.',
      'Historical performance breakdown with detailed Sharpe and Sortino ratios.'
    ],
    architecture: 'Signals are calculated by a background worker service in Node.js connected to a PostgreSQL database. The Next.js frontend connects via secure WebSockets to display live telemetry and positions.',
    dbBackendLogic: 'PostgreSQL stores historical signal records, trade entries, and drawdowns. Relational indexes enable fast aggregations to compute Sharpe ratios on-the-fly.',
    uiScreens: [
      { title: 'Live Signals Board', description: 'Shows BTC/USDT price feeds overlaid with dynamic buy, sell, or hold labels.' },
      { title: 'Strategy Backtester Desk', description: 'Inputs to adjust strategy parameters (moving averages, thresholds) and plot curves.' },
      { title: 'Risk & Allocation Dashboard', description: 'Aggregates open positions sizes, risk limits, and historical drawdowns.' }
    ],
    challenges: [
      {
        problem: 'Signal execution was delayed due to latency spikes in webhook delivery during volatile market events.',
        solution: 'Migrated the signal dispatcher to AWS API Gateway with edge routes, setting up WebSocket listeners in Next.js to push live updates directly.'
      }
    ],
    whatILearned: 'Learned about WebSockets scalability constraints, Binance API rate limits, and risk metrics math calculations.',
    futureImprovements: [
      'Add support for multi-asset strategy models (including ETH, SOL) on the same platform.',
      'Integrate direct trading execution via exchange API credentials.'
    ],
    featured: false
  },
  {
    slug: 'ai-cold-email-automation',
    title: 'AI Cold Email Automation',
    category: 'AI Automation',
    shortDescription: 'Autonomous outbound campaign engine leveraging LLMs to scrape leads, personalize copy, and schedule outreach.',
    description: 'An AI-powered B2B automation platform that automates lead nurturing. It reads candidate LinkedIn/Company pages, synthesizes custom emails matching their specific challenges, runs smart warmups, and dispatches email sequences.',
    technologies: ['Next.js', 'TypeScript', 'Gemini API', 'LangChain', 'Supabase', 'Cron Jobs', 'Zod'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/coldemail.webp',
    role: 'Solo Creator',
    period: 'Feb 2026 - Apr 2026',
    metrics: [
      { label: 'Email Open Rate', value: '68%' },
      { label: 'Outbox Scale', value: '15,000+' },
      { label: 'Leads to Demos', value: '22%' }
    ],
    problem: 'Generic B2B cold outreach campaigns suffer from low open rates because emails lack real personalization and trigger spam filters.',
    whyBuilt: 'Built to automate personalized outreach by scraping target websites, identifying technical bugs, and generating tailored copy using LLMs.',
    solution: 'Designed a Next.js/LangChain worker script that crawls target sites, parses pages using Gemini, checks validations using Zod, and schedules Gmail dispatches.',
    features: [
      'Multi-model LLM routing to optimize token costs (Gemini Flash vs. Pro).',
      'Dynamic email personalization engine using company-specific context.',
      'Deliverability scanner checking SPF, DKIM, and IP blacklist status.',
      'Automated calendar booking integration.'
    ],
    architecture: 'Next.js API routes trigger LangChain pipelines. Supabase manages lead tables, email sequences, and outreach logs. Recurring cron jobs trigger email dispatches asynchronously.',
    dbBackendLogic: 'Supabase PostgreSQL holds tables tracking campaign structures, leads lists, email logs, and queue dispatching times. Triggers handle rate limits checks.',
    uiScreens: [
      { title: 'Outbound Dashboard', description: 'Monitor sent counts, open rates, click ratios, and positive responses.' },
      { title: 'Prompt Workspace', description: 'Configure system templates, Gemini temperature params, and check variables mappings.' },
      { title: 'Leads Directory', description: 'Lists target contacts, linked company URLs, and generated email drafts.' }
    ],
    challenges: [
      {
        problem: 'LLMs occasionally generated email copy with format inconsistencies, which ruined the personalization look.',
        solution: 'Utilized Zod schemas with Gemini Structured Output mode, forcing the model to return exactly parsed JSON payloads.'
      },
      {
        problem: 'Spam filters flagged bulk outbound campaigns.',
        solution: 'Implemented a dynamic throttle scheduler with random delay offsets and integrated mailbox warm-up routines.'
      }
    ],
    whatILearned: 'Gained hands-on experience in writing LLM chain prompts, structural JSON validations using Zod, and configuring cron job pipelines.',
    futureImprovements: [
      'Incorporate multi-channel sequencing integrating automatic LinkedIn connection notes.',
      'Add semantic leads scoring using vector embeddings to prioritize prospects.'
    ],
    featured: true
  }
];

export const categories = [
  'All',
  'Client Software',
  'ERP Systems',
  'E-commerce',
  'AI Automation',
  'Quant Research',
  'Websites',
  'Dashboards'
] as const;
