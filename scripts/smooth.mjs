// Scroll smoothness on the production build: real wheel input (trackpad-like small deltas + 100px notches),
// rAF frame times, long tasks during scroll, layout shifts (with sources) and scroll jumps.
import puppeteer from 'puppeteer-core';
const base = process.argv[2] || 'http://127.0.0.1:4410';
const paths = process.argv.slice(3);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=metal', '--hide-scrollbars', '--enable-gpu-rasterization'] });
for (const path of paths) {
  for (const mode of ['trackpad', 'notch']) {
    const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
    await p.evaluateOnNewDocument(() => {
      window.__m = { frames: [], long: [], cls: 0, shifts: [], jumps: 0 };
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__m.long.push(Math.round(e.duration)))).observe({ type: 'longtask', buffered: true });
      new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) { window.__m.cls += e.value; window.__m.shifts.push((e.sources || []).map((s) => s.node?.className || s.node?.nodeName).join(',') + ':' + e.value.toFixed(4)); } })).observe({ type: 'layout-shift', buffered: true });
    });
    await p.goto(base + path, { waitUntil: 'networkidle2' }); await new Promise((r) => setTimeout(r, 1500));
    await p.evaluate(() => { window.__m.long = []; window.__m.cls = 0; window.__m.shifts = []; let last = performance.now(), ly = scrollY; const f = (t) => { window.__m.frames.push(t - last); last = t; if (Math.abs(scrollY - ly) > 400) window.__m.jumps++; ly = scrollY; window.__m.raf = requestAnimationFrame(f); }; requestAnimationFrame(f); });
    await p.mouse.move(720, 450);
    const H = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    let y = 0, guard = 0;
    while (y < H - 10 && guard++ < 2500) {
      if (mode === 'trackpad') { await p.mouse.wheel({ deltaY: 6 + Math.random() * 10 }); await new Promise((r) => setTimeout(r, 16)); }
      else { await p.mouse.wheel({ deltaY: 100 }); await new Promise((r) => setTimeout(r, 90)); }
      y = await p.evaluate(() => scrollY);
    }
    await new Promise((r) => setTimeout(r, 800));
    const m = await p.evaluate(() => { cancelAnimationFrame(window.__m.raf); return window.__m; });
    const f = m.frames.slice(5).sort((a, b) => a - b); const p95 = f[Math.floor(f.length * 0.95)]; const over = f.filter((x) => x > 33).length / f.length * 100;
    console.log(`${path} [${mode}] frames=${f.length} p95=${p95.toFixed(1)}ms >33ms=${over.toFixed(2)}% longtasks=${m.long.length ? m.long.join('/') : 0} CLS=${m.cls.toFixed(4)} jumps=${m.jumps}${m.shifts.length ? ' shifts=' + m.shifts.slice(0, 4).join(' ; ') : ''}`);
    await p.close();
  }
}
await b.close();
