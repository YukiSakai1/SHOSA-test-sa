/**
 * SHOSA（170×114）を Figma のベクター（shosaParts.ts）で描く。体・頭・蝶ネクタイを別々の層にしているので、頭だけを動かせる。
 * moveHead：頭（耳・顔）だけを首のあたり（85, 92）を軸に、左右へ 5° ゆっくり傾け、傾くたびに 1.5px 沈む（3.2秒で一往復）。
 * 視差効果を減らす ON のときは動かさない。
 */
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { shosaBody, shosaHead, shosaTie, type ShosaPart } from '@/components/shosaParts';
import { nativeDriver, useReducedMotion } from '@/theme/motion';

const W = 170;
const H = 114;
/** 首の位置（頭を傾ける軸） */
const NECK = { x: 85, y: 92 };

function Layer({ parts }: { parts: ShosaPart[] }) {
  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={StyleSheet.absoluteFill} pointerEvents="none">
      {parts.map((p, i) =>
        p.fill ? (
          <Path key={i} d={p.d} fill={p.fill} fillRule="evenodd" />
        ) : (
          <Path key={i} d={p.d} fill="none" stroke={p.stroke} strokeWidth={p.strokeWidth} strokeLinecap="round" />
        ),
      )}
    </Svg>
  );
}

export function ShosaMascot({ moveHead = false, style }: { moveHead?: boolean; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const t = useRef(new Animated.Value(0.5)).current;
  const active = moveHead && !reduced;

  useEffect(() => {
    if (!active) return;
    const half = 800;
    const ease = Easing.inOut(Easing.sin);
    // 中央 → 右 → 中央 → 左 → 中央（0.5 → 1 → 0.5 → 0 → 0.5）
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: half, easing: ease, useNativeDriver: nativeDriver }),
        Animated.timing(t, { toValue: 0.5, duration: half, easing: ease, useNativeDriver: nativeDriver }),
        Animated.timing(t, { toValue: 0, duration: half, easing: ease, useNativeDriver: nativeDriver }),
        Animated.timing(t, { toValue: 0.5, duration: half, easing: ease, useNativeDriver: nativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [active, t]);

  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['-5deg', '5deg'] });
  const translateY = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1.5, 0, 1.5] });

  return (
    <View style={[{ width: W, height: H }, style]} pointerEvents="none">
      <Layer parts={shosaBody} />
      <Animated.View
        style={[StyleSheet.absoluteFill, active && { transformOrigin: [NECK.x, NECK.y, 0], transform: [{ translateY }, { rotate }] }]}
      >
        <Layer parts={shosaHead} />
      </Animated.View>
      <Layer parts={shosaTie} />
    </View>
  );
}
