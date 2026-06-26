import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Dashboard | Vraj Patel Portfolio',
  description: 'View public portfolio metrics, project categories, technology usage, and engineering activity from Vraj Patel’s developer portfolio.',
  alternates: {
    canonical: 'https://its-vraj.vercel.app/dashboard',
  },
  openGraph: {
    title: 'Engineering Dashboard | Vraj Patel Portfolio',
    description: 'View public portfolio metrics, project categories, technology usage, and engineering activity from Vraj Patel’s developer portfolio.',
    url: 'https://its-vraj.vercel.app/dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Engineering Dashboard | Vraj Patel Portfolio',
    description: 'View public portfolio metrics, project categories, technology usage, and engineering activity from Vraj Patel’s developer portfolio.',
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
