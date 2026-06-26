import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Systems Visualizer | Vraj Patel Engineering Portfolio',
  description: 'Explore interactive system architecture, data flows, security layers, and engineering visualizations from Vraj Patel’s software projects.',
  alternates: {
    canonical: 'https://its-vraj.vercel.app/systems',
  },
  openGraph: {
    title: 'Systems Visualizer | Vraj Patel Engineering Portfolio',
    description: 'Explore interactive system architecture, data flows, security layers, and engineering visualizations from Vraj Patel’s software projects.',
    url: 'https://its-vraj.vercel.app/systems',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Systems Visualizer | Vraj Patel Engineering Portfolio',
    description: 'Explore interactive system architecture, data flows, security layers, and engineering visualizations from Vraj Patel’s software projects.',
  },
};

export default function SystemsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
