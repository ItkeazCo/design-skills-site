import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
const U='http://localhost:5199/';
const C=[ // [name, page, selector, needsOverlay]
 ['More options','#/story','.topbar .more-btn'],
 ['Menu item','#/story','.more-menu .mi',2],
 ['Search field','#/story','.topbar .gt-input input'],
 ['Segmented opt','#/story','.more-menu .gt-seg__opt:not(.is-on)',2],
 ['Tree toggle','#/design-critique','.toggle.gt-iconbtn'],
 ['Tree link','#/design-critique','.leaf'],
 ['Tile','#/','.entry.tile'],
 ['Palette tile','#/design-critique/palettes','button.opens'],
 ['Group summary','#/design-critique/palettes','details.group-block > summary'],
 ['Mini play','#/apple-motion/springs','.mini-play'],
 ['Pager link','#/design-critique/palettes','.pager a'],
 ['Back link','#/design-critique/palettes','.up'],
 ['Overlay action','#/design-critique/palettes','.ov-acts button',1],
 ['Overlay icon btn','#/design-critique/palettes','.ov-nav .gt-iconbtn:not([disabled])',1],
 ['Overlay disabled','#/design-critique/palettes','.ov-nav .gt-iconbtn[disabled]',1],
 ['Related item','#/design-critique/palettes','.rel',1],
];
const skipped=[];const issues=[], cells=[], errs=[];
const b=await chromium.launch();
const ringFn=`(el)=>{const cs=getComputedStyle(el);
 const rings=[];if(cs.outlineStyle!=='none'&&parseFloat(cs.outlineWidth)>0)rings.push('outline');
 if(/\\b0px 0px 0px [1-9]/.test(cs.boxShadow)||/ 0px 0px [1-9]px$/.test(cs.boxShadow)||/0px 0px 0px [1-9]/.test(cs.boxShadow))rings.push('shadow');
 const host=el.closest('.gt-input');let hostRings=[];if(host){const h=getComputedStyle(host);if(/0px 0px 0px [1-9]/.test(h.boxShadow))hostRings.push('host-shadow');if(h.outlineStyle!=='none'&&parseFloat(h.outlineWidth)>0)hostRings.push('host-outline');}
 const kids=[...el.querySelectorAll('*')].filter(k=>{const k2=getComputedStyle(k);return (k2.outlineStyle!=='none'&&parseFloat(k2.outlineWidth)>0)||/0px 0px 0px [1-9]/.test(k2.boxShadow)}).length;
 const r=el.getBoundingClientRect();return {rings,hostRings,kids,radius:cs.borderTopLeftRadius,hostRadius:host?getComputedStyle(host).borderTopLeftRadius:null,box:[r.x,r.y,r.width,r.height]};}`;
for (const theme of ['light','dark']) for (const vp of [{n:'desktop',width:1440,height:900},{n:'mobile',width:390,height:844}]) {
 const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},colorScheme:theme,hasTouch:vp.n==='mobile'});
 await ctx.addInitScript((t)=>localStorage.setItem('theme',t),theme);const p=await ctx.newPage();p.on('console',m=>{if(m.type()==='error')errs.push(`${theme}/${vp.n}: ${m.text().slice(0,160)}`)});p.on('pageerror',e=>errs.push('PAGE '+e.message));
 for (const [name,h,sel,ov] of C){
  await p.goto(U+'#/');await p.goto(U+h);await p.waitForTimeout(400);
  if(vp.n==='mobile' && /Tree|sidebar/.test(name)){await p.click('.more-btn');await p.waitForTimeout(300);await p.click('.mi-skills');await p.waitForTimeout(300);}
  if(ov===2){await p.click('.more-btn');await p.waitForTimeout(400);}
  else if(ov){await p.locator('button.opens:visible').first().click();await p.waitForTimeout(600);}
  const loc=p.locator(sel).filter({visible:true}).first();
  if(!await loc.count()){skipped.push(`${theme}/${vp.n} ${name}`);continue;}
  await loc.scrollIntoViewIfNeeded();await p.waitForTimeout(150);
  const disabled=await loc.isDisabled().catch(()=>false);
  const shot=async(state)=>{const bb=await loc.boundingBox();if(!bb)return;const pad=10;const f=`/tmp/qa/${theme}-${vp.n}-${name.replace(/\W+/g,'_')}-${state}.png`;
   await p.screenshot({path:f,clip:{x:Math.max(0,bb.x-pad),y:Math.max(0,bb.y-pad),width:Math.min(bb.width+pad*2,360),height:Math.min(bb.height+pad*2,240)}});cells.push({theme,vp:vp.n,name,state,f});};
  await p.mouse.move(0,0);await p.waitForTimeout(200);await shot(disabled?'disabled':'default');
  if(disabled) continue;
  const before=await loc.boundingBox();
  if(vp.n==='desktop'){await loc.hover();await p.waitForTimeout(250);await shot('hover');const a=await loc.boundingBox();if(Math.abs(a.width-before.width)>0.5||Math.abs(a.height-before.height)>0.5)issues.push(`${theme}/${vp.n} ${name}: hover changes size ${JSON.stringify([before,a])}`);await p.mouse.move(0,0);}
  // keyboard modality, then focus
  await p.keyboard.press('Shift');await loc.focus();await p.waitForTimeout(250);
  const r=await loc.evaluate(eval(ringFn));
  await shot('focus');
  const total=r.rings.length+r.hostRings.length+r.kids;
  if(r.radius==='0px' && r.rings.includes('outline'))issues.push(`${theme}/${vp.n} ${name}: square focus ring (radius 0)`);
  if(total===0)issues.push(`${theme}/${vp.n} ${name}: no visible focus ring`);
  if(total>1)issues.push(`${theme}/${vp.n} ${name}: double focus ring ${JSON.stringify(r)}`);
  if(r.hostRadius && r.rings.length)issues.push(`${theme}/${vp.n} ${name}: ring on inner input, not on field (radius ${r.radius} vs ${r.hostRadius})`);
  const bb=await loc.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.waitForTimeout(120);await shot('pressed');await p.mouse.up();
  await p.keyboard.press('Escape').catch(()=>{});
 }
 for (const h of ['#/','#/design-critique/palettes','#/story','#/apple-motion/springs']){await p.goto(U+h);await p.waitForTimeout(500);
  const a=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  for(const v of a.violations) issues.push(`axe ${theme}/${vp.n} ${h}: ${v.id} (${v.impact}) x${v.nodes.length} e.g. ${v.nodes[0].target.join(' ')}`);}
 await p.goto(U+'#/design-critique/palettes');await p.waitForTimeout(400);await p.locator('button.opens:visible').first().click();await p.waitForTimeout(700);
 const a=await new AxeBuilder({page:p}).include('.ov-dialog').withTags(['wcag2a','wcag2aa']).analyze();
 for(const v of a.violations) issues.push(`axe ${theme}/${vp.n} overlay: ${v.id} (${v.impact}) x${v.nodes.length} e.g. ${v.nodes[0].target.join(' ')}`);
 await ctx.close();
}
// grid sheet
const rows={};for(const c of cells){const k=`${c.theme} · ${c.vp} · ${c.name}`;(rows[k]=rows[k]||{})[c.state]=c.f;}
const S=['default','hover','focus','pressed','disabled'];
const html=`<html><body style="font:12px Inter,sans-serif;margin:16px;background:#fff"><table style="border-collapse:separate;border-spacing:8px"><tr><th></th>${S.map(s=>`<th>${s}</th>`).join('')}</tr>${Object.entries(rows).map(([k,v])=>`<tr><td style="white-space:nowrap">${k}</td>${S.map(s=>`<td style="background:#eee;text-align:center">${v[s]?`<img style="max-width:220px;max-height:120px" src="file://${v[s]}">`:''}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
fs.writeFileSync('/tmp/qa/sheet.html',html);
const p=await b.newPage({viewport:{width:1300,height:800}});await p.goto('file:///tmp/qa/sheet.html');await p.waitForTimeout(500);
await p.screenshot({path:'/workspace/design-skills-site/shots/qa-states.png',fullPage:true});
console.log('CELLS',cells.length,'SKIPPED (not shown at this breakpoint)',skipped.join(', '));console.log('ISSUES',issues.length);console.log([...new Set(issues)].join('\n'));console.log('CONSOLE ERRORS',errs.length);console.log([...new Set(errs)].slice(0,10).join('\n'));
await b.close();
