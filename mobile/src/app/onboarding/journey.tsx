/**
 * YOUR JOURNEY（index.html #screen-ob-journey、Figma CH0-18）。
 * ゴール（401）から現在地（適職診断）までの部屋を、縦の線でつないで並べる。
 * - 見出し：上端 23 に副題（12px）、その下 8 に「YOUR JOURNEY」（Montserrat 30px、#B09D79）
 * - 行：上端 96 から高さ 114 ずつ。左から 点（18、現在地は 26）→ 扉（54×101）→ カード（247×89、角丸 6）
 * - 鍵付きの部屋はカードが #E0E0E0・文字が #5D5D5D、右上に鍵（24×32）
 * - 現在地の扉は開いていて、光がもれ、SHOSA がのぞいている
 * index.html では戻るボタンがあるが、M-31 に合わせて出していない。
 */
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Ellipse, LinearGradient, Polygon, RadialGradient, Stop } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, LangToggle } from '@/components/ui';
import { journey } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { layout } from '@/theme/layout';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { images } from '@/theme/images';

const ROW_H = 114;

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const steps = journey.steps;
  return (
    <PatternBackground {...patterns.beigeLines} style={{ paddingTop: insets.top }}>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{tr(journey.subtitle)}</Text>
        <Text style={styles.title}>{journey.title}</Text>
        <View style={styles.timeline}>
          {/* Vector 13.png：点と点をつなぐ縦線（2×456） */}
          <Image source={images.journeyRail} style={styles.rail} resizeMode="stretch" />
          {steps.map((s, i) => (
            // 要点 CH0-18：部屋が下（現在地）から順に出る
            <Appear key={i} from="up" delay={(steps.length - 1 - i) * 120} duration={300} style={styles.row}>
              <View style={styles.dotCol}>
                <Image source={s.locked ? images.journeyDot : images.journeyDotActive} style={s.locked ? styles.dot : styles.dotActive} />
              </View>
              <View style={styles.doorCol}>{s.locked ? <Image source={images[s.door]} style={styles.door} resizeMode="stretch" /> : <OpenDoor />}</View>
              <View style={[styles.card, s.locked && styles.cardLocked]}>
                <Text style={[styles.cardTitle, s.locked && styles.lockedText]}>✔︎ {tr(s.title)}</Text>
                <Text style={[styles.cardDesc, s.locked && styles.lockedText]}>{tr(s.desc)}</Text>
                {s.locked && <SwayingLock />}
              </View>
            </Appear>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="onboarding-next"
          variant="primary"
          fontSize={18}
          ledge={{ color: '#4D3CA8', depth: 3 }}
          label={tr(journey.button)}
          onPress={() => router.push('/onboarding/aptitude-intro')}
        />
      </View>
    </PatternBackground>
  );
}

/**
 * 現在地の開いた扉（index.html .journey-door-frame）。
 * 黄色い開口部（12Vector）＋枠（11Vector）、扉板（Group.png 33×101）が開いて、SHOSA がのぞき込む。
 * 開口部から右へ光がもれる（doorBeamIn → doorBeamPulse）。視差効果を減らす ON のときは静止。
 */
function OpenDoor() {
  const reduced = useReducedMotion();
  const beam = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const panel = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const peek = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    const anim = Animated.parallel([
      Animated.timing(panel, { toValue: 1, duration: 600, delay: 300, easing: Easing.out(Easing.cubic), useNativeDriver: nativeDriver }),
      Animated.timing(beam, { toValue: 1, duration: 600, delay: 450, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
      Animated.timing(peek, { toValue: 1, duration: 850, delay: 720, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: nativeDriver }),
    ]);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: nativeDriver }),
      ]),
    );
    anim.start(() => loop.start());
    return () => {
      anim.stop();
      loop.stop();
    };
  }, [reduced, beam, pulse, panel, peek]);

  const beamOpacity = Animated.multiply(beam, pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }));
  const beamScale = Animated.multiply(
    beam.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }),
    pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] }),
  );
  return (
    <>
      {/* 光（138×148、扉の左上から右へ広がる台形＋やわらかい光の輪） */}
      <Animated.View pointerEvents="none" style={[styles.beam, { opacity: beamOpacity, transform: [{ scale: beamScale }] }]}>
        <Svg width={138} height={148}>
          <Defs>
            <LinearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="rgb(255,246,160)" stopOpacity={0.78} />
              <Stop offset="0.35" stopColor="rgb(255,240,140)" stopOpacity={0.58} />
              <Stop offset="0.65" stopColor="rgb(255,235,120)" stopOpacity={0.28} />
              <Stop offset="0.85" stopColor="rgb(255,230,100)" stopOpacity={0.08} />
              <Stop offset="1" stopColor="rgb(255,230,100)" stopOpacity={0} />
            </LinearGradient>
            <RadialGradient id="glow" cx="20%" cy="50%" r="60%">
              <Stop offset="0" stopColor="rgb(255,252,195)" stopOpacity={0.85} />
              <Stop offset="0.38" stopColor="rgb(255,240,150)" stopOpacity={0.48} />
              <Stop offset="0.65" stopColor="rgb(255,225,110)" stopOpacity={0.15} />
              <Stop offset="0.82" stopColor="rgb(255,225,110)" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Polygon points="0,32 138,0 138,148 0,125" fill="url(#beam)" />
          <Ellipse cx={60} cy={75} rx={60} ry={60} fill="url(#glow)" />
        </Svg>
      </Animated.View>
      <View style={styles.opening}>
        <Image source={images.journeyDoorway} style={styles.door} resizeMode="stretch" />
        <Image source={images.journeyDoorwayFrame} style={[styles.door, StyleSheet.absoluteFill]} resizeMode="stretch" />
      </View>
      {/* SHOSA が左から少し動いてのぞく（shosaPeekEntry） */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shosaWrap,
          { opacity: peek, transform: [{ translateX: peek.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }] },
        ]}
      >
        <Image source={images.journeyShosaShadow} style={styles.shosaShadow} resizeMode="stretch" />
        <Image source={images.mascotSmall} style={styles.shosa} resizeMode="contain" />
      </Animated.View>
      {/* 扉板（doorSwingIn：右から縮んだ状態で開く） */}
      <Animated.Image
        source={images.journeyDoorPanel}
        style={[
          styles.doorPanel,
          {
            opacity: panel,
            transform: [
              { translateX: panel.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              { scaleX: panel.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
            ],
          },
        ]}
        resizeMode="stretch"
      />
    </>
  );
}

/** 要点 CH0-18：ロックの鍵が小さく揺れる（視差効果を減らす ON のときは静止） */
function SwayingLock() {
  const reduced = useReducedMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 120, useNativeDriver: nativeDriver }),
        Animated.timing(v, { toValue: -1, duration: 240, useNativeDriver: nativeDriver }),
        Animated.timing(v, { toValue: 0, duration: 120, useNativeDriver: nativeDriver }),
        Animated.delay(2200),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, v]);
  const rotate = v.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] });
  return <Animated.Image source={images.lockKey} style={[styles.lock, { transform: [{ rotate }] }]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  scroll: { paddingHorizontal: layout.sideMargin, paddingTop: 23, paddingBottom: 16 },
  subtitle: { fontSize: 12, lineHeight: 16, color: colors.black, textAlign: 'center' },
  title: { fontFamily: fonts.montserrat, fontSize: 30, lineHeight: 30, color: '#B09D79', letterSpacing: 1, textAlign: 'center', marginTop: 8 },
  // .journey-timeline-container：上端 96（タイトルの下 19）
  timeline: { marginTop: 19 },
  rail: { position: 'absolute', left: 12, top: 57, width: 2, height: 456 },
  row: { height: ROW_H, flexDirection: 'row', alignItems: 'center' },
  dotCol: { width: 26, alignItems: 'center' },
  dot: { width: 18, height: 18 },
  dotActive: { width: 26, height: 26 },
  doorCol: { width: 54, height: 101, marginLeft: 12 },
  door: { position: 'absolute', top: 4, left: 0, width: 54, height: 93 },
  opening: { position: 'absolute', top: 4, left: 0, width: 54, height: 93, overflow: 'hidden' },
  beam: { position: 'absolute', left: 1, top: -27, width: 138, height: 148 },
  shosaWrap: { position: 'absolute', left: 16, bottom: 2, width: 58, height: 55 },
  shosaShadow: { position: 'absolute', left: 14, bottom: 0, width: 35, height: 10 },
  shosa: { position: 'absolute', left: 0, bottom: 1, width: 58, height: 52 },
  doorPanel: { position: 'absolute', left: -2, top: 0, width: 33, height: 101 },
  card: { width: 247, height: 89, marginLeft: 21, backgroundColor: colors.white, borderRadius: 6, paddingTop: 20, paddingLeft: 20, paddingRight: 19 },
  cardLocked: { backgroundColor: '#E0E0E0' },
  cardTitle: { fontSize: 14, lineHeight: 16, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 12, lineHeight: 14, color: colors.black, marginTop: 6 },
  lockedText: { color: '#5D5D5D' },
  lock: { position: 'absolute', right: -8, top: -10, width: 24, height: 32 },
  bottom: { paddingHorizontal: layout.sideMargin, paddingTop: 8 },
});
