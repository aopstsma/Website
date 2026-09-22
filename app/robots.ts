import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/school-dashboard',
          '/school-login',
          '/admin-login',
          '/api/',
          '/pay/status/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/school-dashboard', '/admin-login'],
      },
    ],
    sitemap: 'https://www.aopstsma.in/sitemap.xml',
    host: 'https://www.aopstsma.in',
  };
}

