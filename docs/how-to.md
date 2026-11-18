# よくある作業の手順

どの作業でも、最後は `npm run build` を実行し、`index.html` をブラウザで開いて動きを確認してください。

## 第1章にレッスンを追加する
1. `src/game_data.ts` の `CH1_DATA.lessons` 配列に、`Chapter1Lesson` 型のオブジェクトを1つ追加します。
   - `id` は `L02`、`L03` のように連番にします。
   - `Ja` と `En` は必ず両方埋めます。
   - `correct` には `'A'` か `'B'` を入れます。
2. 画像は `assets/images/` に置いて、`sceneImg` にそのパスを書きます。
3. ロジックは変えなくて大丈夫です（進み具合の％や「次へ」は、`lessons.length` を見て自動で計算されます）。

## 0章の質問やスライドを変える
`src/onboarding_data.ts` の該当する配列（`hearings`、`aptitudeQuestions`、`introSlides` など）を編集します。
ヒアリングに質問を足すときは、`key` を `OnboardingState.answers` と合わせてください（必要なら `types.d.ts` にも追加します）。

## UI の固定文言を追加・翻訳する
1. `ONBOARDING_DATA.i18n.ja` と `.en` の両方に、同じキーで文言を追加します。
2. 画面を描くコードの中で `window.currentAppLang` を見て、どちらの文言を使うか選びます（例は `applyAppLanguage()` の中にあります）。

## 新しい画面を追加する
1. `index.html` に `<section class="screen hidden" id="screen-xxx">…</section>` を追加します。
2. 担当するファイル（0章なら `onboarding.ts`、それ以外は `app.ts`）にローダーを書きます。
   ```ts
   function loadXxx(): void {
     // 文字や画像を流し込む
     showScreen('screen-xxx');
   }
   ```
3. 前の画面のボタンから `goTo(loadXxx)` で呼び出します。`showScreen` を直接呼ばないでください（「戻る」が効かなくなります）。
4. 履歴が空のときの戻り先が必要なら、`navigatePreviousFallback()` に分岐を追加します。
5. ヘッダーの表示・非表示を変えたいときは、`showScreen()` の中の画面ID のルール（`GAME_PLAY_SCREENS`、`screen-ob-*` など）を確認します。
6. ほかのファイルや HTML の `onclick` から呼ぶ場合は、`window.loadXxx = loadXxx` を書き、`types.d.ts` の `Window` にも追加します。

## データの型を変える
`src/types.d.ts` を編集してから、`npx tsc --noEmit` で型エラーがないか確認します。

## iOS / TestFlight に出す
```bash
npm run sync          # www/ を作って iOS プロジェクトに反映
git tag v1.0.x && git push origin v1.0.x   # GitHub Actions で TestFlight に配信
```
署名に必要な情報は GitHub Secrets（`APPLE_CERTIFICATE_BASE64` など）に入っています。

## やってはいけないこと
- `js/` と `www/` を手で編集すること（ビルドすると上書きされます）
- `import` や `export` を使うこと（今はモジュールの仕組みを使っていないので、動かなくなります）
- どちらか一方の言語だけ文言を追加すること
