import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vraj Patel | CSE Student & Software Developer',
  description: 'Learn about Vraj Patel, a Computer Science Engineering student focused on full-stack development, AI automation, ERP systems, dashboards, and quantitative research platforms.',
  alternates: {
    canonical: 'https://patel-vraj.vercel.app/about',
  },
  openGraph: {
    title: 'About Vraj Patel | CSE Student & Software Developer',
    description: 'Learn about Vraj Patel, a Computer Science Engineering student focused on full-stack development, AI automation, ERP systems, dashboards, and quantitative research platforms.',
    url: 'https://patel-vraj.vercel.app/about',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Vraj Patel | CSE Student & Software Developer',
    description: 'Learn about Vraj Patel, a Computer Science Engineering student focused on full-stack development, AI automation, ERP systems, dashboards, and quantitative research platforms.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
