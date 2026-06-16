import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Vraj Patel | Project Inquiries',
  description: 'Get in touch with Vraj Patel for full-stack software architecture, ERP systems optimization, quantitative research collaborations, or autonomous AI workflows.',
  alternates: {
    canonical: 'https://vrajpatel.dev/contact',
  },
  openGraph: {
    title: 'Contact Vraj Patel | Project Inquiries',
    description: 'Get in touch with Vraj Patel for full-stack software architecture, ERP systems optimization, quantitative research collaborations, or autonomous AI workflows.',
    url: 'https://vrajpatel.dev/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
