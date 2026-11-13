import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { oldUrls } from './src/data/redirects.mjs';

export default defineConfig({
  site: 'https://loughsideboatsales.co.uk',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  redirects: oldUrls,
  server: { port: 4353 },
  integrations: [sitemap({ filter: (p) => !p.includes('/404') && !p.includes('/wow-') })],
  vite: { optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'lenis'] } },
});
