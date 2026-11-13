// Rebuilds the Loughside propeller mark as clean SVG: the one intact blade from the old 512px logo is traced,
// then rotated 4x about the hub; the dashed ring is redrawn as 4 arcs at the measured radius/gaps.
import potrace from 'potrace';
import fs from 'fs';
const CX = 678.5, CY = 1133, S = 0.5; // 2048 trace space -> 1024 units, hub at 0,0
const svg = await new Promise((res, rej) => potrace.trace('_src/blade_top.png', { threshold: 128, turdSize: 100, optTolerance: 1.2, alphaMax: 1.25 }, (e, s) => e ? rej(e) : res(s)));
let d = [...svg.matchAll(/ d="([^"]+)"/g)].map(m => m[1]).join(' ');
// shift path numbers into hub-centred coords
d = d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (_, x, y) => `${((+x - CX) * S).toFixed(1)} ${((+y - CY) * S).toFixed(1)}`);
const R = 253, SW = 13;
const arc = (a0, a1) => { const r = (a) => a * Math.PI / 180; const p = (a) => `${(R * Math.cos(r(a))).toFixed(1)} ${(R * Math.sin(r(a))).toFixed(1)}`; return `M${p(a0)} A${R} ${R} 0 0 1 ${p(a1)}`; };
const arcs = [-76, 14, 104, 194].map(a => arc(a, a + 39)).join(' ');
fs.writeFileSync('src/data/mark.json', JSON.stringify({ blade: d, ring: arcs, ringWidth: SW }, null, 0));
console.log('blade path chars', d.length);
