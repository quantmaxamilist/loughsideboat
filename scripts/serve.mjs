// Tiny Vercel-style static server for dist/: vercel.json 301s, /x -> x.html, /x/ -> 301 /x, else 404.html (status 404)
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve('dist'); const port = +(process.argv[2] || 4399 + 1);
const vj = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain' };
http.createServer((req, res) => {
  let u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const r = vj.redirects.find((x) => x.source === u);
  if (r) { res.writeHead(301, { Location: r.destination }); return res.end(); }
  if (u.length > 1 && u.endsWith('/')) { res.writeHead(301, { Location: u.slice(0, -1) }); return res.end(); }
  const cands = u === '/' ? ['index.html'] : [u.slice(1), u.slice(1) + '.html', u.slice(1) + '/index.html'];
  for (const c of cands) { const f = path.join(root, c); if (f.startsWith(root) && fs.existsSync(f) && fs.statSync(f).isFile()) { res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' }); return fs.createReadStream(f).pipe(res); } }
  res.writeHead(404, { 'Content-Type': 'text/html' }); fs.createReadStream(path.join(root, '404.html')).pipe(res);
}).listen(port, '127.0.0.1', () => console.log('serving dist on', port));
