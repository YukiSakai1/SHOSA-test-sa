const fs = require('fs');

let code = fs.readFileSync('src/onboarding.ts', 'utf8');

// 1. Replace loadIntroSlide
const oldLoadIntroSlideStart = code.indexOf('function loadIntroSlide(i) {');
const oldLoadIntroSlideEnd = code.indexOf('/* ---------- 1g. AIチューター挨拶');

const newLoadIntroSlide = `function loadIntroSlide(i: number) {
  obState.slideIndex = i;
  const slide = ONBOARDING_DATA.introSlides[i];
  const content = $('ob-intro-content');
  content.innerHTML = '';
  const isEn = window.currentAppLang === 'en';

  const goldDividerSvg = \`
    <div class="intro-gold-divider">
      <svg viewBox="0 0 200 10" width="180" height="10">
        <line x1="8" y1="5" x2="72" y2="5" stroke="#E6D3A3" stroke-width="1.2"/>
        <polygon points="78,5 81,2 84,5 81,8" fill="#E6D3A3"/>
        <polygon points="87,5 91,1.5 95,5 91,8.5" fill="#E6D3A3"/>
        <polygon points="98,5 103,0.5 108,5 103,9.5" fill="#E6D3A3"/>
        <polygon points="111,5 115,1.5 119,5 115,8.5" fill="#E6D3A3"/>
        <polygon points="122,5 125,2 128,5 125,8" fill="#E6D3A3"/>
        <line x1="134" y1="5" x2="192" y2="5" stroke="#E6D3A3" stroke-width="1.2"/>
      </svg>
    </div>\`;

  const isWelcome = slide.type === 'welcome';
  const backBtnHtml = isWelcome ? '' : \`
    <button class="figma-header-back-btn" type="button" title="戻る" aria-label="戻る" onclick="goBack();">
      <img src="assets/images/btn_header_back.png" alt="戻る" class="figma-header-back-icon">
    </button>\`;

  const langLabel = isEn ? 'JP' : 'EN';
  const langBtnHtml = \`
    <div class="intro-top-bar \${isWelcome ? 'welcome-top-bar' : ''}">
      \${backBtnHtml}
      <button class="btn-en-toggle intro-lang-pill" type="button" title="Switch language / 言語切り替え">
        <div class="reproduced-lang-chip">
          <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-text">\${langLabel}</span>
        </div>
      </button>
    </div>\`;

  const title = isEn && slide.titleEn ? slide.titleEn : slide.title;
  const buttonLabel = isEn && slide.buttonLabelEn ? slide.buttonLabelEn : slide.buttonLabel;

  if (slide.type === 'welcome') {
    // Figma CH0-03
    content.innerHTML = \`
      <div class="intro-slide slide-welcome">
        \${langBtnHtml}
        <div class="intro-top-header ch03-header">
          <span class="intro-welcome-to">\${isEn && slide.badgeTextEn ? slide.badgeTextEn : slide.badgeText}</span>
          <img src="\${slide.logoImg}" alt="SHOSA" class="intro-logo-img">
        </div>
        <div class="intro-arch-card">
          <div class="intro-phone-mockup-wrap">
            <img src="\${slide.heroImg}" alt="SHOSA Mobile" class="intro-phone-mockup-img">
          </div>
          <div class="intro-card-body">
            <p class="intro-card-title">\${title.replace(/\\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-purple">\${buttonLabel}</button>
          </div>
        </div>
      </div>\`;
  } else if (slide.type === 'features') {
    // Figma CH0-04
    const bodyLead = isEn && slide.bodyLeadEn ? slide.bodyLeadEn : slide.bodyLead;
    const bodySub = isEn && slide.bodySubEn ? slide.bodySubEn : slide.bodySub;
    content.innerHTML = \`
      <div class="intro-slide slide-features">
        \${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">\${title.replace(/\\n/g, '<br>')}</h2>
          \${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            <img src="\${slide.heroImg}" alt="SHOSA Features" class="intro-features-img">
          </div>
          <div class="intro-card-body">
            <p class="intro-body-lead">\${bodyLead.replace(/\\n/g, '<br>')}</p>
            <p class="intro-body-sub">\${bodySub.replace(/\\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">\${buttonLabel}</button>
          </div>
        </div>
      </div>\`;
  } else if (slide.type === 'steps') {
    // Figma CH0-05
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;
    content.innerHTML = \`
      <div class="intro-slide slide-steps">
        \${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">\${title.replace(/\\n/g, '<br>')}</h2>
          \${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            <img src="\${slide.heroImg}" alt="SHOSA Steps" class="intro-steps-img">
          </div>
          <div class="intro-card-body">
            <p class="intro-body-sub" style="margin-top: 14px;">\${desc.replace(/\\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">\${buttonLabel}</button>
          </div>
        </div>
      </div>\`;
  } else if (slide.type === 'certification') {
    // Figma CH0-06
    const checkIconSvg = \`<svg class="badge-check-svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2.5 8.5l3.5 3.5 7.5-7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>\`;
    const reportLead = isEn && slide.reportLeadEn ? slide.reportLeadEn : slide.reportLead;
    const badges = isEn && slide.badgesEn ? slide.badgesEn : slide.badges;
    const reportTail = isEn ? (slide.reportTailEn || '') : slide.reportTail;
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;

    content.innerHTML = \`
      <div class="intro-slide slide-certification">
        \${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">\${title.replace(/\\n/g, '<br>')}</h2>
          \${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap ch06-report-wrap">
            <img src="\${slide.heroImg}" alt="SHOSA Report" class="intro-report-img">
          </div>
          <div class="intro-card-body ch06-body">
            <p class="intro-report-lead">\${reportLead}</p>
            <div class="intro-badges-row">
              \${badges.map((b: string) => \`<span class="intro-badge-pill">\${checkIconSvg} \${b}</span>\`).join('')}
            </div>
            \${reportTail ? \`<p class="intro-report-tail">\${reportTail}</p>\` : ''}
            <p class="intro-report-footer">\${desc.replace(/\\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">\${buttonLabel}</button>
          </div>
        </div>
      </div>\`;
  }

  const actionBtn = $('btn-slide-action');
  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (obState.slideIndex < ONBOARDING_DATA.introSlides.length - 1) {
        goTo(loadIntroSlide, obState.slideIndex + 1);
      } else {
        goTo(loadCharacterGreet);
      }
    });
  }

  showScreen('screen-ob-intro');
}
`;

code = code.slice(0, oldLoadIntroSlideStart) + newLoadIntroSlide + code.slice(oldLoadIntroSlideEnd);

// 2. Replace loadCharacterGreet to support i18n
const oldGreet = `function loadCharacterGreet() {
  showScreen('screen-ob-character');
}`;
const newGreet = `function loadCharacterGreet() {
  const isEn = window.currentAppLang === 'en';
  const greetText = $('ob-greet-text');
  if (greetText) {
    greetText.innerHTML = isEn
      ? "Nice to meet you! I'm [Name].<br>To help you learn,<br>first tell me a little about yourself."
      : "はじめまして！[名前]だよ。<br>学習をサポートするために<br>まずは君のことを教えてね。";
  }
  showScreen('screen-ob-character');
}`;
code = code.replace(oldGreet, newGreet);

// 3. Update loadAptitude & updateAptitudeProgress
const oldAptitudeStart = code.indexOf('function updateAptitudeProgress(pageIndex = 0) {');
const oldAptitudeEnd = code.indexOf('/* ---------- 1k-0. プロフィール導入');

const newAptitude = `function updateAptitudeProgress(pageIndex = 0) {
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const startIndex = pageIndex * APTITUDE_PAGE_SIZE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + APTITUDE_PAGE_SIZE);

  const totalAnswered = allQuestions.filter(q => obState.aptitudeScores[q.dimension] != null).length;
  const isEn = window.currentAppLang === 'en';
  const progEl = $('ob-aptitude-progress');
  if (progEl) progEl.textContent = \`\${isEn ? 'Aptitude Test' : '適性診断'} \${totalAnswered}/\${allQuestions.length}\`;
  const fillEl = $('ob-aptitude-progress-fill');
  if (fillEl) fillEl.style.width = Math.round((totalAnswered / allQuestions.length) * 100) + '%';

  const isPageComplete = currentQuestions.every(q => obState.aptitudeScores[q.dimension] != null);
  const nextBtn = $('btn-ob-aptitude-next');
  if (nextBtn) nextBtn.disabled = !isPageComplete;
}

function loadAptitude(pageIndex = 0) {
  obState.aptitudePageIndex = pageIndex;
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const startIndex = pageIndex * APTITUDE_PAGE_SIZE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + APTITUDE_PAGE_SIZE);
  const isEn = window.currentAppLang === 'en';

  const list = $('ob-aptitude-list');
  list.innerHTML = currentQuestions.map(q => {
    const qText = isEn && q.textEn ? q.textEn : q.text;
    return \`
      <div class="aptitude-block" data-dimension="\${q.dimension}">
        <div class="ob-likert-question">\${devEscSafe(qText).replace(/\\n/g, '<br>')}</div>
        <div class="ob-likert-row" data-dimension="\${q.dimension}">
          \${[1, 2, 3, 4, 5].map(v => \`<button type="button" class="ob-likert-btn val-\${v}" data-value="\${v}"></button>\`).join('')}
        </div>
        <div class="ob-likert-labels">
          <span>\${isEn ? 'Disagree' : 'そう思わない'}</span>
          <span>\${isEn ? 'Agree' : 'とてもそう思う'}</span>
        </div>
      </div>\`;
  }).join('');

  currentQuestions.forEach(q => {
    const row = list.querySelector(\`.ob-likert-row[data-dimension="\${q.dimension}"]\`);
    if (!row) return;
    const currentVal = obState.aptitudeScores[q.dimension];
    row.querySelectorAll('.ob-likert-btn').forEach(btn => {
      if (Number(btn.dataset.value) === currentVal) btn.classList.add('selected');
      btn.addEventListener('click', () => {
        row.querySelectorAll('.ob-likert-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        obState.aptitudeScores[q.dimension] = Number(btn.dataset.value);
        updateAptitudeProgress(pageIndex);
      });
    });
  });

  const backBtn = $('btn-aptitude-back');
  if (backBtn) {
    backBtn.onclick = (e) => {
      e.preventDefault();
      if (pageIndex > 0) {
        goTo(loadAptitude, pageIndex - 1);
      } else {
        goTo(loadAptitudeIntro);
      }
    };
  }

  const enBtn = $('btn-aptitude-en');
  if (enBtn) {
    enBtn.onclick = (e) => {
      e.preventDefault();
      toggleAppLanguage();
    };
  }

  // Scroll to top when changing page
  const scrollArea = document.querySelector('.ch14-scroll-area');
  if (scrollArea) scrollArea.scrollTop = 0;

  updateAptitudeProgress(pageIndex);
  showScreen('screen-ob-aptitude');
}

$('btn-ob-aptitude-next').addEventListener('click', () => {
  const pageIndex = obState.aptitudePageIndex || 0;
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const totalPages = Math.ceil(allQuestions.length / APTITUDE_PAGE_SIZE);

  if (pageIndex < totalPages - 1) {
    goTo(loadAptitude, pageIndex + 1);
  } else {
    saveAptitudeScores(obState.aptitudeScores);
    goTo(finalizeAptitudeCelebration);
  }
});

function finalizeAptitudeCelebration() {
  showScreen('screen-ob-passport');
}
`;

code = code.slice(0, oldAptitudeStart) + newAptitude + code.slice(oldAptitudeEnd);

// 4. Update TRANSLATION SYSTEM (toggleAppLanguage, applyAppLanguage, updateAllLangToggleButtons)
const oldTransStart = code.indexOf('/* ---------- TRANSLATION SYSTEM (EN Toggle) ---------- */');
const oldTransEnd = code.indexOf('/* ---------- 1k. プロフィール入力 (Figma CH0-16\') ---------- */');

const newTrans = `/* ---------- TRANSLATION SYSTEM (EN <-> JP Toggle) ---------- */
window.currentAppLang = window.currentAppLang || 'ja';

function updateAllLangToggleButtons(lang: string) {
  const label = lang === 'en' ? 'JP' : 'EN';
  const title = lang === 'en' ? 'Switch to Japanese / 日本語に切り替え' : 'Switch to English / 英語に切り替え';

  document.querySelectorAll<HTMLElement>('.btn-en-toggle, .intro-lang-pill').forEach(btn => {
    btn.setAttribute('title', title);
    btn.setAttribute('aria-label', title);

    btn.classList.add('spinning');
    setTimeout(() => {
      btn.classList.remove('spinning');
    }, 380);

    const textEl = btn.querySelector('.lang-text');
    if (textEl) {
      textEl.textContent = label;
    } else {
      btn.innerHTML = \`
        <div class="reproduced-lang-chip">
          <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-text">\${label}</span>
        </div>
      \`;
    }
  });
}

function toggleAppLanguage() {
  window.currentAppLang = window.currentAppLang === 'ja' ? 'en' : 'ja';
  applyAppLanguage(window.currentAppLang);
}

function applyAppLanguage(lang: string) {
  const dict = ONBOARDING_DATA.i18n && ONBOARDING_DATA.i18n[lang];
  if (!dict) return;

  updateAllLangToggleButtons(lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (key && dict[key]) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  // Country select dropdown
  const countrySelect = $('ob-country-input') as HTMLSelectElement;
  if (countrySelect) {
    const countriesJa: Record<string, string> = {
      jp: "日本", vn: "ベトナム", mm: "ミャンマー", sg: "シンガポール",
      id: "インドネシア", np: "ネパール", ph: "フィリピン", in: "インド", other: "その他"
    };
    const countriesEn: Record<string, string> = {
      jp: "Japan", vn: "Vietnam", mm: "Myanmar", sg: "Singapore",
      id: "Indonesia", np: "Nepal", ph: "Philippines", in: "India", other: "Other"
    };
    const map = lang === 'en' ? countriesEn : countriesJa;
    Array.from(countrySelect.options).forEach(opt => {
      if (opt.value && map[opt.value]) opt.textContent = map[opt.value];
    });
  }

  // Active screens re-render
  const introScreen = $('screen-ob-intro');
  if (introScreen && !introScreen.classList.contains('hidden')) {
    loadIntroSlide(obState.slideIndex || 0);
  }

  const greetScreen = $('screen-ob-character');
  if (greetScreen && !greetScreen.classList.contains('hidden')) {
    loadCharacterGreet();
  }

  const hearingScreen = $('screen-ob-hearing');
  if (hearingScreen && !hearingScreen.classList.contains('hidden')) {
    loadHearing(obState.hearingIndex || 0);
  }

  const scheduleScreen = $('screen-ob-schedule-time');
  if (scheduleScreen && !scheduleScreen.classList.contains('hidden')) {
    loadScheduleTime();
  }

  const journeyScreen = $('screen-ob-journey');
  if (journeyScreen && !journeyScreen.classList.contains('hidden')) {
    renderJourneySteps();
  }

  const aptitudeScreen = $('screen-ob-aptitude');
  if (aptitudeScreen && !aptitudeScreen.classList.contains('hidden')) {
    loadAptitude(obState.aptitudePageIndex || 0);
  }

  const resultScreen = $('screen-ob-result');
  if (resultScreen && !resultScreen.classList.contains('hidden')) {
    updateDiagnosisResultModal();
  }
}

document.addEventListener('click', (e) => {
  const enBtn = (e.target as HTMLElement)?.closest?.('.btn-en-toggle, .intro-lang-pill');
  if (enBtn) {
    e.preventDefault();
    toggleAppLanguage();
  }
});
`;

code = code.slice(0, oldTransStart) + newTrans + code.slice(oldTransEnd);

// 5. Update calculateAptitudeResult & updateDiagnosisResultModal
const oldCalcStart = code.indexOf('function calculateAptitudeResult() {');
const oldCalcEnd = code.indexOf('// 時間ドラムロール（Figma CH0-22 Frame 255）イベント設定');

const newCalc = `function calculateAptitudeResult() {
  const scores = obState.aptitudeScores || {};
  const roles = ONBOARDING_DATA.roleResults || {};
  const roleKeys = Object.keys(roles);

  let bestRoleKey = "Front Desk";
  let maxScore = -1;

  roleKeys.forEach(key => {
    const r = roles[key];
    const sum = (r.traits || []).reduce((acc: number, t: string) => acc + (scores[t] || 4), 0);
    const avg = sum / (r.traits.length || 1);
    if (avg > maxScore) {
      maxScore = avg;
      bestRoleKey = key;
    }
  });

  return roles[bestRoleKey] || roles["Front Desk"];
}

function updateDiagnosisResultModal() {
  const role = calculateAptitudeResult();
  const isEn = window.currentAppLang === 'en';
  const jobNameEl = document.querySelector('.result-job-name');
  const jobScoreEl = document.querySelector('.result-job-score');
  const avatarEl = document.querySelector<HTMLImageElement>('.result-job-avatar');
  const listEl = document.querySelector('.strengths-list');

  if (jobNameEl) jobNameEl.textContent = isEn ? role.nameEn : role.nameJa;
  if (jobScoreEl) {
    jobScoreEl.textContent = String(role.score || '95').replace('%', '');
  }

  if (avatarEl && role.icon) {
    avatarEl.src = role.icon;
  }

  if (listEl) {
    const strengths = isEn ? role.strengthsEn : role.strengthsJa;
    listEl.innerHTML = strengths.map((s: string) => \`
      <li class="ch20-strength-item">
        <span class="ch20-st-star">★</span>
        <div class="ch20-st-text">
          <span class="ch20-st-desc">\${devEscSafe(s).replace(/^・/, '')}</span>
        </div>
      </li>
    \`).join('');
  }
}

function loadDiagnosisResult() {
  updateDiagnosisResultModal();
  showScreen('screen-ob-result');
}

$('btn-ob-view-result').addEventListener('click', () => {
  goTo(loadDiagnosisResult);
});

if ($('btn-result-proceed')) {
  $('btn-result-proceed').addEventListener('click', () => {
    goTo(startGame);
  });
}
if ($('btn-result-modal-proceed')) {
  $('btn-result-modal-proceed').addEventListener('click', () => {
    goTo(startGame);
  });
}

`;

code = code.slice(0, oldCalcStart) + newCalc + code.slice(oldCalcEnd);

fs.writeFileSync('src/onboarding.ts', code, 'utf8');
console.log('Successfully updated src/onboarding.ts');

