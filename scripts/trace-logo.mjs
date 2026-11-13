// Traces the old site's 512px raster logo (cropped-Logo-Photoroom-4.png, upscaled 4x and split by colour) into SVG paths.
import potrace from 'potrace';
import fs from 'fs';
const trace = (f) => new Promise((res, rej) => potrace.trace(f, { threshold: 128, turdSize: 40, optTolerance: 0.4, alphaMax: 1.0 }, (e, svg) => e ? rej(e) : res(svg)));
const pathOf = (svg) => [...svg.matchAll(/ d="([^"]+)"/g)].map(m => m[1]).join(' ');
const b = pathOf(await trace('_src/logo_blue_mask.png'));
const d = pathOf(await trace('_src/logo_dark_mask.png'));
fs.writeFileSync('_src/logo_paths.json', JSON.stringify({ blue: b, dark: d }));
fs.writeFileSync('_src/logo_trace.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><rect width="2048" height="2048" fill="#fff"/><path d="${b}" fill="#2B388F"/><path d="${d}" fill="#1b1b1b"/></svg>`);
console.log(b.length, d.length);
