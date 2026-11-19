# モバイル版（Expo / React Native）

`mobile/` は SHOSA の本番アプリ（iOS・Android）です。リポジトリ直下の Web 版（Capacitor）は**仕様の見本**として残しており、そこから画面を順に `mobile/` へ移植していきます。

## 技術構成
| 項目 | 採用 |
|---|---|
| フレームワーク | Expo SDK 58 / React Native 0.88 |
| 言語 | TypeScript（`strict` と `noUncheckedIndexedAccess` を有効化。`.ts` / `.tsx` だけを使う） |
| 画面遷移 | Expo Router（ファイルを置くとそのまま画面になる。`src/app/` に置く） |
| 端末内の保存 | `@react-native-async-storage/async-storage`。必ず `src/lib/storage.ts` を通して読み書きする |
| 図形・アイコン | `react-native-svg` |
| 振動（触覚フィードバック） | `expo-haptics`（Web では呼ばない） |
| バックエンド | **未定**です（Supabase などを検討中）。決まるまでは端末内の保存だけで動かします |

## コマンド（`mobile/` の中で実行）
```bash
npm install
npx expo start          # 開発サーバーを起動（Expo Go や各シミュレーターで開く）
npm run web             # ブラウザで確認する
npm run typecheck       # tsc --noEmit
npx expo-doctor         # 依存関係のチェック
npx expo install <pkg>  # パッケージを追加するときは npm install ではなく必ずこちらを使う
```

## フォルダ構成
```
mobile/
├── app.json                  アプリ名・bundle ID（jp.framelaunch.shosa）・プラグインの設定
├── assets/images/            画像（追加したら src/theme/images.ts にも登録する）
└── src/
    ├── app/                  ★ 画面（ルート）。ファイルを置くとそのままURLになる
    │   ├── _layout.tsx       ルートの Stack と Provider（言語・0章・2章）、フォント読み込み
    │   ├── index.tsx         タイトル／ログイン（CH0-01）。進み具合に応じて 0章→1章→2章 へ
    │   ├── onboarding/       0章：language → intro/[slide] → greet → hearing/[step] → schedule-intro
    │   │                        → schedule → profile-intro → profile → journey → aptitude-intro
    │   │                        → aptitude/[page] → complete → result
    │   ├── chapter1/         1章：index（ガイド）→ [lesson]/situation → dialogue → question
    │   │                        → result?choice= → complete
    │   └── chapter2/         2章：index（ガイド）→ roles → [role]/[scenario]/situation/[step]
    │                            → question/[step] → scenario-complete → diagnosis-complete
    │                            → result → profile → complete
    ├── content/              ★ シナリオデータと型（画面のロジックを触らずに中身を増やせる）
    │   ├── types.ts          Localized（{ ja, en }）、IconRef、各章の型
    │   ├── onboarding.ts     0章（ヒアリング・適性診断18問・職種の結果など）
    │   ├── chapter1.ts       1章のレッスン
    │   ├── chapter2.ts       2章の職種・シナリオ・行動傾向（4つ）
    │   └── uiStrings.ts      固定の UI 文言（ja / en）
    ├── features/
    │   ├── onboarding/       0章の状態（OnboardingProvider）、採点（diagnosis.ts）、
    │   │                     バリデーション（validation.ts）、共通レイアウト（components.tsx）
    │   ├── chapter1/         プレイ画面の共通レイアウト（PlayLayout。2章でも使う）、Focus モーダル、クリア状態
    │   └── chapter2/         2章の回答（Chapter2Provider）、集計（scoring.ts）、完了カード
    ├── components/           共通部品（CtaButton・CloseButton・ProgressBar・PatternBackground・
    │                         WheelPicker・BottomSheet・Celebration・ConfirmDialog・RichText・Icon）
    ├── i18n/                 言語の状態（useLang）
    ├── lib/storage.ts        端末内保存（型付き）
    └── theme/                色（colors.ts＝Figma の値）、画像（images.ts）、SVG アイコン（svgIcons.ts）
```
`@/…` は `src/…` を指すパスの別名です。

## ルール
1. **画面は `src/app/` に置き、それ以外のコードは `src/app/` の外に置く**（Expo Router は `src/app/` の中のファイルをすべて画面として扱うため）。
2. **文言は `Localized`（`{ ja, en }`）で持つ**。片方の言語が抜けていると型エラーになります。画面では `useLang()` の `tr()` と `t()` で取り出します。
3. **画像は `images` のキーで指定する**。React Native では `require()` で静的に読み込む必要があるので、データ側にはファイルパスを書きません。
4. **文字の強調は `<hl>…</hl>` と `\n` で書く**。HTML は書けません。表示には `components/RichText.tsx` を使います。
5. **保存は `lib/storage.ts` の `loadItem` と `saveItem` を使う**。新しいキーは `StorageSchema` に追加します。
6. **画面間で受け渡す値は URL パラメータにする**（例：`lesson` や `choice`）。こうしておくと、「戻る」やアプリの再起動の後も同じ状態から再現できます。
7. **確認ダイアログは `ConfirmDialog` を使う**（`Alert.alert` は Web で動かないため）。
8. `ios/` と `android/` は Expo が自動で生成するので、直接編集しません。ネイティブの設定は `app.json` で行います。
9. **SVG の id（グラデーション・柄・マスク）は `lib/useSvgId.ts` の `useSvgId()` で作る**。`id="halo"` のような固定の名前は使いません。Web では前の画面も非表示のまま残るため、同じ id があると前の画面の定義が使われ、柄や光が描かれなくなります。
10. **Web の `<Svg>` には `width` と `height` を属性で渡す**（style だけだと 300×150 のままになります）。
    背景に敷く `<Image>`（`StyleSheet.absoluteFill`）と `ImageBackground` の `imageStyle` にも `width: '100%'`・`height: '100%'` を書く（書かないと Web では画像の元の大きさで描かれ、枠からはみ出します）。
11. **ポップアップは `components/AppModal.tsx` の `AppModal` を使う**（React Native の `Modal` は直接使わない）。Web の `Modal` はブラウザ全体に広がり、PC ではスマホ枠の外にはみ出すためです。`AppModal` は Web ではスマホ枠の中に描き、iOS / Android では `Modal` を使います。

## Web 版から移植するときの対応表
| Web版 | mobile/ |
|---|---|
| `index.html` の `<section id="screen-xxx">` | `src/app/…/xxx.tsx`（1画面 = 1ファイル） |
| `goTo(loadXxx)` / `goBack()` | `router.push(...)` / Stack の戻るボタン（スワイプで戻る操作にも対応） |
| `window.currentAppLang` | `useLang().lang` |
| `CH1_DATA.lessons[i].titleJa / titleEn` | `chapter1.lessons[i].title.ja / .en` |
| `ONBOARDING_DATA.i18n` の HTML 入り文言 | `uiStrings.ts`、またはデータの `<hl>` 記法 |
| localStorage の `shosa_game_*` | `StorageSchema` の `shosa.*` |
| CSS の色 | `src/theme/colors.ts` |

## 移植の状況
- [x] 土台（Expo、TypeScript、Expo Router、言語切り替え、保存）
- [x] 0章（オンボーディング）：Figma「0章_261016」の全画面
- [x] 1章（Omotenashi Mindset）：Figma の注記どおりに修正済み（Focus を開くまで NEXT が押せない、など）
- [x] 2章（Omotenashi Style 診断 / JOB Simulation）：Figma の全画面（サンプルシナリオ1本）
- [ ] ホーム画面（デザインがまだ決まっていない）
- [ ] 3章以降（デザインがまだ無い）
- [ ] 認証、バックエンド、通知、課金（仕様がまだ決まっていない）
- [ ] 一部の演出（紙吹雪、光が横切る演出、扉が開く演出）

Figma との照合結果と、仕様が決まっていないため仮で実装した箇所の一覧は [design-qa.md](design-qa.md) にあります。
