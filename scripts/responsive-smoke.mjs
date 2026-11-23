import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BMP_TEST_URL || 'http://127.0.0.1:4173/';
const suites = [
  ['chromium',chromium,[[320,568],[360,740],[393,852],[430,932],[768,1024],[820,1180],[1024,768],[1280,900]]],
  ['firefox',firefox,[[360,740],[393,852],[430,932]]],
  ['webkit',webkit,[[320,568],[360,740],[393,852],[430,932]]]
];
const failures=[];
await mkdir('artifacts/responsive',{recursive:true});

async function checkNoHorizontalOverflow(page,label) {
 const dimensions=await page.evaluate(()=>({
  viewport:window.innerWidth,
  html:document.documentElement.scrollWidth,
  body:document.body.scrollWidth
 }));
 assert.ok(Math.max(dimensions.html,dimensions.body)<=dimensions.viewport+2,
   label+' has horizontal overflow: '+JSON.stringify(dimensions));
}
async function checkVisible(page,selector,label) {
 const box=await page.locator(selector).first().boundingBox();
 assert.ok(box,label+' is missing');
 const height=page.viewportSize().height;
 assert.ok(box.y>=-3 && box.y+box.height<=height+3,
  label+' exceeds screen height: '+JSON.stringify(box)+' viewport='+height);
}
async function runScreen(browser,engine,width,height) {
 const mobile=engine!=='firefox' && width<768;
 const context=await browser.newContext({
  viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:2,reducedMotion:'reduce'
 });
 const page=await context.newPage();
 const label=engine+' '+width+'x'+height;
 try {
  await page.goto(BASE+'#/',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-pizza-card').first().waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' home');
  await page.getByRole('button',{name:'Открыть меню'}).click().catch(()=>null);
  if(width<768) {
   await page.locator('.bmp-drawer-root--open').waitFor();
   if(height>=620)await checkVisible(page,'.bmp-drawer-footer',label+' drawer footer');
   await page.getByRole('button',{name:'Закрыть меню'}).last().click().catch(()=>null);
  }
  await page.goto(BASE+'#/menu',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-pizza-card').first().waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' menu');
  await page.locator('.bmp-pizza-card button[aria-label="Открыть Ветчина и бекон"]').click();
  await page.locator('.bmp-product-title').waitFor({timeout:15000});
  if(engine==='chromium'&&width===393&&height===852){
   const photo=await page.locator('.bmp-product-hero-photo').evaluate(img=>({
    naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,
    renderedWidth:img.getBoundingClientRect().width,renderedHeight:img.getBoundingClientRect().height,
    src:img.currentSrc
   }));
   console.log('PRODUCT PHOTO SIZE:',JSON.stringify(photo));
  }
  await page.waitForTimeout(120);
  await checkNoHorizontalOverflow(page,label+' modal');
  await checkVisible(page,'.bmp-product-actionbar',label+' add-to-cart');
  if((engine==='chromium' || engine==='webkit') && width===393 && height===852){
   await page.screenshot({path:'artifacts/responsive/'+engine+'-393x852-modal.png'});
  }
  assert.ok(await page.locator('#root').getAttribute('inert')!==null,label+' background must be inert');
  assert.equal(await page.locator('.bmp-product-counter').count(),0,label+' counter must be initially hidden');
  assert.equal(await page.locator('.bmp-product-variants .bmp-product-variant').count(),2,label+' sizes missing');
  await page.getByRole('button',{name:/40 см/}).click();
  assert.equal(await page.locator('.bmp-product-variants .bmp-product-variant[aria-pressed="true"]').count(),1,label+' segmented switch invalid');
  if(width<768 && height>=700) {
   await checkVisible(page,'.bmp-product-extras',label+' extras');
   const geometry=await page.locator('.bmp-product-scroll').evaluate(e=>({scrollHeight:e.scrollHeight,clientHeight:e.clientHeight}));
   assert.ok(geometry.scrollHeight<=geometry.clientHeight+3,label+' modal inner vertical overflow: '+JSON.stringify(geometry));
  }
  await page.locator('.bmp-product-add').click();
  await page.locator('.bmp-product-counter').waitFor({timeout:2500});
  const go=await page.locator('.bmp-product-add').innerText();
  assert.ok(go.includes('Перейти в корзину'),label+' cart state not switched');
  await page.getByRole('button',{name:'Увеличить количество'}).click();
  assert.ok((await page.locator('.bmp-product-counter output').innerText()).includes('2'),label+' quantity not updated');
  await page.locator('.bmp-product-add').click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('#root').getAttribute('inert'),null,label+' background remains inert after close');
  await page.goto(BASE+'#/auth',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-auth-phone').waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' auth');
  if(height>=690) {
   await checkVisible(page,'.bmp-auth-phone',label+' auth form');
   await checkVisible(page,'.bmp-auth-sms',label+' auth SMS action');
   await checkVisible(page,'.bmp-auth-providers',label+' auth social buttons');
   await checkVisible(page,'.bmp-auth-skip',label+' auth skip link');
  }
  if(width>=660 && height>=600) {
   const tablet=await page.evaluate(()=>{
    const frame=document.querySelector('.bmp-auth-frame').getBoundingClientRect();
    const story=document.querySelector('.bmp-auth-story').getBoundingClientRect();
    const actions=document.querySelector('.bmp-auth-actions').getBoundingClientRect();
    const layout=document.querySelector('.bmp-auth-layout');
    return {
     viewport:window.innerWidth,frameX:frame.x,frameWidth:frame.width,
     storyRight:story.right,actionsLeft:actions.left,
     layout:window.getComputedStyle(layout).display,
     height:window.innerHeight
    };
   });
   assert.ok(Math.abs(tablet.frameX)<2 && Math.abs(tablet.frameWidth-tablet.viewport)<2,
     label+' has an artificial narrow frame: '+JSON.stringify(tablet));
   assert.equal(tablet.layout,'grid',label+' should use two real tablet columns');
   assert.ok(tablet.storyRight+10<tablet.actionsLeft,
     label+' tablet story overlaps the sign-in form: '+JSON.stringify(tablet));
   if(engine==='chromium' && (width===768 || width===820 || width===1024)) {
     await page.screenshot({path:'artifacts/responsive/'+engine+'-'+width+'x'+height+'-auth.png'});
   }
  }
  console.log('PASS',label);
 }catch(error){
  const filename='artifacts/responsive/'+engine+'-'+width+'x'+height+'.png';
  await page.screenshot({path:filename,fullPage:true}).catch(()=>{});
  failures.push(label+': '+error.message);
  console.error('FAIL',label,error.message);
 }finally{await context.close()}
}
for(const [name,engine,viewports] of suites){
 const browser=await engine.launch({headless:true});
 try{for(const [width,height] of viewports)await runScreen(browser,name,width,height)}
 finally{await browser.close()}
}
assert.equal(failures.length,0,failures.join('\n'));
console.log('All '+suites.reduce((n,s)=>n+s[2].length,0)+' browser/viewport checks passed.');
