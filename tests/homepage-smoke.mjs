import fs from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.TEST_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
const report = { runs: [], localPages: [], sharedPage: null, ok: false };

async function checkLocalPages(){
  for(const path of ['/jobs.html','/businesses.html','/services.html','/resident-login.html','/business-login.html','/government-login.html']){
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
    await page.waitForSelector('#globalLangSwitch',{timeout:10000});
    const before=await page.locator('html').getAttribute('data-theme');
    await page.locator('#globalThemeSwitch').click();
    const after=await page.locator('html').getAttribute('data-theme');
    if(before===after)throw new Error('Shared page theme switch failed');
    await page.locator('#globalLangSwitch').click();
    await page.waitForTimeout(100);
    if(!(await page.locator('.marketHero h1').textContent()).includes('स्थानीय काम'))throw new Error('Jobs Hindi localization failed');
    await page.locator('#globalLangSwitch').click();
    await page.waitForTimeout(100);
    if(!(await page.locator('.marketHero h1').textContent()).includes('स्थानीय काम'))throw new Error('Jobs Kumaoni localization failed');
    report.sharedPage={ok:true,theme:after,language:'kfy'};
  }finally{await page.close()}
}

async function run(viewport, name) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  const consoleErrors = [];
  let stage = 'open';
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  try {
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
    stage = 'main content';
    await page.waitForSelector('#home');
    await page.waitForSelector('#newsGrid .newsCard', { timeout: 10000 });
    await page.screenshot({ path: `homepage-${name}.png`, fullPage: true });

    stage = 'internal links';
    const hrefs = await page.locator('a[href^="#"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')).filter(Boolean));
    const missing = [];
    for (const href of hrefs) {
      if (href === '#') continue;
      if (!(await page.locator(href).count())) missing.push(href);
    }
    if (missing.length) throw new Error(`Missing internal targets: ${[...new Set(missing)].join(', ')}`);

    stage = 'Hindi localization';
    await page.locator('[data-lang="hi"]').click();
    await page.waitForTimeout(120);
    if (!(await page.locator('[data-i18n="home"]').first().textContent()).includes('होम')) throw new Error('Hindi localization failed');

    stage = 'Kumaoni localization';
    await page.locator('[data-lang="kfy"]').click();
    await page.waitForTimeout(120);
    if (!(await page.locator('[data-i18n="home"]').first().textContent()).includes('घर')) throw new Error('Kumaoni localization failed');

    stage = 'theme switch';
    const before = await page.locator('html').getAttribute('data-theme');
    await page.locator('#themeBtn').click();
    const after = await page.locator('html').getAttribute('data-theme');
    if (before === after) throw new Error('Theme switch failed');

    stage = 'AI rich result';
    await page.locator('[data-q*="official hospitals"]').click();
    await page.waitForSelector('#aiResults:not([hidden])', { timeout: 12000 });
    await page.waitForSelector('#richGrid .richCard', { timeout: 12000 });

    stage = 'report dialog';
    if (viewport.width < 861) {
      await page.locator('button[data-action="report"]').click();
    } else {
      await page.locator('[data-report]').first().click();
    }
    await page.waitForSelector('#reportDialog[open]');
    await page.locator('#reportDialog button[value="cancel"]').click();
    await page.waitForFunction(() => !document.querySelector('#reportDialog')?.open);

    if (viewport.width < 861) {
      stage = 'mobile menu';
      await page.locator('#mobileMenu').click();
      if (!(await page.locator('#sidebar').getAttribute('class')).includes('open')) throw new Error('Mobile menu failed');
    }

    stage = 'runtime errors';
    if (errors.length) throw new Error(`Page errors: ${errors.join(' | ')}`);
    report.runs.push({ name, ok: true, consoleErrors });
  } catch (error) {
    await page.screenshot({ path: `homepage-failure-${name}.png`, fullPage: true });
    report.runs.push({ name, ok: false, stage, error: error.message, stack: error.stack, pageErrors: errors, consoleErrors });
    throw error;
  } finally {
    await page.close();
  }
}

try {
  await checkLocalPages();
  await checkSharedPage();
  await run({ width: 1440, height: 1000 }, 'desktop');
  await run({ width: 390, height: 844 }, 'mobile');
  report.ok = true;
  console.log('Homepage smoke tests passed');
} catch (error) {
  console.error('Homepage smoke failed:', error);
  process.exitCode = 1;
} finally {
  fs.writeFileSync('homepage-smoke-result.json', JSON.stringify(report, null, 2));
  await browser.close();
}