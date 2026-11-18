/**
 * コンテンツ（シナリオデータ）の型定義。
 * 画面ロジックはこの型だけに依存する。文言は必ず ja / en の両方を持つ。
 */
import type { ImageKey } from '@/theme/images';
import type { SvgIconKey } from '@/theme/svgIcons';

export type Lang = 'ja' | 'en';

/** 日本語・英語のペア。片方だけの文言は型エラーになる。 */
export type Localized = Record<Lang, string>;

/**
 * 強調付きテキスト。`<hl>…</hl>` で囲んだ部分が紫の太字、`\n` が改行になる。
 * 描画は `components/RichText.tsx`。
 */
export type RichLocalized = Localized;

export type ChoiceId = 'A' | 'B';

export interface Chapter1Lesson {
  /** L01, L02 … の連番 */
  id: string;
  /** ストーリー内の時刻（例 "12:45"） */
  time: string;
  title: Localized;
  /** 状況説明（situation 画面） */
  narration: Localized;
  sceneImage: ImageKey;
  /** dialogue 画面 1/2：登場人物のセリフ */
  speaker: Localized;
  line1: Localized;
  /** dialogue 画面 2/2：SHOSA の視点 */
  line2: Localized;
  /** question 画面 */
  situationTag: Localized;
  question: Localized;
  choices: Record<ChoiceId, Localized>;
  correct: ChoiceId;
  /** result 画面 */
  reason: Localized;
  shosaPrompt: Localized;
  /** SHOSA Focus モーダルの本文（段落ごと） */
  focusParagraphs: Localized[];
  focusCaption: RichLocalized;
  focusImage?: ImageKey;
}

/* ---------- 0章（オンボーディング） ---------- */

/** アイコンは PNG 画像（images のキー）か SVG（svgIcons のキー）のどちらか */
export type IconRef = { image: ImageKey } | { svg: SvgIconKey };

export interface ChoiceOption {
  id: string;
  label: Localized;
  icon: IconRef;
  /** true のとき選択すると自由入力欄が開く（「その他」） */
  hasInput?: boolean;
}

export type HearingKey = 'experience' | 'workStyle' | 'interest' | 'concern';

export interface HearingQuestion {
  key: HearingKey;
  question: Localized;
  options: ChoiceOption[];
}

export type AptitudeDimension =
  | 'Hospitality'
  | 'ServiceMindset'
  | 'Adaptability'
  | 'StressTolerance'
  | 'Observation'
  | 'WorkplaceCulture'
  | 'Teamwork'
  | 'Initiative'
  | 'MultiTasking';

export interface AptitudeQuestion {
  id: number;
  dimension: AptitudeDimension;
  text: Localized;
}

export interface RoleResult {
  id: string;
  name: string;
  icon: IconRef;
  /** この職種のスコアを計算するときに平均する次元 */
  traits: AptitudeDimension[];
  strengths: Localized[];
}

export interface JourneyStep {
  doorNumber: string | null;
  door: ImageKey;
  title: Localized;
  desc: Localized;
  locked: boolean;
}

export interface IntroSlide {
  kind: 'welcome' | 'features' | 'steps' | 'certification';
  title: Localized;
  button: Localized;
}

export interface Chapter1Data {
  guide: {
    badgeNumber: string;
    title: Localized;
    subtitle: Localized;
    paragraphs: RichLocalized[];
    button: Localized;
  };
  end: {
    title: Localized;
    unlockLabel: Localized;
    body: Localized;
    note: Localized;
    button: Localized;
  };
  lessons: Chapter1Lesson[];
}
