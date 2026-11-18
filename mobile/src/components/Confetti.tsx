/**
 * M-12：紙吹雪。画面上部から1回だけ舞い落ちて、落ち切ったら消える（繰り返さない・効果音なし）。
 * 視差効果を減らす ON のときは出さない（M-04）。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { nativeDriver, useReducedMotion } from '@/theme/motion';

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#715BE1', '#FFA07A', '#98D8C8', '#FFFFFF', '#56C3F7'];
const COUNT = 36;

export function Confetti({ delay = 0 }: { delay?: number }) {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const [done, setDone] = useState(false);
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        key: i,
        x: Math.random() * 0.92 + 0.04,
        drift: (Math.random() - 0.5) * 80,
        spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
        color: COLORS[i % COLORS.length]!,
        delay: Math.random() * 700,
        duration: 1800 + Math.random() * 1200,
        w: 6 + Math.random() * 4,
        h: 10 + Math.random() * 6,
      })),
    [],
  );
  const values = useRef(pieces.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (reduced) return;
    const anim = Animated.parallel(
      pieces.map((p, i) =>
        Animated.timing(values[i]!, { toValue: 1, delay: delay + p.delay, duration: p.duration, easing: Easing.in(Easing.quad), useNativeDriver: nativeDriver }),
      ),
    );
    anim.start(() => setDone(true));
    return () => anim.stop();
  }, [reduced, delay, pieces, values]);

  if (reduced || done) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p, i) => {
        const v = values[i]!;
        return (
          <Animated.View
            key={p.key}
            style={{
              position: 'absolute',
              left: p.x * width,
              top: -20,
              width: p.w,
              height: p.h,
              borderRadius: 2,
              backgroundColor: p.color,
              opacity: v.interpolate({ inputRange: [0, 0.01, 0.85, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, height + 40] }) },
                { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, p.drift] }) },
                { rotate: v.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.spin}deg`] }) },
              ],
            }}
          />
        );
      })}
    </View>
  );
}
