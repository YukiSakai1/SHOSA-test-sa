const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 430, height: 932 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.toString()));

  const filePath = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  // Helper to get active screen id
  async function getActiveScreenId() {
    return await page.evaluate(() => {
      const active = Array.from(document.querySelectorAll('.screen')).find(s => !s.classList.contains('hidden'));
      return active ? active.id : null;
    });
  }

  console.log('--- STEP 0: Reset & Start Fresh ---');
  await page.evaluate(() => {
    localStorage.clear();
    if (typeof startOnboarding === 'function') startOnboarding();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Active Screen after startOnboarding:', await getActiveScreenId());

  // Language Select
  console.log('--- STEP 1: Language Select ---');
  await page.evaluate(() => {
    const card = document.querySelector('.langselect-ticket-card');
    if (card) card.click();
    const nextBtn = document.getElementById('btn-ob-langselect-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Active Screen after LangSelect:', await getActiveScreenId());

  // Intro Slides (4 slides)
  console.log('--- STEP 2: Intro Slides ---');
  for (let s = 0; s < 4; s++) {
    console.log(`Slide ${s}, screen:`, await getActiveScreenId());
    await page.evaluate(() => {
      const btn = document.getElementById('btn-slide-action');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
  }
  console.log('Active Screen after Slide 3:', await getActiveScreenId());

  // Character Greet
  console.log('--- STEP 3: Character Greet ---');
  await page.evaluate(() => {
    const btn = document.getElementById('btn-ob-character-next');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Active Screen after Character Greet:', await getActiveScreenId());

  // Hearing (4 questions)
  console.log('--- STEP 4: Hearing (4 Questions) ---');
  for (let q = 0; q < 4; q++) {
    console.log(`Hearing Q${q + 1}, screen:`, await getActiveScreenId());
    await page.evaluate(() => {
      // Pick first card if available
      const card = document.querySelector('.frame248-opt-row') || document.querySelector('.frame248-option-btn');
      if (card) card.click();
      const nextBtn = document.getElementById('btn-ob-hearing-next');
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
  }

  // --- CHECK 1: 学習スケジュール関係 ---
  console.log('\n================ CHECK 1: 学習スケジュール関係 ================');
  const screenSched = await getActiveScreenId();
  console.log('Current Screen (expected: screen-ob-schedule-time):', screenSched);
  if (screenSched !== 'screen-ob-schedule-time') {
    throw new Error(`Expected screen-ob-schedule-time, got ${screenSched}`);
  }

  // Test Back button on Schedule Time
  console.log('Testing Back button on Schedule Time...');
  await page.evaluate(() => {
    const backBtn = document.querySelector('#screen-ob-schedule-time .figma-header-back-btn');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Back (expected: screen-ob-hearing Q4):', await getActiveScreenId());

  // Forward back to Schedule Time
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-hearing-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Back on Schedule Time:', await getActiveScreenId());

  // Select preferred time and click NEXT
  await page.evaluate(() => {
    const card = document.querySelector('.schedule-time-card');
    if (card) card.click();
    const nextBtn = document.getElementById('btn-ob-schedule-time-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // --- CHECK 2: プロフィール入力関係 ---
  console.log('\n================ CHECK 2: プロフィール入力関係 ================');
  const screenProfileIntro = await getActiveScreenId();
  console.log('Current Screen (expected: screen-ob-profile-intro):', screenProfileIntro);
  if (screenProfileIntro !== 'screen-ob-profile-intro') {
    throw new Error(`Expected screen-ob-profile-intro, got ${screenProfileIntro}`);
  }

  // Test Back button on Profile Intro
  console.log('Testing Back button on Profile Intro...');
  await page.evaluate(() => {
    const backBtn = document.querySelector('#screen-ob-profile-intro .figma-header-back-btn');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Back (expected: screen-ob-schedule-time):', await getActiveScreenId());

  // Forward back to Profile Intro -> Next -> Profile 1
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-schedule-time-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-profile-intro-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Profile Intro NEXT (expected: screen-ob-profile1):', await getActiveScreenId());

  // Fill profile and click NEXT
  await page.evaluate(() => {
    const nameInput = document.getElementById('ob-name-input');
    if (nameInput) {
      nameInput.value = 'Taro';
      nameInput.dispatchEvent(new Event('input'));
    }
    const countrySelect = document.getElementById('ob-country-input');
    if (countrySelect) {
      countrySelect.value = '日本';
      countrySelect.dispatchEvent(new Event('change'));
    }
    const genderBtn = document.querySelector('#ob-gender-row .figma-gender-btn');
    if (genderBtn) genderBtn.click();
    const nextBtn = document.getElementById('btn-ob-profile1-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Profile 1 NEXT (expected: screen-ob-journey):', await getActiveScreenId());

  // Click START/NEXT on Journey
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-journey-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // --- CHECK 3: ５段階評価関係 ---
  console.log('\n================ CHECK 3: ５段階評価関係 ================');
  const screenAptIntro = await getActiveScreenId();
  console.log('Current Screen (expected: screen-ob-aptitude-intro):', screenAptIntro);
  if (screenAptIntro !== 'screen-ob-aptitude-intro') {
    throw new Error(`Expected screen-ob-aptitude-intro, got ${screenAptIntro}`);
  }

  // Test Back button on Aptitude Intro
  console.log('Testing Back button on Aptitude Intro...');
  await page.evaluate(() => {
    const backBtn = document.querySelector('#screen-ob-aptitude-intro .figma-header-back-btn');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Back (expected: screen-ob-journey):', await getActiveScreenId());

  // Forward back to Aptitude Intro
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-journey-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click NEXT to Aptitude Questions
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-ob-aptitude-intro-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen for Aptitude Q Page 1 (expected: screen-ob-aptitude):', await getActiveScreenId());

  // Answer Page 0 (3 questions)
  await page.evaluate(() => {
    const rows = document.querySelectorAll('.ob-likert-row');
    rows.forEach(r => {
      const btn = r.querySelector('.ob-likert-btn[data-value="5"]');
      if (btn) btn.click();
    });
    const nextBtn = document.getElementById('btn-ob-aptitude-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Page 0 NEXT (expected: screen-ob-aptitude):', await getActiveScreenId());

  // Answer Page 1 (3 questions)
  await page.evaluate(() => {
    const rows = document.querySelectorAll('.ob-likert-row');
    rows.forEach(r => {
      const btn = r.querySelector('.ob-likert-btn[data-value="4"]');
      if (btn) btn.click();
    });
    const nextBtn = document.getElementById('btn-ob-aptitude-next');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // --- CHECK 4: 最後に適性診断完了 ---
  console.log('\n================ CHECK 4: 最後に適性診断完了 ================');
  const screenPassport = await getActiveScreenId();
  console.log('Current Screen (expected: screen-ob-passport):', screenPassport);
  if (screenPassport !== 'screen-ob-passport') {
    throw new Error(`Expected screen-ob-passport, got ${screenPassport}`);
  }

  // Click "結果を見る"
  await page.evaluate(() => {
    const btn = document.getElementById('btn-ob-view-result');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  const screenResult = await getActiveScreenId();
  console.log('Screen after "結果を見る" (expected: screen-ob-result):', screenResult);
  if (screenResult !== 'screen-ob-result') {
    throw new Error(`Expected screen-ob-result, got ${screenResult}`);
  }

  // Test Back button on Result
  console.log('Testing Back button on Diagnosis Result...');
  await page.evaluate(() => {
    const backBtn = document.getElementById('btn-result-back');
    if (backBtn) backBtn.click();
  });
  await new Promise(r => setTimeout(r, 400));
  console.log('Screen after Back (expected: screen-ob-passport):', await getActiveScreenId());

  // Click "結果を見る" again
  await page.evaluate(() => {
    const btn = document.getElementById('btn-ob-view-result');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 400));

  // Click NEXT to Game / Chapter 101
  console.log('Clicking NEXT on Diagnosis Result to enter Chapter 101...');
  await page.evaluate(() => {
    const nextBtn = document.getElementById('btn-result-proceed');
    if (nextBtn) nextBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const screenCh101 = await getActiveScreenId();
  console.log('Current Screen after Result NEXT (expected: screen-ch101-intro):', screenCh101);
  if (screenCh101 !== 'screen-ch101-intro') {
    throw new Error(`Expected screen-ch101-intro, got ${screenCh101}`);
  }

  // Take screenshot of Chapter 101
  await page.screenshot({ path: path.resolve(__dirname, 'reordered_ch101_reached.png') });

  console.log('\n🎉 ALL REORDERING TESTS PASSED PERFECTLY!');
  await browser.close();
})();
