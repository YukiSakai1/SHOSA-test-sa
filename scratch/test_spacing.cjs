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

  // Let's test a custom CSS injection for .intro-arch-card and slide elements
  const testCss = `
    .intro-arch-card {
      justify-content: center !important;
      padding: 24px 20px 48px !important;
      gap: 16px !important;
    }
    .intro-phone-mockup-wrap {
      height: 320px !important;
      max-height: 38vh !important;
      margin: 0 auto !important;
      flex-shrink: 0 !important;
    }
    .intro-visual-wrap {
      margin-top: 0 !important;
      flex-shrink: 0 !important;
    }
    .intro-card-body {
      margin-top: 4px !important;
      flex-shrink: 0 !important;
    }
    .intro-card-title {
      margin: 0 0 16px !important;
      line-height: 1.5 !important;
    }
    .intro-body-lead {
      margin-bottom: 4px !important;
    }
    .intro-body-sub {
      margin-top: 4px !important;
    }
    .intro-action-btn {
      margin-top: 16px !important;
      margin-bottom: 0 !important;
    }
  `;

  await page.addStyleTag({ content: testCss });

  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => loadIntroSlide(idx), i);
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve(__dirname, `test_card_center_slide_${i}.png`) });
    console.log(`Saved test_card_center_slide_${i}.png`);
  }

  await browser.close();
})();

