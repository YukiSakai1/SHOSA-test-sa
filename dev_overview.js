function devEsc(str) {
  if (str === void 0 || str === null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}
const QUALITY_LABEL = { best: "BEST", okay: "OKAY", bad: "BAD" };
function renderDevBranch(choice) {
  return `
    <div class="dev-branch quality-${choice.quality}">
      <div class="dev-branch-title">${QUALITY_LABEL[choice.quality] || choice.quality} \u30FB ${choice.points}pt</div>
      <div><strong>\u9078\u629E\u80A2:</strong> ${devEsc(choice.label)}</div>
      <div style="margin-top:6px;"><strong>Feedback:</strong> ${devEsc(choice.feedback)}</div>
      ${choice.feedback_en ? `<div class="dev-en">EN: ${devEsc(choice.feedback_en)}</div>` : ""}
      <div class="dev-branch-deltas">
        \u0394team:${choice.teamDelta >= 0 ? "+" : ""}${choice.teamDelta}
        \u3000\u0394guest:${choice.guestDelta >= 0 ? "+" : ""}${choice.guestDelta}
        \u3000\u0394gauge:${choice.gaugeDelta >= 0 ? "+" : ""}${choice.gaugeDelta}
      </div>
    </div>`;
}
function renderDevDay(day, index) {
  const choices = day.question.choices.map(renderDevBranch).join("");
  return `
    <details class="dev-day-card" open>
      <summary>
        <span>${devEsc(day.dayTitle)}</span>
        <span class="dev-day-meta">${devEsc(day.timeLabel)} \uFF0F NPC: ${devEsc(day.npc.name)} \uFF0F Gauge: ${devEsc(day.gaugeLabel)}</span>
      </summary>
      <div class="dev-day-body">

        <div class="dev-node">
          <div class="dev-node-label">\u2460 Event Intro\uFF08\u767B\u5834\u30FB\u72B6\u6CC1\u8AAC\u660E\uFF09</div>
          <div class="dev-node-body">
            <div><strong>Story:</strong> ${devEsc(day.story)}</div>
            ${day.story_en ? `<div class="dev-en">EN: ${devEsc(day.story_en)}</div>` : ""}
            <div style="margin-top:6px;"><strong>Hint:</strong> ${devEsc(day.hint)}</div>
            ${day.hint_en ? `<div class="dev-en">EN: ${devEsc(day.hint_en)}</div>` : ""}
          </div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2461 Dialogue\uFF08NPC\u3068\u306E\u4F1A\u8A71\uFF09</div>
          <div class="dev-node-body">
            <div>${devEsc(day.dialogueText)}</div>
            ${day.dialogueText_en ? `<div class="dev-en">EN: ${devEsc(day.dialogueText_en)}</div>` : ""}
          </div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2462 Question\uFF08\u5206\u5C90\u9078\u629E\uFF09</div>
          <div class="dev-node-body">
            <div>${devEsc(day.question.text)}</div>
            ${day.question.textEn ? `<div class="dev-en">EN: ${devEsc(day.question.textEn)}</div>` : ""}
          </div>
        </div>
        <div class="dev-arrow">\u2193\u3000\uFF08${day.question.choices.length}\u5206\u5C90\uFF09</div>

        <div class="dev-branches">${choices}</div>
        <div class="dev-arrow">\u2193\u3000\uFF08\u5206\u5C90\u306F\u9078\u3093\u3060\u5185\u5BB9\u306B\u304B\u304B\u308F\u3089\u305A\u3053\u3053\u3067\u5408\u6D41\uFF09</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2463 Explanation\uFF08\u89E3\u8AAC\uFF1A${devEsc(day.explanation.lessonNo)}\uFF09</div>
          <div class="dev-node-body">
            <div><strong>${devEsc(day.explanation.title)}</strong></div>
            <div style="margin-top:6px;">${day.explanation.body}</div>
            ${day.explanation.body_en ? `<div class="dev-en" style="margin-top:6px;">EN: ${day.explanation.body_en}</div>` : ""}
          </div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2464 Voice Practice\uFF08\u767A\u97F3\u7DF4\u7FD2\uFF09</div>
          <div class="dev-node-body">
            <div>${devEsc(day.voice.script)}</div>
            ${day.voice.script_en ? `<div class="dev-en">EN: ${devEsc(day.voice.script_en)}</div>` : ""}
          </div>
        </div>
        <div class="dev-arrow">\u2193</div>
        <div class="dev-node">
          <div class="dev-node-label">\u2465 Day Summary\uFF08\u2605\u8A55\u4FA1 \u2192 \u6B21\u306EDay\u3078\uFF09</div>
          <div class="dev-node-body">${devEsc(day.daySummaryDesc)}</div>
        </div>
      </div>
    </details>`;
}
function renderDevOnboarding() {
  const introSlides = ONBOARDING_DATA.introSlides.map(
    (s, i) => `<div class="dev-chip">#${i + 1} [${devEsc(s.type)}] ${devEsc(s.title || "").replace(/\n/g, " ")}</div>`
  ).join("");
  const hearings = ONBOARDING_DATA.hearings.map((h) => `
    <div class="dev-node">
      <div class="dev-node-label">${devEsc(h.label)}\uFF08key: ${devEsc(h.key)}\uFF09</div>
      <div class="dev-node-body">
        <div>${devEsc(h.question)}</div>
        <div class="dev-hearing-row">${h.options.map((o) => `<div class="dev-chip">${devEsc(o)}</div>`).join("")}</div>
      </div>
    </div>`).join('<div class="dev-arrow">\u2193</div>');
  const aptitude = ONBOARDING_DATA.aptitudeQuestions.map(
    (q) => `<div class="dev-chip">[${devEsc(q.dimension)}] ${devEsc(q.text)}</div>`
  ).join("");
  const languageOptions = ONBOARDING_DATA.languageOptions.map(
    (o) => `<div class="dev-chip">${devEsc(o.icon)} ${devEsc(o.label)}</div>`
  ).join("");
  const avatarCount = ONBOARDING_DATA.avatarOptions.length;
  return `
    <details class="dev-day-card" open>
      <summary>
        <span>0\u7AE0: \u767B\u9332\u958B\u59CB \u301C SHOSA\u30D1\u30B9\u30DD\u30FC\u30C8\u5B8C\u6210</span>
        <span class="dev-day-meta">\u516811\u30B9\u30C6\u30C3\u30D7\uFF08\u30AA\u30F3\u30DC\u30FC\u30C7\u30A3\u30F3\u30B0\uFF09</span>
      </summary>
      <div class="dev-day-body">

        <div class="dev-node">
          <div class="dev-node-label">\u2460 \u767B\u9332\u958B\u59CB \u2192 \u8A00\u8A9E\u8A2D\u5B9A\u9078\u629E</div>
          <div class="dev-node-body">
            \u30DB\u30C6\u30EB\u30B9\u30BF\u30C3\u30D5\u4F53\u9A13\uFF08\u5C0E\u5165\u30AB\u30D0\u30FC\uFF09\u2192 \u8A00\u8A9E\u8A2D\u5B9A\u9078\u629E
            <div class="dev-hearing-row">${languageOptions}</div>
          </div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2461 \u30AD\u30E3\u30E9\u30AF\u30BF\u30FC\u7D39\u4ECB\u30AB\u30EB\u30FC\u30BB\u30EB\uFF08${ONBOARDING_DATA.introSlides.length}\u679A\uFF09+ AI\u30C1\u30E5\u30FC\u30BF\u30FC\u6328\u62F6</div>
          <div class="dev-node-body"><div class="dev-hearing-row">${introSlides}</div></div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node-label" style="margin-left:2px;">\u2462\u301C\u2465 \u30D2\u30A2\u30EA\u30F3\u30B0\uFF08\u5168${ONBOARDING_DATA.hearings.length}\u554F\uFF09</div>
        ${hearings}
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2466 \u9069\u6027\u8A3A\u65AD\uFF085\u6BB5\u968E\u8A55\u4FA1 \xD7 ${ONBOARDING_DATA.aptitudeQuestions.length}\u554F\uFF09</div>
          <div class="dev-node-body"><div class="dev-hearing-row">${aptitude}</div></div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2467\u2468 \u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u5165\u529B01\u30FB02</div>
          <div class="dev-node-body">\u6027\u5225\uFF0F\u540D\u524D\uFF0F\u751F\u5E74\u6708\u65E5 \u2192 \u30A2\u30D0\u30BF\u30FC\uFF08${avatarCount}\u7A2E\uFF09\uFF0F\u97F3\u58F0\u30BF\u30A4\u30D7\uFF08${ONBOARDING_DATA.voiceTypes.length}\u7A2E\uFF09</div>
        </div>
        <div class="dev-arrow">\u2193</div>

        <div class="dev-node">
          <div class="dev-node-label">\u2469 SHOSA\u30D1\u30B9\u30DD\u30FC\u30C8\u5B8C\u6210</div>
          <div class="dev-node-body">\u9069\u6027\u8A3A\u65AD5\u9805\u76EE\uFF08Communication / Observation / Accuracy / Judgement / Hospitality\uFF09\u3092\u30B9\u30BF\u30FC\u8868\u793A \u2192 \u672C\u7DE8Day1\u3078</div>
        </div>
      </div>
    </details>`;
}
function renderDevOverview() {
  const dayCards = GAME_DATA.days.map(renderDevDay).join("");
  $("dev-overview-content").innerHTML = `
    <div class="dev-section-title">0\u7AE0\uFF08\u30AA\u30F3\u30DC\u30FC\u30C7\u30A3\u30F3\u30B0\uFF09</div>
    ${renderDevOnboarding()}
    <div class="dev-section-title">\u30B2\u30FC\u30E0\u672C\u7DE8\uFF08DAY1\u301C${GAME_DATA.days.length}\uFF09</div>
    ${dayCards}
  `;
}
$("btn-open-dev-overview").addEventListener("click", () => {
  renderDevOverview();
  $("dev-overview").classList.remove("hidden");
});
$("btn-close-dev-overview").addEventListener("click", () => {
  $("dev-overview").classList.add("hidden");
});
