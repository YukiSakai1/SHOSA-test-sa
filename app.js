const HIGH_SCORE_KEY = "shosa_game_high_score";
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
  }
}
const PROGRESS_KEY = "shosa_game_progress";
function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      dayIndex: state.dayIndex,
      teamScore: state.teamScore,
      guestScore: state.guestScore,
      totalPoints: state.totalPoints,
      completedDays: state.completedDays,
      completedDaySet: state.completedDaySet,
      stars: state.stars
    }));
  } catch (e) {
  }
}
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
const $ = (id) => document.getElementById(id);
const screens = document.querySelectorAll(".screen");
function showScreen(id) {
  screens.forEach((s) => s.classList.add("hidden"));
  const target = $(id);
  if (target) target.classList.remove("hidden");
  $("app-viewport").scrollTop = 0;
  const GAME_PLAY_SCREENS = [
    "screen-day-start",
    "screen-event-intro",
    "screen-dialogue",
    "screen-question",
    "screen-result",
    "screen-explanation",
    "screen-voice",
    "screen-game-over"
  ];
  const gameHeader = $("game-header");
  if (gameHeader) {
    if (GAME_PLAY_SCREENS.includes(id) && !id.startsWith("screen-ch101-")) {
      gameHeader.classList.remove("hidden");
    } else {
      gameHeader.classList.add("hidden");
    }
  }
  const topNav = $("top-nav-bar");
  if (topNav) {
    const isImmersive = id.startsWith("screen-ob-") || id === "screen-title" || id === "screen-story-cover" || id === "screen-home" || id.startsWith("screen-ch101-");
    if (isImmersive) {
      topNav.classList.add("hidden");
    } else {
      topNav.classList.remove("hidden");
    }
  }
  updateBackButton();
}
function clamp(n) {
  return Math.max(0, Math.min(100, n));
}
function updateStatsVisibility() {
  const header = $("game-header");
  const metrics = header.querySelector(".metrics-summary");
  if (metrics) {
    metrics.classList.toggle("hidden", !state.statsVisible);
  }
  const btn = $("btn-stats-toggle");
  btn.textContent = state.statsVisible ? "\u{1F4CA} ON" : "\u{1F4CA}";
  btn.classList.toggle("active", state.statsVisible);
}
$("btn-stats-toggle").addEventListener("click", () => {
  state.statsVisible = !state.statsVisible;
  updateStatsVisibility();
});
function personalize(str) {
  return window.PLAYER_NAME ? str.split("\u25CB\u25CB").join(window.PLAYER_NAME) : str;
}
function isImagePath(value) {
  return typeof value === "string" && /\.(png|jpe?g|webp|gif)$/i.test(value);
}
function renderAvatar(el, value) {
  el.innerHTML = "";
  if (isImagePath(value)) {
    const img = document.createElement("img");
    img.src = value;
    img.alt = "";
    el.appendChild(img);
  } else {
    el.textContent = value;
  }
}
let typewriterTimer = null;
function typewriterText(el, text, speed = 28) {
  if (typewriterTimer) {
    clearInterval(typewriterTimer);
    typewriterTimer = null;
  }
  el.textContent = "";
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
function enableTypewriterSkip(containerId, textId) {
  $(containerId).addEventListener("click", () => {
    const el = $(textId);
    if (el && el._typewriterSkip) el._typewriterSkip();
  });
}
const navHistory = [];
function snapshotState() {
  return {
    state: JSON.parse(JSON.stringify(state)),
    obState: typeof obState !== "undefined" ? JSON.parse(JSON.stringify(obState)) : null
  };
}
function updateBackButton() {
  const btn = $("btn-global-back");
  if (btn) {
    if (navHistory.length > 1) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  }
  const titleBack = $("btn-title-back");
  if (titleBack) {
    if (navHistory.length > 1) titleBack.classList.remove("hidden");
    else titleBack.classList.add("hidden");
  }
  const gameHeaderBack = $("btn-game-header-back");
  if (gameHeaderBack) {
    if (navHistory.length > 1) gameHeaderBack.classList.remove("hidden");
    else gameHeaderBack.classList.add("hidden");
  }
}
function patchHistoryObState(patchFn) {
  navHistory.forEach((entry) => {
    if (entry.snap && entry.snap.obState) {
      patchFn(entry.snap.obState);
    }
  });
}
function goTo(loaderFn, ...args) {
  if (navHistory.length > 0) {
    navHistory[navHistory.length - 1].snap = snapshotState();
  }
  loaderFn(...args);
  navHistory.push({ loaderFn, args, snap: snapshotState() });
  updateBackButton();
}
function navigatePreviousFallback(currentId) {
  if (typeof obState === "undefined") window.obState = {};
  navHistory.length = 0;
  switch (currentId) {
    case "screen-home":
      goTo(loadTitle);
      break;
    case "screen-story-cover":
      goTo(loadTitle);
      break;
    case "screen-ob-langselect":
      goTo(loadStoryCover);
      break;
    case "screen-ob-intro":
      if (typeof obState !== "undefined" && obState.slideIndex > 0) {
        goTo(loadIntroSlide, obState.slideIndex - 1);
      } else {
        goTo(loadLangSelect);
      }
      break;
    case "screen-ob-character":
      goTo(loadIntroSlide, 3);
      break;
    case "screen-ob-hearing":
      if (typeof obState !== "undefined" && obState.hearingIndex > 0) {
        goTo(loadHearing, obState.hearingIndex - 1);
      } else {
        goTo(loadCharacterGreet);
      }
      break;
    case "screen-ob-schedule-time":
      goTo(loadHearing, typeof ONBOARDING_DATA !== "undefined" && ONBOARDING_DATA.hearings ? ONBOARDING_DATA.hearings.length - 1 : 3);
      break;
    case "screen-ob-profile-intro":
      goTo(loadScheduleTime);
      break;
    case "screen-ob-profile1":
      goTo(loadProfileIntro);
      break;
    case "screen-ob-journey":
      goTo(loadProfile1);
      break;
    case "screen-ob-aptitude-intro":
      goTo(loadJourney);
      break;
    case "screen-ob-aptitude":
      if (typeof obState !== "undefined" && (obState.aptitudePageIndex > 0 || obState.aptitudeIndex > 0)) {
        const prevIdx = (obState.aptitudePageIndex || obState.aptitudeIndex || 1) - 1;
        goTo(loadAptitude, prevIdx);
      } else {
        goTo(loadAptitudeIntro);
      }
      break;
    case "screen-ob-passport": {
      const pageSize = typeof APTITUDE_PAGE_SIZE !== "undefined" ? APTITUDE_PAGE_SIZE : 3;
      const lastAptitudePage = Math.max(0, Math.ceil(ONBOARDING_DATA.aptitudeQuestions.length / pageSize) - 1);
      goTo(loadAptitude, lastAptitudePage);
      break;
    }
    case "screen-ob-result":
      goTo(finalizeAptitudeCelebration);
      break;
    case "screen-ch101-intro":
      goTo(loadDiagnosisResult);
      break;
    case "screen-day-start":
      goTo(loadScheduleTime);
      break;
    case "screen-event-intro":
      goTo(loadDayStart, state.dayIndex);
      break;
    case "screen-dialogue":
      goTo(loadEventIntro, state.dayIndex);
      break;
    case "screen-question":
      goTo(loadDialogue);
      break;
    case "screen-result":
      goTo(loadQuestion);
      break;
    case "screen-explanation":
      goTo(loadResult);
      break;
    case "screen-voice":
      goTo(loadExplanation);
      break;
    case "screen-game-over":
      goTo(loadHomeScreen);
      break;
    case "screen-settings":
      goTo(loadTitle);
      break;
    default:
      goTo(loadTitle);
      break;
  }
}
function goBack() {
  if (navHistory.length >= 2) {
    navHistory.pop();
    const prev = navHistory[navHistory.length - 1];
    Object.assign(state, prev.snap.state);
    if (prev.snap.obState && typeof obState !== "undefined") {
      Object.assign(obState, prev.snap.obState);
    }
    prev.loaderFn(...prev.args);
    updateBackButton();
    return;
  }
  const currentScreen = document.querySelector(".screen:not(.hidden)");
  const currentId = currentScreen ? currentScreen.id : "";
  navigatePreviousFallback(currentId);
}
window.goBack = goBack;
document.addEventListener("click", (e) => {
  const backBtn = e.target?.closest?.('.figma-header-back-btn, .global-back-btn, .game-header-back-btn, [data-action="back"]');
  if (backBtn && !backBtn.hasAttribute("onclick")) {
    goBack();
  }
});
function updateHeader() {
  const day = GAME_DATA.days[state.dayIndex];
  $("current-day-label").textContent = "DAY" + (state.dayIndex + 1);
  $("current-time-label").textContent = day.timeLabel;
  $("team-score-val").textContent = String(state.teamScore);
  $("guest-score-val").textContent = String(state.guestScore);
  saveProgress();
  const badge = $("player-badge");
  if (window.PLAYER_AVATAR || window.PLAYER_NAME) {
    renderAvatar($("player-badge-avatar"), window.PLAYER_AVATAR || "\u{1F642}");
    $("player-badge-name").textContent = window.PLAYER_NAME || "";
    badge.classList.remove("hidden");
  }
}
function renderStars(container, filled) {
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    span.className = "star" + (i < filled ? "" : " empty");
    span.textContent = "\u2605";
    container.appendChild(span);
  }
}
function loadTitle() {
  $("game-header").classList.add("hidden");
  showScreen("screen-title");
  const savedProfile = typeof loadSavedProfile === "function" ? loadSavedProfile() : null;
  const hasSavedProfile = !!savedProfile;
  const phoneBtn = $("btn-login-phone") || $("btn-start-game");
  const googleBtn = $("btn-login-google");
  const appleBtn = $("btn-login-apple");
  const continueBtn = $("btn-title-continue");
  const resetLink = $("btn-title-reset-all");
  const welcomeBlock = $("title-welcome-back");
  if (welcomeBlock) welcomeBlock.classList.add("hidden");
  if (!hasSavedProfile) {
    if (phoneBtn) {
      phoneBtn.classList.remove("hidden");
      const span = phoneBtn.querySelector("span");
      if (span) span.textContent = "\u96FB\u8A71\u756A\u53F7\u3067\u7D9A\u3051\u308B";
    }
    if (googleBtn) googleBtn.classList.remove("hidden");
    if (appleBtn) appleBtn.classList.remove("hidden");
    if (continueBtn) continueBtn.classList.add("hidden");
    if (resetLink) resetLink.classList.add("hidden");
    return;
  }
  if (googleBtn) googleBtn.classList.add("hidden");
  if (appleBtn) appleBtn.classList.add("hidden");
  if (continueBtn) continueBtn.classList.add("hidden");
  if (phoneBtn) {
    phoneBtn.classList.remove("hidden");
    const span = phoneBtn.querySelector("span");
    if (span) span.textContent = "\u30ED\u30B0\u30A4\u30F3";
  }
  if (resetLink) resetLink.classList.remove("hidden");
}
function restorePlayerIdentity() {
  const savedProfile = typeof loadSavedProfile === "function" ? loadSavedProfile() : null;
  if (savedProfile) {
    window.PLAYER_NAME = savedProfile.name;
    window.PLAYER_AVATAR = savedProfile.avatar;
  }
}
function triggerStartGame() {
  goTo(typeof startOnboarding === "function" ? startOnboarding : startGame);
}
function onPhoneOrLoginClick() {
  const savedProfile = typeof loadSavedProfile === "function" ? loadSavedProfile() : null;
  if (savedProfile) {
    restorePlayerIdentity();
    goTo(loadHomeScreen);
  } else {
    goTo(typeof startOnboarding === "function" ? startOnboarding : startGame);
  }
}
if ($("btn-login-phone")) $("btn-login-phone").addEventListener("click", onPhoneOrLoginClick);
if ($("btn-start-game")) $("btn-start-game").addEventListener("click", onPhoneOrLoginClick);
if ($("btn-login-google")) $("btn-login-google").addEventListener("click", triggerStartGame);
if ($("btn-login-apple")) $("btn-login-apple").addEventListener("click", triggerStartGame);
if ($("btn-login-link")) $("btn-login-link").addEventListener("click", onPhoneOrLoginClick);
function loadHomeScreen() {
  restorePlayerIdentity();
  const savedProfile = typeof loadSavedProfile === "function" ? loadSavedProfile() : null;
  const savedProgress = typeof loadSavedProgress === "function" ? loadSavedProgress() : null;
  const streakEl = $("hm-streak-days");
  if (streakEl) {
    const daysCount = savedProgress && savedProgress.completedDays ? savedProgress.completedDays + 1 : 5;
    streakEl.textContent = daysCount;
  }
  const bubbleEl = $("hm-bubble-text");
  if (bubbleEl) {
    if (savedProgress && (savedProgress.completedDays >= 1 || savedProgress.completedDaySet && savedProgress.completedDaySet[0])) {
      bubbleEl.textContent = "Chapter 1 \u30AF\u30EA\u30A2\uFF01\u304A\u3064\u304B\u308C\u3055\u307E\uFF01";
    } else {
      bubbleEl.textContent = "\u4ECA\u65E5\u3082\u4E00\u7DD2\u306B\u5B66\u3073\u307E\u3057\u3087\u3046\uFF01";
    }
  }
  showScreen("screen-home");
}
window.loadHomeScreen = loadHomeScreen;
if ($("btn-hm-ch0-action")) {
  $("btn-hm-ch0-action").addEventListener("click", () => {
    goTo(loadStoryCover);
  });
}
if ($("btn-hm-ch1-action")) {
  $("btn-hm-ch1-action").addEventListener("click", () => {
    goTo(startChapter101);
  });
}
if ($("btn-hm-ch2-action")) {
  $("btn-hm-ch2-action").addEventListener("click", () => {
    alert("CHAPTER 2\u306F\u6E96\u5099\u4E2D\u3067\u3059\u3002");
  });
}
if ($("btn-hm-exam")) {
  $("btn-hm-exam").addEventListener("click", () => {
    alert("3\u7AE0\u306E\u6A21\u64EC\u30C6\u30B9\u30C8\u5B8C\u4E86\u3067\u30A2\u30F3\u30ED\u30C3\u30AF\u3055\u308C\u307E\u3059\u3002");
  });
}
if ($("hm-btn-notification")) {
  $("hm-btn-notification").addEventListener("click", () => {
    alert("\u304A\u77E5\u3089\u305B\uFF1A\u65B0\u7740\u306E\u901A\u77E5\u306F\u3042\u308A\u307E\u305B\u3093\u3002");
  });
}
if ($("hm-tab-home")) {
  $("hm-tab-home").addEventListener("click", () => {
    goTo(loadHomeScreen);
  });
}
if ($("hm-tab-chapter")) {
  $("hm-tab-chapter").addEventListener("click", () => {
    goTo(startChapter101);
  });
}
if ($("hm-tab-column")) {
  $("hm-tab-column").addEventListener("click", () => {
    alert("\u30B3\u30E9\u30E0\u6A5F\u80FD\u306F\u6E96\u5099\u4E2D\u3067\u3059\u3002");
  });
}
if ($("hm-tab-log")) {
  $("hm-tab-log").addEventListener("click", () => {
    alert("\u5B66\u7FD2\u30ED\u30B0\u6A5F\u80FD\u306F\u6E96\u5099\u4E2D\u3067\u3059\u3002");
  });
}
if ($("hm-tab-settings")) {
  $("hm-tab-settings").addEventListener("click", () => {
    goTo(loadSettings);
  });
}
$("btn-title-continue").addEventListener("click", () => {
  restorePlayerIdentity();
  const savedProgress = typeof loadSavedProgress === "function" ? loadSavedProgress() : null;
  if (!savedProgress) {
    goTo(startGame);
    return;
  }
  Object.assign(state, {
    dayIndex: savedProgress.dayIndex || 0,
    teamScore: savedProgress.teamScore ?? 50,
    guestScore: savedProgress.guestScore ?? 50,
    totalPoints: savedProgress.totalPoints || 0,
    completedDays: savedProgress.completedDays || 0,
    completedDaySet: savedProgress.completedDaySet || [],
    stars: savedProgress.stars || []
  });
  const totalDays = GAME_DATA.days.length;
  const allDone = state.completedDaySet.length === totalDays && state.completedDaySet.every(Boolean);
  if (allDone) {
    goTo(loadGameOver);
  } else {
    goTo(loadDayStart, state.dayIndex);
  }
});
$("btn-title-reset-all").addEventListener("click", () => {
  if (typeof resetAllSavedData === "function") resetAllSavedData();
  window.PLAYER_NAME = null;
  window.PLAYER_AVATAR = null;
  navHistory.length = 0;
  goTo(typeof startOnboarding === "function" ? startOnboarding : startGame);
});
function startGame() {
  state.dayIndex = 0;
  state.teamScore = 50;
  state.guestScore = 50;
  state.totalPoints = 0;
  state.completedDays = 0;
  state.completedDaySet = new Array(GAME_DATA.days.length).fill(false);
  state.stars = [];
  startChapter101();
}
function npcBannerSrc(npc, expression) {
  const key = { neutral: "bannerNeutral", happy: "bannerHappy", worried: "bannerWorried" }[expression] || "bannerNeutral";
  return npc[key] || npc.avatar;
}
function renderDayTrack(container, currentIdx) {
  container.innerHTML = "";
  GAME_DATA.days.forEach((day, i) => {
    if (i > 0) {
      const line = document.createElement("div");
      line.className = "day-track-line";
      container.appendChild(line);
    }
    const step = document.createElement("div");
    step.className = "day-track-step" + (i === currentIdx ? " active" : "") + (state.completedDaySet[i] ? " done" : "");
    step.innerHTML = `<span>DAY${i + 1}</span><span class="day-track-dot"></span>`;
    container.appendChild(step);
  });
}
function loadDayStart(idx) {
  state.dayIndex = idx;
  if (idx === 0) {
    startChapter101();
    return;
  }
  const day = GAME_DATA.days[idx];
  if (!day) {
    goTo(loadHomeScreen);
    return;
  }
  $("game-header").classList.remove("hidden");
  updateHeader();
  renderDayTrack($("day-start-track"), idx);
  $("day-start-tag").textContent = day.genreTag || "\u8003\u3048\u3066\u9078\u3076";
  $("day-start-title").textContent = day.dayTitle + "\u3000" + day.timeLabel;
  $("day-start-desc").textContent = personalize(day.sceneIntro || day.daySummaryDesc);
  $("day-start-desc-en").textContent = personalize(day.sceneIntro_en || "");
  $("day-start-desc-en").classList.add("hidden");
  $("btn-translate-day-start").textContent = "English >";
  renderStars($("day-start-stars"), state.stars[idx] || 0);
  $("day-start-highscore-val").textContent = String(state.highScore);
  $("day-start-completed-val").textContent = String(state.completedDays);
  showScreen("screen-day-start");
}
function loadEventIntro(idx) {
  state.dayIndex = idx;
  state.dayGauge = 50;
  $("game-header").classList.remove("hidden");
  const day = GAME_DATA.days[idx];
  updateHeader();
  $("intro-banner").src = npcBannerSrc(day.npc, "neutral");
  $("intro-avatar-name").textContent = day.npc.name;
  $("event-story-text").textContent = personalize(day.story);
  $("event-hint-text").textContent = personalize(day.hint);
  $("event-story-text-en").textContent = personalize(day.story_en || "");
  $("event-hint-text-en").textContent = personalize(day.hint_en || "");
  $("event-story-text-en").classList.add("hidden");
  $("event-hint-text-en").classList.add("hidden");
  $("btn-translate-intro").textContent = "English >";
  showScreen("screen-event-intro");
}
function loadDialogue() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $("dialogue-banner").src = npcBannerSrc(day.npc, "neutral");
  $("dialogue-avatar-name").textContent = day.npc.name;
  typewriterText($("dialogue-text"), personalize(day.dialogueText));
  $("dialogue-text-en").textContent = personalize(day.dialogueText_en || "");
  $("dialogue-text-en").classList.add("hidden");
  $("btn-translate-dialogue").textContent = "English >";
  $("gauge-label").textContent = day.gaugeLabel;
  $("gauge-change-indicator").textContent = "NORMAL";
  $("gauge-change-indicator").className = "change-tag";
  $("gauge-fill").style.width = state.dayGauge + "%";
  showScreen("screen-dialogue");
}
function loadQuestion() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $("question-banner").src = npcBannerSrc(day.npc, "neutral");
  $("question-avatar-name").textContent = day.npc.name;
  $("question-text").textContent = personalize(day.question.text);
  $("question-text-en").textContent = day.question.textEn;
  $("question-text-en").classList.add("hidden");
  $("btn-translate").textContent = "English >";
  const container = $("choices-container");
  container.innerHTML = "";
  day.question.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.label;
    btn.addEventListener("click", () => goTo(selectChoice, i));
    container.appendChild(btn);
  });
  showScreen("screen-question");
}
function selectChoice(i) {
  const day = GAME_DATA.days[state.dayIndex];
  const choice = day.question.choices[i];
  state.lastChoice = choice;
  document.querySelectorAll("#choices-container .choice-btn").forEach((b) => b.disabled = true);
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
  const expressionByQuality = { best: "happy", okay: "neutral", bad: "worried" };
  const badgeByQuality = { best: "S", okay: "B", bad: "C" };
  const badgeClassByQuality = { best: "rank-best", okay: "rank-okay", bad: "rank-bad" };
  $("result-banner").src = npcBannerSrc(day.npc, expressionByQuality[choice.quality]);
  $("result-avatar-name").textContent = day.npc.name;
  const badge = $("result-status-badge");
  badge.textContent = badgeByQuality[choice.quality];
  badge.className = "avatar-status-badge " + badgeClassByQuality[choice.quality];
  typewriterText($("result-feedback-text"), personalize(choice.feedback));
  $("result-feedback-text-en").textContent = personalize(choice.feedback_en || "");
  $("result-feedback-text-en").classList.add("hidden");
  $("btn-translate-result").textContent = "English >";
  $("result-gauge-label").textContent = day.gaugeLabel;
  $("result-gauge-fill").style.width = state.dayGauge + "%";
  const changeTag = $("result-gauge-change");
  if (choice.gaugeDelta > 0) {
    changeTag.textContent = "UP \u25B2";
    changeTag.className = "change-tag up";
  } else if (choice.gaugeDelta < 0) {
    changeTag.textContent = "DOWN \u25BC";
    changeTag.className = "change-tag down";
  } else {
    changeTag.textContent = "NORMAL";
    changeTag.className = "change-tag";
  }
  showScreen("screen-result");
}
function loadExplanation() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $("exp-lesson-no").textContent = day.explanation.lessonNo;
  $("exp-title").textContent = day.explanation.title;
  $("exp-content-body").innerHTML = personalize(day.explanation.body);
  $("exp-content-body-en").innerHTML = personalize(day.explanation.body_en || "");
  $("exp-content-body-en").classList.add("hidden");
  $("btn-translate-exp").textContent = "English >";
  showScreen("screen-explanation");
}
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI();
  recognition.lang = "ja-JP";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
}
let voiceHandled = false;
let isRecording = false;
function loadVoice() {
  const day = GAME_DATA.days[state.dayIndex];
  updateHeader();
  $("voice-banner").src = npcBannerSrc(day.npc, "neutral");
  $("voice-avatar-name").textContent = day.npc.name;
  $("voice-lesson-no").textContent = day.voice.lessonNo;
  typewriterText($("voice-script-text"), personalize(day.voice.script));
  $("voice-script-text-en").textContent = personalize(day.voice.script_en || "");
  $("voice-script-text-en").classList.add("hidden");
  $("btn-translate-voice").textContent = "English >";
  $("mic-status-label").textContent = "\u30BF\u30C3\u30D7\u3057\u3066\u8A71\u3057\u3066\u304F\u3060\u3055\u3044";
  $("recognized-text").textContent = "";
  $("voice-success-badge").classList.add("hidden");
  $("btn-voice-next").classList.add("hidden");
  $("btn-voice-skip").classList.remove("hidden");
  $("btn-mic").classList.remove("recording");
  $("visualizer-container").classList.remove("active");
  voiceHandled = false;
  isRecording = false;
  showScreen("screen-voice");
}
function playSample() {
  if (!("speechSynthesis" in window)) return;
  const day = GAME_DATA.days[state.dayIndex];
  const utter = new SpeechSynthesisUtterance(personalize(day.voice.script));
  utter.lang = "ja-JP";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
function startVoiceCapture() {
  if (isRecording) return;
  isRecording = true;
  voiceHandled = false;
  $("btn-mic").classList.add("recording");
  $("visualizer-container").classList.add("active");
  $("mic-status-label").textContent = "\u805E\u3044\u3066\u3044\u307E\u3059\u2026";
  if (recognition) {
    try {
      recognition.onresult = (e) => finishVoiceCapture(e.results[0][0].transcript);
      recognition.onerror = () => finishVoiceCapture(null);
      recognition.onend = () => {
        if (!voiceHandled) finishVoiceCapture(null);
      };
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
  $("btn-mic").classList.remove("recording");
  $("visualizer-container").classList.remove("active");
  $("mic-status-label").textContent = "\u8A8D\u8B58\u3067\u304D\u307E\u3057\u305F\uFF01";
  $("recognized-text").textContent = "\u300C" + text + "\u300D";
  $("voice-success-badge").classList.remove("hidden");
  $("btn-voice-next").classList.remove("hidden");
}
function completeDay() {
  const starsByQuality = { best: 3, okay: 2, bad: 1 };
  const earned = starsByQuality[state.lastChoice.quality];
  state.stars[state.dayIndex] = earned;
  if (!state.completedDaySet[state.dayIndex]) {
    state.completedDaySet[state.dayIndex] = true;
    state.completedDays += 1;
  }
  state.highScore = Math.max(state.highScore, state.totalPoints);
  saveHighScore(state.highScore);
  saveProgress();
  goTo(loadHomeScreen);
}
function loadGameOver() {
  const totalDays = GAME_DATA.days.length;
  const allDone = state.completedDaySet.length === totalDays && state.completedDaySet.every(Boolean);
  $("final-title").textContent = allDone ? "\u5168\u30D7\u30ED\u30B0\u30E9\u30E0\u4FEE\u4E86\uFF01" : "\u3053\u3053\u307E\u3067\u306E\u9032\u6357";
  $("final-subtitle").textContent = allDone ? "\u304A\u3081\u3067\u3068\u3046\u3054\u3056\u3044\u307E\u3059\uFF013\u65E5\u9593\u306E\u4F53\u9A13\u3068\u7DCF\u4ED5\u4E0A\u3052\u30C6\u30B9\u30C8\u3092\u3059\u3079\u3066\u3084\u308A\u9042\u3052\u307E\u3057\u305F\u3002" : "\u307E\u3060\u5B8C\u4E86\u3057\u3066\u3044\u306A\u3044Day\u304C\u3042\u308A\u307E\u3059\u3002\u4E0B\u304B\u3089\u597D\u304D\u306ADay\u3092\u9078\u3093\u3067\u7D9A\u3051\u3089\u308C\u307E\u3059\u3002";
  const maxPoints = totalDays * 100;
  const pct = state.totalPoints / maxPoints;
  let rank = "\u30D3\u30AE\u30CA\u30FC (C)";
  if (pct >= 0.9) rank = "\u30D7\u30ED\u30D5\u30A7\u30C3\u30B7\u30E7\u30CA\u30EB (S)";
  else if (pct >= 0.75) rank = "\u30A2\u30C9\u30D0\u30F3\u30B9 (A)";
  else if (pct >= 0.6) rank = "\u30D9\u30FC\u30B7\u30C3\u30AF (B)";
  $("final-total-score").textContent = state.totalPoints + " pt";
  $("final-rank").textContent = rank;
  renderHubDayGrid();
  showScreen("screen-game-over");
}
function renderHubDayGrid() {
  const grid = $("hub-day-grid");
  grid.innerHTML = "";
  GAME_DATA.days.forEach((day, i) => {
    const btn = document.createElement("button");
    btn.className = "hub-day-card";
    const earned = state.stars[i];
    const starsText = earned ? "\u2605".repeat(earned) + "\u2606".repeat(3 - earned) : "\u672A\u30D7\u30EC\u30A4";
    btn.innerHTML = `<div class="hub-day-title">${day.dayTitle}</div><div class="hub-day-stars">${starsText}</div>`;
    btn.addEventListener("click", () => goTo(loadDayStart, i));
    grid.appendChild(btn);
  });
}
$("btn-intro-next").addEventListener("click", () => goTo(loadDialogue));
$("btn-dialogue-next").addEventListener("click", () => goTo(loadQuestion));
$("btn-show-explanation").addEventListener("click", () => goTo(loadExplanation));
$("btn-exp-next").addEventListener("click", () => goTo(loadVoice));
$("btn-listen-sample").addEventListener("click", playSample);
$("btn-mic").addEventListener("click", startVoiceCapture);
$("btn-voice-skip").addEventListener("click", () => {
  if (isRecording && recognition) {
    try {
      recognition.abort();
    } catch (e) {
    }
  }
  isRecording = false;
  voiceHandled = true;
  goTo(completeDay);
});
$("btn-voice-next").addEventListener("click", () => goTo(completeDay));
if ($("btn-day-continue")) {
  $("btn-day-continue").addEventListener("click", () => goTo(loadHomeScreen));
}
$("btn-day-start-next").addEventListener("click", () => goTo(loadEventIntro, state.dayIndex));
$("btn-hub-passport").addEventListener("click", () => {
  if (typeof finalizeOnboarding === "function") goTo(finalizeOnboarding);
});
$("btn-open-hub").addEventListener("click", () => goTo(loadGameOver));
const DEV_JUMP_TARGETS = {
  home: () => goTo(loadHomeScreen),
  ch101: () => goTo(startChapter101),
  storycover: () => goTo(loadStoryCover),
  langselect: () => goTo(loadLangSelect),
  intro: () => goTo(loadIntroSlide, 0),
  character: () => goTo(loadCharacterGreet),
  hearing: () => goTo(loadHearing, 0),
  aptitude: () => goTo(loadAptitudeIntro),
  profile1: () => goTo(loadProfile1),
  profile2: () => goTo(loadProfile1),
  passport: () => goTo(finalizeOnboarding),
  scheduletime: () => goTo(loadScheduleTime),
  daystart1: () => goTo(loadDayStart, 0),
  day1: () => goTo(loadEventIntro, 0),
  hub: () => goTo(loadGameOver)
};
document.querySelectorAll("#dev-jump-grid [data-jump]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const fn = DEV_JUMP_TARGETS[btn.dataset.jump || ""];
    if (fn) fn();
  });
});
$("btn-restart").addEventListener("click", () => {
  navHistory.length = 0;
  goTo(loadTitle);
});
function wireTranslateToggle(btnId, enId, jpTextId) {
  $(btnId).addEventListener("click", () => {
    const en = $(enId);
    en.classList.toggle("hidden");
    $(btnId).textContent = en.classList.contains("hidden") ? "English >" : "\u65E5\u672C\u8A9E >";
    if (!en.classList.contains("hidden") && jpTextId) {
      const jp = $(jpTextId);
      if (jp && jp._typewriterSkip) jp._typewriterSkip();
    }
  });
}
wireTranslateToggle("btn-translate", "question-text-en");
wireTranslateToggle("btn-translate-dialogue", "dialogue-text-en", "dialogue-text");
wireTranslateToggle("btn-translate-result", "result-feedback-text-en", "result-feedback-text");
wireTranslateToggle("btn-translate-exp", "exp-content-body-en");
wireTranslateToggle("btn-translate-voice", "voice-script-text-en", "voice-script-text");
wireTranslateToggle("btn-translate-day-start", "day-start-desc-en");
enableTypewriterSkip("dialogue-speech-bubble", "dialogue-text");
enableTypewriterSkip("result-speech-bubble", "result-feedback-text");
enableTypewriterSkip("voice-script-card", "voice-script-text");
$("btn-translate-intro").addEventListener("click", () => {
  const storyEn = $("event-story-text-en");
  const hintEn = $("event-hint-text-en");
  const willShow = storyEn.classList.contains("hidden");
  storyEn.classList.toggle("hidden");
  hintEn.classList.toggle("hidden");
  $("btn-translate-intro").textContent = willShow ? "\u65E5\u672C\u8A9E >" : "English >";
});
const ch101State = {
  lessonIndex: 0,
  sit2Turn: 1,
  selectedChoice: null,
  lastIsCorrect: true
};
function getCh101Lesson() {
  const data = window.CH1_DATA;
  if (!data || !data.lessons || !data.lessons.length) return null;
  const idx = Math.max(0, Math.min(ch101State.lessonIndex, data.lessons.length - 1));
  return data.lessons[idx];
}
function getCh101ProgressPct(stepInLesson) {
  const totalLessons = window.CH1_DATA && window.CH1_DATA.lessons.length || 1;
  const totalSteps = totalLessons * 4;
  const currentStep = ch101State.lessonIndex * 4 + stepInLesson;
  return Math.max(4, Math.min(100, Math.round(currentStep / totalSteps * 100)));
}
function renderCh101Intro() {
  const isEn = window.currentAppLang === "en";
  const guide = window.CH1_DATA && window.CH1_DATA.guide;
  if (!guide) return;
  const titleEl = $("ch101-intro-title");
  const subEl = $("ch101-intro-subtitle");
  const btnEl = $("btn-ch101-intro-next");
  if (titleEl) titleEl.textContent = isEn ? guide.titleEn : guide.titleJa;
  if (subEl) subEl.textContent = isEn ? guide.subtitleEn : guide.subtitleJa;
  if (btnEl) btnEl.textContent = isEn ? guide.buttonEn : guide.buttonJa;
}
function renderCh101Sit1() {
  const lesson = getCh101Lesson();
  if (!lesson) return;
  const isEn = window.currentAppLang === "en";
  const prog = $("ch101-sit1-progress");
  if (prog) prog.style.width = getCh101ProgressPct(1) + "%";
  const imgEl = $("ch101-sit1-img");
  if (imgEl) {
    imgEl.src = lesson.sceneImg;
    imgEl.alt = isEn ? lesson.titleEn : lesson.titleJa;
  }
  const metaEl = $("ch101-sit1-meta");
  if (metaEl) {
    const title = isEn ? lesson.titleEn : lesson.titleJa;
    metaEl.textContent = `${lesson.id}  \u2022  ${lesson.time}  \u2022  ${title}`;
  }
  const textEl = $("ch101-sit1-text");
  if (textEl) {
    const raw = isEn ? lesson.narrationEn : lesson.narrationJa;
    textEl.innerHTML = `<p>${devEscSafe(raw).replace(/\n/g, "<br>")}</p>`;
  }
}
function renderCh101Sit2() {
  const lesson = getCh101Lesson();
  if (!lesson) return;
  const isEn = window.currentAppLang === "en";
  const prog = $("ch101-sit2-progress");
  if (prog) prog.style.width = getCh101ProgressPct(2) + "%";
  const imgEl = $("ch101-sit2-img");
  if (imgEl) {
    imgEl.src = lesson.sceneImg;
    imgEl.alt = isEn ? lesson.titleEn : lesson.titleJa;
  }
  const textEl = $("ch101-sit2-text");
  if (!textEl) return;
  if (ch101State.sit2Turn === 1) {
    const speaker = isEn ? lesson.speakerEn : lesson.speakerJa;
    const line = isEn ? lesson.line1En : lesson.line1Ja;
    const speakerHtml = speaker ? `<p class="ch101-speaker-name">${devEscSafe(speaker)}${isEn ? ":" : "\uFF1A"}</p>` : "";
    textEl.innerHTML = `
      <div class="ch101-turn-badge">${isEn ? "SCENE 1 / 2" : "\u72B6\u6CC1 1 / 2"}</div>
      ${speakerHtml}
      <p style="margin-top: ${speaker ? "18px" : "8px"};">${devEscSafe(line).replace(/\n/g, "<br>")}</p>
    `;
  } else {
    const line2 = isEn ? lesson.line2En : lesson.line2Ja;
    textEl.innerHTML = `
      <div class="ch101-turn-badge is-shosa">${isEn ? "SHOSA TIP 2 / 2" : "SHOSA\u306E\u8996\u70B9 2 / 2"}</div>
      <div class="ch101-shosa-speaker-row">
        <img src="assets/images/mascot_shosa_face.png" alt="SHOSA" class="ch101-shosa-mini-avatar">
        <span class="ch101-speaker-name" style="color:#18A5B1;">SHOSA${isEn ? ":" : "\uFF1A"}</span>
      </div>
      <p style="margin-top: 14px;">${devEscSafe(line2).replace(/\n/g, "<br>")}</p>
    `;
  }
}
function renderCh101Question() {
  const lesson = getCh101Lesson();
  if (!lesson) return;
  const isEn = window.currentAppLang === "en";
  const prog = $("ch101-question-progress");
  if (prog) prog.style.width = getCh101ProgressPct(3) + "%";
  const imgEl = $("ch101-question-img");
  if (imgEl) {
    imgEl.src = lesson.sceneImg;
    imgEl.alt = isEn ? lesson.titleEn : lesson.titleJa;
  }
  const tagEl = $("ch101-question-tag");
  if (tagEl) tagEl.textContent = isEn ? lesson.situationTagEn : lesson.situationTagJa;
  const qEl = $("ch101-question-text");
  if (qEl) qEl.textContent = isEn ? lesson.questionEn : lesson.questionJa;
  const choiceAEl = $("ch101-choice-a-text");
  const choiceBEl = $("ch101-choice-b-text");
  if (choiceAEl) choiceAEl.textContent = isEn ? lesson.choiceAEn : lesson.choiceAJa;
  if (choiceBEl) choiceBEl.textContent = isEn ? lesson.choiceBEn : lesson.choiceBJa;
}
function renderCh101FocusModal() {
  const lesson = getCh101Lesson();
  if (!lesson) return;
  const isEn = window.currentAppLang === "en";
  const bodyEl = $("ch101-focus-body");
  if (bodyEl) {
    const rawText = isEn ? lesson.focusTextEn : lesson.focusTextJa;
    const sentences = isEn ? rawText.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [rawText] : rawText.split("\u3002").filter(Boolean).map((s) => s + "\u3002");
    if (sentences.length >= 3) {
      const mid = Math.ceil(sentences.length / 2);
      const p1 = sentences.slice(0, mid).join("").trim();
      const p2 = sentences.slice(mid).join("").trim();
      bodyEl.innerHTML = `<p class="ch101-focus-p">${devEscSafe(p1)}</p><p class="ch101-focus-p">${devEscSafe(p2)}</p>`;
    } else {
      bodyEl.innerHTML = `<p class="ch101-focus-p">${devEscSafe(rawText)}</p>`;
    }
  }
  const capEl = $("ch101-focus-caption");
  if (capEl) {
    if (lesson.id === "L01") {
      const dict = ONBOARDING_DATA.i18n && ONBOARDING_DATA.i18n[isEn ? "en" : "ja"];
      if (dict && dict.ch101_checklist_caption) {
        capEl.innerHTML = dict.ch101_checklist_caption;
      }
    } else {
      const lessonTitle = isEn ? lesson.titleEn : lesson.titleJa;
      const sitTag = isEn ? lesson.situationTagEn : lesson.focusImgCaptionJa || lesson.situationTagJa;
      capEl.innerHTML = `<span class="hl-purple">${devEscSafe(lessonTitle)}</span><br>${devEscSafe(sitTag)}`;
    }
  }
}
function renderCh101Result() {
  const lesson = getCh101Lesson();
  if (!lesson) return;
  const isEn = window.currentAppLang === "en";
  const common = window.CH1_DATA && window.CH1_DATA.common;
  const prog = $("ch101-result-progress");
  if (prog) prog.style.width = getCh101ProgressPct(4) + "%";
  const isCorrect = ch101State.selectedChoice === lesson.correct;
  ch101State.lastIsCorrect = isCorrect;
  const badgeEl = $("ch101-result-badge");
  const titleEl = $("ch101-result-title");
  if (badgeEl) {
    badgeEl.textContent = isCorrect ? "\u2714" : "\u2715";
    badgeEl.classList.toggle("is-incorrect", !isCorrect);
  }
  if (titleEl && common) {
    titleEl.textContent = isCorrect ? isEn ? common.correctEn : common.correctJa : isEn ? common.incorrectEn : common.incorrectJa;
  }
  const expEl = $("ch101-result-explanation");
  if (expEl) expEl.textContent = isEn ? lesson.reasonEn : lesson.reasonJa;
  const bubbleEl = $("ch101-result-bubble");
  if (bubbleEl) bubbleEl.textContent = isEn ? lesson.shosaPromptEn : lesson.shosaPromptJa;
  renderCh101FocusModal();
}
function loadCh101Lesson(idx) {
  const lessons = window.CH1_DATA && window.CH1_DATA.lessons || [];
  ch101State.lessonIndex = Math.max(0, Math.min(idx, Math.max(0, lessons.length - 1)));
  ch101State.sit2Turn = 1;
  ch101State.selectedChoice = null;
  renderCh101Sit1();
  showScreen("screen-ch101-sit1");
}
function renderActiveCh101Screen() {
  if (!$("screen-ch101-intro")?.classList.contains("hidden")) {
    renderCh101Intro();
  } else if (!$("screen-ch101-sit1")?.classList.contains("hidden")) {
    renderCh101Sit1();
  } else if (!$("screen-ch101-sit2")?.classList.contains("hidden")) {
    renderCh101Sit2();
  } else if (!$("screen-ch101-question")?.classList.contains("hidden")) {
    renderCh101Question();
  } else if (!$("screen-ch101-result")?.classList.contains("hidden")) {
    renderCh101Result();
  }
}
window.renderActiveCh101Screen = renderActiveCh101Screen;
function startChapter101() {
  state.dayIndex = 0;
  ch101State.lessonIndex = 0;
  ch101State.sit2Turn = 1;
  ch101State.selectedChoice = null;
  resetChapter101State();
  renderCh101Intro();
  showScreen("screen-ch101-intro");
}
function resetChapter101State() {
  ch101State.selectedChoice = null;
  const btnA = $("btn-ch101-choice-a");
  const btnB = $("btn-ch101-choice-b");
  if (btnA) btnA.classList.remove("selected");
  if (btnB) btnB.classList.remove("selected");
}
function initChapter101Events() {
  const introNextBtn = $("btn-ch101-intro-next");
  if (introNextBtn) {
    introNextBtn.addEventListener("click", () => {
      loadCh101Lesson(0);
    });
  }
  const sit1AdvanceBtn = $("btn-ch101-sit1-advance");
  if (sit1AdvanceBtn) {
    sit1AdvanceBtn.addEventListener("click", () => {
      ch101State.sit2Turn = 1;
      renderCh101Sit2();
      showScreen("screen-ch101-sit2");
    });
  }
  const sit2AdvanceBtn = $("btn-ch101-sit2-advance");
  if (sit2AdvanceBtn) {
    sit2AdvanceBtn.addEventListener("click", () => {
      if (ch101State.sit2Turn === 1) {
        ch101State.sit2Turn = 2;
        renderCh101Sit2();
      } else {
        resetChapter101State();
        renderCh101Question();
        showScreen("screen-ch101-question");
      }
    });
  }
  const choiceA = $("btn-ch101-choice-a");
  const choiceB = $("btn-ch101-choice-b");
  const handleChoice = (btn, choiceVal) => {
    if (choiceA) choiceA.classList.remove("selected");
    if (choiceB) choiceB.classList.remove("selected");
    btn.classList.add("selected");
    ch101State.selectedChoice = choiceVal;
    setTimeout(() => {
      renderCh101Result();
      showScreen("screen-ch101-result");
    }, 280);
  };
  if (choiceA) {
    choiceA.addEventListener("click", () => handleChoice(choiceA, "A"));
  }
  if (choiceB) {
    choiceB.addEventListener("click", () => handleChoice(choiceB, "B"));
  }
  const resultNextBtn = $("btn-ch101-result-next");
  if (resultNextBtn) {
    resultNextBtn.addEventListener("click", () => {
      const total = window.CH1_DATA && window.CH1_DATA.lessons.length || 1;
      if (ch101State.lessonIndex + 1 < total) {
        loadCh101Lesson(ch101State.lessonIndex + 1);
      } else {
        showScreen("screen-ch101-complete");
      }
    });
  }
  const focusBtn = $("btn-ch101-focus");
  const focusModal = $("modal-ch101-focus");
  const focusCloseBtn = $("btn-ch101-focus-modal-close");
  if (focusBtn && focusModal) {
    focusBtn.addEventListener("click", () => {
      renderCh101FocusModal();
      focusModal.classList.remove("hidden");
    });
  }
  if (focusCloseBtn && focusModal) {
    focusCloseBtn.addEventListener("click", () => {
      focusModal.classList.add("hidden");
    });
  }
  if (focusModal) {
    focusModal.addEventListener("click", (e) => {
      if (e.target === focusModal) {
        focusModal.classList.add("hidden");
      }
    });
  }
  const completeStartBtn = $("btn-ch101-complete-start");
  if (completeStartBtn) {
    completeStartBtn.addEventListener("click", () => {
      state.completedDays = Math.max(state.completedDays, 1);
      state.completedDaySet[0] = true;
      saveProgress();
      if (typeof loadHomeScreen === "function") {
        goTo(loadHomeScreen);
      } else {
        goTo(loadTitle);
      }
    });
  }
  ["btn-ch101-sit1-close", "btn-ch101-sit2-close", "btn-ch101-question-close", "btn-ch101-result-close"].forEach((btnId) => {
    const btn = $(btnId);
    if (btn) {
      btn.addEventListener("click", () => {
        const msg = window.currentAppLang === "en" ? "Exit this chapter and return to Home?" : "\u30C1\u30E3\u30D7\u30BF\u30FC\u306E\u9014\u4E2D\u3067\u7D42\u4E86\u3057\u3001\u30DB\u30FC\u30E0\u306B\u623B\u308A\u307E\u3059\u304B\uFF1F";
        if (confirm(msg)) {
          if (typeof loadHomeScreen === "function") {
            goTo(loadHomeScreen);
          } else {
            goTo(loadTitle);
          }
        }
      });
    }
  });
}
function setupMobileTouchLock() {
  document.addEventListener("gesturestart", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gesturechange", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("gestureend", (e) => e.preventDefault(), { passive: false });
  document.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });
  let lastTouchEnd = 0;
  document.addEventListener("touchend", (e) => {
    const target = e.target;
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      if (!target || !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        e.preventDefault();
      }
    }
    lastTouchEnd = now;
  }, { passive: false });
  window.addEventListener("wheel", (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  }, { passive: false });
}
window.addEventListener("DOMContentLoaded", () => {
  setupMobileTouchLock();
  initChapter101Events();
  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get("screen");
  if (screenParam === "ch101" || screenParam === "101") {
    goTo(startChapter101);
    return;
  }
  if (screenParam === "home" && typeof loadHomeScreen === "function") {
    goTo(loadHomeScreen);
    return;
  }
  if (screenParam === "profile" && typeof loadProfile1 === "function") {
    goTo(loadProfile1);
    return;
  }
  if (screenParam === "journey" && typeof loadJourney === "function") {
    goTo(loadJourney);
    return;
  }
  if (screenParam === "passport" && typeof finalizeOnboarding === "function") {
    goTo(finalizeOnboarding);
    return;
  }
  if (screenParam === "schedule-time" && typeof loadScheduleTime === "function") {
    goTo(loadScheduleTime);
    return;
  }
  if ((screenParam === "ch0-09" || screenParam === "hearing") && typeof loadHearing === "function") {
    const step = screenParam === "ch0-09" ? 1 : parseInt(params.get("step") || "0", 10);
    goTo(loadHearing, step);
    return;
  }
  if (screenParam === "langselect" && typeof loadLangSelect === "function") {
    goTo(loadLangSelect);
    return;
  }
  goTo(loadTitle);
});
