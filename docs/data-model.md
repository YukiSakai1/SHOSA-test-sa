# データモデル

型はすべて `src/types.d.ts` にあります（グローバル宣言なので import は不要です）。シナリオの中身は `src/game_data.ts` と `src/onboarding_data.ts` に書きます。
**ロジック（`app.ts`/`onboarding.ts`）を触らなくても、データを編集するだけで中身を増やしたり変えたりできる**ように作っています。

## 命名ルール
- 英語訳は、新しい型では `xxxJa` / `xxxEn` のように対にします。古い型では `xxx` / `xxx_en`、または `xxx` / `xxxEn` になっています。
- 画像はリポジトリのルートから見た相対パスで書きます（例：`assets/images/xxx.png`）。
- 文章の中の `○○` は、表示するときに `personalize()` がプレイヤーの名前に置き換えます。

## 第1章：`CH1_DATA: Chapter1Data`（`src/game_data.ts`）
今メインで使っている学習コンテンツです。
```ts
{
  guide:  { badgeNumber, titleJa/En, subtitleJa/En, bodyJa/En, buttonJa/En },   // 章の始めのガイド
  end:    { titleJa/En, bodyJa/En, noteJa/En, unlockLabelJa/En, buttonJa/En },  // 章のクリア画面
  common: { correctJa/En, incorrectJa/En, situationLabel, questionLabel },
  lessons: Chapter1Lesson[]
}
```
`Chapter1Lesson` は1レッスン分のデータで、次の順に画面に使われます。
| フィールド | 使われる画面 |
|---|---|
| `id`, `time`, `titleJa/En`, `narrationJa/En`, `sceneImg`, `charImgId?` | sit1（状況の説明） |
| `speakerJa/En`, `line1Ja/En`, `line2Ja/En`, `shosaImgId?` | sit2（会話。`sit2Turn` で 1行目と2行目を切り替え） |
| `situationTagJa/En`, `questionJa/En`, `choiceAJa/En`, `choiceBJa/En` | question |
| `correct: 'A' \| 'B'`, `reasonJa/En` | result |
| `shosaPromptJa/En`, `focusTextJa/En`, `focusImgCaptionJa?` | focus モーダル（もっと詳しい解説） |

## 本編：`GAME_DATA: GameData`（`src/game_data.ts`）
```ts
{ days: GameDay[] }
```
`GameDay` には、導入文（`sceneIntro`/`story`/`hint`）、NPC（`GameNPC`。表情ごとに `bannerNeutral/Happy/Worried` の3枚）、
会話（`dialogueText`）、問題（`GameQuestion` と3つの `GameChoice`）、解説（`GameExplanation`）、発音練習（`GameVoice`）が入っています。

`GameChoice` の中身：
- `quality: 'best' | 'okay' | 'bad'`：獲得できる星の数（3 / 2 / 1）と NPC の表情が決まります
- `gaugeDelta` / `teamDelta` / `guestDelta`：スコアがどれだけ増減するか（スコアは 0〜100 の範囲に収まるよう `clamp` されます）
- `points`：獲得ポイント

## 0章：`ONBOARDING_DATA: OnboardingData`（`src/onboarding_data.ts`）
| フィールド | 型 | 使われる画面 |
|---|---|---|
| `languageOptions` | `LanguageOption[]` | langselect |
| `introSlides` | `IntroSlide[]`（`type`：welcome / features / steps / certification） | intro カルーセル |
| `hearings` | `HearingQuestion[]`（`key` が `obState.answers` のキーになります） | hearing |
| `aptitudeIntro` / `aptitudeQuestions` | `AptitudeQuestion[]`（`dimension` ごとに集計） | aptitude |
| `avatarOptions` | `AvatarOption[]` | profile1 |
| `voiceTypes` | `VoiceTypeOption[]`（読み上げの `rate` と `pitch`） | 音声設定 |
| `scheduleTimeOptions` / `scheduleStreakOptions` | | schedule-time |
| `journeySteps` | `JourneyStep[]` | journey |
| `roleResults` / `q4Followup` | `Record<string, any>` | 診断結果（型はまだ決まっていません） |
| `i18n.ja` / `i18n.en` | `I18nDictionary` | 固定の UI 文言 |
| `stats` | `{ visible, items: StatItem[] }` | スコア表示の ON/OFF |

## ユーザーの状態：`OnboardingState`（`window.obState`）
`languageSetting`、各画面の今の位置（`slideIndex`/`hearingIndex`/`aptitudeIndex`/`aptitudePageIndex`）、
`answers`（ヒアリングの回答）、`aptitudeScores`、`profile: UserProfile`、`schedule: OnboardingSchedule`。
保存先のキーは [architecture.md](architecture.md#保存localstorage) を見てください。
