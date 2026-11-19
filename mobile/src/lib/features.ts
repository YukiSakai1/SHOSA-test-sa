/**
 * 機能のオン・オフ。
 * CHAPTER2_ENABLED：2章（Omotenashi Style診断）を出すかどうか。レビューは 0章と 1章だけで行うため、いまは false。
 * false のあいだは、1章の完了画面から 2章へ進む導線・解放の文言を出さず、/chapter2 以下の画面を開こうとしてもタイトルへ戻す。
 * 2章を出すときは true にするだけでよい（画面・データはそのまま残してある）。
 */
export const CHAPTER2_ENABLED = false;
