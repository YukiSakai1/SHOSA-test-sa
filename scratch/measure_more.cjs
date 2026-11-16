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

  // Measure ch101 intro
  await page.evaluate(() => {
    if (typeof startChapter101 === 'function') startChapter101();
  });
  await new Promise(r => setTimeout(r, 500));

  const ch101Metrics = await page.evaluate(() => {
    const screen = document.getElementById('screen-ch101-intro');
    const arch = document.querySelector('.ch101-arch-card');
    const mascot = document.querySelector('.ch101-intro-mascot-wrap');
    const descCard = document.querySelector('.ch101-desc-card');
    const btn = document.querySelector('#btn-ch101-intro-next');

    return {
      archRect: arch ? arch.getBoundingClientRect() : null,
      mascotRect: mascot ? mascot.getBoundingClientRect() : null,
      descRect: descCard ? descCard.getBoundingClientRect() : null,
      btnRect: btn ? btn.getBoundingClientRect() : null,
      gapMascotToDesc: descCard && mascot ? descCard.getBoundingClientRect().top - mascot.getBoundingClientRect().bottom : null,
      gapDescToBtn: btn && descCard ? btn.getBoundingClientRect().top - descCard.getBoundingClientRect().bottom : null,
      btnToBottom: btn ? window.innerHeight - btn.getBoundingClientRect().bottom : null
    };
  });
  console.log('CH101 Intro Metrics:', JSON.stringify(ch101Metrics, null, 2));

  // Measure screen-story-cover
  await page.evaluate(() => {
    if (typeof loadStoryCover === 'function') loadStoryCover();
  });
  await new Promise(r => setTimeout(r, 500));
  const storyCoverMetrics = await page.evaluate(() => {
    const title = document.querySelector('.story-cover-title');
    const desc = document.querySelector('.story-cover-desc');
    const btn = document.querySelector('#btn-story-cover-next');
    return {
      gapTitleToDesc: desc && title ? desc.getBoundingClientRect().top - title.getBoundingClientRect().bottom : null,
      gapDescToBtn: btn && desc ? btn.getBoundingClientRect().top - desc.getBoundingClientRect().bottom : null,
      btnToBottom: btn ? window.innerHeight - btn.getBoundingClientRect().bottom : null
    };
  });
  console.log('Story Cover Metrics:', JSON.stringify(storyCoverMetrics, null, 2));

  // Measure screen-ob-character
  await page.evaluate(() => {
    if (typeof loadCharacterGreet === 'function') loadCharacterGreet();
  });
  await new Promise(r => setTimeout(r, 500));
  const charMetrics = await page.evaluate(() => {
    const bubble = document.querySelector('.figma-speech-bubble');
    const btn = document.querySelector('#btn-ob-character-next');
    return {
      bubbleRect: bubble ? bubble.getBoundingClientRect() : null,
      gapBubbleToBtn: btn && bubble ? btn.getBoundingClientRect().top - bubble.getBoundingClientRect().bottom : null,
      btnToBottom: btn ? window.innerHeight - btn.getBoundingClientRect().bottom : null
    };
  });
  console.log('Character Greet Metrics:', JSON.stringify(charMetrics, null, 2));

  await browser.close();
})();

