const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

  console.log('=== DESKTOP FRAME CONTAINMENT CHECK (1280x900) ===');
  await page.setViewport({ width: 1280, height: 900 });

  const screens = ['title', 'langselect', 'schedule-time', 'profile', 'journey', 'passport', '101', 'home'];
  for (const s of screens) {
    const url = fileUrl + (s === 'title' ? '' : '?screen=' + s);
    await page.goto(url, { waitUntil: 'networkidle0' });
    const data = await page.evaluate((name) => {
      const dev = document.querySelector('.device-container').getBoundingClientRect();
      const main = document.querySelector('main').getBoundingClientRect();
      const scr = document.querySelector('.screen:not(.hidden)').getBoundingClientRect();
      return {
        screen: name,
        devWidth: dev.width,
        mainWidth: main.width,
        scrWidth: scr.width,
        gapLeft: scr.left - main.left,
        gapRight: main.right - scr.right
      };
    }, s);
    console.log(`[Desktop Screen: ${s}]`, data);
    if (Math.abs(data.gapLeft) > 1 || Math.abs(data.gapRight) > 1) {
      console.error(`FAIL: Screen ${s} has a gap! gapLeft: ${data.gapLeft}, gapRight: ${data.gapRight}`);
      process.exit(1);
    }
  }

  // Specifically capture title screen on desktop and check pixels
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  const titleMetrics = await page.evaluate(() => {
    const dev = document.querySelector('.device-container').getBoundingClientRect();
    const main = document.querySelector('main').getBoundingClientRect();
    const scr = document.querySelector('#screen-title').getBoundingClientRect();
    const shield = document.querySelector('.ch01-shield-wrap').getBoundingClientRect();
    const actions = document.querySelector('.ch01-bottom-actions').getBoundingClientRect();
    return {
      mainCenter: (main.left + main.right) / 2,
      shieldCenter: (shield.left + shield.right) / 2,
      actionsCenter: (actions.left + actions.right) / 2,
      shieldLeft: shield.left,
      shieldRight: shield.right,
      scrLeft: scr.left,
      scrRight: scr.right,
      mainLeft: main.left,
      mainRight: main.right
    };
  });
  console.log('\nTitle screen alignment metrics:', titleMetrics);
  if (Math.abs(titleMetrics.mainCenter - titleMetrics.shieldCenter) > 2) {
    console.error('FAIL: Shield is not centered!');
    process.exit(1);
  }
  if (Math.abs(titleMetrics.mainCenter - titleMetrics.actionsCenter) > 2) {
    console.error('FAIL: Actions are not centered!');
    process.exit(1);
  }

  console.log('\n=== MOBILE VIEWPORT CONTAINMENT CHECK (430x932) ===');
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
  for (const s of screens) {
    const url = fileUrl + (s === 'title' ? '' : '?screen=' + s);
    await page.goto(url, { waitUntil: 'networkidle0' });
    const data = await page.evaluate((name) => {
      const main = document.querySelector('main').getBoundingClientRect();
      const scr = document.querySelector('.screen:not(.hidden)').getBoundingClientRect();
      return {
        screen: name,
        mainWidth: main.width,
        scrWidth: scr.width,
        gapLeft: scr.left - main.left,
        gapRight: main.right - scr.right
      };
    }, s);
    console.log(`[Mobile Screen: ${s}]`, data);
    if (Math.abs(data.gapLeft) > 1 || Math.abs(data.gapRight) > 1) {
      console.error(`FAIL on mobile: Screen ${s} has gap! gapLeft: ${data.gapLeft}, gapRight: ${data.gapRight}`);
      process.exit(1);
    }
  }

  console.log('\nALL FRAME CONTAINMENT CHECKS PASSED PERFECTLY!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

