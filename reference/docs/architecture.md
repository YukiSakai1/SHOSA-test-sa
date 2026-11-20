# アーキテクチャ

## 全体像
```
src/*.ts ──tsc──▶ js/*.js ──build_web.js──▶ www/ ──npx cap sync ios──▶ ios/（Xcode / TestFlight）
                     ▲
index.html が <script> で読み込む（ブラウザで直接開いても動きます）
```
- HTML 1枚で動くアプリ（SPA）です。`index.html` には、すべての画面を `<section class="screen" id="screen-xxx">` として最初から書いてあります。
- 画面の切り替えは、CSS クラス `hidden` を付けたり外したりして行います。ルーターは使っていません。
- フレームワークもバンドラーも使っていません。`tsc` で `.ts` を `.js` に変換するだけです。

## スクリプトの読み込みとグローバルスコープ
`index.html` の末尾で、次の順番に読み込みます。
1. `js/game_data.js`：`GAME_DATA` と `CH1_DATA` を定義し、`window.CH1_DATA` にも代入
2. `js/onboarding_data.js`：`ONBOARDING_DATA` を定義
3. `js/app.js`：画面遷移の基盤、本編、第1章
4. `js/onboarding.js`：0章、設定、保存

4本とも ES Modules ではない普通のスクリプトなので、トップレベルの `const` や `function` はファイルをまたいで共有されます。
そのため、`app.ts` の中で `onboarding.ts` の関数（例：`startOnboarding`）を呼ぶことができます。ただし `app.ts` のトップレベルで実行されるコードからは、
後から読み込まれる `onboarding.ts` の関数はまだ見えません。そこで起動処理は `DOMContentLoaded` まで待ってから行っています。
コードの中に `typeof fn === 'function'` というガードがあるのはこのためです。

グローバルの型は `src/types.d.ts` の `interface Window` で宣言しています。

## 画面遷移と「戻る」（`src/app.ts`）
| 関数 | 役割 |
|---|---|
| `$(id)` | `document.getElementById` の短縮形 |
| `showScreen(id)` | 指定した画面だけを表示し、ほかの画面を隠します。ヘッダーやナビの表示・非表示もここで決めます |
| `goTo(loaderFn, ...args)` | **画面を進めるときは必ずこれを使います**。今の状態をスナップショットとして保存してから `loaderFn` を実行し、履歴 `navHistory` に積みます |
| `goBack()` | 履歴を1つ戻し、`state` と `obState` をスナップショットの状態に戻してから、その画面のローダーを実行し直します |
| `navigatePreviousFallback(id)` | 履歴が空のときに使う、画面ごとの固定の戻り先 |
| `patchHistoryObState(fn)` | 設定画面でプロフィールなどを変えたとき、履歴にある過去のスナップショットにも同じ変更を反映します |

「ローダー」は `loadXxx()` や `startXxx()` という名前の関数で、1つの画面に文字や画像を流し込んでから `showScreen()` を呼ぶ関数のことです。

## 状態
| 変数 | 定義場所 | 内容 |
|---|---|---|
| `state` | `app.ts` | 本編の進み具合（`dayIndex`、スコア `teamScore`/`guestScore`/`dayGauge`、`totalPoints`、獲得した星 `stars`、クリアした Day など） |
| `obState`（`window.obState`） | `onboarding.ts` | 0章の進み具合とユーザーの入力。型は `OnboardingState` |
| `ch101State` | `app.ts` | 第1章の進み具合（`lessonIndex`、`sit2Turn`、`selectedChoice`、`lastIsCorrect`） |
| `window.currentAppLang` | `onboarding.ts` | 今の表示言語（`'ja'` または `'en'`）。切り替えは `applyAppLanguage(lang)` で行います |

## 保存（localStorage）
| キー | 中身 | 読み書きする関数 |
|---|---|---|
| `shosa_game_profile` | `UserProfile` | `loadSavedProfile` / `saveProfile` |
| `shosa_game_hearing_answers` | ヒアリングの回答 | `loadSavedHearingAnswers` / `saveHearingAnswers` |
| `shosa_game_aptitude_scores` | 適性診断のスコア | `loadSavedAptitudeScores` / `saveAptitudeScores` |
| `shosa_game_schedule` | `OnboardingSchedule` | `loadSavedSchedule` / `saveSchedule` |
| `shosa_game_progress` | 本編の進み具合 | `loadSavedProgress` / `saveProgress` |
| `shosa_game_high_score` | ハイスコア | `loadHighScore` / `saveHighScore` |

全部まとめて消すときは `resetAllSavedData()` を使います。サーバーとの通信はありません。ログインボタン（Google / Apple / 電話番号）はまだ見た目だけのダミーです。

## 多言語対応（i18n）
- シナリオの文章は、データの中で日本語と英語を対にして持っています（例：`titleJa`/`titleEn`、`story`/`story_en`）。
- 固定の UI 文言は `ONBOARDING_DATA.i18n.ja` と `.en` の辞書に入っています。
- `applyAppLanguage(lang)` が、今表示している画面を言語に合わせて描き直します。

## そのほかのブラウザ API
- 音声認識：`SpeechRecognition` / `webkitSpeechRecognition`。使えない環境では `simulateVoiceCapture()` で代わりの動きをします。
- 読み上げ：`speechSynthesis`。音声タイプは `ONBOARDING_DATA.voiceTypes` の `rate` と `pitch` で決まります。
- BGM：`assets/audio/*.mp3`。
