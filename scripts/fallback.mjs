// Reduced-motion and no-WebGL checks: the wow sections must show their final state (photo + list visible).
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://127.0.0.1:4410';
for (const mode of ['reduced', 'nowebgl']) {
  const args = ['--hide-scrollbars', ...(mode === 'nowebgl' ? ['--disable-3d-apis', '--disable-webgl'] : ['--enable-webgl', '--use-angle=metal'])];
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args });
  for (const [path, sel] of [['/wow-a', '[data-fb]'], ['/wow-b', '[data-pol]']]) {
    const p = await b.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    if (mode === 'reduced') await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await p.setViewport({ width: 1440, height: 900 });
    await p.goto(base + path, { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500));
    await p.evaluate((s) => { document.querySelector(s).scrollIntoView(); }, sel); await new Promise((r) => setTimeout(r, 3600));
    const info = await p.evaluate((s) => {
      const root = document.querySelector(s);
      const rows = [...root.querySelectorAll('li')].map((l) => getComputedStyle(l).opacity);
      const cv = root.querySelector('canvas'); const hero = document.querySelector('[data-water]');
      return { rowsVisible: rows.every((o) => o === '1'), rows: rows.length, canvasOn: cv ? cv.classList.contains('is-on') : null, heroWaterOn: hero?.classList.contains('is-on'), reveals: [...document.querySelectorAll('[data-reveal]')].filter((e) => e.getBoundingClientRect().top < innerHeight && getComputedStyle(e).opacity !== '1').length };
    }, sel);
    await p.screenshot({ path: `review/shots/fallback-${mode}-${path.slice(1)}.jpg`, quality: 60 });
    console.log(mode, path, JSON.stringify(info), errs.join(' | ') || 'no errors');
    await p.close();
  }
  await b.close();
}
