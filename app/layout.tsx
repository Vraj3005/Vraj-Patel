import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import Navbar from '@/components/sections/navbar';
import Footer from '@/components/sections/footer';
import GridBackground from '@/components/ui/grid-background';
import Particles from '@/components/ui/particles';
import AIWidget from '@/components/ui/ai-widget';

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
  title: 'Vraj Patel — Software Engineer',
  description: 'Vraj Patel is a Computer Science student at Nirma University who builds full-stack applications, ERP systems, and quantitative research platforms.',
  keywords: ['Vraj Patel', 'Software Engineer', 'Nirma University', 'Full-Stack Developer', 'Portfolio'],
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
        </Providers>
      </body>
    </html>
  );
}
