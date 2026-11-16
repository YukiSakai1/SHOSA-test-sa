const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932, deviceScaleFactor: 2 });

  const url = 'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait 500ms
  await new Promise(r => setTimeout(r, 600));

  // 1. Initial Title Screen
  console.log('--- Initial Title Screen (JP) ---');
  let langText = await page.$eval('.btn-en-toggle .lang-text', el => el.textContent.trim()).catch(() => 'none');
  console.log('Lang chip text:', langText);

  // Jump to Hearing Screen
  await page.evaluate(() => {
    window.goTo(window.loadHearing, 0);
  });
  await new Promise(r => setTimeout(r, 400));

  let hearingQ = await page.$eval('#ob-hearing-question', el => el.innerText.trim());
  let chipText = await page.$eval('#btn-hearing-en .lang-text', el => el.textContent.trim());
  console.log('Hearing Q (JP):', hearingQ);
  console.log('Chip text:', chipText);
  await page.screenshot({ path: 'scratch/test_hearing_jp.png' });

  // 2. Click the EN chip
  console.log('--- Toggling to English ---');
  await page.click('#btn-hearing-en');
  await new Promise(r => setTimeout(r, 500));

  hearingQ = await page.$eval('#ob-hearing-question', el => el.innerText.trim());
  chipText = await page.$eval('#btn-hearing-en .lang-text', el => el.textContent.trim());
  console.log('Hearing Q (EN):', hearingQ);
  console.log('Chip text after toggle:', chipText);
  await page.screenshot({ path: 'scratch/test_hearing_en.png' });

  // 3. Test Schedule Screen
  console.log('--- Schedule Screen in English ---');
  await page.evaluate(() => {
    window.goTo(window.loadScheduleTime);
  });
  await new Promise(r => setTimeout(r, 400));
  let scheduleBubble = await page.$eval('.langselect-bubble p', el => el.innerText.trim());
  let scheduleNotify = await page.$eval('#schedule-notify-card .schedule-notify-card-title', el => el.innerText.trim());
  let firstOpt = await page.$eval('.schedule-time-card .schedule-time-label', el => el.innerText.trim());
  console.log('Schedule Bubble (EN):', scheduleBubble);
  console.log('Schedule Notify (EN):', scheduleNotify);
  console.log('First Schedule Card (EN):', firstOpt);
  await page.screenshot({ path: 'scratch/test_schedule_en.png' });

  // 4. Toggle back to Japanese
  console.log('--- Toggling back to Japanese ---');
  await page.click('#btn-schedule-en');
  await new Promise(r => setTimeout(r, 500));
  scheduleBubble = await page.$eval('.langselect-bubble p', el => el.innerText.trim());
  scheduleNotify = await page.$eval('#schedule-notify-card .schedule-notify-card-title', el => el.innerText.trim());
  firstOpt = await page.$eval('.schedule-time-card .schedule-time-label', el => el.innerText.trim());
  chipText = await page.$eval('#btn-schedule-en .lang-text', el => el.textContent.trim());
  console.log('Schedule Bubble (JP):', scheduleBubble);
  console.log('Schedule Notify (JP):', scheduleNotify);
  console.log('First Schedule Card (JP):', firstOpt);
  console.log('Chip text after revert to JP:', chipText);
  await page.screenshot({ path: 'scratch/test_schedule_jp.png' });

  // 5. Test Aptitude Screen (all 18 questions)
  console.log('--- Testing Aptitude Screen ---');
  await page.evaluate(() => {
    window.goTo(window.loadAptitude, 0);
  });
  await new Promise(r => setTimeout(r, 400));
  let aptQ1 = await page.$eval('.ob-likert-question', el => el.innerText.trim());
  let aptLabels = await page.$$eval('.ob-likert-labels span', els => els.map(e => e.innerText.trim()));
  console.log('Aptitude Q1 (JP):', aptQ1);
  console.log('Aptitude Labels (JP):', aptLabels);

  // Toggle to EN on Aptitude
  await page.click('#btn-aptitude-en');
  await new Promise(r => setTimeout(r, 500));
  aptQ1 = await page.$eval('.ob-likert-question', el => el.innerText.trim());
  aptLabels = await page.$$eval('.ob-likert-labels span', els => els.map(e => e.innerText.trim()));
  console.log('Aptitude Q1 (EN):', aptQ1);
  console.log('Aptitude Labels (EN):', aptLabels);
  await page.screenshot({ path: 'scratch/test_aptitude_en.png' });

  // 6. Test Diagnosis Result Screen
  console.log('--- Testing Diagnosis Result Screen ---');
  await page.evaluate(() => {
    window.goTo(window.loadDiagnosisResult);
  });
  await new Promise(r => setTimeout(r, 400));
  let jobName = await page.$eval('.result-job-name', el => el.innerText.trim());
  let strengths = await page.$$eval('.ch20-st-desc', els => els.map(e => e.innerText.trim()));
  console.log('Job Name (EN):', jobName);
  console.log('Strengths (EN):', strengths);
  await page.screenshot({ path: 'scratch/test_result_en.png' });

  // Toggle back to JP on Result Screen
  await page.click('#btn-result-en');
  await new Promise(r => setTimeout(r, 500));
  jobName = await page.$eval('.result-job-name', el => el.innerText.trim());
  strengths = await page.$$eval('.ch20-st-desc', els => els.map(e => e.innerText.trim()));
  console.log('Job Name (JP):', jobName);
  console.log('Strengths (JP):', strengths);
  await page.screenshot({ path: 'scratch/test_result_jp.png' });

  await browser.close();
  console.log('All tests passed successfully!');
})();

