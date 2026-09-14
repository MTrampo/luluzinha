import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Luluzinha',
    short_name: 'Luluzinha',
    description: 'Seu Espaço Digital',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9edff',
    theme_color: '#3c0366',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
