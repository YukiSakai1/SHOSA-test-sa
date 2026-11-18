/* =========================================================
   ONBOARDING CONTROLLER — 0章「登録開始〜SHOSAパスポート完成」
   の画面遷移・状態管理。シナリオ内容は onboarding_data.js を参照。
   画面遷移はすべて app.js の goTo() を経由するので、
   「戻る」を押すと入力内容・選択済みの回答が復元された状態で
   前の画面に戻れる。
   ========================================================= */

/* =========================================================
   プロフィールの永続化（localStorage）
   一度入力したプロフィールはブラウザに保存され、次回以降は
   オンボーディングのプロフィール画面に自動で反映される。
   保存に失敗する環境（プライベートモード等）でもエラーにならないようフォールバックする。
   ========================================================= */
const PROFILE_KEY = 'shosa_game_profile';

function loadSavedProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

/* =========================================================
   ヒアリング・適性診断の永続化（localStorage）
   一度回答すると、次回以降は自動でスキップされる。
   あとから設定画面の「回答し直す」ボタンでいつでも再回答でき、
   再回答すると保存内容も更新される。
   ========================================================= */
const HEARING_KEY = 'shosa_game_hearing_answers';
const APTITUDE_KEY = 'shosa_game_aptitude_scores';

function loadSavedHearingAnswers() {
  try {
    const raw = localStorage.getItem(HEARING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveHearingAnswers(answers) {
  try { localStorage.setItem(HEARING_KEY, JSON.stringify(answers)); } catch (e) { /* ignore */ }
}
function isHearingComplete(answers) {
  return !!answers && ONBOARDING_DATA.hearings.every(h => !!answers[h.key]);
}

function getAptitudeQuestionKey(q: { id?: number; dimension?: string }) {
  return q && q.id != null ? `q${q.id}` : (q.dimension || '');
}
function getQuestionAptitudeScore(scores: Record<string, number> | null | undefined, q: { id?: number; dimension?: string }) {
  if (!scores) return undefined;
  const val = scores[getAptitudeQuestionKey(q)];
  return val != null ? val : undefined;
}
function loadSavedAptitudeScores() {
  try {
    const raw = localStorage.getItem(APTITUDE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveAptitudeScores(scores) {
  try { localStorage.setItem(APTITUDE_KEY, JSON.stringify(scores)); } catch (e) { /* ignore */ }
}
function isAptitudeComplete(scores) {
  if (!scores) return false;
  const hasPerQuestionKeys = ONBOARDING_DATA.aptitudeQuestions.some(q => scores[getAptitudeQuestionKey(q)] != null);
  if (hasPerQuestionKeys) {
    return ONBOARDING_DATA.aptitudeQuestions.every(q => getQuestionAptitudeScore(scores, q) != null);
  }
  return ONBOARDING_DATA.aptitudeQuestions.every(q => scores[q.dimension] != null);
}

function isProfileComplete(p) {
  return !!(p && p.gender && p.name && p.birthdate);
}

/* =========================================================
   学習スケジュール設定の永続化（localStorage）
   ========================================================= */
const SCHEDULE_KEY = 'shosa_game_schedule';

function loadSavedSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveSchedule(schedule) {
  try { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule)); } catch (e) { /* ignore */ }
}

/* =========================================================
   完全リセット（タイトル画面の「最初からやり直す」用）
   プロフィール・ヒアリング回答・適性診断・学習スケジュール・
   ゲーム進捗（PROGRESS_KEY, app.js側）をすべて削除し、
   初回ログイン時と同じまっさらな状態に戻す。
   ハイスコア（HIGH_SCORE_KEY）は個人の実績なので、
   ここではリセット対象に含めない。
   ========================================================= */
function resetAllSavedData() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(HEARING_KEY);
    localStorage.removeItem(APTITUDE_KEY);
    localStorage.removeItem(SCHEDULE_KEY);
    if (typeof PROGRESS_KEY !== 'undefined') localStorage.removeItem(PROGRESS_KEY);
  } catch (e) {
    /* storage unavailable — ignore */
  }
}

const obState: OnboardingState = {
  languageSetting: null,
  slideIndex: 0,
  hearingIndex: 0,
  aptitudeIndex: 0,
  answers: { touchpoint: null, purpose: null, interest: null, concern: null },
  aptitudeScores: {},
  profile: { gender: null, name: "", country: "", birthdate: "", avatar: null, voiceType: "A" },
  schedule: {
    preferredTime: null,
    notifyTime: "10:30",
    notifyEnabled: true,
    lessonsPerDay: 1,
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    streakGoal: null
  }
};

/* ---------- 0b. STORY COVER（プログラム全体の導入。Figma「ホテルスタッフ体験」に対応） ---------- */
function loadStoryCover() {
  showScreen('screen-story-cover');
}
$('btn-story-cover-next').addEventListener('click', () => goTo(loadLangSelect));

/* ---------- M-02: NEXTボタン弾みヘルパー ---------- */
function triggerNextBtnBounce(btn: HTMLElement | null): void {
  if (!btn) return;
  btn.classList.remove('btn-bounce-once');
  void btn.offsetWidth;
  btn.classList.add('btn-bounce-once');
  btn.addEventListener('animationend', () => {
    btn.classList.remove('btn-bounce-once');
  }, { once: true });
}
(window as any).triggerNextBtnBounce = triggerNextBtnBounce;

/* ---------- 1e. 言語表示設定 (Figma CH0-08) ---------- */
function loadLangSelect() {
  const list = $('ob-lang-list');
  list.innerHTML = '';
  const nextBtn = $('btn-ob-langselect-next');
  nextBtn.textContent = 'NEXT';

  // Figma CH0-08 では初期状態で NORMAL JAPANESE が選択されている
  if (!obState.languageSetting) {
    obState.languageSetting = 'normal';
  }

  const flags = {
    normal: 'assets/images/icon_flag_japan.png',
    english: 'assets/images/icon_flag_usa.png'
  };

  ONBOARDING_DATA.languageOptions.forEach(opt => {
    const isSelected = opt.id === obState.languageSetting;
    const card = document.createElement('div');
    card.className = 'langselect-ticket-card' + (isSelected ? ' selected' : '');
    card.dataset.id = opt.id;

    const flagSrc = flags[opt.id] || (opt.flag === 'jp' ? 'assets/images/icon_flag_japan.png' : 'assets/images/icon_flag_usa.png');

    card.innerHTML = `
      <img src="${flagSrc}" alt="${opt.label}" class="ticket-flag-img">
      <span class="ticket-label">${opt.label}</span>
    `;

    card.addEventListener('click', () => {
      list.querySelectorAll('.langselect-ticket-card').forEach(c => c.classList.remove('selected', 'card-popped'));
      card.classList.add('selected');
      // M-05: 選択カードタップ時、紫に変わり、枠が一瞬ふくらむ (0.15秒・1回)
      card.classList.remove('card-popped');
      void card.offsetWidth;
      card.classList.add('card-popped');

      obState.languageSetting = opt.id;
      const chosenLang = opt.id === 'english' ? 'en' : 'ja';
      if (window.currentAppLang !== chosenLang) {
        window.currentAppLang = chosenLang;
        if (typeof applyAppLanguage === 'function') applyAppLanguage(chosenLang);
        // M-06: 吹き出しの文言がクロスフェードで切り替わる (0.3秒)
        const bubbleText = document.querySelector('#screen-ob-langselect .langselect-bubble p');
        if (bubbleText) {
          bubbleText.classList.remove('text-crossfade');
          void (bubbleText as HTMLElement).offsetWidth;
          bubbleText.classList.add('text-crossfade');
        }
      }
      if (nextBtn.disabled) {
        nextBtn.disabled = false;
        triggerNextBtnBounce(nextBtn);
      }
    });

    list.appendChild(card);
  });

  nextBtn.disabled = !obState.languageSetting;
  showScreen('screen-ob-langselect');
}
$('btn-ob-langselect-next').addEventListener('click', () => {
  const chosenLang = obState.languageSetting === 'english' ? 'en' : 'ja';
  if (window.currentAppLang !== chosenLang) {
    window.currentAppLang = chosenLang;
    if (typeof applyAppLanguage === 'function') applyAppLanguage(chosenLang);
  }
  goTo(loadIntroSlide, 0);
});

/* ---------- 1f. キャラクター紹介カルーセル (Figma CH0-03 〜 CH0-06) ---------- */
function loadIntroSlide(i: number) {
  obState.slideIndex = i;
  const slide = ONBOARDING_DATA.introSlides[i];
  const content = $('ob-intro-content');
  content.innerHTML = '';
  const isEn = window.currentAppLang === 'en';

  const goldDividerSvg = `
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
    </div>`;

  const isWelcome = slide.type === 'welcome';
  const backBtnHtml = isWelcome ? '' : `
    <button class="figma-header-back-btn" type="button" title="戻る" aria-label="戻る" onclick="goBack();">
      <img src="assets/images/btn_header_back.png" alt="戻る" class="figma-header-back-icon">
    </button>`;

  const langLabel = isEn ? 'JP' : 'EN';
  const langBtnHtml = `
    <div class="intro-top-bar ${isWelcome ? 'welcome-top-bar' : ''}">
      ${backBtnHtml}
      <button class="btn-en-toggle intro-lang-pill" type="button" title="Switch language / 言語切り替え">
        <div class="reproduced-lang-chip">
          <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-text">${langLabel}</span>
        </div>
      </button>
    </div>`;

  const title = isEn && slide.titleEn ? slide.titleEn : slide.title;
  const buttonLabel = isEn && slide.buttonLabelEn ? slide.buttonLabelEn : slide.buttonLabel;

  if (slide.type === 'welcome') {
    // Figma CH0-03
    content.innerHTML = `
      <div class="intro-slide slide-welcome${isEn ? ' is-en' : ''}">
        ${langBtnHtml}
        <div class="intro-top-header ch03-header">
          <span class="intro-welcome-to">${isEn && slide.badgeTextEn ? slide.badgeTextEn : slide.badgeText}</span>
          <img src="${slide.logoImg}" alt="SHOSA" class="intro-logo-img">
        </div>
        <div class="intro-arch-card">
          <div class="intro-phone-mockup-wrap">
            <img src="${slide.heroImg}" alt="SHOSA Mobile" class="intro-phone-mockup-img">
          </div>
          <div class="intro-card-body">
            <p class="intro-card-title">${title.replace(/\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-purple">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === 'features') {
    // Figma CH0-04 (M-04 / 要点 R6: スマホ枠から4機能へ線が伸び、アイコンが順に出る)
    const bodyLead = isEn && slide.bodyLeadEn ? slide.bodyLeadEn : slide.bodyLead;
    const bodySub = isEn && slide.bodySubEn ? slide.bodySubEn : slide.bodySub;
    const featureBubbles = [
      { pos: 'tl', file: 'Group 245.png' },
      { pos: 'tr', file: 'Group 246.png' },
      { pos: 'bl', file: 'Group 247.png' },
      { pos: 'br', file: 'Group 248.png' }
    ];
    const featureLabels: string[] = (isEn && slide.featuresEn ? slide.featuresEn : slide.featuresJa) || [];
    const visualHtml = `<div class="intro-features-en-scene">
           <img src="assets/images/intro_feature_phone.svg" alt="SHOSA Phone" class="intro-features-phone-en">
           ${featureBubbles.map((bb, i) => `<div class="ifb ifb-${bb.pos}">
             <img src="assets/images/${bb.file}" alt="" class="ifb-group-img">
             <span class="ifb-label">${devEscSafe(String(featureLabels[i] || "").replace(/^✓\s*/, "")).replace(/\n/g, "<br>")}</span>
           </div>`).join('')}
         </div>`;
    content.innerHTML = `
      <div class="intro-slide slide-features${isEn ? ' is-en' : ''}">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, '<br>')}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            ${visualHtml}
          </div>
          <div class="intro-card-body">
            <p class="intro-body-lead">${bodyLead.replace(/\n/g, '<br>')}</p>
            <p class="intro-body-sub">${bodySub.replace(/\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === 'steps') {
    // Figma CH0-05 (要点 Row 7: 4項目が上から順に出る。アイコンが軽くポップ)
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;
    const rawSteps: string[] = (isEn && slide.stepsEn ? slide.stepsEn : slide.stepsJa) || [];
    const stepIconFiles = [
      'Group 253.png', // 1: 診断 (Phone)
      'Group 256.png', // 2: 体験 (Hotel staff)
      'Group 255.png', // 3: 学習 (Pencil)
      'Group 254.png'  // 4: スコア化 (Report)
    ];

    const visualStepsHtml = `
      <div class="ch05-steps-card">
        <div class="ch05-steps-line" aria-hidden="true">
          <img src="assets/images/Vector 5.png" alt="" class="ch05-line-img">
        </div>
        <div class="ch05-steps-list">
          ${rawSteps.map((st: string, idx: number) => {
            const isColon = st.includes(':');
            const sep = isColon ? ':' : (st.includes('・・') ? '・・' : (st.includes('　') ? '　' : ' '));
            const splitIdx = st.indexOf(sep);
            const head = splitIdx > -1 ? st.slice(0, splitIdx).trim() : st.trim();
            const tail = splitIdx > -1 ? st.slice(splitIdx + sep.length).trim() : '';
            return `
              <div class="ch05-step-row ch05-step-row-${idx + 1}">
                <div class="ch05-step-icon-wrap">
                  <img src="assets/images/${stepIconFiles[idx] || 'Group 253.png'}" alt="${devEscSafe(head)}" class="ch05-step-icon">
                </div>
                <div class="ch05-step-content intro-step-en-text">
                  <strong class="ch05-step-title">${devEscSafe(head)}${isEn ? ':' : ''}</strong>
                  <span class="ch05-step-desc">${devEscSafe(tail)}</span>
                </div>
              </div>`;
          }).join('')}
        </div>
      </div>`;

    content.innerHTML = `
      <div class="intro-slide slide-steps${isEn ? ' is-en' : ''}">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, '<br>')}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            ${visualStepsHtml}
          </div>
          <div class="intro-card-body">
            <p class="intro-body-sub">${desc.replace(/\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === 'certification') {
    // Figma CH0-06
    const checkIconSvg = `<svg class="badge-check-svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2.5 8.5l3.5 3.5 7.5-7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const reportLead = isEn && slide.reportLeadEn ? slide.reportLeadEn : slide.reportLead;
    const badges = isEn && slide.badgesEn ? slide.badgesEn : slide.badges;
    const reportTail = isEn ? (slide.reportTailEn || '') : slide.reportTail;
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;

    content.innerHTML = `
      <div class="intro-slide slide-certification${isEn ? ' is-en' : ''}">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, '<br>')}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap ch06-report-wrap">
            <div class="ch06-report-stage">
              <img src="${slide.reportBaseImg || 'assets/images/Frame 170.png'}" alt="SHOSA Report" class="ch06-report-base">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-score">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-performance">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-potential ch06-potential-1">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-potential ch06-potential-2">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-potential ch06-potential-3">
              <img src="${slide.heroImg}" alt="" aria-hidden="true" class="ch06-hero-layer ch06-hero-final">
            </div>
          </div>
          <div class="intro-card-body ch06-body">
            <p class="intro-report-lead">${reportLead}</p>
            <div class="intro-badges-row">
              ${badges.map((b: string) => `<span class="intro-badge-pill">${checkIconSvg} ${b}</span>`).join('')}
            </div>
            ${reportTail ? `<p class="intro-report-tail">${reportTail}</p>` : ''}
            <p class="intro-report-footer">${desc.replace(/\n/g, '<br>')}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
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
/* ---------- 1g. AIチューター挨拶 (Figma CH0-07) ---------- */
function loadCharacterGreet() {
  const isEn = window.currentAppLang === 'en';
  const greetText = $('ob-greet-text');
  if (greetText) {
    greetText.innerHTML = isEn
      ? "Nice to meet you! I'm SHOSA.<br><br>To help you learn,<br>first tell me a little about yourself."
      : "はじめまして！SHOSAだよ。<br><br>学習をサポートするために<br>まずは君のことを教えてね。";
  }
  showScreen('screen-ob-character');
}
$('btn-ob-character-next').addEventListener('click', () => goTo(loadHearing, 0));

/* ---------- 1h. ヒアリング（4問: Figma Frame 248 / CH0-08〜11） ---------- */
function loadHearing(i) {
  obState.hearingIndex = i;
  const h = ONBOARDING_DATA.hearings[i];
  const isEn = window.currentAppLang === 'en';

  // 進捗バー（塊1：ヒアリング4問 + スケジュール + プロフィール = 全6ステップ）
  const CHUNK1_TOTAL_STEPS = 6;
  const progressPercent = Math.round(((i + 1) / CHUNK1_TOTAL_STEPS) * 100);
  const fillBar = $('ob-hearing-progress-fill');
  if (fillBar) fillBar.style.width = progressPercent + '%';

  const qText = isEn && h.questionEn ? h.questionEn : h.question;
  const qEl = $('ob-hearing-question');
  if (qEl) qEl.innerHTML = devEscSafe(qText).replace(/\n/g, '<br>');

  const optWrap = $('ob-hearing-options');
  optWrap.innerHTML = '';
  optWrap.className = 'frame248-options-list';

  const nextBtn = $('btn-ob-hearing-next');
  nextBtn.textContent = 'NEXT';
  const currentAnswer = obState.answers[h.key];

  let hasValidAnswer = false;

  h.options.forEach(opt => {
    const isObj = typeof opt === 'object';
    const rawLabel = isObj ? opt.label : opt;
    const displayLabel = isObj ? (isEn && opt.labelEn ? opt.labelEn : opt.label) : opt;
    const optIcon = isObj && opt.icon ? opt.icon : 'assets/images/icon_hotel.png';
    const hasInput = isObj && opt.hasInput;
    const isOther = hasInput || rawLabel === 'その他';
    const isSelected = (rawLabel === currentAnswer || (isOther && typeof currentAnswer === 'string' && currentAnswer.startsWith('その他')));

    const card = document.createElement('div');
    card.className = 'frame248-option-btn' +
      (isOther ? ' frame248-option-other' : '') +
      (isSelected ? ' selected' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');

    let otherInitialVal = '';
    if (isOther && isSelected && typeof currentAnswer === 'string' && currentAnswer.startsWith('その他: ')) {
      otherInitialVal = currentAnswer.replace('その他: ', '');
    }

    card.innerHTML = `
      <div class="frame248-opt-row">
        <div class="frame248-opt-icon-wrap">
          <img src="${optIcon}" alt="" class="frame248-opt-icon">
        </div>
        <span class="frame248-opt-label">${devEscSafe(displayLabel)}</span>
      </div>
      ${isOther ? `
        <div class="frame248-other-input-wrap ${isSelected ? '' : 'hidden'}">
          <textarea class="frame248-other-textarea" placeholder="${isEn ? 'Please enter' : '入力してください'}" rows="3">${devEscSafe(otherInitialVal)}</textarea>
        </div>
      ` : ''}
    `;

    const optRow = card.querySelector('.frame248-opt-row');
    const textarea = card.querySelector<HTMLTextAreaElement>('.frame248-other-textarea');

    if (isSelected) {
      if (isOther) {
        if (otherInitialVal.trim()) hasValidAnswer = true;
      } else {
        hasValidAnswer = true;
      }
    }

    const selectThisOption = () => {
      optWrap.querySelectorAll('.frame248-option-btn').forEach(b => {
        b.classList.remove('selected');
        const inp = b.querySelector('.frame248-other-input-wrap');
        if (inp) inp.classList.add('hidden');
      });

      card.classList.add('selected');

      if (isOther) {
        const inpWrap = card.querySelector('.frame248-other-input-wrap');
        if (inpWrap) inpWrap.classList.remove('hidden');
        if (textarea) {
          textarea.focus();
          const val = textarea.value.trim();
          if (val) {
            obState.answers[h.key] = 'その他: ' + val;
            nextBtn.disabled = false;
          } else {
            obState.answers[h.key] = 'その他';
            nextBtn.disabled = true;
          }
        }
      } else {
        obState.answers[h.key] = rawLabel;
        nextBtn.disabled = false;
      }
      saveHearingAnswers(obState.answers);
    };

    optRow.addEventListener('click', (e) => {
      e.stopPropagation();
      selectThisOption();
    });

    if (textarea) {
      textarea.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      textarea.addEventListener('input', () => {
        const val = textarea.value.trim();
        if (val) {
          obState.answers[h.key] = 'その他: ' + val;
          nextBtn.disabled = false;
        } else {
          obState.answers[h.key] = 'その他';
          nextBtn.disabled = true;
        }
        saveHearingAnswers(obState.answers);
      });
    }

    optWrap.appendChild(card);
  });

  // 補足メッセージ（フォローアップバナー）は非表示
  const existingFollowup = document.getElementById('ob-hearing-followup');
  if (existingFollowup) existingFollowup.remove();

  nextBtn.disabled = !hasValidAnswer;

  showScreen('screen-ob-hearing');
}

// 簡易HTMLエスケープ
function devEscSafe(str) {
  if (str === undefined || str === null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

$('btn-ob-hearing-next').addEventListener('click', () => {
  if (obState.hearingIndex < ONBOARDING_DATA.hearings.length - 1) {
    goTo(loadHearing, obState.hearingIndex + 1);
  } else {
    saveHearingAnswers(obState.answers);
    goTo(loadScheduleTime);
  }
});

if ($('btn-ob-cheer-next')) {
  $('btn-ob-cheer-next').addEventListener('click', () => goTo(loadScheduleTime));
}

/* ---------- 1i/1j. 適性診断 (Figma CH0-13 & CH0-14) ---------- */
function loadAptitudeIntro() {
  showScreen('screen-ob-aptitude-intro');
}
$('btn-ob-aptitude-intro-next').addEventListener('click', () => goTo(loadAptitude));

const APTITUDE_PAGE_SIZE = 3; // 1画面に3項目（全18問＝6画面）

function updateAptitudeProgress(pageIndex = 0) {
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const startIndex = pageIndex * APTITUDE_PAGE_SIZE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + APTITUDE_PAGE_SIZE);

  const totalAnswered = allQuestions.filter(q => getQuestionAptitudeScore(obState.aptitudeScores, q) != null).length;
  const isEn = window.currentAppLang === 'en';
  const progEl = $('ob-aptitude-progress');
  if (progEl) progEl.textContent = `${isEn ? 'Aptitude Test' : '適性診断'} ${totalAnswered}/${allQuestions.length}`;
  const fillEl = $('ob-aptitude-progress-fill');
  if (fillEl) fillEl.style.width = Math.round((totalAnswered / allQuestions.length) * 100) + '%';

  const isPageComplete = currentQuestions.every(q => getQuestionAptitudeScore(obState.aptitudeScores, q) != null);
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
    return `
      <div class="aptitude-block" data-question-id="${q.id}" data-dimension="${q.dimension}">
        <div class="ob-likert-question">${devEscSafe(qText).replace(/\n/g, '<br>')}</div>
        <div class="ob-likert-row" data-question-id="${q.id}" data-dimension="${q.dimension}">
          ${[1, 2, 3, 4, 5].map(v => `<button type="button" class="ob-likert-btn val-${v}" data-value="${v}"></button>`).join('')}
        </div>
        <div class="ob-likert-labels">
          <span>${isEn ? 'Disagree' : 'そう思わない'}</span>
          <span>${isEn ? 'Agree' : 'とてもそう思う'}</span>
        </div>
      </div>`;
  }).join('');

  currentQuestions.forEach(q => {
    const qKey = getAptitudeQuestionKey(q);
    const row = list.querySelector(`.ob-likert-row[data-question-id="${q.id}"]`);
    if (!row) return;
    const currentVal = getQuestionAptitudeScore(obState.aptitudeScores, q);
    row.querySelectorAll('.ob-likert-btn').forEach(btn => {
      if (Number(btn.dataset.value) === currentVal) btn.classList.add('selected');
      btn.addEventListener('click', () => {
        row.querySelectorAll('.ob-likert-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        obState.aptitudeScores[qKey] = Number(btn.dataset.value);
        const nextBtn = $('btn-ob-aptitude-next') as HTMLButtonElement | null;
        const wasDisabled = nextBtn?.disabled ?? true;
        updateAptitudeProgress(pageIndex);
        if (wasDisabled && nextBtn && !nextBtn.disabled) {
          triggerNextBtnBounce(nextBtn);
        }
      });
    });
  });

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

function triggerCelebrationConfetti(): void {
  const screen = $('screen-ob-passport');
  if (!screen) return;
  screen.querySelectorAll('.ch19-confetti-particle').forEach(el => el.remove());
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#715BE1', '#FFA07A', '#98D8C8'];
  for (let i = 0; i < 36; i++) {
    const p = document.createElement('div');
    p.className = 'ch19-confetti-particle';
    p.style.left = `${Math.random() * 92 + 4}%`;
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = `${Math.random() * 0.4}s`;
    p.style.animationDuration = `${1.8 + Math.random() * 0.8}s`;
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    screen.appendChild(p);
  }
  setTimeout(() => {
    screen.querySelectorAll('.ch19-confetti-particle').forEach(el => el.remove());
  }, 3000);
}

function finalizeAptitudeCelebration() {
  const trophyWrap = document.querySelector('#screen-ob-passport .ch19-trophy-wrap');
  if (trophyWrap && !trophyWrap.querySelector('.ch19-trophy-shine')) {
    const shine = document.createElement('div');
    shine.className = 'ch19-trophy-shine';
    trophyWrap.appendChild(shine);
  }

  showScreen('screen-ob-passport');

  // M-11 & M-12: バッジ落下後（表示から1.3秒後）に光と紙吹雪を1回横切る
  setTimeout(() => {
    const shine = document.querySelector('#screen-ob-passport .ch19-trophy-shine');
    if (shine) {
      shine.classList.remove('shine-active');
      void (shine as HTMLElement).offsetWidth;
      shine.classList.add('shine-active');
    }
    triggerCelebrationConfetti();
  }, 1300);
}
/* ---------- 1k-0. プロフィール導入 (Figma CH0-15) ---------- */
function loadProfileIntro() {
  showScreen('screen-ob-profile-intro');
}
$('btn-ob-profile-intro-next').addEventListener('click', () => goTo(loadProfile1));

/* ---------- TRANSLATION SYSTEM (EN <-> JP Toggle) ---------- */
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
      btn.innerHTML = `
        <div class="reproduced-lang-chip">
          <svg class="reload-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" />
            <polyline points="21 3 21 8 16 8" />
          </svg>
          <span class="lang-text">${label}</span>
        </div>
      `;
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
      "日本": "日本",
      "ベトナム": "ベトナム",
      "ミャンマー": "ミャンマー",
      "シンガポール": "シンガポール",
      "インドネシア": "インドネシア",
      "ネパール": "ネパール",
      "フィリピン": "フィリピン",
      "インド": "インド",
      "中国": "中国",
      "韓国": "韓国",
      "その他": "その他"
    };
    const countriesEn: Record<string, string> = {
      "日本": "Japan",
      "ベトナム": "Vietnam",
      "ミャンマー": "Myanmar",
      "シンガポール": "Singapore",
      "インドネシア": "Indonesia",
      "ネパール": "Nepal",
      "フィリピン": "Philippines",
      "インド": "India",
      "中国": "China",
      "韓国": "South Korea",
      "その他": "Other"
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

  if (typeof window.renderActiveCh101Screen === 'function') {
    window.renderActiveCh101Screen();
  }
}

document.addEventListener('click', (e) => {
  const enBtn = (e.target as HTMLElement)?.closest?.('.btn-en-toggle, .intro-lang-pill');
  if (enBtn) {
    e.preventDefault();
    toggleAppLanguage();
  }
});
/* ---------- 1k. プロフィール入力 (Figma CH0-16') ---------- */
function updateProfile1Validity() {
  const nameVal = ($('ob-name-input') as HTMLInputElement)?.value.trim() || '';
  const countryVal = ($('ob-country-input') as HTMLSelectElement)?.value || '';
  const birthVal = ($('ob-birthdate-input') as HTMLInputElement)?.value || '';
  const isGenderChosen = !!obState.profile.gender;
  const isValid = isGenderChosen && nameVal.length > 0 && !!countryVal && !!birthVal;
  const nextBtn = $('btn-ob-profile1-next') as HTMLButtonElement | null;
  if (nextBtn) nextBtn.disabled = !isValid;

  // プロフィール入力完了時に進捗バーを100%（いっぱい）にする
  const profileFillBar = $('ob-profile-progress-fill');
  if (profileFillBar) {
    profileFillBar.style.width = isValid ? '100%' : '83%';
  }
}

function loadProfile1() {
  if (!obState.profile.gender) obState.profile.gender = '男性';

  const genderButtons = document.querySelectorAll<HTMLElement>('#ob-gender-row .figma-gender-btn');
  genderButtons.forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.value === obState.profile.gender);
  });

  const saved = loadSavedProfile();
  if (saved && !obState.profile.name) {
    obState.profile.name = saved.name || '';
    obState.profile.country = saved.country || '';
    obState.profile.birthdate = saved.birthdate || '';
    obState.profile.gender = saved.gender || obState.profile.gender;
  }

  $('ob-name-input').value = obState.profile.name || '';
  $('ob-country-input').value = obState.profile.country || '';
  $('ob-birthdate-input').value = obState.profile.birthdate || '2000-01-01';

  // 進捗バー（ブロック1：プロフィール入力画面開始時は83%）
  const profileFillBar = $('ob-profile-progress-fill');
  if (profileFillBar) {
    profileFillBar.style.width = '83%';
  }

  applyAppLanguage(window.currentAppLang || 'ja');
  updateProfile1Validity();
  showScreen('screen-ob-profile1');
}

// Gender buttons click
document.querySelectorAll<HTMLElement>('#ob-gender-row .figma-gender-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#ob-gender-row .figma-gender-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    obState.profile.gender = btn.dataset.value || null;
    updateProfile1Validity();
  });
});

$('ob-name-input').addEventListener('input', updateProfile1Validity);
$('ob-country-input').addEventListener('change', updateProfile1Validity);
$('ob-birthdate-input').addEventListener('change', updateProfile1Validity);
// 誕生日を選んだら他の項目と同じく紫枠にする
['change', 'input'].forEach(ev => {
  $('ob-birthdate-input').addEventListener(ev, () => {
    $('ob-birthdate-input').classList.toggle('has-value', !!($('ob-birthdate-input') as HTMLInputElement).value);
  });
});

$('btn-ob-profile1-next').addEventListener('click', () => {
  obState.profile.name = $('ob-name-input').value.trim() || 'SHOSA';
  obState.profile.country = $('ob-country-input').value || '日本';
  obState.profile.birthdate = $('ob-birthdate-input').value || '2000-01-01';
  saveProfile(obState.profile);
  window.PLAYER_NAME = obState.profile.name;

  // プロフィール入力完了：まず進捗バーを100%（いっぱい）にする
  const profileFillBar = $('ob-profile-progress-fill');
  if (profileFillBar) {
    profileFillBar.style.width = '100%';
  }

  // バーが100%に達するアニメーション（0.4秒）を見せてから、次の画面（YOUR JOURNEY）へ進む
  setTimeout(() => {
    goTo(loadJourney);
  }, 450);
});

/* ---------- 1k-2. YOUR JOURNEY (Figma CH0-18) ---------- */
function renderJourneySteps() {
  const list = $('ob-journey-list');
  if (!list) return;
  const isEn = window.currentAppLang === 'en';
  // Render from 401 down to 000 (reverse order)
  const steps = [...ONBOARDING_DATA.journeySteps].reverse();

  list.innerHTML = steps.map(s => {
    const title = isEn && s.titleEn ? s.titleEn : s.title;
    const desc = isEn && s.descEn ? s.descEn : s.desc;
    const dotSrc = s.dotImg || (s.isOpen ? 'assets/images/Ellipse 75.png' : 'assets/images/Ellipse 70.png');

    return `
      <div class="journey-step-row ${s.isOpen ? 'is-open' : 'is-locked'}" data-step="${s.step}">
        <div class="journey-dot-col">
          <img src="${dotSrc}" alt="" class="journey-dot-img ${s.isOpen ? 'is-active' : ''}">
        </div>
        <div class="journey-door-col">
          ${s.isOpen ? `
            <div class="journey-door-frame">
              <div class="journey-door-programmatic-light" id="journey-door-beam" aria-hidden="true"></div>
              <div class="journey-door-opening">
                <img src="assets/images/12Vector.png" alt="" class="journey-doorway-interior">
                <img src="assets/images/11Vector.png" alt="" class="journey-doorway-frame">
              </div>
              <div class="journey-door-shosa-wrap" id="journey-peeking-shosa">
                <img src="assets/images/Subtract.png" alt="" class="journey-shosa-shadow" id="journey-shosa-shadow">
                <img src="assets/images/shosa.png" alt="SHOSA" class="journey-door-peeking-shosa">
              </div>
              <div class="journey-door-panel-wrap" id="journey-door-panel">
                <img src="assets/images/Group.png" alt="Open Door" class="journey-door-panel-img">
              </div>
            </div>
          ` : `
            <img src="${s.doorImg}" alt="${s.doorNumber ? s.doorNumber + 'ドア' : 'Door'}" class="journey-door-img">
          `}
        </div>
        <div class="journey-card-bubble">
          ${s.isLocked && s.lockImg ? `<img src="${s.lockImg}" alt="Locked" class="journey-card-lock">` : ''}
          <h3 class="journey-card-title">${title}</h3>
          <p class="journey-card-desc">${desc.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;
  }).join('');
}

function loadJourney() {
  renderJourneySteps();
  showScreen('screen-ob-journey');
}

$('btn-ob-journey-next').addEventListener('click', () => {
  const panel = $('journey-door-panel');
  const beam = $('journey-door-beam');
  const shosa = $('journey-peeking-shosa');
  if (panel) {
    panel.classList.add('door-swing-wide');
    if (beam) beam.classList.add('light-burst');
    if (shosa) shosa.classList.add('shosa-step-forward');
    setTimeout(() => {
      goTo(loadAptitudeIntro);
    }, 450);
  } else {
    goTo(loadAptitudeIntro);
  }
});

/* ---------- 1m. 診断完了・1章解放 (Figma CH0-19 & CH0-20') ---------- */
function finalizeOnboarding() {
  showScreen('screen-ob-passport');
}


function getDimensionAptitudeScore(scores: Record<string, number>, dimension: string): number {
  const dimQuestions = ONBOARDING_DATA.aptitudeQuestions.filter(q => q.dimension === dimension);
  const values = dimQuestions
    .map(q => getQuestionAptitudeScore(scores, q))
    .filter((v): v is number => v != null);
  if (values.length > 0) {
    return values.reduce((acc, v) => acc + v, 0) / values.length;
  }
  return scores[dimension] != null ? scores[dimension] : 4;
}

function calculateAptitudeResult() {
  const scores = obState.aptitudeScores || {};
  const roles = ONBOARDING_DATA.roleResults || {};
  const roleKeys = Object.keys(roles);

  let bestRoleKey = "Front Desk";
  let maxScore = -1;

  roleKeys.forEach(key => {
    const r = roles[key];
    const sum = (r.traits || []).reduce((acc: number, t: string) => acc + getDimensionAptitudeScore(scores, t), 0);
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
    listEl.innerHTML = strengths.map((s: string) => `
      <li class="ch20-strength-item">
        <span class="ch20-st-star">★</span>
        <div class="ch20-st-text">
          <span class="ch20-st-desc">${devEscSafe(s).replace(/^・/, '').replace('、', '、<br>')}</span>
        </div>
      </li>
    `).join('');
  }
}

function animateScoreCountUp(targetScore = 95): void {
  const el = document.querySelector('.result-job-score');
  if (!el) return;
  const duration = 1000;
  let start: number | null = null;
  el.textContent = '0';
  function step(timestamp: number) {
    if (!start) start = timestamp;
    const progress = Math.min(1, (timestamp - start) / duration);
    el!.textContent = String(Math.floor(progress * targetScore));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el!.textContent = String(targetScore);
    }
  }
  // M-15: 紙がせり上がった後（0.6秒後）にカウントアップ開始
  setTimeout(() => {
    requestAnimationFrame(step);
  }, 600);
}

function fitCh20ResultCard(): void {
  const container = document.querySelector('#screen-ob-result .ch20-screen-container');
  const card = document.querySelector<HTMLElement>('#screen-ob-result .ch20-paper-card');
  if (!container || !card) return;
  const zoom = Math.min(1, container.clientWidth / 370);
  card.style.setProperty('--ch20-card-zoom', String(zoom));
}

function loadDiagnosisResult() {
  updateDiagnosisResultModal();
  showScreen('screen-ob-result');
  fitCh20ResultCard();
  const role = calculateAptitudeResult();
  const targetScore = parseInt(String(role.score || '95').replace('%', ''), 10) || 95;
  animateScoreCountUp(targetScore);
  // M-16: 割合の表示が終わった後（1.6秒後）、上から順に0.3秒間隔で1つずつ表示
  const items = document.querySelectorAll('.ch20-strength-item');
  items.forEach((item, idx) => {
    (item as HTMLElement).style.animationDelay = `${1.6 + idx * 0.3}s`;
  });
}

$('btn-ob-view-result').addEventListener('click', () => {
  goTo(loadDiagnosisResult);
});

window.addEventListener('resize', () => {
  const resultScreen = $('screen-ob-result');
  if (resultScreen && !resultScreen.classList.contains('hidden')) {
    fitCh20ResultCard();
  }
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

// 時間ドラムロール（Figma CH0-22 Frame 255）イベント設定
let selectedHour = "10";
let selectedMinute = "30";

function initTimeWheelColumns(): void {
  const hoursCol = $('wheel-hours');
  const minsCol = $('wheel-minutes');
  if (!hoursCol || !minsCol) return;

  // Populate 0-23 hours
  hoursCol.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const span = document.createElement('span');
    span.className = 'wheel-item' + (String(h) === String(parseInt(selectedHour, 10)) ? ' active' : '');
    span.dataset.val = String(h);
    span.textContent = String(h);
    span.addEventListener('click', () => {
      scrollToWheelValue(hoursCol, h, 40);
    });
    hoursCol.appendChild(span);
  }

  // Populate 0-59 minutes
  minsCol.innerHTML = '';
  for (let m = 0; m < 60; m++) {
    const span = document.createElement('span');
    const mStr = String(m).padStart(2, '0');
    span.className = 'wheel-item' + (mStr === selectedMinute ? ' active' : '');
    span.dataset.val = mStr;
    span.textContent = mStr;
    span.addEventListener('click', () => {
      scrollToWheelValue(minsCol, m, 40);
    });
    minsCol.appendChild(span);
  }

  // Bind debounced scroll listeners for scroll-snap detection with haptics (M-36)
  let hourScrollTimer: any = null;
  let lastHourSnap = -1;
  hoursCol.addEventListener('scroll', () => {
    clearTimeout(hourScrollTimer);
    const snap = Math.round(hoursCol.scrollTop / 40);
    if (snap !== lastHourSnap) {
      lastHourSnap = snap;
      triggerHaptic(10);
    }
    hourScrollTimer = setTimeout(() => {
      const idx = Math.round(hoursCol.scrollTop / 40);
      const clamped = Math.max(0, Math.min(23, idx));
      updateActiveWheelItem(hoursCol, clamped);
      selectedHour = String(clamped);
    }, 60);
  });

  let minScrollTimer: any = null;
  let lastMinSnap = -1;
  minsCol.addEventListener('scroll', () => {
    clearTimeout(minScrollTimer);
    const snap = Math.round(minsCol.scrollTop / 40);
    if (snap !== lastMinSnap) {
      lastMinSnap = snap;
      triggerHaptic(10);
    }
    minScrollTimer = setTimeout(() => {
      const idx = Math.round(minsCol.scrollTop / 40);
      const clamped = Math.max(0, Math.min(59, idx));
      updateActiveWheelItem(minsCol, clamped);
      selectedMinute = String(clamped).padStart(2, '0');
    }, 60);
  });
}

function scrollToWheelValue(col: HTMLElement, index: number, itemHeight = 40): void {
  col.scrollTo({ top: index * itemHeight, behavior: 'smooth' });
  updateActiveWheelItem(col, index);
}

function updateActiveWheelItem(col: HTMLElement, activeIndex: number): void {
  const items = col.querySelectorAll('.wheel-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === activeIndex);
  });
}

function openTimeWheelModal(): void {
  const modal = $('modal-time-wheel');
  if (!modal) return;

  const currentVal = (obState.schedule && obState.schedule.notifyTime) || ($('ob-schedule-notify-time') as HTMLInputElement)?.value || '10:30';
  const parts = currentVal.split(':');
  selectedHour = parts[0] || '10';
  selectedMinute = parts[1] || '30';

  initTimeWheelColumns();
  modal.classList.remove('hidden');

  // Center the columns at current hour & minute
  setTimeout(() => {
    const hoursCol = $('wheel-hours');
    const minsCol = $('wheel-minutes');
    if (hoursCol) {
      const hIdx = Math.max(0, Math.min(23, parseInt(selectedHour, 10)));
      hoursCol.scrollTop = hIdx * 40;
      updateActiveWheelItem(hoursCol, hIdx);
    }
    if (minsCol) {
      const mIdx = Math.max(0, Math.min(59, parseInt(selectedMinute, 10)));
      minsCol.scrollTop = mIdx * 40;
      updateActiveWheelItem(minsCol, mIdx);
    }
  }, 20);
}

if ($('btn-open-time-wheel')) {
  $('btn-open-time-wheel').addEventListener('click', (e) => {
    e.preventDefault();
    openTimeWheelModal();
  });
}
if ($('btn-close-time-wheel')) {
  $('btn-close-time-wheel').addEventListener('click', () => {
    $('modal-time-wheel')?.classList.add('hidden');
  });
}
if ($('modal-time-wheel')) {
  $('modal-time-wheel').addEventListener('click', (e) => {
    if (e.target === $('modal-time-wheel')) {
      $('modal-time-wheel')?.classList.add('hidden');
    }
  });
}
if ($('btn-submit-time-wheel')) {
  $('btn-submit-time-wheel').addEventListener('click', () => {
    const formatted = `${selectedHour}:${selectedMinute}`;
    if ($('ob-schedule-notify-time')) ($('ob-schedule-notify-time') as HTMLInputElement).value = formatted;
    if ($('ob-schedule-notify-time-display')) $('ob-schedule-notify-time-display').textContent = formatted;
    if (obState.schedule) {
      obState.schedule.notifyTime = formatted;
      obState.schedule.userCustomizedTime = true;
    }
    $('modal-time-wheel')?.classList.add('hidden');
  });
}

function updateScheduleNextBtn(): void {
  const nextBtn = $('btn-ob-schedule-time-next') as HTMLButtonElement | null;
  if (!nextBtn) return;
  const wasDisabled = nextBtn.disabled;
  const isToggleChecked = ($('ob-schedule-notify-toggle') as HTMLInputElement)?.checked ?? true;
  // M-37: NEXTは、時間帯の選択とトグルONの両方がそろった時だけ有効になる（M-02）
  const isReady = !!obState.schedule.preferredTime && isToggleChecked;
  nextBtn.disabled = !isReady;
  if (wasDisabled && !nextBtn.disabled) {
    triggerNextBtnBounce(nextBtn);
  }
}

/* ---------- 1n. 学習スケジュール作成 STEP1：時間帯・通知設定 (Figma iPhone 17 - 110) ---------- */
function loadScheduleTime() {
  const optWrap = $('ob-schedule-time-options');
  optWrap.innerHTML = '';
  const nextBtn = $('btn-ob-schedule-time-next') as HTMLButtonElement;
  nextBtn.textContent = 'NEXT';

  const defaultTimes: Record<string, string> = {
    morning: "07:00",
    lunch: "12:30",
    evening: "18:00",
    night: "21:30"
  };

  ONBOARDING_DATA.scheduleTimeOptions.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'schedule-time-card' + (opt.id === obState.schedule.preferredTime ? ' selected' : '');
    btn.type = 'button';
    btn.dataset.id = opt.id;

    const displayLabel = (window.currentAppLang === 'en' && ONBOARDING_DATA.i18n && ONBOARDING_DATA.i18n.en['schedule_' + opt.id])
      ? ONBOARDING_DATA.i18n.en['schedule_' + opt.id]
      : opt.label;

    btn.innerHTML = `
      <div class="schedule-time-icon-wrap">
        <img src="${opt.icon}" alt="${displayLabel}" class="schedule-time-icon-img">
      </div>
      <span class="schedule-time-label">${devEscSafe(displayLabel)}</span>
    `;

    btn.addEventListener('click', () => {
      optWrap.querySelectorAll('.schedule-time-card').forEach(b => b.classList.remove('selected', 'card-popped'));
      btn.classList.add('selected');
      // M-33: カードをタップした時、紫になり、枠が一瞬ふくらむ (0.15秒・1回)
      btn.classList.remove('card-popped');
      void btn.offsetWidth;
      btn.classList.add('card-popped');

      obState.schedule.preferredTime = opt.id;

      // M-38: 時間帯カードを選び、時刻の初期値が変わる時、数字がクロスフェードで切り替わる（0.2秒）
      if (!obState.schedule.userCustomizedTime && defaultTimes[opt.id]) {
        const newTime = defaultTimes[opt.id];
        obState.schedule.notifyTime = newTime;
        const displayEl = $('ob-schedule-notify-time-display');
        if (displayEl) {
          displayEl.classList.remove('text-crossfade');
          void displayEl.offsetWidth;
          displayEl.textContent = newTime;
          displayEl.classList.add('text-crossfade');
        }
        const inputEl = $('ob-schedule-notify-time') as HTMLInputElement | null;
        if (inputEl) inputEl.value = newTime;
      }

      updateScheduleNextBtn();

      // その他を選んだら自動で「お知らせ時間を編集」モーダル（ボトムシート）を開く
      if (opt.id === 'other') {
        setTimeout(() => {
          openTimeWheelModal();
        }, 150);
      }
    });

    optWrap.appendChild(btn);
  });

  const notifyTime = obState.schedule.notifyTime || '10:30';
  if ($('ob-schedule-notify-time')) ($('ob-schedule-notify-time') as HTMLInputElement).value = notifyTime;
  if ($('ob-schedule-notify-time-display')) $('ob-schedule-notify-time-display').textContent = notifyTime;
  if ($('ob-schedule-notify-toggle')) ($('ob-schedule-notify-toggle') as HTMLInputElement).checked = obState.schedule.notifyEnabled ?? true;

  // 進捗バー（ステップ5/6: スケジュール = 83%）
  const scheduleFillBar = $('ob-schedule-progress-fill');
  if (scheduleFillBar) scheduleFillBar.style.width = '83%';

  updateScheduleNextBtn();
  showScreen('screen-ob-schedule-time');
}
if ($('ob-schedule-notify-time')) {
  $('ob-schedule-notify-time').addEventListener('change', () => {
    if (obState.schedule) obState.schedule.notifyTime = ($('ob-schedule-notify-time') as HTMLInputElement).value;
    if ($('ob-schedule-notify-time-display')) $('ob-schedule-notify-time-display').textContent = ($('ob-schedule-notify-time') as HTMLInputElement).value;
  });
}
if ($('ob-schedule-notify-toggle')) {
  $('ob-schedule-notify-toggle').addEventListener('change', () => {
    const isChecked = ($('ob-schedule-notify-toggle') as HTMLInputElement).checked;
    if (obState.schedule) obState.schedule.notifyEnabled = isChecked;
    triggerHaptic(10);
    updateScheduleNextBtn();
  });
}
$('btn-ob-schedule-time-next').addEventListener('click', () => {
  saveSchedule(obState.schedule);
  goTo(loadProfileIntro);
});

/* ---------- 設定画面（あとからいつでもプロフィールを編集） ---------- */
$('btn-open-settings').addEventListener('click', () => goTo(loadSettings));

function loadSettings() {
  document.querySelectorAll<HTMLElement>('#settings-gender-row .ob-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.value === obState.profile.gender);
  });
  $('settings-name-input').value = obState.profile.name || '';
  $('settings-birthdate-input').value = obState.profile.birthdate || '';

  const grid = $('settings-avatar-grid');
  grid.innerHTML = '';
  const avatarGroup = grid.closest('.ob-form-group') as HTMLElement | null;
  if (avatarGroup) {
    avatarGroup.classList.toggle('hidden', ONBOARDING_DATA.avatarOptions.length === 0);
  }
  ONBOARDING_DATA.avatarOptions.forEach(av => {
    const cell = document.createElement('div');
    cell.className = 'ob-avatar-cell' + (av.path === obState.profile.avatar ? ' selected' : '');
    renderAvatar(cell, av.path);
    cell.dataset.path = av.path;
    cell.addEventListener('click', () => {
      grid.querySelectorAll('.ob-avatar-cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      validateSettings();
    });
    grid.appendChild(cell);
  });

  document.querySelectorAll<HTMLElement>('#settings-voice-row .ob-voice-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.value === obState.profile.voiceType);
  });

  validateSettings();
  showScreen('screen-settings');
}

function validateSettings() {
  const genderOk = document.querySelector('#settings-gender-row .ob-pill.selected');
  const avatarRequired = ONBOARDING_DATA.avatarOptions.length > 0;
  const avatarOk = !avatarRequired || !!document.querySelector('#settings-avatar-grid .ob-avatar-cell.selected');
  const ok = genderOk && avatarOk && $('settings-name-input').value.trim().length > 0 && $('settings-birthdate-input').value;
  $('btn-settings-save').disabled = !ok;
}

document.querySelectorAll('#settings-gender-row .ob-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#settings-gender-row .ob-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    validateSettings();
  });
});
document.querySelectorAll('#settings-voice-row .ob-voice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#settings-voice-row .ob-voice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});
$('settings-name-input').addEventListener('input', validateSettings);
$('settings-birthdate-input').addEventListener('change', validateSettings);

$('btn-settings-voice-sample').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  const name = $('settings-name-input').value.trim() || 'ゲスト';
  const selectedVoiceBtn = document.querySelector<HTMLElement>('#settings-voice-row .ob-voice-btn.selected');
  const voiceTypeId = selectedVoiceBtn ? selectedVoiceBtn.dataset.value : 'A';
  const utter = new SpeechSynthesisUtterance(`こんにちは、${name}です。よろしくお願いします。`);
  utter.lang = 'ja-JP';
  const voiceType = ONBOARDING_DATA.voiceTypes.find(v => v.id === voiceTypeId);
  if (voiceType) { utter.rate = voiceType.rate; utter.pitch = voiceType.pitch; }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
});

$('btn-settings-save').addEventListener('click', () => {
  const genderBtn = document.querySelector<HTMLElement>('#settings-gender-row .ob-pill.selected');
  const avatarCell = document.querySelector<HTMLElement>('#settings-avatar-grid .ob-avatar-cell.selected');
  const voiceBtn = document.querySelector<HTMLElement>('#settings-voice-row .ob-voice-btn.selected');

  obState.profile.gender = genderBtn ? genderBtn.dataset.value : obState.profile.gender;
  obState.profile.name = $('settings-name-input').value.trim();
  obState.profile.birthdate = $('settings-birthdate-input').value;
  obState.profile.avatar = avatarCell ? avatarCell.dataset.path : obState.profile.avatar;
  obState.profile.voiceType = voiceBtn ? voiceBtn.dataset.value : obState.profile.voiceType;

  saveProfile(obState.profile);
  window.PLAYER_NAME = obState.profile.name;
  window.PLAYER_AVATAR = obState.profile.avatar;

  // プロフィールは「どの時点の履歴に戻っても」常に最新の内容であるべきなので、
  // 過去の履歴スナップショットにもこの変更を反映しておく
  const updatedProfile = { ...obState.profile };
  patchHistoryObState(os => { os.profile = { ...updatedProfile }; });

  if (typeof updateHeader === 'function') updateHeader();
  goBack(); // 設定画面を閉じて、元いた画面に戻る
});

$('btn-settings-cancel').addEventListener('click', () => goBack());

$('btn-settings-retake-hearing').addEventListener('click', () => goTo(loadHearing, 0));
$('btn-settings-retake-aptitude').addEventListener('click', () => goTo(loadAptitudeIntro));

/* ---------- エントリーポイント ---------- */
function startOnboarding() {
  const savedProfile = loadSavedProfile();
  const savedHearings = loadSavedHearingAnswers();
  const savedAptitude = loadSavedAptitudeScores();
  const savedSchedule = loadSavedSchedule();
  obState.languageSetting = null;
  obState.slideIndex = 0;
  obState.hearingIndex = 0;
  obState.aptitudeIndex = 0;
  obState.answers = savedHearings ? { ...savedHearings } : { touchpoint: null, purpose: null, interest: null, concern: null };
  obState.aptitudeScores = savedAptitude ? { ...savedAptitude } : {};
  obState.profile = savedProfile ? { ...savedProfile } : { gender: null, name: '', country: '', birthdate: '', avatar: null, voiceType: 'A' };
  obState.schedule = savedSchedule ? { ...obState.schedule, ...savedSchedule } : {
    preferredTime: null,
    notifyTime: '10:30',
    notifyEnabled: true,
    lessonsPerDay: 1,
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    streakGoal: null
  };
  loadLangSelect();
}

function renderAvatarHtml(avatar) {
  if (!avatar) return '🙂';
  if (avatar.endsWith('.jpg') || avatar.endsWith('.png') || avatar.endsWith('.svg')) {
    return `<img src="${avatar}" alt="" style="width:100%;height:100%;object-fit:cover;">`;
  }
  return `<span>${avatar}</span>`;
}