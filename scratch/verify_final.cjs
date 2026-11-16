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

  const allFixCss = `
    /* 1. Carousel Slides: Fix huge gap between visual & text, elevate CTA button */
    .intro-arch-card {
      justify-content: center !important;
      padding: 24px 20px 52px !important;
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

    /* 2. Story Cover */
    #screen-story-cover {
      justify-content: center !important;
      align-items: center !important;
      padding: 30px 24px 64px !important;
      gap: 18px !important;
    }
    #screen-story-cover .story-cover-mascot {
      width: 140px;
      height: auto;
      display: block;
      margin: 0 auto 8px;
      filter: drop-shadow(0 6px 18px rgba(0,0,0,0.08));
    }
    #screen-story-cover .story-cover-title {
      margin: 0 !important;
      font-size: 24px !important;
      text-align: center !important;
    }
    #screen-story-cover .story-cover-desc {
      margin: 0 0 16px !important;
      font-size: 14px !important;
      line-height: 1.65 !important;
      max-width: 330px !important;
      text-align: center !important;
    }
    #screen-story-cover .primary-btn {
      margin: 0 !important;
      max-width: 340px !important;
    }

    /* 3. Passport (Complete Celebration) */
    .figma-ch19-screen {
      justify-content: center !important;
      gap: 16px !important;
      padding: 24px 20px 52px !important;
    }
    .ch19-top-badge-wrap {
      margin-top: 0 !important;
    }
    .ch19-trophy-wrap {
      margin: 6px 0 !important;
    }
    .ch19-bottom-area {
      margin-top: 14px !important;
    }

    /* 4. Schedule Time Selection */
    .figma-schedule-time-screen {
      justify-content: center !important;
      gap: 14px !important;
      padding: 20px 20px 48px !important;
    }
    .figma-schedule-time-screen .langselect-bottom-area {
      margin-top: 8px !important;
      padding-bottom: 0 !important;
    }
    .schedule-notify-area {
      margin: 4px auto 0 !important;
    }

    /* 5. Language Selection */
    .figma-langselect-screen {
      justify-content: center !important;
      gap: 24px !important;
      padding: 24px 20px 56px !important;
    }
    .figma-langselect-screen .langselect-header-area {
      margin-bottom: 0 !important;
    }
    .figma-langselect-screen .langselect-bottom-area {
      margin-top: 12px !important;
      padding-bottom: 0 !important;
    }

    /* 6. Level Check Screen */
    #screen-ob-level {
      justify-content: center !important;
      gap: 16px !important;
      padding: 24px 20px 52px !important;
    }
    #screen-ob-level #btn-ob-level-next {
      margin-top: 12px !important;
      margin-bottom: 0 !important;
    }
  `;

  await page.addStyleTag({ content: allFixCss });

  // Add mascot to character-preview in screen-story-cover for test
  await page.evaluate(() => {
    const prev = document.querySelector('#screen-story-cover .character-preview');
    if (prev && !prev.querySelector('img')) {
      prev.innerHTML = '<img src="assets/images/mascot_shosa_standing.png" alt="SHOSA" class="story-cover-mascot">';
    }
  });

  // Verify at 932px viewport
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => loadIntroSlide(idx), i);
    await new Promise(r => setTimeout(r, 200));
    await page.screenshot({ path: path.resolve(__dirname, `final_slide_${i}.png`) });
  }

  await page.evaluate(() => loadStoryCover());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_story_cover.png') });

  await page.evaluate(() => finalizeOnboarding());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_passport.png') });

  await page.evaluate(() => loadScheduleTime());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_schedule_time.png') });

  await page.evaluate(() => loadLangSelect());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_langselect.png') });

  await page.evaluate(() => loadLevelCheck());
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_level.png') });

  // Also test at a shorter viewport (e.g. 740px)
  await page.setViewport({ width: 430, height: 740 });
  await page.evaluate(() => loadIntroSlide(0));
  await new Promise(r => setTimeout(r, 200));
  await page.screenshot({ path: path.resolve(__dirname, 'final_slide_0_740px.png') });

  await browser.close();
  console.log('All final screenshots generated.');
})();

