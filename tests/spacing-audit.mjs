import { chromium } from 'playwright';
const OK=new Set([0,2,4,8,12,16,20,24,32,40,64,104]);
const pages=['#/','#/design-critique/palettes','#/design-critique','#/better-typography/wrapping','#/apple-motion/springs','#/unslop-ai-ui','#/story'];
const b=await chromium.launch();
for (const vp of [{width:1440,height:900},{width:390,height:844}]) {
const p=await b.newPage({viewport:vp}); const bad={};
for (const h of pages){ await p.goto('http://localhost:5199/'+h); await p.waitForTimeout(500);
 const r=await p.evaluate((ok)=>{const out=[];for(const el of document.querySelectorAll('body *')){if(!el.offsetParent&&el.tagName!=='BODY')continue;const cs=getComputedStyle(el);
 for(const k of ['paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginBottom','rowGap','columnGap']){const v=parseFloat(cs[k]);if(isNaN(v))continue;if(!ok.includes(Math.round(v)))out.push((el.className&&typeof el.className=='string'?'.'+el.className.split(' ')[0]:el.tagName)+' '+k+' '+v);}}return out;},[...OK]);
 for(const x of r) bad[x]=(bad[x]||0)+1; }
console.log('== ',vp.width, Object.keys(bad).length); console.log(Object.entries(bad).sort((a,b)=>b[1]-a[1]).map(e=>e[1]+' '+e[0]).join('\n'));
await p.close(); }
await b.close();
