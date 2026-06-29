import HomeClient from './home-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vraj Patel | Full-Stack Developer & AI/ERP Systems Builder',
  description: 'Explore the portfolio of Vraj Patel, a CSE student at Nirma University building full-stack software, ERP systems, dashboards, AI automation workflows, and quant research projects.',
  keywords: [
    'Vraj Patel',
    'Vraj Patel Portfolio',
    'Vraj Patel Nirma University',
    'Vraj Patel Developer',
    'Vraj Patel CSE',
    'Full-Stack Developer Ahmedabad',
    'Next.js Developer India',
    'Solar Sizing Calculator',
    'OutreachOps AI'
  ],
  alternates: {
    canonical: 'https://patel-vraj.vercel.app',
  },
  openGraph: {
    title: 'Vraj Patel | Full-Stack Developer & AI/ERP Systems Builder',
    description: 'Explore the portfolio of Vraj Patel, a CSE student at Nirma University building full-stack software, ERP systems, dashboards, AI automation workflows, and quant research projects.',
    url: 'https://patel-vraj.vercel.app',
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
    description: 'Explore the portfolio of Vraj Patel, a CSE student at Nirma University building full-stack software, ERP systems, dashboards, AI automation workflows, and quant research projects.',
    images: ['/og/vraj-patel-portfolio.png'],
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://patel-vraj.vercel.app/#person',
        'name': 'Vraj Patel',
        'url': 'https://patel-vraj.vercel.app',
        'jobTitle': 'Full-Stack Developer',
        'description': 'Computer Science Engineering student at Nirma University building full-stack applications, ERP systems, dashboards, AI automation tools, and quantitative research platforms.',
        'email': 'patelvrajpatel30@gmail.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Gujarat',
          'addressCountry': 'India'
        },
        'alumniOf': {
          '@type': 'CollegeOrUniversity',
          'name': 'Nirma University'
        },
        'sameAs': [
          'https://github.com/Vraj3005',
          'https://github.com/23bce377-debug',
          'https://www.linkedin.com/in/vraj-patel-9502a6285'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://patel-vraj.vercel.app/#website',
        'name': 'Vraj Patel Portfolio',
        'url': 'https://patel-vraj.vercel.app',
        'description': 'Portfolio of Vraj Patel featuring full-stack software, ERP systems, AI automation, dashboards, and quant research platforms.',
        'publisher': {
          '@id': 'https://patel-vraj.vercel.app/#person'
        }
      },
      {
        '@type': 'ProfilePage',
        '@id': 'https://patel-vraj.vercel.app/#profile',
        'url': 'https://patel-vraj.vercel.app',
        'mainEntity': {
          '@id': 'https://patel-vraj.vercel.app/#person'
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://patel-vraj.vercel.app/#faq',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'Who is Vraj Patel?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Vraj Patel is a software engineer and computer science undergraduate student at Nirma University, specialized in building full-stack web applications, ERP architectures, and quantitative market research platforms.'
            }
          },
          {
            "@type": "Question",
            "name": "When is Vraj available for full-time employment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vraj graduates from Nirma University in May 2027. He is available for internships starting immediately, or full-time software engineering roles upon his expected graduation."
            }
          },
          {
            "@type": "Question",
            "name": "What is Vraj Patel's core tech stack expertise?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Full-stack engineering: Next.js and React on the frontend; Node.js and FastAPI (Python) on the backend; coupled with PostgreSQL, Supabase RLS, and Drizzle ORM for data layers."
            }
          },
          {
            "@type": "Question",
            "name": "What sets Vraj Patel apart from other computer science graduates?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "He builds real-world production business software, having shipped customized ERP modules directly to clients (solar calculators, interior design trackers) and designed algorithmic options trading suites."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
