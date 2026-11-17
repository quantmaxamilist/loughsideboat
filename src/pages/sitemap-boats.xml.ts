// Live sitemap of boat pages from the CRM (on demand, so new listings are discoverable without a rebuild).
import type { APIRoute } from 'astro';
import { getBoats } from '../data/crm';
export const prerender = false;
export const GET: APIRoute = async () => {
  const boats = await getBoats();
  const urls = boats.map((b) => `<url><loc>https://loughsideboatsales.co.uk/boats-for-sale/${b.slug}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { 'Content-Type': 'application/xml', 'Cache-Control': 'public, max-age=0, s-maxage=3600' },
  });
};
