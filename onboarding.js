const PROFILE_KEY = "shosa_game_profile";
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
  }
}
const HEARING_KEY = "shosa_game_hearing_answers";
const APTITUDE_KEY = "shosa_game_aptitude_scores";
function loadSavedHearingAnswers() {
  try {
    const raw = localStorage.getItem(HEARING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveHearingAnswers(answers) {
  try {
    localStorage.setItem(HEARING_KEY, JSON.stringify(answers));
  } catch (e) {
  }
}
function isHearingComplete(answers) {
  return !!answers && ONBOARDING_DATA.hearings.every((h) => !!answers[h.key]);
}
function getAptitudeQuestionKey(q) {
  return q && q.id != null ? `q${q.id}` : q.dimension || "";
}
function getQuestionAptitudeScore(scores, q) {
  if (!scores) return void 0;
  const val = scores[getAptitudeQuestionKey(q)];
  return val != null ? val : void 0;
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
  try {
    localStorage.setItem(APTITUDE_KEY, JSON.stringify(scores));
  } catch (e) {
  }
}
function isAptitudeComplete(scores) {
  if (!scores) return false;
  const hasPerQuestionKeys = ONBOARDING_DATA.aptitudeQuestions.some((q) => scores[getAptitudeQuestionKey(q)] != null);
  if (hasPerQuestionKeys) {
    return ONBOARDING_DATA.aptitudeQuestions.every((q) => getQuestionAptitudeScore(scores, q) != null);
  }
  return ONBOARDING_DATA.aptitudeQuestions.every((q) => scores[q.dimension] != null);
}
function isProfileComplete(p) {
  return !!(p && p.gender && p.name && p.birthdate);
}
const SCHEDULE_KEY = "shosa_game_schedule";
function loadSavedSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function saveSchedule(schedule) {
  try {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  } catch (e) {
  }
}
function resetAllSavedData() {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(HEARING_KEY);
    localStorage.removeItem(APTITUDE_KEY);
    localStorage.removeItem(SCHEDULE_KEY);
    if (typeof PROGRESS_KEY !== "undefined") localStorage.removeItem(PROGRESS_KEY);
  } catch (e) {
  }
}
const obState = {
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
function loadStoryCover() {
  showScreen("screen-story-cover");
}
$("btn-story-cover-next").addEventListener("click", () => goTo(loadLangSelect));
function loadLangSelect() {
  const list = $("ob-lang-list");
  list.innerHTML = "";
  const nextBtn = $("btn-ob-langselect-next");
  nextBtn.textContent = "NEXT";
  if (!obState.languageSetting) {
    obState.languageSetting = "normal";
  }
  const flags = {
    normal: "assets/images/icon_flag_japan.png",
    english: "assets/images/icon_flag_usa.png"
  };
  ONBOARDING_DATA.languageOptions.forEach((opt) => {
    const isSelected = opt.id === obState.languageSetting;
    const card = document.createElement("div");
    card.className = "langselect-ticket-card" + (isSelected ? " selected" : "");
    card.dataset.id = opt.id;
    const flagSrc = flags[opt.id] || (opt.flag === "jp" ? "assets/images/icon_flag_japan.png" : "assets/images/icon_flag_usa.png");
    card.innerHTML = `
      <img src="${flagSrc}" alt="${opt.label}" class="ticket-flag-img">
      <span class="ticket-label">${opt.label}</span>
    `;
    card.addEventListener("click", () => {
      list.querySelectorAll(".langselect-ticket-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      obState.languageSetting = opt.id;
      const chosenLang = opt.id === "english" ? "en" : "ja";
      if (window.currentAppLang !== chosenLang) {
        window.currentAppLang = chosenLang;
        if (typeof applyAppLanguage === "function") applyAppLanguage(chosenLang);
      }
      nextBtn.disabled = false;
    });
    list.appendChild(card);
  });
  nextBtn.disabled = !obState.languageSetting;
  showScreen("screen-ob-langselect");
}
$("btn-ob-langselect-next").addEventListener("click", () => {
  const chosenLang = obState.languageSetting === "english" ? "en" : "ja";
  if (window.currentAppLang !== chosenLang) {
    window.currentAppLang = chosenLang;
    if (typeof applyAppLanguage === "function") applyAppLanguage(chosenLang);
  }
  goTo(loadIntroSlide, 0);
});
function loadIntroSlide(i) {
  obState.slideIndex = i;
  const slide = ONBOARDING_DATA.introSlides[i];
  const content = $("ob-intro-content");
  content.innerHTML = "";
  const isEn = window.currentAppLang === "en";
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
  const isWelcome = slide.type === "welcome";
  const backBtnHtml = isWelcome ? "" : `
    <button class="figma-header-back-btn" type="button" title="\u623B\u308B" aria-label="\u623B\u308B" onclick="goBack();">
      <img src="assets/images/btn_header_back.png" alt="\u623B\u308B" class="figma-header-back-icon">
    </button>`;
  const langLabel = isEn ? "JP" : "EN";
  const langBtnHtml = `
    <div class="intro-top-bar ${isWelcome ? "welcome-top-bar" : ""}">
      ${backBtnHtml}
      <button class="btn-en-toggle intro-lang-pill" type="button" title="Switch language / \u8A00\u8A9E\u5207\u308A\u66FF\u3048">
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
  if (slide.type === "welcome") {
    content.innerHTML = `
      <div class="intro-slide slide-welcome">
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
            <p class="intro-card-title">${title.replace(/\n/g, "<br>")}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-purple">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === "features") {
    const bodyLead = isEn && slide.bodyLeadEn ? slide.bodyLeadEn : slide.bodyLead;
    const bodySub = isEn && slide.bodySubEn ? slide.bodySubEn : slide.bodySub;
    const visualHtml = isEn && slide.featuresEn ? `<div class="intro-features-en-scene">
           <img src="assets/images/intro_slide_1_hero.png" alt="SHOSA Phone" class="intro-features-phone-en">
           <div class="intro-features-bubbles-grid">
             <div class="intro-feature-bubble">${devEscSafe(slide.featuresEn[0] || "")}</div>
             <div class="intro-feature-bubble">${devEscSafe(slide.featuresEn[1] || "")}</div>
             <div class="intro-feature-bubble">${devEscSafe(slide.featuresEn[2] || "")}</div>
             <div class="intro-feature-bubble">${devEscSafe(slide.featuresEn[3] || "")}</div>
           </div>
         </div>` : `<img src="${slide.heroImg}" alt="SHOSA Features" class="intro-features-img">`;
    content.innerHTML = `
      <div class="intro-slide slide-features">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, "<br>")}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            ${visualHtml}
          </div>
          <div class="intro-card-body">
            <p class="intro-body-lead">${bodyLead.replace(/\n/g, "<br>")}</p>
            <p class="intro-body-sub">${bodySub.replace(/\n/g, "<br>")}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === "steps") {
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;
    const stepIcons = ["\u{1F4F1}", "\u{1F6CE}\uFE0F", "\u270F\uFE0F", "\u{1F4CB}"];
    const visualStepsHtml = isEn && slide.stepsEn ? `<div class="intro-steps-en-card">
           ${slide.stepsEn.map((st, idx) => {
      const colonIdx = st.indexOf(":");
      const head = colonIdx > -1 ? st.slice(0, colonIdx) : "";
      const tail = colonIdx > -1 ? st.slice(colonIdx + 1).trim() : st;
      return `<div class="intro-step-en-row">
               <span class="intro-step-en-badge">${stepIcons[idx] || "\u2713"}</span>
               <span class="intro-step-en-text">${head ? `<strong>${devEscSafe(head)}</strong>: ` : ""}${devEscSafe(tail)}</span>
             </div>`;
    }).join("")}
         </div>` : `<img src="${slide.heroImg}" alt="SHOSA Steps" class="intro-steps-img">`;
    content.innerHTML = `
      <div class="intro-slide slide-steps">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, "<br>")}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap">
            ${visualStepsHtml}
          </div>
          <div class="intro-card-body">
            <p class="intro-body-sub" style="margin-top: 14px;">${desc.replace(/\n/g, "<br>")}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  } else if (slide.type === "certification") {
    const checkIconSvg = `<svg class="badge-check-svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2.5 8.5l3.5 3.5 7.5-7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const reportLead = isEn && slide.reportLeadEn ? slide.reportLeadEn : slide.reportLead;
    const badges = isEn && slide.badgesEn ? slide.badgesEn : slide.badges;
    const reportTail = isEn ? slide.reportTailEn || "" : slide.reportTail;
    const desc = isEn && slide.descEn ? slide.descEn : slide.desc;
    content.innerHTML = `
      <div class="intro-slide slide-certification">
        ${langBtnHtml}
        <div class="intro-top-header">
          <h2 class="intro-header-title">${title.replace(/\n/g, "<br>")}</h2>
          ${goldDividerSvg}
        </div>
        <div class="intro-arch-card">
          <div class="intro-visual-wrap ch06-report-wrap">
            <img src="${slide.heroImg}" alt="SHOSA Report" class="intro-report-img">
          </div>
          <div class="intro-card-body ch06-body">
            <p class="intro-report-lead">${reportLead}</p>
            <div class="intro-badges-row">
              ${badges.map((b) => `<span class="intro-badge-pill">${checkIconSvg} ${b}</span>`).join("")}
            </div>
            ${reportTail ? `<p class="intro-report-tail">${reportTail}</p>` : ""}
            <p class="intro-report-footer">${desc.replace(/\n/g, "<br>")}</p>
            <button id="btn-slide-action" class="intro-action-btn btn-turquoise">${buttonLabel}</button>
          </div>
        </div>
      </div>`;
  }
  const actionBtn = $("btn-slide-action");
  if (actionBtn) {
    actionBtn.addEventListener("click", () => {
      if (obState.slideIndex < ONBOARDING_DATA.introSlides.length - 1) {
        goTo(loadIntroSlide, obState.slideIndex + 1);
      } else {
        goTo(loadCharacterGreet);
      }
    });
  }
  showScreen("screen-ob-intro");
}
function loadCharacterGreet() {
  const isEn = window.currentAppLang === "en";
  const greetText = $("ob-greet-text");
  if (greetText) {
    greetText.innerHTML = isEn ? "Nice to meet you! I'm SHOSA.<br><br>To help you learn,<br>first tell me a little about yourself." : "\u306F\u3058\u3081\u307E\u3057\u3066\uFF01SHOSA\u3060\u3088\u3002<br><br>\u5B66\u7FD2\u3092\u30B5\u30DD\u30FC\u30C8\u3059\u308B\u305F\u3081\u306B<br>\u307E\u305A\u306F\u541B\u306E\u3053\u3068\u3092\u6559\u3048\u3066\u306D\u3002";
  }
  showScreen("screen-ob-character");
}
$("btn-ob-character-next").addEventListener("click", () => goTo(loadHearing, 0));
function loadHearing(i) {
  obState.hearingIndex = i;
  const h = ONBOARDING_DATA.hearings[i];
  const isEn = window.currentAppLang === "en";
  const total = ONBOARDING_DATA.hearings.length;
  const progressPercent = Math.round((i + 1) / total * 100);
  const fillBar = $("ob-hearing-progress-fill");
  if (fillBar) fillBar.style.width = progressPercent + "%";
  const qText = isEn && h.questionEn ? h.questionEn : h.question;
  const qEl = $("ob-hearing-question");
  if (qEl) qEl.innerHTML = devEscSafe(qText).replace(/\n/g, "<br>");
  const optWrap = $("ob-hearing-options");
  optWrap.innerHTML = "";
  optWrap.className = "frame248-options-list";
  const nextBtn = $("btn-ob-hearing-next");
  nextBtn.textContent = "NEXT";
  const currentAnswer = obState.answers[h.key];
  let hasValidAnswer = false;
  h.options.forEach((opt) => {
    const isObj = typeof opt === "object";
    const rawLabel = isObj ? opt.label : opt;
    const displayLabel = isObj ? isEn && opt.labelEn ? opt.labelEn : opt.label : opt;
    const optIcon = isObj && opt.icon ? opt.icon : "assets/images/icon_hotel.png";
    const hasInput = isObj && opt.hasInput;
    const isOther = hasInput || rawLabel === "\u305D\u306E\u4ED6";
    const isSelected = rawLabel === currentAnswer || isOther && typeof currentAnswer === "string" && currentAnswer.startsWith("\u305D\u306E\u4ED6");
    const card = document.createElement("div");
    card.className = "frame248-option-btn" + (isOther ? " frame248-option-other" : "") + (isSelected ? " selected" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    let otherInitialVal = "";
    if (isOther && isSelected && typeof currentAnswer === "string" && currentAnswer.startsWith("\u305D\u306E\u4ED6: ")) {
      otherInitialVal = currentAnswer.replace("\u305D\u306E\u4ED6: ", "");
    }
    card.innerHTML = `
      <div class="frame248-opt-row">
        <div class="frame248-opt-icon-wrap">
          <img src="${optIcon}" alt="" class="frame248-opt-icon">
        </div>
        <span class="frame248-opt-label">${devEscSafe(displayLabel)}</span>
      </div>
      ${isOther ? `
        <div class="frame248-other-input-wrap ${isSelected ? "" : "hidden"}">
          <textarea class="frame248-other-textarea" placeholder="${isEn ? "Please enter" : "\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"}" rows="3">${devEscSafe(otherInitialVal)}</textarea>
        </div>
      ` : ""}
    `;
    const optRow = card.querySelector(".frame248-opt-row");
    const textarea = card.querySelector(".frame248-other-textarea");
    if (isSelected) {
      if (isOther) {
        if (otherInitialVal.trim()) hasValidAnswer = true;
      } else {
        hasValidAnswer = true;
      }
    }
    const selectThisOption = () => {
      optWrap.querySelectorAll(".frame248-option-btn").forEach((b) => {
        b.classList.remove("selected");
        const inp = b.querySelector(".frame248-other-input-wrap");
        if (inp) inp.classList.add("hidden");
      });
      card.classList.add("selected");
      if (isOther) {
        const inpWrap = card.querySelector(".frame248-other-input-wrap");
        if (inpWrap) inpWrap.classList.remove("hidden");
        if (textarea) {
          textarea.focus();
          const val = textarea.value.trim();
          if (val) {
            obState.answers[h.key] = "\u305D\u306E\u4ED6: " + val;
            nextBtn.disabled = false;
          } else {
            obState.answers[h.key] = "\u305D\u306E\u4ED6";
            nextBtn.disabled = true;
          }
        }
      } else {
        obState.answers[h.key] = rawLabel;
        nextBtn.disabled = false;
      }
      saveHearingAnswers(obState.answers);
      if (h.key === "concern") renderHearingFollowup(rawLabel);
    };
    optRow.addEventListener("click", (e) => {
      e.stopPropagation();
      selectThisOption();
    });
    if (textarea) {
      textarea.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      textarea.addEventListener("input", () => {
        const val = textarea.value.trim();
        if (val) {
          obState.answers[h.key] = "\u305D\u306E\u4ED6: " + val;
          nextBtn.disabled = false;
        } else {
          obState.answers[h.key] = "\u305D\u306E\u4ED6";
          nextBtn.disabled = true;
        }
        saveHearingAnswers(obState.answers);
      });
    }
    optWrap.appendChild(card);
  });
  if (h.key === "concern" && currentAnswer) {
    renderHearingFollowup(currentAnswer);
  } else {
    renderHearingFollowup(null);
  }
  nextBtn.disabled = !hasValidAnswer;
  showScreen("screen-ob-hearing");
}
function renderHearingFollowup(concernKey) {
  const optWrap = $("ob-hearing-options");
  if (!optWrap) return;
  let noteEl = document.getElementById("ob-hearing-followup");
  const map = ONBOARDING_DATA.q4Followup;
  const entry = concernKey && map ? map[concernKey] : null;
  if (!entry) {
    if (noteEl) noteEl.remove();
    return;
  }
  const isEn = window.currentAppLang === "en";
  const msg = isEn ? entry.textEn : entry.textJa;
  if (!noteEl) {
    noteEl = document.createElement("div");
    noteEl.id = "ob-hearing-followup";
    noteEl.className = "frame248-followup-banner";
    optWrap.insertAdjacentElement("afterend", noteEl);
  }
  noteEl.innerHTML = `<span class="followup-icon">\u{1F4A1}</span><span>${devEscSafe(msg)}</span>`;
}
function devEscSafe(str) {
  if (str === void 0 || str === null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}
$("btn-ob-hearing-next").addEventListener("click", () => {
  if (obState.hearingIndex < ONBOARDING_DATA.hearings.length - 1) {
    goTo(loadHearing, obState.hearingIndex + 1);
  } else {
    saveHearingAnswers(obState.answers);
    goTo(loadScheduleTime);
  }
});
if ($("btn-ob-cheer-next")) {
  $("btn-ob-cheer-next").addEventListener("click", () => goTo(loadScheduleTime));
}
function loadAptitudeIntro() {
  showScreen("screen-ob-aptitude-intro");
}
$("btn-ob-aptitude-intro-next").addEventListener("click", () => goTo(loadAptitude));
const APTITUDE_PAGE_SIZE = 3;
function updateAptitudeProgress(pageIndex = 0) {
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const startIndex = pageIndex * APTITUDE_PAGE_SIZE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + APTITUDE_PAGE_SIZE);
  const totalAnswered = allQuestions.filter((q) => getQuestionAptitudeScore(obState.aptitudeScores, q) != null).length;
  const isEn = window.currentAppLang === "en";
  const progEl = $("ob-aptitude-progress");
  if (progEl) progEl.textContent = `${isEn ? "Aptitude Test" : "\u9069\u6027\u8A3A\u65AD"} ${totalAnswered}/${allQuestions.length}`;
  const fillEl = $("ob-aptitude-progress-fill");
  if (fillEl) fillEl.style.width = Math.round(totalAnswered / allQuestions.length * 100) + "%";
  const isPageComplete = currentQuestions.every((q) => getQuestionAptitudeScore(obState.aptitudeScores, q) != null);
  const nextBtn = $("btn-ob-aptitude-next");
  if (nextBtn) nextBtn.disabled = !isPageComplete;
}
function loadAptitude(pageIndex = 0) {
  obState.aptitudePageIndex = pageIndex;
  const allQuestions = ONBOARDING_DATA.aptitudeQuestions;
  const startIndex = pageIndex * APTITUDE_PAGE_SIZE;
  const currentQuestions = allQuestions.slice(startIndex, startIndex + APTITUDE_PAGE_SIZE);
  const isEn = window.currentAppLang === "en";
  const list = $("ob-aptitude-list");
  list.innerHTML = currentQuestions.map((q) => {
    const qText = isEn && q.textEn ? q.textEn : q.text;
    return `
      <div class="aptitude-block" data-question-id="${q.id}" data-dimension="${q.dimension}">
        <div class="ob-likert-question">${devEscSafe(qText).replace(/\n/g, "<br>")}</div>
        <div class="ob-likert-row" data-question-id="${q.id}" data-dimension="${q.dimension}">
          ${[1, 2, 3, 4, 5].map((v) => `<button type="button" class="ob-likert-btn val-${v}" data-value="${v}"></button>`).join("")}
        </div>
        <div class="ob-likert-labels">
          <span>${isEn ? "Disagree" : "\u305D\u3046\u601D\u308F\u306A\u3044"}</span>
          <span>${isEn ? "Agree" : "\u3068\u3066\u3082\u305D\u3046\u601D\u3046"}</span>
        </div>
      </div>`;
  }).join("");
  currentQuestions.forEach((q) => {
    const qKey = getAptitudeQuestionKey(q);
    const row = list.querySelector(`.ob-likert-row[data-question-id="${q.id}"]`);
    if (!row) return;
    const currentVal = getQuestionAptitudeScore(obState.aptitudeScores, q);
    row.querySelectorAll(".ob-likert-btn").forEach((btn) => {
      if (Number(btn.dataset.value) === currentVal) btn.classList.add("selected");
      btn.addEventListener("click", () => {
        row.querySelectorAll(".ob-likert-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        obState.aptitudeScores[qKey] = Number(btn.dataset.value);
        updateAptitudeProgress(pageIndex);
      });
    });
  });
  const scrollArea = document.querySelector(".ch14-scroll-area");
  if (scrollArea) scrollArea.scrollTop = 0;
  updateAptitudeProgress(pageIndex);
  showScreen("screen-ob-aptitude");
}
$("btn-ob-aptitude-next").addEventListener("click", () => {
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
  showScreen("screen-ob-passport");
}
function loadProfileIntro() {
  showScreen("screen-ob-profile-intro");
}
$("btn-ob-profile-intro-next").addEventListener("click", () => goTo(loadProfile1));
window.currentAppLang = window.currentAppLang || "ja";
function updateAllLangToggleButtons(lang) {
  const label = lang === "en" ? "JP" : "EN";
  const title = lang === "en" ? "Switch to Japanese / \u65E5\u672C\u8A9E\u306B\u5207\u308A\u66FF\u3048" : "Switch to English / \u82F1\u8A9E\u306B\u5207\u308A\u66FF\u3048";
  document.querySelectorAll(".btn-en-toggle, .intro-lang-pill").forEach((btn) => {
    btn.setAttribute("title", title);
    btn.setAttribute("aria-label", title);
    btn.classList.add("spinning");
    setTimeout(() => {
      btn.classList.remove("spinning");
    }, 380);
    const textEl = btn.querySelector(".lang-text");
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
  window.currentAppLang = window.currentAppLang === "ja" ? "en" : "ja";
  applyAppLanguage(window.currentAppLang);
}
function applyAppLanguage(lang) {
  const dict = ONBOARDING_DATA.i18n && ONBOARDING_DATA.i18n[lang];
  if (!dict) return;
  updateAllLangToggleButtons(lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) {
      el.innerHTML = dict[key];
    }
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    if (key && dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });
  const countrySelect = $("ob-country-input");
  if (countrySelect) {
    const countriesJa = {
      "\u65E5\u672C": "\u65E5\u672C",
      "\u30D9\u30C8\u30CA\u30E0": "\u30D9\u30C8\u30CA\u30E0",
      "\u30DF\u30E3\u30F3\u30DE\u30FC": "\u30DF\u30E3\u30F3\u30DE\u30FC",
      "\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB": "\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB",
      "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2": "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2",
      "\u30CD\u30D1\u30FC\u30EB": "\u30CD\u30D1\u30FC\u30EB",
      "\u30D5\u30A3\u30EA\u30D4\u30F3": "\u30D5\u30A3\u30EA\u30D4\u30F3",
      "\u30A4\u30F3\u30C9": "\u30A4\u30F3\u30C9",
      "\u4E2D\u56FD": "\u4E2D\u56FD",
      "\u97D3\u56FD": "\u97D3\u56FD",
      "\u305D\u306E\u4ED6": "\u305D\u306E\u4ED6"
    };
    const countriesEn = {
      "\u65E5\u672C": "Japan",
      "\u30D9\u30C8\u30CA\u30E0": "Vietnam",
      "\u30DF\u30E3\u30F3\u30DE\u30FC": "Myanmar",
      "\u30B7\u30F3\u30AC\u30DD\u30FC\u30EB": "Singapore",
      "\u30A4\u30F3\u30C9\u30CD\u30B7\u30A2": "Indonesia",
      "\u30CD\u30D1\u30FC\u30EB": "Nepal",
      "\u30D5\u30A3\u30EA\u30D4\u30F3": "Philippines",
      "\u30A4\u30F3\u30C9": "India",
      "\u4E2D\u56FD": "China",
      "\u97D3\u56FD": "South Korea",
      "\u305D\u306E\u4ED6": "Other"
    };
    const map = lang === "en" ? countriesEn : countriesJa;
    Array.from(countrySelect.options).forEach((opt) => {
      if (opt.value && map[opt.value]) opt.textContent = map[opt.value];
    });
  }
  const introScreen = $("screen-ob-intro");
  if (introScreen && !introScreen.classList.contains("hidden")) {
    loadIntroSlide(obState.slideIndex || 0);
  }
  const greetScreen = $("screen-ob-character");
  if (greetScreen && !greetScreen.classList.contains("hidden")) {
    loadCharacterGreet();
  }
  const hearingScreen = $("screen-ob-hearing");
  if (hearingScreen && !hearingScreen.classList.contains("hidden")) {
    loadHearing(obState.hearingIndex || 0);
  }
  const scheduleScreen = $("screen-ob-schedule-time");
  if (scheduleScreen && !scheduleScreen.classList.contains("hidden")) {
    loadScheduleTime();
  }
  const journeyScreen = $("screen-ob-journey");
  if (journeyScreen && !journeyScreen.classList.contains("hidden")) {
    renderJourneySteps();
  }
  const aptitudeScreen = $("screen-ob-aptitude");
  if (aptitudeScreen && !aptitudeScreen.classList.contains("hidden")) {
    loadAptitude(obState.aptitudePageIndex || 0);
  }
  const resultScreen = $("screen-ob-result");
  if (resultScreen && !resultScreen.classList.contains("hidden")) {
    updateDiagnosisResultModal();
  }
  if (typeof window.renderActiveCh101Screen === "function") {
    window.renderActiveCh101Screen();
  }
}
document.addEventListener("click", (e) => {
  const enBtn = e.target?.closest?.(".btn-en-toggle, .intro-lang-pill");
  if (enBtn) {
    e.preventDefault();
    toggleAppLanguage();
  }
});
function updateProfile1Validity() {
  const nameVal = $("ob-name-input").value.trim();
  const countryVal = $("ob-country-input").value;
  const birthVal = $("ob-birthdate-input").value;
  const isGenderChosen = !!obState.profile.gender;
  const isValid = isGenderChosen && nameVal.length > 0 && !!countryVal && !!birthVal;
  const nextBtn = $("btn-ob-profile1-next");
  if (nextBtn) nextBtn.disabled = !isValid;
}
function loadProfile1() {
  if (!obState.profile.gender) obState.profile.gender = "\u7537\u6027";
  const genderButtons = document.querySelectorAll("#ob-gender-row .figma-gender-btn");
  genderButtons.forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.value === obState.profile.gender);
  });
  const saved = loadSavedProfile();
  if (saved && !obState.profile.name) {
    obState.profile.name = saved.name || "";
    obState.profile.country = saved.country || "";
    obState.profile.birthdate = saved.birthdate || "";
    obState.profile.gender = saved.gender || obState.profile.gender;
  }
  $("ob-name-input").value = obState.profile.name || "";
  $("ob-country-input").value = obState.profile.country || "";
  $("ob-birthdate-input").value = obState.profile.birthdate || "2000-01-01";
  applyAppLanguage(window.currentAppLang || "ja");
  updateProfile1Validity();
  showScreen("screen-ob-profile1");
}
document.querySelectorAll("#ob-gender-row .figma-gender-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#ob-gender-row .figma-gender-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    obState.profile.gender = btn.dataset.value || null;
    updateProfile1Validity();
  });
});
$("ob-name-input").addEventListener("input", updateProfile1Validity);
$("ob-country-input").addEventListener("change", updateProfile1Validity);
$("ob-birthdate-input").addEventListener("change", updateProfile1Validity);
$("btn-ob-profile1-next").addEventListener("click", () => {
  obState.profile.name = $("ob-name-input").value.trim() || "SHOSA";
  obState.profile.country = $("ob-country-input").value || "\u65E5\u672C";
  obState.profile.birthdate = $("ob-birthdate-input").value || "2000-01-01";
  saveProfile(obState.profile);
  window.PLAYER_NAME = obState.profile.name;
  goTo(loadJourney);
});
function renderJourneySteps() {
  const list = $("ob-journey-list");
  if (!list) return;
  const isEn = window.currentAppLang === "en";
  const steps = [...ONBOARDING_DATA.journeySteps].reverse();
  list.innerHTML = steps.map((s) => {
    const title = isEn && s.titleEn ? s.titleEn : s.title;
    const desc = isEn && s.descEn ? s.descEn : s.desc;
    return `
      <div class="journey-step-row ${s.isOpen ? "is-open" : "is-locked"}">
        <div class="journey-dot-col">
          <div class="journey-dot ${s.isOpen ? "is-active" : ""}"></div>
        </div>
        <div class="journey-door-col">
          <img src="${s.doorImg}" alt="${s.doorNumber ? s.doorNumber + "\u30C9\u30A2" : "Open Door"}" class="journey-door-img">
        </div>
        <div class="journey-card-bubble">
          ${s.isLocked && s.lockImg ? `<img src="${s.lockImg}" alt="Locked" class="journey-card-lock">` : ""}
          <h3 class="journey-card-title">${title}</h3>
          <p class="journey-card-desc">${desc}</p>
        </div>
      </div>
    `;
  }).join("");
}
function loadJourney() {
  renderJourneySteps();
  showScreen("screen-ob-journey");
}
$("btn-ob-journey-next").addEventListener("click", () => goTo(loadAptitudeIntro));
function finalizeOnboarding() {
  showScreen("screen-ob-passport");
}
function getDimensionAptitudeScore(scores, dimension) {
  const dimQuestions = ONBOARDING_DATA.aptitudeQuestions.filter((q) => q.dimension === dimension);
  const values = dimQuestions.map((q) => getQuestionAptitudeScore(scores, q)).filter((v) => v != null);
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
  roleKeys.forEach((key) => {
    const r = roles[key];
    const sum = (r.traits || []).reduce((acc, t) => acc + getDimensionAptitudeScore(scores, t), 0);
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
  const isEn = window.currentAppLang === "en";
  const jobNameEl = document.querySelector(".result-job-name");
  const jobScoreEl = document.querySelector(".result-job-score");
  const avatarEl = document.querySelector(".result-job-avatar");
  const listEl = document.querySelector(".strengths-list");
  if (jobNameEl) jobNameEl.textContent = isEn ? role.nameEn : role.nameJa;
  if (jobScoreEl) {
    jobScoreEl.textContent = String(role.score || "95").replace("%", "");
  }
  if (avatarEl && role.icon) {
    avatarEl.src = role.icon;
  }
  if (listEl) {
    const strengths = isEn ? role.strengthsEn : role.strengthsJa;
    listEl.innerHTML = strengths.map((s) => `
      <li class="ch20-strength-item">
        <span class="ch20-st-star">\u2605</span>
        <div class="ch20-st-text">
          <span class="ch20-st-desc">${devEscSafe(s).replace(/^・/, "")}</span>
        </div>
      </li>
    `).join("");
  }
}
function loadDiagnosisResult() {
  updateDiagnosisResultModal();
  showScreen("screen-ob-result");
}
$("btn-ob-view-result").addEventListener("click", () => {
  goTo(loadDiagnosisResult);
});
if ($("btn-result-proceed")) {
  $("btn-result-proceed").addEventListener("click", () => {
    goTo(startGame);
  });
}
if ($("btn-result-modal-proceed")) {
  $("btn-result-modal-proceed").addEventListener("click", () => {
    goTo(startGame);
  });
}
let selectedHour = "10";
let selectedMinute = "30";
function initTimeWheelColumns() {
  const hoursCol = $("wheel-hours");
  const minsCol = $("wheel-minutes");
  if (!hoursCol || !minsCol) return;
  hoursCol.innerHTML = "";
  for (let h = 0; h < 24; h++) {
    const span = document.createElement("span");
    span.className = "wheel-item" + (String(h) === String(parseInt(selectedHour, 10)) ? " active" : "");
    span.dataset.val = String(h);
    span.textContent = String(h);
    span.addEventListener("click", () => {
      scrollToWheelValue(hoursCol, h, 40);
    });
    hoursCol.appendChild(span);
  }
  minsCol.innerHTML = "";
  for (let m = 0; m < 60; m++) {
    const span = document.createElement("span");
    const mStr = String(m).padStart(2, "0");
    span.className = "wheel-item" + (mStr === selectedMinute ? " active" : "");
    span.dataset.val = mStr;
    span.textContent = mStr;
    span.addEventListener("click", () => {
      scrollToWheelValue(minsCol, m, 40);
    });
    minsCol.appendChild(span);
  }
  let hourScrollTimer = null;
  hoursCol.addEventListener("scroll", () => {
    clearTimeout(hourScrollTimer);
    hourScrollTimer = setTimeout(() => {
      const idx = Math.round(hoursCol.scrollTop / 40);
      const clamped = Math.max(0, Math.min(23, idx));
      updateActiveWheelItem(hoursCol, clamped);
      selectedHour = String(clamped);
    }, 60);
  });
  let minScrollTimer = null;
  minsCol.addEventListener("scroll", () => {
    clearTimeout(minScrollTimer);
    minScrollTimer = setTimeout(() => {
      const idx = Math.round(minsCol.scrollTop / 40);
      const clamped = Math.max(0, Math.min(59, idx));
      updateActiveWheelItem(minsCol, clamped);
      selectedMinute = String(clamped).padStart(2, "0");
    }, 60);
  });
}
function scrollToWheelValue(col, index, itemHeight = 40) {
  col.scrollTo({ top: index * itemHeight, behavior: "smooth" });
  updateActiveWheelItem(col, index);
}
function updateActiveWheelItem(col, activeIndex) {
  const items = col.querySelectorAll(".wheel-item");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === activeIndex);
  });
}
function openTimeWheelModal() {
  const modal = $("modal-time-wheel");
  if (!modal) return;
  const currentVal = obState.schedule && obState.schedule.notifyTime || $("ob-schedule-notify-time")?.value || "10:30";
  const parts = currentVal.split(":");
  selectedHour = parts[0] || "10";
  selectedMinute = parts[1] || "30";
  initTimeWheelColumns();
  modal.classList.remove("hidden");
  setTimeout(() => {
    const hoursCol = $("wheel-hours");
    const minsCol = $("wheel-minutes");
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
if ($("btn-open-time-wheel")) {
  $("btn-open-time-wheel").addEventListener("click", (e) => {
    e.preventDefault();
    openTimeWheelModal();
  });
}
if ($("btn-close-time-wheel")) {
  $("btn-close-time-wheel").addEventListener("click", () => {
    $("modal-time-wheel")?.classList.add("hidden");
  });
}
if ($("modal-time-wheel")) {
  $("modal-time-wheel").addEventListener("click", (e) => {
    if (e.target === $("modal-time-wheel")) {
      $("modal-time-wheel")?.classList.add("hidden");
    }
  });
}
if ($("btn-submit-time-wheel")) {
  $("btn-submit-time-wheel").addEventListener("click", () => {
    const formatted = `${selectedHour}:${selectedMinute}`;
    if ($("ob-schedule-notify-time")) $("ob-schedule-notify-time").value = formatted;
    if ($("ob-schedule-notify-time-display")) $("ob-schedule-notify-time-display").textContent = formatted;
    if (obState.schedule) obState.schedule.notifyTime = formatted;
    $("modal-time-wheel")?.classList.add("hidden");
  });
}
function loadScheduleTime() {
  const optWrap = $("ob-schedule-time-options");
  optWrap.innerHTML = "";
  const nextBtn = $("btn-ob-schedule-time-next");
  nextBtn.textContent = "NEXT";
  ONBOARDING_DATA.scheduleTimeOptions.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "schedule-time-card" + (opt.id === obState.schedule.preferredTime ? " selected" : "");
    btn.type = "button";
    btn.dataset.id = opt.id;
    const displayLabel = window.currentAppLang === "en" && ONBOARDING_DATA.i18n && ONBOARDING_DATA.i18n.en["schedule_" + opt.id] ? ONBOARDING_DATA.i18n.en["schedule_" + opt.id] : opt.label;
    btn.innerHTML = `
      <div class="schedule-time-icon-wrap">
        <img src="${opt.icon}" alt="${displayLabel}" class="schedule-time-icon-img">
      </div>
      <span class="schedule-time-label">${devEscSafe(displayLabel)}</span>
    `;
    btn.addEventListener("click", () => {
      optWrap.querySelectorAll(".schedule-time-card").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      obState.schedule.preferredTime = opt.id;
      nextBtn.disabled = false;
    });
    optWrap.appendChild(btn);
  });
  const notifyTime = obState.schedule.notifyTime || "10:30";
  if ($("ob-schedule-notify-time")) $("ob-schedule-notify-time").value = notifyTime;
  if ($("ob-schedule-notify-time-display")) $("ob-schedule-notify-time-display").textContent = notifyTime;
  if ($("ob-schedule-notify-toggle")) $("ob-schedule-notify-toggle").checked = obState.schedule.notifyEnabled ?? true;
  nextBtn.disabled = !obState.schedule.preferredTime;
  showScreen("screen-ob-schedule-time");
}
if ($("ob-schedule-notify-time")) {
  $("ob-schedule-notify-time").addEventListener("change", () => {
    if (obState.schedule) obState.schedule.notifyTime = $("ob-schedule-notify-time").value;
    if ($("ob-schedule-notify-time-display")) $("ob-schedule-notify-time-display").textContent = $("ob-schedule-notify-time").value;
  });
}
if ($("ob-schedule-notify-toggle")) {
  $("ob-schedule-notify-toggle").addEventListener("change", () => {
    if (obState.schedule) obState.schedule.notifyEnabled = $("ob-schedule-notify-toggle").checked;
  });
}
$("btn-ob-schedule-time-next").addEventListener("click", () => {
  saveSchedule(obState.schedule);
  goTo(loadProfileIntro);
});
$("btn-open-settings").addEventListener("click", () => goTo(loadSettings));
function loadSettings() {
  document.querySelectorAll("#settings-gender-row .ob-pill").forEach((p) => {
    p.classList.toggle("selected", p.dataset.value === obState.profile.gender);
  });
  $("settings-name-input").value = obState.profile.name || "";
  $("settings-birthdate-input").value = obState.profile.birthdate || "";
  const grid = $("settings-avatar-grid");
  grid.innerHTML = "";
  const avatarGroup = grid.closest(".ob-form-group");
  if (avatarGroup) {
    avatarGroup.classList.toggle("hidden", ONBOARDING_DATA.avatarOptions.length === 0);
  }
  ONBOARDING_DATA.avatarOptions.forEach((av) => {
    const cell = document.createElement("div");
    cell.className = "ob-avatar-cell" + (av.path === obState.profile.avatar ? " selected" : "");
    renderAvatar(cell, av.path);
    cell.dataset.path = av.path;
    cell.addEventListener("click", () => {
      grid.querySelectorAll(".ob-avatar-cell").forEach((c) => c.classList.remove("selected"));
      cell.classList.add("selected");
      validateSettings();
    });
    grid.appendChild(cell);
  });
  document.querySelectorAll("#settings-voice-row .ob-voice-btn").forEach((b) => {
    b.classList.toggle("selected", b.dataset.value === obState.profile.voiceType);
  });
  validateSettings();
  showScreen("screen-settings");
}
function validateSettings() {
  const genderOk = document.querySelector("#settings-gender-row .ob-pill.selected");
  const avatarRequired = ONBOARDING_DATA.avatarOptions.length > 0;
  const avatarOk = !avatarRequired || !!document.querySelector("#settings-avatar-grid .ob-avatar-cell.selected");
  const ok = genderOk && avatarOk && $("settings-name-input").value.trim().length > 0 && $("settings-birthdate-input").value;
  $("btn-settings-save").disabled = !ok;
}
document.querySelectorAll("#settings-gender-row .ob-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll("#settings-gender-row .ob-pill").forEach((p) => p.classList.remove("selected"));
    pill.classList.add("selected");
    validateSettings();
  });
});
document.querySelectorAll("#settings-voice-row .ob-voice-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#settings-voice-row .ob-voice-btn").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});
$("settings-name-input").addEventListener("input", validateSettings);
$("settings-birthdate-input").addEventListener("change", validateSettings);
$("btn-settings-voice-sample").addEventListener("click", () => {
  if (!("speechSynthesis" in window)) return;
  const name = $("settings-name-input").value.trim() || "\u30B2\u30B9\u30C8";
  const selectedVoiceBtn = document.querySelector("#settings-voice-row .ob-voice-btn.selected");
  const voiceTypeId = selectedVoiceBtn ? selectedVoiceBtn.dataset.value : "A";
  const utter = new SpeechSynthesisUtterance(`\u3053\u3093\u306B\u3061\u306F\u3001${name}\u3067\u3059\u3002\u3088\u308D\u3057\u304F\u304A\u9858\u3044\u3057\u307E\u3059\u3002`);
  utter.lang = "ja-JP";
  const voiceType = ONBOARDING_DATA.voiceTypes.find((v) => v.id === voiceTypeId);
  if (voiceType) {
    utter.rate = voiceType.rate;
    utter.pitch = voiceType.pitch;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
});
$("btn-settings-save").addEventListener("click", () => {
  const genderBtn = document.querySelector("#settings-gender-row .ob-pill.selected");
  const avatarCell = document.querySelector("#settings-avatar-grid .ob-avatar-cell.selected");
  const voiceBtn = document.querySelector("#settings-voice-row .ob-voice-btn.selected");
  obState.profile.gender = genderBtn ? genderBtn.dataset.value : obState.profile.gender;
  obState.profile.name = $("settings-name-input").value.trim();
  obState.profile.birthdate = $("settings-birthdate-input").value;
  obState.profile.avatar = avatarCell ? avatarCell.dataset.path : obState.profile.avatar;
  obState.profile.voiceType = voiceBtn ? voiceBtn.dataset.value : obState.profile.voiceType;
  saveProfile(obState.profile);
  window.PLAYER_NAME = obState.profile.name;
  window.PLAYER_AVATAR = obState.profile.avatar;
  const updatedProfile = { ...obState.profile };
  patchHistoryObState((os) => {
    os.profile = { ...updatedProfile };
  });
  if (typeof updateHeader === "function") updateHeader();
  goBack();
});
$("btn-settings-cancel").addEventListener("click", () => goBack());
$("btn-settings-retake-hearing").addEventListener("click", () => goTo(loadHearing, 0));
$("btn-settings-retake-aptitude").addEventListener("click", () => goTo(loadAptitudeIntro));
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
  obState.profile = savedProfile ? { ...savedProfile } : { gender: null, name: "", country: "", birthdate: "", avatar: null, voiceType: "A" };
  obState.schedule = savedSchedule ? { ...obState.schedule, ...savedSchedule } : {
    preferredTime: null,
    notifyTime: "10:30",
    notifyEnabled: true,
    lessonsPerDay: 1,
    days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    streakGoal: null
  };
  loadLangSelect();
}
function renderAvatarHtml(avatar) {
  if (!avatar) return "\u{1F642}";
  if (avatar.endsWith(".jpg") || avatar.endsWith(".png") || avatar.endsWith(".svg")) {
    return `<img src="${avatar}" alt="" style="width:100%;height:100%;object-fit:cover;">`;
  }
  return `<span>${avatar}</span>`;
}
