import{chromium}from'playwright';
const base=process.env.TEST_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForSelector('#mobileMenu');
  if(await page.locator('#mobileMenu').getAttribute('aria-controls')!=='sidebar')throw new Error('Mobile menu aria-controls missing');
  if(await page.locator('#mobileMenu').getAttribute('aria-expanded')!=='false')throw new Error('Mobile menu initial aria-expanded is wrong');
  if(await page.locator('#sidebar').getAttribute('aria-label')!=='Almora navigation')throw new Error('Sidebar accessible name missing');
  await page.locator('#mobileMenu').click();
  await page.waitForFunction(()=>document.querySelector('#mobileMenu')?.getAttribute('aria-expanded')==='true');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('#mobileMenu')?.getAttribute('aria-expanded')==='false'&&!document.querySelector('#sidebar')?.classList.contains('open'));
  await page.close();

  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.addInitScript(()=>Object.defineProperty(navigator,'connection',{configurable:true,value:{saveData:true,effectiveType:'4g'}}));
  const metered=await context.newPage();
  await metered.goto(base,{waitUntil:'domcontentloaded',timeout:30000});
  await metered.waitForSelector('.heroSlides');
  const initial=await metered.locator('.heroPhoto').getAttribute('data-slide');
  await metered.waitForTimeout(9500);
  const after=await metered.locator('.heroPhoto').getAttribute('data-slide');
  if(initial!=='0'||after!=='0')throw new Error(`Save-Data hero autoplayed: ${initial} -> ${after}`);
  await metered.locator('.heroDots [data-slide="1"]').click();
  await metered.waitForFunction(()=>document.querySelector('.heroPhoto')?.dataset.slide==='1',{timeout:10000});
  await context.close();
  console.log('Accessibility/performance smoke passed');
}finally{await browser.close()}
