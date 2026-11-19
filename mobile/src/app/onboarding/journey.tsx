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
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, FeGaussianBlur, Filter, G, LinearGradient, Polygon, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, LangToggle } from '@/components/ui';
import { journey } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { centered, layout } from '@/theme/layout';
import { nativeDriver, useReducedMotion } from '@/theme/motion';
import { images } from '@/theme/images';
import { useSvgId } from '@/lib/useSvgId';

const ROW_H = 114;

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const reduced = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const steps = journey.steps;
  return (
    <PatternBackground {...patterns.beigeLines} align="center" style={{ paddingTop: insets.top }}>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>{tr(journey.subtitle)}</Text>
        <Text style={styles.title}>{journey.title}</Text>
        <View style={styles.timeline}>
          {/* Vector 13.png：点と点をつなぐ縦線（2×456） */}
          <Image source={images.journeyRail} style={styles.rail} resizeMode="stretch" />
          {steps.map((s, i) => {
            // index.html と同じく、上（ゴール）の部屋から 0.12秒ずつずらして順に出す（journeyRowAppear）
            const d = 80 + i * 120;
            return (
              <Appear key={i} from="up" distance={12} delay={d} duration={400} style={styles.row}>
                {/* 点：0.3倍から弾んで出る（journeyDotPop） */}
                <Appear from="scale" scaleFrom={0.3} delay={d} duration={350} style={styles.dotCol}>
                  <Image source={s.locked ? images.journeyDot : images.journeyDotActive} style={s.locked ? styles.dot : styles.dotActive} />
                </Appear>
                {/* 扉：0.7倍から弾んで出る（journeyDoorPop） */}
                <Appear from="scale" scaleFrom={0.7} delay={d} duration={420} style={styles.doorCol}>
                  {s.locked ? <Image source={images[s.door]} style={styles.door} resizeMode="stretch" /> : <OpenDoor burst={leaving} />}
                </Appear>
                {/* カード：少し右から滑り込む（journeyBubbleSlide） */}
                <Appear from="right" distance={10} delay={d + 40} duration={380} style={[styles.card, s.locked && styles.cardLocked]}>
                  <Text style={[styles.cardTitle, s.locked && styles.lockedText]}>✔︎ {tr(s.title)}</Text>
                  <Text style={[styles.cardDesc, s.locked && styles.lockedText]}>{tr(s.desc)}</Text>
                  {s.locked && <SwayingLock delay={LOCK_DELAYS[i] ?? 900} />}
                </Appear>
              </Appear>
            );
          })}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="onboarding-next"
          variant="primary"
          fontSize={18}
          ledge={{ color: '#4D3CA8', depth: 3 }}
          label={tr(journey.button)}
          disabled={leaving}
          onPress={() => {
            // index.html：扉が大きく開いて光が強くなり、SHOSA が一歩前へ出てから 0.45秒後に進む
            setLeaving(true);
            setTimeout(() => {
              router.push('/onboarding/aptitude-intro');
              setLeaving(false);
            }, reduced ? 0 : 450);
          }}
        />
      </View>
    </PatternBackground>
  );
}

/**
 * 現在地の開いた扉（index.html .journey-door-frame）。
 * 黄色い開口部（12Vector）＋枠（11Vector）、扉板（Group.png 33×101）が開いて、SHOSA がのぞき込む。
 * - 光：扉の左上から右へ広がる台形（5px ぼかし）と、開口部のやわらかい光の輪（10px ぼかし）
 *   doorBeamIn（0.68秒後に 0.65秒）→ doorBeamPulse（3.2秒で明るさと大きさが行き来する）
 * - SHOSA：shosaPeekEntry（0.72秒後に左から）→ shosaPeekBreathe（3秒周期で 2px 上下、影も縮む）
 * - START を押したとき（burst）：扉が大きく開き（door-swing-wide）、光が強くなり（light-burst）、SHOSA が一歩前へ出る
 * 視差効果を減らす ON のときは静止。
 */
function OpenDoor({ burst }: { burst: boolean }) {
  const reduced = useReducedMotion();
  const beamId = useSvgId('beam');
  const glowId = useSvgId('glow');
  const blur5 = useSvgId('blur5');
  const blur10 = useSvgId('blur10');
  const beam = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const panel = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const peek = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  const go = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const anim = Animated.parallel([
      Animated.timing(panel, { toValue: 1, duration: 750, delay: 660, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: nativeDriver }),
      Animated.timing(beam, { toValue: 1, duration: 650, delay: 680, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
      Animated.timing(peek, { toValue: 1, duration: 850, delay: 720, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: nativeDriver }),
    ]);
    const swing = (v: Animated.Value, ms: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
          Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
        ]),
      );
    const pulseLoop = swing(pulse, 3200);
    const breatheLoop = swing(breathe, 1500);
    anim.start(() => {
      pulseLoop.start();
      breatheLoop.start();
    });
    return () => {
      anim.stop();
      pulseLoop.stop();
      breatheLoop.stop();
    };
  }, [reduced, beam, pulse, panel, peek, breathe]);

  // START を押したら 0.4秒で「扉が大きく開く・光が強くなる・SHOSA が一歩前へ」
  useEffect(() => {
    if (!burst) return;
    Animated.timing(go, { toValue: 1, duration: 400, easing: Easing.bezier(0.1, 0.9, 0.2, 1), useNativeDriver: nativeDriver }).start();
  }, [burst, go]);

  const beamOpacity = Animated.add(
    Animated.multiply(beam, pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] })),
    go.interpolate({ inputRange: [0, 1], outputRange: [0, 0.35] }),
  );
  const beamScale = Animated.multiply(
    Animated.multiply(beam.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }), pulse.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] })),
    go.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] }),
  );
  const shosaX = Animated.add(
    peek.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }),
    go.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
  );
  return (
    <>
      {/* 光（140×150、扉の左上から右へ。ぼかしがはみ出すよう、まわりに 20 の余白を取って描く） */}
      <Animated.View pointerEvents="none" style={[styles.beam, { opacity: beamOpacity, transform: [{ scale: beamScale }] }]}>
        <Svg width={180} height={190}>
          <Defs>
            <LinearGradient id={beamId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="rgb(255,246,160)" stopOpacity={0.78} />
              <Stop offset="0.35" stopColor="rgb(255,240,140)" stopOpacity={0.58} />
              <Stop offset="0.65" stopColor="rgb(255,235,120)" stopOpacity={0.28} />
              <Stop offset="0.85" stopColor="rgb(255,230,100)" stopOpacity={0.08} />
              <Stop offset="1" stopColor="rgb(255,230,100)" stopOpacity={0} />
            </LinearGradient>
            <RadialGradient id={glowId} cx="20%" cy="50%" rx="85%" ry="60%">
              <Stop offset="0" stopColor="rgb(255,252,195)" stopOpacity={0.85} />
              <Stop offset="0.38" stopColor="rgb(255,240,150)" stopOpacity={0.48} />
              <Stop offset="0.65" stopColor="rgb(255,225,110)" stopOpacity={0.15} />
              <Stop offset="0.82" stopColor="rgb(255,225,110)" stopOpacity={0} />
            </RadialGradient>
            <Filter id={blur5} x="-30%" y="-30%" width="160%" height="160%">
              <FeGaussianBlur stdDeviation={5} />
            </Filter>
            <Filter id={blur10} x="-40%" y="-40%" width="180%" height="180%">
              <FeGaussianBlur stdDeviation={10} />
            </Filter>
          </Defs>
          <G x={20} y={20}>
            <Polygon points="0,32 140,0 140,150 0,125" fill={`url(#${beamId})`} filter={`url(#${blur5})`} />
            <Rect x={0} y={15} width={120} height={120} fill={`url(#${glowId})`} filter={`url(#${blur10})`} />
          </G>
        </Svg>
      </Animated.View>
      <View style={styles.opening}>
        <Image source={images.journeyDoorway} style={styles.door} resizeMode="stretch" />
        <Image source={images.journeyDoorwayFrame} style={[styles.door, StyleSheet.absoluteFill]} resizeMode="stretch" />
      </View>
      {/* SHOSA が左から少し動いてのぞき（shosaPeekEntry）、そのあと小さく呼吸する */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shosaWrap,
          { opacity: peek, transform: [{ translateX: shosaX }, { scale: go.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] },
        ]}
      >
        <Animated.Image
          source={images.journeyShosaShadow}
          style={[
            styles.shosaShadow,
            {
              opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.95, 0.75] }),
              transform: [{ scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 0.92] }) }],
            },
          ]}
          resizeMode="stretch"
        />
        <Animated.Image
          source={images.mascotSmall}
          style={[styles.shosa, { transform: [{ translateY: breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }] }]}
          resizeMode="contain"
        />
      </Animated.View>
      {/* 扉板（doorSwingIn：右から縮んだ状態で開く。START で大きく開く door-swing-wide） */}
      <Animated.Image
        source={images.journeyDoorPanel}
        style={[
          styles.doorPanel,
          {
            opacity: panel,
            transform: [
              { translateX: Animated.add(panel.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }), go.interpolate({ inputRange: [0, 1], outputRange: [0, -6] })) },
              { scaleX: Animated.multiply(panel.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }), go.interpolate({ inputRange: [0, 1], outputRange: [1, 0.85] })) },
            ],
          },
        ]}
        resizeMode="stretch"
      />
    </>
  );
}

/** index.html .journey-card-lock の開始時刻（上の行から 0.9 / 1.7 / 2.5 / 2.4 秒） */
const LOCK_DELAYS = [900, 1700, 2500, 2400];

/**
 * 鍵がときどき小さく揺れる（index.html lockJiggle：3.5秒周期。80% までは止まっていて、
 * そのあと -13° → 11° → -7° → 4° → 0° と揺れる）。視差効果を減らす ON のときは静止。
 */
function SwayingLock({ delay }: { delay: number }) {
  const reduced = useReducedMotion();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const step = (deg: number) => Animated.timing(v, { toValue: deg, duration: 105, useNativeDriver: nativeDriver });
    const loop = Animated.loop(
      Animated.sequence([Animated.delay(2800), step(-13), step(11), step(-7), step(4), Animated.timing(v, { toValue: 0, duration: 280, useNativeDriver: nativeDriver })]),
    );
    const all = Animated.sequence([Animated.delay(delay), loop]);
    all.start();
    return () => all.stop();
  }, [reduced, v, delay]);
  const rotate = v.interpolate({ inputRange: [-13, 13], outputRange: ['-13deg', '13deg'] });
  return <Animated.Image source={images.lockKey} style={[styles.lock, { transform: [{ rotate }] }]} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  scroll: { ...centered, paddingHorizontal: layout.sideMargin, paddingTop: 23, paddingBottom: 16 },
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
  // .journey-door-programmatic-light：left 0・top -28・140×150（SVG はぼかし用に 20 の余白つき）
  beam: { position: 'absolute', left: -20, top: -48, width: 180, height: 190 },
  shosaWrap: { position: 'absolute', left: 16, bottom: 2, width: 58, height: 55 },
  shosaShadow: { position: 'absolute', left: 14, bottom: 0, width: 35, height: 10 },
  shosa: { position: 'absolute', left: 0, bottom: 1, width: 58, height: 52 },
  doorPanel: { position: 'absolute', left: -2, top: 0, width: 33, height: 101 },
  // index.html：カードの中身は縦の中央にそろえる（題名が2行でも 1行でも）
  card: { width: 247, height: 89, marginLeft: 21, backgroundColor: colors.white, borderRadius: 6, paddingLeft: 20, paddingRight: 19, justifyContent: 'center' },
  cardLocked: { backgroundColor: '#E0E0E0' },
  cardTitle: { fontSize: 14, lineHeight: 16, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 12, lineHeight: 14, color: colors.black, marginTop: 6 },
  lockedText: { color: '#5D5D5D' },
  lock: { position: 'absolute', right: -8, top: -10, width: 24, height: 32 },
  bottom: { ...centered, paddingHorizontal: layout.sideMargin, paddingTop: 8 },
});
