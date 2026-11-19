/**
 * 完了画面の共通演出（0章「適性診断 完了！」/ 1章「学習完了！」/ 2章「診断完了！」）。
 * M-13 の順番で出す（全体 2.5秒以内）：
 *   背景 → タイトル（0.2秒）→ バッジ（M-10：0.6秒後に上から落ちて小さく弾む）
 *   → 光（M-11）と紙吹雪（M-12）（1.3秒後・1回だけ）→ 本文など（1.6秒から 0.3秒おき）→ ボタン（脈動 1.5秒周期）
 * 要点 CH0-19：背景の放射線がゆっくり回る。成功の触覚を1回。
 * M-04：視差効果を減らす ON のときは、落下・回転・光・紙吹雪なしでフェードだけ。
 */
import { Children, useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
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
 * トロフィーの後ろの放射線（Figma の bg3：直径 540）。白 28% の光線が 12本、30° おきで、1本の幅は約 12°（太くて少ない）。
 * 外のふちだけ、ゆるやかに消える（半径の 80% まではそのまま）。
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
          <RadialGradient id={fadeId} cx={0} cy={0} r={SUN} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="0.8" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
          </RadialGradient>
          <Mask id={maskId} x={-SUN} y={-SUN} width={SUN * 2} height={SUN * 2} maskUnits="userSpaceOnUse">
            <Rect x={-SUN} y={-SUN} width={SUN * 2} height={SUN * 2} fill={`url(#${fadeId})`} />
          </Mask>
        </Defs>
        <G mask={`url(#${maskId})`}>
          {Array.from({ length: 12 }, (_, i) => {
            // 上（0°）を中心に、左右 6° ずつ（幅 12°）
            const a0 = ((i * 30 - 6) * Math.PI) / 180;
            const a1 = ((i * 30 + 6) * Math.PI) / 180;
            return (
              <Path
                key={i}
                d={`M0,0 L${SUN * Math.sin(a0)},${-SUN * Math.cos(a0)} A${SUN},${SUN} 0 0 1 ${SUN * Math.sin(a1)},${-SUN * Math.cos(a1)} Z`}
                fill="rgba(255,255,255,0.28)"
              />
            );
          })}
        </G>
      </Svg>
    </Animated.View>
  );
}

/**
 * トロフィーの後ろの白い光（index.html .ch19-trophy-halo をもとに、白いもやとして強めたもの）。どの背景色でも白く見えるようにしている。
 * - 内側の後光：直径 270 の白（中心 98% → 外へ消える）を 18px ぼかす。0.55秒後に 0.85倍から現れ、2.4秒で
 *   55% ⇔ 100%・0.92倍 ⇔ 1.2倍 を行き来する（最大のときを強く、脈動をはっきり見せる）
 * - 外側のもや：直径 330 の白（中心 40%）を 24px ぼかし、後光と逆の位相で 1.15倍 ⇔ 0.95倍・70% ⇔ 30% に脈動する
 */
const HALO = 135;
const HALO_PAD = 55; // ぼかしがはみ出す分
const MIST = 165;
const MIST_PAD = 70;
function WebHalo() {
  const reduced = useReducedMotion();
  const haloId = useSvgId('ch19halo');
  const blurId = useSvgId('ch19blur');
  const mistId = useSvgId('ch19mist');
  const mistBlurId = useSvgId('ch19mistblur');
  const enter = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(enter, { toValue: 1, duration: 600, delay: 550, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver });
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
        Animated.timing(pulse, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
      ]),
    );
    intro.start(() => loop.start());
    return () => {
      intro.stop();
      loop.stop();
    };
  }, [reduced, enter, pulse]);
  const opacity = Animated.multiply(enter, pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }));
  const scale = Animated.multiply(
    enter.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
    pulse.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.2] }),
  );
  const mistOpacity = Animated.multiply(enter, pulse.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0.35] }));
  const mistScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1.15, 0.95] });
  const size = (HALO + HALO_PAD) * 2;
  const mistSize = (MIST + MIST_PAD) * 2;
  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.mistWeb, { opacity: mistOpacity, transform: [{ scale: mistScale }] }]}>
        <Svg width={mistSize} height={mistSize}>
          <Defs>
            <RadialGradient id={mistId} cx={mistSize / 2} cy={mistSize / 2} r={MIST} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.55} />
              <Stop offset="0.55" stopColor="#FFFFFF" stopOpacity={0.32} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <Filter id={mistBlurId} x="-30%" y="-30%" width="160%" height="160%">
              <FeGaussianBlur stdDeviation={24} />
            </Filter>
          </Defs>
          <Circle cx={mistSize / 2} cy={mistSize / 2} r={MIST} fill={`url(#${mistId})`} filter={`url(#${mistBlurId})`} />
        </Svg>
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.haloWeb, { opacity, transform: [{ scale }] }]}>
        <Svg width={size} height={size}>
          <Defs>
            <RadialGradient id={haloId} cx={size / 2} cy={size / 2} r={HALO * Math.SQRT2} gradientUnits="userSpaceOnUse">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
              <Stop offset="0.25" stopColor="#FFFFFF" stopOpacity={0.92} />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.58} />
              <Stop offset="0.68" stopColor="#FFFFFF" stopOpacity={0.26} />
              <Stop offset="0.86" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <Filter id={blurId} x="-30%" y="-30%" width="160%" height="160%">
              <FeGaussianBlur stdDeviation={18} />
            </Filter>
          </Defs>
          <Circle cx={size / 2} cy={size / 2} r={HALO} fill={`url(#${haloId})`} filter={`url(#${blurId})`} />
        </Svg>
      </Animated.View>
    </>
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

/**
 * 解放の文言と本文の間の区切り線（Figma の frames：幅 240×13）。assets の frames.png（#E6D8BD）を白く着色して使う。
 * 星形のきらめき 7つ（中央ほど大きい）と、先の細くなる左右の線。
 */
export function CelebrationDivider({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ alignSelf: 'center', marginTop: 8 }, style]}>
      <Image source={images.frames} style={{ width: 240, height: 13 }} resizeMode="contain" tintColor={colors.white} />
    </View>
  );
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
  titleWeb: { fontSize: 22, lineHeight: 26.4, fontWeight: '700', color: colors.white, textAlign: 'center' },
  stageWeb: { width: 180, height: 205, marginTop: 17, alignItems: 'center', justifyContent: 'center' },
  sunburstWeb: { position: 'absolute', width: SUN * 2, height: SUN * 2, left: 90 - SUN, top: 102.5 - SUN },
  haloWeb: { position: 'absolute', left: 90 - HALO - HALO_PAD, top: 102.5 - HALO - HALO_PAD },
  mistWeb: { position: 'absolute', left: 90 - MIST - MIST_PAD, top: 102.5 - MIST - MIST_PAD },
  medalWrapWeb: { width: 180, height: 205 },
  medalWeb: { width: 180, height: 205 },
  bodyWeb: { marginTop: 76 },
  footer: { alignSelf: 'stretch', gap: layout.buttonGap },
});
