import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/inbox', '/api', '/auth'],
    },
    sitemap: 'https://patel-vraj.vercel.app/sitemap.xml',
  };
}
