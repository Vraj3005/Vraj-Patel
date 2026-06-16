import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume | Vraj Patel Curriculum Vitae',
  description: 'View and export Vraj Patel\'s single-page A4 engineering resume. Covers core systems competencies, CSE studies at Nirma University, and key projects.',
  alternates: {
    canonical: 'https://vrajpatel.dev/resume',
  },
  openGraph: {
    title: 'Vraj Patel Curriculum Vitae',
    description: 'View and export Vraj Patel\'s single-page A4 engineering resume. Covers core systems competencies, CSE studies at Nirma University, and key projects.',
    url: 'https://vrajpatel.dev/resume',
    type: 'profile',
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
