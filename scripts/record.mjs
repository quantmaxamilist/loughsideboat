// Real-time MP4 of a section: node scripts/record.mjs <path> <w> <h> <selector|hero> <seconds> <out.mp4>
import puppeteer from 'puppeteer-core';
const [path, w, h, sel, secs, out] = process.argv.slice(2);
const base = process.env.BASE || 'http://127.0.0.1:4410';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
const p = await b.newPage();
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 768, hasTouch: +w < 768 });
await p.goto(base + path, { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 2500));
const rec = await p.screencast({ path: out.replace(/\.mp4$/, '.webm') });
await new Promise((r) => setTimeout(r, 300));
if (sel !== 'hero') await p.evaluate((s) => { const el = document.querySelector(s); const y = el.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 70 : 40); window.scrollTo(0, y); }, sel);
await new Promise((r) => setTimeout(r, +secs * 1000));
await rec.stop(); await b.close();
