import { skills, categories } from './skills/index.js';
import { curveSvg } from './demo.js';
import { renderSection } from './render.js';
import { sketch } from './sketch.js';
// Page bodies stay data-driven HTML (content); all UI chrome is React + Graphite.
// One line only: first sentence, the rest is for the overlay / Copy for AI.
export const oneLine = (t) => (t || '').split(/(?<=[.!?])\s/)[0];
export const short = (o) => o.short || o.title;
const copyIcon = `<svg class="gt-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const aiBtn = (key) => `<button class="gt-btn gt-btn--soft gt-btn--md ai-copy" data-ai="${key}">${copyIcon}<span class="cp-label">Copy for AI</span></button>`;
const head = (s, title, intro, crumb, key) => `
  <header class="page-head">
    ${crumb ? `<a class="up" href="#/${s.slug}"><span class="arr">←</span> ${s.title}</a>` : ''}
    <h1>${title}</h1>
    ${intro ? `<p class="lede">${oneLine(intro)}</p>` : ''}
    ${key ? `<div class="head-acts">${aiBtn(key)}</div>` : ''}
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

export function home() {
  return `
    <header class="page-head home-head">
      <h1>Design skills</h1>
      <p class="lede">Design checks you can see.</p>
    </header>
    ${categories.map((c) => `<h2 class="home-cat">${c}</h2>
    <div class="entries">${skills.filter((s) => s.category === c).map((s) => `
      <a class="entry tile" href="#/${s.slug}">
        <span class="tile-media">${preview(s)}</span>
        <span class="tile-cap"><h2>${short(s)}</h2></span>
      </a>`).join('')}</div>`).join('')}`;
}

// One picture per section. The sentences stay in Copy for AI.
function sectionVisual(x) {
  if (x.type === 'palettes') {
    const p = x.groups?.flatMap((g) => g.palettes || [])[1] || x.groups?.[0]?.palettes?.[0];
    if (p) return `<span class="sws">${p.colors.map((c) => `<span class="sw" style="background:${c.hex}"></span>`).join('')}</span>`;
  }
  const demo = (x.items || []).find((i) => i && i.demo);
  if (demo) return curveSvg(demo.demo.ease, 'card-curve');
  if (x.type === 'typography') return '<span class="pv-type">Aa</span>';
  if (x.type === 'commands') {
    const name = x.groups?.flatMap((g) => g.items || [])[0]?.name || 'polish';
    return `<span class="pv-cmd">/${name}</span>`;
  }
  return sketch({ title: x.title, text: x.intro || x.text || '' });
}

export function overview(s) {
  return head(s, s.title, s.overview.purpose, false, s.slug) + `
    <div class="entries ov-board">${s.sections.map((x) => `
      <a class="entry tile" href="#/${s.slug}/${x.id}">
        <span class="tile-media">${sectionVisual(x)}</span>
        <span class="tile-cap"><h2>${short(x)}</h2></span>
      </a>`).join('')}</div>`;
}

export function section(s, x) {
  const i = s.sections.indexOf(x);
  const prev = s.sections[i - 1], next = s.sections[i + 1];
  return head(s, x.title, x.intro, true, `${s.slug}/${x.id}`) + `<div class="body">${renderSection(x)}</div>
    <nav class="pager">
      ${prev ? `<a class="prev" href="#/${s.slug}/${prev.id}"><span class="meta"><span class="arr">←</span> Previous</span>${short(prev)}</a>` : `<a class="prev" href="#/${s.slug}"><span class="meta"><span class="arr">←</span> Back to</span>Overview</a>`}
      ${next ? `<a class="next" href="#/${s.slug}/${next.id}"><span class="meta">Next <span class="arr">→</span></span>${short(next)}</a>` : '<span></span>'}
    </nav>`;
}


// Full text for agents: the whole skill or one section as markdown.
const val = (v) => (typeof v === 'string' ? v.replace(/<[^>]+>/g, '') : '');
function itemMd(i) {
  if (typeof i === 'string') return `- ${val(i)}`;
  const t = i.title || i.name || i.label || '';
  const body = ['text', 'more', 'fix', 'why', 'how', 'desc', 'description'].map((k) => val(i[k])).filter(Boolean).join(' ');
  return `- **${val(t)}**${body ? ': ' + body : ''}${i.css ? '\n\n```css\n' + i.css + '\n```' : ''}`;
}
function sectionMd(x) {
  const out = [`## ${x.title}`];
  if (x.intro) out.push(val(x.intro));
  if (x.text) out.push(val(x.text));
  (x.items || []).forEach((i) => out.push(itemMd(i)));
  (x.tutorials || []).forEach((t) => { out.push(`### ${t.title}`); t.steps.forEach((st, k) => out.push(`${k + 1}. ${val(st)}`)); });
  (x.groups || []).forEach((g) => { out.push(`### ${g.title || g.name || ''}`); (g.palettes || g.items || []).forEach((p) => out.push(`- ${p.name || p.title}: ${(p.colors || []).map((c) => `${c.name} ${c.hex}`).join(', ')}`)); });
  (x.commands || []).forEach((c) => out.push(itemMd(c)));
  (x.pairs || []).forEach((c) => out.push(itemMd(c)));
  return out.join('\n\n');
}
export function toMarkdown(key) {
  const [slug, id] = key.split('/');
  const s = skills.find((k) => k.slug === slug);
  if (!s) return '';
  if (id) return `# ${s.title}: ${s.sections.find((x) => x.id === id).title}\n\nSource: ${s.source}\n\n` + sectionMd(s.sections.find((x) => x.id === id));
  const o = s.overview;
  return [`# ${s.title}`, `Source: ${s.source}${s.sourceUrl ? ' (' + s.sourceUrl + ')' : ''}`, val(o.purpose), `**When to use it:** ${val(o.when)}`, '**Key takeaways:**\n' + o.takeaways.map((t) => `- ${val(t)}`).join('\n'), ...s.sections.map(sectionMd)].join('\n\n');
}
