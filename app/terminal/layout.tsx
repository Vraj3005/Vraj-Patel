import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Developer Terminal | Vraj Patel Portfolio',
  description: 'Explore Vraj Patel’s portfolio using an interactive command-style interface for projects, skills, systems, and resume information.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://patel-vraj.vercel.app/terminal',
  },
  openGraph: {
    title: 'Developer Terminal | Vraj Patel Portfolio',
    description: 'Explore Vraj Patel’s portfolio using an interactive command-style interface for projects, skills, systems, and resume information.',
    url: 'https://patel-vraj.vercel.app/terminal',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Terminal | Vraj Patel Portfolio',
    description: 'Explore Vraj Patel’s portfolio using an interactive command-style interface for projects, skills, systems, and resume information.',
  },
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
