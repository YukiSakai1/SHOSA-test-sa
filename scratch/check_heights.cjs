const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  
  for (const h of [667, 740, 844, 932]) {
    await page.setViewport({ width: 375, height: h });
    await page.goto(filePath, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 400));
    const scrollInfo = await page.evaluate(() => {
      const container = document.querySelector('.device-container') || document.body;
      return {
        scrollHeight: container.scrollHeight,
        clientHeight: container.clientHeight,
        hasScroll: container.scrollHeight > container.clientHeight
      };
    });
    console.log(`Height ${h}: scrollHeight=${scrollInfo.scrollHeight}, clientHeight=${scrollInfo.clientHeight}, hasScroll=${scrollInfo.hasScroll}`);
  }
  await browser.close();
})();

