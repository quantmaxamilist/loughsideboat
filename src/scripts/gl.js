// Tiny WebGL1 helpers shared by the hero water and The Polish (no three.js needed for 2D photo shaders).
export const VERT = `attribute vec2 p; varying vec2 vS; void main(){ vS = p*0.5+0.5; vS.y = 1.0-vS.y; gl_Position = vec4(p,0.,1.); }`;

export function makeGL(canvas) {
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, alpha: true, powerPreference: 'high-performance' });
  return gl || null;
}

export function program(gl, fs) {
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {}; const n = gl.getProgramParameter(pr, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(pr, i); u[info.name] = gl.getUniformLocation(pr, info.name); }
  return { pr, u };
}

export function loadImage(src) {
  return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => res(im)); im.onerror = rej; im.src = src; });
}

export function texture(gl, img, unit) {
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

// CSS object-fit: cover + object-position -> (scale.xy, offset.xy) so that imgUV = screenUV * scale + offset
export function cover(cw, ch, iw, ih, px = 0.5, py = 0.5) {
  const s = Math.max(cw / iw, ch / ih); const dw = iw * s, dh = ih * s;
  const ox = (cw - dw) * px, oy = (ch - dh) * py;
  return [cw / dw, ch / dh, -ox / dw, -oy / dh];
}

export function objectPos(el) {
  const v = getComputedStyle(el).objectPosition.split(' ').map((x) => parseFloat(x) / 100);
  return [isNaN(v[0]) ? 0.5 : v[0], isNaN(v[1]) ? 0.5 : v[1]];
}

export const dprCap = () => Math.min(devicePixelRatio || 1, matchMedia('(max-width: 760px)').matches ? 1.25 : 1.5);
