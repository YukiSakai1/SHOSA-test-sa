/**
 * 時間差で表示する部品。画面を開いてから delay ミリ秒後に、フェードしながら出る。
 * - from="up":   少し下から上へ動きながら出る（M-20 ロゴ、M-22 ボタン、要点の順番表示）
 * - from="drop": 上から落ちて小さく弾む（M-10 バッジ）
 * - from="pop":  下から小さく弾んで出る（M-21 マスコット）
 * - from="rise": 画面の下からせり上がる（M-14 レポートの紙）
 * - from="none": フェードだけ（M-19 タグライン）
 * M-04：視差効果を減らす ON のときは、どれもフェード（0.15秒）だけになる。
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';
import { motion, nativeDriver, useReducedMotion } from '@/theme/motion';

type From = 'up' | 'drop' | 'pop' | 'rise' | 'none';

interface Props {
  delay?: number;
  duration?: number;
  from?: From;
  /** 動く距離（px） */
  distance?: number;
  onDone?: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

export function Appear({ delay = 0, duration = 300, from = 'up', distance, onDone, style, children }: Props) {
  const reduced = useReducedMotion();
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const easing =
      from === 'drop' ? Easing.bounce : from === 'pop' ? Easing.out(Easing.back(2)) : Easing.out(Easing.cubic);
    const anim = Animated.timing(p, {
      toValue: 1,
      delay: reduced ? 0 : delay,
      duration: reduced ? motion.reducedFadeMs : duration,
      easing: reduced ? Easing.linear : easing,
      useNativeDriver: nativeDriver,
    });
    anim.start(({ finished }) => finished && onDone?.());
    return () => anim.stop();
    // 表示したときに1回だけ動かす
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const d = distance ?? (from === 'drop' ? 220 : from === 'rise' ? 500 : from === 'pop' ? 40 : 16);
  const translateY =
    reduced || from === 'none'
      ? 0
      : p.interpolate({ inputRange: [0, 1], outputRange: [from === 'drop' ? -d : d, 0] });
  // 落下・せり上がりは最初から見えている（位置だけが動く）。それ以外はフェードも付ける
  const opacity = !reduced && (from === 'drop' || from === 'rise') ? p.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 1] }) : p;
  return <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
