# Old URL → new URL

Source: WordPress sitemap (wp-sitemap.xml) + Wayback CDX, fetched 2026-11-12. Pages that keep their path need no redirect (trailing slashes are normalised by `cleanUrls` + `trailingSlash: false`).

| Old URL | New URL |
|---|---|
| / | / |
| /boats-for-sale/ | /boats-for-sale |
| /brokerage/ | /brokerage |
| /detailing/ | /detailing |
| /serviceinhg/ | /servicing (301) |
| /about/ | /about |
| /contact/ | /contact |
| /2025/12/08/2007-bayliner-192/ | /boats-for-sale/2014-mastercraft-prostar (301) |
| /2025/12/09/2005-glastron-gs279-sports-cruiser/ | /boats-for-sale/2005-glastron-gs279-sports-cruiser (301) |
| /category/boats-for-sale/ | /boats-for-sale (301) |

Implemented as on-demand 301 endpoints in `src/pages` (`serviceinhg.ts`, `2025/12/…`, `category/boats-for-sale.ts`) so they match with or without the trailing slash, plus `vercel.json` and `public/_redirects` (Netlify/Cloudflare) as backups.
