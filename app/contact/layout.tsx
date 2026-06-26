import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Vraj Patel | Full-Stack Developer',
  description: 'Contact Vraj Patel for software development, AI automation, ERP systems, dashboards, quant research, and collaboration opportunities.',
  alternates: {
    canonical: 'https://its-vraj.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact Vraj Patel | Full-Stack Developer',
    description: 'Contact Vraj Patel for software development, AI automation, ERP systems, dashboards, quant research, and collaboration opportunities.',
    url: 'https://its-vraj.vercel.app/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Vraj Patel | Full-Stack Developer',
    description: 'Contact Vraj Patel for software development, AI automation, ERP systems, dashboards, quant research, and collaboration opportunities.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
