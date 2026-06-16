import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vraj Patel | CSE Undergrad & Systems Architect',
  description: 'Learn about Vraj Patel\'s academic background at Nirma University, key client software projects, custom ERP calculations, and technical skill competencies.',
  alternates: {
    canonical: 'https://vrajpatel.dev/about',
  },
  openGraph: {
    title: 'About Vraj Patel | Systems Architect',
    description: 'Learn about Vraj Patel\'s academic background at Nirma University, key client software projects, custom ERP calculations, and technical skill competencies.',
    url: 'https://vrajpatel.dev/about',
    type: 'profile',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
