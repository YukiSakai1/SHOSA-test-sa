import { Platform } from 'react-native';
/**
 * デザイントークン。値はすべて Figma（sakaiローカル.fig）から抽出したもの。
 * 新しい色を足すときも、Figma のレイヤーにある値をそのまま使う。
 */
export const colors = {
  // ベース
  white: '#FFFFFF',
  black: '#000000',
  text: '#333333',
  textMuted: '#8C7B6B',
  placeholder: '#C2C2C2',

  // ゴールド系（飾り枠・ラベル）
  goldLabel: '#DAC397', // "101" "SITUATION" などのラベル
  goldDark: '#B09D79', // ✕ アイコン・話者名・飾り
  goldBorder: '#E6D8BD', // カード枠・帯
  goldCaption: '#988464', // Focus のキャプション
  goldButton: '#CAB896', // SHOSA Focus ボタン
  goldScore: '#AE9668',

  // 背景
  beige: '#F6F1E8', // 0章の背景・吹き出し
  playBackground: '#E8DECB', // 1章プレイ画面の背景
  turquoise: '#00C9C3', // 0章イントロの背景・NEXT ボタン
  turquoisePressed: '#00B3AD',
  sky: '#6DCAF1', // 1章ガイドの背景
  skyEnd: '#4EBFF0', // 1章完了の背景
  mint: '#D3F2F1', // 結果画面の下半分
  teal: '#18A5B1', // 結果画面の上半分・強調

  // アクセント
  purple: '#715BE1', // START ボタン・進捗・強調文字
  purplePressed: '#5E49C9',
  disabled: '#E0E0E0',
  correct: '#00C9C3',
  incorrect: '#E41042',

  // 進捗バー
  progressTrack: '#DDDDDD',
  progressTrackBorder: '#C2B7A2',

  overlay: 'rgba(0,0,0,0.74)', // Focus モーダルの背面
  dialogOverlay: 'rgba(0,0,0,0.45)',
} as const;

export const fonts = {
  /** 英字の見出し・数字（Figma: Montserrat Bold） */
  montserrat: 'Montserrat_700Bold',
  /**
   * EN / JP ボタンの文字（index.html と同じ Roboto）。
   * Web は Google Fonts から読み込む（app/_layout.tsx）。Android は標準で Roboto。iOS は標準フォントにする
   */
  roboto: Platform.select({ web: 'Roboto, Inter, sans-serif', android: 'Roboto', default: undefined }),
} as const;
