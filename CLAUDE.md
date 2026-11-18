# CLAUDE.md — AIエージェント向けガイド（SHOSA）

AI（Claude Code / Codex / Cursor など）がこのリポジトリで作業するときは、まずこのファイルを読んでください。
詳細は `docs/` にあります。人間向けの機能説明は `README.md` にあります。

## プロジェクト概要
- **SHOSA**：外国人ホテルスタッフが、日本の職場での「所作」を選択式のショートストーリーで学ぶアプリです。
- 画面のUIテキストは日本語と英語の2言語です。

## このリポジトリには2つのアプリがあります
| 場所 | 中身 | 位置づけ |
|---|---|---|
| **`mobile/`** | **Expo（React Native）＋ TypeScript**。iOS と Android の両方に対応 | **本番アプリ。新しい開発はすべてこちらで行います** → [docs/mobile.md](docs/mobile.md) |
| リポジトリ直下（`src/`、`index.html` など） | TypeScript で書いた素の Web アプリを、Capacitor で iOS アプリに包んだもの | 移植元の**仕様の見本**。新しい機能は追加しません |

「作業して」と言われたら、特に指示がない限り `mobile/` で作業してください。`mobile/AGENTS.md` も読んでください。
ここから下の内容は、**Web 版（仕様の見本）** についての説明です。

## 最重要ルール
1. **編集するのは `src/*.ts` だけです**。`js/*.js` と `www/` は自動で生成されるファイルなので、直接編集しないでください。
2. 編集したら `npm run build` を実行してください（`tsc` で `js/` を生成し、`build_web.js` で `www/` へコピーします）。
3. 画面を切り替えるときは必ず `goTo(loaderFn, ...args)` を使ってください。`showScreen()` を直接呼ぶと、「戻る」で前の状態に戻せなくなります。
4. ファイルは **ES Modules ではありません**。4本のスクリプトがすべて同じグローバルスコープで読み込まれます（`import`/`export` は使えません）。読み込み順は `index.html` の末尾で決まっています。
   `game_data.js → onboarding_data.js → app.js → onboarding.js`
5. 新しくデータ構造を作ったり変えたりしたら、`src/types.d.ts` の型も一緒に更新してください。
6. 文言を追加するときは、日本語と英語を必ずセットで入れてください。
7. `index.html` の `<script src="js/xxx.js?v=NN">` のバージョン番号は、キャッシュ対策のために JS を変更したら上げてください。

## コマンド
```bash
npm run build   # tsc → js/ を生成し、www/ にコピー
npm run watch   # tsc を監視モードで実行
npm run sync    # build + npx cap sync ios（iOSプロジェクトに反映）
npx tsc --noEmit  # 型チェックだけ実行
```
自動テストはありません。動作確認は `index.html` をブラウザで開いて行います（音声認識を試すときは localhost で開いてください）。

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
| `.github/workflows/testflight.yml` | `v*` タグを push すると TestFlight に配信 |

## ドキュメント
- [docs/mobile.md](docs/mobile.md)：**モバイル版（Expo）のルール、構成、移植の状況**
- [docs/design-qa.md](docs/design-qa.md)：Figma（sakaiローカル.fig）との照合結果と、仮で実装した仕様の一覧
- [docs/architecture.md](docs/architecture.md)：実行時の仕組み（読み込み順、画面遷移、状態、保存）
- [docs/screen-flow.md](docs/screen-flow.md)：画面ID・ローダー関数・遷移の一覧
- [docs/data-model.md](docs/data-model.md)：データ型とシナリオデータの書き方
- [docs/how-to.md](docs/how-to.md)：よくある作業の手順（レッスン追加、画面追加、翻訳追加など）

## 既知の注意点
- `tsconfig.json` は `strict: false` で、`any` も残っています。新しく書くコードには型を付けてください。
- ホーム画面（`screen-home`）はデザイン中です。`loadHomeScreen()` は今はタイトル画面に戻すだけです。
- `package.json` の `"main"` には、もう存在しないファイルが指定されています（実行には影響しません）。
