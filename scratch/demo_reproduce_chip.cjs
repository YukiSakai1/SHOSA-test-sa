const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 400, deviceScaleFactor: 2 });

  const userImg = 'C:/Users/langside/.gemini/antigravity/brain/35b2df82-9051-4059-9137-9df7af1d19d2/.user_uploaded/media_1794305117853_340aab97.png';
  const userB64 = fs.readFileSync(userImg).toString('base64');

  await page.setContent(`
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 30px;
          background: #00989b;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          color: white;
        }

        .row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
          background: rgba(255, 255, 255, 0.12);
          padding: 16px 20px;
          border-radius: 12px;
        }

        .title {
          width: 140px;
          font-size: 13px;
          font-weight: 600;
          opacity: 0.95;
        }

        .preview-box {
          position: relative;
          width: 180px;
          height: 48px;
          background: #00989b;
          border: 1px dashed rgba(255,255,255,0.4);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          overflow: hidden;
        }

        /* Reproducing the exact chip using HTML + CSS + SVG */
        .reproduced-lang-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1.5px solid #DFD3BA;
          border-right: none;
          border-radius: 999px 0 0 999px;
          padding: 4px 8px 4px 10px;
          height: 30px;
          box-sizing: border-box;
          cursor: pointer;
          user-select: none;
          outline: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          transition: transform 0.15s ease, background-color 0.15s ease;
        }

        .reproduced-lang-chip:hover {
          background-color: #FAFAFA;
          transform: scale(1.02);
        }

        .reproduced-lang-chip:active {
          transform: scale(0.96);
        }

        .reload-icon-svg {
          width: 14px;
          height: 14px;
          display: block;
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lang-text {
          font-size: 13.5px;
          font-weight: 800;
          color: #1A2530;
          line-height: 1;
          letter-spacing: 0.4px;
        }

        .spinning .reload-icon-svg {
          transform: rotate(360deg);
        }
      </style>
    </head>
    <body>
      <h2 style="margin-top:0; font-size:16px;">HTML/CSS/SVGによる再現検証</h2>

      <div class="row">
        <div class="title">ユーザー様ご提示画像:</div>
        <div class="preview-box">
          <img src="data:image/png;base64,${userB64}" style="width: 71px; height: 50px; object-fit: contain;">
        </div>
      </div>

      <div class="row">
        <div class="title">HTML/CSS再現 (EN状態):</div>
        <div class="preview-box">
          <button class="reproduced-lang-chip" type="button">
            <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#1A2530" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
              <polyline points="21 3 21 8 16 8" />
            </svg>
            <span class="lang-text">EN</span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="title">HTML/CSS再現 (JP状態):</div>
        <div class="preview-box">
          <button class="reproduced-lang-chip" type="button">
            <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="#1A2530" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
              <polyline points="21 3 21 8 16 8" />
            </svg>
            <span class="lang-text">JP</span>
          </button>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/reproduce_lang_chip_demo.png' });
  await browser.close();
  console.log('Saved demo screenshot to scratch/reproduce_lang_chip_demo.png');
})();

