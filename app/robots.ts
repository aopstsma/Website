import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/school-dashboard', '/api/'],
    },
    sitemap: 'https://www.aopstsma.in/sitemap.xml',
  };
}
