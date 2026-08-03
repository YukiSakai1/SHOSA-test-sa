/* =========================================================
   DEVELOPER OVERVIEW
   game_data.js / onboarding_data.js の内容をそのまま読み取って、
   全Day・全分岐・0章の内部イベントを俯瞰表示する開発者用ツール。
   ゲームの状態（state / obState）には一切影響しない、読み取り専用の
   オーバーレイなので、既存の goTo() 履歴システムの外側で単純に
   表示/非表示を切り替えるだけで動く。
   ========================================================= */

function devEsc(str) {
  if (str === undefined || str === null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

const QUALITY_LABEL = { best: 'BEST', okay: 'OKAY', bad: 'BAD' };

function renderDevBranch(choice) {
  return `
    <div class="dev-branch quality-${choice.quality}">
      <div class="dev-branch-title">${QUALITY_LABEL[choice.quality] || choice.quality} ・ ${choice.points}pt</div>
      <div><strong>選択肢:</strong> ${devEsc(choice.label)}</div>
      <div style="margin-top:6px;"><strong>Feedback:</strong> ${devEsc(choice.feedback)}</div>
      ${choice.feedback_en ? `<div class="dev-en">EN: ${devEsc(choice.feedback_en)}</div>` : ''}
      <div class="dev-branch-deltas">
        Δteam:${choice.teamDelta >= 0 ? '+' : ''}${choice.teamDelta}
        　Δguest:${choice.guestDelta >= 0 ? '+' : ''}${choice.guestDelta}
        　Δgauge:${choice.gaugeDelta >= 0 ? '+' : ''}${choice.gaugeDelta}
      </div>
    </div>`;
}

function renderDevDay(day, index) {
  const choices = day.question.choices.map(renderDevBranch).join('');
  return `
    <details class="dev-day-card" open>
      <summary>
        <span>${devEsc(day.dayTitle)}</span>
        <span class="dev-day-meta">${devEsc(day.timeLabel)} ／ NPC: ${devEsc(day.npc.name)} ／ Gauge: ${devEsc(day.gaugeLabel)}</span>
      </summary>
      <div class="dev-day-body">

        <div class="dev-node">
          <div class="dev-node-label">① Event Intro（登場・状況説明）</div>
          <div class="dev-node-body">
            <div><strong>Story:</strong> ${devEsc(day.story)}</div>
            ${day.story_en ? `<div class="dev-en">EN: ${devEsc(day.story_en)}</div>` : ''}
            <div style="margin-top:6px;"><strong>Hint:</strong> ${devEsc(day.hint)}</div>
            ${day.hint_en ? `<div class="dev-en">EN: ${devEsc(day.hint_en)}</div>` : ''}
          </div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">② Dialogue（NPCとの会話）</div>
          <div class="dev-node-body">
            <div>${devEsc(day.dialogueText)}</div>
            ${day.dialogueText_en ? `<div class="dev-en">EN: ${devEsc(day.dialogueText_en)}</div>` : ''}
          </div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">③ Question（分岐選択）</div>
          <div class="dev-node-body">
            <div>${devEsc(day.question.text)}</div>
            ${day.question.textEn ? `<div class="dev-en">EN: ${devEsc(day.question.textEn)}</div>` : ''}
          </div>
        </div>
        <div class="dev-arrow">↓　（${day.question.choices.length}分岐）</div>

        <div class="dev-branches">${choices}</div>
        <div class="dev-arrow">↓　（分岐は選んだ内容にかかわらずここで合流）</div>

        <div class="dev-node">
          <div class="dev-node-label">④ Explanation（解説：${devEsc(day.explanation.lessonNo)}）</div>
          <div class="dev-node-body">
            <div><strong>${devEsc(day.explanation.title)}</strong></div>
            <div style="margin-top:6px;">${day.explanation.body}</div>
            ${day.explanation.body_en ? `<div class="dev-en" style="margin-top:6px;">EN: ${day.explanation.body_en}</div>` : ''}
          </div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">⑤ Voice Practice（発音練習）</div>
          <div class="dev-node-body">
            <div>${devEsc(day.voice.script)}</div>
            ${day.voice.script_en ? `<div class="dev-en">EN: ${devEsc(day.voice.script_en)}</div>` : ''}
          </div>
        </div>
        <div class="dev-arrow">↓</div>
        <div class="dev-node">
          <div class="dev-node-label">⑥ Day Summary（★評価 → 次のDayへ）</div>
          <div class="dev-node-body">${devEsc(day.daySummaryDesc)}</div>
        </div>
      </div>
    </details>`;
}

function renderDevOnboarding() {
  const introSlides = ONBOARDING_DATA.introSlides.map((s, i) =>
    `<div class="dev-chip">#${i + 1} [${devEsc(s.type)}] ${devEsc(s.title || '').replace(/\n/g, ' ')}</div>`
  ).join('');

  const hearings = ONBOARDING_DATA.hearings.map(h => `
    <div class="dev-node">
      <div class="dev-node-label">${devEsc(h.label)}（key: ${devEsc(h.key)}）</div>
      <div class="dev-node-body">
        <div>${devEsc(h.question)}</div>
        <div class="dev-hearing-row">${h.options.map(o => `<div class="dev-chip">${devEsc(o)}</div>`).join('')}</div>
      </div>
    </div>`).join('<div class="dev-arrow">↓</div>');

  const aptitude = ONBOARDING_DATA.aptitudeQuestions.map(q =>
    `<div class="dev-chip">[${devEsc(q.dimension)}] ${devEsc(q.text)}</div>`
  ).join('');

  const languageOptions = ONBOARDING_DATA.languageOptions.map(o =>
    `<div class="dev-chip">${devEsc(o.icon)} ${devEsc(o.label)}</div>`
  ).join('');

  const avatarCount = ONBOARDING_DATA.avatarOptions.length;

  return `
    <details class="dev-day-card" open>
      <summary>
        <span>0章: 登録開始 〜 SHOSAパスポート完成</span>
        <span class="dev-day-meta">全11ステップ（オンボーディング）</span>
      </summary>
      <div class="dev-day-body">

        <div class="dev-node">
          <div class="dev-node-label">① 登録開始 → SHOSA Ready CHECK</div>
          <div class="dev-node-body">
            日本語レベル確認（${ONBOARDING_DATA.japaneseLevels.length}択）→ おすすめ言語設定 → 言語設定選択
            <div class="dev-hearing-row">${languageOptions}</div>
          </div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">② キャラクター紹介カルーセル（${ONBOARDING_DATA.introSlides.length}枚）+ AIチューター挨拶</div>
          <div class="dev-node-body"><div class="dev-hearing-row">${introSlides}</div></div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node-label" style="margin-left:2px;">③〜⑥ ヒアリング（全${ONBOARDING_DATA.hearings.length}問）</div>
        ${hearings}
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">⑦ 適性診断（5段階評価 × ${ONBOARDING_DATA.aptitudeQuestions.length}問）</div>
          <div class="dev-node-body"><div class="dev-hearing-row">${aptitude}</div></div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">⑧⑨ プロフィール入力01・02</div>
          <div class="dev-node-body">性別／名前／生年月日 → アバター（${avatarCount}種）／音声タイプ（${ONBOARDING_DATA.voiceTypes.length}種）</div>
        </div>
        <div class="dev-arrow">↓</div>

        <div class="dev-node">
          <div class="dev-node-label">⑩ SHOSAパスポート完成</div>
          <div class="dev-node-body">適性診断5項目（Communication / Observation / Accuracy / Judgement / Hospitality）をスター表示 → 本編Day1へ</div>
        </div>
      </div>
    </details>`;
}

function renderDevOverview() {
  const dayCards = GAME_DATA.days.map(renderDevDay).join('');
  $('dev-overview-content').innerHTML = `
    <div class="dev-section-title">0章（オンボーディング）</div>
    ${renderDevOnboarding()}
    <div class="dev-section-title">ゲーム本編（DAY1〜${GAME_DATA.days.length}）</div>
    ${dayCards}
  `;
}

$('btn-open-dev-overview').addEventListener('click', () => {
  renderDevOverview();
  $('dev-overview').classList.remove('hidden');
});

$('btn-close-dev-overview').addEventListener('click', () => {
  $('dev-overview').classList.add('hidden');
});
