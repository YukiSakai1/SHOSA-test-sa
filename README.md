# SHOSA - ホテルスタッフ体験アプリ

外国人ホテルスタッフが日本の職場での「所作（SHOSA）」を、選択肢形式のショートストーリーで学ぶアプリです。

> 🤖 AIエージェント向けの開発ガイドは [CLAUDE.md](CLAUDE.md) と [docs/](docs/) にあります。

## フォルダ構成
```
shosa-app/
├── mobile/      ★ 本番アプリ（Expo / React Native、iOS・Android）
├── docs/        本番アプリのルールと、Figma・動きとの照合記録
├── reference/   旧 Web 版（仕様の見本）。説明は reference/README.md
└── unused/      いま使っていないもの
```

## 本番アプリ（mobile/）の起動
```bash
cd mobile
npm install
npm run web        # ブラウザで確認
npm run start      # Expo Go / シミュレーターで確認
npm run typecheck  # 型チェック
```
詳しいルールと構成は [docs/mobile.md](docs/mobile.md) を見てください。

## 旧 Web 版（reference/）
移植元の仕様の見本です。新しい機能は追加しません。使い方は [reference/README.md](reference/README.md) と [reference/CLAUDE.md](reference/CLAUDE.md) にあります。
