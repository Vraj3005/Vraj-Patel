import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/footer';
import GridBackground from '@/components/ui/grid-background';
import Particles from '@/components/ui/particles';
import AIWidget from '@/components/ui/ai-widget';
import TelemetryTracker from '@/components/telemetry-tracker';

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const fontMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://its-vraj.vercel.app'),
  title: {
    default: 'Vraj Patel | Full-Stack Developer, AI/ERP Systems Builder & Quant Research Enthusiast',
    template: '%s | Vraj Patel Portfolio',
  },
  description: 'Vraj Patel is a Computer Science Engineering student at Nirma University building full-stack applications, ERP systems, dashboards, AI automation workflows, and quantitative research platforms using Next.js, TypeScript, Python, Supabase, PostgreSQL, Gemini API, and FastAPI.',
  keywords: [
    'Vraj Patel', 'Vraj Patel portfolio', 'Vraj Patel developer', 'Vraj Patel Nirma University',
    'Vraj Patel CSE', 'full stack developer India', 'AI ERP developer', 'Next.js developer',
    'Supabase developer', 'quant research portfolio', 'Python trading dashboard', 'Gemini API developer'
  ],
  alternates: {
    canonical: '/',
  },
  authors: [{ name: 'Vraj Patel', url: 'https://its-vraj.vercel.app' }],
  creator: 'Vraj Patel',
  publisher: 'Vraj Patel',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Vraj Patel | Full-Stack Developer & AI/ERP Systems Builder',
    description: 'Portfolio of Vraj Patel, a CSE student at Nirma University building real-world ERP systems, dashboards, AI automation tools, and quant research platforms.',
    url: 'https://its-vraj.vercel.app',
    siteName: 'Vraj Patel Portfolio',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/og/vraj-patel-portfolio.png',
        width: 1200,
        height: 630,
        alt: 'Vraj Patel Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vraj Patel | Full-Stack Developer & AI/ERP Systems Builder',
    description: 'Portfolio of Vraj Patel, a CSE student at Nirma University building real-world ERP systems, dashboards, AI automation tools, and quant research platforms.',
    images: ['/og/vraj-patel-portfolio.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative select-none">
        <Providers>
          <GridBackground />
          <Particles />
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col">
            {children}
          </main>
          <Footer />
          <AIWidget />
          <TelemetryTracker />
        </Providers>
      </body>
    </html>
  );
}
