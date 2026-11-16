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

  const screensToCapture = [
    { name: 'screen_story_cover', fn: 'loadStoryCover' },
    { name: 'screen_level', fn: 'loadLevelCheck' },
    { name: 'screen_langselect', fn: 'loadLangSelect' },
    { name: 'screen_ch101_intro', fn: 'startChapter101' },
    { name: 'screen_character', fn: 'loadCharacterGreet' },
    { name: 'screen_aptitude_intro', fn: 'loadAptitudeIntro' },
  ];

  for (const s of screensToCapture) {
    await page.evaluate((fname) => {
      if (typeof window[fname] === 'function') {
        window[fname]();
      }
    }, s.fn);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.resolve(__dirname, `${s.name}.png`) });
    console.log(`Saved ${s.name}.png`);
  }

  await browser.close();
})();

