import { MetadataRoute } from 'next';
import { projects } from '@/lib/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://patel-vraj.vercel.app';

  // Core indexable routes
  const coreRoutes = [
    '',
    '/about',
    '/projects',
    '/resume',
    '/contact',
    '/systems',
  ].map((route) => {
    let priority = 0.8;
    let changeFreq = 'weekly';

    if (route === '') {
      priority = 1.0;
      changeFreq = 'daily';
    } else if (route === '/systems') {
      priority = 0.6;
      changeFreq = 'weekly';
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: changeFreq as any,
      priority,
    };
  });

  // Dynamic project pages
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as any,
    priority: 0.7,
  }));

  return [...coreRoutes, ...projectRoutes];
}
