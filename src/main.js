import './graphite/tokens.css';
import './graphite/styles.css';
import './graphite/typography.css';
import './style.css';
import { skills, categories } from './skills/index.js';
import { motion } from './motion.js';
import { curveSvg } from './demo.js';
import { renderSection, details, loadFont, chevronSvg } from './render.js';
import * as overlay from './overlay.js';
import { markdown } from './markdown.js';
import story from '../docs/STORY.md?raw';

// Routes: #/  ·  #/<skill>  ·  #/<skill>/<section>  ·  #/story
const app = document.getElementById('app');
app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#/">Design skills</a>
    <a class="top-link" href="#/">Library</a>
    <label class="top-search gt-input"><span class="sr">Search</span><input id="q" type="search" placeholder="Search skills" autocomplete="off" /><kbd class="gt-kbd">/</kbd></label>
    <div class="gt-seg gt-seg--sm theme-seg" role="radiogroup" aria-label="Theme">
      ${['auto', 'light', 'dark'].map((t) => `<button class="gt-seg__opt" role="radio" data-theme-opt="${t}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}
    </div>
    <a class="top-link about" href="#/story">About</a>
    <button class="top-link menu-btn" aria-expanded="false" aria-controls="tree">Skills</button>
  </header>
  <aside class="sidebar">
    <nav id="tree" aria-label="Skills"></nav>
    <p class="credits">A.Song Studio · Charles Liu · Paul Bakaus · Jakub Krehel · Emil Kowalski · LottieFiles</p>
  </aside>
  <main id="main"></main>`;

const tree = document.getElementById('tree');
const main = document.getElementById('main');
const q = document.getElementById('q');
const open = new Set();
let lastSlug = null;
const text = (o) => JSON.stringify(o).toLowerCase();
const parse = () => location.hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
const basePath = () => location.hash.split('?')[0] || '#/';
const param = () => new URLSearchParams(location.hash.split('?')[1] || '').get('p');
let lastBase = null;

// Layer 2: open the detail overlay for a set/index and mirror it in the hash (?p=<id>).
function openDetail(set, i, from) {
  const list = details[set];
  if (!list || !list[i]) return;
  overlay.open(list, i, {
    onChange: (it) => history.replaceState(null, '', `${basePath()}?p=${it.id}`),
    onClose: () => history.replaceState(null, '', basePath()),
    from,
  });
}
function openFromHash() {
  const id = param();
  if (!id) { overlay.close(true); return; }
  for (const [set, list] of Object.entries(details)) {
    const i = list.findIndex((x) => x.id === id);
    if (i > -1) return openDetail(set, i);
  }
}

function renderTree() {
  const [slug, sec] = parse();
  const term = q.value.trim().toLowerCase();
  document.querySelector('.about').classList.toggle('current', slug === 'story');
  const branch = (s) => {
    const secs = s.sections.filter((x) => !term || text(x).includes(term));
    if (term && !secs.length && !text(s).includes(term)) return '';
    const expanded = term || open.has(s.slug);
    const here = s.slug === slug;
    return `<div class="branch">
      <div class="node-row">
        <a class="node skill ${here && !sec ? 'current' : ''} ${here ? 'in' : ''}" href="#/${s.slug}">
          <span class="dot" style="background:${s.accent}"></span>${s.title}</a>
        <button class="toggle ${expanded ? 'is-open' : ''}" data-slug="${s.slug}" aria-expanded="${!!expanded}" aria-label="${expanded ? 'Hide' : 'Show'} ${s.title} sections">${expanded ? '−' : '+'}</button>
      </div>
      ${expanded ? `<div class="leaves">${secs.map((x) => `<a class="node leaf ${here && sec === x.id ? 'current' : ''}" href="#/${s.slug}/${x.id}">${x.title}</a>`).join('')}</div>` : ''}
    </div>`;
  };
  const html = categories.map((c) => {
    const inner = skills.filter((s) => s.category === c).map(branch).join('');
    return inner ? `<div class="cat"><h2 class="cat-h">${c}</h2>${inner}</div>` : '';
  }).join('');
  tree.innerHTML = html || '<p class="empty">No matches</p>';
}

const head = (s, title, intro, crumb) => `
  <header class="page-head">
    ${crumb ? `<a class="up" href="#/${s.slug}"><span class="arr">←</span> ${s.title}</a>` : ''}
    <h1>${title}</h1>
    ${intro ? `<p class="lede">${intro}</p>` : ''}
  </header>`;

// Home tile previews: one honest sample of what is inside each skill.
const firstDemo = (s) => s.sections.flatMap((x) => x.items || []).find((i) => i && i.demo);
function preview(s) {
  const pal = s.sections.find((x) => x.type === 'palettes');
  if (pal) return `<span class="sws">${pal.groups[0].palettes[1].colors.map((c) => `<span class="sw" style="background:${c.hex}"></span>`).join('')}</span>`;
  const d = firstDemo(s);
  if (d) return curveSvg(d.demo.ease, 'card-curve');
  if (s.slug === 'better-typography') return '<span class="pv-type">Aa</span>';
  if (s.slug === 'impeccable') return '<span class="pv-cmd">/polish</span>';
  return `<span class="pv-list">${(s.sections.find((x) => x.type === 'checklist')?.items || []).slice(0, 3).map((i) => `<span>${i}</span>`).join('')}</span>`;
}

function home() {
  return `
    <header class="page-head home-head">
      <h1>Design skills</h1>
      <p class="lede">A small library of design checks you can run on any poster, page or interface.</p>
    </header>
    ${categories.map((c) => `<h2 class="home-cat">${c}</h2>
    <div class="entries">${skills.filter((s) => s.category === c).map((s) => `
      <a class="entry tile" href="#/${s.slug}">
        <span class="tile-media">${preview(s)}</span>
        <span class="tile-cap"><h2>${s.title}</h2><p>${s.overview.purpose}</p><span class="meta">${s.source} · ${s.sections.length} sections</span></span>
      </a>`).join('')}</div>`).join('')}
    <p class="start">New here? Start with <a href="#/${skills[0].slug}/${skills[0].overview.start}">${skills[0].title}: ${skills[0].sections.find((x) => x.id === skills[0].overview.start).title}</a></p>`;
}

function overview(s) {
  const o = s.overview;
  const start = s.sections.find((x) => x.id === o.start) || s.sections[0];
  return head(s, s.title, o.purpose) + `
    <div class="ov">
      <div class="ov-when"><h2>When to use it</h2><p>${o.when}</p>
        <p class="meta">${s.sourceUrl ? `<a href="${s.sourceUrl}" target="_blank" rel="noopener">${s.source}</a>` : s.source} · ${s.sourceNote}</p></div>
      <div class="ov-keys"><h2>Key takeaways</h2><ol class="keys">${o.takeaways.map((t) => `<li>${t}</li>`).join('')}</ol></div>
    </div>
    <a class="primary" href="#/${s.slug}/${start.id}">Start with ${start.title} →</a>
    <h2 class="toc-title">Sections</h2>
    <ul class="toc">${s.sections.map((x) => `<li><a href="#/${s.slug}/${x.id}">${x.title}</a></li>`).join('')}</ul>`;
}

function section(s, x) {
  const i = s.sections.indexOf(x);
  const prev = s.sections[i - 1], next = s.sections[i + 1];
  return head(s, x.title, x.intro, true) + `<div class="body">${renderSection(x)}</div>
    <nav class="pager">
      ${prev ? `<a class="prev" href="#/${s.slug}/${prev.id}"><span class="meta"><span class="arr">←</span> Previous</span>${prev.title}</a>` : `<a class="prev" href="#/${s.slug}"><span class="meta"><span class="arr">←</span> Back to</span>Overview</a>`}
      ${next ? `<a class="next" href="#/${s.slug}/${next.id}"><span class="meta">Next <span class="arr">→</span></span>${next.title}</a>` : '<span></span>'}
    </nav>`;
}

function route() {
  if (basePath() === lastBase) { openFromHash(); return; }
  lastBase = basePath();
  overlay.close(true);
  const [slug, sec] = parse();
  const s = skills.find((k) => k.slug === slug);
  if (s && s.slug !== lastSlug) { open.clear(); open.add(s.slug); }
  lastSlug = s ? s.slug : null;
  main.style.setProperty('--skill', s ? s.accent : 'transparent');
  if (slug === 'story') main.innerHTML = `<article class="story">${markdown(story)}</article>`;
  else if (!s) main.innerHTML = home();
  else {
    const x = s.sections.find((k) => k.id === sec);
    main.innerHTML = x ? section(s, x) : overview(s);
  }
  renderTree();
  window.scrollTo(0, 0);
  motion.page(main);
  openFromHash();
}

tree.addEventListener('click', (e) => {
  const b = e.target.closest('.toggle');
  if (!b) return;
  const slug = b.dataset.slug;
  open.has(slug) ? open.delete(slug) : open.add(slug);
  renderTree();
});
q.addEventListener('input', renderTree);
document.addEventListener('keydown', (e) => {
  if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement?.tagName || '')) { e.preventDefault(); document.getElementById('q').focus(); return; }
  if (overlay.isOpen()) return;
  if (e.key === '/' && document.activeElement !== q) { e.preventDefault(); q.focus(); }
  if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; renderTree(); q.blur(); }
});
main.addEventListener('click', (e) => {
  const mp = e.target.closest('.mini-play');
  if (mp) {
    // play the easing right on the card, no overlay
    const ball = mp.parentElement.querySelector('.mini-ball'), lane = ball.parentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    ball.getAnimations().forEach((a) => a.cancel());
    ball.animate(reduce ? [{ opacity: 0.2 }, { opacity: 1 }] : [{ transform: 'translateX(0)' }, { transform: `translateX(${lane.clientWidth - ball.offsetWidth}px)` }], { duration: +mp.dataset.ms, easing: mp.dataset.ease, fill: 'forwards' });
    return;
  }
  const b = e.target.closest('.opens');
  if (b) openDetail(b.dataset.set, +b.dataset.i, b);
});
// Hover / focus previews: fonts render in their own face.
const peekFont = (e) => { const f = e.target.closest?.('.font'); if (f && !f.dataset.loaded) { f.dataset.loaded = 1; const n = f.querySelector('[data-font]'); loadFont(n.dataset.font, n); } };
main.addEventListener('mouseover', peekFont);
main.addEventListener('focusin', peekFont);
main.addEventListener('change', (e) => {
  if (e.target.matches('.check input')) e.target.closest('.check').classList.toggle('done', e.target.checked);
});
// Theme: Graphite tokens switch on data-theme; Auto follows the OS.
const setTheme = (t) => {
  if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme = t;
  localStorage.setItem('theme', t);
  document.querySelectorAll('[data-theme-opt]').forEach((b) => { const on = b.dataset.themeOpt === t; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
};
document.querySelector('.theme-seg').addEventListener('click', (e) => { const b = e.target.closest('[data-theme-opt]'); if (b) setTheme(b.dataset.themeOpt); });
setTheme(localStorage.getItem('theme') || 'auto');
const menuBtn = document.querySelector('.menu-btn');
menuBtn.addEventListener('click', () => { const o = document.body.classList.toggle('nav-open'); menuBtn.setAttribute('aria-expanded', o); });
window.addEventListener('hashchange', () => { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); });
window.addEventListener('hashchange', route);
route();
