# AGENTS.md — SHOSA モバイル版（Expo / React Native）

このフォルダは SHOSA の本番アプリ（iOS・Android）です。
**プロジェクト固有のルール、フォルダ構成、移植の状況は [../docs/mobile.md](../docs/mobile.md) にまとめています。必ず先に読んでください。**
仕様の見本である Web 版の説明は [../CLAUDE.md](../CLAUDE.md) にあります。

## 特に大事なルール（詳しくは docs/mobile.md を参照）
- 書くのは `.ts` / `.tsx` だけです。TypeScript は strict にしています。作業を終える前に必ず `npm run typecheck` を実行してください。
- 画面は `src/app/` に置き、それ以外のコードは `src/` の下の別のフォルダに置きます。
- 文言は `{ ja, en }`（`Localized`）の形で持ち、`useLang()` で取り出します。
- 画像は `src/theme/images.ts` のキーで指定します。
- 保存は `src/lib/storage.ts` を通して行います。

---

（以下は Expo のテンプレートに最初から入っていた汎用ガイドです）

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`). Run EAS CLI as `npx eas-cli@latest <command>`.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries.
