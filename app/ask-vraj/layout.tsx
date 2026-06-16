import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ask Vraj AI | Interactive Gemini Assistant',
  description: 'Ask Vraj Patel\'s secure, Gemini-powered assistant questions regarding his projects, technical capabilities, education timeline, and resume coordinates.',
  alternates: {
    canonical: 'https://vrajpatel.dev/ask-vraj',
  },
  openGraph: {
    title: 'Ask Vraj AI | Interactive Gemini Assistant',
    description: 'Ask Vraj Patel\'s secure, Gemini-powered assistant questions regarding his projects, technical capabilities, education timeline, and resume coordinates.',
    url: 'https://vrajpatel.dev/ask-vraj',
    type: 'website',
  },
};

export default function AskVrajLayout({ children }: { children: React.ReactNode }) {
  return children;
}
