// Usage: node scripts/shot.mjs <path> <width> <height> <outPrefix> [steps=6] [waitMs=900]
// Captures viewport-sized steps down the page (fullPage hangs with WebGL/video) and prints console errors.
import puppeteer from 'puppeteer-core';
const [path, w, h, out, steps = 6, wait = 900] = process.argv.slice(2);
const base = process.env.BASE || 'http://localhost:4353';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
const p = await b.newPage();
const errs = [];
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 768, hasTouch: +w < 768 });
await p.goto(base + path, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
const H = await p.evaluate(() => document.documentElement.scrollHeight);
const n = Math.min(+steps, Math.ceil(H / +h));
for (let i = 0; i < n; i++) {
  await p.evaluate((y) => { (window.__lough?.lenis) ? window.__lough.lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); }, i * +h);
  await new Promise((r) => setTimeout(r, +wait));
  await p.screenshot({ path: `${out}-${i}.jpg`, quality: 70 });
}
const info = await p.evaluate(() => ({ h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - innerWidth, H: document.documentElement.scrollHeight }));
console.log(JSON.stringify(info), errs.length ? '\n' + errs.join('\n') : 'no console errors');
await b.close();
