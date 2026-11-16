const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

  console.log('--- Loading Schedule Time Screen ---');
  await page.goto(fileUrl + '?screen=schedule-time', { waitUntil: 'networkidle0' });

  // 1. Verify Header Bar
  const headerExists = await page.$eval('.figma-schedule-time-screen .figma-hearing-header-bar', el => !!el);
  console.log('Header Bar exists:', headerExists);

  // 2. Verify 5 Timing Cards
  const cardsCount = await page.$$eval('.schedule-time-card', els => els.length);
  console.log('Timing cards count (expected 5):', cardsCount);
  if (cardsCount !== 5) {
    throw new Error(`Expected 5 cards, found ${cardsCount}`);
  }

  // 3. Verify Purple Notification Card
  const notifyCard = await page.$eval('.schedule-notify-card', el => {
    const s = window.getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      borderRadius: s.borderRadius,
      display: s.display,
      height: s.height
    };
  });
  console.log('Purple Notification Card styles:', notifyCard);
  if (!notifyCard.bg.includes('113, 91, 225') && !notifyCard.bg.includes('rgb(113, 91, 225)')) {
    throw new Error('Purple card background is not #715BE1! Got: ' + notifyCard.bg);
  }

  const initialTimeText = await page.$eval('#ob-schedule-notify-time-display', el => el.textContent.trim());
  console.log('Initial displayed time:', initialTimeText);
  if (initialTimeText !== '10:30') {
    throw new Error(`Expected initial time 10:30, got ${initialTimeText}`);
  }

  // Verify NEXT button initially disabled
  const nextBtnDisabled = await page.$eval('#btn-ob-schedule-time-next', el => el.disabled);
  console.log('NEXT button initially disabled:', nextBtnDisabled);
  if (!nextBtnDisabled) {
    throw new Error('NEXT button should be disabled when no option selected!');
  }

  // Screenshot Panel 1
  await page.screenshot({ path: path.resolve(__dirname, 'schedule_panel1_unselected.png') });
  console.log('Saved schedule_panel1_unselected.png');

  // 4. Test Opening Modal Time Wheel
  console.log('--- Opening Time Wheel Modal ---');
  await page.click('#btn-open-time-wheel');
  await new Promise(r => setTimeout(r, 200));

  const modalHidden = await page.$eval('#modal-time-wheel', el => el.classList.contains('hidden'));
  console.log('Modal is open (hidden = false):', !modalHidden);
  if (modalHidden) {
    throw new Error('Modal did not open!');
  }

  const activeHour = await page.$eval('#wheel-hours .wheel-item.active', el => el.textContent.trim());
  const activeMin = await page.$eval('#wheel-minutes .wheel-item.active', el => el.textContent.trim());
  console.log('Wheel active values:', `${activeHour}:${activeMin}`);

  // Screenshot Panel 2
  await page.screenshot({ path: path.resolve(__dirname, 'schedule_panel2_modal.png') });
  console.log('Saved schedule_panel2_modal.png');

  // Click a different hour (e.g., 21 or 11) and click "設定を完了する"
  await page.evaluate(() => {
    const item11 = document.querySelector('#wheel-hours .wheel-item[data-val="11"]') || document.querySelector('#wheel-hours .wheel-item[data-val="10"]');
    if (item11) item11.click();
    const item45 = document.querySelector('#wheel-minutes .wheel-item[data-val="45"]') || document.querySelector('#wheel-minutes .wheel-item[data-val="30"]');
    if (item45) item45.click();
  });
  await new Promise(r => setTimeout(r, 100));

  await page.click('#btn-submit-time-wheel');
  await new Promise(r => setTimeout(r, 200));

  const modalClosedAfterSubmit = await page.$eval('#modal-time-wheel', el => el.classList.contains('hidden'));
  console.log('Modal closed after submit:', modalClosedAfterSubmit);
  const updatedTime = await page.$eval('#ob-schedule-notify-time-display', el => el.textContent.trim());
  console.log('Updated displayed time:', updatedTime);

  // 5. Select Option Card (e.g. "寝る前")
  console.log('--- Selecting Option Card ---');
  await page.evaluate(() => {
    const nightCard = Array.from(document.querySelectorAll('.schedule-time-card')).find(c => c.textContent.includes('寝る前'));
    if (nightCard) nightCard.click();
  });
  await new Promise(r => setTimeout(r, 200));

  const isNightSelected = await page.evaluate(() => {
    const nightCard = Array.from(document.querySelectorAll('.schedule-time-card')).find(c => c.textContent.includes('寝る前'));
    return nightCard ? nightCard.classList.contains('selected') : false;
  });
  console.log('"寝る前" card selected:', isNightSelected);
  if (!isNightSelected) {
    throw new Error('"寝る前" card is not selected!');
  }

  const nextBtnEnabled = await page.$eval('#btn-ob-schedule-time-next', el => !el.disabled);
  console.log('NEXT button enabled after selection:', nextBtnEnabled);
  if (!nextBtnEnabled) {
    throw new Error('NEXT button should be enabled after selecting an option!');
  }

  // Screenshot Panel 3
  await page.screenshot({ path: path.resolve(__dirname, 'schedule_panel3_selected.png') });
  console.log('Saved schedule_panel3_selected.png');

  // 6. Test NEXT navigation to Profile Intro
  console.log('--- Testing Navigation via NEXT ---');
  await page.click('#btn-ob-schedule-time-next');
  await new Promise(r => setTimeout(r, 300));

  const activeScreenAfterNext = await page.evaluate(() => {
    const active = document.querySelector('.screen:not(.hidden)');
    return active ? active.id : null;
  });
  console.log('Active screen after NEXT (expected: screen-ob-profile-intro):', activeScreenAfterNext);
  if (activeScreenAfterNext !== 'screen-ob-profile-intro') {
    throw new Error(`Expected screen-ob-profile-intro, got ${activeScreenAfterNext}`);
  }

  console.log('\nALL SCHEDULE NOTIFY TESTS PASSED SUCCESSFULLY!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

