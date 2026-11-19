/**
 * レイアウトの共通寸法（Figma の iPhone 17 フレーム 402×874 から計測）。
 * Figma の座標はステータスバー（上 62）とホームインジケータ（下 34）を含むので、
 * ここではセーフエリアの内側を基準にした値にしている。
 */
export const layout = {
  /** 画面左右の余白（ボタン幅 360 = 402 - 21×2） */
  sideMargin: 21,
  /** 下部ボタンの下端からセーフエリア下端までの距離 */
  ctaBottom: 32,
  /** 2つ並ぶボタンの間隔（例：SHOSA Focus と NEXT） */
  buttonGap: 27,
} as const;

/**
 * index.html と同じく、画面が 402 より広くても中身は幅 360（左右 21 を含めて 402）までにして中央に置く。
 * 例：ヒアリングの選択肢・NEXT・プロフィールの入力欄・ジャーニーの一覧
 */
export const centered = { width: '100%', maxWidth: 402, alignSelf: 'center' } as const;
/** ボタン単体を幅 360 までにして中央に置く */
export const centeredButton = { width: '100%', maxWidth: 360, alignSelf: 'center' } as const;
