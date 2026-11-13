import puppeteer from 'puppeteer-core';
const [url, out, w = 1020, h = 700] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
const p = await b.newPage(); await p.setViewport({ width: +w, height: +h });
await p.goto(url, { waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 800));
await p.screenshot({ path: out }); await b.close();
