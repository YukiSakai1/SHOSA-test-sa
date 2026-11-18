/**
 * 完了画面の共通演出（0章「適性診断 完了！」/ 1章「学習完了！」/ 2章「診断完了！」）。
 * M-13 の順番で出す（全体 2.5秒以内）：
 *   背景 → タイトル（0.2秒）→ バッジ（M-10：0.6秒後に上から落ちて小さく弾む）
 *   → 光（M-11）と紙吹雪（M-12）（1.3秒後・1回だけ）→ 本文など（1.6秒から 0.3秒おき）→ ボタン（脈動 1.5秒周期）
 * 要点 CH0-19：背景の放射線がゆっくり回る。成功の触覚を1回。
 * M-04：視差効果を減らす ON のときは、落下・回転・光・紙吹雪なしでフェードだけ。
 */
import { Children, useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Path, RadialGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appear } from '@/components/Appear';
import { Confetti } from '@/components/Confetti';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { layout } from '@/theme/layout';
import { images, type ImageKey } from '@/theme/images';
import { nativeDriver, useReducedMotion } from '@/theme/motion';

const T = { title: 200, badge: 600, shine: 1300, body: 1600, step: 300 } as const;

interface Props {
  background: string;
  title: string;
  medal: ImageKey;
  children: ReactNode;
  footer: ReactNode;
  /**
   * figma（既定）：Figma の配置（2章）
   * web：index.html の 0章完了（#screen-ob-passport）と同じ配置。上端 84 から飾り線＋タイトル、
   *      トロフィー（180×205）の後ろに放射線（直径 540・24本）と後光（直径 260）、本文は上端 489 から
   */
  variant?: 'figma' | 'web';
}

export function Celebration({ background, title, medal, children, footer, variant = 'figma' }: Props) {
  const web = variant === 'web';
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const spin = useRef(new Animated.Value(0)).current;
  const items = Children.toArray(children);

  useEffect(() => {
    haptics.success();
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 30000, easing: Easing.linear, useNativeDriver: nativeDriver }));
    loop.start();
    return () => loop.stop();
  }, [reduced, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={[styles.screen, { backgroundColor: background, paddingTop: insets.top + (web ? 84 : 24), paddingBottom: insets.bottom + layout.ctaBottom }]}>
      {!web && <Animated.Image source={images.sunburst} style={[styles.sunburst, { transform: [{ rotate }] }]} resizeMode="cover" />}
      <Appear from="none" delay={T.title} duration={300} style={styles.header}>
        <Image source={images.filigreeTop} style={styles.filigree} resizeMode="contain" />
        {web ? (
          <View style={styles.titleBoxWeb}>
            <Text style={styles.titleWeb}>{title}</Text>
          </View>
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}
        <Image source={images.filigreeBottom} style={styles.filigree} resizeMode="contain" />
      </Appear>
      <View style={web ? styles.stageWeb : styles.stage}>
        {web ? (
          <>
            <Animated.View pointerEvents="none" style={[styles.sunburstWeb, { transform: [{ rotate }] }]}>
              <Sunburst />
            </Animated.View>
            <Halo />
          </>
        ) : (
          <View style={styles.halo} />
        )}
        <Appear from="drop" delay={T.badge} duration={600} distance={260}>
          <View style={web ? styles.medalWrapWeb : styles.medalWrap}>
            <Image source={images[medal]} style={web ? styles.medalWeb : styles.medal} resizeMode="contain" />
            <Shine delay={T.shine} />
          </View>
        </Appear>
      </View>
      <View style={[styles.body, web && styles.bodyWeb]}>
        {items.map((child, i) => (
          <Appear key={i} from="none" delay={T.body + i * T.step} duration={300}>
            {child}
          </Appear>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <Appear from="up" delay={T.body + items.length * T.step} duration={300} style={styles.footer}>
        {footer}
      </Appear>
      <Confetti delay={T.shine} />
    </View>
  );
}

/** index.html .ch19-programmatic-sunburst：白 22% の光線を 7.5° おきに 24本（直径 540 の円） */
const SUN = 270;
function Sunburst() {
  return (
    <Svg width={SUN * 2} height={SUN * 2} viewBox={`${-SUN} ${-SUN} ${SUN * 2} ${SUN * 2}`}>
      <G>
        {Array.from({ length: 24 }, (_, i) => {
          const a0 = (i * 15 * Math.PI) / 180;
          const a1 = ((i * 15 + 7.5) * Math.PI) / 180;
          return (
            <Path
              key={i}
              d={`M0,0 L${SUN * Math.sin(a0)},${-SUN * Math.cos(a0)} A${SUN},${SUN} 0 0 1 ${SUN * Math.sin(a1)},${-SUN * Math.cos(a1)} Z`}
              fill="rgba(255,255,255,0.22)"
            />
          );
        })}
      </G>
    </Svg>
  );
}

/** index.html .ch19-trophy-halo：白 → 薄い金色の後光（直径 260） */
function Halo() {
  return (
    <Svg pointerEvents="none" width={260} height={260} style={styles.haloWeb}>
      <Defs>
        <RadialGradient id="ch19halo" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.98} />
          <Stop offset="0.354" stopColor="rgb(255,245,200)" stopOpacity={0.8} />
          <Stop offset="0.707" stopColor="rgb(255,215,140)" stopOpacity={0.42} />
          <Stop offset="0.96" stopColor="rgb(255,185,110)" stopOpacity={0.15} />
          <Stop offset="1" stopColor="rgb(255,185,110)" stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={130} cy={130} r={130} fill="url(#ch19halo)" />
    </Svg>
  );
}

/** M-11：光がバッジの上を1回だけ横切って消える */
function Shine({ delay }: { delay: number }) {
  const reduced = useReducedMotion();
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.timing(x, { toValue: 1, delay, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: nativeDriver });
    a.start();
    return () => a.stop();
  }, [reduced, delay, x]);
  if (reduced) return null;
  return (
    <View pointerEvents="none" style={styles.shineClip}>
      <Animated.View
        style={[
          styles.shineBar,
          {
            opacity: x.interpolate({ inputRange: [0, 0.05, 0.95, 1], outputRange: [0, 1, 1, 0] }),
            transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-160, 200] }) }, { rotate: '20deg' }],
          },
        ]}
      />
    </View>
  );
}

/** 解放の文言と本文の間の区切り線（Figma の frames 240×13） */
export function CelebrationDivider() {
  return <Image source={images.goldDivider} style={{ width: 240, height: 13, alignSelf: 'center', marginTop: 8, tintColor: colors.white }} resizeMode="contain" />;
}

export const celebrationText = StyleSheet.create({
  unlocked: { fontSize: 20, fontWeight: '700', color: colors.white, textAlign: 'center', lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center', marginTop: 10 },
  note: { fontSize: 12, color: colors.white, textAlign: 'center', marginTop: 8 },
});

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', paddingHorizontal: 21, overflow: 'hidden' },
  sunburst: { position: 'absolute', top: 40, width: 540, height: 540, opacity: 0.9 },
  header: { alignItems: 'center' },
  filigree: { width: 348, height: 19 },
  title: { fontSize: 22, fontWeight: '700', color: colors.white, marginVertical: 8 },
  stage: { height: 280, width: 280, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  halo: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: colors.white, opacity: 0.25 },
  medalWrap: { width: 180, height: 204 },
  medal: { width: 180, height: 204 },
  shineClip: { ...StyleSheet.absoluteFill, overflow: 'hidden', borderRadius: 40 },
  shineBar: { position: 'absolute', top: -40, width: 46, height: 300, backgroundColor: 'rgba(255,255,255,0.55)' },
  body: { alignSelf: 'stretch', marginTop: 8 },
  // --- variant="web"（index.html #screen-ob-passport）---
  titleBoxWeb: { height: 69, justifyContent: 'center' },
  titleWeb: { fontSize: 22, lineHeight: 26.4, fontWeight: '700', color: colors.white },
  stageWeb: { width: 180, height: 205, marginTop: 17, alignItems: 'center', justifyContent: 'center' },
  sunburstWeb: { position: 'absolute', width: SUN * 2, height: SUN * 2, left: 90 - SUN, top: 102.5 - SUN },
  haloWeb: { position: 'absolute', left: 90 - 130, top: 102.5 - 130 },
  medalWrapWeb: { width: 180, height: 205 },
  medalWeb: { width: 180, height: 205 },
  bodyWeb: { marginTop: 76 },
  footer: { alignSelf: 'stretch', gap: layout.buttonGap },
});
