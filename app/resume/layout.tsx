import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume | Vraj Patel',
  description: 'View the resume of Vraj Patel, a Computer Science Engineering student skilled in Next.js, TypeScript, Python, Supabase, PostgreSQL, AI automation, ERP systems, and quant research.',
  alternates: {
    canonical: 'https://patel-vraj.vercel.app/resume',
  },
  openGraph: {
    title: 'Resume | Vraj Patel',
    description: 'View the resume of Vraj Patel, a Computer Science Engineering student skilled in Next.js, TypeScript, Python, Supabase, PostgreSQL, AI automation, ERP systems, and quant research.',
    url: 'https://patel-vraj.vercel.app/resume',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume | Vraj Patel',
    description: 'View the resume of Vraj Patel, a Computer Science Engineering student skilled in Next.js, TypeScript, Python, Supabase, PostgreSQL, AI automation, ERP systems, and quant research.',
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
