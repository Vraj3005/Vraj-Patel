import { projects } from '@/lib/data/projects';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
  children: React.ReactNode;
}

const SPECIFIC_METADATA: Record<string, { title: string; description: string }> = {
  'outreachops-ai': {
    title: 'OutreachOps AI | Gemini Cold Email Automation by Vraj Patel',
    description: 'OutreachOps AI is Vraj Patel’s AI automation project using Google GenAI SDK, Gmail OAuth API, and Google Sheets API to generate personalized outreach drafts and manage outbound workflows.',
  },
  'solar-sizing-calculator': {
    title: 'Solar Sizing Calculator & ERP | Vraj Patel Portfolio',
    description: 'A solar quotation calculator and ERP-style workflow system by Vraj Patel for managing customer requirements, pricing logic, subsidy calculations, and project workflows.',
  },
  'interior-design-erp': {
    title: 'Interior Design ERP | Vraj Patel Portfolio',
    description: 'A custom enterprise planning system built by Vraj Patel for interior design operations, managing material catalogs, client boards, and estimates.',
  },
  'anjeer-marketplace': {
    title: 'Afghan Anjeer Marketplace | Vraj Patel Portfolio',
    description: 'A direct-to-consumer e-commerce storefront designed by Vraj Patel for healthy food retail, integrated with Razorpay checkout overlays.',
  },
  'anjeer-admin-dashboard': {
    title: 'Anjeer Admin Dashboard | Vraj Patel Portfolio',
    description: 'An internal backoffice ERP dashboard designed by Vraj Patel for tracking sales logs, inventory balances, and order fulfillment states.',
  },
  'clothing-brand-website': {
    title: 'Clothing Brand Storefront | Vraj Patel Portfolio',
    description: 'A high-fidelity editorial luxury fashion storefront by Vraj Patel utilizing GSAP animations and smooth scrolling configurations.',
  },
  'clothing-brand-admin': {
    title: 'Clothing Brand Admin Dashboard | Vraj Patel Portfolio',
    description: 'An internal admin panel built by Vraj Patel featuring TipTap rich text editors, drag reordering setups, and tanstack data sheets.',
  },
  'bus-body-builder-website': {
    title: 'Bus Body Building Company Website | Vraj Patel Portfolio',
    description: 'A premium coach builder portal built by Vraj Patel featuring Framer Motion visuals and custom inquiry estimation forms.',
  },
  'constructionos': {
    title: 'ConstructionOS ERP | Vraj Patel Portfolio',
    description: 'A construction ERP concept built around project management, inventory tracking, purchase orders, worker workflows, and business dashboards.',
  },
  'nf-lrd-regime-discovery': {
    title: 'NF-LRD NIFTY 50 Market Regime Discovery | Vraj Patel Portfolio',
    description: 'A quantitative research platform by Vraj Patel for NIFTY 50 market regime analysis using Python, HMMs, and Streamlit.',
  },
  'mspe-volatility-engine': {
    title: 'Market Surface Projection Engine | Vraj Patel Portfolio',
    description: 'A market volatility skew projection web calculator by Vraj Patel using FastAPI, Black-Scholes solvers, and Plotly 3D meshes.',
  },
  'btc-algo-trading': {
    title: 'BTC-ALGO Trading Dashboard | Vraj Patel Portfolio',
    description: 'A Bitcoin algorithmic indicator crossover trading dashboard with historical backtesting views by Vraj Patel.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const project = projects.find((p) => p.slug === slug);
  
  const specific = SPECIFIC_METADATA[slug];
  const title = specific?.title || (project ? `${project.title} | Vraj Patel Portfolio` : 'Project | Vraj Patel Portfolio');
  const description = specific?.description || (project?.shortDescription || project?.description?.substring(0, 160) || 'Vraj Patel portfolio project case study.');
  
  const keywords = project
    ? [project.category, ...project.technologies, 'Vraj Patel', 'portfolio']
    : ['Vraj Patel', 'portfolio'];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://patel-vraj.vercel.app/projects/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://patel-vraj.vercel.app/projects/${slug}`,
      type: 'article',
      images: [
        {
          url: project?.image || '/og/vraj-patel-portfolio.png',
          width: 1200,
          height: 630,
          alt: project?.title || 'Vraj Patel Project',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project?.image || '/og/vraj-patel-portfolio.png'],
    },
  };
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
