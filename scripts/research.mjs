import puppeteer from 'puppeteer-core';
const sites = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--hide-scrollbars','--autoplay-policy=no-user-gesture-required'] });
await Promise.all(sites.map(async (u) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');
  const name = new URL(u).hostname.replace('www.', '');
  try {
    await page.goto(u, { waitUntil: 'networkidle2', timeout: 45000 }).catch(()=>{});
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: `_src/research/${name}-fold.jpg`, quality: 60 });
    const info = await page.evaluate(() => {
      const f = (s) => { const e = document.querySelector(s); if (!e) return null; const c = getComputedStyle(e); return `${c.fontFamily.slice(0, 50)} ${c.fontWeight} ${c.fontSize} | ${e.innerText.trim().slice(0, 80)}`; };
      return { h1: f('h1'), h2: f('h2'), body: f('p'), video: document.querySelectorAll('video').length, height: document.body.scrollHeight };
    });
    console.log(name, JSON.stringify(info));
    for (const k of [1,2,3]) { await page.evaluate((k) => window.scrollTo(0, innerHeight * k * 1.1), k); await new Promise(r => setTimeout(r, 1300)); await page.screenshot({ path: `_src/research/${name}-${k+1}.jpg`, quality: 50 }); }
  } catch (e) { console.log('fail', u, e.message); }
  await page.close();
}));
await browser.close();
