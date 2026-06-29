import { Project } from '@/types';

export const projects: Project[] = [
  {
    slug: 'solar-sizing-calculator',
    title: 'Solar Sizing Calculator & ERP',
    category: 'erp_system',
    shortDescription: 'Client-side solar modeling engine and resource planning ERP that generates precise solar quotes and optimizes project materials.',
    description: 'An enterprise-grade pricing and materials catalog application built for solar installers. It includes a custom Indian state coefficient matrix to determine solar irradiance parameters and state-specific subsidy rules, generating print-optimized PDF brochures.',
    technologies: ['Next.js', 'React', 'Zustand', 'Tailwind CSS', 'TypeScript', 'Drizzle ORM', 'Upstash Redis', 'PostgreSQL'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/solar-sizing.webp',
    liveUrl: 'https://solar-sizing-calculator.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'May 2026 - Jun 2026',
    client: 'Solar Installation Company (Contract)',
    metrics: [
      { label: 'Core State Store', value: 'Zustand Store' },
      { label: 'Templates Base', value: '25+ Solar Kits' },
      { label: 'BOM Calculations', value: 'GST + Margin' }
    ],
    problem: 'Sales representatives and surveyors manually estimated rooftop solar equipment counts, tax rates, and government subsidies on paper, leading to slow sales cycles and proposal errors.',
    whyBuilt: 'Built to provide a fast, client-side, offline-capable solar design and financial estimation platform that generates clean, print-optimized PDF brochures instantly.',
    solution: 'Developed a client-side pricing calculator utilizing Zustand store state and a rule-based state coefficient matrix to instantly compute panel capacity sizing, Indian state subsidies, and complete BOM pricing.',
    features: [
      'Selection of 25+ preconfigured solar system templates across multiple categories.',
      'Equipment customization tab allowing dynamic panel mixes, inverters, and battery storage config.',
      'Interactive Bill of Materials (BOM) table supporting inline double-click quantity, rate, and tax overrides.',
      'Automatic central government subsidy lookup matching PM Surya Ghar brackets.',
      'Lead and quote pipeline CRM tracking status history and WhatsApp/email sharing.',
      'Print-optimized CSS templates rendering client proposals cleanly to A4 PDF brochures.'
    ],
    architecture: 'Built on Next.js App Router for frontend dashboards. State variables are maintained inside a hydration-configured Zustand store. The calculation engine processes values client-side to generate BOM rows and state subsidy logic.',
    dbBackendLogic: 'Relational data structures are managed client-side using Zustand stores. Active quotes, custom presets, and global rate master lists are synchronized and persisted locally within the browser’s LocalStorage.',
    uiScreens: [
      { title: 'Interactive Sizing Console', description: 'Central design dashboard for editing BOM items, capacities, and profit markups.' },
      { title: 'BOM Rate Master Sheets', description: 'Global administrative panel allowing operators to override specific materials base pricing.' },
      { title: 'CRM Quote Pipeline', description: 'Pipeline monitor tracking lead conversions from drafts to active won/lost statuses.' }
    ],
    challenges: [
      {
        problem: 'Indian states have varying central/state solar subsidies and labor multipliers, making centralized calculations inconsistent.',
        solution: 'Designed a static state-coefficient matrix mapping local sun hours, GST tax rates, and PM Surya Ghar subsidy brackets, running instant client-side ROI evaluations.'
      },
      {
        problem: 'Allowing sales agents to override individual BOM line rates/quantities led to schema sync and validation issues during quote saves.',
        solution: 'Built a Zustand-based override store with change indicators (warning badges), enabling agents to override pricing variables while retaining factory default rollback states.'
      }
    ],
    whatILearned: 'Learned about client-side state persistence with Zustand hydration, managing dynamic invoice tax calculations, and configuring print media styles for high-fidelity PDF exports.',
    futureImprovements: [
      'Add local CSV inventory import mapping directly to master rate sheets.',
      'Integrate Google Maps API to pre-measure roof areas on-screen.'
    ],
    featured: true
  },
  {
    slug: 'outreachops-ai',
    title: 'OutreachOps AI (AI Coldmail)',
    category: 'ai_automation',
    shortDescription: 'Autonomous outbound campaign engine leveraging LLMs to scrape leads, personalize copy, audit drafts, and schedule outreach.',
    description: 'OutreachOps AI is an automated outreach personalization and email marketing software. It crawls target company websites, parses page content using the Gemini API, generates personalized ERP sales pitches, and automates outbound drafts queue management.',
    technologies: ['Next.js', 'FastAPI', 'Google GenAI SDK', 'Google Sheets API', 'Gmail API', 'Supabase', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/coldemail.webp',
    liveUrl: 'https://outreachops-ai.vercel.app/',
    role: 'Solo Developer (100% Personal Project)',
    period: 'Feb 2026 - Apr 2026',
    client: 'Personal Project',
    metrics: [
      { label: 'AI API Layer', value: 'Google GenAI SDK' },
      { label: 'Outreach Pipeline', value: 'Gmail OAuth API' },
      { label: 'Leads Source', value: 'Google Sheets API' }
    ],
    problem: 'B2B cold outreach campaigns suffer from low response rates due to generic, non-personalized email copy and high spam delivery risks.',
    whyBuilt: 'Built to automate lead personalization by crawling target company websites, performing AI audits, and sequencing outbound emails dynamically.',
    solution: 'Designed an autonomous email campaign engine with a FastAPI backend that scrapes target sites and utilizes the Google GenAI SDK to compose tailored pitches.',
    features: [
      'FastAPI background worker pipeline running lead audits concurrently.',
      'Google Sheets integration using gspread to dynamically fetch active lead lists.',
      'Gmail OAuth 2.0 API connection to send authorized outbound email campaigns securely.',
      'Pydantic inputs validation and structural response schemas.'
    ],
    architecture: 'Next.js App Router powers the dashboard view. The Python FastAPI backend acts as the compute orchestrator, invoking Gemini models and linking directly to third-party Google services.',
    dbBackendLogic: 'Local tracking stores hold campaign details and email schedules. Outbound queue statuses and logs are managed dynamically to prevent rate limit overflows.',
    uiScreens: [
      { title: 'Campaign Dashboard', description: 'Tracks pending drafts, successfully sent emails, and queue logs.' },
      { title: 'Leads Sheets Tracker', description: 'Visual database listing active companies, site links, and personalization text.' },
      { title: 'OAuth Connections Node', description: 'Displays authorized Google accounts credentials details.' }
    ],
    challenges: [
      {
        problem: 'API limit constraints and concurrency restrictions of standard LLMs made bulk lead personalization slow and prone to timeout exceptions.',
        solution: 'Implemented async FastAPI handlers that batch-process lead lists and run concurrent scraper routines, validating inputs using Pydantic schemas.'
      },
      {
        problem: 'Linking outreach targets directly from spreadsheets manually created double-entry overhead for sales operations.',
        solution: 'Integrated the Google Sheets (gspread) API to dynamically import leads lists and sync generated email drafts in real-time.'
      }
    ],
    whatILearned: 'Mastered async Python programming, prompt engineering with structured GenAI outputs, Google OAuth credential management, and multi-model LLM task delegation.',
    futureImprovements: [
      'Add automatic semantic leads scoring using vector embeddings.',
      'Integrate email deliverability and warm-up monitoring logs.'
    ],
    featured: true
  },
  {
    slug: 'interior-design-erp',
    title: 'Interior Design ERP',
    category: 'erp_system',
    shortDescription: 'Custom client and project management software for interior architecture studios, tracking budgets, materials, and invoicing.',
    description: 'A custom enterprise planning system built for interior design operations. It manages material inventory databases, client layouts tracking pipelines, automated GST billing estimates, and designer task queues.',
    technologies: ['Next.js', 'Drizzle ORM', 'PostgreSQL', 'NextAuth.js', 'Google Gemini API', 'Upstash Redis', 'QStash Queue', 'Tailwind CSS', 'Nodemailer'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/interior-design.webp',
    liveUrl: 'https://erpbi.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'May 2026 - Jun 2026',
    client: 'Interior Design Studio (Contract)',
    metrics: [
      { label: 'Database Access', value: 'Drizzle ORM' },
      { label: 'Auth Provider', value: 'NextAuth.js' },
      { label: 'Queue Scheduler', value: 'Upstash QStash' }
    ],
    problem: 'Interior design projects suffered from budget overruns because material selections, wood grades, and labor costs were not tracked in real-time.',
    whyBuilt: 'Built to reconcile interior design choices with client budgets instantly, automate GST quotation generation, and streamline task delegations.',
    solution: 'Created a Next.js ERP panel using Drizzle ORM to track designer catalog items, client site logs, and auto-compile GST quotes and invoice proposals.',
    features: [
      'Material catalog pricing registers with search filters.',
      'Client lead status boards tracking active designs, approvals, and invoice states.',
      'Unified admin credentials gateway powered by NextAuth.js.',
      'Background tasks queuing for notifications via Upstash QStash.'
    ],
    architecture: 'Client runs a Next.js dashboard panel. The database connector is powered by Drizzle ORM communicating with PostgreSQL. Background tasks use Upstash Redis queue systems.',
    dbBackendLogic: 'Relational PostgreSQL schemas hold material logs, client data, and user states, ensuring transactions remain integrated during concurrent updates.',
    uiScreens: [
      { title: 'Material catalog Sheets', description: 'Lists active wood grades, laminates, hardware costs, and markup scales.' },
      { title: 'Project Budget Ledger', description: 'Computes real-time summaries of material selections versus client limits.' },
      { title: 'Task Dispatch Center', description: 'Kanban view delegating client reviews and approvals.' }
    ],
    challenges: [
      {
        problem: 'Managing asynchronous material updates across active designer catalogs created data write locks and performance bottlenecks.',
        solution: 'Configured Upstash Redis caching and QStash background job queues to serialize catalog write transactions and speed up read requests.'
      },
      {
        problem: 'Generating clean PDF quotes and invoicing ledger spreadsheets consumed heavy server compute resources.',
        solution: 'Designed print-optimized CSS rules allowing standard web pages to render perfect, letterhead-branded invoices directly via browser PDF generation (window.print).'
      }
    ],
    whatILearned: 'Gained hands-on experience in schema migrations using Drizzle, caching database queries with Redis, and integrating background queues.',
    futureImprovements: [
      'Add client-accessible approval dashboard for live design confirmations.',
      'Integrate automatic WhatsApp webhook reminders for billing status alerts.'
    ],
    featured: true
  },
  {
    slug: 'anjeer-marketplace',
    title: 'Afghan Anjeer Marketplace',
    category: 'ecommerce',
    shortDescription: 'High-speed headful e-commerce marketplace designed for dried fruits and healthy snacks, optimized for fast checkout.',
    description: 'A direct-to-consumer e-commerce storefront designed for healthy food retail. Features rapid product grids, slide-out cart drawers, Google OAuth credentials logins, and Indian payment gateway checkout forms.',
    technologies: ['Next.js', 'Supabase', 'Upstash Redis', 'Razorpay', 'Resend', 'Zustand', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/ecommerce-brand.webp',
    liveUrl: 'https://www.anjeer.in/',
    role: 'Co-Developer (Collaboration)',
    period: 'May 2026 - Jul 2026',
    client: 'Agricultural Goods Retailer (Contract)',
    metrics: [
      { label: 'Payment Gateway', value: 'Razorpay SDK' },
      { label: 'Mail Dispatcher', value: 'Resend API' },
      { label: 'Backend Database', value: 'Supabase DB' }
    ],
    problem: 'Traditional wholesale channels restricted distribution scope for direct agricultural goods, requiring a high-speed DTC storefront.',
    whyBuilt: 'Built to establish a direct-to-consumer digital marketplace for premium dried fruits and healthy snacks with a fast checkout flow.',
    solution: 'Designed a high-performance Next.js storefront integrated with Razorpay payment overlays, Resend notification templates, and Supabase data layers.',
    features: [
      'Optimized direct-to-consumer product catalog grids.',
      'Cart management state client-side using Zustand.',
      'Razorpay payment checkout overlay Integration.',
      'Automatic transactional order confirmation notifications via Resend.'
    ],
    architecture: 'Storefront is built on Next.js 16 App Router. Zustand handles front-end cart state management. Razorpay libraries handle client transactions securely.',
    dbBackendLogic: 'Supabase PostgreSQL tables host inventories, orders lists, and customer profiles, checking stock levels before approving payment checkouts.',
    uiScreens: [
      { title: 'Product Catalog Grid', description: 'Lists active categories and weights with typography elements.' },
      { title: 'Frictionless Checkout Form', description: 'Checks buyer credentials and launches Razorpay overlay frames.' },
      { title: 'Client Account Console', description: 'Allows customers to view invoice details and tracking logs.' }
    ],
    challenges: [
      {
        problem: 'Managing real-time stock allocation and processing high checkout transactions during sales surges crashed database instances.',
        solution: 'Utilized Upstash Redis caching to store active inventories and serialize checkout transaction requests.'
      }
    ],
    whatILearned: 'Gained experience in payment gateway webhook verification, configuring secure customer sessions with Supabase SSR, and caching catalog lookups.',
    futureImprovements: [
      'Add user purchase history and personalized order suggestions.',
      'Integrate dynamic shipping costs calculations based on postal codes.'
    ],
    featured: true
  },
  {
    slug: 'anjeer-admin-dashboard',
    title: 'Anjeer Admin Dashboard',
    category: 'dashboard',
    shortDescription: 'Internal ERP and metrics dashboard for Afghan Anjeer Marketplace, tracking sales, shipping logs, inventory, and refunds.',
    description: 'An internal administration backoffice managing product catalogs, sales logs, and inventory updates. Features drag-and-drop showcase reordering arrays and SVG reporting charts.',
    technologies: ['Next.js', 'Supabase', 'dnd-kit', 'Recharts', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/ecommerce-dash.webp',
    liveUrl: 'https://admin-dashboard-dried-hub.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'May 2026 - Jul 2026',
    client: 'Agricultural Goods Retailer (Contract)',
    metrics: [
      { label: 'Reordering Engine', value: 'dnd-kit Sortable' },
      { label: 'Fulfillment Metrics', value: 'Recharts Grids' },
      { label: 'Auth Control', value: 'Supabase Auth' }
    ],
    problem: 'Store managers had to edit database records manually to update product queues and calculate sales reports.',
    whyBuilt: 'Built to provide a clean administration backoffice for Afghan Anjeer Marketplace store managers to track order details and rearrange home showcase layouts.',
    solution: 'Built a Next.js admin dashboard utilizing Recharts for metrics reporting, dnd-kit for layout reordering, and Supabase for backend integration.',
    features: [
      'Sales analytics charts tracking net revenue and order categories.',
      'Order logs tracking invoice details and client shipments.',
      'Drag-and-drop sortable lists to rearrange active catalog showcases.',
      'Secure role-based authentication via Supabase Auth.'
    ],
    architecture: 'Built on Next.js communicating with Supabase PostgreSQL databases using client wrappers. Drag-and-drop sort coordinates are processed client-side before update requests.',
    dbBackendLogic: 'Tables track order registers, stock balances, and content arrangements. Database triggers adjust stock counts during shipping changes.',
    uiScreens: [
      { title: 'Revenues Analytics Panel', description: 'Displays sales metrics, net profits, and order summaries.' },
      { title: 'Stock Coordinator Sheets', description: 'Lists active inventory units, unit rates, and discount settings.' },
      { title: 'Showcase Layout Rearranger', description: 'Drag-and-drop interface grid to order items visually.' }
    ],
    challenges: [
      {
        problem: 'Updating showcase sort orders dynamically for many items was slow and generated redundant database queries.',
        solution: 'Implemented client-side drag easing with dnd-kit and queued update updates in a single batch RPC database transaction.'
      }
    ],
    whatILearned: 'Learned about drag-and-drop event cycles, building complex charts using SVG Recharts, and optimizing bulk PostgreSQL updates.',
    futureImprovements: [
      'Incorporate bulk CSV import tools for new catalog inventory lines.',
      'Add shipment provider API tracking overlays.'
    ],
    featured: false
  },
  {
    slug: 'clothing-brand-website',
    title: 'Clothing Brand Storefront',
    category: 'website',
    shortDescription: 'Cinematic, high-fidelity luxury fashion e-commerce storefront utilizing advanced physics-based scroll and text reveals.',
    description: 'A high-end editorial fashion storefront featuring smooth scroll kinematics, typographic reveal timelines, custom screen cursors, and responsive shopping grids.',
    technologies: ['Next.js', 'Supabase', 'GSAP', 'Lenis Scroll', 'Upstash Redis', 'Resend', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/clothing-brand.webp',
    liveUrl: 'https://clothing-brand-website-beta.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'May 2026 - Jun 2026',
    client: 'Luxury Fashion Brand (Contract)',
    metrics: [
      { label: 'Viewport Scrolling', value: 'Lenis Physics' },
      { label: 'Interface Animation', value: 'GSAP Timelines' },
      { label: 'Auth System', value: 'Supabase Client' }
    ],
    problem: 'Luxury fashion brands require a distinct, highly immersive, editorial digital presence that standard rigid templates cannot provide.',
    whyBuilt: 'Built to construct a cinematic, scroll-driven visual identity for Clothing Brand, linking high-fidelity layouts with account details.',
    solution: 'Developed a high-end editorial storefront utilizing GSAP scroll-driven animation timelines, Lenis smooth scroll physics, and a custom catalog manager dashboard.',
    features: [
      'Editorial landing page with smooth scroll parallax grids.',
      'Typographic reveal animations and custom cursor trackers.',
      'Product catalogs and shopping carts synced with Supabase.',
      'Secured user authentication credentials.'
    ],
    architecture: 'Built on Next.js 16 App Router. Custom scroll interactions are bound to Lenis scroll engines and GSAP layout animations client-side.',
    dbBackendLogic: 'PostgreSQL catalog tables list active collection details, variants options, and user details, secured by Row Level Security.',
    uiScreens: [
      { title: 'Cinematic Editorial Feed', description: 'Landing page showing scroll-driven typography reveals.' },
      { title: 'Products Catalog Grids', description: 'Grid layouts displaying sizing options and zoom coordinates.' },
      { title: 'User Account Dashboard', description: 'Tracks order items, invoices, and shipping details.' }
    ],
    challenges: [
      {
        problem: 'Combining heavy graphics and scroll-triggered GSAP timelines caused visual stutter and frame drops on mobile viewports.',
        solution: 'Optimized scrolling using passive scroll listeners, hardware-accelerated transforms, and Lenis easing mechanics to maintain 60fps.'
      }
    ],
    whatILearned: 'Mastered GSAP timeline orchestrations, managing smooth scroll physics in Next.js layouts, and animating SVG canvas elements.',
    futureImprovements: [
      'Add size recommender logic based on standard measurements.',
      'Integrate real-time inventory checks during checkout selection.'
    ],
    featured: true
  },
  {
    slug: 'clothing-brand-admin',
    title: 'Clothing Brand Admin Dashboard',
    category: 'dashboard',
    shortDescription: 'Operational administration dashboard and content management system for Clothing Brand luxury fashion storefront.',
    description: 'An internal control panel designed to manage high-end fashion catalogs. Features WYSIWYG rich text document editors, drag-and-drop sort lists, and advanced data tables.',
    technologies: ['Next.js', 'Supabase', 'TanStack Table', 'TipTap Editor', 'dnd-kit', 'Recharts', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/clothing-brand-admin.webp',
    liveUrl: 'https://clothing-brand-dashboard.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'Jun 2026 - Jul 2026',
    client: 'Luxury Fashion Brand (Contract)',
    metrics: [
      { label: 'Product Table', value: 'TanStack Table' },
      { label: 'Description Text', value: 'TipTap WYSIWYG' },
      { label: 'Catalog Reordering', value: 'dnd-kit Sortable' }
    ],
    problem: 'Clothing Brand designers and editors struggled to layout blog posts and drag-reorder home product lists using static SQL tables.',
    whyBuilt: 'Built to provide an administrative content manager panel supporting rich text descriptions, drag sorting, and client invoice records.',
    solution: 'Built an admin panel integrating TanStack Table for sorting, TipTap for catalog descriptions, and dnd-kit for layout ordering.',
    features: [
      'Rich text WYSIWYG workspace using TipTap.',
      'Drag-and-drop showcase product queue sorting.',
      'Sortable and filterable data tables built with TanStack Table.',
      'Live dashboard metrics tracking orders.'
    ],
    architecture: 'Built on Next.js 14, communicating with Supabase database schemas. The editor imports TipTap modules, rendering sanitized HTML scripts to text tables.',
    dbBackendLogic: 'Audit tables track administrative changes. Custom database RPC functions perform batch sorting coordinates synchronization.',
    uiScreens: [
      { title: 'Products Data Sheet', description: 'Lists active items with filterable TanStack columns.' },
      { title: 'TipTap Content Creator', description: 'WYSIWYG document board supporting typography styles.' },
      { title: 'Fulfillment Console', description: 'Order details and client invoice tracking panel.' }
    ],
    challenges: [
      {
        problem: 'Updating detailed catalog descriptions and styling sequences required raw HTML inputs from admin staff.',
        solution: 'Built a dashboard editor integrating the TipTap rich text editor with HTML sanitization layers using DOMPurify.'
      }
    ],
    whatILearned: 'Gained experience in WYSIWYG editor configuration, building data tables with complex filters, and securing backend queries.',
    futureImprovements: [
      'Add image compression hooks on file uploads.',
      'Integrate automated order shipment tags generator.'
    ],
    featured: false
  },
  {
    slug: 'bus-body-builder-website',
    title: 'Bus Body Building Company Website',
    category: 'website',
    shortDescription: 'Premium business website for a bus body builder and coach manufacturer, featuring an interactive configuration board.',
    description: 'A business portal designed for coach manufacturers. Highlights B2B fleet manufacturing capabilities, vehicle categories, and configures estimation forms routed to sales teams.',
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'Lenis Scroll', 'Resend'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/bus-body-builder.webp',
    liveUrl: 'https://bus-body-builder-xi.vercel.app/',
    role: 'Co-Developer (Collaboration)',
    period: 'Jun 2026 - Jul 2026',
    client: 'Coach Manufacturer (Contract)',
    metrics: [
      { label: 'Interface Scroll', value: 'Lenis Easing' },
      { label: 'Contact Dispatch', value: 'Resend Mailing' },
      { label: 'Fluid Animation', value: 'Framer Motion' }
    ],
    problem: 'A commercial coach builder lacked a modern digital portal to present manufacturing capabilities and configuration layouts to fleet clients.',
    whyBuilt: 'Built to establish a clean web presence showcase for Coach Builder, allowing B2B clients to submit structured design specifications.',
    solution: 'Built a clean Next.js presentation site with Lenis smooth scrolling, Framer Motion animations, and Resend email forms for custom fleet quotes.',
    features: [
      'Cinematic capabilities showcase showcasing manufacturing yards.',
      'Structured fleet chassis configuration form.',
      'Resend integration to route fleet requests to company mailboxes.'
    ],
    architecture: 'High-performance static Next.js pages. B2B configuration forms collect client request details and forward payload states to Resend mail scripts.',
    dbBackendLogic: 'Serverless routes parse request forms, compile options details, and trigger secure dispatches to company mail servers.',
    uiScreens: [
      { title: 'Manufacturing Showcase', description: 'Scroll-driven gallery showing manufacturing processes.' },
      { title: 'Chassis Configurator Form', description: 'Form checklist capturing seat options and length requirements.' },
      { title: 'Lead Receipt Confirmation', description: 'Displays message confirmations and sends notifications.' }
    ],
    challenges: [
      {
        problem: 'Heavy image asset directories led to high LCP page loading latency for mobile clients.',
        solution: 'Optimized image pipelines by utilizing modern WebP formatting, responsive sizing ratios, and lazy-loading viewports.'
      }
    ],
    whatILearned: 'Learned about responsive layout structures, optimizing asset delivery, and configuring custom animation easings.',
    futureImprovements: [
      'Add interactive 3D coach model visualizer.',
      'Incorporate client request history tracker.'
    ],
    featured: false
  },
  {
    slug: 'mspe-volatility-engine',
    title: 'MSPE Greeks & Volatility Engine',
    category: 'quant_research',
    shortDescription: 'Real-time option implied volatility surface visualizer, portfolio risk modeler, and probability-based projection engine.',
    description: 'An options pricing and volatility surface analysis dashboard. It computes Option Greeks, forecasts historical volatility clusters using statistical models, and visualizes the volatility smile in 3D Plots.',
    technologies: ['Next.js', 'FastAPI', 'Pandas', 'NumPy', 'Plotly.js', 'GARCH (arch)', 'XGBoost', 'scikit-learn'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/mspe.webp',
    liveUrl: 'https://mspe.vercel.app/',
    role: 'Solo Developer (100% Personal Project)',
    period: 'Oct 2025 - Dec 2025',
    client: 'Personal Project',
    metrics: [
      { label: 'Volatility Model', value: 'GARCH Forecast' },
      { label: 'Machine Learning', value: 'XGBoost Regressor' },
      { label: 'Visualization Layer', value: 'Plotly 3D Skew' }
    ],
    problem: 'Implied option volatility calculations require root-finding numerical solvers which lag when processing large option books.',
    whyBuilt: 'Built to forecast historical volatility clusters, calculate option Greeks, and visualize the volatility smile skew in 3D.',
    solution: 'Built an options pricing and volatility forecasting platform using Next.js and Plotly.js, backed by a FastAPI engine running GARCH and XGBoost volatility projections.',
    features: [
      'Option Greeks calculator (Delta, Gamma, Vega, Theta).',
      'Volatility smile skew tracking.',
      'GARCH statistical forecasting models.',
      'XGBoost model training pipeline for volatility forecasting.',
      'Interactive 3D mesh rendering of skew surfaces using Plotly.'
    ],
    architecture: 'Next.js App Router renders Plotly chart boards. Calculations are processed on FastAPI Python servers utilizing optimized NumPy and Pandas arrays.',
    dbBackendLogic: 'Option chain indices and historical assets parameters are updated and cached, streaming forecast results dynamically.',
    uiScreens: [
      { title: '3D Skew Mesh Viewer', description: 'Plotly 3D mesh rendering options skews across strikes.' },
      { title: 'GARCH Forecast Panel', description: 'Line charts displaying historical volatility clusters.' },
      { title: 'Option Greeks Table', description: 'Grid displaying delta, gamma, and vega variables.' }
    ],
    challenges: [
      {
        problem: 'Calculating historical volatility profiles using standard regression algorithms failed to capture volatility clustering.',
        solution: 'Applied GARCH statistical modeling using the Python `arch` library to forecast volatility variance and regime parameters.'
      },
      {
        problem: 'Rendering complex 3D implied volatility skew surfaces degraded browser frame rates during user rotation interactions.',
        solution: 'Offloaded 3D mesh rendering to Plotly.js canvas with hardware-acceleration, plotting strike-to-expiry skew structures dynamically.'
      }
    ],
    whatILearned: 'Deepened knowledge of quantitative options pricing math, volatility clustering models, and connecting Python data engines to Next.js visualization boards.',
    futureImprovements: [
      'Integrate live options chains feeds via WebSockets.',
      'Incorporate SABR volatility modeling.'
    ],
    featured: true
  },
  {
    slug: 'nf-lrd-regime-discovery',
    title: 'NF-LRD Nifty 50 Regime Discovery',
    category: 'quant_research',
    shortDescription: 'NIFTY 50 Latent Market Regime Discovery and Risk Intelligence Platform using machine learning models to detect structural market regimes.',
    description: 'A quantitative analytics dashboard designed to identify hidden market states (bullish, bearish, high-volatility) in Nifty 50 close histories. Runs Hidden Markov Models to backtest adaptive strategies.',
    technologies: ['Streamlit', 'Python', 'Pandas', 'NumPy', 'hmmlearn', 'Plotly', 'yfinance', 'scikit-learn'],
    status: 'Live',
    year: '2025',
    image: '/images/projects/nflrd.webp',
    liveUrl: 'https://nf-lrd.streamlit.app/',
    role: 'Solo Developer (100% Personal Project)',
    period: 'Sep 2025 - Nov 2025',
    client: 'Personal Project',
    metrics: [
      { label: 'Regime Classifier', value: 'Gaussian HMM' },
      { label: 'Numerical Solver', value: 'scipy + numpy' },
      { label: 'Dashboard Engine', value: 'Streamlit App' }
    ],
    problem: 'Trading strategies optimized for calm regimes lose capital during sudden high-volatility regime shifts.',
    whyBuilt: 'Built to detect latent market regimes in historical NIFTY 50 returns data using statistical models.',
    solution: 'Developed a quantitative Streamlit dashboard running Gaussian Hidden Markov Models (HMM) to classify NIFTY 50 price movements into latent regimes.',
    features: [
      'Hidden Markov Model (HMM) regime segmentation.',
      'Dynamic trading backtest suite comparing returns to benchmark.',
      'Drawdown analysis metrics.',
      'Plotly regime segmentation plots.'
    ],
    architecture: 'Python analytics engine using Streamlit for dashboard rendering. Computations are processed in-memory using NumPy matrices.',
    dbBackendLogic: 'Nifty 50 daily index updates are fetched via APIs, cached locally, and vectorized to generate returns arrays.',
    uiScreens: [
      { title: 'Market Regime Segmentation', description: 'Plotly chart tracking market index close colors by active regime.' },
      { title: 'Probability Matrix Output', description: 'Displays transition matrices and state likelihoods.' },
      { title: 'Returns Backtester Console', description: 'Charts strategy returns against buy-and-hold curves.' }
    ],
    challenges: [
      {
        problem: 'Raw market close datasets from finance APIs contained anomalies and gaps that skewed statistical model fitting.',
        solution: 'Implemented data preprocessing pipelines using Pandas to align timeline series, forward-fill missing indices, and compute log returns.'
      },
      {
        problem: 'Plotting multi-regime backtests side-by-side with benchmark returns created cluttered UI layouts.',
        solution: 'Engineered interactive multi-trace Plotly charts letting research analysts toggle regime overlays and inspect drawdown periods.'
      }
    ],
    whatILearned: 'Gained hands-on experience in statistical time series analysis, regime-switching models, and vector backtesting with NumPy.',
    futureImprovements: [
      'Add walk-forward optimization framework for HMM model parameters.',
      'Incorporate international indices comparison metrics.'
    ],
    featured: true
  },
  {
    slug: 'btc-algo-trading',
    title: 'BTC-ALGO Signals Board',
    category: 'quant_research',
    shortDescription: 'Bitcoin algorithmic trading dashboard displaying live signal generation, backtesting metrics, and risk monitoring.',
    description: 'A Bitcoin trading signal dashboard. Tracks candlestick patterns, moving average crossovers, drawdown statistics, and displays active buy, sell, or hold indicators.',
    technologies: ['Streamlit', 'Python', 'Pandas', 'NumPy', 'Plotly', 'requests', 'streamlit-autorefresh'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/btcalgo.webp',
    liveUrl: 'https://btc-algo-dashboard.onrender.com/',
    role: 'Solo Developer (100% Personal Project)',
    period: 'Nov 2025 - Jan 2026',
    client: 'Personal Project',
    metrics: [
      { label: 'Signal Strategy', value: 'Trend Momentum' },
      { label: 'Vector Compute', value: 'Pandas + NumPy' },
      { label: 'Dashboard Engine', value: 'Streamlit App' }
    ],
    problem: 'Retail traders lack lightweight dashboards to monitor trend-momentum signals and risk metrics in real-time.',
    whyBuilt: 'Built to calculate technical indicators and display trading signal triggers dynamically.',
    solution: 'Created a Bitcoin trading signals dashboard using Streamlit and Pandas, calculating moving average crossovers and tracking drawdowns.',
    features: [
      'Real-time indicators calculation.',
      'Autorefresh data updates.',
      'Visual performance charts.'
    ],
    architecture: 'Streamlit dashboard executing Python computational blocks.Candlestick histories are parsed using Pandas indicator methods.',
    dbBackendLogic: 'Caches recent close ticks and calculates metrics in-memory, updating outputs dynamically on frontend updates.',
    uiScreens: [
      { title: 'Active Signal Status', description: 'Highlights current asset signals (Buy/Sell/Hold).' },
      { title: 'Performance Metrics Chart', description: 'Plotly lines charting strategy growth and drawdowns.' },
      { title: 'Parameters Configuration', description: 'Sidebar selectors to override indicator length constants.' }
    ],
    challenges: [
      {
        problem: 'API fetch timeouts from public crypto exchanges frequently delayed signal computations.',
        solution: 'Integrated a connection retry handler using python `requests` and enabled `streamlit-autorefresh` to poll price feeds.'
      }
    ],
    whatILearned: 'Learned about stream polling constraints, rate limiting, and standard indicators math.',
    futureImprovements: [
      'Integrate WebSockets endpoints for live tick data.',
      'Add backtesting simulation panel with slippage inputs.'
    ],
    featured: false
  },
  {
    slug: 'ask-vraj',
    title: 'Ask Vraj AI Assistant',
    category: 'ai_automation',
    shortDescription: 'Interactive conversational interface and floating widget powered by Google Gemini and Supabase for answering recruiter queries about Vraj.',
    description: 'An AI assistant built to answer queries about Vraj\'s skills, projects, and work history. It features an interactive CLI-like chat playground and floating widget, integrating Google Gemini API for streaming responses and Supabase telemetry logs.',
    technologies: ['Next.js', 'React', 'Google Gemini API', 'Supabase', 'Framer Motion', 'Zod', 'Tailwind CSS', 'TypeScript'],
    status: 'Live',
    year: '2026',
    image: '/images/projects/ask-vraj.webp',
    liveUrl: '/ask-vraj',
    role: 'Solo Developer',
    period: 'Jun 2026',
    client: 'Personal Project',
    metrics: [
      { label: 'LLM Latency', value: 'Streaming' },
      { label: 'Model', value: 'Gemini 3.1 Flash Lite' },
      { label: 'Logging', value: 'Supabase DB' }
    ],
    problem: 'Recruiters and visitors have to manually read through multiple project listings and resumes to evaluate candidate fit, which is slow and tedious.',
    whyBuilt: 'Built to provide an interactive, instant chatbot that handles natural language questions about Vraj\'s expertise and backgrounds with direct data answers.',
    solution: 'Implemented a chat interface with Framer Motion animations that streams response blocks from Next.js Edge handlers invoking Google GenAI SDK, backed by Supabase logging.',
    features: [
      'Natural language conversational playground matching Vraj\'s background.',
      'Edge runtime handler streaming tokens to minimize response latency.',
      'Client-side local storage chat session history persistence.',
      'Supabase analytics logging to track recruiter interest areas.'
    ],
    architecture: 'Frontend chat UI triggers Next.js Edge POST routes. Edge functions validate requests with Zod, invoke the Gemini Flash model, and write anonymous telemetry logs to Supabase PostgreSQL.',
    dbBackendLogic: 'No sessions are stored server-side. LocalStorage caches active chat threads, while request and response events are logged directly via Supabase anonymous insert RPCs.',
    uiScreens: [
      { title: 'Dedicated Chat Playground', description: 'Immersive terminal-like screen with quick queries presets.' },
      { title: 'AI Assistant Floating Widget', description: 'Fixed corner chat widget accessible from any portfolio route.' }
    ],
    challenges: [
      {
        problem: 'Cold startup latency and slow responses from deep LLM models degraded chatbot user experience.',
        solution: 'Used Next.js Edge Runtime to stream Gemini text chunks in real-time, reducing initial token latency to sub-second times.'
      }
    ],
    whatILearned: 'Gained expertise in Edge Runtime restrictions, response streaming, prompt conditioning, and privacy-preserving telemetry.',
    futureImprovements: [
      'Add vector database for dynamic context retrieval (RAG).',
      'Integrate voice input commands.'
    ],
    featured: false
  }
];

export const categories = [
  'all',
  'client_software',
  'erp_system',
  'ecommerce',
  'ai_automation',
  'quant_research',
  'website',
  'dashboard'
] as const;
