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

  // Ensure clean storage
  await page.evaluate(() => {
    localStorage.clear();
    if (typeof resetAllSavedData === 'function') resetAllSavedData();
    if (typeof startOnboarding === 'function') startOnboarding();
    goTo(loadAptitude, 0);
  });
  await new Promise(r => setTimeout(r, 250));

  // Check all 6 pages (3 questions per page = 18 questions total)
  const chosenValues = [
    [3, 1, 5], // Page 0: Q1, Q2, Q3
    [2, 4, 1], // Page 1: Q4 (Adaptability), Q5 (StressTolerance), Q6 (StressTolerance)
    [5, 2, 4], // Page 2: Q7 (Observation), Q8 (Observation), Q9
    [1, 5, 3], // Page 3: Q10, Q11 (Teamwork), Q12 (Teamwork)
    [4, 2, 5], // Page 4: Q13 (Initiative), Q14 (Initiative), Q15 (StressTolerance)
    [3, 5, 1]  // Page 5: Q16 (StressTolerance), Q17 (MultiTasking), Q18 (MultiTasking)
  ];

  for (let p = 0; p < 6; p++) {
    const startId = p * 3 + 1;
    // Before answering on this page, NEXT must be disabled and NO circle selected!
    const initialNextDisabled = await page.$eval('#btn-ob-aptitude-next', el => el.disabled);
    assert.strictEqual(initialNextDisabled, true, `Page ${p}: NEXT should be disabled initially`);

    const initialSelectedCount = await page.$$eval('#ob-aptitude-list .ob-likert-btn.selected', els => els.length);
    assert.strictEqual(initialSelectedCount, 0, `Page ${p}: Expected 0 pre-selected options, got ${initialSelectedCount}`);

    for (let i = 0; i < 3; i++) {
      const qId = startId + i;
      const val = chosenValues[p][i];
      const sel = `.ob-likert-row[data-question-id="${qId}"] .ob-likert-btn.val-${val}`;
      await page.click(sel);
      await new Promise(r => setTimeout(r, 80));

      // Verify exactly one button is selected in this question's row with expected value
      const selectedInRow = await page.$$eval(`.ob-likert-row[data-question-id="${qId}"] .ob-likert-btn.selected`, els =>
        els.map(e => Number(e.dataset.value))
      );
      assert.deepStrictEqual(selectedInRow, [val], `Page ${p} Q${qId}: expected [${val}], got ${JSON.stringify(selectedInRow)}`);

      // Verify earlier rows on this page were NOT altered
      for (let j = 0; j < i; j++) {
        const prevQId = startId + j;
        const prevVal = chosenValues[p][j];
        const prevSelected = await page.$$eval(`.ob-likert-row[data-question-id="${prevQId}"] .ob-likert-btn.selected`, els =>
          els.map(e => Number(e.dataset.value))
        );
        assert.deepStrictEqual(prevSelected, [prevVal], `Page ${p} Q${prevQId} overwritten when clicking Q${qId}!`);
      }

      const nextDisabled = await page.$eval('#btn-ob-aptitude-next', el => el.disabled);
      if (i < 2) {
        assert.strictEqual(nextDisabled, true, `Page ${p}: NEXT enabled early after clicking only Q${qId}`);
      } else {
        assert.strictEqual(nextDisabled, false, `Page ${p}: NEXT stayed disabled after answering all 3 items`);
      }
    }

    // On Page 1 (Q4, Q5, Q6 — matches user's screenshot page!), also test tapping an alternate circle on Q6 & toggling EN/JP
    if (p === 1) {
      await page.click(`.ob-likert-row[data-question-id="6"] .ob-likert-btn.val-5`);
      await new Promise(r => setTimeout(r, 80));
      chosenValues[1][2] = 5;
      const q5After = await page.$$eval(`.ob-likert-row[data-question-id="5"] .ob-likert-btn.selected`, els => els.map(e => Number(e.dataset.value)));
      const q6After = await page.$$eval(`.ob-likert-row[data-question-id="6"] .ob-likert-btn.selected`, els => els.map(e => Number(e.dataset.value)));
      assert.deepStrictEqual(q5After, [4], 'Q5 changed when clicking Q6!');
      assert.deepStrictEqual(q6After, [5], 'Q6 did not update to 5!');

      // Toggle EN and back to JP, ensure selections persist visually
      await page.click('#btn-aptitude-en');
      await new Promise(r => setTimeout(r, 150));
      const enQ6Text = await page.$eval(`.aptitude-block[data-question-id="6"] .ob-likert-question`, el => el.innerText);
      assert(enQ6Text.includes('mistake'), 'Q6 EN translation mismatch: ' + enQ6Text);
      await page.click('#btn-aptitude-en');
      await new Promise(r => setTimeout(r, 150));

      await page.screenshot({ path: 'scratch/verify_aptitude_page1.png' });
    }

    // Advance to next page (or finish)
    await page.click('#btn-ob-aptitude-next');
    await new Promise(r => setTimeout(r, 250));
  }

  // Should land on passport screen -> view result
  const onPassport = await page.$eval('#screen-ob-passport', el => !el.classList.contains('hidden'));
  assert.strictEqual(onPassport, true, 'Expected #screen-ob-passport after completing all 6 aptitude pages');

  // Verify all 18 per-question keys saved cleanly in localStorage
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('shosa_game_aptitude_scores') || '{}'));
  for (let id = 1; id <= 18; id++) {
    assert(saved[`q${id}`] != null, `Missing saved answer for q${id}`);
  }

  // Navigate to result and verify calculation produces valid result without errors
  await page.click('#btn-ob-view-result');
  await new Promise(r => setTimeout(r, 250));
  const resultJob = await page.$eval('.result-job-name', el => el.innerText.trim());
  assert(resultJob.length > 0, 'Empty aptitude result job name');

  assert.strictEqual(errors.length, 0, 'Unexpected runtime errors: ' + errors.join(' | '));
  console.log(`ALL 18 APTITUDE QUESTIONS PASSED! Result job: ${resultJob}`);
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});

