/**
 * 画面に固定で出る UI 文言（シナリオ以外）。キーを足すときは ja / en の両方に入れる。
 * 型 `UiStringKey` で存在しないキーの参照はコンパイルエラーになる。
 */
import type { Lang } from './types';

const ja = {
  next: 'NEXT',
  situationLabel: 'SITUATION',
  questionLabel: 'QUESTION',
  correct: '正解！',
  incorrect: '不正解',
  sceneTurn1: '状況 1 / 2',
  sceneTurn2: 'SHOSAの視点 2 / 2',
  focusButton: 'SHOSA Focus',
  focusTitle: 'SHOSA FOCUS',
  close: '閉じる',
  exitConfirmTitle: 'チャプターを終了しますか？',
  exitConfirmBody: 'チャプターの途中で終了し、ホームに戻ります。',
  exitConfirmOk: '終了する',
  exitConfirmCancel: 'つづける',
  homeTitle: 'SHOSA',
  homeSubtitle: '日本のホテルではたらく未来のために',
  homeStartChapter1: '1章をはじめる',
  homeChapter1Done: '1章 クリア済み',
  homeOnboardingTodo: '※0章（登録・診断）は移植中です',
  langToggle: 'EN',
} as const;

export type UiStringKey = keyof typeof ja;

const en: Record<UiStringKey, string> = {
  next: 'NEXT',
  situationLabel: 'SITUATION',
  questionLabel: 'QUESTION',
  correct: 'Correct!',
  incorrect: 'Incorrect',
  sceneTurn1: 'SCENE 1 / 2',
  sceneTurn2: 'SHOSA TIP 2 / 2',
  focusButton: 'SHOSA Focus',
  focusTitle: 'SHOSA FOCUS',
  close: 'Close',
  exitConfirmTitle: 'Exit this chapter?',
  exitConfirmBody: 'You will leave the chapter and return to Home.',
  exitConfirmOk: 'Exit',
  exitConfirmCancel: 'Keep going',
  homeTitle: 'SHOSA',
  homeSubtitle: 'Learn together for a future in Japanese hotels',
  homeStartChapter1: 'Start Chapter 1',
  homeChapter1Done: 'Chapter 1 cleared',
  homeOnboardingTodo: '*Chapter 0 (sign-up & assessment) is being ported',
  langToggle: 'JA',
};

export const uiStrings: Record<Lang, Record<UiStringKey, string>> = { ja, en };
