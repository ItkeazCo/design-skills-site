import { chromium } from 'playwright';
const b=await chromium.launch();const o='/workspace/design-skills-site/shots/';
for (const vp of [{width:1440,height:900},{width:390,height:844}]){const p=await b.newPage({viewport:vp});
await p.goto('http://localhost:5199/#/story');await p.waitForTimeout(700);
console.log(vp.width, JSON.stringify(await p.evaluate(()=>{const R=s=>document.querySelector(s).getBoundingClientRect();const s=R('.topbar .gt-input'),m=R('.topbar .more-btn'),br=R('.topbar .brand');return {searchH:s.height,moreH:m.height,centres:[br.top+br.height/2,s.top+s.height/2,m.top+m.height/2].map(Math.round),searchCentreX:Math.round(s.left+s.width/2),viewportCentreX:innerWidth/2,items:[...document.querySelectorAll('.topbar > *')].map(e=>e.className.split(' ')[0])}})));
if(vp.width>1000){await p.screenshot({path:o+'topbar-merged.png',clip:{x:0,y:0,width:1440,height:72}});
 await p.click('.more-btn');await p.waitForTimeout(400);await p.screenshot({path:o+'menu-open.png',clip:{x:840,y:0,width:600,height:340}});
 await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('esc closes', await p.evaluate(()=>!document.querySelector('.more-menu')), 'focus back', await p.evaluate(()=>document.activeElement.getAttribute('aria-label')));
 await p.keyboard.press('Enter');await p.waitForTimeout(300);console.log('enter opens', await p.evaluate(()=>!!document.querySelector('.more-menu')), await p.evaluate(()=>document.activeElement.className));}
await p.close();}
await b.close();
