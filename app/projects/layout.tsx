import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | Vraj Patel Portfolio Case Studies',
  description: 'Explore Vraj Patel\'s portfolio projects including custom solar calculators, wooden materials ERP platforms, high-speed C++ WebAssembly options engines, and Hidden Markov Models (HMM) volatility segmenters.',
  alternates: {
    canonical: 'https://vrajpatel.dev/projects',
  },
  openGraph: {
    title: 'Vraj Patel Project Case Studies',
    description: 'Explore Vraj Patel\'s portfolio projects including custom solar calculators, wooden materials ERP platforms, high-speed C++ WebAssembly options engines, and Hidden Markov Models (HMM) volatility segmenters.',
    url: 'https://vrajpatel.dev/projects',
    type: 'website',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
