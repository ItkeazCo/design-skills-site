// Visual-first: every rule card gets a small sketch picked from its words.
// Humans scan the picture + short title; the full text lives in the overlay and in "Copy for AI".
const bars = (ws, cls = '') => `<span class="sk sk-lines ${cls}">${ws.map((w) => `<i style="width:${w}%"></i>`).join('')}</span>`;
const V = (i, arr) => arr[i % arr.length];
const GLYPHS = ['Aa', 'Ag', 'Rq', 'Gg', 'Ab', 'Ty'];
const S = {
  measure: (i) => `<span class="sk sk-measure">${bars(V(i, [[92, 88, 95, 60], [70, 66, 72, 40], [96, 90, 94, 30]]))}<b class="sk-ruler"></b></span>`,
  wrap: (i) => `<span class="sk sk-wrap">${bars(V(i, [[90, 84, 70], [96, 40], [80, 82, 78, 30], [88, 86]]), 'bal')}</span>`,
  scale: (i) => `<span class="sk sk-scale">${V(i, [[1, .66, .44, .3], [1, .5], [1, .8, .64, .51, .41], [.3, .44, .66, 1], [1, .75, .56]]).map((v) => `<i style="--s:${v}"></i>`).join('')}</span>`,
  space: () => `<span class="sk sk-space"><i></i><i></i><em></em><i></i><i></i></span>`,
  grid: () => `<span class="sk sk-grid">${'<i></i>'.repeat(6)}</span>`,
  weight: () => `<span class="sk sk-type"><b style="font-weight:400">Aa</b><b style="font-weight:600">Aa</b></span>`,
  font: (i) => `<span class="sk sk-type"><b style="font-family:${V(i, ['inherit', 'Georgia, serif', 'ui-monospace, Menlo, monospace'])}">${V(i, GLYPHS)}</b></span>`,
  aa: () => `<span class="sk sk-type"><b>Aa</b></span>`,
  number: () => `<span class="sk sk-type sk-num"><b>1,234</b><b>5,678</b></span>`,
  quote: () => `<span class="sk sk-type"><b>“ — ”</b></span>`,
  contrast: () => `<span class="sk sk-contrast"><i></i><i></i></span>`,
  color: () => `<span class="sk sk-color"><i></i><i></i><i></i></span>`,
  hier: () => `<span class="sk sk-hier"><i></i>${bars([70, 50, 55])}</span>`,
  motion: () => `<span class="sk sk-motion"><svg viewBox="0 0 100 60" aria-hidden="true"><path d="M5 55 C 40 55, 45 5, 95 5"/></svg></span>`,
  time: () => `<span class="sk sk-time"><i style="--w:30%"></i><i style="--w:55%"></i><i style="--w:80%"></i></span>`,
  touch: () => `<span class="sk sk-touch"><i></i></span>`,
  check: () => `<span class="sk sk-check"><i></i>${bars([70])}</span>`,
  layout: () => `<span class="sk sk-layout"><i></i><i></i><i></i></span>`,
  steps: () => `<span class="sk sk-steps"><b>1</b><b>2</b><b>3</b><b>4</b><b>5</b></span>`,
  board: () => `<span class="sk sk-board"><b>Aa</b><span><i></i><i></i><i></i><i></i><i></i></span></span>`,
  refs: () => `<span class="sk sk-trio">${'<i></i>'.repeat(3)}</span>`,
  trio: () => `<span class="sk sk-trio"><i></i><i class="on"></i><i></i></span>`,
  club: () => `<span class="sk sk-face club"><b>Aa</b><i></i></span>`,
  park: () => `<span class="sk sk-face park"><b>aa</b><i></i></span>`,
  glass: () => `<span class="sk sk-face glass"><b></b><i></i></span>`,
  pick: () => `<span class="sk sk-face pick"><b>✓</b></span>`,
  line: () => `<span class="sk sk-line"><i></i><i></i><i></i></span>`,
  note: () => `<span class="sk sk-note"><i></i><b></b></span>`,
  photo: () => `<span class="sk sk-photo"><i></i></span>`,
  flow: () => `<span class="sk sk-flow"><i></i><i class="out"></i><i class="in"></i></span>`,
  empty: () => `<span class="sk sk-face empty"><b></b></span>`,
  lock: () => `<span class="sk sk-lock"><i></i><b></b></span>`,
  queue: () => `<span class="sk sk-queue"><i></i><i></i><i></i></span>`,
  device: () => `<span class="sk sk-device"><i></i><i></i></span>`,
  parts: () => `<span class="sk sk-parts"><i></i><i></i><b></b><b></b></span>`,
  sheets: () => `<span class="sk sk-sheets"><i></i><i></i></span>`,
  index: () => bars([78, 64, 70]),
  compare: () => `<span class="sk sk-compare"><i></i><b>✓</b></span>`,
  word: (i, c) => `<span class="sk sk-type sk-word"><b>${(c.title.match(/[A-Za-z0-9’']+/g) || ['Aa']).sort((a, b) => b.length - a.length)[0]}</b></span>`,
};
const RULES = [
  [/measure|characters per line|line length|\bch\b/i, 'measure'],
  [/wrap|orphan|widow|balance|rag/i, 'wrap'],
  [/scale|size|hierarch|heading/i, 'scale'],
  [/spac|gap|padding|margin|rhythm|density|whitespace/i, 'space'],
  [/grid|align|column|layout/i, 'grid'],
  [/weight|bold/i, 'weight'],
  [/font|typeface|serif|family/i, 'font'],
  [/number|tabular|figure|numeral/i, 'number'],
  [/quote|punctuation|dash|apostroph|ellipsis/i, 'quote'],
  [/contrast|legib|readab/i, 'contrast'],
  [/colou?r|palette|hue|accent|tint/i, 'color'],
  [/focus|emphasis|priority|important/i, 'hier'],
  [/spring|eas|curve|bezier|motion|animat|transition/i, 'motion'],
  [/duration|timing|ms\b|speed|fast|slow/i, 'time'],
  [/touch|tap|hover|target|press|click|interact/i, 'touch'],
  [/check|review|audit|test|before/i, 'check'],
  [/responsive|mobile|breakpoint|viewport/i, 'layout'],
];
export function sketch(c, i = 0) {
  if (c.mark && S[c.mark]) return S[c.mark](i, c);
  const t = `${c.title} ${c.text || ''}`;
  const hit = RULES.find(([re]) => re.test(c.title)) || RULES.find(([re]) => re.test(t));
  return (S[hit ? hit[1] : 'word'])(i, c);
}
