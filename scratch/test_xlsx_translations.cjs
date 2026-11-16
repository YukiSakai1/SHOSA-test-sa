const assert = require('assert');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  const errors = [];
  page.on('pageerror', err => errors.push('PAGEERROR: ' + err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });

  const url = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 400));

  async function assertChipFlushRight(btnSelector) {
    const metrics = await page.$eval(btnSelector + ' .reproduced-lang-chip', el => {
      const r = el.getBoundingClientRect();
      return { right: r.right, width: r.width, winW: window.innerWidth, text: el.innerText.trim() };
    });
    assert(metrics.width > 30, `${btnSelector} chip collapsed: ${JSON.stringify(metrics)}`);
    assert(Math.abs(metrics.right - metrics.winW) <= 2, `${btnSelector} chip not flush right: right=${metrics.right}, winW=${metrics.winW}`);
    return metrics.text;
  }

  console.log('1. Testing CH0-02 Language Select -> Intro Slides (CH0-03 ~ CH0-06)...');
  await page.evaluate(() => window.goTo(window.loadLangSelect));
  await new Promise(r => setTimeout(r, 200));
  const enCard = await page.$('.langselect-ticket-card[data-id="english"]');
  assert(enCard, 'English ticket card missing');
  await enCard.click();
  await new Promise(r => setTimeout(r, 150));
  await page.click('#btn-ob-langselect-next');
  await new Promise(r => setTimeout(r, 300));

  // CH0-03 EN
  let slide0Text = await page.$eval('.intro-card-title', el => el.innerText.trim());
  assert(slide0Text.includes("Let's learn together"), 'CH0-03 EN mismatch: ' + slide0Text);
  assert.strictEqual(await assertChipFlushRight('.intro-lang-pill'), 'JP');
  await page.click('.intro-lang-pill'); // switch to JA
  await new Promise(r => setTimeout(r, 200));
  slide0Text = await page.$eval('.intro-card-title', el => el.innerText.trim());
  assert(slide0Text.includes('いっしょに学ぼう。'), 'CH0-03 JA mismatch: ' + slide0Text);
  assert.strictEqual(await assertChipFlushRight('.intro-lang-pill'), 'EN');
  await page.click('#btn-slide-action'); // -> Slide 1 (CH0-04) in JA
  await new Promise(r => setTimeout(r, 200));

  // CH0-04 JA -> EN
  await page.click('.intro-lang-pill');
  await new Promise(r => setTimeout(r, 200));
  const featureBubbles = await page.$$eval('.intro-feature-bubble', els => els.map(e => e.innerText.trim()));
  assert.deepStrictEqual(featureBubbles, [
    '✓ AI Tutor',
    '✓ Role-play practice',
    '✓ Hotel service training',
    '✓ Japanese for guest service'
  ], 'CH0-04 EN bubbles mismatch: ' + JSON.stringify(featureBubbles));
  await page.screenshot({ path: 'scratch/verify_ch0_04_en.png' });
  await page.click('#btn-slide-action'); // -> Slide 2 (CH0-05) in EN
  await new Promise(r => setTimeout(r, 200));

  // CH0-05 EN
  const stepsEn = await page.$$eval('.intro-step-en-text', els => els.map(e => e.innerText.trim()));
  assert.deepStrictEqual(stepsEn, [
    'Assess: Find your best way to learn',
    'Learn: Hotel service',
    'Role-play: Practice with AI',
    'Scoring: Strengths & challenges'
  ], 'CH0-05 EN steps mismatch: ' + JSON.stringify(stepsEn));
  await page.screenshot({ path: 'scratch/verify_ch0_05_en.png' });

  console.log('2. Testing Greet (CH0-07), Hearing Q4 Follow-up (CH0-12), Schedule (CH0-22), Profile (CH0-16\'), Journey (CH0-18)...');
  await page.evaluate(() => window.goTo(window.loadCharacterGreet));
  await new Promise(r => setTimeout(r, 200));
  const greetEn = await page.$eval('#ob-greet-text', el => el.innerText.trim());
  assert(greetEn.includes("I'm SHOSA."), 'CH0-07 EN mismatch: ' + greetEn);

  // Q4 Hearing (index 3)
  await page.evaluate(() => window.goTo(window.loadHearing, 3));
  await new Promise(r => setTimeout(r, 200));
  await page.click('.frame248-option-btn:first-child .frame248-opt-row');
  await new Promise(r => setTimeout(r, 150));
  let followup = await page.$eval('#ob-hearing-followup', el => el.innerText.trim());
  assert(followup.includes('master the keigo'), 'CH0-12 EN follow-up mismatch: ' + followup);
  await page.click('#btn-hearing-en'); // toggle back to JA
  await new Promise(r => setTimeout(r, 200));
  followup = await page.$eval('#ob-hearing-followup', el => el.innerText.trim());
  assert(followup.includes('敬語表現を一緒に身につけよう'), 'CH0-12 JA follow-up mismatch: ' + followup);

  // Schedule Time (CH0-22) in EN
  await page.evaluate(() => window.goTo(window.loadScheduleTime));
  await new Promise(r => setTimeout(r, 200));
  await page.click('#btn-schedule-en'); // -> EN
  await new Promise(r => setTimeout(r, 200));
  const schedBubble = await page.$eval('#screen-ob-schedule-time .langselect-bubble p', el => el.innerText.trim());
  const schedNotifyTitle = await page.$eval('#schedule-notify-card .schedule-notify-card-title', el => el.innerText.trim());
  const schedNotifyHint = await page.$eval('#screen-ob-schedule-time .schedule-notify-hint', el => el.innerText.trim());
  assert(schedBubble.includes('choose your study time'), 'CH0-22 EN bubble mismatch: ' + schedBubble);
  assert.strictEqual(schedNotifyTitle, 'Notify time');
  assert.strictEqual(schedNotifyHint, "We'll remind you at this time");
  // Check non-overlap between Notify time and 10:30
  const noOverlap = await page.evaluate(() => {
    const t = document.querySelector('#schedule-notify-card .schedule-notify-card-title').getBoundingClientRect();
    const c = document.querySelector('#btn-open-time-wheel').getBoundingClientRect();
    return t.right < c.left;
  });
  assert(noOverlap, 'Notify label overlaps centered 10:30 clock!');
  await page.screenshot({ path: 'scratch/verify_ch0_22_en.png' });

  // Profile (CH0-16') dropdown check in EN -> JA
  await page.evaluate(() => window.goTo(window.loadProfile1));
  await new Promise(r => setTimeout(r, 200));
  let countryOpts = await page.$$eval('#ob-country-input option', els => els.map(o => o.textContent.trim()));
  assert(countryOpts.includes('Japan') && countryOpts.includes('Vietnam') && countryOpts.includes('Myanmar'), 'Country dropdown EN mismatch: ' + JSON.stringify(countryOpts));
  await page.click('#btn-profile-en'); // -> JA
  await new Promise(r => setTimeout(r, 200));
  countryOpts = await page.$$eval('#ob-country-input option', els => els.map(o => o.textContent.trim()));
  assert(countryOpts.includes('日本') && countryOpts.includes('ベトナム'), 'Country dropdown JA mismatch: ' + JSON.stringify(countryOpts));

  // Journey (CH0-18) check
  await page.evaluate(() => window.goTo(window.loadJourney));
  await new Promise(r => setTimeout(r, 200));
  const journeyTitle = await page.$eval('.journey-card-title', el => el.innerText.trim());
  assert(journeyTitle.startsWith('✔︎ '), 'CH0-18 checkmark prefix missing: ' + journeyTitle);

  // Passport Complete (CH0-19) toggle button check
  await page.evaluate(() => window.goTo(window.finalizeOnboarding));
  await new Promise(r => setTimeout(r, 200));
  await assertChipFlushRight('#btn-passport-en');
  await page.click('#btn-passport-en'); // -> EN
  await new Promise(r => setTimeout(r, 200));
  const ch19Badge = await page.$eval('#screen-ob-passport .ch19-badge-text', el => el.innerText.trim());
  assert.strictEqual(ch19Badge, 'Aptitude Test Complete!');

  console.log('3. Testing Chapter 1 (Sheet2): Guide + L01 + Focus + Complete...');
  // Start Chapter 1 in JA first
  await page.click('#btn-passport-en'); // -> back to JA
  await new Promise(r => setTimeout(r, 200));
  await page.evaluate(() => window.startChapter101());
  await new Promise(r => setTimeout(r, 300));

  await assertChipFlushRight('#btn-ch101-intro-en');
  let introTitle = await page.$eval('#ch101-intro-title', el => el.innerText.trim());
  assert.strictEqual(introTitle, '1章：Omotenashi Mindset');
  await page.click('#btn-ch101-intro-en'); // -> EN
  await new Promise(r => setTimeout(r, 200));
  introTitle = await page.$eval('#ch101-intro-title', el => el.innerText.trim());
  assert.strictEqual(introTitle, 'Chapter 1: Omotenashi Mindset');
  await page.screenshot({ path: 'scratch/verify_ch1_intro_en.png' });

  // Switch back to JA and test L01 -> Incorrect branch + Correct branch -> Complete
  await page.click('#btn-ch101-intro-en');
  await new Promise(r => setTimeout(r, 200));
  await page.click('#btn-ch101-intro-next'); // -> L01 sit1
  await new Promise(r => setTimeout(r, 250));

  const ch1Data = await page.evaluate(() => window.CH1_DATA);
  assert.strictEqual(ch1Data.lessons.length, 1, 'Expected only L01 in CH1_DATA.lessons');
  assert.strictEqual(ch1Data.lessons[0].id, 'L01', 'Expected L01 to be the sole lesson');

  for (let pass = 0; pass < 2; pass++) {
    const lesson = ch1Data.lessons[0];

    // Sit 1
    await assertChipFlushRight('#btn-ch101-sit1-en');
    const sit1TextJa = await page.$eval('#ch101-sit1-text', el => el.innerText.trim());
    assert.strictEqual(sit1TextJa, lesson.narrationJa, `${lesson.id} sit1 JA mismatch`);

    if (pass === 0) {
      // Test toggling to EN & back on sit1 for L01
      await page.click('#btn-ch101-sit1-en');
      await new Promise(r => setTimeout(r, 150));
      const sit1TextEn = await page.$eval('#ch101-sit1-text', el => el.innerText.trim());
      assert.strictEqual(sit1TextEn, lesson.narrationEn, 'L01 sit1 EN mismatch');
      await page.click('#btn-ch101-sit1-en'); // back to JA
      await new Promise(r => setTimeout(r, 150));
    }
    await page.click('#btn-ch101-sit1-advance'); // -> Sit 2 Turn 1
    await new Promise(r => setTimeout(r, 200));

    // Sit 2 Turn 1
    await assertChipFlushRight('#btn-ch101-sit2-en');
    const sit2Turn1Text = await page.$eval('#ch101-sit2-text', el => el.innerText.trim());
    assert(sit2Turn1Text.includes(lesson.line1Ja), `${lesson.id} sit2 turn1 JA mismatch`);
    await page.click('#btn-ch101-sit2-advance'); // -> Sit 2 Turn 2
    await new Promise(r => setTimeout(r, 200));

    // Sit 2 Turn 2
    const sit2Turn2Text = await page.$eval('#ch101-sit2-text', el => el.innerText.trim());
    assert(sit2Turn2Text.includes(lesson.line2Ja), `${lesson.id} sit2 turn2 JA mismatch`);
    await page.click('#btn-ch101-sit2-advance'); // -> Question
    await new Promise(r => setTimeout(r, 200));

    // Question screen
    await assertChipFlushRight('#btn-ch101-question-en');
    const qTagJa = await page.$eval('#ch101-question-tag', el => el.innerText.trim());
    const qTextJa = await page.$eval('#ch101-question-text', el => el.innerText.trim());
    const choiceAJa = await page.$eval('#ch101-choice-a-text', el => el.innerText.trim());
    const choiceBJa = await page.$eval('#ch101-choice-b-text', el => el.innerText.trim());
    assert.strictEqual(qTagJa, lesson.situationTagJa);
    assert.strictEqual(qTextJa, lesson.questionJa);
    assert.strictEqual(choiceAJa, lesson.choiceAJa);
    assert.strictEqual(choiceBJa, lesson.choiceBJa);

    if (pass === 1) {
      await page.screenshot({ path: 'scratch/verify_ch1_l01_q_ja.png' });
      await page.click('#btn-ch101-question-en');
      await new Promise(r => setTimeout(r, 150));
      assert.strictEqual(await page.$eval('#ch101-choice-a-text', el => el.innerText.trim()), lesson.choiceAEn);
      assert.strictEqual(await page.$eval('#ch101-choice-b-text', el => el.innerText.trim()), lesson.choiceBEn);
      await page.screenshot({ path: 'scratch/verify_ch1_l01_q_en.png' });
      await page.click('#btn-ch101-question-en'); // back to JA
      await new Promise(r => setTimeout(r, 150));
    }

    // Choose wrong on pass 0 (choice A -> Incorrect), correct on pass 1 (choice B -> Correct)
    const pickChoice = (pass === 0) ? (lesson.correct === 'A' ? 'B' : 'A') : lesson.correct;
    await page.click(pickChoice === 'A' ? '#btn-ch101-choice-a' : '#btn-ch101-choice-b');
    await new Promise(r => setTimeout(r, 400));

    // Result screen
    await assertChipFlushRight('#btn-ch101-result-en');
    const resTitleJa = await page.$eval('#ch101-result-title', el => el.innerText.trim());
    const expectedTitleJa = (pickChoice === lesson.correct) ? '正解！' : '不正解';
    assert.strictEqual(resTitleJa, expectedTitleJa, `${lesson.id} result status JA mismatch`);
    const expTextJa = await page.$eval('#ch101-result-explanation', el => el.innerText.trim());
    assert.strictEqual(expTextJa, lesson.reasonJa);

    // Toggle Result to EN and verify
    await page.click('#btn-ch101-result-en');
    await new Promise(r => setTimeout(r, 150));
    const resTitleEn = await page.$eval('#ch101-result-title', el => el.innerText.trim());
    assert.strictEqual(resTitleEn, (pickChoice === lesson.correct) ? 'Correct!' : 'Incorrect');
    assert.strictEqual(await page.$eval('#ch101-result-explanation', el => el.innerText.trim()), lesson.reasonEn);
    if (pass === 1) {
      await page.screenshot({ path: 'scratch/verify_ch1_l01_res_en.png' });
      await page.click('#btn-ch101-focus');
      await new Promise(r => setTimeout(r, 200));
      const focusEn = await page.$eval('#ch101-focus-body', el => el.innerText.trim());
      assert(focusEn.includes('wearing good perfume'), 'L01 focus EN mismatch: ' + focusEn);
      await page.screenshot({ path: 'scratch/verify_ch1_l01_focus_en.png' });
      await page.click('#btn-ch101-focus-modal-close');
      await new Promise(r => setTimeout(r, 150));
    }
    await page.click('#btn-ch101-result-en'); // back to JA
    await new Promise(r => setTimeout(r, 150));

    if (pass === 0) {
      await page.evaluate(() => window.loadCh101Lesson(0));
      await new Promise(r => setTimeout(r, 200));
    } else {
      await page.click('#btn-ch101-result-next');
      await new Promise(r => setTimeout(r, 250));
    }
  }

  // CH1-END Complete screen
  await assertChipFlushRight('#btn-ch101-complete-en');
  let compTitle = await page.$eval('.ch101-complete-title', el => el.innerText.trim());
  let compUnlock = await page.$eval('.ch101-complete-unlocked-title', el => el.innerText.trim());
  assert.strictEqual(compTitle, '1章 学習完了！');
  assert(compUnlock.includes('JOB診断'), 'CH1-END unlock label mismatch: ' + compUnlock);
  await page.click('#btn-ch101-complete-en');
  await new Promise(r => setTimeout(r, 200));
  compTitle = await page.$eval('.ch101-complete-title', el => el.innerText.trim());
  compUnlock = await page.$eval('.ch101-complete-unlocked-title', el => el.innerText.trim());
  assert.strictEqual(compTitle, 'Chapter 1 Complete!');
  assert.strictEqual(compUnlock, 'Chapter 2: JOB Assessment has been unlocked');
  await page.screenshot({ path: 'scratch/verify_ch1_complete_en.png' });

  assert.strictEqual(errors.length, 0, 'Console/page errors detected:\n' + errors.join('\n'));
  console.log('ALL TESTS PASSED CLEANLY (Sheet1 + Chapter 1 L01 + EN/JP toggles + layout checks)!');
  await browser.close();
})();

