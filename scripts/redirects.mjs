// Writes vercel.json, public/_redirects and REDIRECTS.md from src/data/redirects.mjs
import fs from 'fs';
import { oldUrls } from '../src/data/redirects.mjs';
const r = Object.entries(oldUrls).flatMap(([s, d]) => [{ source: s, destination: d, permanent: true }, { source: s + '/', destination: d, permanent: true }]);
fs.writeFileSync('vercel.json', JSON.stringify({ cleanUrls: true, trailingSlash: false, redirects: r }, null, 2) + '\n');
fs.writeFileSync('public/_redirects', Object.entries(oldUrls).flatMap(([s, d]) => [`${s} ${d} 301`, `${s}/ ${d} 301`]).join('\n') + '\n');
const rows = [['/', '/'], ['/boats-for-sale/', '/boats-for-sale'], ['/brokerage/', '/brokerage'], ['/detailing/', '/detailing'], ['/serviceinhg/', '/servicing (301)'], ['/about/', '/about'], ['/contact/', '/contact'], ['/2025/12/08/2007-bayliner-192/', '/boats-for-sale/2014-mastercraft-prostar (301)'], ['/2025/12/09/2005-glastron-gs279-sports-cruiser/', '/boats-for-sale/2005-glastron-gs279-sports-cruiser (301)'], ['/category/boats-for-sale/', '/boats-for-sale (301)']];
fs.writeFileSync('REDIRECTS.md', '# Old URL → new URL\n\nSource: WordPress sitemap (wp-sitemap.xml) + Wayback CDX, fetched 2026-11-12. Pages that keep their path need no redirect (trailing slashes are normalised by `cleanUrls` + `trailingSlash: false`).\n\n| Old URL | New URL |\n|---|---|\n' + rows.map(([a, b]) => `| ${a} | ${b} |`).join('\n') + '\n\nImplemented in `vercel.json` (301), `public/_redirects` (Netlify/Cloudflare, 301) and `astro.config.mjs` `redirects` (meta-refresh stubs for any other host).\n');
console.log('ok');
