// Shared site behaviour: smooth scroll, reveals, header state, menu, page transitions, cursor.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;

function smooth() {
  if (reduce) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });
  const h0 = document.documentElement.scrollHeight;
  document.fonts?.ready.then(() => { if (document.documentElement.scrollHeight !== h0) ScrollTrigger.refresh(); });
}

function reveals() {
  const els = [...document.querySelectorAll('[data-reveal]')];
  if (!els.length) return;
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { const el = en.target; const d = +(el.dataset.revealDelay || 0); el.style.transitionDelay = d ? d + 'ms' : ''; el.classList.add('is-in'); io.unobserve(el); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  els.forEach((e) => io.observe(e));
  // sweep: anything already scrolled past is shown at once, so fast scrolls never leave holes
  const sweep = () => { const vh = innerHeight; els.forEach((e) => { if (!e.classList.contains('is-in') && e.getBoundingClientRect().top < vh * 0.92) { e.classList.add('is-in'); io.unobserve(e); } }); };
  addEventListener('scroll', sweep, { passive: true });
}

function header() {
  const h = document.querySelector('[data-hdr]');
  if (!h) return;
  const set = () => h.classList.toggle('is-solid', scrollY > 40);
  set(); addEventListener('scroll', set, { passive: true });
  const menu = document.querySelector('[data-menu]');
  const open = document.querySelector('[data-menu-open]');
  const close = document.querySelector('[data-menu-close]');
  if (!menu || !open || !close) return;
  const show = (v) => {
    menu.hidden = !v; open.setAttribute('aria-expanded', String(v));
    document.documentElement.style.overflow = v ? 'hidden' : '';
    if (lenis) v ? lenis.stop() : lenis.start();
    if (v) close.focus(); else open.focus();
  };
  open.addEventListener('click', () => show(true));
  close.addEventListener('click', () => show(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) show(false); });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { if (lenis) lenis.start(); document.documentElement.style.overflow = ''; }));
}

function transitions() {
  const pt = document.querySelector('[data-pt]');
  if (!pt) return;
  const KEY = 'lough-pt';
  let came = false;
  try { came = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch (e) {}
  if (came && !reduce) {
    gsap.set(pt, { yPercent: 0 });
    gsap.to(pt, { yPercent: -100, duration: 0.4, ease: 'power3.inOut', delay: 0.02, onComplete: () => gsap.set(pt, { yPercent: 100 }) });
  }
  addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(pt, { yPercent: 100 }); });
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a');
    if (!a || reduce) return;
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download') || /^(tel|mailto):/.test(href)) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) { if (url.hash) return; }
    e.preventDefault();
    try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
    gsap.fromTo(pt, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power3.in', onComplete: () => { location.href = url.href; } });
  });
}

function cursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches || reduce) return;
  const c = document.querySelector('[data-cursor]');
  if (!c) return;
  document.documentElement.classList.add('has-cursor');
  const ring = c.querySelector('.cursor__ring'), dot = c.querySelector('.cursor__dot');
  let x = -100, y = -100, rx = -100, ry = -100;
  addEventListener('pointermove', (e) => { x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; }, { passive: true });
  gsap.ticker.add(() => { rx += (x - rx) * 0.22; ry += (y - ry) * 0.22; ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`; });
  document.addEventListener('pointerover', (e) => { c.classList.toggle('is-link', !!e.target.closest?.('a,button,[role=button],label,input,textarea,select')); });
  document.addEventListener('pointerleave', () => { c.style.opacity = '0'; });
  document.addEventListener('pointerenter', () => { c.style.opacity = '1'; });
}

export function getLenis() { return lenis; }
export function boot() {
  smooth(); reveals(); header(); transitions(); cursor();
  if (import.meta.env.DEV) window.__lough = { lenis, ScrollTrigger, gsap };
}
