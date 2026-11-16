const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const userImg = 'C:/Users/langside/.gemini/antigravity/brain/35b2df82-9051-4059-9137-9df7af1d19d2/.user_uploaded/media_1794305117853_340aab97.png';
  const userB64 = fs.readFileSync(userImg).toString('base64');
  const btnB64 = fs.readFileSync('assets/images/btn_lang_toggle.png').toString('base64');

  await page.setContent(`
    <html>
      <body style="background:#f0f0f0; padding:20px; font-family:sans-serif; display:flex; gap:30px;">
        <div style="background:white; padding:15px; border-radius:8px;">
          <h3>User upload (media_...):</h3>
          <img src="data:image/png;base64,${userB64}" style="border:1px solid #ccc; image-rendering:pixelated; width:142px;">
        </div>
        <div style="background:white; padding:15px; border-radius:8px;">
          <h3>Current btn_lang_toggle.png:</h3>
          <img src="data:image/png;base64,${btnB64}" style="border:1px solid #ccc; image-rendering:pixelated; width:142px;">
        </div>
      </body>
    </html>
  `);
  await page.screenshot({ path: 'scratch/compare_user_btn.png' });
  await browser.close();
  console.log('Saved comparison');
})();
