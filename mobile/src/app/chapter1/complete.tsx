/**
 * 第1章 学習完了（index.html #screen-ch101-complete / .ch101-complete-*）。
 * 背景：#4FBFF1 の円形グラデーション（中心 50% 38%：#79D1FA → #4FBFF1 → #3CA7F1）
 * 放射線：白 24% の光線を 7.5°おきに 24本（外側ほど薄くなる）。ゆっくり回る
 * トロフィーの後ろ：白→水色の後光（直径 270）
 * 縦は中央そろえ：飾り線・タイトル → トロフィー（180×205）→ 解放のお知らせ → 区切り線 → 本文 → 注記 → START（紫・脈動）
 * 登場の順番と紙吹雪は M-13 / M-10 / M-11 / M-12（Appear・Confetti）。
 */
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, G, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { Confetti } from '@/components/Confetti';
import { CtaButton, LangToggle } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { markChapter1Completed } from '@/features/chapter1/progress';
import { DiamondDivider } from '@/features/chapter1/FocusModal';
import { haptics } from '@/lib/haptics';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { useSvgId } from '@/lib/useSvgId';

const RAYS = 24;

export default function Chapter1CompleteScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  const { end } = chapter1;
  const spin = useRef(new Animated.Value(0)).current;
  const ids = { sky: useSvgId('sky'), fade: useSvgId('fade'), rays: useSvgId('rays'), halo: useSvgId('halo') };

  useEffect(() => {
    haptics.success();
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 40000, easing: Easing.linear, useNativeDriver: nativeDriver }));
    loop.start();
    return () => loop.stop();
  }, [reduced, spin]);
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const finish = async () => {
    await markChapter1Completed();
    // Figma のフロー：1章完了 → 2章導線
    router.dismissTo('/');
    router.push('/chapter2');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>
      {/* 背景の円形グラデーション */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
        <Defs>
          <RadialGradient id={ids.sky} cx="50%" cy="38%" r="75%">
            <Stop offset="0" stopColor="#79D1FA" />
            <Stop offset="0.55" stopColor="#4FBFF1" />
            <Stop offset="1" stopColor="#3CA7F1" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill={`url(#${ids.sky})`} />
      </Svg>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />

      <View style={styles.content}>
        <Appear from="none" delay={200} duration={400} style={styles.header}>
          <Image source={images.filigreeTop} style={styles.filigree} resizeMode="contain" />
          <Text style={styles.title}>{tr(end.title)}</Text>
          <Image source={images.filigreeBottom} style={styles.filigree} resizeMode="contain" />
        </Appear>

        <View style={styles.stage}>
          {/* 放射線（.ch101-programmatic-sunburst：直径 880、外側ほど薄く） */}
          <Animated.View pointerEvents="none" style={[styles.sunburst, { transform: [{ rotate }] }]}>
            <Svg width={880} height={880} viewBox="-440 -440 880 880">
              <Defs>
                <RadialGradient id={ids.fade} cx="0" cy="0" r="440" gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
                  <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.5} />
                  <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
                </RadialGradient>
                <Mask id={ids.rays}>
                  <Rect x={-440} y={-440} width={880} height={880} fill={`url(#${ids.fade})`} />
                </Mask>
              </Defs>
              <G mask={`url(#${ids.rays})`}>
                {Array.from({ length: RAYS }, (_, i) => {
                  const a0 = ((i * 15) * Math.PI) / 180;
                  const a1 = ((i * 15 + 7.5) * Math.PI) / 180;
                  return (
                    <Path
                      key={i}
                      d={`M0,0 L${440 * Math.sin(a0)},${-440 * Math.cos(a0)} L${440 * Math.sin(a1)},${-440 * Math.cos(a1)} Z`}
                      fill="rgba(255,255,255,0.24)"
                    />
                  );
                })}
              </G>
            </Svg>
          </Animated.View>
          {/* 後光（.ch101-trophy-halo：直径 270） */}
          <Svg pointerEvents="none" width={270} height={270} style={styles.halo}>
            <Defs>
              <RadialGradient id={ids.halo} cx="50%" cy="50%" r="50%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.98} />
                <Stop offset="0.31" stopColor="#DCF8FF" stopOpacity={0.85} />
                <Stop offset="0.62" stopColor="#8CE1FF" stopOpacity={0.45} />
                <Stop offset="0.85" stopColor="#50C8FF" stopOpacity={0.15} />
                <Stop offset="1" stopColor="#50C8FF" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Circle cx={135} cy={135} r={135} fill={`url(#${ids.halo})`} />
          </Svg>
          <Appear from="drop" delay={600} duration={600} distance={260}>
            <Image source={images.medalChapter1} style={styles.medal} resizeMode="contain" />
          </Appear>
        </View>

        <Appear from="none" delay={1600} duration={300}>
          <Text style={styles.unlocked}>{tr(end.unlockLabel)}</Text>
          <View style={styles.divider}>
            <DiamondDivider color="rgba(255,255,255,0.95)" lineColor="rgba(255,255,255,0.7)" />
          </View>
        </Appear>
        <Appear from="none" delay={1900} duration={300}>
          <Text style={styles.desc}>{tr(end.body)}</Text>
          <Text style={styles.note}>{tr(end.note)}</Text>
        </Appear>
        <Appear from="up" delay={2200} duration={300} style={styles.ctaWrap}>
          <CtaButton testID="chapter1-finish" variant="primary" size="tall" fontSize={17} pulse label={tr(end.button)} onPress={() => void finish()} />
        </Appear>
      </View>
      <Confetti delay={1300} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#4FBFF1', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, overflow: 'hidden' },
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  content: { width: '100%', maxWidth: 360, alignItems: 'center' },
  header: { width: '100%', maxWidth: 320, alignItems: 'center', marginBottom: 6 },
  filigree: { width: 300, height: 15 },
  title: { fontSize: 23, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1, marginVertical: 4, textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  // .ch101-trophy-stage（180×205、上 6・下 14）
  stage: { width: 180, height: 205, marginTop: 6, marginBottom: 14, alignItems: 'center', justifyContent: 'center' },
  sunburst: { position: 'absolute', width: 880, height: 880, left: 90 - 440, top: 102.5 - 440 },
  halo: { position: 'absolute', left: 90 - 135, top: 102.5 - 135 },
  medal: { width: 180, height: 205 },
  unlocked: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', lineHeight: 26.1, textAlign: 'center', marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.15)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  divider: { alignItems: 'center', marginTop: 8 - 10, marginBottom: 12 },
  desc: { fontSize: 13.5, lineHeight: 21.6, color: '#FFFFFF', fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  note: { fontSize: 11, lineHeight: 15.4, color: 'rgba(255,255,255,0.85)', fontWeight: '500', textAlign: 'center' },
  // START は幅 346（index.html の実測）
  ctaWrap: { width: '100%', marginTop: 18, paddingHorizontal: 7 },
});
