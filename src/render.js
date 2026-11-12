// One renderer per section "type". Layer 1 = scan (name, visual, one line).
// Items with more to say render as buttons (.opens) and register a layer-2 detail in `details`.
import { demoHtml, wireDemo, curveSvg } from './demo.js';
import { sketch } from './sketch.js';
import { slug, paletteDetail, copyWire, palDist, stripThumb } from './details.js';

export let details = {}; // setId -> [{id, title, html, onMount}]
const reg = (set, d) => { (details[set] ||= []).push(d); return `data-set="${set}" data-i="${details[set].length - 1}"`; };

const viz = (key, state) =>
  `<div class="viz viz-${key} ${state}"><i></i><i></i><i></i><i></i><span>Aa</span></div>`;

function capped(items, n, one, wrap = (h) => h, label = 'Show all') {
  const head = wrap(items.slice(0, n).map(one).join(''));
  if (items.length <= n) return head;
  return head + `<details class="more"><summary>${label} ${items.length}</summary>${wrap(items.slice(n).map(one).join(''))}</details>`;
}
// Preview a font in the overlay from Google Fonts when it exists there; falls back silently.
export function loadFont(name, el) {
  const id = 'gf-' + slug(name);
  if (!document.getElementById(id)) {
    const l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name).replace(/%20/g, '+')}&display=swap`;
    document.head.appendChild(l);
  }
  el.style.fontFamily = `'${name}', sans-serif`;
}
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const grid = (cls = '') => (h) => `<div class="grid ${cls}">${h}</div>`;
const chev = '<span class="open-hint" aria-hidden="true">Open <span class="arr">→</span></span>';
const chevron = '<span class="chev" aria-hidden="true"></span>';
export const chevronSvg = chevron;

const colorRows = (cs) => `<div class="big-sws">${cs.map((c) => `
  <button class="big-sw" data-copy="${c.hex}" aria-label="Copy ${c.name} ${c.hex}">
    <span class="sw-tile" style="background:${c.hex}"></span>
    <span class="sw-meta"><span class="sw-name">${c.name}</span><span class="hex cp-label">${c.hex.toUpperCase()}</span></span>
  </button>`).join('')}</div>`;

// Visual items get a square tinted tile with the preview centred (Abduzeedo grid); text items stay text.
const media = (c, i = 0) => {
  const inner = (c.shape ? `<span class="shape shape-${c.shape}"><i></i><i></i><i></i></span>` : '')
    + (c.colors ? `<span class="sws">${c.colors.map((x) => `<span class="sw" style="background:${x.hex}"></span>`).join('')}</span>` : '')
    + (c.demo ? `${curveSvg(c.demo.ease, 'card-curve')}<span class="mini-lane" aria-hidden="true"><span class="mini-ball"></span></span>` : '');
  return `<span class="tile-media">${inner || sketch(c, i)}</span>`;
};
const cardBody = (c, i) => `${media(c, i)}<span class="tile-cap"><h3>${c.title}</h3>`;

// Cards open only when there is a layer 2 (extra text or colors).
const card = (set) => (c, i) => {
  const vis = ' tile';
  const a = reg(set, {
    id: slug(c.title), title: c.title,
    thumb: c.colors ? stripThumb(c.colors) : c.demo ? curveSvg(c.demo.ease, 'mini') : '',
    html: `<p class="ov-lede">${c.text}</p>${c.more ? `<p class="ov-p">${c.more}</p>` : ''}${c.colors ? colorRows(c.colors) : ''}${c.demo ? demoHtml(c.demo) : ''}${c.css ? `<pre class="code"><code>${esc(c.css)}</code></pre>` : ''}`,
    actions: c.css ? `<button class="pill-btn dark" data-copy="${encodeURIComponent(c.css)}" data-enc><span class="cp-label">Copy CSS</span></button>` : '',
    onMount: (el) => { copyWire(el); wireDemo(el); },
  });
  const card = `<button class="card opens${vis}" ${a}>${cardBody(c, i)}${chev}</span></button>`;
  return c.demo ? `<div class="card-wrap">${card}<button class="mini-play" data-ease="${c.demo.ease}" data-ms="${c.demo.ms}" aria-label="Play ${c.title}">▶</button></div>` : card;
};

// Diagnostic → the section holding the rule behind the fix.
const rule = { grid: ['gestalt', 'layout'], group: ['gestalt', 'grouping'], focus: ['hierarchy', 'hierarchy'], scale: ['hierarchy', 'hierarchy'],
  busy: ['hierarchy', 'hierarchy'], empty: ['hierarchy', 'hierarchy'], words: ['pairings', 'concept'], heavy: ['color', 'color'], glow: ['color', 'color'],
  warm: ['color', 'color'], flat: ['color', 'color'], message: ['color', 'color'], muddy: ['color', 'color'] };

// Related: same `cat` first, then nearest neighbours; capped at 5.
function relate(list, score = (a, b) => (a.cat && a.cat === b.cat ? 0 : 1)) {
  list.forEach((a, i) => {
    a.related = list.map((b, j) => [j, score(a, b) + Math.abs(i - j) / 1000]).filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1]).slice(0, 5).map(([j]) => j);
  });
}

const types = {
  cards: (s) => capped(s.items, 6, card(s.id), grid()) + (relate(details[s.id] || []), ''),

  diagnostics: (s) => capped(s.items, 6, (d) => `
    <button class="card diag opens tile" ${reg(s.id, {
      id: slug(d.title || d.symptom), title: d.title || d.symptom,
      thumb: viz(d.viz, 'after'), cat: rule[d.viz]?.[0],
      actions: (d.url ? `<a class="pill-btn dark" href="${d.url}" target="_blank" rel="noopener">Read the research</a>` : '') || (rule[d.viz] ? `<a class="pill-btn dark" href="#/design-critique/${rule[d.viz][0]}">See the ${rule[d.viz][1]} rules</a>` : ''),
      html: `<p class="ov-lede">${d.fix}</p>${d.why ? `<p class="ov-p">${d.why}</p>` : ''}
        <div class="ba big"><figure>${viz(d.viz, 'before')}<figcaption class="meta">Before</figcaption></figure><figure>${viz(d.viz, 'after')}<figcaption class="meta">After</figcaption></figure></div>`,
    })}>
      <span class="tile-media"><span class="flip">${viz(d.viz, 'before')}${viz(d.viz, 'after')}</span></span><span class="tile-cap"><h3>${d.symptom}</h3><span class="peek-slot">${chev}<span class="peek">${d.fix}</span></span></span>
    </button>`, grid('diag-grid')) + (relate(details[s.id]), ''),

  palettes: (s) => s.groups.map((g, i) => `
    <details class="group-block" ${i === 0 ? 'open' : ''}>
      <summary><span>${g.name}</span><span class="peek-pals" aria-hidden="true">${g.palettes.slice(0, 3).map((p) => `<span class="strip mini">${p.colors.map((c) => `<span style="background:${c.hex}"></span>`).join('')}</span>`).join('')}</span><span class="count">${g.palettes.length}</span>${chevron}</summary>
      <div class="grid pal-grid">${g.palettes.map((p) => `
        <button class="palette opens tile" aria-label="Open palette ${p.name}" ${reg(s.id, { id: slug(p.name), title: p.name, pal: p, ...paletteDetail(p) })}>
          <span class="tile-media"><span class="strip">${p.colors.map((c) => `<span class="tip" data-tip="${c.name}" style="background:${c.hex}"></span>`).join('')}</span></span>
          <span class="pal-cap"><span class="pal-name">${p.name}</span><span class="pal-cols">${p.colors.map((c) => c.name).join(' · ')}</span></span>
        </button>`).join('')}</div>
    </details>`).join('') + (relate(details[s.id], (a, b) => palDist(a.pal, b.pal)), ''),

  typography: (s) => `
    <div class="grid">${s.items.map((t) => `
      <article class="card type"><p class="sample">${t.html}</p><h3>${t.method}</h3><p>${t.use}</p></article>`).join('')}</div>
    <p class="meta">${s.note}</p>
    <details class="group-block"><summary><span>Niche free fonts</span><span class="count">${s.fonts.length}</span>${chevron}</summary>
      <div class="fonts">${s.fonts.map((f) => `<button class="font opens" ${reg(s.id + '-fonts', {
        id: slug(f.name), title: f.name,
        thumb: `<span class="rel-font">Aa</span>`,
        actions: `<a class="pill-btn dark" target="_blank" rel="noopener" href="https://fonts.google.com/?query=${encodeURIComponent(f.name)}">Get the font</a>
          <button class="pill-btn" data-copy="${f.name}"><span class="cp-label">Copy name</span></button>
          <a class="pill-btn" href="#/design-critique/palettes">Pick a palette</a>`,
        html: `<p class="ov-lede">${f.text}</p><p class="font-sample">${f.name}<br>Open Studio 2026</p>`,
        onMount: (el) => { copyWire(el); loadFont(f.name, el.querySelector('.font-sample')); el.querySelectorAll('.rel').forEach((r) => loadFont(r.textContent.replace('Aa', '').trim(), r.querySelector('.rel-font'))); },
      })}><strong data-font="${f.name}">${f.name}</strong></button>`).join('')}</div>
    </details>` + (relate(details[s.id + '-fonts'] || []), ''),

  pairs: (s) => s.groups.map((g, i) => `
    <details class="group-block" ${i === 0 ? 'open' : ''}>
      <summary><span>${g.name}</span><span class="count">${g.items.length}</span>${chevron}</summary>
      <ul class="plain cols3">${g.items.map((x) => `<li>${x}</li>`).join('')}</ul>
    </details>`).join(''),

  steps: (s) => s.tutorials.length < 2 ? s.tutorials.map((t) => `
    <div class="tut"><h3>${t.title}${t.tool ? ` <span class="tool">${t.tool}</span>` : ''}</h3>
      <ol class="strip-steps">${t.steps.map((x) => `<li>${x}</li>`).join('')}</ol></div>`).join('') : s.tutorials.map((t, i) => `
    <details class="group-block acc" ${i === 0 ? 'open' : ''}>
      <summary><span>${t.title}${t.tool ? ` <span class="tool">${t.tool}</span>` : ''}</span><span class="count">${t.steps.length} steps</span>${chevron}</summary>
      <ol class="strip-steps">${t.steps.map((x) => `<li>${x}</li>`).join('')}</ol>
    </details>`).join(''),

  checklist: (s) => capped(s.items, 8, (i) => `
    <label class="check"><input type="checkbox" /><span>${i}</span></label>`, (h) => `<div class="checklist">${h}</div>`),

  commands: (s) => s.groups.map((g, i) => `
    <details class="group-block" ${i === 0 ? 'open' : ''}>
      <summary><span>${g.name}</span><span class="count">${g.items.length}</span>${chevron}</summary>
      <div class="cmds">${g.items.map((c) => `<button class="cmd opens" ${reg(s.id, {
        id: slug(c.name), title: '/' + c.name,
        cat: g.name, thumb: '',
        actions: `<button class="pill-btn dark" data-copy="/impeccable ${c.name}"><span class="cp-label">Copy command</span></button>
          <a class="pill-btn" href="#/impeccable/workflow">How to run commands</a>`,
        html: `<p class="ov-lede">${c.text}</p><code class="cmd-line">/impeccable ${c.name}</code>`,
        onMount: copyWire,
      })}><strong>${c.name}</strong><span>${c.text}</span></button>`).join('')}</div>
    </details>`).join('') + (relate(details[s.id] || []), ''),

  prose: (s) => `<p class="prose">${s.text}</p>`,
};

const renderOne = (s) => (types[s.type] || types.prose)(s);
export const renderSection = (s) => { details = {}; return renderOne(s); };
// Render several sections without wiping the earlier detail registry.
export function renderSections(list) { details = {}; return list.map(renderOne); }
