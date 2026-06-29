import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Vraj AI | Vraj Patel Portfolio Assistant',
  description: 'Ask an AI assistant about Vraj Patel’s projects, skills, ERP systems, AI automation work, and quantitative research portfolio.',
  alternates: {
    canonical: 'https://patel-vraj.vercel.app/ask-vraj',
  },
  openGraph: {
    title: 'Ask Vraj AI | Vraj Patel Portfolio Assistant',
    description: 'Ask an AI assistant about Vraj Patel’s projects, skills, ERP systems, AI automation work, and quantitative research portfolio.',
    url: 'https://patel-vraj.vercel.app/ask-vraj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ask Vraj AI | Vraj Patel Portfolio Assistant',
    description: 'Ask an AI assistant about Vraj Patel’s projects, skills, ERP systems, AI automation work, and quantitative research portfolio.',
  },
};

export default function AskVrajLayout({ children }: { children: React.ReactNode }) {
  return children;
}
