import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://luluzinha.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/painel/', '/api/', '/convite/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
