import { projects } from '@/lib/data/projects';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const project = projects.find((p) => p.slug === resolvedParams.slug);
  if (!project) return {};

  return {
    title: `${project.title} | Vraj Patel Project Case Study`,
    description: project.shortDescription || project.description.substring(0, 160),
    alternates: {
      canonical: `https://vrajpatel.dev/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} Case Study`,
      description: project.shortDescription || project.description.substring(0, 160),
      url: `https://vrajpatel.dev/projects/${project.slug}`,
      type: 'article',
      images: [
        {
          url: project.image || '/images/default-og.png',
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.shortDescription,
      images: [project.image || '/images/default-og.png'],
    },
  };
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
