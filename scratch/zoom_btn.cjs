const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const userImg = 'C:/Users/langside/.gemini/antigravity/brain/35b2df82-9051-4059-9137-9df7af1d19d2/.user_uploaded/media_1794305117853_340aab97.png';
  const userB64 = fs.readFileSync(userImg).toString('base64');

  await page.setContent(`
    <html>
      <body style="background:#222; padding:30px;">
        <img src="data:image/png;base64,${userB64}" style="width:350px; image-rendering:pixelated; border:2px solid gold;">
      </body>
    </html>
  `);
  await page.screenshot({ path: 'scratch/zoom_user_btn.png' });
  await browser.close();
  console.log('Saved zoom');
})();

