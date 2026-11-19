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
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Appear } from '@/components/Appear';
import { Confetti } from '@/components/Confetti';
import { LangToggle } from '@/components/ui';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { layout } from '@/theme/layout';
import { images, type ImageKey } from '@/theme/images';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { useSvgId } from '@/lib/useSvgId';

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
    <View style={[styles.screen, { backgroundColor: background, paddingTop: web ? 84 : insets.top + 24, paddingBottom: insets.bottom + layout.ctaBottom }]}>
      {web && <LangToggle style={[styles.langWeb, { top: insets.top + 14 }]} />}
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
            <WebSunburst />
            <WebHalo />
            <WebTrophy medal={medal} />
          </>
        ) : (
          <>
            <View style={styles.halo} />
            <Appear from="drop" delay={T.badge} duration={600} distance={260}>
              <View style={styles.medalWrap}>
                <Image source={images[medal]} style={styles.medal} resizeMode="contain" />
                <Shine delay={T.shine} />
              </View>
            </Appear>
          </>
        )}
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

/**
 * index.html .ch19-programmatic-sunburst（プログラム描画）：
 * 白 22% の光線を 7.5° おきに 24本（直径 540）。中心から外へ消えていくマスク（中心 100% → 35% で 85% → 70% で 0）。
 * 0.35秒後に 0.8秒で 0.9倍から現れ（ch19SunburstFadeIn）、24秒で 1回転し続ける（ch19SunburstSpin）。
 */
const SUN = 270;
function WebSunburst() {
  const reduced = useReducedMotion();
  const maskId = useSvgId('sunmask');
  const fadeId = useSvgId('sunfade');
  const enter = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(enter, { toValue: 1, duration: 800, delay: 350, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver });
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 24000, easing: Easing.linear, useNativeDriver: nativeDriver }));
    intro.start();
    loop.start();
    return () => {
      intro.stop();
      loop.stop();
    };
  }, [reduced, enter, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  return (
    <Animated.View pointerEvents="none" style={[styles.sunburstWeb, { opacity: enter, transform: [{ scale }, { rotate }] }]}>
      <Svg width={SUN * 2} height={SUN * 2} viewBox={`${-SUN} ${-SUN} ${SUN * 2} ${SUN * 2}`}>
        <Defs>
          {/* CSS の radial-gradient(circle) は角までの距離（270×√2）が 100%。35% → 半径の 0.495、70% → 0.99 */}
          <RadialGradient id={fadeId} cx={0} cy={0} r={SUN} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="0.495" stopColor="#FFFFFF" stopOpacity={0.85} />
            <Stop offset="0.99" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <Mask id={maskId} x={-SUN} y={-SUN} width={SUN * 2} height={SUN * 2} maskUnits="userSpaceOnUse">
            <Rect x={-SUN} y={-SUN} width={SUN * 2} height={SUN * 2} fill={`url(#${fadeId})`} />
          </Mask>
        </Defs>
        <G mask={`url(#${maskId})`}>
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
    </Animated.View>
  );
}

/**
 * index.html .ch19-trophy-halo（プログラム描画）：直径 270 の後光（白 → 薄い金色）を 14px ぼかす。
 * 0.55秒後に 0.85倍から現れ（ch19HaloFadeIn）、2.8秒で 0.95倍・85% ⇔ 1.08倍・100% を行き来する（ch19HaloPulse）。
 */
const HALO = 135;
const HALO_PAD = 45; // ぼかしがはみ出す分
function WebHalo() {
  const reduced = useReducedMotion();
  const haloId = useSvgId('ch19halo');
  const blurId = useSvgId('ch19blur');
  const enter = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(enter, { toValue: 1, duration: 600, delay: 550, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
        Animated.timing(pulse, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
      ]),
    );
    intro.start(() => loop.start());
    return () => {
      intro.stop();
      loop.stop();
    };
  }, [reduced, enter, pulse]);
  const opacity = Animated.multiply(enter, pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }));
  const scale = Animated.multiply(
    enter.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
    pulse.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.08] }),
  );
  const size = (HALO + HALO_PAD) * 2;
  return (
    <Animated.View pointerEvents="none" style={[styles.haloWeb, { opacity, transform: [{ scale }] }]}>
      <Svg width={size} height={size}>
        <Defs>
          {/* CSS の radial-gradient(circle) は角までの距離（135×√2）が 100%。25/50/68/80% を半径に直した位置 */}
          <RadialGradient id={haloId} cx={size / 2} cy={size / 2} r={HALO * Math.SQRT2} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.98} />
            <Stop offset="0.25" stopColor="rgb(255,245,200)" stopOpacity={0.8} />
            <Stop offset="0.5" stopColor="rgb(255,215,140)" stopOpacity={0.42} />
            <Stop offset="0.68" stopColor="rgb(255,185,110)" stopOpacity={0.15} />
            <Stop offset="0.8" stopColor="rgb(255,185,110)" stopOpacity={0} />
          </RadialGradient>
          <Filter id={blurId} x="-30%" y="-30%" width="160%" height="160%">
            <FeGaussianBlur stdDeviation={14} />
          </Filter>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={HALO} fill={`url(#${haloId})`} filter={`url(#${blurId})`} />
      </Svg>
    </Animated.View>
  );
}

/**
 * トロフィー（index.html .ch19-trophy-wrap / .ch19-trophy-img）。
 * - ch19BadgeDrop：0.6秒後に 0.6秒で、上 70px・0.85倍 → 下 6px・1.05倍 → 上 2px・0.98倍 → 元の位置
 * - trophy-float：そのあと 3秒で 5px 上下し続ける
 * - M-11：1.3秒後に光が 1回横切る
 */
function WebTrophy({ medal }: { medal: ImageKey }) {
  const reduced = useReducedMotion();
  const drop = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const float = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(drop, { toValue: 1, duration: 600, delay: 600, easing: Easing.linear, useNativeDriver: nativeDriver });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
        Animated.timing(float, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
      ]),
    );
    intro.start(() => loop.start());
    return () => {
      intro.stop();
      loop.stop();
    };
  }, [reduced, drop, float]);
  const translateY = Animated.add(
    drop.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [-70, 6, -2, 0] }),
    float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }),
  );
  const scale = drop.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [0.85, 1.05, 0.98, 1] });
  const opacity = drop.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1, 1] });
  return (
    <Animated.View style={[styles.medalWrapWeb, { opacity, transform: [{ translateY }, { scale }] }]}>
      <Image source={images[medal]} style={styles.medalWeb} resizeMode="contain" />
      <Shine delay={T.shine} />
    </Animated.View>
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
  langWeb: { position: 'absolute', right: 0, zIndex: 10 },
  titleBoxWeb: { height: 69, justifyContent: 'center' },
  titleWeb: { fontSize: 22, lineHeight: 26.4, fontWeight: '700', color: colors.white },
  stageWeb: { width: 180, height: 205, marginTop: 17, alignItems: 'center', justifyContent: 'center' },
  sunburstWeb: { position: 'absolute', width: SUN * 2, height: SUN * 2, left: 90 - SUN, top: 102.5 - SUN },
  haloWeb: { position: 'absolute', left: 90 - HALO - HALO_PAD, top: 102.5 - HALO - HALO_PAD },
  medalWrapWeb: { width: 180, height: 205 },
  medalWeb: { width: 180, height: 205 },
  bodyWeb: { marginTop: 76 },
  footer: { alignSelf: 'stretch', gap: layout.buttonGap },
});
