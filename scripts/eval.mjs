// Usage: node scripts/eval.mjs <path> <width> <height> "<js expression>"
import puppeteer from 'puppeteer-core';
const [path, w, h, js] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal'] });
const p = await b.newPage(); await p.setViewport({ width: +w, height: +h, isMobile: +w < 768, hasTouch: +w < 768 });
await p.goto((process.env.BASE || 'http://localhost:4353') + path, { waitUntil: 'networkidle2' });
console.log(JSON.stringify(await p.evaluate(js), null, 1));
await b.close();
