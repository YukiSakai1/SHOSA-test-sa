const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  const screens = [
    { name: 'screen-story-cover', fn: 'loadStoryCover' },
    { name: 'screen-ch101-intro', fn: 'startChapter101' },
    { name: 'screen-ob-character', fn: 'loadCharacterGreet' },
    { name: 'screen-ob-aptitude-intro', fn: 'loadAptitudeIntro' },
    { name: 'screen-ob-level', fn: 'loadLevelCheck' },
    { name: 'screen-ob-langselect', fn: 'loadLangSelect' }
  ];

  for (const s of screens) {
    await page.evaluate((fname) => {
      if (typeof window[fname] === 'function') window[fname]();
    }, s.fn);
    await new Promise(r => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const activeScreen = document.querySelector('.screen:not(.hidden)');
      if (!activeScreen) return null;
      // find primary button / action button
      const btn = activeScreen.querySelector('.primary-btn, .intro-action-btn, .langselect-next-btn, .ch101-intro-next-btn, #btn-story-cover-start, #btn-ob-character-next, #btn-ob-aptitude-start');
      const btnRect = btn ? btn.getBoundingClientRect() : null;
      return {
        screenId: activeScreen.id,
        screenHeight: activeScreen.clientHeight,
        btnBottomToWindow: btnRect ? window.innerHeight - btnRect.bottom : null,
        btnRect: btnRect ? { top: btnRect.top, height: btnRect.height } : null
      };
    });
    console.log(s.name, metrics);
  }

  await browser.close();
})();

