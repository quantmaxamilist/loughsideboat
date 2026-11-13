// Screens every page at one width in viewport steps, logging h1 count, overflow and console errors.
import puppeteer from 'puppeteer-core';
const [w, h, steps = 4, tag = 'x', ...paths] = process.argv.slice(2);
const base = process.env.BASE || 'http://localhost:4353';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--hide-scrollbars'] });
for (const path of paths) {
  const p = await b.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('requestfailed', (r) => errs.push('failed ' + r.url())); p.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
  await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
  await p.goto(base + path, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 900));
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const n = Math.min(+steps, Math.ceil(H / +h));
  const name = (path.replace(/\//g, '_').replace(/^_/, '') || 'home').slice(0, 30);
  let maxOv = 0;
  for (let i = 0; i < n; i++) {
    await p.evaluate((y) => { window.__lough?.lenis ? window.__lough.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }, i * +h);
    await new Promise((r) => setTimeout(r, 750));
    maxOv = Math.max(maxOv, await p.evaluate(() => document.documentElement.scrollWidth - innerWidth));
    await p.screenshot({ path: `review/shots/${tag}-${name}-${i}.jpg`, quality: 62 });
  }
  const h1 = await p.evaluate(() => document.querySelectorAll('h1').length);
  console.log(`${path} h1=${h1} overflow=${maxOv} H=${H} ${errs.filter((e) => !e.includes('__astro') && !e.includes('dev-toolbar')).join(' | ') || 'clean'}`);
  await p.close();
}
await b.close();
