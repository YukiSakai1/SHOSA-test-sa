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

  await page.evaluate(() => {
    if (typeof loadIntroSlide === 'function') {
      loadIntroSlide(0);
    }
  });
  await new Promise(r => setTimeout(r, 500));

  const info = await page.evaluate(() => {
    const screen = document.getElementById('screen-ob-intro');
    const container = document.querySelector('.device-container') || document.body;
    const card = document.querySelector('.intro-arch-card');
    const mockup = document.querySelector('.intro-phone-mockup-wrap');
    const cardBody = document.querySelector('.intro-card-body');
    const title = document.querySelector('.intro-card-title');
    const btn = document.querySelector('#btn-slide-action');
    const topHeader = document.querySelector('.intro-top-header');

    return {
      windowHeight: window.innerHeight,
      containerScrollHeight: container.scrollHeight,
      containerClientHeight: container.clientHeight,
      screenScrollHeight: screen ? screen.scrollHeight : 0,
      screenClientHeight: screen ? screen.clientHeight : 0,
      topHeaderRect: topHeader ? topHeader.getBoundingClientRect() : null,
      cardRect: card ? card.getBoundingClientRect() : null,
      mockupRect: mockup ? mockup.getBoundingClientRect() : null,
      cardBodyRect: cardBody ? cardBody.getBoundingClientRect() : null,
      titleRect: title ? title.getBoundingClientRect() : null,
      btnRect: btn ? btn.getBoundingClientRect() : null,
    };
  });
  console.log('Slide 0 element layout info:', JSON.stringify(info, null, 2));

  await page.screenshot({ path: path.resolve(__dirname, 'debug_slide_0.png') });
  console.log('Saved debug_slide_0.png');

  // Let's also check slide 1, 2, 3
  for (let i = 1; i < 4; i++) {
    await page.evaluate((idx) => {
      loadIntroSlide(idx);
    }, i);
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve(__dirname, `debug_slide_${i}.png`) });
    console.log(`Saved debug_slide_${i}.png`);
  }

  await browser.close();
})();

