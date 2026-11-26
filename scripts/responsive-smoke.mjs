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
  assert.equal(await page.locator('.bmp-popular-track .bmp-pizza-card').count(),4,
    label+' popular strip must have four pizzas');
  if(width<768){
    const track=await page.locator('.bmp-popular-track').evaluate(el=>({scroll:el.scrollWidth,visible:el.clientWidth}));
    assert.ok(track.scroll>track.visible+20,
      label+' popular products are not horizontally scrollable: '+JSON.stringify(track));
    if(engine==='chromium'&&width===393){
      await page.getByRole('button',{name:'Следующие популярные пиццы'}).click();
      await page.waitForTimeout(350);
      const offset=await page.locator('.bmp-popular-track').evaluate(el=>el.scrollLeft);
      assert.ok(offset>5,label+' next popular carousel arrow did not scroll');
      await page.screenshot({path:'artifacts/responsive/chromium-393x852-popular-carousel.png'});
    }
  }
  await checkNoHorizontalOverflow(page,label+' home');
  await page.getByRole('button',{name:'Открыть меню'}).click().catch(()=>null);
  if(width<768) {
   await page.locator('.bmp-drawer-root--open').waitFor();
   if(height>=620)await checkVisible(page,'.bmp-drawer-footer',label+' drawer footer');
   await page.getByRole('button',{name:'Закрыть меню'}).last().click().catch(()=>null);
  }
  await page.goto(BASE+'#/menu',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-menu-category-card').first().waitFor({timeout:15000});
  assert.equal(await page.locator('.bmp-menu-category-card').count(),3,label+' menu must show only populated categories');
  assert.equal(await page.locator('.bmp-menu-category-card[href$="/menu/combo"], .bmp-menu-category-card[href$="/menu/desserts"]').count(),0,
    label+' empty combo/desserts categories are visible');
  const categoryPhotos=page.locator('.bmp-menu-category-image');
  for(let i=0;i<3;i++){
   await categoryPhotos.nth(i).scrollIntoViewIfNeeded();
   await categoryPhotos.nth(i).evaluate(async img=>{await img.decode();});
   const ok=await categoryPhotos.nth(i).evaluate(img=>img.naturalWidth>0);
   assert.ok(ok,label+' missing category photo at index '+i);
  }
  const bannerGeometry=await page.locator('.bmp-menu-category-card').evaluateAll(cards=>
    cards.map(card=>{
      const frame=card.getBoundingClientRect();
      const text=card.querySelector('.bmp-menu-category-body').getBoundingClientRect();
      const photo=card.querySelector('.bmp-menu-category-image').getBoundingClientRect();
      return {
        height:frame.height,
        border:window.getComputedStyle(card).borderTopWidth,
        textTop:text.top-frame.top,
        textBottom:frame.bottom-text.bottom,
        photoInset:frame.top-photo.top
      };
    })
  );
  assert.ok(bannerGeometry.every(item=>item.border==='0px'&&item.height>=99&&item.height<=176),
    label+' category banners have borders or incorrect height: '+JSON.stringify(bannerGeometry));
  assert.ok(bannerGeometry.every(item=>item.photoInset>=4),
    label+' category imagery does not cover its source edge: '+JSON.stringify(bannerGeometry));
  await page.evaluate(()=>window.scrollTo(0,0));
  await checkNoHorizontalOverflow(page,label+' category landing');
  if(engine==='chromium'&&width===393&&height===852){
   await page.screenshot({path:'artifacts/responsive/chromium-393x852-menu-categories.png'});
  }
  if(engine==='chromium'&&width===393&&height===852){
   // Owner-supplied photos must load, not show ImageOff placeholders.
   for(const [category,products] of [
     ['snacks',['Картошка фри','Батат фри']],
     ['drinks',['Ягодный морс']]
   ]){
     await page.goto(BASE+'#/menu/'+category,{waitUntil:'domcontentloaded'});
     for(const name of products){
       const photo=page.locator('button[aria-label="Открыть '+name+'"] img').first();
       await photo.waitFor({timeout:15000});
       await photo.scrollIntoViewIfNeeded();
       const state=await photo.evaluate(async img=>{
         await img.decode();
         return {naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight};
       });
       assert.ok(state.naturalWidth>=800&&state.naturalHeight>=800,
         label+' missing high-resolution photo for '+name+': '+JSON.stringify(state));
     }
   }
   await page.goto(BASE+'#/menu',{waitUntil:'domcontentloaded'});
   await page.locator('.bmp-menu-category-card[href$="/menu/pizza"]').waitFor();
  }
  await page.locator('.bmp-menu-category-card[href$="/menu/pizza"]').click();
  await page.locator('.bmp-pizza-card').first().waitFor({timeout:15000});
  assert.equal(await page.locator('.bmp-pizza-card .bmp-pizza-composition').count(),9,
    label+' pizza cards must show the confirmed ingredient descriptions');
  if(engine==='chromium'&&width===393){
    await page.getByRole('button',{name:'Дополнительные фильтры'}).click();
    await page.getByRole('button',{name:'Грибы',exact:true}).click();
    assert.equal(await page.locator('.bmp-menu-products-grid .bmp-pizza-card').count(),1,
      label+' ingredient filter did not narrow pizza catalog');
    await page.getByRole('button',{name:'Сбросить всё'}).click();
    await page.locator('input[aria-label="Минимальная цена"]').fill('650');
    assert.equal(await page.locator('.bmp-menu-products-grid .bmp-pizza-card').count(),3,
      label+' minimum-price filter is incorrect');
    await page.getByRole('button',{name:'Сбросить всё'}).click();
    await page.getByRole('button',{name:'Дополнительные фильтры'}).click();
  }
  await checkNoHorizontalOverflow(page,label+' pizza catalog');
  if(engine==='chromium'&&width===393&&height===852){
   await page.screenshot({path:'artifacts/responsive/chromium-393x852-pizza-catalog.png'});
  }
  if(engine==='chromium'&&width===393&&height===852){
   const pizzaNames=[
     'Курица с грибами','Ветчина и бекон','Маргарита','Пепперони',
     'Баклажаны с орешками','Четыре сыра','Курица барбекю','Тунец','Груша с горгонзолой'
   ];
   for(const name of pizzaNames){
     await page.locator('.bmp-pizza-card button[aria-label="Открыть '+name+'"]').click();
     await page.locator('.bmp-product-variant').first().waitFor();
     assert.equal(await page.locator('.bmp-product-variant').count(),2,
       label+' missing 30/40 cm segmented control for '+name);
     await page.locator('.bmp-product-variant').nth(1).click();
     assert.equal(await page.locator('.bmp-product-variant[aria-pressed="true"]').count(),1,
       label+' switching to 40 cm failed for '+name);
     const active=await page.locator('.bmp-product-variant[aria-pressed="true"]').innerText();
     assert.ok(active.includes('40 см'),label+' wrong active size: '+name);
     await page.getByRole('button',{name:'Закрыть карточку товара'}).click();
     await page.locator('.bmp-product-sheet').waitFor({state:'detached',timeout:2500});
   }
  }
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
  await page.locator('.bmp-product-ingredient-photo').first().waitFor({timeout:10000});
  const ingredientPhotos=await page.locator('.bmp-product-ingredient-photo').evaluateAll(els=>
   els.map(e=>({src:e.currentSrc,complete:e.complete,naturalWidth:e.naturalWidth})));
  assert.equal(ingredientPhotos.length,4,label+' should have four real ingredient photographs');
  assert.ok(ingredientPhotos.every(photo=>photo.complete&&photo.naturalWidth>0),
   label+' ingredient photo missing: '+JSON.stringify(ingredientPhotos));
  if(width>=768){
   const layout=await page.locator('.bmp-product-sheet').evaluate(sheet=>{
    const photo=sheet.querySelector('.bmp-product-hero').getBoundingClientRect();
    const frame=sheet.getBoundingClientRect();
    const scroll=sheet.querySelector('.bmp-product-scroll');
    return {sheetHeight:frame.height,heroHeight:photo.height,
      contentHeight:scroll.scrollHeight,visibleHeight:scroll.clientHeight};
   });
   assert.ok(layout.heroHeight<=305,label+' tablet image area oversized: '+JSON.stringify(layout));
   if(height>=1000)assert.ok(layout.contentHeight<=layout.visibleHeight+3,
    label+' tablet sheet should not require scrolling: '+JSON.stringify(layout));
   if(engine==='chromium'&&(width===768||width===820||width===1024))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-modal.png'});
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
  // The cart icon is navigation TO the cart. It must disappear ON the cart page.
  // Check the DOM for both desktop and mobile headers, including hidden elements.
  await page.locator('.bmp-cart-route').waitFor({timeout:15000});
  assert.equal(await page.locator('header a[aria-label^="Корзина"]').count(),0,
    label+' desktop cart icon is still mounted on /cart');
  assert.equal(await page.locator('.bmp-header-action[aria-label^="Корзина"]').count(),0,
    label+' mobile cart icon is still mounted on /cart');
  // Newly authored account screens: dedicated cart images and responsive layouts.
  await page.locator('.bmp-cart-item').first().waitFor({timeout:15000});
  const cartPhoto=await page.locator('.bmp-cart-item-photo').first().evaluate(async img=>{
    await img.decode();
    return {width:img.naturalWidth,height:img.naturalHeight,src:img.currentSrc};
  });
  assert.ok(cartPhoto.width>=280 && cartPhoto.height>=280,
    label+' dedicated cart photo did not load: '+JSON.stringify(cartPhoto));
  assert.ok(cartPhoto.src.includes('/media/cart/'),
    label+' cart incorrectly used the menu photo: '+cartPhoto.src);
  await checkNoHorizontalOverflow(page,label+' cart');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-cart.png'});

  // Checkout must accept a real address, store a demo order, clear cart, and
  // reopen from history without contacting any payment provider.
  await page.locator('.bmp-cart-checkout').click();
  await page.locator('.bmp-checkout-page').waitFor({timeout:15000});
  assert.ok((await page.evaluate(()=>window.scrollY))<=2,
    label+' checkout opened mid-scroll instead of at the heading');
  assert.equal(await page.locator('.bmp-checkout-payment input[type="radio"]').count(),3,
    label+' checkout payment choices are missing');
  if(width<600){
    const compact=await page.evaluate(()=>{
      const title=document.querySelector('.bmp-checkout-page .bmp-order-titlebar h1');
      const method=document.querySelector('.bmp-checkout-page .bmp-choice-tile');
      const payment=document.querySelector('.bmp-checkout-page .bmp-checkout-payment');
      return {
        titleSize:parseFloat(getComputedStyle(title).fontSize),
        methodHeight:method.getBoundingClientRect().height,
        paymentHeight:payment.getBoundingClientRect().height
      };
    });
    assert.ok(compact.titleSize<=31&&compact.methodHeight<=49&&compact.paymentHeight<=50,
      label+' mobile checkout remains oversized: '+JSON.stringify(compact));
  }
  await checkNoHorizontalOverflow(page,label+' checkout');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-checkout.png',fullPage:true});
  await page.locator('.bmp-checkout-submit').click();
  assert.ok((await page.locator('.bmp-checkout-error').innerText()).includes('адрес'),
    label+' delivery address validation was skipped');
  await page.locator('#bmp-checkout-address').fill('Тестовая улица, 1');
  await page.locator('#bmp-checkout-entrance').fill('2');
  await page.locator('#bmp-checkout-floor').fill('3');
  await page.locator('.bmp-checkout-submit').click();
  await page.locator('.bmp-order-confirmation').waitFor({timeout:15000});
  assert.ok((await page.evaluate(()=>window.scrollY))<=2,
    label+' order confirmation opened mid-scroll instead of at the heading');
  assert.ok((await page.locator('.bmp-confirmation-intro h1').innerText()).includes('Заказ оформлен'),
    label+' confirmation screen failed');
  assert.equal(await page.locator('.bmp-confirmation-step--current').count(),1,
    label+' demo must not fabricate fulfillment progress');
  await checkNoHorizontalOverflow(page,label+' confirmation');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-confirmation.png',fullPage:true});
  await page.goto(BASE+'#/orders',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-order-history-card').first().waitFor({timeout:15000});
  assert.ok((await page.locator('.bmp-order-history-card').count())>=1,
    label+' demo order did not persist to history');
  await checkNoHorizontalOverflow(page,label+' history');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-order-history.png'});
  await page.locator('.bmp-order-history-repeat').first().click();
  await page.locator('.bmp-cart-item').first().waitFor({timeout:15000});
  assert.ok((await page.locator('.bmp-cart-item').count())>=1,
    label+' repeating an order did not restore the cart');

  await page.goto(BASE+'#/profile',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-profile-guest').waitFor({timeout:15000});
  assert.equal(await page.locator('header a[aria-label^="Корзина"], .bmp-header-action[aria-label^="Корзина"]').count(),0,
    label+' cart icon must not appear on profile');
  assert.equal(await page.locator('.bmp-profile-login').count(),1,
    label+' guest must see a sign-in action');
  assert.equal(await page.getByText('Иван Иванов').count(),0,
    label+' fabricated profile name is visible');
  assert.equal(await page.getByText('+7 (999) 123-45-67').count(),0,
    label+' fabricated phone is visible');
  assert.equal(await page.getByText('120 бонусов').count(),0,
    label+' fabricated loyalty points are visible');
  await checkNoHorizontalOverflow(page,label+' profile');
  assert.equal(await page.locator('.bmp-profile-links .bmp-account-row').count(),7,
    label+' guest profile menu incomplete');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-profile.png'});

  await page.goto(BASE+'#/favorites',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-favorites-empty').waitFor({timeout:15000});
  assert.equal(await page.locator('.bmp-favorites-grid .bmp-pizza-card').count(),0,
    label+' empty favorites should not show product cards');
  await checkNoHorizontalOverflow(page,label+' empty favorites');
  if(engine==='chromium'&&width===393&&height===852)
    await page.screenshot({path:'artifacts/responsive/chromium-393x852-favorites-empty.png'});
  await page.locator('.bmp-favorites-browse').click();
  await page.locator('.bmp-pizza-card .bmp-card-favorite').first().waitFor({timeout:15000});
  await page.locator('.bmp-pizza-card .bmp-card-favorite').first().click();
  await page.goto(BASE+'#/favorites',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-favorites-grid .bmp-pizza-card').first().waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' favorites with items');
  if(engine==='chromium'&&width===393&&height===852)
    await page.screenshot({path:'artifacts/responsive/chromium-393x852-favorites-filled.png'});
  await page.locator('.bmp-favorites-grid .bmp-pizza-card .bmp-card-favorite').first().click();
  await page.locator('.bmp-favorites-empty').waitFor({timeout:2500});

  await page.goto(BASE+'#/about',{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:'О нас'}).waitFor({timeout:15000});
  assert.equal(await page.getByRole('link',{name:/Открыть технический каталог/}).count(),0,
    label+' technical catalog shortcut should not appear in About');
  assert.equal(await page.getByText(/Технический каркас/).count(),0,
    label+' developer notices should not appear in About');

  await page.goto(BASE+'#/support',{waitUntil:'domcontentloaded'});
  await page.locator('.bmp-faq-list').waitFor({timeout:15000});
  await checkNoHorizontalOverflow(page,label+' support');
  assert.equal(await page.locator('.bmp-support-channel').count(),3,
    label+' support contact cards missing');
  await page.locator('.bmp-faq-item summary').first().click();
  assert.ok(await page.locator('.bmp-faq-item').first().evaluate(e=>e.open),
    label+' FAQ answer did not expand');
  if(engine==='chromium'&&((width===393&&height===852)||(width===768&&height===1024)))
    await page.screenshot({path:'artifacts/responsive/chromium-'+width+'x'+height+'-support.png'});
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
