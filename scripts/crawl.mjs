// Crawls every internal link/asset from / on the dist server + checks every old URL redirects once to a 200.
const base = process.argv[2] || 'http://127.0.0.1:4410';
const seen = new Map(); const queue = ['/'];
const old = ['/', '/boats-for-sale/', '/brokerage/', '/detailing/', '/serviceinhg/', '/about/', '/contact/', '/2025/12/08/2007-bayliner-192/', '/2025/12/09/2005-glastron-gs279-sports-cruiser/', '/category/boats-for-sale/', '/serviceinhg', '/sitemap-index.xml', '/favicon.svg', '/apple-touch-icon.png'];
while (queue.length) {
  const u = queue.shift(); if (seen.has(u)) continue;
  const r = await fetch(base + u, { redirect: 'manual' }); seen.set(u, r.status);
  if (r.status === 200 && (r.headers.get('content-type') || '').includes('html')) {
    const h = await r.text();
    for (const m of h.matchAll(/(?:href|src)="([^"#]+)"/g)) { const v = m[1]; if (v.startsWith('/') && !v.startsWith('//') && !seen.has(v.split('?')[0])) queue.push(v.split('?')[0]); }
    for (const m of h.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const v = part.trim().split(' ')[0]; if (v.startsWith('/')) queue.push(v); }
  }
}
const bad = [...seen].filter(([, s]) => s !== 200);
console.log(`crawled ${seen.size} internal URLs; non-200: ${bad.length ? bad.map(([u, s]) => s + ' ' + u).join(', ') : 'none'}`);
for (const o of old) {
  const r1 = await fetch(base + o, { redirect: 'manual' });
  let line = `${o} -> ${r1.status}`;
  if (r1.status === 301) { const loc = r1.headers.get('location'); const r2 = await fetch(base + loc, { redirect: 'manual' }); line += ` ${loc} -> ${r2.status}`; }
  console.log(line);
}
