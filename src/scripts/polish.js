// WOW B — "The Polish": a rotary pad works along the client's own Sea Ray hull, lifting a chalky oxidised
// gelcoat to a deep gloss, then a single highlight runs the length of the hull. ~4.1s, plays at >=50% visible.
import { gsap } from 'gsap';
import { makeGL, program, loadImage, texture, cover, objectPos, dprCap } from './gl.js';

const FS = `precision highp float;
varying vec2 vS;
uniform sampler2D uTex, uMask; uniform vec4 uCov; uniform float uAsp, uP, uG, uPad, uFin, uT, uR;
uniform vec2 uPts[8];
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float t = clamp(dot(pa,ba)/max(dot(ba,ba),1e-6), 0., 1.); return length(pa - ba*t); }
void main(){
  vec2 uv = vS * uCov.xy + uCov.zw;
  vec3 c = texture2D(uTex, uv).rgb;
  float m = texture2D(uMask, uv).r;
  vec2 A = vec2(uAsp, 1.);
  vec2 q = uv * A;
  float total = 0.;
  for (int i = 0; i < 7; i++) total += length((uPts[i+1] - uPts[i]) * A);
  float target = uP * total, acc = 0., dmin = 10.;
  vec2 head = uPts[0] * A;
  for (int i = 0; i < 7; i++) {
    vec2 a = uPts[i] * A, b = uPts[i+1] * A; float l = length(b - a);
    if (target > acc) { vec2 e = a + (b - a) * clamp((target - acc) / l, 0., 1.); dmin = min(dmin, seg(q, a, e)); head = e; }
    acc += l;
  }
  float rev = max(1. - smoothstep(uR * 0.72, uR, dmin), uFin);
  // oxidised gelcoat: softened, desaturated, chalky lift, mottled
  float o = 0.0018;
  vec3 bl = (texture2D(uTex, uv + vec2(o, 0.)).rgb + texture2D(uTex, uv - vec2(o, 0.)).rgb + texture2D(uTex, uv + vec2(0., o)).rgb + texture2D(uTex, uv - vec2(0., o)).rgb) * 0.25;
  float L = dot(bl, vec3(.299, .587, .114));
  vec3 ox = mix(bl, vec3(L), 0.5) * 0.8 + vec3(0.17, 0.16, 0.135);
  float mott = n(uv * 120.) - .5; float streak = n(uv * vec2(22., 4.)) - .5;
  ox += mott * 0.03 + streak * 0.035;
  // polished: a touch more depth + the moving highlight
  vec3 pol = (c - .5) * 1.07 + .5;
  float gx = q.x * 0.82 + q.y * 0.5;
  float band = exp(-pow((gx - mix(-0.15, 1.75, uG)) / 0.045, 2.)) * 0.55 + exp(-pow((gx - mix(-0.25, 1.65, uG)) / 0.012, 2.)) * 0.35;
  pol += band * m;
  vec3 col = mix(c, mix(ox, pol, rev), m);
  // the pad: soft disc with spinning swirl, only while it sits on the hull
  float dh = length(q - head);
  vec2 hu = head / A;
  float onHull = smoothstep(0.15, 0.6, texture2D(uMask, hu).r);
  float pad = (1. - smoothstep(uR * 0.78, uR * 0.84, dh)) * uPad * onHull;
  float ang = atan(q.y - head.y, q.x - head.x);
  float sw = 0.5 + 0.5 * sin(ang * 9. + uT * 38. + dh * 140.);
  float rim = smoothstep(uR * 0.6, uR * 0.8, dh);
  vec3 pc = mix(pol, vec3(1.), 0.16 + 0.1 * sw * (dh / uR) + rim * 0.22);
  col = mix(col, pc, pad * 0.85);
  gl_FragColor = vec4(col, 1.);
}`;

// path in photo-normalised coords of the crop (polish-hull-1210.webp); see scripts/masks.py for the hull
const X0 = 0.08, Y0 = 0.15, SX = 0.84, SY = 0.63;
const RAW = [[0.17, 0.39], [0.45, 0.40], [0.80, 0.445], [0.84, 0.50], [0.50, 0.50], [0.20, 0.43], [0.36, 0.52], [0.78, 0.57]];
const PTS = RAW.flatMap(([x, y]) => [(x - X0) / SX, (y - Y0) / SY]);

export async function initPolish(root) {
  const canvas = root.querySelector('[data-pol-canvas]');
  const img = root.querySelector('[data-pol-img]');
  const rows = root.querySelectorAll('[data-pol-row]');
  const replay = root.querySelector('[data-pol-replay]');
  const showEnd = () => { rows.forEach((r) => (r.style.opacity = '1')); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return showEnd();
  const gl = makeGL(canvas); if (!gl) return showEnd();
  let P; try { P = program(gl, FS); } catch (e) { console.warn(e); return showEnd(); }
  const src = img.currentSrc || img.getAttribute('src');
  const [photo, mask] = await Promise.all([loadImage(src), loadImage('/img/polish-hull-mask.png')]);
  const idle = () => new Promise((r) => ('requestIdleCallback' in window ? requestIdleCallback(r, { timeout: 1500 }) : setTimeout(r, 50)));
  await idle(); texture(gl, photo, 0);
  await idle(); texture(gl, mask, 1);
  gl.uniform1i(P.u.uTex, 0); gl.uniform1i(P.u.uMask, 1);
  gl.uniform2fv(P.u['uPts[0]'], new Float32Array(PTS));
  gl.uniform1f(P.u.uAsp, photo.naturalWidth / photo.naturalHeight);
  gl.uniform1f(P.u.uR, 0.085);
  const st = { p: 0, g: 0, pad: 0, fin: 0 };
  const t0 = performance.now();
  const draw = () => {
    gl.uniform1f(P.u.uP, st.p); gl.uniform1f(P.u.uG, st.g); gl.uniform1f(P.u.uPad, st.pad); gl.uniform1f(P.u.uFin, st.fin);
    gl.uniform1f(P.u.uT, (performance.now() - t0) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  const size = () => {
    const r = canvas.getBoundingClientRect(); const d = dprCap();
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d); gl.viewport(0, 0, canvas.width, canvas.height);
    const [px, py] = objectPos(img);
    gl.uniform4fv(P.u.uCov, cover(r.width, r.height, photo.naturalWidth, photo.naturalHeight, px, py)); draw();
  };
  rows.forEach((r) => (r.style.opacity = '0'));
  const tl = gsap.timeline({ paused: true, onUpdate: draw, onComplete: () => { draw(); replay.hidden = false; } });
  tl.set(st, { p: 0, g: 0, pad: 0, fin: 0 })
    .set(rows, { opacity: 0 })
    .to(st, { pad: 1, duration: 0.25, ease: 'power1.out' }, 0)
    .to(st, { p: 1, duration: 3.0, ease: 'sine.inOut' }, 0.05)
    .to(st, { pad: 0, duration: 0.3, ease: 'power1.in' }, 2.85)
    .to(st, { fin: 1, duration: 0.5, ease: 'power1.out' }, 2.8)
    .to(st, { g: 1, duration: 0.95, ease: 'power2.inOut' }, 3.1)
    .to(rows, { opacity: 1, duration: 0.45, stagger: 0.08, ease: 'power1.out' }, 3.55);
  size(); addEventListener('resize', size);
  canvas.classList.add('is-on');
  let started = false;
  const stage = root.querySelector('[data-pol-stage]');
  const start = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; tl.play(0); start.disconnect(); } }, { threshold: 0.5 });
  start.observe(stage);
  new IntersectionObserver(([e]) => { if (!started || tl.progress() >= 1) return; e.isIntersecting ? tl.resume() : tl.pause(); }, { threshold: 0 }).observe(root);
  replay.addEventListener('click', () => { replay.hidden = true; tl.play(0); });
  addEventListener('pagehide', () => gl.getExtension('WEBGL_lose_context')?.loseContext());
}
