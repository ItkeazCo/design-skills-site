import { chromium } from 'playwright';
import fs from 'fs';
const U='http://localhost:5199/';
const pages=['#/','#/story','#/design-critique','#/design-critique/palettes','#/design-critique/diagnostics','#/design-critique/hierarchy','#/design-critique/color-rules','#/design-critique/typography','#/design-critique/tutorials','#/unslop-ai-ui','#/impeccable','#/better-typography/critical','#/apple-motion/springs','#/emil-animations/curves','#/m3-motion','#/motion-design'];
const b=await chromium.launch();const byType={};const nest=[];
const collect=async(p,where)=>{const r=await p.evaluate(()=>{const out=[],bad=[];
 const vis=(e)=>{const c=getComputedStyle(e);return (c.backgroundColor!=='rgba(0, 0, 0, 0)'&&c.backgroundColor!=='transparent')||c.backgroundImage!=='none'||parseFloat(c.borderTopWidth)>0||c.boxShadow!=='none'||e.tagName==='IMG'};
 for(const e of document.querySelectorAll('body *')){const rr=e.getBoundingClientRect();if(!rr.width||!rr.height||!e.offsetParent&&getComputedStyle(e).position!=='fixed')continue;
  const c=getComputedStyle(e);if(!vis(e))continue; if(rr.width>=innerWidth-1||rr.height<=3||rr.width<=3)continue; if(c.boxShadow.startsWith('inset')&&c.backgroundColor==='rgba(0, 0, 0, 0)')continue;
  const cls=(typeof e.className==='string'&&e.className.trim())?e.className.trim().split(/\s+/).filter(x=>!/^(is-|on$|done$|copied$|current$|in$|show$|dark$|single$|closing$)/.test(x)).slice(0,2).join('.'):e.tagName.toLowerCase();
  const rad=[c.borderTopLeftRadius,c.borderTopRightRadius,c.borderBottomRightRadius,c.borderBottomLeftRadius].map(v=>Math.round(parseFloat(v)));
  const pill=rad[0]>=500||(rad[0]>=rr.height/2-0.5&&c.borderTopLeftRadius.includes("%"));const circle=pill&&Math.abs(rr.width-rr.height)<1;
  const sheet=innerWidth<761&&rad[0]>0&&rad[2]===0&&rad[3]===0&&rad[0]===rad[1];const key=c.borderTopLeftRadius.includes("%")?"round":circle?'circle':pill?'pill':sheet?'sheet('+rad[0]+')':(rad.every(x=>x===rad[0])?rad[0]+'':rad.join('/'));out.push([key==="round"||key==="circle"?"(round shapes)":cls,key==="circle"?"round":key]);
  // nesting: nearest ancestor that is a visible rounded surface
  let a=e.parentElement;while(a&&a!==document.body){const ac=getComputedStyle(a);if(vis(a)&&parseFloat(ac.borderTopLeftRadius)>0&&ac.overflow!=='visible'||vis(a)&&parseFloat(ac.borderTopLeftRadius)>0)break;a=a.parentElement;}
  if(a&&a!==document.body&&!pill){const ar=a.getBoundingClientRect();const R=parseFloat(getComputedStyle(a).borderTopLeftRadius);const R2=Math.min(R,ar.height/2,ar.width/2);
   const d=Math.min(rr.left-ar.left,rr.top-ar.top);const corner=(rr.left-ar.left)<R2&&(rr.top-ar.top)<R2; // element sits in the corner zone
   const clips=getComputedStyle(a).overflow!=='visible'; if(corner&&d>=0&&!(clips&&d<1)){const exp=Math.max(R2-d,0);if(Math.abs(rad[0]-exp)>2)bad.push([cls,'inside',(typeof a.className==='string'?a.className.split(' ')[0]:a.tagName),'R',Math.round(R2),'inset',Math.round(d),'has',rad[0],'want',Math.round(exp)]);}}
 }return {out,bad};});
 for(const [c,k] of r.out){(byType[c]=byType[c]||{})[k]=((byType[c]||{})[k]||0)+1;} for(const x of r.bad)nest.push(where+' '+x.join(' '));};
for(const vp of [{width:1440,height:900},{width:390,height:844}]){const p=await b.newPage({viewport:vp});
 for(const h of pages){await p.goto(U+h);await p.waitForTimeout(350);await collect(p,vp.width+h);}
 await p.goto(U+'#/design-critique/palettes');await p.waitForTimeout(400);await p.locator('button.opens:visible').first().click();await p.waitForTimeout(700);await collect(p,vp.width+' overlay');
 await p.close();}
const norm=(v)=>Object.keys(v).map(k=>k.replace(/^sheet\((\d+)\)$/,'$1'));const mism=Object.entries(byType).filter(([c,v])=>new Set(norm(v)).size>1);
console.log('TYPES',Object.keys(byType).length,'MISMATCH',mism.length);for(const [c,v] of mism)console.log('  ',c,JSON.stringify(v));
process.exitCode=(mism.length||new Set(nest).size)?1:0;
console.log('TABLE');for(const [c,v] of Object.entries(byType).sort((x,y)=>Object.keys(x[1])[0].localeCompare(Object.keys(y[1])[0])))console.log('  '+c.padEnd(28)+Object.keys(v).join(', ').padEnd(14)+Object.values(v).reduce((a,b)=>a+b,0));
console.log('NEST',[...new Set(nest)].length);console.log([...new Set(nest)].slice(0,60).join('\n'));
fs.writeFileSync('/tmp/rad.json',JSON.stringify({byType,nest:[...new Set(nest)]},null,1));
await b.close();
