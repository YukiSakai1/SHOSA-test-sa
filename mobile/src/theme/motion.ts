/**
 * モーションの共通設定（フロントエンドSHOSA_motion.xlsx の「演出仕様」から）。
 * 秒数を変えたいときはここだけ直す。各値のコメントは演出ID。
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Animated の useNativeDriver に渡す値。
 * Web ではネイティブドライバーが無く、true にすると連続アニメーションが止まることがあるため false にする。
 */
export const nativeDriver = Platform.OS !== 'web';

export const motion = {
  /** M-01 押した瞬間の縮み */
  pressScale: 0.95,
  pressMs: 150,
  /** M-02 NEXT が有効になった時の弾み */
  enableBounceMs: 300,
  /** M-03 画面遷移 */
  screenMs: 300,
  /** M-04 視差効果を減らす ON のときのフェード */
  reducedFadeMs: 150,
  /** M-30 進捗バー */
  progressMs: 400,
  /** M-32 / M-06 言語切り替えのクロスフェード */
  langFadeMs: 300,
  /** M-05 / M-33 選択カードのふくらみ */
  cardPopMs: 150,
  /** M-13 ボタンの脈動の周期 */
  pulsePeriodMs: 1500,
  /** M-34 シートのせり上がり / M-35 閉じる */
  sheetOpenMs: 300,
  sheetCloseMs: 250,
  /** M-38 時刻のクロスフェード */
  timeFadeMs: 200,
} as const;

/**
 * M-04：OS の「視差効果を減らす」（iOS）／「アニメーションを削除」（Android）が ON か。
 * ON のときは、スライド・拡大・揺れをやめてフェードだけにする。
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let alive = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduced(v));
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);
  return reduced;
}
