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
  return !!scores && ONBOARDING_DATA.aptitudeQuestions.every(q => scores[q.dimension] != null);
}

function isProfileComplete(p) {
  return !!(p && p.gender && p.name && p.birthdate && p.avatar);
}

const obState = {
  japaneseLevel: null,
  languageSetting: "easy", // 推奨設定の初期値
  slideIndex: 0,
  hearingIndex: 0,
  aptitudeIndex: 0,
  answers: { touchpoint: null, purpose: null, interest: null, concern: null },
  aptitudeScores: {},
  profile: { gender: null, name: "", birthdate: "", avatar: null, voiceType: "A" }
};

/* ---------- 1b/1c. SHOSA Ready CHECK ＋ 日本語レベル確認（統合済み） ---------- */

function loadLevelCheck() {
  const wrap = $('ob-level-options');
  wrap.innerHTML = '';
  const nextBtn = $('btn-ob-level-next');
  ONBOARDING_DATA.japaneseLevels.forEach(level => {
    const btn = document.createElement('button');
    btn.className = 'ob-option-btn' + (level === obState.japaneseLevel ? ' selected' : '');
    btn.textContent = level;
    btn.addEventListener('click', () => {
      wrap.querySelectorAll('.ob-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      obState.japaneseLevel = level;
      nextBtn.disabled = false;
    });
    wrap.appendChild(btn);
  });
  nextBtn.disabled = !obState.japaneseLevel;
  showScreen('screen-ob-level');
}
$('btn-ob-level-next').addEventListener('click', () => goTo(loadRecommend));

/* ---------- 1d/1e. 言語表示設定 ---------- */
function loadRecommend() {
  showScreen('screen-ob-recommend');
}

$('btn-ob-recommend-next').addEventListener('click', () => {
  obState.languageSetting = obState.languageSetting || 'easy';
  goTo(loadIntroSlide, 0);
});
$('btn-ob-recommend-change').addEventListener('click', () => goTo(loadLangSelect));

function loadLangSelect() {
  const list = $('ob-lang-list');
  list.innerHTML = '';
  const nextBtn = $('btn-ob-langselect-next');
  ONBOARDING_DATA.languageOptions.forEach(opt => {
    const row = document.createElement('div');
    row.className = 'ob-lang-item' + (opt.id === obState.languageSetting ? ' selected' : '');
    row.innerHTML = `
      <div class="ob-lang-item-main">
        <span class="ob-lang-icon">${opt.icon}</span>
        <span>${opt.label}</span>
      </div>
      <span class="ob-select-badge">S</span>`;
    row.addEventListener('click', () => {
      list.querySelectorAll('.ob-lang-item').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      obState.languageSetting = opt.id;
      nextBtn.disabled = false;
    });
    list.appendChild(row);
  });
  nextBtn.disabled = !obState.languageSetting;
  showScreen('screen-ob-langselect');
}
$('btn-ob-langselect-next').addEventListener('click', () => goTo(loadIntroSlide, 0));

/* ---------- 1f. キャラクター紹介カルーセル ---------- */
function renderObDots(container, total, activeIndex) {
  container.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const d = document.createElement('span');
    d.className = 'ob-dot' + (i === activeIndex ? ' active' : '');
    container.appendChild(d);
  }
}

function loadIntroSlide(i) {
  obState.slideIndex = i;
  const slide = ONBOARDING_DATA.introSlides[i];
  const content = $('ob-intro-content');
  content.innerHTML = '';

  if (slide.type === 'collage') {
    content.innerHTML = `
      <div class="ob-collage">
        <div class="ob-collage-half">アプリ内学習の場面1</div>
        <div class="ob-collage-half">アプリ内学習の場面2</div>
      </div>
      <h2 style="font-size:20px;color:#2d3748;font-weight:900;text-align:center;margin-bottom:10px;">${slide.title}</h2>
      <p class="ob-tagline">${slide.text.replace(/\n/g, '<br>')}</p>`;
  } else if (slide.type === 'checklist') {
    content.innerHTML = `
      <h2 style="font-size:17px;color:#2d3748;font-weight:900;text-align:center;margin-bottom:12px;">${slide.title.replace(/\n/g, '<br>')}</h2>
      <div class="ob-image-row">${'<div class="ob-image-placeholder">イメージ画像</div>'.repeat(slide.images || 0)}</div>
      <p class="ob-tagline" style="text-align:left;">${slide.body.replace(/\n/g, '<br>')}</p>
      <ul class="ob-checklist">${slide.checklist.map(c => `<li>${c}</li>`).join('')}</ul>`;
  } else if (slide.type === 'steps') {
    content.innerHTML = `
      <div class="character-preview compact" style="margin-bottom:10px;">
        <div class="avatar-circle small">🤖</div>
        <div class="avatar-label">${slide.avatarLabel}</div>
      </div>
      <h2 style="font-size:18px;color:#2d3748;font-weight:900;text-align:center;margin-bottom:14px;">${slide.title}</h2>
      <div class="ob-steps">${slide.steps.map((s, idx) => `
        <div class="ob-step"><div class="ob-step-num">${idx + 1}</div><div class="ob-step-body"><strong>${s.label}</strong><span>${s.desc}</span></div></div>`).join('')}</div>
      <p class="ob-tagline">${slide.footer}</p>`;
  } else if (slide.type === 'certification') {
    content.innerHTML = `
      <h2 style="font-size:18px;color:#2d3748;font-weight:900;text-align:center;margin-bottom:12px;">${slide.title.replace(/\n/g, '<br>')}</h2>
      <div class="ob-image-placeholder large">検定イメージ画像</div>
      <ul class="ob-checklist" style="margin-top:14px;">${slide.checklist.map(c => `<li>${c}</li>`).join('')}</ul>
      <p class="ob-tagline">${slide.footer}</p>`;
  }

  renderObDots($('ob-intro-dots'), ONBOARDING_DATA.introSlides.length, i);
  const isLast = i === ONBOARDING_DATA.introSlides.length - 1;
  $('btn-ob-intro-next').textContent = isLast ? (slide.buttonLabel || 'START') : 'NEXT';
  showScreen('screen-ob-intro');
}

$('btn-ob-intro-next').addEventListener('click', () => {
  if (obState.slideIndex < ONBOARDING_DATA.introSlides.length - 1) {
    goTo(loadIntroSlide, obState.slideIndex + 1);
  } else {
    goTo(loadCharacterGreet);
  }
});

/* ---------- 1g. AIチューター挨拶 ---------- */
function loadCharacterGreet() {
  showScreen('screen-ob-character');
}

// キャラクター挨拶の後：ヒアリングに回答済みならスキップして先へ
function goPastCharacterGreet() {
  if (isHearingComplete(obState.answers)) {
    goPastHearings();
  } else {
    goTo(loadHearing, 0);
  }
}
$('btn-ob-character-next').addEventListener('click', goPastCharacterGreet);

/* ---------- 1h. ヒアリング（4問） ---------- */
function loadHearing(i) {
  obState.hearingIndex = i;
  const h = ONBOARDING_DATA.hearings[i];
  $('ob-hearing-progress').textContent = h.label;
  $('ob-hearing-question').textContent = h.question;
  const optWrap = $('ob-hearing-options');
  optWrap.innerHTML = '';
  const nextBtn = $('btn-ob-hearing-next');
  const currentAnswer = obState.answers[h.key];
  h.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'ob-option-btn' + (opt === currentAnswer ? ' selected' : '');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      optWrap.querySelectorAll('.ob-option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      obState.answers[h.key] = opt;
      nextBtn.disabled = false;
    });
    optWrap.appendChild(btn);
  });
  nextBtn.disabled = !currentAnswer;
  showScreen('screen-ob-hearing');
}

// ヒアリングの後：適性診断に回答済みならスキップして先へ
function goPastHearings() {
  if (isAptitudeComplete(obState.aptitudeScores)) {
    goPastAptitude();
  } else {
    goTo(loadAptitudeIntro);
  }
}

$('btn-ob-hearing-next').addEventListener('click', () => {
  if (obState.hearingIndex < ONBOARDING_DATA.hearings.length - 1) {
    goTo(loadHearing, obState.hearingIndex + 1);
  } else {
    saveHearingAnswers(obState.answers);
    goPastHearings();
  }
});

/* ---------- 1i/1j. 適性診断 ---------- */
function loadAptitudeIntro() {
  $('ob-aptitude-intro-text').textContent = ONBOARDING_DATA.aptitudeIntro;
  showScreen('screen-ob-aptitude-intro');
}
$('btn-ob-aptitude-intro-next').addEventListener('click', () => goTo(loadAptitude, 0));

function loadAptitude(i) {
  obState.aptitudeIndex = i;
  const q = ONBOARDING_DATA.aptitudeQuestions[i];
  $('ob-aptitude-progress').textContent = `適性診断 ${i + 1}/${ONBOARDING_DATA.aptitudeQuestions.length}`;
  $('ob-aptitude-question').textContent = q.text;
  const row = $('ob-aptitude-row');
  row.innerHTML = '';
  const nextBtn = $('btn-ob-aptitude-next');
  const currentVal = obState.aptitudeScores[q.dimension];
  for (let v = 1; v <= 5; v++) {
    const btn = document.createElement('button');
    btn.className = 'ob-likert-btn' + (v === currentVal ? ' selected' : '');
    btn.textContent = String(v);
    btn.addEventListener('click', () => {
      row.querySelectorAll('.ob-likert-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      obState.aptitudeScores[q.dimension] = v;
      nextBtn.disabled = false;
    });
    row.appendChild(btn);
  }
  nextBtn.disabled = !currentVal;
  showScreen('screen-ob-aptitude');
}

// アプティテュード診断の後：プロフィール入力が済んでいればスキップしてパスポート完成へ
function goPastAptitude() {
  if (isProfileComplete(obState.profile)) {
    goTo(finalizeOnboarding);
  } else {
    goTo(loadProfile1);
  }
}

$('btn-ob-aptitude-next').addEventListener('click', () => {
  if (obState.aptitudeIndex < ONBOARDING_DATA.aptitudeQuestions.length - 1) {
    goTo(loadAptitude, obState.aptitudeIndex + 1);
  } else {
    saveAptitudeScores(obState.aptitudeScores);
    goPastAptitude();
  }
});

/* ---------- 1k. プロフィール入力01 ---------- */
function loadProfile1() {
  document.querySelectorAll('#ob-gender-row .ob-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.value === obState.profile.gender);
  });
  $('ob-name-input').value = obState.profile.name || '';
  $('ob-birthdate-input').value = obState.profile.birthdate || '';
  validateProfile1();
  showScreen('screen-ob-profile1');
}

function validateProfile1() {
  const ok = obState.profile.gender && $('ob-name-input').value.trim().length > 0 && $('ob-birthdate-input').value;
  $('btn-ob-profile1-next').disabled = !ok;
}

document.querySelectorAll('#ob-gender-row .ob-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#ob-gender-row .ob-pill').forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    obState.profile.gender = pill.dataset.value;
    validateProfile1();
  });
});
$('ob-name-input').addEventListener('input', validateProfile1);
$('ob-birthdate-input').addEventListener('change', validateProfile1);

$('btn-ob-profile1-next').addEventListener('click', () => {
  obState.profile.name = $('ob-name-input').value.trim();
  obState.profile.birthdate = $('ob-birthdate-input').value;
  goTo(loadProfile2);
});

/* ---------- 1l. プロフィール入力02（アバター設定） ---------- */
function loadProfile2() {
  const grid = $('ob-avatar-grid');
  grid.innerHTML = '';
  ONBOARDING_DATA.avatarOptions.forEach(av => {
    const cell = document.createElement('div');
    cell.className = 'ob-avatar-cell' + (av.path === obState.profile.avatar ? ' selected' : '');
    renderAvatar(cell, av.path);
    cell.addEventListener('click', () => {
      grid.querySelectorAll('.ob-avatar-cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      obState.profile.avatar = av.path;
      $('btn-ob-profile2-next').disabled = false;
    });
    grid.appendChild(cell);
  });
  document.querySelectorAll('#ob-voice-row .ob-voice-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.value === obState.profile.voiceType);
  });
  $('btn-ob-profile2-next').disabled = !obState.profile.avatar;
  showScreen('screen-ob-profile2');
}

document.querySelectorAll('#ob-voice-row .ob-voice-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#ob-voice-row .ob-voice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    obState.profile.voiceType = btn.dataset.value;
  });
});

$('btn-ob-voice-sample').addEventListener('click', () => {
  if (!('speechSynthesis' in window)) return;
  const name = obState.profile.name || 'ゲスト';
  const utter = new SpeechSynthesisUtterance(`こんにちは、${name}です。よろしくお願いします。`);
  utter.lang = 'ja-JP';
  const voiceType = ONBOARDING_DATA.voiceTypes.find(v => v.id === obState.profile.voiceType);
  if (voiceType) { utter.rate = voiceType.rate; utter.pitch = voiceType.pitch; }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
});

$('btn-ob-profile2-next').addEventListener('click', () => goTo(finalizeOnboarding));

/* ---------- 1m. SHOSAパスポート完成 ---------- */
function finalizeOnboarding() {
  window.PLAYER_NAME = obState.profile.name;
  window.PLAYER_AVATAR = obState.profile.avatar;
  saveProfile(obState.profile);

  const card = $('ob-passport-card');
  const dims = ['Communication', 'Observation', 'Accuracy', 'Judgement', 'Hospitality'];
  const starsFor = d => '★'.repeat(obState.aptitudeScores[d] || 3) + '☆'.repeat(5 - (obState.aptitudeScores[d] || 3));
  const levelLabel = obState.japaneseLevel || '-';
  const positionLabel = obState.answers.purpose || obState.answers.interest || '-';
  const avatarHtml = isImagePath(obState.profile.avatar)
    ? `<img src="${obState.profile.avatar}" alt="">`
    : (obState.profile.avatar || '🙂');

  card.innerHTML = `
    <div class="pc-avatar">${avatarHtml}</div>
    <div class="pc-name">${obState.profile.name || 'ゲスト'}</div>
    <div class="pc-sub">SHOSA PASSPORT</div>
    <div class="pc-row"><span>日本語レベル</span><span>${levelLabel}</span></div>
    <div class="pc-row"><span>興味のあるポジション</span><span>${positionLabel}</span></div>
    <div class="pc-stats">
      ${dims.map(d => `<div class="pc-stat-row"><span class="pc-stat-label">${d}</span><span class="pc-stat-stars">${starsFor(d)}</span></div>`).join('')}
    </div>`;

  $('ob-passport-reveal').classList.remove('hidden');
  $('ob-passport-card-wrap').classList.add('hidden');
  showScreen('screen-ob-passport');
}

$('btn-ob-passport-open').addEventListener('click', () => goTo(loadPassportCardView));

function loadPassportCardView() {
  $('ob-passport-reveal').classList.add('hidden');
  $('ob-passport-card-wrap').classList.remove('hidden');
}

$('btn-ob-passport-start').addEventListener('click', () => goTo(startGame));

/* ---------- 設定画面（あとからいつでもプロフィールを編集） ---------- */
$('btn-open-settings').addEventListener('click', () => goTo(loadSettings));

function loadSettings() {
  document.querySelectorAll('#settings-gender-row .ob-pill').forEach(p => {
    p.classList.toggle('selected', p.dataset.value === obState.profile.gender);
  });
  $('settings-name-input').value = obState.profile.name || '';
  $('settings-birthdate-input').value = obState.profile.birthdate || '';

  const grid = $('settings-avatar-grid');
  grid.innerHTML = '';
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

  document.querySelectorAll('#settings-voice-row .ob-voice-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.value === obState.profile.voiceType);
  });

  validateSettings();
  showScreen('screen-settings');
}

function validateSettings() {
  const genderOk = document.querySelector('#settings-gender-row .ob-pill.selected');
  const avatarOk = document.querySelector('#settings-avatar-grid .ob-avatar-cell.selected');
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
  const selectedVoiceBtn = document.querySelector('#settings-voice-row .ob-voice-btn.selected');
  const voiceTypeId = selectedVoiceBtn ? selectedVoiceBtn.dataset.value : 'A';
  const utter = new SpeechSynthesisUtterance(`こんにちは、${name}です。よろしくお願いします。`);
  utter.lang = 'ja-JP';
  const voiceType = ONBOARDING_DATA.voiceTypes.find(v => v.id === voiceTypeId);
  if (voiceType) { utter.rate = voiceType.rate; utter.pitch = voiceType.pitch; }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
});

$('btn-settings-save').addEventListener('click', () => {
  const genderBtn = document.querySelector('#settings-gender-row .ob-pill.selected');
  const avatarCell = document.querySelector('#settings-avatar-grid .ob-avatar-cell.selected');
  const voiceBtn = document.querySelector('#settings-voice-row .ob-voice-btn.selected');

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
  if (typeof playBgm === 'function') playBgm(BGM_TITLE_TRACK);
  const savedProfile = loadSavedProfile();
  const savedHearings = loadSavedHearingAnswers();
  const savedAptitude = loadSavedAptitudeScores();
  obState.japaneseLevel = null;
  obState.languageSetting = 'easy';
  obState.slideIndex = 0;
  obState.hearingIndex = 0;
  obState.aptitudeIndex = 0;
  obState.answers = savedHearings ? { ...savedHearings } : { touchpoint: null, purpose: null, interest: null, concern: null };
  obState.aptitudeScores = savedAptitude ? { ...savedAptitude } : {};
  obState.profile = savedProfile ? { ...savedProfile } : { gender: null, name: '', birthdate: '', avatar: null, voiceType: 'A' };
  loadLevelCheck();
}
