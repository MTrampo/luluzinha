// Service Worker do Luluzinha (Online-First com Blindagem de Cache)
const CACHE_NAME = 'luluzinha-cache-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/favicon-96x96.png',
];

// 1. Instalação: Pré-cacheia apenas a página offline e os ícones essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa caches obsoletos de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Interceptação de Requisições com Proteção Total a Server Actions e Dados Dinâmicos
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // REGRA 1: Métodos que não são GET (POST, PUT, DELETE, Server Actions do Next.js)
  // Devem SEMPRE fazer bypass imediato para a rede sem tocar no cache!
  if (request.method !== 'GET') {
    return;
  }

  // REGRA 2: Rotas de API internas (/api/*) e autenticação do Supabase
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/auth/')) {
    return;
  }

  // REGRA 3: Requisições de dados dinâmicos do Next.js RSC (Server Components payloads)
  // Garantir que a busca de agendamentos, clientes e financeiro venha SEMPRE em tempo real
  if (url.searchParams.has('_rsc') || request.headers.get('rsc')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Se estiver offline, retorna erro de rede controlado
        return new Response(null, { status: 503, statusText: 'Offline' });
      })
    );
    return;
  }

  // REGRA 4: Navegação entre páginas (HTML) - Estratégia Network-First
  // Sempre busca a versão mais recente do servidor. Se estiver offline, exibe a página offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedOffline = await cache.match(OFFLINE_URL);
        return cachedOffline || Response.error();
      })
    );
    return;
  }

  // REGRA 5: Assets estáticos imutáveis compilados pelo Next.js (_next/static/*) e ícones da aplicação
  // Estratégia Stale-While-Revalidate: resposta rápida e atualização silenciosa em background
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/web-app-manifest-') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg');

  if (isStaticAsset && url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null);

        // Se já temos no cache, retorna imediatamente e atualiza em segundo plano
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se não está no cache, aguarda a rede
        const networkResponse = await fetchPromise;
        return networkResponse || Response.error();
      })
    );
    return;
  }

  // Demais requisições GET: Segue fluxo de rede padrão
  return;
});

// 4. Mensagens e Controle de Cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_CLEAR') {
    caches.delete(CACHE_NAME).then(() => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      }
    });
  }
});
