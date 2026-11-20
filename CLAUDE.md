# CLAUDE.md — AIエージェント向けガイド（SHOSA）

AI（Claude Code / Codex / Cursor など）がこのリポジトリで作業するときは、まずこのファイルを読んでください。
詳細は `docs/` にあります。人間向けの説明は `README.md` にあります。

## プロジェクト概要
- **SHOSA**：外国人ホテルスタッフが、日本の職場での「所作」を選択式のショートストーリーで学ぶアプリです。
- 画面のUIテキストは日本語と英語の2言語です。

## フォルダ構成
| 場所 | 中身 | 位置づけ |
|---|---|---|
| **`mobile/`** | **Expo（React Native）＋ TypeScript**。iOS と Android の両方に対応 | **本番アプリ。新しい開発はすべてこちらで行います** → [docs/mobile.md](docs/mobile.md)、[mobile/AGENTS.md](mobile/AGENTS.md) |
| `reference/` | 旧 Web 版（TypeScript の素の Web アプリを Capacitor で iOS に包んだもの）と、その iOS プロジェクト・配信設定 | 移植元の**仕様の見本**。新しい機能は追加しません → [reference/CLAUDE.md](reference/CLAUDE.md) |
| `docs/` | 本番アプリのルール（mobile.md）、Figma・動きとの照合記録（design-qa.md / motion-qa.md） | |
| `unused/` | いま使っていない QA のスクリーンショット・スクリプト | 参照しません |

「作業して」と言われたら、特に指示がない限り `mobile/` で作業してください。
旧 Web 版の仕様を確かめたいときだけ `reference/` を読みます。docs に出てくる `index.html` や `src/*.ts`（`app.ts` など）は、旧 Web 版のもの（`reference/` の下）です。

## コマンド（`mobile/` で実行）
```bash
npm run web        # Web で起動（Claude Code のプレビューでは .claude/launch.json の shosa-mobile-web）
npm run typecheck  # 型チェック
```

## ドキュメント
- [docs/mobile.md](docs/mobile.md)：**モバイル版（Expo）のルール、構成、移植の状況**
- [docs/design-qa.md](docs/design-qa.md)：Figma（sakaiローカル.fig）との照合結果と、仮で実装した仕様の一覧
- [docs/motion-qa.md](docs/motion-qa.md)：動きの仕様との照合結果
- [docs/route-map.md](docs/route-map.md)：画面ごとの URL（http://localhost:8081/…）と Figma の画面名の対応表
- [reference/CLAUDE.md](reference/CLAUDE.md)：旧 Web 版のルールとファイル早見表（architecture / screen-flow / data-model / how-to は `reference/docs/`）
