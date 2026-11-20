# CLAUDE.md — 旧 Web 版（仕様の見本）

このフォルダ（`reference/`）は、SHOSA の旧 Web 版です。TypeScript で書いた素の Web アプリを、Capacitor で iOS アプリに包んだものです。
本番アプリは `../mobile/`（Expo / React Native）で、ここは移植元の**仕様の見本**として残しています。**新しい機能は追加しません。**
本番の説明は [../CLAUDE.md](../CLAUDE.md) と [../docs/mobile.md](../docs/mobile.md) を見てください。人間向けの機能説明は [README.md](README.md) にあります。

## 最重要ルール
1. **編集するのは `src/*.ts` だけです**。`js/*.js` と `www/` は自動で生成されるファイルなので、直接編集しないでください。
2. 編集したら、このフォルダで `npm run build` を実行してください（`tsc` で `js/` を生成し、`build_web.js` で `www/` へコピーします）。
3. 画面を切り替えるときは必ず `goTo(loaderFn, ...args)` を使ってください。`showScreen()` を直接呼ぶと、「戻る」で前の状態に戻せなくなります。
4. ファイルは **ES Modules ではありません**。4本のスクリプトがすべて同じグローバルスコープで読み込まれます（`import`/`export` は使えません）。読み込み順は `index.html` の末尾で決まっています。
   `game_data.js → onboarding_data.js → app.js → onboarding.js`
5. 新しくデータ構造を作ったり変えたりしたら、`src/types.d.ts` の型も一緒に更新してください。
6. 文言を追加するときは、日本語と英語を必ずセットで入れてください。
7. `index.html` の `<script src="js/xxx.js?v=NN">` のバージョン番号は、キャッシュ対策のために JS を変更したら上げてください。

## コマンド（すべて `reference/` で実行）
```bash
npm run build   # tsc → js/ を生成し、www/ にコピー
npm run watch   # tsc を監視モードで実行
npm run sync    # build + npx cap sync ios（iOSプロジェクトに反映）
npx tsc --noEmit  # 型チェックだけ実行
```
自動テストはありません。動作確認は `index.html` をブラウザで開いて行います（音声認識を試すときは localhost で開いてください）。
Claude Code のプレビューでは `.claude/launch.json` の `shosa-web-reference`（http://localhost:8090、このフォルダを配信）で開けます。

## ファイル早見表
| パス | 役割 |
|---|---|
| `src/types.d.ts` | すべてのデータ型と `Window` のグローバル宣言 → [docs/data-model.md](docs/data-model.md) |
| `src/game_data.ts` | 本編シナリオ `GAME_DATA`（Day制）と第1章 `CH1_DATA`（レッスン制） |
| `src/onboarding_data.ts` | 0章（オンボーディング）のコンテンツ `ONBOARDING_DATA` と i18n 辞書 |
| `src/app.ts` | 画面遷移の基盤（`showScreen`/`goTo`/`goBack`）、本編 Day のロジック、第1章（ch101）のロジック |
| `src/onboarding.ts` | 0章の各画面、言語切り替え、localStorage への保存、設定画面 |
| `index.html` | 全画面の DOM（`<section id="screen-...">`）。ここに画面を全部書いておき、表示・非表示を切り替えます |
| `css/style.css` | 全スタイル |
| `assets/` | 画像と音声 |
| `build_web.js` | `index.html`/`css`/`js`/`assets` を `www/` にコピーするスクリプト |
| `ios/` | Capacitor の iOS プロジェクト |
| `.github/workflows/testflight.yml` | 旧版を TestFlight に配信していた workflow。**ここに置いている間は動きません**（GitHub が読むのはリポジトリ直下の `.github/` だけ） |

## ドキュメント
- [docs/architecture.md](docs/architecture.md)：実行時の仕組み（読み込み順、画面遷移、状態、保存）
- [docs/screen-flow.md](docs/screen-flow.md)：画面ID・ローダー関数・遷移の一覧
- [docs/data-model.md](docs/data-model.md)：データ型とシナリオデータの書き方
- [docs/how-to.md](docs/how-to.md)：よくある作業の手順（レッスン追加、画面追加、翻訳追加など）
- [../docs/design-qa.md](../docs/design-qa.md)：Figma との照合結果（本番・旧版の両方）

## 既知の注意点
- `tsconfig.json` は `strict: false` で、`any` も残っています。
- ホーム画面（`screen-home`）はデザイン中です。`loadHomeScreen()` は今はタイトル画面に戻すだけです。
- `package.json` の `"main"` には、もう存在しないファイルが指定されています（実行には影響しません）。
