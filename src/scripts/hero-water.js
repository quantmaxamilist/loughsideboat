// Living water on the hero photo: gentle ripple displacement on the reflection only (hand-traced mask),
// stronger in the foreground, finer toward the quay. Renders only while the hero is on screen.
import { makeGL, program, loadImage, texture, cover, objectPos, dprCap } from './gl.js';

const FS = `precision mediump float;
varying vec2 vS; uniform sampler2D uTex, uMask; uniform vec4 uCov; uniform float uT;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  vec2 uv = vS * uCov.xy + uCov.zw;
  float m = texture2D(uMask, uv).r;
  float depth = smoothstep(0.34, 1.0, uv.y);
  float fy = mix(150., 46., depth);
  float w1 = sin(uv.y * fy + uT * 1.5 + n(vec2(uv.x * 6., uv.y * 20. + uT * .25)) * 5.);
  float w2 = sin(uv.y * fy * 1.7 - uT * 1.05 + uv.x * 9. + n(uv * vec2(14., 40.) - uT * .2) * 4.);
  float amp = mix(0.0009, 0.0042, depth) * m;
  vec2 d = vec2(w1 * 0.7 + w2 * 0.3, (w2 - w1) * 0.22) * amp;
  vec3 c = texture2D(uTex, uv + d).rgb;
  c *= 1. + (w1 * w2) * 0.025 * m * depth;
  gl_FragColor = vec4(c, 1.);
}`;

export async function initHeroWater() {
  const hero = document.querySelector('[data-hero]');
  const canvas = hero?.querySelector('[data-water]');
  const img = hero?.querySelector('.hero__img');
  if (!hero || !canvas || !img || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const gl = makeGL(canvas); if (!gl) return;
  if (!img.complete) await new Promise((r) => img.addEventListener('load', r, { once: true }));
  let P;
  try { P = program(gl, FS); } catch (e) { return; }
  const [photo, mask] = await Promise.all([loadImage(img.currentSrc || img.src), loadImage('/img/john-helm-water.png')]);
  texture(gl, photo, 0); texture(gl, mask, 1);
  gl.uniform1i(P.u.uTex, 0); gl.uniform1i(P.u.uMask, 1);
  const size = () => {
    const r = canvas.getBoundingClientRect(); const d = dprCap();
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const [px, py] = objectPos(img);
    gl.uniform4fv(P.u.uCov, cover(r.width, r.height, photo.naturalWidth, photo.naturalHeight, px, py));
  };
  size(); addEventListener('resize', size);
  let raf = 0, on = false, t0 = performance.now(), shown = false;
  const frame = (t) => {
    gl.uniform1f(P.u.uT, (t - t0) / 1000); gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!shown) { shown = true; canvas.classList.add('is-on'); }
    raf = on ? requestAnimationFrame(frame) : 0;
  };
  const run = (v) => { on = v && !document.hidden; if (on && !raf) raf = requestAnimationFrame(frame); };
  let vis = true;
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; run(vis); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', () => run(vis));
  addEventListener('pagehide', () => { on = false; gl.getExtension('WEBGL_lose_context')?.loseContext(); });
}
