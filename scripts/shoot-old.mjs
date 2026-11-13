import puppeteer from 'puppeteer-core';
const base = 'https://loughsideboatsales.co.uk';
const paths = ['/', '/boats-for-sale/', '/brokerage/', '/detailing/', '/serviceinhg/', '/about/', '/contact/', '/2025/12/09/2005-glastron-gs279-sports-cruiser/', '/2025/12/08/2007-bayliner-192/'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars'] });
for (const [w, h, tag] of [[1440, 900, 'd'], [390, 844, 'm']]) {
  await Promise.all(paths.map(async (p) => {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');
    try {
      await page.goto(base + p, { waitUntil: 'networkidle2', timeout: 45000 }).catch(()=>{});
      await new Promise(r => setTimeout(r, 2000));
      const name = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home').slice(0, 40);
      await page.screenshot({ path: `_src/old/${name}-${tag}.jpg`, fullPage: true, quality: 55 });
    } catch (e) { console.log('fail', p, e.message); }
    await page.close();
  }));
}
await browser.close();
console.log('old done');
