import { motion } from './motion.js';
// Layer-2 content builders: what a user sees after showing interest in an item.
export const slug = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function copy(text, el) {
  try { await navigator.clipboard.writeText(text); }
  catch { const f = document.activeElement, t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); f?.focus(); }
  toast(el?.dataset.ai ? 'Copied for AI' : text.length > 40 ? 'Copied to clipboard' : `${text} copied`);
  if (!el) return;
  const lab = el.querySelector('.cp-label') || el;
  if (!lab.dataset.idle) lab.dataset.idle = lab.textContent;
  lab.textContent = 'Copied';
  el.classList.add('copied');
  motion.pop(lab);
  clearTimeout(el._t);
  el._t = setTimeout(() => { lab.textContent = lab.dataset.idle; el.classList.remove('copied'); }, 1200);
}

export { toast } from './toastbus.js';
import { toast } from './toastbus.js';

// Luminance helpers: pick readable ink and order colors light -> dark for mocks.
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export const lum = (h) => { const [r, g, b] = rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const on = (h) => (lum(h) > 0.35 ? '#12100E' : '#FDFEFA');
const varName = (n) => '--' + slug(n);

export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
// Palette distance: average nearest-colour distance, both directions (for "Related").
const d3 = (a, b) => Math.hypot(...rgb(a).map((v, i) => v - rgb(b)[i]));
export const palDist = (p, q) => {
  const one = (A, B) => A.reduce((t, c) => t + Math.min(...B.map((k) => d3(c.hex, k.hex))), 0) / A.length;
  return one(p.colors, q.colors) + one(q.colors, p.colors);
};
export const stripThumb = (cs) => `<span class="strip mini">${cs.map((c) => `<span style="background:${c.hex}"></span>`).join('')}</span>`;

function contrastRows(cs) {
  const pairs = [];
  cs.forEach((a, i) => cs.slice(i + 1).forEach((b) => pairs.push([a, b, ratio(a.hex, b.hex)])));
  pairs.sort((x, y) => y[2] - x[2]);
  return pairs.map(([a, b, r]) => {
    const [bg, fg] = lum(a.hex) > lum(b.hex) ? [a, b] : [b, a];
    const v = r >= 4.5 ? 'Text' : r >= 3 ? 'Large only' : 'Avoid';
    return `<div class="ct ${r >= 3 ? '' : 'bad'}"><span class="ct-s" style="background:${bg.hex};color:${fg.hex}">Aa</span>
      <span>${fg.name} on ${bg.name}</span><span class="meta">${r.toFixed(1)} · ${v}</span></div>`;
  }).join('');
}

function png(p) {
  const w = 1200, h = 630, cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const x = cv.getContext('2d');
  const tok = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  x.fillStyle = tok('--bg-surface'); x.fillRect(0, 0, w, h);
  const bw = (w - 96) / p.colors.length;
  p.colors.forEach((c, i) => {
    x.fillStyle = c.hex; x.fillRect(48 + i * bw, 48, bw, 420);
    x.fillStyle = tok('--text-primary'); x.font = '500 26px Inter, Arial, sans-serif';
    x.fillText(c.name, 48 + i * bw, 512);
    x.fillStyle = tok('--text-secondary'); x.font = '22px Inter, Arial, sans-serif';
    x.fillText(c.hex.toUpperCase(), 48 + i * bw, 548);
  });
  x.fillStyle = tok('--text-primary'); x.font = '28px "Hedvig Letters Sans", Inter, Arial, sans-serif';
  x.fillText(p.name, 48, 600);
  const a = document.createElement('a');
  a.download = `palette-${slug(p.name)}.png`;
  a.href = cv.toDataURL('image/png');
  a.click();
}

export function paletteDetail(p) {
  const css = `:root {\n${p.colors.map((c) => `  ${varName(c.name)}: ${c.hex};`).join('\n')}\n}`;
  const json = JSON.stringify(Object.fromEntries(p.colors.map((c) => [c.name, c.hex])), null, 2);
  const all = p.colors.map((c) => `${c.name} ${c.hex}`).join('\n');
  const s = [...p.colors].sort((a, b) => lum(b.hex) - lum(a.hex));
  const bg = s[0], ink = s[s.length - 1], mid = s.slice(1, -1);
  const acc = mid[0] || ink, acc2 = mid[1] || acc;
  const enc = encodeURIComponent;
  return {
    thumb: stripThumb(p.colors),
    actions: `
      <button class="pill-btn dark" data-copy="${enc(all)}" data-enc><span class="cp-label">Copy all</span></button>
      <button class="pill-btn" data-toggle="contrast" aria-expanded="false">Check contrast</button>
      <a class="pill-btn" href="#/design-critique/typography">Pair with fonts</a>
      <details class="menu"><summary class="pill-btn">Export</summary><div class="menu-pop">
        <button data-copy="${enc(css)}" data-enc><span class="cp-label">Copy CSS variables</span></button>
        <button data-copy="${enc(json)}" data-enc><span class="cp-label">Copy JSON</span></button>
        <button data-png>Download PNG</button></div></details>`,
    html: `
      <div class="big-sws">${p.colors.map((c) => `
        <button class="big-sw" data-copy="${c.hex}" aria-label="Copy ${c.name} ${c.hex}">
          <span class="sw-tile" style="background:${c.hex}"></span>
          <span class="sw-meta"><span class="sw-name">${c.name}</span><span class="hex cp-label" data-idle="${c.hex.toUpperCase()}">${c.hex.toUpperCase()}</span></span>
        </button>`).join('')}</div>
      <div class="contrast" id="contrast" hidden>${contrastRows(p.colors)}</div>
      <div class="mocks">
        <div class="mock poster" style="background:${acc.hex};color:${[ink.hex, bg.hex, '#111111', '#FFFFFF'].sort((a, b) => ratio(acc.hex, b) - ratio(acc.hex, a))[0]}">
          <span class="m-dot" style="background:${acc2.hex}"></span><strong>Open<br>Studio</strong><span class="m-k">Sat 14 · Free entry</span>
        </div>
        <div class="mock ui" style="background:${bg.hex};color:${ink.hex}">
          <strong>Plan your week</strong><span class="m-p">Short line of body text to judge contrast.</span>
          <span class="m-btn" style="background:${acc.hex};color:${[ink.hex, bg.hex, '#111111', '#FFFFFF'].sort((a, b) => ratio(acc.hex, b) - ratio(acc.hex, a))[0]}">Get started</span>
        </div>
        <div class="mock badge" style="background:${acc2.hex};">
          <span class="m-logo" style="background:${ink.hex};color:${bg.hex}">${p.name.trim()[0].toUpperCase()}</span>
        </div>
      </div>`,
    onMount(el) {
      copyWire(el);
      el.querySelector('[data-png]').addEventListener('click', () => png(p));
    },
  };
}

export function copyWire(el) {
  el.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () =>
    copy(b.hasAttribute('data-enc') ? decodeURIComponent(b.dataset.copy) : b.dataset.copy, b)));
  el.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
    const t = el.querySelector('#' + b.dataset.toggle);
    t.hidden = !t.hidden; b.setAttribute('aria-expanded', !t.hidden); b.classList.toggle('on', !t.hidden);
  }));
}
