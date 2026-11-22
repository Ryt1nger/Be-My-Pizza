import { chromium, firefox, webkit } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BMP_TEST_URL || 'http://127.0.0.1:4173/';
const suites = [
  ['chromium',chromium,[[320,568],[360,740],[393,852],[430,932],[768,1024],[1280,900]]],
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
  viewport:{width,height},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:2
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
  await page.locator('.bmp-pizza-card button[aria-label^="Открыть"]').first().click();
  await page.locator('.bmp-product-title').waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' modal');
  await checkVisible(page,'.bmp-product-actionbar',label+' add-to-cart');
  if(width<768 && height>=700) {
   await checkVisible(page,'.bmp-product-extras',label+' extras');
  }
  await page.goto(BASE+'#/auth',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-auth-phone').waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' auth');
  if(height>=690)await checkVisible(page,'.bmp-auth-phone',label+' auth form');
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
