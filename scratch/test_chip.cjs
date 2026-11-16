const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const userImg = 'C:/Users/langside/.gemini/antigravity/brain/35b2df82-9051-4059-9137-9df7af1d19d2/.user_uploaded/media_1794305117853_340aab97.png';
  const userB64 = fs.readFileSync(userImg).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          background: #0ea5a8;
          padding: 40px;
          display: flex;
          gap: 30px;
          align-items: flex-start;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .box {
          background: #0ea5a8;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          width: 160px;
        }
        .label {
          color: white;
          font-size: 12px;
          margin-bottom: 8px;
          align-self: flex-start;
        }

        /* Pill component */
        .lang-toggle-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1.5px solid #DFD5C2;
          border-right: none;
          border-radius: 999px 0 0 999px;
          padding: 4px 8px 4px 10px;
          height: 28px;
          box-sizing: border-box;
          cursor: pointer;
          user-select: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .lang-toggle-icon {
          width: 14px;
          height: 14px;
          display: block;
          flex-shrink: 0;
        }
        .lang-toggle-text {
          font-size: 13px;
          font-weight: 800;
          color: #1F2937;
          line-height: 1;
          letter-spacing: 0.5px;
        }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="label">User uploaded:</div>
        <img src="data:image/png;base64,${userB64}" style="width: 71px;">
      </div>

      <div class="box">
        <div class="label">Rendered EN:</div>
        <button class="lang-toggle-chip" type="button">
          <svg class="lang-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-toggle-text">EN</span>
        </button>
      </div>

      <div class="box">
        <div class="label">Rendered JP:</div>
        <button class="lang-toggle-chip" type="button">
          <svg class="lang-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-toggle-text">JP</span>
        </button>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: 'scratch/test_chip_render.png' });
  await browser.close();
  console.log('Saved test chip render');
})();

