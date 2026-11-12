import { skills, categories } from './skills/index.js';
import { curveSvg } from './demo.js';
import { renderSection, renderSections } from './render.js';
import { sketch } from './sketch.js';
// Page bodies stay data-driven HTML (content); all UI chrome is React + Graphite.
// One line only: first sentence, the rest is for the overlay / Copy for AI.
export const oneLine = (t) => (t || '').split(/(?<=[.!?])\s/)[0];
export const short = (o) => o.short || o.title;
const copyIcon = `<svg class="gt-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const aiBtn = (key) => `<button class="gt-btn gt-btn--soft gt-btn--md ai-copy" data-ai="${key}">${copyIcon}<span class="cp-label">Copy for AI</span></button>`;
const article = (s) => s.sourceUrl ? `<a class="article-link" href="${s.sourceUrl}" target="_blank" rel="noopener">Article</a>` : '';
const head = (s, title, intro, crumb, key) => `
  <header class="page-head">
    ${crumb ? `<a class="up" href="#/${s.slug}"><span class="arr">←</span> ${s.title}</a>` : ''}
    <h1>${title}</h1>
    ${intro ? `<p class="lede">${oneLine(intro)}</p>` : ''}
    ${key ? `<div class="head-acts">${s.category === 'Workflow' ? article(s) : ''}${aiBtn(key)}</div>` : ''}
  </header>`;

const grip = `<svg class="cmp-arrows" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5 2.5 8 6 12.5M10 3.5 13.5 8 10 12.5"/></svg>`;
// One component, split by a drag handle: before stays on the left, after is revealed from the right.
const ex = (kind, bad, good) => `<span class="ex-card ${kind} good">${good}</span><span class="cmp-before"><span class="ex-card ${kind} bad">${bad}</span></span><span class="cmp-bar"></span><span class="cmp-grip">${grip}</span><span class="cmp-tag is-before">Before</span><span class="cmp-tag is-after">After</span>`;
const SCENES = {
  'design-critique': () => ex('critique', '<b>Launch</b><b>Planning</b><b>Review</b>', '<b>Launch</b><span>Planning for Friday.</span><em>Review</em>'),
  'unslop-ai-ui': () => ex('unslop', '<i>New</i><b>Ship the plan</b><em>Get started</em>', '<b>Ship the plan</b><span>Decisions in one view.</span><em>Review plan</em>'),
  impeccable: () => ex('polish', '<i>New</i><b>Ship the plan</b><span>Click here</span>', '<small>On track</small><b>Ship the plan</b><em>Review plan</em>'),
  'better-typography': () => ex('type', '<b>Ship Friday.</b><span>"Don\'t wrap this headline across the card."</span>', '<b>Ship Friday.</b><span>“Don’t wrap this.”</span>'),
  'ux-review': () => ex('review', '<small>Frozen</small><b>Save</b><i></i>', '<small>Saving</small><b>Save</b><i></i>'),
  'ux-patterns': () => ex('patterns', '<small>Account</small><b>Sign in</b>', '<small>Checkout</small><b>Guest</b><em>Sign in</em>'),
  'icon-construction': () => ex('icon',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="0.4" stroke-dasharray="1 0.6" opacity="0.45"/><rect x="8" y="4" width="20" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="0.4" stroke-dasharray="1 0.6" opacity="0.45"/><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>'),
  'apple-motion': () => ex('press', '<small>Linear</small><i></i><b>Save</b>', '<small>Spring</small><i></i><b>Save</b>'),
  'apple-design': () => ex('sheet', '<small>Lags</small><i></i><span class="pop"><b>Filters</b><span>Nearby</span></span>', '<small>Follows</small><i></i><span class="pop"><b>Filters</b><span>Nearby</span></span>'),
  'emil-animations': () => ex('dialog', '<small>From far</small><span class="pop"><b>Saved</b></span>', '<small>A few pixels</small><span class="pop"><b>Saved</b></span>'),
  'm3-motion': () => ex('inbox', '<small>Crossfade</small><span class="pop"><b>Inbox</b></span><span class="ghost">Today</span>', '<small>Grows</small><span class="pop"><b>Inbox</b><span>Today</span></span>'),
  'motion-design': () => ex('beats', '<small>At once</small><b>Arrive</b><b>Hold</b><b>Leave</b>', '<small>Staggered</small><b>Arrive</b><b>Hold</b><b>Leave</b>'),
  '87-screens': () => ex('app', '<b>Welcome</b><em>Continue</em>', '<b>Boop</b><span>The park is open.</span><em>See dogs</em>'),
};
function beforeAfter(s) {
  const scene = SCENES[s.slug];
  if (!scene) return '';
  const start = s.category === 'Motion' ? 50 : 24;
  return `<span class="cmp" style="--ba:${s.accent};--p:${start}"><span class="cmp-stage">${scene()}</span><input class="cmp-range" type="range" min="0" max="100" value="${start}" aria-label="Reveal the after"></span>`;
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
        <span class="tile-media">${beforeAfter(s)}</span>
        <span class="tile-cap"><h3>${short(s)}</h3></span>
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
  return sketch({ title: x.title, text: x.intro || x.text || '', mark: x.mark });
}

const credit = (s) => s.sources?.length
  ? `<div class="sources"><p>Sources</p><ul>${s.sources.map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">${x.name}</a></li>`).join('')}</ul></div>`
  : `<p class="credits">${s.sourceUrl ? `<a href="${s.sourceUrl}" target="_blank" rel="noopener">${s.source}</a>` : s.source}</p>`;

function tabBar(s, active, links) {
  const opts = s.sections.map((x) => {
    const on = x.id === active;
    const cls = `gt-seg__opt${on ? ' is-on' : ''}`;
    return links
      ? `<a class="${cls}" role="tab" aria-selected="${on}" href="#/${s.slug}/${x.id}">${short(x)}</a>`
      : `<button type="button" class="${cls}" role="tab" id="tab-${s.slug}-${x.id}" aria-selected="${on}" aria-controls="panel-${s.slug}-${x.id}" data-tab="${x.id}">${short(x)}</button>`;
  }).join('');
  return `<div class="gt-seg gt-seg--md pattern-tabs" role="tablist" aria-label="Pattern sets">${opts}</div>`;
}
function tabPanels(s) {
  const html = renderSections(s.sections);
  return tabBar(s, s.sections[0].id, false) + s.sections.map((x, i) => `
    <div class="pattern-panel" role="tabpanel" id="panel-${s.slug}-${x.id}" aria-labelledby="tab-${s.slug}-${x.id}" data-panel="${x.id}"${i ? ' hidden' : ''}>
      <div class="head-acts">${aiBtn(`${s.slug}/${x.id}`)}</div>
      <div class="body">${html[i]}</div>
    </div>`).join('');
}
export function overview(s) {
  const hero = beforeAfter(s).replace('class="cmp"', 'class="cmp cmp-wide"');
  if (s.tabs) return head(s, s.title, s.overview.purpose, false, null) + hero + tabPanels(s) + credit(s);
  return head(s, s.title, s.overview.purpose, false, s.slug) + hero + `
    <div class="entries ov-board">${s.sections.map((x) => `
      <a class="entry tile" href="#/${s.slug}/${x.id}">
        <span class="tile-media">${sectionVisual(x)}</span>
        <span class="tile-cap"><h2>${short(x)}</h2></span>
      </a>`).join('')}</div>${credit(s)}`;
}

export function section(s, x) {
  const i = s.sections.indexOf(x);
  const prev = s.sections[i - 1], next = s.sections[i + 1];
  return head(s, x.title, x.intro, true, `${s.slug}/${x.id}`) + (s.tabs ? tabBar(s, x.id, true) : '') + `<div class="body">${renderSection(x)}</div>${credit(s)}
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
  return `- **${val(t)}**${body ? ': ' + body : ''}${i.url ? '\n  ' + i.url : ''}${i.css ? '\n\n```css\n' + i.css + '\n```' : ''}`;
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
const yamlQuote = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`;
function skillDescription(s) {
  const what = val(s.overview?.purpose || s.summary || '').replace(/\s+/g, ' ').trim();
  let when = val(s.overview?.when || '').replace(/\s+/g, ' ').trim();
  if (when) when = when.charAt(0).toLowerCase() + when.slice(1);
  return [what, when && `Use when ${when}`].filter(Boolean).join(' ').slice(0, 1024);
}
function skillFile(s, body) {
  const source = s.sourceUrl ? `[${s.source}](${s.sourceUrl})` : s.source;
  const takeaways = (s.overview?.takeaways || []).map((t) => `- ${val(t)}`).join('\n');
  const head = ['---', `name: ${s.slug}`, `description: ${yamlQuote(skillDescription(s))}`, '---', '', `# ${s.title}`, '', `Source: ${source}`];
  if (takeaways) head.push('', takeaways);
  return [...head, '', body].join('\n');
}
export function toMarkdown(key) {
  const [slug, id] = key.split('/');
  const s = skills.find((k) => k.slug === slug);
  if (!s) return '';
  const sections = id ? [s.sections.find((x) => x.id === id)].filter(Boolean) : s.sections;
  return skillFile(s, sections.map(sectionMd).join('\n\n'));
}
