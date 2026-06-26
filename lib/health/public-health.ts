export interface HealthModule {
  id: string;
  name: string;
  status: "Online" | "Protected" | "Synced" | "Available" | "Private" | "Demo";
  lastChecked: string;
  description: string;
  href: string;
  accent: "cyan" | "emerald" | "amber" | "violet" | "rose" | "blue";
  category: "App" | "Data" | "AI" | "Security" | "External";
  dependencies: string[];
  iconName: "Monitor" | "Database" | "Sparkles" | "Github" | "Mail" | "LayoutDashboard" | "Globe" | "Lock";
}

export const HEALTH_MODULES: HealthModule[] = [
  {
    id: "app",
    name: "Portfolio App",
    status: "Online",
    lastChecked: "Just now",
    description: "Production Next.js application running on serverless Vercel edge nodes.",
    href: "/",
    accent: "cyan",
    category: "App",
    dependencies: ["supabase", "auth"],
    iconName: "Monitor"
  },
  {
    id: "supabase",
    name: "Supabase DB",
    status: "Protected",
    lastChecked: "1m ago",
    description: "Cloud PostgreSQL database hosting event telemetry and chat logs.",
    href: "/dashboard",
    accent: "emerald",
    category: "Data",
    dependencies: ["auth"],
    iconName: "Database"
  },
  {
    id: "ai",
    name: "AI Assistant",
    status: "Online",
    lastChecked: "Just now",
    description: "Gemini client-side stream coordinator processing system context.",
    href: "/ask-vraj",
    accent: "rose",
    category: "AI",
    dependencies: ["supabase"],
    iconName: "Sparkles"
  },
  {
    id: "github",
    name: "GitHub Sync",
    status: "Synced",
    lastChecked: "10m ago",
    description: "Continuous integration sync logging recent repository commit histories.",
    href: "/dashboard",
    accent: "blue",
    category: "External",
    dependencies: [],
    iconName: "Github"
  },
  {
    id: "contact",
    name: "Contact Form",
    status: "Available",
    lastChecked: "3m ago",
    description: "Mail dispatcher pipelines routing B2B inquiries via Resend webhooks.",
    href: "/contact",
    accent: "amber",
    category: "App",
    dependencies: ["supabase"],
    iconName: "Mail"
  },
  {
    id: "dashboard",
    name: "Observability HUD",
    status: "Online",
    lastChecked: "Just now",
    description: "Public reporting metrics dashboard displaying aggregated visitor analytics.",
    href: "/dashboard",
    accent: "cyan",
    category: "App",
    dependencies: ["supabase"],
    iconName: "LayoutDashboard"
  },
  {
    id: "seo",
    name: "SEO Sitemap",
    status: "Available",
    lastChecked: "1h ago",
    description: "Dynamic XML sitemap indexing layout routes for Google crawl bots.",
    href: "/sitemap.xml",
    accent: "emerald",
    category: "External",
    dependencies: [],
    iconName: "Globe"
  },
  {
    id: "auth",
    name: "Auth Gateways",
    status: "Protected",
    lastChecked: "Just now",
    description: "NextAuth credential gate securing administrative telemetry registers.",
    href: "/login",
    accent: "violet",
    category: "Security",
    dependencies: [],
    iconName: "Lock"
  }
];
