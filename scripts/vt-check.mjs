// Clicks a nav link and reports whether the browser ran a cross-document view transition on arrival.
import puppeteer from 'puppeteer-core';
const base = process.env.BASE || 'http://localhost:4353';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(() => { addEventListener('pagereveal', (e) => { window.__vt = !!e.viewTransition; }); });
await p.goto(base + '/about', { waitUntil: 'networkidle2' });
await new Promise((r) => setTimeout(r, 600));
const t0 = Date.now();
await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }), p.click('.hdr__link[href="/brokerage"]')]);
await new Promise((r) => setTimeout(r, 500));
console.log('landed on', new URL(p.url()).pathname, '| view transition ran:', await p.evaluate(() => window.__vt), '| nav ms:', Date.now() - t0, '| panel element present:', await p.evaluate(() => !!document.querySelector('[data-pt]')), '|', errs.join(' ') || 'no errors');
await b.close();
