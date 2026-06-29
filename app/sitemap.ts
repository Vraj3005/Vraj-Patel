import { MetadataRoute } from 'next';
import { projects } from '@/lib/data/projects';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://patel-vraj.vercel.app';

  // 9 public routes
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/resume', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/systems', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/ask-vraj', priority: 0.6, changeFrequency: 'weekly' as const },
    { path: '/terminal', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/dashboard', priority: 0.5, changeFrequency: 'daily' as const },
  ].map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Dynamic project pages
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
