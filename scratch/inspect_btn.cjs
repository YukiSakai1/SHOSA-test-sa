const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const cwd = process.cwd().replace(/\\/g, '/');
  await page.setContent(`
    <html>
      <body style="background:#222; padding:40px; display:flex; gap:20px; align-items:center;">
        <div style="background:#555; padding:10px;">
          <img src="file:///${cwd}/assets/images/btn_lang_toggle.png" style="width:48px; height:32px;">
        </div>
        <div style="background:#555; padding:10px;">
          <img src="file:///${cwd}/assets/images/btn_lang_toggle.png" style="width:96px; height:64px;">
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: 'scratch/btn_lang_toggle_inspect.png' });
  await browser.close();
  console.log('Saved inspection screenshot');
})();

