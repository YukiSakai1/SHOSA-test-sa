/* =========================================================
   HIGH SCORE PERSISTENCE (localStorage, with safe fallback
   for environments where storage is blocked)
   ========================================================= */
const HIGH_SCORE_KEY = 'shosa_game_high_score';
function loadHighScore() {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10) || 0;
  } catch (e) {
    return 0;
  }
}
function saveHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value));
  } catch (e) {
    /* storage unavailable (private mode, sandboxed preview, etc.) — ignore */
  }
}

/* =========================================================
   GAME STATE
   ========================================================= */
const state = {
  dayIndex: 0,
  teamScore: 50,
  guestScore: 50,
  dayGauge: 50,
  totalPoints: 0,
  highScore: loadHighScore(),
  completedDays: 0,
  completedDaySet: [],
  stars: [],
  lastChoice: null,
  statsVisible: false
};

/* =========================================================
   DOM SHORTCUTS
   ========================================================= */
const $ = (id) => document.getElementById(id);
const screens = document.querySelectorAll('.screen');

function showScreen(id) {
  screens.forEach(s => s.classList.add('hidden'));
  $(id).classList.remove('hidden');
  $('app-viewport').scrollTop = 0;
}

function clamp(n) { return Math.max(0, Math.min(100, n)); }

/* =========================================================
   BGM（画面ごとに異なる曲をループ再生）
   タイトル・0章・メニューでは「ロビー風アンビエント」、
   Day1〜3ではそれぞれ専用の曲に自動で切り替わる。
   ブラウザの自動再生制限があるため、最初のユーザー操作
   （タイトルのSTARTボタン等）をきっかけに再生を開始する。
   ミュート状態は localStorage に保存され次回も引き継がれる。
   ========================================================= */
const BGM_TITLE_TRACK = 'assets/audio/lobby_bgm.mp3';
const BGM_MUTED_KEY = 'shosa_game_bgm_muted';
const bgmAudio = $('bgm-audio');
bgmAudio.volume = 0.35;

function loadBgmMuted() {
  try { return localStorage.getItem(BGM_MUTED_KEY) === '1'; } catch (e) { return false; }
}
function saveBgmMuted(muted) {
  try { localStorage.setItem(BGM_MUTED_KEY, muted ? '1' : '0'); } catch (e) { /* ignore */ }
}

let bgmMuted = loadBgmMuted();
let bgmStarted = false;
let currentBgmTrack = BGM_TITLE_TRACK; // HTML側の <audio src> の初期値と揃えておく

function updateBgmButton() {
  const btn = $('btn-bgm-toggle');
  btn.textContent = bgmMuted ? '🔇' : '🔊';
  btn.classList.toggle('muted', bgmMuted);
}
updateBgmButton();

// 指定した曲に切り替える。すでにその曲が再生中なら何もしない（無駄な巻き戻りを防ぐ）
function playBgm(track) {
  if (!track || track === currentBgmTrack) return;
  currentBgmTrack = track;
  bgmAudio.src = track;
  bgmAudio.muted = bgmMuted;
  if (bgmStarted) {
    bgmAudio.play().catch(() => { /* 自動再生がブロックされても静かに無視する */ });
  }
}

function startBgmIfNeeded() {
  if (bgmStarted) return;
  bgmStarted = true;
  bgmAudio.muted = bgmMuted;
  bgmAudio.play().catch(() => { /* 自動再生がブロックされても静かに無視する */ });
}

$('btn-bgm-toggle').addEventListener('click', () => {
  bgmMuted = !bgmMuted;
  bgmAudio.muted = bgmMuted;
  saveBgmMuted(bgmMuted);
  updateBgmButton();
  // まだ再生が始まっていない場合、このタップ自体がユーザー操作になるので再生を試みる
  startBgmIfNeeded();
});

/* =========================================================
   STATS DISPLAY TOGGLE
   ========================================================= */
function updateStatsVisibility() {
  const header = $('game-header');
  const metrics = header.querySelector('.metrics-summary');
  if (metrics) {
    metrics.classList.toggle('hidden', !state.statsVisible);
  }
  const btn = $('btn-stats-toggle');
  btn.textContent = state.statsVisible ? '📊 ON' : '📊';
  btn.classList.toggle('active', state.statsVisible);
}

$('btn-stats-toggle').addEventListener('click', () => {
  state.statsVisible = !state.statsVisible;
  updateStatsVisibility();
});

// Chapter 0（オンボーディング）で入力した名前があれば「○○」をそれに置き換える
function personalize(str) {
  return window.PLAYER_NAME ? str.split('○○').join(window.PLAYER_NAME) : str;
}

// avatar には絵文字（例: "👔"）か、画像パス（例: "assets/images/avatars/xxx.jpg"）のどちらも渡せる
function isImagePath(value) {
  return typeof value === 'string' && /\.(png|jpe?g|webp|gif)$/i.test(value);
}
function renderAvatar(el, value) {
  el.innerHTML = '';
  if (isImagePath(value)) {
    const img = document.createElement('img');
    img.src = value;
    img.alt = '';
    el.appendChild(img);
  } else {
    el.textContent = value;
  }
}

/* =========================================================
   タイプライター表示（NPCの「話している感」を出す演出）
   まばたき・口パクの代わりに、セリフを一文字ずつ表示する。
   表示中にタップすると即座に全文表示にスキップできる。
   ========================================================= */
let typewriterTimer = null;

function typewriterText(el, text, speed = 28) {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
  el.textContent = '';
  el._typewriterDone = !text;
  if (!text) return;

  let i = 0;
  typewriterTimer = setInterval(() => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      el._typewriterDone = true;
    }
  }, speed);

  el._typewriterSkip = () => {
    if (typewriterTimer) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
    el.textContent = text;
    el._typewriterDone = true;
  };
}

// コンテナ（吹き出し等）をタップしたら、中のタイプライター表示を即スキップできるようにする
function enableTypewriterSkip(containerId, textId) {
  $(containerId).addEventListener('click', () => {
    const el = $(textId);
    if (el && el._typewriterSkip) el._typewriterSkip();
  });
}

/* =========================================================
   NAVIGATION HISTORY（「戻る」対応）
   画面遷移は必ず goTo() を通す。goTo は「遷移用の関数」を実行した直後の
   state / obState をまるごとスナップショットして履歴に積む。
   goBack はそれを1つ戻して復元・再描画するので、スコアや入力内容も
   「戻った時点の状態」に正しく巻き戻る。
   ========================================================= */
const navHistory = [];

function snapshotState() {
  return {
    state: JSON.parse(JSON.stringify(state)),
    obState: (typeof obState !== 'undefined') ? JSON.parse(JSON.stringify(obState)) : null
  };
}

function updateBackButton() {
  const btn = $('btn-global-back');
  if (navHistory.length > 1) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

// 設定画面などで「常に最新であるべき」データ（プロフィール等）を更新した時、
// 履歴に積んである過去のスナップショットにもその変更を反映させておく。
// これをしないと、「戻る」で古い履歴に戻った瞬間に変更が巻き戻ってしまう。
function patchHistoryObState(patchFn) {
  navHistory.forEach(entry => {
    if (entry.snap && entry.snap.obState) {
      patchFn(entry.snap.obState);
    }
  });
}

function goTo(loaderFn, ...args) {
  // 今の画面を離れる直前に、その画面で行った回答・入力を履歴に反映しておく
  // （そうしないと、後で「戻る」した時に選択済みの回答が復元されない）
  if (navHistory.length > 0) {
    navHistory[navHistory.length - 1].snap = snapshotState();
  }
  loaderFn(...args);
  navHistory.push({ loaderFn, args, snap: snapshotState() });
  updateBackButton();
}

function goBack() {
  if (navHistory.length < 2) return; // これ以上は戻れない
  navHistory.pop(); // 現在の画面を捨てる
  const prev = navHistory[navHistory.length - 1];
  Object.assign(state, prev.snap.state);
  if (prev.snap.obState && typeof obState !== 'undefined') {
    Object.assign(obState, prev.snap.obState);
  }
  prev.loaderFn(...prev.args);
  updateBackButton();
}

$('btn-global-back').addEventListener('click', goBack);

function updateHeader() {
  const day = GAME_DATA.days[state.dayIndex];
  $('current-day-label').textContent = 'DAY' + (state.dayIndex + 1);
  $('current-time-label').textContent = day.timeLabel;
  $('team-score-val').textContent = state.teamScore;
  $('guest-score-val').textContent = state.guestScore;

  const badge = $('player-badge');
  if (window.PLAYER_AVATAR || window.PLAYER_NAME) {
    renderAvatar($('player-badge-avatar'), window.PLAYER_AVATAR || '🙂');
    $('player-badge-name').textContent = window.PLAYER_NAME || '';
    badge.classList.remove('hidden');
  }
}

function renderStars(container, filled) {
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span');
    span.className = 'star' + (i < filled ? '' : ' empty');
    span.textContent = '★';
    container.appendChild(span);
  }
}

/* =========================================================
   FLOW: TITLE -> EVENT INTRO -> DIALOGUE -> QUESTION ->
          RESULT -> EXPLANATION -> VOICE -> (DAY SUMMARY | GAME OVER)
   ========================================================= */
function loadTitle() {
  $('game-header').classList.add('hidden');
  showScreen('screen-title');
  playBgm(BGM_TITLE_TRACK);

  // 進行状況（保存済みプロフィール、または一度でもクリアしたDay）があれば、
  // タイトルからワンタップでメニュー（Day選択）へ直接行けるようにする
  const hasSavedProfile = typeof loadSavedProfile === 'function' && !!loadSavedProfile();
  const hasProgress = state.completedDaySet && state.completedDaySet.some(Boolean);
  const continueBtn = $('btn-title-continue');
  continueBtn.classList.toggle('hidden', !(hasSavedProfile || hasProgress));
}
$('btn-title-continue').addEventListener('click', () => goTo(loadGameOver));

function startGame() {
  state.dayIndex = 0;
  state.teamScore = 50;
  state.guestScore = 50;
  state.totalPoints = 0;
  state.completedDays = 0;
  state.completedDaySet = new Array(GAME_DATA.days.length).fill(false);
  state.stars = [];
  $('game-header').classList.remove('hidden');
  loadDayStart(0);
}

// NPCの表情バナー画像を取得。専用の表情画像が無いNPC（Day2の先輩スタッフ等）は
// 常にニュートラル画像にフォールバックする。
function npcBannerSrc(npc, expression) {
  const key = { neutral: 'bannerNeutral', happy: 'bannerHappy', worried: 'bannerWorried' }[expression] || 'bannerNeutral';
  return npc[key] || npc.avatar;
}

// DAY1/DAY2/DAY3の進行トラッカー（現在地・完了済みDayをハイライト）
function renderDayTrack(container, currentIdx) {
  container.innerHTML = '';
  GAME_DATA.days.forEach((day, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'day-track-line';
      container.appendChild(line);
    }
    const step = document.createElement('div');
    step.className = 'day-track-step'
      + (i === currentIdx ? ' active' : '')
      + (state.completedDaySet[i] ? ' done' : '');
    step.innerHTML = `<span>DAY${i + 1}</span><span class="day-track-dot"></span>`;
    container.appendChild(step);
  });
}

// Hub（Day選択）や「次のDayへ」から、各Dayの本編（イベント導入）に入る前に
// 表示する確認カード。ジャンル・これまでの★評価・ハイスコアを一覧できる。
function loadDayStart(idx) {
  state.dayIndex = idx;
  const day = GAME_DATA.days[idx];
  $('game-header').classList.remove('hidden');
  updateHeader();
  playBgm(BGM_TITLE_TRACK);

  renderDayTrack($('day-start-track'), idx);
  $('day-start-tag').textContent = day.genreTag || '考えて選ぶ';
  $('day-start-title').textContent = day.dayTitle + '　' + day.timeLabel;
  $('day-start-desc').textContent = personalize(day.sceneIntro || day.daySummaryDesc);
  $('day-start-desc-en').textContent = personalize(day.sceneIntro_en || '');
  $('day-start-desc-en').classList.add('hidden');
  $('btn-translate-day-start').textContent = 'English >';
  renderStars($('day-start-stars'), state.stars[idx] || 0);
  $('day-start-highscore-val').textContent = state.highScore;
  $('day-start-completed-val').textContent = state.completedDays;
  showScreen('screen-day-start');
}

function loadEventIntro(idx) {
  state.dayIndex = idx;
  state.dayGauge = 50;
  $('game-header').classList.remove('hidden');
  const day = GAME_DATA.days[idx];
  updateHeader();
  playBgm(day.bgm || BGM_TITLE_TRACK);
  $('intro-banner').src = npcBannerSrc(day.npc, 'neutral');
  $('intro-avatar-name').textContent = day.npc.name;
  $('event-story-text').textContent = personalize(day.story);
  $('event-hint-text').textContent = personalize(day.hint);
  $('event-story-text-en').textContent = personalize(day.story_en || '');
  $('event-hint-text-en').textContent = personalize(day.hint_en || '');
  $('event-story-text-en').classList.add('hidden');
  $('event-hint-text-en').classList.add('hidden');
  $('btn-translate-intro').textContent = 'English >';
  showScreen('screen-event-intro');
}

function loadDialogue() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $('dialogue-banner').src = npcBannerSrc(day.npc, 'neutral');
  $('dialogue-avatar-name').textContent = day.npc.name;
  typewriterText($('dialogue-text'), personalize(day.dialogueText));
  $('dialogue-text-en').textContent = personalize(day.dialogueText_en || '');
  $('dialogue-text-en').classList.add('hidden');
  $('btn-translate-dialogue').textContent = 'English >';
  $('gauge-label').textContent = day.gaugeLabel;
  $('gauge-change-indicator').textContent = 'NORMAL';
  $('gauge-change-indicator').className = 'change-tag';
  $('gauge-fill').style.width = state.dayGauge + '%';
  showScreen('screen-dialogue');
}

function loadQuestion() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $('question-banner').src = npcBannerSrc(day.npc, 'neutral');
  $('question-avatar-name').textContent = day.npc.name;
  $('question-text').textContent = personalize(day.question.text);
  $('question-text-en').textContent = day.question.textEn;
  $('question-text-en').classList.add('hidden');
  $('btn-translate').textContent = 'English >';

  const container = $('choices-container');
  container.innerHTML = '';
  day.question.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.label;
    btn.addEventListener('click', () => goTo(selectChoice, i));
    container.appendChild(btn);
  });
  showScreen('screen-question');
}

function selectChoice(i) {
  const day = GAME_DATA.days[state.dayIndex];
  const choice = day.question.choices[i];
  state.lastChoice = choice;

  // disable all choice buttons to prevent double-selection
  document.querySelectorAll('#choices-container .choice-btn').forEach(b => b.disabled = true);

  state.teamScore = clamp(state.teamScore + choice.teamDelta);
  state.guestScore = clamp(state.guestScore + choice.guestDelta);
  state.dayGauge = clamp(state.dayGauge + choice.gaugeDelta);
  state.totalPoints += choice.points;
  updateHeader();

  loadResult();
}

function loadResult() {
  const day = GAME_DATA.days[state.dayIndex];
  const choice = state.lastChoice;
  updateHeader();

  const expressionByQuality = { best: 'happy', okay: 'neutral', bad: 'worried' };
  const badgeByQuality = { best: 'S', okay: 'B', bad: 'C' };
  const badgeClassByQuality = { best: 'rank-best', okay: 'rank-okay', bad: 'rank-bad' };

  $('result-banner').src = npcBannerSrc(day.npc, expressionByQuality[choice.quality]);
  $('result-avatar-name').textContent = day.npc.name;
  const badge = $('result-status-badge');
  badge.textContent = badgeByQuality[choice.quality];
  badge.className = 'avatar-status-badge ' + badgeClassByQuality[choice.quality];

  typewriterText($('result-feedback-text'), personalize(choice.feedback));
  $('result-feedback-text-en').textContent = personalize(choice.feedback_en || '');
  $('result-feedback-text-en').classList.add('hidden');
  $('btn-translate-result').textContent = 'English >';
  $('result-gauge-label').textContent = day.gaugeLabel;
  $('result-gauge-fill').style.width = state.dayGauge + '%';

  const changeTag = $('result-gauge-change');
  if (choice.gaugeDelta > 0) { changeTag.textContent = 'UP ▲'; changeTag.className = 'change-tag up'; }
  else if (choice.gaugeDelta < 0) { changeTag.textContent = 'DOWN ▼'; changeTag.className = 'change-tag down'; }
  else { changeTag.textContent = 'NORMAL'; changeTag.className = 'change-tag'; }

  showScreen('screen-result');
}

function loadExplanation() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $('exp-lesson-no').textContent = day.explanation.lessonNo;
  $('exp-title').textContent = day.explanation.title;
  $('exp-content-body').innerHTML = personalize(day.explanation.body);
  $('exp-content-body-en').innerHTML = personalize(day.explanation.body_en || '');
  $('exp-content-body-en').classList.add('hidden');
  $('btn-translate-exp').textContent = 'English >';
  showScreen('screen-explanation');
}

/* ---------- VOICE PRACTICE ---------- */
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI();
  recognition.lang = 'ja-JP';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}
let voiceHandled = false;
let isRecording = false;

function loadVoice() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $('voice-banner').src = npcBannerSrc(day.npc, 'neutral');
  $('voice-avatar-name').textContent = day.npc.name;
  $('voice-lesson-no').textContent = day.voice.lessonNo;
  typewriterText($('voice-script-text'), personalize(day.voice.script));
  $('voice-script-text-en').textContent = personalize(day.voice.script_en || '');
  $('voice-script-text-en').classList.add('hidden');
  $('btn-translate-voice').textContent = 'English >';
  $('mic-status-label').textContent = 'タップして話してください';
  $('recognized-text').textContent = '';
  $('voice-success-badge').classList.add('hidden');
  $('btn-voice-next').classList.add('hidden');
  $('btn-voice-skip').classList.remove('hidden');
  $('btn-mic').classList.remove('recording');
  $('visualizer-container').classList.remove('active');
  voiceHandled = false;
  isRecording = false;
  showScreen('screen-voice');
}

function playSample() {
  if (!('speechSynthesis' in window)) return;
  const day = GAME_DATA.days[state.dayIndex];
  const utter = new SpeechSynthesisUtterance(personalize(day.voice.script));
  utter.lang = 'ja-JP';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function startVoiceCapture() {
  if (isRecording) return;
  isRecording = true;
  voiceHandled = false;
  $('btn-mic').classList.add('recording');
  $('visualizer-container').classList.add('active');
  $('mic-status-label').textContent = '聞いています…';

  if (recognition) {
    try {
      recognition.onresult = (e) => finishVoiceCapture(e.results[0][0].transcript);
      recognition.onerror = () => finishVoiceCapture(null);
      recognition.onend = () => { if (!voiceHandled) finishVoiceCapture(null); };
      recognition.start();
    } catch (e) {
      simulateVoiceCapture();
    }
  } else {
    simulateVoiceCapture();
  }
}

function simulateVoiceCapture() {
  const day = GAME_DATA.days[state.dayIndex];
  setTimeout(() => finishVoiceCapture(personalize(day.voice.script)), 1600);
}

function finishVoiceCapture(recognizedTranscript) {
  if (voiceHandled) return;
  voiceHandled = true;
  isRecording = false;
  const day = GAME_DATA.days[state.dayIndex];
  const text = recognizedTranscript || day.voice.script;

  $('btn-mic').classList.remove('recording');
  $('visualizer-container').classList.remove('active');
  $('mic-status-label').textContent = '認識できました！';
  $('recognized-text').textContent = '「' + text + '」';
  $('voice-success-badge').classList.remove('hidden');
  $('btn-voice-next').classList.remove('hidden');
}

/* ---------- DAY COMPLETION / GAME OVER ---------- */
function completeDay() {
  const starsByQuality = { best: 3, okay: 2, bad: 1 };
  const earned = starsByQuality[state.lastChoice.quality];
  state.stars[state.dayIndex] = earned;

  // そのDayを初めて完了した時だけ completedDays を増やす（やり直しでは二重加算しない）
  if (!state.completedDaySet[state.dayIndex]) {
    state.completedDaySet[state.dayIndex] = true;
    state.completedDays += 1;
  }
  state.highScore = Math.max(state.highScore, state.totalPoints);
  saveHighScore(state.highScore);

  const allDone = state.completedDaySet.length === GAME_DATA.days.length &&
    state.completedDaySet.every(Boolean);
  if (allDone) {
    loadGameOver();
  } else {
    loadDaySummary(earned);
  }
}

function loadDaySummary(earnedStars) {
  const day = GAME_DATA.days[state.dayIndex];
  playBgm(BGM_TITLE_TRACK);
  $('summary-day-title').textContent = day.dayTitle + ' クリア！';
  $('summary-day-desc').textContent = day.daySummaryDesc;
  renderStars($('summary-stars'), earnedStars);
  $('high-score-val').textContent = state.highScore;
  $('completed-days-val').textContent = state.completedDays;
  showScreen('screen-day-summary');
}

// ゲームクリア後の「メニュー」画面。全Day完了後に自動で表示されるほか、
// 設定画面からもいつでも開ける（好きなDayに自由に行き来できるようにするため）。
function loadGameOver() {
  playBgm(BGM_TITLE_TRACK);
  const totalDays = GAME_DATA.days.length;
  const allDone = state.completedDaySet.length === totalDays && state.completedDaySet.every(Boolean);

  $('final-title').textContent = allDone ? '全プログラム修了！' : 'ここまでの進捗';
  $('final-subtitle').textContent = allDone
    ? 'おめでとうございます！3日間の体験と総仕上げテストをすべてやり遂げました。'
    : 'まだ完了していないDayがあります。下から好きなDayを選んで続けられます。';

  const maxPoints = totalDays * 100;
  const pct = state.totalPoints / maxPoints;
  let rank = 'ビギナー (C)';
  if (pct >= 0.9) rank = 'プロフェッショナル (S)';
  else if (pct >= 0.75) rank = 'アドバンス (A)';
  else if (pct >= 0.6) rank = 'ベーシック (B)';

  $('final-total-score').textContent = state.totalPoints + ' pt';
  $('final-rank').textContent = rank;

  renderHubDayGrid();
  showScreen('screen-game-over');
}

function renderHubDayGrid() {
  const grid = $('hub-day-grid');
  grid.innerHTML = '';
  GAME_DATA.days.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = 'hub-day-card';
    const earned = state.stars[i];
    const starsText = earned ? '★'.repeat(earned) + '☆'.repeat(3 - earned) : '未プレイ';
    btn.innerHTML = `<div class="hub-day-title">${day.dayTitle}</div><div class="hub-day-stars">${starsText}</div>`;
    btn.addEventListener('click', () => goTo(loadDayStart, i));
    grid.appendChild(btn);
  });
}

/* =========================================================
   EVENT WIRING
   ========================================================= */
$('btn-start-game').addEventListener('click', () => {
  startBgmIfNeeded();
  // onboarding.js が読み込まれていれば0章(登録〜パスポート完成)へ、
  // なければ従来どおり直接ゲーム本編へ
  goTo(typeof startOnboarding === 'function' ? startOnboarding : startGame);
});
$('btn-intro-next').addEventListener('click', () => goTo(loadDialogue));
$('btn-dialogue-next').addEventListener('click', () => goTo(loadQuestion));
$('btn-show-explanation').addEventListener('click', () => goTo(loadExplanation));
$('btn-exp-next').addEventListener('click', () => goTo(loadVoice));
$('btn-listen-sample').addEventListener('click', playSample);
$('btn-mic').addEventListener('click', startVoiceCapture);
$('btn-voice-skip').addEventListener('click', () => {
  if (isRecording && recognition) {
    try { recognition.abort(); } catch (e) { /* already stopped */ }
  }
  isRecording = false;
  voiceHandled = true;
  goTo(completeDay);
});
$('btn-voice-next').addEventListener('click', () => goTo(completeDay));
$('btn-day-continue').addEventListener('click', () => goTo(loadDayStart, state.dayIndex + 1));
$('btn-day-start-next').addEventListener('click', () => goTo(loadEventIntro, state.dayIndex));
$('btn-hub-passport').addEventListener('click', () => {
  if (typeof finalizeOnboarding === 'function') goTo(finalizeOnboarding);
});
$('btn-open-hub').addEventListener('click', () => goTo(loadGameOver));

// 開発用ジャンプメニュー：どの画面へも直接移動できる（テスト用）
const DEV_JUMP_TARGETS = {
  storycover: () => goTo(loadStoryCover),
  level: () => goTo(loadLevelCheck),
  recommend: () => goTo(loadRecommend),
  langselect: () => goTo(loadLangSelect),
  intro: () => goTo(loadIntroSlide, 0),
  character: () => goTo(loadCharacterGreet),
  hearing: () => goTo(loadHearing, 0),
  aptitude: () => goTo(loadAptitudeIntro),
  profile1: () => goTo(loadProfile1),
  profile2: () => goTo(loadProfile2),
  passport: () => goTo(finalizeOnboarding),
  scheduletime: () => goTo(loadScheduleTime),
  scheduledays: () => goTo(loadScheduleDays),
  schedulegoal: () => goTo(loadScheduleGoal),
  daystart1: () => goTo(loadDayStart, 0),
  daystart2: () => goTo(loadDayStart, 1),
  daystart3: () => goTo(loadDayStart, 2),
  day1: () => goTo(loadEventIntro, 0),
  day2: () => goTo(loadEventIntro, 1),
  day3: () => goTo(loadEventIntro, 2),
  hub: () => goTo(loadGameOver)
};
document.querySelectorAll('#dev-jump-grid [data-jump]').forEach(btn => {
  btn.addEventListener('click', () => {
    const fn = DEV_JUMP_TARGETS[btn.dataset.jump];
    if (fn) fn();
  });
});
$('btn-restart').addEventListener('click', () => {
  navHistory.length = 0; // 最初からやり直すので履歴もリセット
  goTo(loadTitle);
});

// シナリオ内の全画面共通の「English >」トグル。ボタンを押すたびに
// 対応する英訳テキストの表示/非表示を切り替える。
function wireTranslateToggle(btnId, enId, jpTextId) {
  $(btnId).addEventListener('click', () => {
    const en = $(enId);
    en.classList.toggle('hidden');
    $(btnId).textContent = en.classList.contains('hidden') ? 'English >' : '日本語 >';
    // 英訳を表示するタイミングで、対応する日本語側がタイプライター表示中なら即座に全文表示にする
    if (!en.classList.contains('hidden') && jpTextId) {
      const jp = $(jpTextId);
      if (jp && jp._typewriterSkip) jp._typewriterSkip();
    }
  });
}
wireTranslateToggle('btn-translate', 'question-text-en');
wireTranslateToggle('btn-translate-dialogue', 'dialogue-text-en', 'dialogue-text');
wireTranslateToggle('btn-translate-result', 'result-feedback-text-en', 'result-feedback-text');
wireTranslateToggle('btn-translate-exp', 'exp-content-body-en');
wireTranslateToggle('btn-translate-voice', 'voice-script-text-en', 'voice-script-text');
wireTranslateToggle('btn-translate-day-start', 'day-start-desc-en');

// タイプライター表示中の吹き出しをタップすると、即座に全文表示にスキップできる
enableTypewriterSkip('dialogue-speech-bubble', 'dialogue-text');
enableTypewriterSkip('result-speech-bubble', 'result-feedback-text');
enableTypewriterSkip('voice-script-card', 'voice-script-text');

// イベント導入画面だけは「ストーリー」と「ヒント」の2箇所を1つのボタンで同時に切り替える
$('btn-translate-intro').addEventListener('click', () => {
  const storyEn = $('event-story-text-en');
  const hintEn = $('event-hint-text-en');
  const willShow = storyEn.classList.contains('hidden');
  storyEn.classList.toggle('hidden');
  hintEn.classList.toggle('hidden');
  $('btn-translate-intro').textContent = willShow ? '日本語 >' : 'English >';
});

// initial state
goTo(loadTitle);
