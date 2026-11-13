// Usage: node scripts/frames.mjs <path> <w> <h> <out> <count> <intervalMs> [selector] [delayMs]
import puppeteer from 'puppeteer-core';
const [path, w, h, out, count = 2, gap = 500, sel, delay = 2500] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--hide-scrollbars'] });
const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
await p.goto((process.env.BASE || 'http://localhost:4353') + path, { waitUntil: 'networkidle2' });
if (sel) await p.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - 60; (window.__lough?.lenis) ? window.__lough.lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y); }, sel);
await new Promise((r) => setTimeout(r, +delay));
for (let i = 0; i < +count; i++) { await p.screenshot({ path: `${out}-${i}.png` }); await new Promise((r) => setTimeout(r, +gap)); }
console.log(errs.join('\n') || 'ok', await p.evaluate(() => document.querySelector('[data-water]')?.className));
await b.close();
