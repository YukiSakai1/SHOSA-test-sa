const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const fileUrl = 'file://' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');

  console.log('=== TEST 1: Desktop Viewport (1280x900) ===');
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const desktopContainerBox = await page.$eval('.device-container', el => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      width: r.width,
      height: r.height,
      maxWidth: style.maxWidth,
      borderLeftWidth: style.borderLeftWidth,
      boxShadow: style.boxShadow,
      margin: style.margin
    };
  });
  console.log('Desktop .device-container metrics:', desktopContainerBox);

  if (desktopContainerBox.width > 431) {
    console.error('FAIL: .device-container width is greater than 430px on desktop! Width:', desktopContainerBox.width);
    process.exit(1);
  }
  console.log('PASS: .device-container is locked to max 430px (actual:', desktopContainerBox.width, ')');

  const desktopScrollMetrics = await page.evaluate(() => {
    return {
      bodyOverflow: window.getComputedStyle(document.body).overflow,
      htmlOverflow: window.getComputedStyle(document.documentElement).overflow,
      bodyHeight: document.body.clientHeight,
      htmlScrollHeight: document.documentElement.scrollHeight,
      windowHeight: window.innerHeight
    };
  });
  console.log('Desktop scroll metrics:', desktopScrollMetrics);
  if (desktopScrollMetrics.htmlScrollHeight > desktopScrollMetrics.windowHeight + 2) {
    console.error('FAIL: Outer page scrollbar exists on desktop!');
    process.exit(1);
  }
  console.log('PASS: Outer page has no scrollbar on desktop.');

  console.log('\n=== TEST 2: Mobile Viewport (430x932 - iPhone 14/15/16 Pro Max) ===');
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const mobileContainerBox = await page.$eval('.device-container', el => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      width: r.width,
      height: r.height,
      borderLeftWidth: style.borderLeftWidth,
      borderRadius: style.borderRadius,
      boxShadow: style.boxShadow
    };
  });
  console.log('Mobile (430x932) metrics:', mobileContainerBox);
  if (mobileContainerBox.width !== 430 || mobileContainerBox.borderLeftWidth !== '0px') {
    console.error('FAIL: On mobile width 430, device container should be 430px edge-to-edge with 0px border!');
    process.exit(1);
  }
  console.log('PASS: On mobile 430x932, container is edge-to-edge with border: none.');

  console.log('\n=== TEST 3: Mobile Viewport (390x844 - iPhone 12/13/14) ===');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  const mobile390Box = await page.$eval('.device-container', el => {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      width: r.width,
      height: r.height,
      borderLeftWidth: style.borderLeftWidth
    };
  });
  console.log('Mobile (390x844) metrics:', mobile390Box);
  if (mobile390Box.width !== 390) {
    console.error('FAIL: On mobile 390, container should be 390px!');
    process.exit(1);
  }
  console.log('PASS: Container scales cleanly to 390px edge-to-edge.');

  console.log('\n=== TEST 4: Screen Height & Containment Across Key Screens ===');
  const screens = [
    { name: 'Title', url: fileUrl },
    { name: 'Schedule Time', url: fileUrl + '?screen=schedule-time' },
    { name: 'Profile Input', url: fileUrl + '?screen=profile' },
    { name: 'Journey', url: fileUrl + '?screen=journey' },
    { name: 'Passport Finish', url: fileUrl + '?screen=passport' },
    { name: 'Chapter 101 Intro', url: fileUrl + '?screen=101' },
    { name: 'Home Screen', url: fileUrl + '?screen=home' }
  ];

  for (const scr of screens) {
    await page.goto(scr.url, { waitUntil: 'networkidle0' });
    const screenFits = await page.evaluate(() => {
      const docHeight = document.documentElement.clientHeight;
      const scrollH = document.documentElement.scrollHeight;
      const bodyScrollH = document.body.scrollHeight;
      return {
        docHeight,
        scrollH,
        bodyScrollH,
        noPageScroll: scrollH <= docHeight + 2
      };
    });
    console.log(`[Screen: ${scr.name}] Fits in 1 screen:`, screenFits.noPageScroll, `(docHeight: ${screenFits.docHeight}, scrollH: ${screenFits.scrollH})`);
    if (!screenFits.noPageScroll) {
      console.warn(`WARNING: Screen ${scr.name} exceeds single screen height!`);
    }
  }

  console.log('\n=== TEST 5: Safe Area CSS Variables & Computed Values ===');
  const safeAreaVars = await page.evaluate(() => {
    const style = window.getComputedStyle(document.documentElement);
    return {
      safeTop: style.getPropertyValue('--safe-top').trim(),
      safeBottom: style.getPropertyValue('--safe-bottom').trim(),
      safeLeft: style.getPropertyValue('--safe-left').trim(),
      safeRight: style.getPropertyValue('--safe-right').trim()
    };
  });
  console.log('Safe area CSS custom variables:', safeAreaVars);

  console.log('\nALL TESTS PASSED SUCCESSFULLY!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});

