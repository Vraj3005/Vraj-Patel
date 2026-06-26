import { projects as canonicalProjects } from "@/lib/data/projects";

export interface ProjectNode {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  technologies: string[];
  x: number;
  y: number;
  featured?: boolean;
  liveUrl?: string;
  gitHubUrl?: string;
  metrics?: { label: string; value: string }[];
  problem?: string;
  solution?: string;
}

export interface ProjectLink {
  source: string; // slug of source
  target: string; // slug of target
}

// 1. Definition of ConstructionOS stub project since it's not in the main database
const constructionOSStub: ProjectNode = {
  slug: "constructionos",
  title: "ConstructionOS ERP",
  category: "erp_system",
  shortDescription: "Enterprise resource planning concept for interior & construction contractors, tracking material requisitions and job-site schedules.",
  description: "A comprehensive construction ERP concept centered around job site planning, purchase orders automation, real-time wood and hardware inventory reconciliation, and worker shift scheduling dashboards.",
  technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Drizzle ORM", "Supabase"],
  x: 52,
  y: 55,
  featured: true,
  metrics: [
    { label: "Inventory Checks", value: "Real-time" },
    { label: "Scheduling Board", value: "Interactive" },
    { label: "BOM Generation", value: "Automated" }
  ],
  problem: "Contractors manually track steel, lumber, and hardware inventory across different active sites, creating supply coordination delays and billing inaccuracies.",
  solution: "Designed a system layout that consolidates materials catalog rates, site supervisor requisitions, and vendor payment flows into a unified admin interface.",
  liveUrl: "#",
};

// 2. Map coordinates (X, Y in range [0, 100]) for each canonical project
const NODE_COORDINATES: Record<string, { x: number; y: number }> = {
  "outreachops-ai": { x: 15, y: 25 },
  "ask-vraj": { x: 32, y: 12 },
  "enermass-solar-calculator": { x: 32, y: 45 },
  "bhagwati-interior-erp": { x: 48, y: 32 },
  "constructionos": { x: 52, y: 55 }, // Coordinates defined above
  "surendra-bus-body": { x: 82, y: 15 },
  "marea-website": { x: 70, y: 32 },
  "driedhub-marketplace": { x: 88, y: 40 },
  "marea-admin-dashboard": { x: 68, y: 78 },
  "driedhub-admin-dashboard": { x: 85, y: 72 },
  "mspe-volatility-engine": { x: 12, y: 70 },
  "nf-lrd-regime-discovery": { x: 32, y: 80 },
  "btc-algo-trading": { x: 14, y: 88 }
};

// Assemble complete projects node list
export const getProjectNodes = (): ProjectNode[] => {
  const nodes: ProjectNode[] = [];
  
  // Add canonical projects with coordinates mapping
  canonicalProjects.forEach((proj) => {
    const coords = NODE_COORDINATES[proj.slug];
    if (coords) {
      nodes.push({
        ...proj,
        x: coords.x,
        y: coords.y,
        gitHubUrl: proj.slug === "outreachops-ai" || proj.slug === "mspe-volatility-engine" || proj.slug === "nf-lrd-regime-discovery" || proj.slug === "btc-algo-trading"
          ? "https://github.com/Vraj3005"
          : undefined
      });
    }
  });

  // Add ConstructionOS stub if not already present
  if (!nodes.some((n) => n.slug === "constructionos")) {
    nodes.push(constructionOSStub);
  }

  return nodes;
};

// 3. Define links (relationships) between nodes
export const projectLinks: ProjectLink[] = [
  // AI Node group
  { source: "outreachops-ai", target: "ask-vraj" },
  { source: "outreachops-ai", target: "enermass-solar-calculator" },
  
  // ERP Node group
  { source: "enermass-solar-calculator", target: "bhagwati-interior-erp" },
  { source: "bhagwati-interior-erp", target: "constructionos" },
  { source: "enermass-solar-calculator", target: "constructionos" },

  // E-commerce/Websites group
  { source: "surendra-bus-body", target: "marea-website" },
  { source: "marea-website", target: "driedhub-marketplace" },

  // Dashboards group
  { source: "marea-website", target: "marea-admin-dashboard" },
  { source: "driedhub-marketplace", target: "driedhub-admin-dashboard" },
  { source: "marea-admin-dashboard", target: "driedhub-admin-dashboard" },
  { source: "marea-admin-dashboard", target: "bhagwati-interior-erp" },
  { source: "marea-admin-dashboard", target: "constructionos" },

  // Quant Node group
  { source: "mspe-volatility-engine", target: "nf-lrd-regime-discovery" },
  { source: "nf-lrd-regime-discovery", target: "btc-algo-trading" },
  { source: "btc-algo-trading", target: "mspe-volatility-engine" },
];
export type ProjectCategoryFilter =
  | "all"
  | "client_software"
  | "erp_system"
  | "ai_automation"
  | "quant_research"
  | "dashboard"
  | "website";

// Map filter value in UI to data categories
export const isNodeInCategory = (nodeCategory: string, filter: string): boolean => {
  if (filter === "all") return true;
  if (filter === "client_software") {
    return nodeCategory === "client_software" || nodeCategory === "ecommerce";
  }
  return nodeCategory === filter;
};
