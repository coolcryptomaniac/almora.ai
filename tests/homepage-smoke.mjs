import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const report = { runs: [], localPages: [], sharedPage: null, v7: {}, ok: false };

async function checkLocalPages(){
  for(const path of ['/jobs.html','/businesses.html','/services.html','/resident-login.html','/business-login.html','/government-login.html','/monkey.html','/people.html','/data/live-news.json','/data/monkey-hotspots.json','/data/people.json','/data/agent-status.json']){
    const response=await fetch(base+path);
    report.localPages.push({path,status:response.status,ok:response.ok});
    if(!response.ok)throw new Error(`Local destination failed: ${path} -> ${response.status}`);
  }
}

async function checkSharedPage(){
  const page=await browser.newPage({viewport:{width:1200,height:900}});
  try{
    await page.goto(base+'/jobs.html',{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForSelector('#globalThemeSwitch',{timeout:10000});
    await page.waitForSelector('#globalCultureSwitch',{timeout:10000});
    await page.waitForSelector('#globalLangSwitch',{timeout:10000});
    const before=await page.locator('html').getAttribute('data-theme');
    await page.locator('#globalThemeSwitch').click();
    const after=await page.locator('html').getAttribute('data-theme');
    if(before===after)throw new Error('Shared page theme switch failed');
    const cBefore=await page.locator('html').getAttribute('data-culture-theme');
    await page.locator('#globalCultureSwitch').click();
    const cAfter=await page.locator('html').getAttribute('data-culture-theme');
    if(cBefore===cAfter)throw new Error('Shared cultural theme switch failed');
    await page.locator('#globalLangSwitch').click();await page.waitForTimeout(100);
    if(!(await page.locator('.sectionHead h2').first().textContent()).includes('घर के करीब'))throw new Error('Jobs Hindi localization failed');
    await page.locator('#globalLangSwitch').click();await page.waitForTimeout(100);
    if(!(await page.locator('.sectionHead h2').first().textContent()).includes('घर नजीक'))throw new Error('Jobs Kumaoni localization failed');
    report.sharedPage={ok:true,theme:after,culture:cAfter,language:'kfy'};
  }finally{await page.close()}
}

async function checkMonkeyAndPeople(){
 const p=await browser.newPage({viewport:{width:1200,height:900}});try{
  await p.goto(base+'/monkey.html',{waitUntil:'domcontentloaded',timeout:30000});
  await p.waitForSelector('#monkeyMap',{timeout:10000});await p.waitForSelector('.monkeyMetric',{timeout:10000});
  if((await p.locator('.evidenceItem').count())<4)throw new Error('Monkey evidence list did not render');
  report.v7.monkey={ok:true,evidence:await p.locator('.evidenceItem').count()};
 }finally{await p.close()}
 const q=await browser.newPage({viewport:{width:1200,height:900}});try{
  await q.goto(base+'/people.html',{waitUntil:'domcontentloaded',timeout:30000});
  await q.waitForSelector('.atlasPerson',{timeout:10000});
  if((await q.locator('.atlasPerson').count())<8)throw new Error('People atlas seed did not render');
  report.v7.people={ok:true,cards:await q.locator('.atlasPerson').count()};
 }finally{await q.close()}
}

async function run(viewport, name) {
  const page = await browser.newPage({ viewport });const errors=[];const consoleErrors=[];let stage='open';
  page.on('pageerror', e => errors.push(e.message));page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  try {
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
    stage='main content';await page.waitForSelector('#home');await page.waitForSelector('#newsGrid .newsCard',{timeout:10000});
    stage='v7 mount';await page.waitForSelector('.heroSlides',{timeout:10000});await page.waitForSelector('.monkeyPreview',{timeout:10000});await page.waitForSelector('.peoplePreview',{timeout:10000});await page.waitForSelector('.cultureThemePicker',{timeout:10000});
    const initialSlide=await page.locator('.heroPhoto').getAttribute('data-slide');await page.locator('.heroArrow.next').click();await page.waitForTimeout(250);const nextSlide=await page.locator('.heroPhoto').getAttribute('data-slide');if(initialSlide===nextSlide)throw new Error('Hero slideshow failed');
    const cultureBefore=await page.locator('html').getAttribute('data-culture-theme');await page.locator('#cultureThemeBtn').click();await page.locator('[data-culture="pichoda"]').click();const cultureAfter=await page.locator('html').getAttribute('data-culture-theme');if(cultureBefore===cultureAfter)throw new Error('Cultural theme failed');
    await page.screenshot({ path: `homepage-${name}.png`, fullPage: true });

    stage='internal links';const hrefs=await page.locator('a[href^="#"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')).filter(Boolean));const missing=[];for(const href of hrefs){if(href==='#')continue;if(!(await page.locator(href).count()))missing.push(href)}if(missing.length)throw new Error(`Missing internal targets: ${[...new Set(missing)].join(', ')}`);
    stage='Hindi localization';await page.locator('[data-lang="hi"]').click();await page.waitForTimeout(120);if(!(await page.locator('[data-i18n="home"]').first().textContent()).includes('होम'))throw new Error('Hindi localization failed');
    stage='Kumaoni localization';await page.locator('[data-lang="kfy"]').click();await page.waitForTimeout(120);if(!(await page.locator('[data-i18n="home"]').first().textContent()).includes('घर'))throw new Error('Kumaoni localization failed');
    stage='theme switch';const before=await page.locator('html').getAttribute('data-theme');await page.locator('#themeBtn').click();const after=await page.locator('html').getAttribute('data-theme');if(before===after)throw new Error('Theme switch failed');
    stage='AI rich result';await page.locator('[data-q*="official hospitals"]').click();await page.waitForSelector('#aiResults:not([hidden])',{timeout:12000});await page.waitForSelector('#richGrid .richCard',{timeout:12000});
    stage='Monkey AI';await page.locator('#askInput').fill('monkey problem in Dharanaula');await page.locator('#askForm').evaluate(f=>f.requestSubmit());await page.waitForSelector('#richGrid a[href="./monkey.html"]',{timeout:12000});
    stage='report dialog';if(viewport.width<861)await page.locator('button[data-action="report"]').click();else await page.locator('[data-report]').first().click();await page.waitForSelector('#reportDialog[open]');await page.locator('#reportDialog button[value="cancel"]').click();await page.waitForFunction(()=>!document.querySelector('#reportDialog')?.open);
    if(viewport.width<861){stage='mobile menu';await page.locator('#mobileMenu').click();if(!(await page.locator('#sidebar').getAttribute('class')).includes('open'))throw new Error('Mobile menu failed')}
    stage='runtime errors';if(errors.length)throw new Error(`Page errors: ${errors.join(' | ')}`);report.runs.push({name,ok:true,consoleErrors});
  } catch(error){await page.screenshot({path:`homepage-failure-${name}.png`,fullPage:true});report.runs.push({name,ok:false,stage,error:error.message,stack:error.stack,pageErrors:errors,consoleErrors});throw error}finally{await page.close()}
}

try{await checkLocalPages();await checkSharedPage();await checkMonkeyAndPeople();await run({width:1440,height:1000},'desktop');await run({width:390,height:844},'mobile');report.ok=true;console.log('Homepage v7 smoke tests passed')}catch(error){console.error('Homepage smoke failed:',error);process.exitCode=1}finally{fs.writeFileSync('homepage-smoke-result.json',JSON.stringify(report,null,2));await browser.close()}
