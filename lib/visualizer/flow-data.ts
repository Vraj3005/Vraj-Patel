import { DataFlow } from '@/types/advanced';

/**
 * Registry containing high-fidelity, real-world data flow definitions
 * representing Vraj Patel's actual system pipelines.
 */
export const DATA_FLOWS: DataFlow[] = [
  {
    id: 'enermass-solar-calculator',
    name: 'Enermass Quote Generation Workflow',
    description: 'Traces how client-side user specifications are validated, computed against state subsidy formulas, and compiled to A4 PDF proposals.',
    accentColor: '#eab308', // Amber
    projectSlug: 'enermass-solar-calculator',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Surveyor Parameters Capture',
        description: 'On-site sales agents input physical rooftop dimensions, utility parameters, and local states mappings.',
        input: 'Rooftop Area (sq m), Avg Monthly Utility Bill (INR), Selected Indian State.',
        action: 'Zustand store captures inputs and recalculates options list.',
        output: 'Sanitized parameters JSON payload.',
        securityNote: 'Client-side boundary limits check enforcing positive integer limits.',
        businessView: {
          title: 'On-Site Specifications Intake',
          description: 'Sales surveyor fills dimensions on site. The immediate client-side validation reduces estimation errors by 95%.',
          metric: '0ms Latency'
        },
        technicalView: {
          title: 'Zustand Store Intake Actions',
          description: 'Updates parameters in Zustand store. Triggers reactive selectors recalculating BOM rows.',
          metric: 'Zustand setParams()'
        },
        recruiterView: {
          title: 'Interactive Sizing Console',
          description: 'Captures physical specifications. Evaluates inputs instantaneously to keep sales conversations fluid.',
          metric: 'Zero Server Overhead'
        }
      },
      {
        sequence: 2,
        nodeId: 'zod',
        title: 'Payload Validation Gate',
        description: 'Zod schemas validate the structured parameters to block payload format anomalies.',
        input: 'Raw inputs parameters object.',
        action: 'Parses properties against strict solar sizing type constraints.',
        output: 'Validated schema parameters instance.',
        securityNote: 'Strict type validation preventing memory injection or out-of-bounds metrics.',
        businessView: {
          title: 'Pricing Format Audits',
          description: 'Validates that custom pricing overrides and quantity adjustments fit business margin ranges.',
          metric: 'Immediate Client Gate'
        },
        technicalView: {
          title: 'Zod Schema Parsing',
          description: 'Executes parse() checks on inputs object. Rejects structural modifications or negative quantities.',
          metric: 'z.object() parse()'
        },
        recruiterView: {
          title: 'Robust Client-Side Validation',
          description: 'Employs Zod schemas to guarantee input sanitation before math computations or local saves.',
          metric: 'Type-Safe Verification'
        }
      },
      {
        sequence: 3,
        nodeId: 'math',
        title: 'Subsidy & Sizing Calculations',
        description: 'The sizing engine processes parameters against Surya Ghar matrices to calculate KW sizing and subsidies.',
        input: 'Validated solar metrics + selected state metadata.',
        action: 'Applies national subsidy caps and state solar irradiance coefficients.',
        output: 'Calculated KW capacity requirements + subsidy offset values.',
        securityNote: 'Coefficient matrices are encapsulated in immutable code modules.',
        businessView: {
          title: 'Subsidy Matrix Evaluation',
          description: 'Performs instant calculations matching PM Surya Ghar central brackets, estimating net costs.',
          metric: 'PM Surya Ghar Formula'
        },
        technicalView: {
          title: 'Immutable Sizing Calculations',
          description: 'Processes input values client-side using rule-based coefficient tables mapped for Indian states.',
          metric: 'Surya Ghar Formula Matrix'
        },
        recruiterView: {
          title: 'Automated Subsidy Evaluation',
          description: 'Computes state and central subsidies instantly, replacing manual lookup errors with code-level rules.',
          metric: 'Rule-Based Engine'
        }
      },
      {
        sequence: 4,
        nodeId: 'local',
        title: 'LocalStorage Cache Save',
        description: 'Auto-saves current pricing configurations into the browser\'s storage cache.',
        input: 'Current calculated quote details.',
        action: 'Serializes state variables and writes to LocalStorage via Zustand Persist.',
        output: 'Local caching validation indicator.',
        securityNote: 'No sensitive client keys or PII data are written to local stores.',
        businessView: {
          title: 'Offline Draft Caching',
          description: 'Saves work progress locally in browser. Restores active layouts if the network disconnects.',
          metric: 'Offline Resiliency'
        },
        technicalView: {
          title: 'Zustand Hydration Persist',
          description: 'Writes JSON serialized quote array to browser LocalStorage. Persists draft listings across reloads.',
          metric: 'Zustand Persist Middleware'
        },
        recruiterView: {
          title: 'Persistent Draft Sessions',
          description: 'Enables surveyor agents to retrieve active proposals even while offline in rural regions.',
          metric: 'LocalStorage Caching'
        }
      },
      {
        sequence: 5,
        nodeId: 'pdf',
        title: 'PDF Proposal Compilation',
        description: 'Converts quote details and BOM item logs into a print-optimized document letterhead.',
        input: 'Invoice calculations + company logos parameters.',
        action: 'Renders custom print-specific styling grids and compiles PDF components.',
        output: 'Downloadable PDF document brochure.',
        securityNote: 'Rendering runs client-side with 0 external network script dependencies.',
        businessView: {
          title: 'Proposal Document Output',
          description: 'Generates polished sales PDF proposals matching printer letterhead structures instantly.',
          metric: 'Instant PDF brochure'
        },
        technicalView: {
          title: 'CSS Print Media Render',
          description: 'Applies print-media stylesheets to format the bill of materials cleanly into an A4 PDF document.',
          metric: '@media print rules'
        },
        recruiterView: {
          title: 'Print-Optimized Exporters',
          description: 'Compiles custom invoice bills of materials directly to PDF, improving customer onboarding times.',
          metric: 'Client-Side Export'
        }
      }
    ]
  },
  {
    id: 'bhagwati-interior-erp',
    name: 'Bhagwati Interior ERP Pipeline',
    description: 'Visualizes the end-to-end data lifecycle when a designer submits milestone schedule updates through Next.js Server Actions to Supabase and QStash queues.',
    accentColor: '#14b8a6', // Teal
    projectSlug: 'bhagwati-interior-erp',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Milestone Update Action',
        description: 'Interior designer edits a site scheduling log or catalog cost parameter on the dashboard.',
        input: 'Site Milestone Id, Schedule Date, Task Category (e.g. Woodwork, Glass).',
        action: 'Form hooks bundle input parameters and block double-click dispatches.',
        output: 'Bundled client payload.',
        securityNote: 'NextAuth JWT session headers verified client-side before sending requests.',
        businessView: {
          title: 'Milestone Progress Update',
          description: 'Designer updates schedule logs. Instant UI feedback prevents duplicate actions.',
          metric: 'User Input'
        },
        technicalView: {
          title: 'Form Payload Assembly',
          description: 'Collects fields using react-hook-form. Pre-attaches designer JWT session token to request scope.',
          metric: 'react-hook-form bindings'
        },
        recruiterView: {
          title: 'Task Progress Tracker',
          description: 'Enables designers to update project milestones, keeping studio workflows aligned.',
          metric: 'Studio ERP Update'
        }
      },
      {
        sequence: 2,
        nodeId: 'auth',
        title: 'Authentication Session Check',
        description: 'NextAuth validates user cookies and session state before route execution.',
        input: 'Request cookie headers.',
        action: 'Decrypts JWT token and validates role permissions boundaries.',
        output: 'Authenticated session identifier.',
        securityNote: 'Secure JWT verification preventing session token spoofing.',
        businessView: {
          title: 'Permissions Verification',
          description: 'Ensures only authorized designers can modify task costs and inventories.',
          metric: 'Access Guard'
        },
        technicalView: {
          title: 'NextAuth JWT Decryption',
          description: 'Parses cookies headers. Decrypts JWT token to check user role permissions.',
          metric: 'auth() session verification'
        },
        recruiterView: {
          title: 'Secure Session Gate',
          description: 'Protects database endpoints behind NextAuth gateways to prevent unauthorized modifications.',
          metric: 'Role-Based Authentication'
        }
      },
      {
        sequence: 3,
        nodeId: 'actions',
        title: 'Server Actions Gateway',
        description: 'React Server Action endpoints receive parameters from client modules.',
        input: 'Milestone payload data object.',
        action: 'Processes mutations directly on Next.js backend server scopes.',
        output: 'Server Action operation response.',
        securityNote: 'Actions bypass public REST ports, running as secure server RPC endpoints.',
        businessView: {
          title: 'Server Request Intake',
          description: 'Server receives update parameters directly, bypassing public API routers.',
          metric: 'Type-Safe server actions'
        },
        technicalView: {
          title: 'Server Action Invocation',
          description: 'Executes async server function. Enforces boundary checks on payload parameters.',
          metric: 'use server action gate'
        },
        recruiterView: {
          title: 'Direct RPC Pipeline',
          description: 'Employs Next.js Server Actions to securely process data without exposing API controllers.',
          metric: 'Type-Safe Server Route'
        }
      },
      {
        sequence: 4,
        nodeId: 'validation',
        title: 'Zod Server Validation',
        description: 'Server validates payload structure using strict Zod schemas.',
        input: 'Raw server parameters.',
        action: 'Parses properties, stripping unknown parameters and verifying formats.',
        output: 'Sanitized database parameters.',
        securityNote: 'Server-side Zod verification to prevent database injection vectors.',
        businessView: {
          title: 'Input Quality Audit',
          description: 'Audits formatting rules to block invalid pricing or date entries.',
          metric: 'Data Hygiene Check'
        },
        technicalView: {
          title: 'Zod Schema Validation',
          description: 'Runs schema.safeParse() checking type boundaries, dates, and cost formats.',
          metric: 'zodSchema.safeParse()'
        },
        recruiterView: {
          title: 'Server-Side Sanitization',
          description: 'Uses server-side Zod checks to validate data schema before executing database writes.',
          metric: 'Data Integrity Gate'
        }
      },
      {
        sequence: 5,
        nodeId: 'redis',
        title: 'Redis Cache Sync',
        description: 'Upstash Redis cache records are refreshed to prevent stale inventory logs.',
        input: 'Milestone update parameters.',
        action: 'Writes new cost entries to Upstash Redis key-value stores.',
        output: 'Cache write status success.',
        securityNote: 'TLS encrypted connections pipeline to Upstash cloud databases.',
        businessView: {
          title: 'Materials Cache Refresh',
          description: 'Refreshes materials pricing caches immediately to align customer quotes.',
          metric: 'Upstash Cache sync'
        },
        technicalView: {
          title: 'Redis Cache Write',
          description: 'Executes setex() command on Redis cluster, updating active wood/materials lists.',
          metric: 'redis.setex(key, ttl, val)'
        },
        recruiterView: {
          title: 'High-Speed Caching',
          description: 'Uses Upstash Redis cache to reduce database loads, keeping inventory reads under 5ms.',
          metric: 'Redis Cache Integration'
        }
      },
      {
        sequence: 6,
        nodeId: 'db',
        title: 'PostgreSQL Database Write',
        description: 'Drizzle ORM executes database queries to write updates to Supabase PostgreSQL tables.',
        input: 'Sanitized parameters payload.',
        action: 'Executes database transaction to update milestones and project records.',
        output: 'Database insert confirmation.',
        securityNote: 'Supabase table locked behind Row Level Security (RLS) policies.',
        businessView: {
          title: 'Database Record Persistence',
          description: 'Milestones records are written to persistent storage, establishing a verified audit history.',
          metric: 'Supabase DB write'
        },
        technicalView: {
          title: 'Drizzle SQL Execution',
          description: 'Triggers db.update(milestones).set().where() transaction on PostgreSQL instance.',
          metric: 'Drizzle ORM transaction'
        },
        recruiterView: {
          title: 'Persistent Audit Logs',
          description: 'Writes updates to Supabase PostgreSQL, ensuring all database tables use RLS configurations.',
          metric: 'Database Persistence'
        }
      },
      {
        sequence: 7,
        nodeId: 'qstash',
        title: 'QStash Scheduled Worker Queue',
        description: 'Asynchronous workers are queued via QStash to schedule notification events.',
        input: 'Notification event payload.',
        action: 'Pushes scheduled task messages to Upstash QStash queues.',
        output: 'QStash event queue message ID.',
        securityNote: 'Requests contain HMAC token signatures to secure backend receivers.',
        businessView: {
          title: 'Notification Event Queueing',
          description: 'Schedules reminder alerts in background queues, ensuring system responsiveness.',
          metric: 'Serverless Background Worker'
        },
        technicalView: {
          title: 'QStash Message Publish',
          description: 'Publishes payload payload to QStash REST endpoint. Decouples notification tasks from database logic.',
          metric: 'qstashClient.publishJSON()'
        },
        recruiterView: {
          title: 'Asynchronous Background Jobs',
          description: 'Decouples email alerts using QStash message brokers to maintain frontend performance.',
          metric: 'QStash Decoupling'
        }
      },
      {
        sequence: 8,
        nodeId: 'resend',
        title: 'Resend Email Dispatch',
        description: 'The Resend Mail API sends alert notifications to project managers.',
        input: 'Task details + recipient emails.',
        action: 'Compiles dynamic email layouts and triggers outbound delivery.',
        output: 'Resend API message identifier.',
        securityNote: 'Outbound pipeline matches SPF, DKIM, and DMARC alignments.',
        businessView: {
          title: 'Designer Alert Delivery',
          description: 'Project managers receive real-time email alerts when studio timelines change.',
          metric: 'Resend Mail Delivery'
        },
        technicalView: {
          title: 'Resend API Dispatch',
          description: 'Sends email using Resend SDK. Renders React Email templates dynamically.',
          metric: 'resend.emails.send()'
        },
        recruiterView: {
          title: 'Automated Email Alerts',
          description: 'Integrates Resend SDK to automate email notifications when scheduling updates occur.',
          metric: 'Resend SDK Emailer'
        }
      }
    ]
  },
  {
    id: 'ask-vraj',
    name: 'Ask Vraj AI Query Pipeline',
    description: 'Traces the lifecycle of a question submitted to the Ask Vraj AI chat assistant: input validation, context building, Gemini LLM call, token streaming, and Supabase audit logs.',
    accentColor: '#d946ef', // Fuchsia
    projectSlug: 'ask-vraj',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Visitor Prompt Submission',
        description: 'User enters a question in the AI chat bubble or dedicated ask-vraj playground.',
        input: 'Raw text query string (e.g., "What tech did you use for Driedhub?").',
        action: 'Appends prompt to local Zustand chat logs and updates chat container.',
        output: 'Sanitized visitor prompt.',
        securityNote: 'XSS character checks prevent script injections on input render.',
        businessView: {
          title: 'Chat Query Submission',
          description: 'Visitor submits questions about Vraj\'s background. Zustand immediately updates Chat UI feeds.',
          metric: 'User Input'
        },
        technicalView: {
          title: 'Zustand Chat Store Update',
          description: 'Appends message object to Zustand messages list. Triggers chat container scroll calculations.',
          metric: 'Zustand appendMessage()'
        },
        recruiterView: {
          title: 'Interactive Conversational UI',
          description: 'Captures recruiter questions, updating chat contexts instantly without screen reloads.',
          metric: 'Instant Response UI'
        }
      },
      {
        sequence: 2,
        nodeId: 'history',
        title: 'Session History Caching',
        description: 'Saves conversation message threads in browser storage to retain chat history.',
        input: 'Updated active chat logs array.',
        action: 'Serializes log arrays and updates LocalStorage buffers.',
        output: 'LocalStorage write status.',
        securityNote: 'Encryption-scrubbed browser session tracking, storing no PII or password data.',
        businessView: {
          title: 'Context Caching',
          description: 'Retains active conversation threads across reloads, maintaining context continuity.',
          metric: 'Session Persistence'
        },
        technicalView: {
          title: 'Local Session Caching',
          description: 'Writes chat log array JSON string to LocalStorage, enabling chat thread recovery.',
          metric: 'localStorage.setItem()'
        },
        recruiterView: {
          title: 'Retained Chat Continuity',
          description: 'Uses local browser storage to persist chat history, allowing recruiters to reload pages safely.',
          metric: 'LocalStorage Caching'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Edge Runtime Endpoint Intake',
        description: 'Next.js Edge Route endpoint (/api/ask) parses chat queries.',
        input: 'HTTP POST payload containing prompt context.',
        action: 'Intakes payloads on Next.js serverless Edge runtime routing configurations.',
        output: 'Streaming response channel headers.',
        securityNote: 'Limits maximum request lengths to block DDoS prompt payload attacks.',
        businessView: {
          title: 'Serverless Request Intake',
          description: 'Next.js serverless route receives prompt. Runs globally on Edge servers to lower response latency.',
          metric: '/api/ask Edge Route'
        },
        technicalView: {
          title: 'Next.js Edge Route Intake',
          description: 'Initializes POST route handler on Edge runtime. Parses prompt parameters from request payload.',
          metric: 'export const runtime = "edge"'
        },
        recruiterView: {
          title: 'Serverless Edge Handler',
          description: 'Executes chat routes on Edge runtimes to ensure rapid response delivery.',
          metric: 'Edge Server Handlers'
        }
      },
      {
        sequence: 4,
        nodeId: 'validation',
        title: 'Prompt Sanitization & Zod Gate',
        description: 'Server validates prompt payload format using Zod schemas.',
        input: 'Raw prompt text parameters.',
        action: 'Verifies parameters fit text constraints and sanitizes inputs.',
        output: 'Sanitized prompt payload string.',
        securityNote: 'Checks prompt length (max 1000 characters) to prevent token overload attacks.',
        businessView: {
          title: 'Prompt Quality Filtering',
          description: 'Audits prompt lengths to prevent server stress and verify formatting.',
          metric: 'Data Validation Gate'
        },
        technicalView: {
          title: 'Zod Parsing Validation',
          description: 'Runs zod.string().max(1000).safeParse() to sanitize prompt inputs.',
          metric: 'z.string().safeParse()'
        },
        recruiterView: {
          title: 'Input Length Auditing',
          description: 'Validates prompts using Zod schema constraints to protect against input manipulation.',
          metric: 'Zod Input Sanity'
        }
      },
      {
        sequence: 5,
        nodeId: 'ai',
        title: 'Portfolio Context Injection',
        description: 'System prompt builder merges portfolio data with user question.',
        input: 'Sanitized visitor prompt + resume details payload.',
        action: 'Combines resume details and prompt rules to construct complete LLM prompts.',
        output: 'Contextualized prompt context instructions.',
        securityNote: 'System guidelines instruct model to reject system prompt injection attempts.',
        businessView: {
          title: 'Context Assembly',
          description: 'Retrieves relevant credentials (skills, project tech stack) to ground the AI\'s responses.',
          metric: 'Portfolio Context Grounding'
        },
        technicalView: {
          title: 'System Prompt Assembly',
          description: 'Combines context guidelines with sanitized prompt string, establishing output formats.',
          metric: 'System Prompt Wrapping'
        },
        recruiterView: {
          title: 'Contextual AI Responses',
          description: 'Grounds responses in Vraj\'s actual credentials, preventing hallucinations.',
          metric: 'Contextual Grounding'
        }
      },
      {
        sequence: 6,
        nodeId: 'ai',
        title: 'Gemini LLM Generation Call',
        description: 'Calls Google GenAI SDK to request text generation from Gemini 1.5 Flash.',
        input: 'Wrapped prompt context instruction.',
        action: 'Invokes Google GenAI client to initialize stream response calls.',
        output: 'Token stream generator buffer.',
        securityNote: 'Gemini API key is read securely from environment variables.',
        businessView: {
          title: 'Gemini LLM Invocation',
          description: 'Passes prompt to Gemini 1.5 Flash to generate responses.',
          metric: 'Gemini 1.5 Flash API'
        },
        technicalView: {
          title: 'GenAI SDK Call execution',
          description: 'Invokes googleGenAI.models.generateContentStream() using gemini-1.5-flash.',
          metric: 'generateContentStream()'
        },
        recruiterView: {
          title: 'Google Gemini Integration',
          description: 'Connects to Gemini Flash models via Google GenAI SDK to generate rapid responses.',
          metric: 'Gemini Flash Model API'
        }
      },
      {
        sequence: 7,
        nodeId: 'ui',
        title: 'Token-by-Token Streaming Render',
        description: 'Edge runtime streams text tokens back to Chat UI for rendering.',
        input: 'Response token chunks buffer stream.',
        action: 'Streams response tokens, updating UI in real-time.',
        output: 'Rendered markdown text chat bubble.',
        securityNote: 'Markdown parser sanitizes rendered text to prevent XSS script executions.',
        businessView: {
          title: 'Real-Time Streaming Response',
          description: 'Streams responses in real-time, reducing user wait times and perceived latency.',
          metric: 'Response Streaming'
        },
        technicalView: {
          title: 'Edge Response Stream',
          description: 'Edge runtime writes chunks to ReadableStream, which the React UI processes on-the-fly.',
          metric: 'NextResponse(Stream)'
        },
        recruiterView: {
          title: 'Real-Time Chat Streaming',
          description: 'Streams text response tokens, providing immediate feedback for users.',
          metric: 'TTFT Under 350ms'
        }
      },
      {
        sequence: 8,
        nodeId: 'db',
        title: 'Telemetry Auditing Write',
        description: 'Writes request analytics and prompt metadata logs to Supabase PostgreSQL.',
        input: 'Analytics metadata object (prompt length, latency, tokens).',
        action: 'Writes logs asynchronously to Supabase PostgreSQL db tables.',
        output: 'Database write confirmation logs.',
        securityNote: 'Uses cookie-less Supabase client to prevent cookie header clashes in Next.js.',
        businessView: {
          title: 'Conversational Analytics Logs',
          description: 'Logs conversations to database, enabling Vraj to track recruiter questions and interests.',
          metric: 'Supabase logging'
        },
        technicalView: {
          title: 'Cookie-Less DB Write',
          description: 'Uses createSimpleSupabaseClient() to insert telemetry logs asynchronously, protecting Edge response pipelines.',
          metric: 'supabase.from().insert()'
        },
        recruiterView: {
          title: 'Conversational Analytics Logs',
          description: 'Logs chat interactions to track candidate inquiries while protecting Edge processing routes.',
          metric: 'Asynchronous Auditing'
        }
      }
    ]
  },
  {
    id: 'portfolio-contact',
    name: 'Contact Form Submission Pipeline',
    description: 'Traces the data flow of a user sending an inquiry via the contact form: validation checks, Supabase database storage, and Nodemailer SMTP admin alerts.',
    accentColor: '#3b82f6', // Blue
    isSystemLevel: true,
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Contact Form Submission',
        description: 'User enters email and message parameters on the portfolio contact form.',
        input: 'Sender Name, Email Address, Message Text.',
        action: 'Form handler captures inputs and runs React Hook Form checks.',
        output: 'Sanitized form data object.',
        securityNote: 'Regex validation checks input formats on client-side.',
        businessView: {
          title: 'Inquiry Intake Capture',
          description: 'User fills inquiry form details. Local validation checks reduce entry errors.',
          metric: 'User Input'
        },
        technicalView: {
          title: 'Form Submission Intake',
          description: 'Intakes field values using react-hook-form. Verifies field entries are populated.',
          metric: 'handleSubmit(onSubmit)'
        },
        recruiterView: {
          title: 'Contact Form Intake',
          description: 'Provides clean contact forms that validate user input in real-time.',
          metric: 'Real-Time Validation'
        }
      },
      {
        sequence: 2,
        nodeId: 'validation',
        title: 'API Gateway Sanitization Check',
        description: 'Form submission endpoint (/api/contact) sanitizes parameters.',
        input: 'JSON request payload parameters.',
        action: 'POST endpoint processes parameters and validates lengths using Zod schemas.',
        output: 'Sanitized parameters JSON payload.',
        securityNote: 'Zod validation rejects script payloads to prevent database exploits.',
        businessView: {
          title: 'API Request Verification',
          description: 'Filters incoming message parameters on API servers to ensure data cleanliness.',
          metric: 'API Gateway validation'
        },
        technicalView: {
          title: 'Server-Side Zod Validation',
          description: 'Runs zodContactSchema.parse() checking email formats and character counts (max 4000).',
          metric: 'zodSchema.parse(payload)'
        },
        recruiterView: {
          title: 'API Gateway Sanitization',
          description: 'Validates contact form submissions on backend routes to protect data tables.',
          metric: 'Secure Route Handler'
        }
      },
      {
        sequence: 3,
        nodeId: 'db',
        title: 'Supabase Database Transaction',
        description: 'Inserts sanitized contact message records into Supabase PostgreSQL database tables.',
        input: 'Sanitized parameters payload.',
        action: 'Executes insert query on Supabase database table.',
        output: 'Supabase insert response confirmation.',
        securityNote: 'Row Level Security (RLS) restricts public access to contact records.',
        businessView: {
          title: 'Message Record Save',
          description: 'Saves message data to database tables, creating a secure record of visitor inquiries.',
          metric: 'Supabase Database Write'
        },
        technicalView: {
          title: 'SQL Database Insert',
          description: 'Triggers insert query into contacts table using Supabase client.',
          metric: 'supabase.from("contacts").insert()'
        },
        recruiterView: {
          title: 'Secure Database Save',
          description: 'Writes contact inquiries to Supabase database with RLS policies in place.',
          metric: 'RLS Policies Guard'
        }
      },
      {
        sequence: 4,
        nodeId: 'external',
        title: 'Nodemailer SMTP Email Dispatch',
        description: 'Nodemailer dispatches alert notification emails to the administrator.',
        input: 'Contact parameters template.',
        action: 'Sends alert emails using Nodemailer SMTP transport integrations.',
        output: 'SMTP delivery success confirmation.',
        securityNote: 'SMTP connection encrypted via SSL/TLS configuration.',
        businessView: {
          title: 'Admin Email Notification',
          description: 'Triggers email notifications to Vraj Patel, enabling quick responses to inquiries.',
          metric: 'Nodemailer Alert Delivery'
        },
        technicalView: {
          title: 'Nodemailer Transport Dispatch',
          description: 'Executes transporter.sendMail() sending alert details to admin email inbox.',
          metric: 'transporter.sendMail()'
        },
        recruiterView: {
          title: 'Automated Admin Alerts',
          description: 'Connects to Nodemailer transporter to automate email alerts when contact submissions occur.',
          metric: 'SMTP Alert Pipeline'
        }
      }
    ]
  },
  {
    id: 'nf-lrd-regime-discovery',
    name: 'NF-LRD Data Ingestion & Analysis Pipeline',
    description: 'Traces the data pipeline of the Nifty 50 regime discovery application: market dataset ingestion, Parquet reads, Gaussian HMM training, backtesting strategy simulation, and Plotly visualizations.',
    accentColor: '#f97316', // Orange
    projectSlug: 'nf-lrd-regime-discovery',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Parameters Selection Action',
        description: 'Analyst selects regimes count parameters on Streamlit panel settings.',
        input: 'Number of Hidden States (2 to 5 HMM states), Model Covariance type selector.',
        action: 'Triggers Streamlit state callbacks to reset calculations.',
        output: 'Parameters configuration state.',
        securityNote: 'Input bounds locked within UI slider configurations.',
        businessView: {
          title: 'Model Parameters Configuration',
          description: 'Analyst configures Hidden Markov Model state counts to evaluate market cycles.',
          metric: 'Streamlit Parameters'
        },
        technicalView: {
          title: 'Streamlit State Intake',
          description: 'Stores selected state values in Streamlit session variables. Triggers recalculation flag.',
          metric: 'st.session_state updates'
        },
        recruiterView: {
          title: 'Configurable Financial Simulator',
          description: 'Provides input parameter selectors to run option modeling scenarios dynamically.',
          metric: 'Streamlit Controls'
        }
      },
      {
        sequence: 2,
        nodeId: 'yfinance',
        title: 'Yahoo Finance Price Ingestion',
        description: 'Queries Yahoo Finance REST API to download stock pricing matrices.',
        input: 'Symbol ticker (Nifty 50), Start Date, End Date.',
        action: 'Downloads historical pricing vectors from public yfinance API endpoints.',
        output: 'Historical stock prices dataframe.',
        securityNote: 'Rate limits audit checking request limits.',
        businessView: {
          title: 'Market Pricing Download',
          description: 'Queries Yahoo Finance APIs to ingest daily closing index pricing logs.',
          metric: 'YFinance API Ingestion'
        },
        technicalView: {
          title: 'yfinance API Call Execution',
          description: 'Uses yfinance Python library download() method to retrieve pricing vectors.',
          metric: 'yf.download("^NSEI")'
        },
        recruiterView: {
          title: 'Live Market Data Ingestion',
          description: 'Downloads market closing prices directly from Yahoo Finance API streams.',
          metric: 'Yahoo Finance API Integration'
        }
      },
      {
        sequence: 3,
        nodeId: 'parquet',
        title: 'Compressed Price History Read',
        description: 'Pulls historical pricing logs from local Parquet files.',
        input: 'Parquet file path containing stock prices dataframe.',
        action: 'Loads price history logs into memory from binary Parquet data formats.',
        output: 'Historical prices dataframe in memory.',
        securityNote: 'Reads from local, read-only cached Parquet files.',
        businessView: {
          title: 'Cache Database Queries',
          description: 'Ingests cached price logs from Parquet, ensuring calculations load quickly.',
          metric: 'Parquet Database Read'
        },
        technicalView: {
          title: 'Parquet Data Read Execution',
          description: 'Executes pandas.read_parquet() to read stock returns.',
          metric: 'pd.read_parquet("nifty.parquet")'
        },
        recruiterView: {
          title: 'Optimized Data Storage',
          description: 'Reads cached index data using Parquet files, improving file load times.',
          metric: 'Parquet Local Cache'
        }
      },
      {
        sequence: 4,
        nodeId: 'hmm',
        title: 'Gaussian HMM Model Training',
        description: 'Trains the Gaussian Hidden Markov Model (HMM) on log-returns pricing arrays.',
        input: 'Clean pricing vector arrays.',
        action: 'Fits model parameters on hidden state transitions using Gaussian components.',
        output: 'Regime classification states list.',
        securityNote: 'Cleans inputs by removing null or infinite pricing values.',
        businessView: {
          title: 'Hidden Market Cycles Fit',
          description: 'Trains a scikit-learn HMM to classify market cycles (Quiet Bullish, Volatile Bearish).',
          metric: 'Gaussian HMM calculations'
        },
        technicalView: {
          title: 'Gaussian HMM Fitting Execution',
          description: 'Fits models using hmmlearn.GaussianHMM.fit() on computed log-returns matrices.',
          metric: 'hmm.fit(returns_matrix)'
        },
        recruiterView: {
          title: 'Machine Learning Market Classifier',
          description: 'Employs Hidden Markov Models to classify market cycles based on volatility indices.',
          metric: 'Gaussian HMM Pipeline'
        }
      },
      {
        sequence: 5,
        nodeId: 'backtester',
        title: 'NumPy Vectorized Backtester',
        description: 'Runs returns backtesting simulations comparing strategy performance to benchmark index returns.',
        input: 'Model regime classification states.',
        action: 'Simulates strategy returns using vectorized NumPy mathematical operations.',
        output: 'Backtesting performance vector logs.',
        securityNote: 'Uses vectorized math operations to protect data against override modifications.',
        businessView: {
          title: 'Strategy Performance Simulation',
          description: 'Backtests custom regime strategies to compare returns against benchmark indexes.',
          metric: 'Vectorized Backtester'
        },
        technicalView: {
          title: 'Vectorized Backtesting Execution',
          description: 'Calculates performance matrix shifts using vectorized NumPy log-returns calculations.',
          metric: 'np.exp(np.cumsum(strategy_returns))'
        },
        recruiterView: {
          title: 'Vectorized Backtesting Engine',
          description: 'Performs historical simulations using vectorized Python math pipelines.',
          metric: 'Vectorized NumPy Math'
        }
      },
      {
        sequence: 6,
        nodeId: 'metrics',
        title: 'Plotly Performance Charts Render',
        description: 'Generates Plotly charts plotting relative return and drawdown performance.',
        input: 'Performance return vector logs.',
        action: 'Compiles vectors array parameters and generates interactive charts.',
        output: 'Polished Plotly dashboard charts.',
        securityNote: 'Sanitizes interactive chart components before rendering in browser views.',
        businessView: {
          title: 'Dashboard Visualizations Output',
          description: 'Generates interactive charts plotting equity curves and maximum drawdowns.',
          metric: 'Plotly Dashboard graphs'
        },
        technicalView: {
          title: 'Plotly Chart Generation',
          description: 'Compiles charts using plotly.graph_objects, rendering performance lines.',
          metric: 'go.Figure().add_trace()'
        },
        recruiterView: {
          title: 'Polished Options Visualizations',
          description: 'Compiles interactive Plotly charts, outputting performance metrics.',
          metric: 'Interactive Plotly Plots'
        }
      }
    ]
  },
  {
    id: 'driedhub-marketplace',
    name: 'Driedhub Order Checkout Pipeline',
    description: 'Traces the secure checkout data flow on Driedhub: inventory validation checks, Razorpay payment processing, and transaction writes to Supabase.',
    accentColor: '#06b6d4', // Cyan
    projectSlug: 'driedhub-marketplace',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Basket Checkout Submission',
        description: 'Customer clicks check out on Driedhub marketplace shopping cart.',
        input: 'List of product ids, quantities, buyer details.',
        action: 'Saves items details state and triggers validation routines.',
        output: 'Structured cart details payload.',
        securityNote: 'Integer checks prevent negative quantities.',
        businessView: {
          title: 'Shopping Basket Submission',
          description: 'User submits item selections. Zustand tracks selected quantities to prevent order errors.',
          metric: 'User Input'
        },
        technicalView: {
          title: 'Cart State Assembly',
          description: 'Collects selected items from Zustand. Verifies checkout parameters array is populated.',
          metric: 'Zustand getCartItems()'
        },
        recruiterView: {
          title: 'Shopping Checkout Intake',
          description: 'Validates buyer details and selections client-side before checkout pipelines start.',
          metric: 'Zustand State Cart'
        }
      },
      {
        sequence: 2,
        nodeId: 'validation',
        title: 'Inventory Availability Check',
        description: 'API gateway verifies product prices and stock availability on backend servers.',
        input: 'Order details array.',
        action: 'Verifies stock availability and calculations matching pricing catalog entries.',
        output: 'Sanitized order details payload.',
        securityNote: 'Server-side stock checks to prevent fake pricing overrides.',
        businessView: {
          title: 'Database Inventory Check',
          description: 'Verifies product prices against master catalogs to prevent pricing anomalies.',
          metric: 'Server Audit Guard'
        },
        technicalView: {
          title: 'Server-Side Price Check',
          description: 'Queries database table to verify item prices, rejecting values if they differ from master list.',
          metric: 'verifyPriceMatching()'
        },
        recruiterView: {
          title: 'Server-Side Inventory Checks',
          description: 'Validates checkout data against inventory tables to protect system integrity.',
          metric: 'Data Protection Gate'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Checkout API Order Creation',
        description: 'Order route (/api/checkout) initializes transaction records.',
        input: 'Sanitized order details payload.',
        action: 'POST endpoint processes parameters and initializes payment sessions.',
        output: 'Razorpay order instance data.',
        securityNote: 'Encrypted API calls connecting to Razorpay dashboard.',
        businessView: {
          title: 'Order Generation',
          description: 'Generates order instance in background, preparing payment gateways.',
          metric: 'API Gateway Order Create'
        },
        technicalView: {
          title: 'API Order Generation',
          description: 'Initializes Razorpay order session. Receives signature token indicators.',
          metric: 'razorpay.orders.create()'
        },
        recruiterView: {
          title: 'Secure Payment Gateway API',
          description: 'Connects to Razorpay order APIs via backend server routes, keeping keys secure.',
          metric: 'Razorpay API Integration'
        }
      },
      {
        sequence: 4,
        nodeId: 'rzp',
        title: 'Razorpay Gateway Checkout',
        description: 'Spawns Razorpay payment gateway overlay for user payments.',
        input: 'Razorpay order details + buyer contact.',
        action: 'Renders Razorpay payment options and captures checkout transaction.',
        output: 'Razorpay payment ID + verification signature.',
        securityNote: 'Credit card inputs run on PCI-DSS compliant secure overlays.',
        businessView: {
          title: 'Secure Billing processing',
          description: 'User enters card or UPI details on secure Razorpay checkout overlays.',
          metric: 'Secure Card Payments'
        },
        technicalView: {
          title: 'Razorpay Overlay Render',
          description: 'Renders Razorpay client SDK checkout wizard. Receives callback signature.',
          metric: 'Razorpay.open() options'
        },
        recruiterView: {
          title: 'PCI-DSS Compliant Payments',
          description: 'Integrates Razorpay SDK checkout scripts to ensure secure payment processing.',
          metric: 'Razorpay Overlay SDK'
        }
      },
      {
        sequence: 5,
        nodeId: 'db',
        title: 'Database Order Save',
        description: 'Writes orders details and transaction signatures to Supabase PostgreSQL.',
        input: 'Razorpay signature details + order details.',
        action: 'Executes insert transaction to write orders records.',
        output: 'Database insert confirmation metrics.',
        securityNote: 'Supabase RLS constraints restrict writes to authenticated profiles.',
        businessView: {
          title: 'Order Ledger Write',
          description: 'Saves transactions details to database tables, updating inventory levels.',
          metric: 'PostgreSQL DB Write'
        },
        technicalView: {
          title: 'DB Order Insert',
          description: 'Triggers insert query into orders and billing tables, logging payment parameters.',
          metric: 'supabase.from("orders").insert()'
        },
        recruiterView: {
          title: 'Automatic Inventory Sync',
          description: 'Persists order data to Supabase database, updating product tables via RLS security.',
          metric: 'Transaction Persistent'
        }
      }
    ]
  },
  {
    id: 'outreachops-ai',
    name: 'AI Coldmail OutreachOps Pipeline',
    description: 'Traces the campaign generation lifecycle: loading leads, validation checks, Google Sheets integration, Gemini LLM text generation, database logging, and SMTP mail dispatch.',
    accentColor: '#d946ef', // Fuchsia
    projectSlug: 'outreachops-ai',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Campaign Leads Ingest',
        description: 'Outbound agent uploads a list of target companies and parameters keys.',
        input: 'Leads CSV spreadsheet / spreadsheet ID containing target data.',
        action: 'FastAPI task queues ingest leads and parse variables keys.',
        output: 'Structured array of raw target contacts records.',
        securityNote: 'Enforces length bounds on leads arrays to prevent server thread locks.',
        businessView: {
          title: 'Outbound Leads Intake',
          description: 'Sales team registers target contacts. System sanitizes data before model dispatch.',
          metric: 'Campaign Intake'
        },
        technicalView: {
          title: 'CSV Leads Parsing',
          description: 'Reads data payload rows and verifies mandatory columns (email, company) are populated.',
          metric: 'parseCSVRows()'
        },
        recruiterView: {
          title: 'Automated CRM Upload',
          description: 'Imports contacts and builds dynamic lead lists for AI synthesis.',
          metric: 'Automated Upload'
        }
      },
      {
        sequence: 2,
        nodeId: 'api',
        title: 'FastAPI Endpoint Dispatch',
        description: 'Triggers the AI generation pipeline via REST POST API endpoint `/api/v1/campaigns/run`.',
        input: 'Campaign ID parameter payload.',
        action: 'Routes request parameters to background tasks workers.',
        output: 'Async task execution queue confirmation.',
        securityNote: 'Endpoint protected by secure API Bearer tokens checking credentials.',
        businessView: {
          title: 'Pipeline Invocation',
          description: 'Sales manager triggers execution, spawning secure background jobs.',
          metric: 'FastAPI POST trigger'
        },
        technicalView: {
          title: 'FastAPI API Route Intake',
          description: 'Parses POST payloads, verifying bearer signatures before spawning Celery/async tasks.',
          metric: '/api/v1/campaigns/run'
        },
        recruiterView: {
          title: 'Asynchronous Processing',
          description: 'Fires generation routes running in the background, keeping dashboard pages responsive.',
          metric: 'FastAPI Backend Routing'
        }
      },
      {
        sequence: 3,
        nodeId: 'validation',
        title: 'Pydantic Server Validation',
        description: 'Server validates campaign parameters and leads formats using strict Pydantic schemas.',
        input: 'Raw inputs parameters object.',
        action: 'Parses properties, stripping unknown parameters and validating formats.',
        output: 'Sanitized parameters Pydantic instance.',
        securityNote: 'Server-side Pydantic checks to prevent command injection.',
        businessView: {
          title: 'Payload Validation Gate',
          description: 'Validates email formats and campaign templates, filtering anomalous inputs.',
          metric: 'Data Clean Check'
        },
        technicalView: {
          title: 'Pydantic Schema Parsing',
          description: 'Runs CampaignIntakeSchema.model_validate() verifying types, emails, and bounds.',
          metric: 'Pydantic validation'
        },
        recruiterView: {
          title: 'Server-Side Sanitization',
          description: 'Validates structural schema definitions before saving or generating text.',
          metric: 'Type-Safe Verification'
        }
      },
      {
        sequence: 4,
        nodeId: 'external',
        title: 'Google Sheets Integration',
        description: 'Pulls dynamic context metrics and leads spreadsheet data via Google API integration.',
        input: 'Spreadsheet ID parameters.',
        action: 'Fetches row data variables using gspread Python client libraries.',
        output: 'Clean variables mappings dictionary.',
        securityNote: 'Access authenticated using Google Cloud service account keys stored securely.',
        businessView: {
          title: 'Google Sheets Sync',
          description: 'Syncs dynamic variables directly from campaign sheets, preserving customized fields.',
          metric: 'Sheets Sync'
        },
        technicalView: {
          title: 'gspread API Calls',
          description: 'Queries spreadsheet cells and returns key-value data mappings in-memory.',
          metric: 'gspread client fetch'
        },
        recruiterView: {
          title: 'Dynamic Data Integrations',
          description: 'Uses gspread Google integration to sync contacts in real-time, matching team workflows.',
          metric: 'Google APIs Sync'
        }
      },
      {
        sequence: 5,
        nodeId: 'ai',
        title: 'Gemini LLM Text Generation',
        description: 'Invokes Google GenAI Gemini 1.5 Flash API to draft personalized cold outreach emails.',
        input: 'Contextualized prompt containing variables, values, and campaign instructions.',
        action: 'Google Gemini processes prompts and returns personalized text drafts.',
        output: 'Draft cold email drafts JSON object.',
        securityNote: 'LLM parameters configure temperature controls to prevent token-based prompt leaks.',
        businessView: {
          title: 'Personalized Email Generation',
          description: 'Generates custom cold emails tailored to lead details, improving replies rates.',
          metric: 'Gemini 1.5 Flash'
        },
        technicalView: {
          title: 'GenAI SDK Call',
          description: 'Executes generate_content() on model gemini-1.5-flash with temperature 0.2.',
          metric: 'generate_content()'
        },
        recruiterView: {
          title: 'Advanced AI Personalization',
          description: 'Connects to Gemini Flash models via Google SDKs, scaling cold outbound with 0 latency.',
          metric: 'Gemini SDK Integration'
        }
      },
      {
        sequence: 6,
        nodeId: 'db',
        title: 'Supabase Campaign Log Save',
        description: 'Writes generated email content draft parameters to Supabase campaign history tables.',
        input: 'Email drafts JSON + campaign metadata records.',
        action: 'Inserts records to Supabase tables representing historical logs.',
        output: 'Database write confirmation.',
        securityNote: 'Inserts secured behind Row Level Security constraints.',
        businessView: {
          title: 'Database Record Persistence',
          description: 'Persists drafts to historical logs, creating a verifiable audit trail of AI generations.',
          metric: 'Supabase Log'
        },
        technicalView: {
          title: 'Supabase SQL Insert',
          description: 'Executes insert query on outbound_campaigns_history database tables.',
          metric: 'supabase.insert()'
        },
        recruiterView: {
          title: 'Secure Generation Audits',
          description: 'Saves campaigns to Supabase PostgreSQL, keeping track of candidate progress.',
          metric: 'Database Auditing'
        }
      },
      {
        sequence: 7,
        nodeId: 'external',
        title: 'SMTP Gmail API Email Dispatch',
        description: 'Outbound pipeline dispatches completed emails to recipient leads via Gmail API/SMTP.',
        input: 'Final email body details + recipient addresses.',
        action: 'Sends outbound emails via SMTP channels.',
        output: 'Delivery confirmation ID.',
        securityNote: 'Outbound pipeline utilizes TLS encryption and authenticates using OAuth 2.0 signatures.',
        businessView: {
          title: 'Cold Email Delivery',
          description: 'Triggers outbound email delivery, reaching targets cleanly with high inbox scores.',
          metric: 'SMTP Dispatch'
        },
        technicalView: {
          title: 'Gmail API Send',
          description: 'Executes transporter.sendMail() via SMTP transport authenticated via secure token credentials.',
          metric: 'sendMail()'
        },
        recruiterView: {
          title: 'Automated Outbound Delivery',
          description: 'Automates delivery via SMTP triggers, delivering emails directly to candidate targets.',
          metric: 'SMTP Delivery'
        }
      }
    ]
  },
  {
    id: 'mspe-volatility-engine',
    name: 'MSPE Greeks & Volatility Surface Pipeline',
    description: 'Traces the computational flow of the options analysis engine: parameter collection, Python FastAPI transfer, Greeks calculations, GARCH historical volatility modelling, XGBoost projection, and Plotly 3D skew rendering.',
    accentColor: '#a855f7', // Purple/Violet
    projectSlug: 'mspe-volatility-engine',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Strike & Expiry Selection',
        description: 'User enters option strike lists, expiration timelines, and tickers targets.',
        input: 'Strike intervals list, expiries dates, ticker symbol (e.g. Nifty 50).',
        action: 'Frontend captures input inputs and bundles values into requests object.',
        output: 'Clean option parameters payload.',
        securityNote: 'Locks inputs values to prevent out-of-range strike values.',
        businessView: {
          title: 'Option Selection Parameters',
          description: 'Selects options strikes and parameters to model, establishing calculations bounds.',
          metric: 'User Input'
        },
        technicalView: {
          title: 'Parameters Packaging',
          description: 'Aggregates strikes and dates in React state, converting properties to API formats.',
          metric: 'React State update'
        },
        recruiterView: {
          title: 'Flexible Options Inputs',
          description: 'Configures strike ranges on the board, targeting custom calculations parameters.',
          metric: 'Interactive Inputs'
        }
      },
      {
        sequence: 2,
        nodeId: 'api',
        title: 'FastAPI Routing Gateway',
        description: 'Sends parameters requests to Python FastAPI pricing backend.',
        input: 'JSON request options payload.',
        action: 'Routes computation requests to highly optimized Python pricing loops.',
        output: 'Data array parameters mapped in-memory.',
        securityNote: 'SSL-encrypted endpoints prevent intercepting options transaction datasets.',
        businessView: {
          title: 'Backend Route Dispatch',
          description: 'Routes metrics calculations requests to Python processing modules.',
          metric: 'FastAPI Dispatch'
        },
        technicalView: {
          title: 'FastAPI POST Request',
          description: 'Sends query post request to FastAPI backend router at endpoint `/api/v1/pricing/compute`.',
          metric: 'FastAPI /compute'
        },
        recruiterView: {
          title: 'Decoupled Compute Servers',
          description: 'Fires queries to FastAPI pricing systems, offloading high-complexity calculations.',
          metric: 'FastAPI microservices'
        }
      },
      {
        sequence: 3,
        nodeId: 'math',
        title: 'NumPy Black-Scholes Greeks Compute',
        description: 'Pricing modules evaluate values against Black-Scholes equation arrays.',
        input: 'Strikes, spot price, risk-free rate, time-to-expiry arrays.',
        action: 'Solves Option Greeks equations using vectorized NumPy operations.',
        output: 'Computed Option Greeks matrix (Delta, Gamma, Vega, Theta).',
        securityNote: 'Vectorized arrays validation strips infinity entries and NaN parameters.',
        businessView: {
          title: 'Option Greeks Math Compute',
          description: 'Calculates Black-Scholes values (Delta, Gamma) to evaluate portfolio sensitivity.',
          metric: 'Black-Scholes Compute'
        },
        technicalView: {
          title: 'Vectorized NumPy compute',
          description: 'Solves Greeks formulas (Delta, Gamma) using vectorized NumPy calculations.',
          metric: 'numpy.exp() + scipy.stats'
        },
        recruiterView: {
          title: 'High-Performance Math Engine',
          description: 'Calculates Greeks using vectorized Python math pipelines for sub-millisecond pricing.',
          metric: 'Vectorized Math'
        }
      },
      {
        sequence: 4,
        nodeId: 'math',
        title: 'GARCH Historical Volatility Model Fit',
        description: 'Fits GARCH volatility model on historical log returns curves.',
        input: 'Asset close pricing log-returns vectors.',
        action: 'Trains GARCH model parameters to forecast variance clusters.',
        output: 'Forecasted historical volatility metrics.',
        securityNote: 'Inputs sanitized to verify timeline sequence gaps are filled.',
        businessView: {
          title: 'Volatility Clustering Analysis',
          description: 'Fits GARCH mathematical models on historical returns to trace volatility clustering.',
          metric: 'GARCH Volatility Fit'
        },
        technicalView: {
          title: 'GARCH model fit execution',
          description: 'Fits GARCH parameters utilizing arch library in Python, yielding covariance parameters.',
          metric: 'arch_model().fit()'
        },
        recruiterView: {
          title: 'Volatility Clustering Predictor',
          description: 'Employs GARCH mathematical models to capture volatility cluster variances.',
          metric: 'GARCH Time Series Model'
        }
      },
      {
        sequence: 5,
        nodeId: 'math',
        title: 'XGBoost Volatility Skew Projection',
        description: 'Runs XGBoost regressions to model implied volatility skew shifts.',
        input: 'Asset price returns + Greeks + historical volatility.',
        action: 'Invokes XGBoost regressor model predicting options surface spreads.',
        output: 'Predicted implied volatility skew arrays.',
        securityNote: 'Regression parameters bounds checked to prevent out-of-bounds volatility outputs.',
        businessView: {
          title: 'Machine Learning Skew Predict',
          description: 'Invokes machine learning models to forecast options skew surfaces.',
          metric: 'XGBoost Regressor'
        },
        technicalView: {
          title: 'XGBoost model projection execution',
          description: 'Executes xgboost.predict() on computed input feature matrices.',
          metric: 'xgb_model.predict()'
        },
        recruiterView: {
          title: 'Machine Learning Volatility Predictor',
          description: 'Employs XGBoost regression pipelines to forecast options surface shapes.',
          metric: 'XGBoost Regressor pipeline'
        }
      },
      {
        sequence: 6,
        nodeId: 'ui',
        title: 'Plotly 3D Volatility Mesh Render',
        description: 'Generates interactive 3D option implied volatility skew surface grids.',
        input: 'Options strikes + expiries + predicted implied volatilities matrix.',
        action: 'Plotly.js processes matrices and renders interactive 3D grids.',
        output: 'Rendered interactive 3D volatility surface mesh.',
        securityNote: 'Enforces rendering size bounds to prevent browser viewport crash logs.',
        businessView: {
          title: 'Interactive 3D Visualizations',
          description: 'Displays 3D volatility surface mesh grids, highlighting skew anomalies.',
          metric: 'Plotly 3D Mesh'
        },
        technicalView: {
          title: 'Plotly 3D Mesh Generation',
          description: 'Compiles coordinates data grids and plots surfaces using Plotly 3D chart modules.',
          metric: 'Plotly.react(mesh_data)'
        },
        recruiterView: {
          title: 'Premium 3D Visualizations',
          description: 'Generates interactive 3D options surfaces, providing stunning market visualizations.',
          metric: 'Plotly.js 3D Charts'
        }
      }
    ]
  },
  {
    id: 'btc-algo-trading',
    name: 'BTC-ALGO Signals Board Pipeline',
    description: 'Traces the Bitcoin algorithmic trading pipeline: refresh trigger, public exchange candle data fetch, Pandas technical indicators calculation, trading signal engine evaluation, and Plotly chart updates.',
    accentColor: '#f59e0b', // Gold / Amber
    projectSlug: 'btc-algo-trading',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Autorefresh Trigger Action',
        description: 'Streamlit dashboard triggers autorefresh polling intervals.',
        input: 'Autorefresh timer config parameters (e.g. refresh every 10s).',
        action: 'Autorefresh script triggers Streamlit page updates.',
        output: 'Refresh trigger event.',
        securityNote: 'Locks polling rate to prevent IP ban warnings on API routes.',
        businessView: {
          title: 'Live Board Refresh',
          description: 'Dashboard triggers updates automatically to capture recent price ticks.',
          metric: 'Streamlit Autorefresh'
        },
        technicalView: {
          title: 'Autorefresh Polling',
          description: 'Executes streamlit_autorefresh logic to trigger app script reruns.',
          metric: 'st_autorefresh()'
        },
        recruiterView: {
          title: 'Real-Time Update Polling',
          description: 'Polls price updates on schedule, maintaining recent signals views.',
          metric: 'Autorefresh polling'
        }
      },
      {
        sequence: 2,
        nodeId: 'external',
        title: 'Exchange Market Data Ingest',
        description: 'Requests Bitcoin price candlestick matrices from public crypto exchanges.',
        input: 'API URL parameters (symbol: BTCUSDT, interval: 1h).',
        action: 'Fetches recent candle records using HTTP requests library.',
        output: 'Raw asset candlestick dataframe.',
        securityNote: 'Connection timeout loops prevent script hangs on connection failures.',
        businessView: {
          title: 'Candlestick Data Ingest',
          description: 'Downloads price updates directly from cryptocurrency exchange systems.',
          metric: 'Exchange API Ingest'
        },
        technicalView: {
          title: 'Exchange API GET request',
          description: 'Executes python requests.get() fetching OHLCV candle lists.',
          metric: 'requests.get(api_url)'
        },
        recruiterView: {
          title: 'Live Market Data Ingestion',
          description: 'Downloads price candlesticks directly from exchange API routes.',
          metric: 'REST API Ingestion'
        }
      },
      {
        sequence: 3,
        nodeId: 'validation',
        title: 'Data Clean & Preprocessing',
        description: 'Pandas loads price data and validates records integrity.',
        input: 'Raw candle records dataframe.',
        action: 'Strips null values and formats timestamps structure.',
        output: 'Cleaned pricing returns dataframe in-memory.',
        securityNote: 'Sanitizes indices logs to prevent index errors in math computations.',
        businessView: {
          title: 'Pricing Data Cleaning',
          description: 'Preprocesses index ticks, aligning dates formats and handling missing values.',
          metric: 'Data Clean Gate'
        },
        technicalView: {
          title: 'Pandas Data Cleansing',
          description: 'Executes dropna() and astype() algorithms, aligning time-series coordinates.',
          metric: 'df.dropna().copy()'
        },
        recruiterView: {
          title: 'Robust Time Series Cleaning',
          description: 'Applies preprocessing pipelines to sanitize datasets prior to calculation steps.',
          metric: 'Pandas Data Clean'
        }
      },
      {
        sequence: 4,
        nodeId: 'math',
        title: 'Pandas Technical Indicators Compute',
        description: 'Calculates technical indicators matrices using Pandas computational loops.',
        input: 'Clean pricing returns dataframe.',
        action: 'Computes SMA, EMA, and drawdown curves matrices.',
        output: 'Calculated indicators series lists.',
        securityNote: 'Vectorized series processing prevents data mutation vulnerabilities.',
        businessView: {
          title: 'Technical Indicators Compute',
          description: 'Calculates trend indicators (EMA crossovers) to track price movements.',
          metric: 'Indicators Compute'
        },
        technicalView: {
          title: 'Vectorized Indicators compute',
          description: 'Calculates SMA/EMA series using vectorized Pandas mathematical algorithms.',
          metric: 'df["EMA"] = df["close"].ewm().mean()'
        },
        recruiterView: {
          title: 'Vectorized Indicators Engine',
          description: 'Performs indicators math using vectorized Pandas logic, lowering latency.',
          metric: 'Vectorized Pandas compute'
        }
      },
      {
        sequence: 5,
        nodeId: 'math',
        title: 'Trading Signal Engine Evaluation',
        description: 'Evaluates indicators to generate buy, sell, or hold signal triggers.',
        input: 'Calculated SMA/EMA indicators + price vectors.',
        action: 'Evaluates crossover logic triggers to determine current asset signal status.',
        output: 'Active signal status index (Buy/Sell/Hold).',
        securityNote: 'Hardcoded signal boundaries prevent unauthorized signal overriding.',
        businessView: {
          title: 'Signal Engine Evaluation',
          description: 'Evaluates momentum crossovers, outputting current trade alerts (Buy/Hold).',
          metric: 'Signals Board Alerts'
        },
        technicalView: {
          title: 'Signal Generation Logic',
          description: 'Applies crossover check: if short EMA exceeds long EMA, signals = Buy; else Hold.',
          metric: 'calculateEMA_Crossover()'
        },
        recruiterView: {
          title: 'Algorithmic Signal Generator',
          description: 'Evaluates trend rules, outputting active buy, sell, or hold signal indicators.',
          metric: 'Rule-Based Engine'
        }
      },
      {
        sequence: 6,
        nodeId: 'ui',
        title: 'Plotly Performance Charts Render',
        description: 'Generates Plotly chart displays mapping performance growth and drawdowns.',
        input: 'Indicators lists + price data vectors.',
        action: 'Generates interactive Plotly lines charting historical indicators levels.',
        output: 'Plotly interactive charts rendering.',
        securityNote: 'Chart inputs sanitized to block HTML injection threats.',
        businessView: {
          title: 'Performance Chart Updates',
          description: 'Generates interactive charts of indicator curves and drawdowns.',
          metric: 'Plotly Performance plots'
        },
        technicalView: {
          title: 'Plotly chart compilation',
          description: 'Compiles charts using plotly.graph_objects, adding pricing and indicator traces.',
          metric: 'go.Figure().add_trace()'
        },
        recruiterView: {
          title: 'Interactive Options Plotting',
          description: 'Compiles interactive Plotly charts, outputting clean signals plots.',
          metric: 'Plotly.js Chart overlays'
        }
      }
    ]
  },
  {
    id: 'driedhub-admin-dashboard',
    name: 'Driedhub Admin ERP Workflow',
    description: 'Traces how administrative inventory modifications are session-checked, routed via API endpoints, and committed to the Supabase database.',
    accentColor: '#ec4899', // Pink/Rose
    projectSlug: 'driedhub-admin-dashboard',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Admin Stock Update',
        description: 'Administrator adjusts stock levels or catalog pricing details on the inventory control panel.',
        input: 'Product ID, New Stock Count, Price Adjustment.',
        action: 'Admin Panel inputs captured and bundled into request body.',
        output: 'Sanitized update payload.',
        securityNote: 'Strict client-side input validation to reject negative values.',
        businessView: {
          title: 'Admin Interface Intake',
          description: 'Store manager edits catalog data. Immediate validation prevents pricing entry errors.',
          metric: 'User Update'
        },
        technicalView: {
          title: 'Client Form Intake',
          description: 'Collects fields using local react-hook-form bindings.',
          metric: 'handleSubmit()'
        },
        recruiterView: {
          title: 'Admin Controls Interface',
          description: 'Enables catalog updates to streamline store logistics.',
          metric: 'ERP Console'
        }
      },
      {
        sequence: 2,
        nodeId: 'auth',
        title: 'Service Role Session Guard',
        description: 'Validates admin session scopes and credentials before routing the request.',
        input: 'Request cookies and authorization headers.',
        action: 'Decrypts session headers and verifies administrative permissions.',
        output: 'Authorized session scopes details.',
        securityNote: 'Enforces strict cookie validation and token check rules.',
        businessView: {
          title: 'Access Control Gate',
          description: 'Ensures only authenticated admin users can modify catalog records.',
          metric: 'Session Check'
        },
        technicalView: {
          title: 'Supabase Session Verify',
          description: 'Decrypts JWT token to check user role permissions.',
          metric: 'supabase.auth.getSession()'
        },
        recruiterView: {
          title: 'Role-Based Auth Guard',
          description: 'Protects backend operations behind secure user access validations.',
          metric: 'Role Protection'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Inventory Route Handler',
        description: 'Processes the incoming update request on the Next.js API server.',
        input: 'Admin update payload object.',
        action: 'Server routes request to endpoint handler and validates payload structures using Zod schemas.',
        output: 'Sanitized database write parameters.',
        securityNote: 'Server-side validation checks block malformed data payloads.',
        businessView: {
          title: 'API Payload Audits',
          description: 'API router processes values, verifying data formatting criteria.',
          metric: 'API Handlers'
        },
        technicalView: {
          title: 'Zod Payload Parsing',
          description: 'Executes z.object().safeParse() verification steps.',
          metric: 'zodSchema.safeParse()'
        },
        recruiterView: {
          title: 'API Gateway Sanitization',
          description: 'Uses server-side schema validations to guarantee data integrity.',
          metric: 'Next.js API'
        }
      },
      {
        sequence: 4,
        nodeId: 'db',
        title: 'PostgreSQL Database Commit',
        description: 'Commits data updates to the Supabase database.',
        input: 'Sanitized catalog update values.',
        action: 'Executes updates transaction to flush stock details to PostgreSQL database.',
        output: 'Database write confirmation logs.',
        securityNote: 'Row Level Security policies prevent unauthorized write queries.',
        businessView: {
          title: 'Database Updates',
          description: 'Saves adjustments to PostgreSQL database instances.',
          metric: 'Supabase Write'
        },
        technicalView: {
          title: 'Supabase DB Write',
          description: 'Triggers database update request on the products table.',
          metric: 'supabase.from().update()'
        },
        recruiterView: {
          title: 'Secure Database Commit',
          description: 'Executes relational transactions on the backend database.',
          metric: 'Supabase DB'
        }
      }
    ]
  },
  {
    id: 'marea-website',
    name: 'Marea Checkout Integration Pipeline',
    description: 'Traces how customer cart selections are processed through Next.js endpoints, Stripe checkout redirects, and Supabase order transactions.',
    accentColor: '#a855f7', // Purple
    projectSlug: 'marea-website',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Select Collection Item',
        description: 'Customer browses the luxury apparel catalog and adds selected items to the shopping cart.',
        input: 'Product Slug, Size Selection, Quantity.',
        action: 'Zustand store updates current checkout selections list.',
        output: 'Updated customer shopping cart array.',
        securityNote: 'Sanitizes inputs before committing state to prevent local state corruption.',
        businessView: {
          title: 'Shopping Cart Selection',
          description: 'Buyer selects luxury products. Clean state management reduces cart abandonment.',
          metric: 'Cart Update'
        },
        technicalView: {
          title: 'Zustand Cart Actions',
          description: 'Updates cart selections array in Zustand store state.',
          metric: 'addItemToCart()'
        },
        recruiterView: {
          title: 'Immersive Catalog Shopping',
          description: 'Tracks client-side items selections instantly without network delay.',
          metric: 'Client State'
        }
      },
      {
        sequence: 2,
        nodeId: 'cms',
        title: 'TipTap Content Hydration',
        description: 'Hydrates custom rich text styling layouts and description elements for products.',
        input: 'Serialized product content string.',
        action: 'TipTap parser converts description details to HTML blocks.',
        output: 'Sanitized HTML layout arrays.',
        securityNote: 'Runs HTML sanitization layers using DOMPurify.sanitize().',
        businessView: {
          title: 'Description Hydration',
          description: 'Displays rich layouts, product details, and sizing instructions.',
          metric: 'Content Render'
        },
        technicalView: {
          title: 'DOMPurify HTML Sanitizer',
          description: 'Parses database content and sanitizes script tags to block XSS threats.',
          metric: 'DOMPurify.sanitize()'
        },
        recruiterView: {
          title: 'Sanitized Editorial Display',
          description: 'Renders dynamic rich text documentation with full security audits.',
          metric: 'TipTap Engine'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Checkout Session Initialization',
        description: 'Next.js server initializes standard Stripe billing redirects.',
        input: 'Cart items list and customer details.',
        action: 'API route computes order pricing levels and requests Stripe session parameters.',
        output: 'Stripe session redirect URL.',
        securityNote: 'Price variables verified against database records to prevent pricing bypass.',
        businessView: {
          title: 'Session Creation',
          description: 'Computes net cost parameters and initiates Stripe gateways.',
          metric: 'Session Build'
        },
        technicalView: {
          title: 'Stripe Session Create',
          description: 'POST handler contacts Stripe API and returns redirect parameters.',
          metric: 'stripe.checkout.sessions.create()'
        },
        recruiterView: {
          title: 'Gateway Integration API',
          description: 'Triggers secure third-party checkout flows with server-side audits.',
          metric: 'Checkout POST'
        }
      },
      {
        sequence: 4,
        nodeId: 'stripe',
        title: 'Stripe Payment Verification',
        description: 'Stripe processes customer card credentials and routes webhook transactions.',
        input: 'Card details and Stripe session tokens.',
        action: 'Stripe processes transactions and dispatches event signature headers to webhook endpoints.',
        output: 'Payment verification webhook payload.',
        securityNote: 'Uses cryptographic signature header checks to verify Stripe identity.',
        businessView: {
          title: 'Card Processing Gate',
          description: 'Customer completes secure payment. Webhooks trigger backend alerts.',
          metric: 'Stripe Checkout'
        },
        technicalView: {
          title: 'Stripe Webhook Listen',
          description: 'API route listens for checkout.session.completed event signatures.',
          metric: 'stripe.webhooks.constructEvent()'
        },
        recruiterView: {
          title: 'Webhook Verification Gate',
          description: 'Listens for Stripe signatures to confirm successful transactions.',
          metric: 'Cryptographic Auth'
        }
      },
      {
        sequence: 5,
        nodeId: 'db',
        title: 'Order Invoice Logging',
        description: 'Supabase logs customer invoice details and updates inventory records.',
        input: 'Verified Stripe webhook transaction.',
        action: 'Inserts order registry items and triggers stock updates.',
        output: 'Database write indicators.',
        securityNote: 'Row Level Security verifies webhook origin parameters.',
        businessView: {
          title: 'Invoice Registry Log',
          description: 'Saves invoice records and reduces inventory count metrics.',
          metric: 'Inventory Sync'
        },
        technicalView: {
          title: 'Supabase Invoice Insert',
          description: 'Executes inserts query on orders and inventory database tables.',
          metric: 'supabase.from("orders").insert()'
        },
        recruiterView: {
          title: 'Asynchronous DB Storage',
          description: 'Logs payment confirmations, completing the DTC sales lifecycle.',
          metric: 'Relational Update'
        }
      }
    ]
  },
  {
    id: 'marea-admin-dashboard',
    name: 'Marea Showcase Reordering Workflow',
    description: 'Traces how custom home product layouts are rearranged with drag-and-drop actions, authenticated, and updated in database records.',
    accentColor: '#a855f7', // Purple
    projectSlug: 'marea-admin-dashboard',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Drag catalog Item',
        description: 'Store operator drag-reorders homepage fashion catalog categories on the workspace.',
        input: 'Active list items, Drag coordinates, Sort order index.',
        action: 'dnd-kit hooks calculate item swaps indices.',
        output: 'Updated list arrangement array.',
        securityNote: 'Coordinate checks prevent out-of-bounds array operations.',
        businessView: {
          title: 'Catalog Arrangement',
          description: 'Manager updates homepage layout. Swaps occur visually on grid boxes.',
          metric: 'Layout Order'
        },
        technicalView: {
          title: 'dnd-kit Sensors',
          description: 'Swaps items positions locally inside component state.',
          metric: 'onDragEnd()'
        },
        recruiterView: {
          title: 'Drag-and-Drop Operations',
          description: 'Provides visual reordering tools to manage homepage content.',
          metric: 'dnd-kit Sort'
        }
      },
      {
        sequence: 2,
        nodeId: 'auth',
        title: 'Access Scope Check',
        description: 'Supabase checks session tokens before routing order mutations.',
        input: 'Authentication session headers.',
        action: 'Verifies session token is active and checks roles permissions.',
        output: 'Authorized user session data.',
        securityNote: 'Restricts write mutations to administrators only.',
        businessView: {
          title: 'Admin Credentials Check',
          description: 'Ensures only store operators can override design orders.',
          metric: 'Access Check'
        },
        technicalView: {
          title: 'Auth Context Check',
          description: 'Decrypts JWT token to check user role permissions.',
          metric: 'supabase.auth.getSession()'
        },
        recruiterView: {
          title: 'Secure Admin Guard',
          description: 'Protects content updates behind JWT authentication checks.',
          metric: 'Session Security'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Layout Sync Request',
        description: 'Admin API endpoint receives rearranged catalog IDs list.',
        input: 'Array of item IDs in new order.',
        action: 'POST endpoint processes array and structures batch updates payload.',
        output: 'Batch update parameters.',
        securityNote: 'Zod verifies array contents are valid UUID strings.',
        businessView: {
          title: 'Batch Request Build',
          description: 'API routes compile reordering list, verifying schema parameters.',
          metric: 'Request Sync'
        },
        technicalView: {
          title: 'Zod Array Validation',
          description: 'Validates UUID items list before dispatching db queries.',
          metric: 'z.array(z.string().uuid())'
        },
        recruiterView: {
          title: 'Structured Array Validator',
          description: 'Validates inputs using strict schemas, preventing injection inputs.',
          metric: 'API Post'
        }
      },
      {
        sequence: 4,
        nodeId: 'db',
        title: 'Batch Sort Write',
        description: 'Updates sort columns in the collections table.',
        input: 'Batch reordered items IDs.',
        action: 'Invokes database RPC function to synchronize all sorting values in a single transaction.',
        output: 'Database update indicators.',
        securityNote: 'Batch updates run inside single database transactions.',
        businessView: {
          title: 'Database Catalog Update',
          description: 'Saves new sequence layout directly, updating frontend grids.',
          metric: 'Batch Transaction'
        },
        technicalView: {
          title: 'Supabase RPC Execute',
          description: 'Calls custom Postgres function to batch update sort columns.',
          metric: 'supabase.rpc("update_sort_order")'
        },
        recruiterView: {
          title: 'Transaction Batch Update',
          description: 'Invokes PostgreSQL RPC functions, optimizing database performance.',
          metric: 'PostgreSQL RPC'
        }
      }
    ]
  },
  {
    id: 'surendra-bus-body',
    name: 'Surendra Fleet Inquiry Pipeline',
    description: 'Traces how client fleet requirements are validated, formatted, and routed to sales mailboxes using Nodemailer.',
    accentColor: '#3b82f6', // Blue
    projectSlug: 'surendra-bus-body',
    steps: [
      {
        sequence: 1,
        nodeId: 'user',
        title: 'Submit Inquiry Form',
        description: 'Fleet buyer fills out the customized bus body configuration checklist form.',
        input: 'Customer Name, Email Address, Chassis Details, Seating Option.',
        action: 'Form capture captures user options settings.',
        output: 'Raw inputs parameters object.',
        securityNote: 'Client-side inputs filters reject script tags.',
        businessView: {
          title: 'Inquiry Capture',
          description: 'Client configures bus chassis options, submitting fleet detail cards.',
          metric: 'Inquiry Capture'
        },
        technicalView: {
          title: 'Form Data Capture',
          description: 'Tracks field properties using react-hook-form bindings.',
          metric: 'register()'
        },
        recruiterView: {
          title: 'Fleet Options Intake',
          description: 'Provides responsive configuration checklists, capturing details.',
          metric: 'Client Form'
        }
      },
      {
        sequence: 2,
        nodeId: 'validation',
        title: 'Client Schema check',
        description: 'Validates inputs formats using React Hook Form resolver checks.',
        input: 'Raw form configuration parameters.',
        action: 'Parses fields, verifying contact formats and selections.',
        output: 'Validated data inputs payload.',
        securityNote: 'Zod checks reject negative values or malformed parameters.',
        businessView: {
          title: 'Inputs Format Check',
          description: 'Validates that contact emails and numbers match required standards.',
          metric: 'Inputs Validate'
        },
        technicalView: {
          title: 'Zod Validation Parse',
          description: 'Resolves schemas logic to block incorrect entry layouts.',
          metric: 'resolver: zodResolver()'
        },
        recruiterView: {
          title: 'Typesafe Form Verifier',
          description: 'Checks field structures before sending requests to routes.',
          metric: 'Zod Schema Check'
        }
      },
      {
        sequence: 3,
        nodeId: 'api',
        title: 'Nodemailer Route Handler',
        description: 'Next.js route builds HTML email templates and triggers SMTP dispatches.',
        input: 'Sanitized inquiry details.',
        action: 'POST endpoint processes payload and configures SMTP nodemailer mail settings.',
        output: 'Nodemailer send confirmation status.',
        securityNote: 'Honeypot form fields block automated spam submissions.',
        businessView: {
          title: 'Mailing Template Build',
          description: 'Generates branded HTML email templates showing customer specifications.',
          metric: 'API Processing'
        },
        technicalView: {
          title: 'SMTP Mail Configuration',
          description: 'Compiles Nodemailer options, sending mail via SMTP transports.',
          metric: 'transporter.sendMail()'
        },
        recruiterView: {
          title: 'Server Mail Forwarder',
          description: 'Server routes form entries to Nodemailer transports dynamically.',
          metric: 'Nodemailer API'
        }
      },
      {
        sequence: 4,
        nodeId: 'mail',
        title: 'Deliver Lead Alert',
        description: 'Sends automated fleet details to the company inbox.',
        input: 'HTML email alert showpage.',
        action: 'Company mail server logs receipt of lead update notification.',
        output: 'Delivery confirmation log.',
        securityNote: 'TLS encryption secures email delivery routes.',
        businessView: {
          title: 'Lead Notification Alert',
          description: 'Sales representatives receive structured customer lead cards.',
          metric: 'Inbox Deliver'
        },
        technicalView: {
          title: 'SMTP Receipt Check',
          description: 'Verifies email delivery, completing request pipeline loops.',
          metric: 'Delivery success'
        },
        recruiterView: {
          title: 'Automated Lead Alerting',
          description: 'Sends client specifications directly to sales representatives.',
          metric: 'Inbox Receipt'
        }
      }
    ]
  }
];

