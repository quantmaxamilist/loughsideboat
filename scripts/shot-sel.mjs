// Usage: node scripts/shot-sel.mjs <path> <selector> <width> <height> <out> [waitMs=4000] [hover-selector]
import puppeteer from 'puppeteer-core';
const [path, sel, w, h, out, wait = 4000, hover] = process.argv.slice(2);
const base = process.env.BASE || 'http://localhost:4353';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--hide-scrollbars'] });
const p = await b.newPage();
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
await p.goto(base + path, { waitUntil: 'networkidle2' });
await p.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - 40; (window.__lough?.lenis) ? window.__lough.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }, sel);
await new Promise((r) => setTimeout(r, +wait));
if (hover) { await p.hover(hover); await new Promise((r) => setTimeout(r, 700)); }
await p.screenshot({ path: out, quality: 75 });
console.log(errs.join('\n') || 'ok');
await b.close();
