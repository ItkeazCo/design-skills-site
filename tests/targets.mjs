import { chromium } from 'playwright';
const b = await chromium.launch();
const pages = ['#/', '#/design-critique', '#/design-critique/palettes', '#/design-critique/palettes?p=fitness', '#/design-critique/diagnostics', '#/design-critique/typography', '#/impeccable/commands', '#/apple-motion/springs', '#/apple-motion/springs?p=smooth', '#/design-critique/tutorials', '#/unslop-ai-ui/checklist', '#/story'];
for (const [w, h, min, tag, mobile] of [[1440, 900, 32, 'desktop', false], [390, 844, 44, 'mobile', true]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile });
  const p = await ctx.newPage(); const bad = new Map(); let n = 0;
  for (const u of pages) {
    await p.goto('http://localhost:5199/' + u); await p.waitForTimeout(700);
    const r = await p.evaluate((min) => [...document.querySelectorAll('a, button, summary, input:not([type=checkbox]), label.check')].filter((e) => e.offsetParent && !e.closest('.story p, .story li, .prose, .ov-body p')).map((e) => { const r0 = e.getBoundingClientRect(); const host = e.matches('input') && e.closest('.gt-input') || e; const a = getComputedStyle(host, '::after'); let w = Math.max(r0.width, host.getBoundingClientRect().width), h = Math.max(r0.height, host.getBoundingClientRect().height); if (a.content !== 'none' && a.position === 'absolute' && !getComputedStyle(host).getPropertyValue('--hit-slop')) { const hr = host.getBoundingClientRect(); h = Math.max(h, hr.height - parseFloat(a.top) - parseFloat(a.bottom)); w = Math.max(w, hr.width - parseFloat(a.left) - parseFloat(a.right)); } const slop = parseFloat(getComputedStyle(host).getPropertyValue('--hit-slop')) || 0; if (slop && host !== e) h = Math.max(h, host.getBoundingClientRect().height + 2 * slop); const r = { width: w, height: h }; return [e.className || e.tagName, e.textContent.trim().slice(0, 24), Math.round(r.width), Math.round(r.height)]; }).filter((x) => x[2] > 0), min);
    n += r.length;
    r.filter((x) => x[2] < min || x[3] < min).forEach((x) => bad.set(x[0] + '|' + x[1], x));
  }
  console.log(tag, 'checked', n, 'under', min + 'px:', bad.size); [...bad.values()].slice(0, 30).forEach((x) => console.log('  ', x.join(' · ')));
  await ctx.close();
}
await b.close();
