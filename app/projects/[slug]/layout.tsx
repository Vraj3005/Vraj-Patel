import { projects } from '@/lib/data/projects';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
  children: React.ReactNode;
}

const SPECIFIC_METADATA: Record<string, { title: string; description: string }> = {
  'outreachops-ai': {
    title: 'OutreachOps AI | Gemini Cold Email Automation Project',
    description: 'OutreachOps AI is Vraj Patel’s AI automation project using Google GenAI SDK, Gmail OAuth API, and Google Sheets API to generate personalized outreach drafts and manage outbound workflows.',
  },
  'solar-sizing-calculator': {
    title: 'Solar Sizing Calculator & ERP | Vraj Patel Portfolio',
    description: 'A solar quotation calculator and ERP-style workflow system for Solar Sizing Engine, designed to manage customer requirements, pricing logic, subsidy calculations, and project workflow.',
  },
  'constructionos': {
    title: 'ConstructionOS ERP | Vraj Patel Portfolio',
    description: 'A construction ERP concept built around project management, inventory tracking, purchase orders, worker workflows, and business dashboards.',
  },
  'construction-os': {
    title: 'ConstructionOS ERP | Vraj Patel Portfolio',
    description: 'A construction ERP concept built around project management, inventory tracking, purchase orders, worker workflows, and business dashboards.',
  },
  'nf-lrd-regime-discovery': {
    title: 'NF-LRD NIFTY 50 Regime Discovery | Vraj Patel Portfolio',
    description: 'A quantitative research platform for NIFTY 50 market regime analysis using Python, statistical modeling, feature engineering, and dashboard-based visualization.',
  },
  'mspe-volatility-engine': {
    title: 'Market Surface Projection Engine | Vraj Patel Portfolio',
    description: 'A market analytics and projection platform using Python, FastAPI, statistical models, volatility surfaces, and interactive visualization.',
  },
  'btc-algo-trading': {
    title: 'BTC-ALGO Trading Dashboard | Vraj Patel Portfolio',
    description: 'A Bitcoin algorithmic trading dashboard with historical data, indicators, backtesting logic, and interactive market research views.',
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
