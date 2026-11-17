// Old WordPress URL → new page. On demand so it matches with or without the trailing slash (one 301 hop).
import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = () => new Response(null, { status: 301, headers: { Location: '/boats-for-sale/2005-glastron-gs279-sports-cruiser', 'Cache-Control': 'public, max-age=86400' } });
