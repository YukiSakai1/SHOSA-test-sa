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
    │   ├── _layout.tsx       ルートの Stack と各種 Provider
    │   ├── index.tsx         仮のホーム画面（0章を移植したら置き換える）
    │   └── chapter1/
    │       ├── index.tsx              /chapter1               章のガイド
    │       ├── [lesson]/situation.tsx /chapter1/0/situation   状況説明
    │       ├── [lesson]/dialogue.tsx  /chapter1/0/dialogue    会話（1/2 → 2/2）
    │       ├── [lesson]/question.tsx  /chapter1/0/question    2択問題
    │       ├── [lesson]/result.tsx    /chapter1/0/result?choice=A  結果と SHOSA Focus
    │       └── complete.tsx           /chapter1/complete      クリア画面
    ├── content/              ★ シナリオデータと型（画面のロジックを触らずに中身を増やせる）
    │   ├── types.ts          Localized（{ ja, en }）、Chapter1Lesson など
    │   ├── chapter1.ts       第1章のデータ
    │   └── uiStrings.ts      固定の UI 文言（ja / en）
    ├── features/chapter1/    第1章専用の部品（共通レイアウト、Focus モーダル、クリア状態の保存）
    ├── components/           共通の UI 部品（ボタン、言語切り替え、確認ダイアログ、RichText）
    ├── i18n/                 言語の状態（useLang）
    ├── lib/storage.ts        端末内保存（型付き）
    └── theme/                色と画像の一覧
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
- [x] 第1章（ch101）：ガイド → 状況説明 → 会話 → 問題 → 結果と Focus → クリア
- [ ] 0章（オンボーディング）：言語選択、ヒアリング、プロフィール入力、適性診断など
  - 入力欄のバリデーションとエラーメッセージの仕様がまだ決まっていません
- [ ] ホーム画面（デザインがまだ決まっていません）
- [ ] 演出の再現：紙吹雪、光が横切る演出、タイプライター表示など（今はメダルが落ちてくる演出だけを簡単に入れています）
- [ ] 認証、バックエンド、通知、課金（仕様がまだ決まっていません）
