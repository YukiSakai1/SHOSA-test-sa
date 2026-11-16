const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace all occurrences of:
// <button class="btn-en-toggle..." ...>
//   <img src="assets/images/btn_lang_toggle.png" alt="EN" class="btn-en-img">
// </button>
const chipMarkup = `
    <div class="reproduced-lang-chip">
      <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
        <polyline points="21 3 21 8 16 8" />
      </svg>
      <span class="lang-text">EN</span>
    </div>`;

// Replace the img tag inside btn-en-toggle
html = html.replace(/<button class="btn-en-toggle([^"]*)"([^>]*)>\s*<img src="assets\/images\/btn_lang_toggle\.png"[^>]*>\s*<\/button>/g,
  `<button class="btn-en-toggle$1"$2>${chipMarkup}\n      </button>`);

// Also replace line 609 (schedule time screen)
html = html.replace(/<button class="figma-en-toggle-btn"[^>]*>\s*<img src="assets\/images\/btn_en\.png"[^>]*>\s*<\/button>/g,
  `<button class="btn-en-toggle" id="btn-schedule-en" title="Translate / 言語切り替え">${chipMarkup}\n        </button>`);

// Also add to ch101-result header if not present
if (html.includes('<div class="ch101-header-spacer"></div>')) {
  html = html.replace('<div class="ch101-header-spacer"></div>',
    `<button class="btn-en-toggle" id="btn-ch101-result-en" title="Translate / 言語切り替え">${chipMarkup}\n        </button>`);
}

// Add data-i18n attributes where missing:
// 1. Title screen
html = html.replace('<span class="ch01-tagline">Toward the future of working in Japan</span>',
  '<span class="ch01-tagline" data-i18n="title_subtitle">Toward the future of working in Japan</span>');
html = html.replace('<button class="ch01-social-btn btn-google" id="btn-title-google">\n          <span class="ch01-btn-text">Googleで続ける</span>\n        </button>',
  '<button class="ch01-social-btn btn-google" id="btn-title-google">\n          <span class="ch01-btn-text" data-i18n="title_google_btn">Googleで続ける</span>\n        </button>');
html = html.replace('<button class="ch01-social-btn btn-apple" id="btn-title-apple">\n          <span class="ch01-btn-text">Appleで続ける</span>\n        </button>',
  '<button class="ch01-social-btn btn-apple" id="btn-title-apple">\n          <span class="ch01-btn-text" data-i18n="title_apple_btn">Appleで続ける</span>\n        </button>');
html = html.replace('<button class="ch01-social-btn btn-phone" id="btn-title-phone">\n          <span class="ch01-btn-text">電話番号で続ける</span>\n        </button>',
  '<button class="ch01-social-btn btn-phone" id="btn-title-phone">\n          <span class="ch01-btn-text" data-i18n="title_phone_btn">電話番号で続ける</span>\n        </button>');

// 2. Schedule screen
html = html.replace('<span class="schedule-notify-card-title">お知らせ時間</span>',
  '<span class="schedule-notify-card-title" data-i18n="notify_header">お知らせ時間</span>');
html = html.replace('<div class="time-wheel-title">お知らせ時間を編集</div>',
  '<div class="time-wheel-title" data-i18n="time_wheel_title">お知らせ時間を編集</div>');
html = html.replace('<button id="btn-submit-time-wheel" class="time-wheel-submit-btn">設定を完了する</button>',
  '<button id="btn-submit-time-wheel" class="time-wheel-submit-btn" data-i18n="time_wheel_submit">設定を完了する</button>');

// 3. ch101 result & modal & complete
html = html.replace('<span class="ch101-result-status-title">正解！</span>',
  '<span class="ch101-result-status-title" data-i18n="ch101_correct_title">正解！</span>');
html = html.replace('<p class="ch101-result-explanation-text">',
  '<p class="ch101-result-explanation-text" data-i18n="ch101_result_explanation">');
html = html.replace('<p class="ch101-bubble-text">',
  '<p class="ch101-bubble-text" data-i18n="ch101_bubble_text">');
html = html.replace('<span class="ch101-focus-label">SHOSA Focus</span>',
  '<span class="ch101-focus-label" data-i18n="ch101_focus_btn">SHOSA Focus</span>');
html = html.replace('<h3 class="ch101-focus-modal-title">SHOSA FOCUS</h3>',
  '<h3 class="ch101-focus-modal-title" data-i18n="ch101_focus_title">SHOSA FOCUS</h3>');
html = html.replace('<p class="ch101-checklist-caption">',
  '<p class="ch101-checklist-caption" data-i18n="ch101_checklist_caption">');

html = html.replace('<h1 class="ch101-complete-title">1章 学習完了！</h1>',
  '<h1 class="ch101-complete-title" data-i18n="ch101_complete_title">1章 学習完了！</h1>');
html = html.replace('<h2 class="ch101-complete-unlocked-title">',
  '<h2 class="ch101-complete-unlocked-title" data-i18n="ch101_complete_unlocked">');
html = html.replace('<p class="ch101-complete-desc">',
  '<p class="ch101-complete-desc" data-i18n="ch101_complete_desc">');
html = html.replace('<p class="ch101-complete-review-note">※いつでもホーム画面から全レッスンの振り返りが可能です</p>',
  '<p class="ch101-complete-review-note" data-i18n="ch101_complete_review">※いつでもホーム画面から全レッスンの振り返りが可能です</p>');

// Bump cache buster for style.css
html = html.replace(/style\.css\?v=\d+/g, 'style.css?v=96');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html');

