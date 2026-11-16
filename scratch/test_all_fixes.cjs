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

  const testCss = `
    /* 1. Carousel Slides: Fix huge gap between visual & text, elevate CTA button */
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

    /* 2. Story Cover: Center content, eliminate 400px empty gap, elevate CTA */
    #screen-story-cover {
      justify-content: center !important;
      align-items: center !important;
      padding: 30px 24px 64px !important;
      gap: 20px !important;
    }
    #screen-story-cover .story-cover-mascot {
      width: 140px;
      height: auto;
      display: block;
      margin: 0 auto 10px;
      filter: drop-shadow(0 6px 18px rgba(0,0,0,0.08));
    }
    #screen-story-cover .story-cover-title {
      margin: 0 0 4px !important;
      font-size: 24px !important;
    }
    #screen-story-cover .story-cover-desc {
      margin: 0 0 16px !important;
      font-size: 14px !important;
      line-height: 1.65 !important;
      max-width: 320px !important;
    }
    #screen-story-cover .primary-btn {
      margin: 0 !important;
      max-width: 340px !important;
    }

    /* 3. AI Tutor Greeting / Aptitude Intro: speech bubble & CTA spacing */
    .figma-ch07-overlay {
      justify-content: flex-end !important;
      padding-bottom: 56px !important;
      gap: 24px !important;
    }
    .figma-ch07-overlay .figma-speech-bubble {
      margin-top: 0 !important;
    }
    .figma-ch07-overlay .primary-btn {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  `;

  await page.addStyleTag({ content: testCss });

  // Add mascot to character-preview in screen-story-cover for test
  await page.evaluate(() => {
    const prev = document.querySelector('#screen-story-cover .character-preview');
    if (prev && !prev.querySelector('img')) {
      prev.innerHTML = '<img src="assets/images/mascot_shosa_standing.png" alt="SHOSA" class="story-cover-mascot">';
    }
  });

  // Screenshot all 4 slides
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => loadIntroSlide(idx), i);
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.resolve(__dirname, `fixed_slide_${i}.png`) });
    console.log(`Saved fixed_slide_${i}.png`);
  }

  // Screenshot story cover
  await page.evaluate(() => loadStoryCover());
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.resolve(__dirname, `fixed_story_cover.png`) });
  console.log(`Saved fixed_story_cover.png`);

  // Screenshot character greet
  await page.evaluate(() => loadCharacterGreet());
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.resolve(__dirname, `fixed_character_greet.png`) });
  console.log(`Saved fixed_character_greet.png`);

  // Screenshot aptitude intro
  await page.evaluate(() => loadAptitudeIntro());
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.resolve(__dirname, `fixed_aptitude_intro.png`) });
  console.log(`Saved fixed_aptitude_intro.png`);

  await browser.close();
  console.log('All tests completed.');
})();

