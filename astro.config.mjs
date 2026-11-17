import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://loughsideboatsales.co.uk',
  trailingSlash: 'ignore',
  build: { format: 'file' },
  scopedStyleStrategy: 'class',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Old WordPress URLs are on-demand 301s in src/pages (serviceinhg.ts, 2025/…, category/…) so trailing slashes match.
  // Listing pages render on demand from the QuantWeb CRM; everything else is prerendered.
  adapter: vercel(),
  server: { port: 4353 },
  integrations: [sitemap({
    filter: (p) => !p.includes('/404') && !p.includes('/wow-'),
    // on-demand pages aren't discovered automatically; boat pages are listed in /sitemap-boats.xml
    customPages: ['https://loughsideboatsales.co.uk/', 'https://loughsideboatsales.co.uk/boats-for-sale', 'https://loughsideboatsales.co.uk/contact'],
  })],
  vite: { optimizeDeps: { include: ['gsap', 'gsap/ScrollTrigger', 'lenis'] } },
});
