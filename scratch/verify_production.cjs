const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });

  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 1. Verify Carousel slides 0-3
  for (let i = 0; i < 4; i++) {
    await page.evaluate((idx) => {
      if (typeof loadIntroSlide === 'function') loadIntroSlide(idx);
    }, i);
    await new Promise(r => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const card = document.querySelector('.intro-arch-card');
      const visual = document.querySelector('.intro-phone-mockup-wrap') || document.querySelector('.intro-visual-wrap');
      const text = document.querySelector('.intro-card-body');
      const btn = document.querySelector('.intro-action-btn');

      const visualBottom = visual ? visual.getBoundingClientRect().bottom : null;
      const textTop = text ? text.getBoundingClientRect().top : null;
      const btnBottom = btn ? btn.getBoundingClientRect().bottom : null;
      const cardBottom = card ? card.getBoundingClientRect().bottom : null;

      return {
        gapVisualToText: (visualBottom && textTop) ? (textTop - visualBottom) : null,
        btnBottomPadding: (btnBottom && cardBottom) ? (cardBottom - btnBottom) : null,
        btnToWindowBottom: btnBottom ? (window.innerHeight - btnBottom) : null
      };
    });

    console.log(`Slide ${i} metrics:`, metrics);
    await page.screenshot({ path: path.resolve(__dirname, `prod_slide_${i}.png`) });
  }

  // 2. Story Cover
  await page.evaluate(() => {
    if (typeof loadStoryCover === 'function') loadStoryCover();
  });
  await new Promise(r => setTimeout(r, 400));
  const storyMetrics = await page.evaluate(() => {
    const mascot = document.querySelector('.story-cover-mascot');
    const title = document.querySelector('.story-cover-title');
    const desc = document.querySelector('.story-cover-desc');
    const btn = document.querySelector('#btn-story-cover-next');
    return {
      hasMascot: !!mascot,
      gapMascotToTitle: (mascot && title) ? title.getBoundingClientRect().top - mascot.getBoundingClientRect().bottom : null,
      gapTitleToDesc: (desc && title) ? desc.getBoundingClientRect().top - title.getBoundingClientRect().bottom : null,
      gapDescToBtn: (btn && desc) ? btn.getBoundingClientRect().top - desc.getBoundingClientRect().bottom : null,
      btnToWindowBottom: btn ? (window.innerHeight - btn.getBoundingClientRect().bottom) : null
    };
  });
  console.log('Story Cover metrics:', storyMetrics);
  await page.screenshot({ path: path.resolve(__dirname, 'prod_story_cover.png') });

  // 3. Character Greet
  await page.evaluate(() => {
    if (typeof loadCharacterGreet === 'function') loadCharacterGreet();
  });
  await new Promise(r => setTimeout(r, 400));
  const greetMetrics = await page.evaluate(() => {
    const bubble = document.querySelector('.figma-speech-bubble');
    const btn = document.querySelector('#btn-ob-character-next');
    return {
      gapBubbleToBtn: (btn && bubble) ? btn.getBoundingClientRect().top - bubble.getBoundingClientRect().bottom : null,
      btnToWindowBottom: btn ? (window.innerHeight - btn.getBoundingClientRect().bottom) : null
    };
  });
  console.log('Character Greet metrics:', greetMetrics);
  await page.screenshot({ path: path.resolve(__dirname, 'prod_character_greet.png') });

  // 4. Level Check
  await page.evaluate(() => {
    if (typeof loadLevelCheck === 'function') loadLevelCheck();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.resolve(__dirname, 'prod_level.png') });

  // 5. Language Selection
  await page.evaluate(() => {
    if (typeof loadLangSelect === 'function') loadLangSelect();
  });
  await new Promise(r => setTimeout(r, 400));
  const langMetrics = await page.evaluate(() => {
    const cards = document.querySelector('.langselect-card-list');
    const btn = document.querySelector('.langselect-next-btn');
    return {
      gapCardsToBtn: (btn && cards) ? btn.getBoundingClientRect().top - cards.getBoundingClientRect().bottom : null,
      btnToWindowBottom: btn ? (window.innerHeight - btn.getBoundingClientRect().bottom) : null
    };
  });
  console.log('LangSelect metrics:', langMetrics);
  await page.screenshot({ path: path.resolve(__dirname, 'prod_langselect.png') });

  // 6. Schedule Time Selection
  await page.evaluate(() => {
    if (typeof loadScheduleTime === 'function') loadScheduleTime();
  });
  await new Promise(r => setTimeout(r, 400));
  const schedMetrics = await page.evaluate(() => {
    const cards = document.querySelector('.schedule-time-card-list');
    const btn = document.querySelector('.figma-schedule-time-screen .langselect-next-btn');
    return {
      gapCardsToBtn: (btn && cards) ? btn.getBoundingClientRect().top - cards.getBoundingClientRect().bottom : null,
      btnToWindowBottom: btn ? (window.innerHeight - btn.getBoundingClientRect().bottom) : null
    };
  });
  console.log('Schedule Time metrics:', schedMetrics);
  await page.screenshot({ path: path.resolve(__dirname, 'prod_schedule_time.png') });

  // 7. Passport Celebration
  await page.evaluate(() => {
    if (typeof finalizeOnboarding === 'function') finalizeOnboarding();
  });
  await new Promise(r => setTimeout(r, 400));
  const passportMetrics = await page.evaluate(() => {
    const trophy = document.querySelector('.ch19-trophy-wrap');
    const btn = document.querySelector('.ch19-view-result-btn');
    return {
      gapTrophyToBtn: (btn && trophy) ? btn.getBoundingClientRect().top - trophy.getBoundingClientRect().bottom : null,
      btnToWindowBottom: btn ? (window.innerHeight - btn.getBoundingClientRect().bottom) : null
    };
  });
  console.log('Passport metrics:', passportMetrics);
  await page.screenshot({ path: path.resolve(__dirname, 'prod_passport.png') });

  await browser.close();
  console.log('All production screenshots captured successfully.');
})();
