/**
 * SHOSA の動き（0章「SHOSA が話す画面」と同じ：index.html の ch07MascotBounce / mascotBreathe）。
 * - 0.3秒後に 0.6秒で弾んで登場（下 24px・0.92倍 → 上 6px・1.03倍 → 下 2px・0.99倍 → 元の位置）
 * - 同時に影が 0.7倍から広がりながら現れる
 * - そのあと 2.2秒周期で SHOSA が 3px 上下し、影が 0.95倍に縮む
 * 視差効果を減らす ON のときは動かさない。
 * 返す mascot / shadow を、SHOSA の画像と影の Animated.View / Animated.Image の style に渡す。
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { nativeDriver, useReducedMotion } from '@/theme/motion';

export function useMascotMotion({ delay = 300 }: { delay?: number } = {}) {
  const reduced = useReducedMotion();
  const enter = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(enter, { toValue: 1, duration: 600, delay, easing: Easing.linear, useNativeDriver: nativeDriver });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
        Animated.timing(breathe, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
      ]),
    );
    intro.start(() => loop.start());
    return () => {
      intro.stop();
      loop.stop();
    };
  }, [reduced, enter, breathe, delay]);
  // キーフレーム（0% / 65% / 85% / 100%）をそのまま補間する
  const bounceY = enter.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [24, -6, 2, 0] });
  const bounceS = enter.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [0.92, 1.03, 0.99, 1] });
  const breatheY = breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const mascot = {
    opacity: enter.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1, 1] }),
    transform: [{ translateY: Animated.add(bounceY, breatheY) }, { scale: bounceS }],
  };
  const shadow = {
    opacity: enter,
    transform: [
      {
        scale: Animated.multiply(
          enter.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
          breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }),
        ),
      },
    ],
  };
  return { mascot, shadow };
}
