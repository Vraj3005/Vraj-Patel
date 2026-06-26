import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Vraj Patel Portfolio',
  description: 'Explore Vraj Patel’s projects across client software, ERP systems, e-commerce dashboards, AI automation, websites, and quantitative research platforms.',
  alternates: {
    canonical: 'https://its-vraj.vercel.app/projects',
  },
  openGraph: {
    title: 'Projects | Vraj Patel Portfolio',
    description: 'Explore Vraj Patel’s projects across client software, ERP systems, e-commerce dashboards, AI automation, websites, and quantitative research platforms.',
    url: 'https://its-vraj.vercel.app/projects',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Vraj Patel Portfolio',
    description: 'Explore Vraj Patel’s projects across client software, ERP systems, e-commerce dashboards, AI automation, websites, and quantitative research platforms.',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
