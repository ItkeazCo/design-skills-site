import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900}, deviceScaleFactor:2 });
const U='http://localhost:5199/';
const boxes = () => p.evaluate(() => [...document.querySelectorAll('main *')].map(e => { const r = { x: e.offsetLeft, y: e.offsetTop, width: e.offsetWidth, height: e.offsetHeight }; return [r.x, r.y, r.width, r.height].map(Math.round).join(','); }).join('|'));
const cases = [['#/design-critique/palettes','.palette'],['#/design-critique/diagnostics','.diag'],['#/design-critique/color','.card.opens'],['#/impeccable/commands','.cmd'],['#/better-typography/wrapping','.card.opens'],['#/apple-motion/springs','.card.opens'],['#/emil-animations/curves','.card.opens'],['#/design-critique/typography','.font', async()=>p.click('.group-block summary')]];
for (let [h, sel, pre] of cases) {
  await p.goto(U+h); await p.waitForTimeout(600); if (pre) { await pre(); await p.waitForTimeout(300); }
  await p.mouse.move(5,5); await p.waitForTimeout(300); const a = await boxes();
  let ok = true; sel = sel + ':visible'; const n = await p.locator(sel).count();
  for (let i = 0; i < Math.min(n, 6); i++) { await p.hover(`${sel} >> nth=${i}`); await p.waitForTimeout(500); if (await boxes() !== a) { ok = false; console.log('SHIFT', h, i); } }
  await p.focus(`${sel} >> nth=0`); await p.waitForTimeout(300); if (await boxes() !== a) { ok = false; console.log('SHIFT focus', h); }
  console.log(h, sel, n, ok ? 'no shift' : 'SHIFT');
}
await p.goto(U+'#/design-critique/palettes'); await p.waitForTimeout(500);
await p.hover('.palette >> nth=3'); await p.hover('.palette >> nth=3 >> .strip span >> nth=3'); await p.waitForTimeout(400);
await p.screenshot({path:'/workspace/design-skills-site/shots/hover-noshift.png'});
await b.close();
