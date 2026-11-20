/**
 * イントロスライド 4枚（index.html #screen-ob-intro / .intro-slide）。
 * ターコイズ柄の背景（160px タイル）に、上端 196 から楕円アーチ（横半径 201・縦半径 107.5）のクリーム色パネルが重なる。
 * - 見出し：上端 89（WELCOME は 81）、白 18px、下に白いひし形の区切り線（240×12）
 * - 図：パネル上端から 44（手順カードと検定表は 66〜67）
 * - 本文：パネル上端から 371 で始まる（WELCOME だけは画像の下 33）
 * - ボタン：下から 32。START（1枚目）は紫、それ以外はターコイズの立体ボタン
 * index.html と同じく、見出し・パネルはセーフエリアに関係なく画面上端から置く（EN と下のボタンだけセーフエリアを空ける）。
 * index.html では戻るボタンがあるが、M-31 に合わせて出していない。
 */
import { useEffect, useRef } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Animated, Easing, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { G, Path, SvgXml } from 'react-native-svg';
import { Appear } from '@/components/Appear';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, LangToggle } from '@/components/ui';
import { intro, introSlideCount } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { layout } from '@/theme/layout';
import { images } from '@/theme/images';
import { useReducedMotion } from '@/theme/motion';
import { svgIcons } from '@/theme/svgIcons';

/** パネルの上端（画面上端から） */
const PANEL_TOP = 196;
/** 本文の開始位置（パネル上端から） */
const BODY_TOP = 371;

export default function IntroSlideScreen() {
  const { slide: raw } = useLocalSearchParams<{ slide: string }>();
  const insets = useSafeAreaInsets();
  const { lang, tr } = useLang();
  const en = lang === 'en';
  const index = Number(raw);
  if (!Number.isInteger(index) || index < 0 || index >= introSlideCount) return <Redirect href="/onboarding/language" />;

  const next = () => {
    if (index + 1 < introSlideCount) router.push({ pathname: '/onboarding/intro/[slide]', params: { slide: String(index + 1) } });
    else router.push('/onboarding/greet');
  };

  const kind = (['welcome', 'features', 'steps', 'certification'] as const)[index]!;
  const data = intro[kind];
  const isWelcome = kind === 'welcome';

  return (
    <PatternBackground {...patterns.turquoiseSmall}>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />
      {isWelcome ? (
        <View style={[styles.welcomeHead, { top: 81 }]}>
          <Text style={styles.badge}>{tr(intro.welcome.badge)}</Text>
          <Image source={images.logoWhite} style={styles.logo} resizeMode="contain" />
        </View>
      ) : (
        <View style={[styles.head, { top: 89 }]}>
          <Text style={[styles.title, en && styles.titleEn]}>{tr(data.title)}</Text>
          {/* Figma の frames（240×12.5、#E6D8BD）：きらめき 7つと先の細い左右の線 */}
          <Image source={images.frames} style={styles.divider} resizeMode="contain" tintColor="#E6D8BD" />
        </View>
      )}

      {/* 要点 CH0-03〜06：アーチのパネルが下からせり上がる */}
      <Appear from="rise" duration={500} distance={120} style={[styles.panel, { top: PANEL_TOP }]}>
        <Svg style={styles.arch} width="100%" height={108} viewBox="0 0 402 108" preserveAspectRatio="none" pointerEvents="none">
          <Path d="M0,107.5 A201,107.5 0 0 1 402,107.5 L402,108 L0,108 Z" fill={colors.beige} />
        </Svg>
        <View style={styles.panelBody} />
        {kind === 'welcome' && <WelcomeBody />}
        {kind === 'features' && <FeaturesBody />}
        {kind === 'steps' && <StepsBody />}
        {kind === 'certification' && <CertificationBody />}
      </Appear>

      <View style={[styles.bottom, { bottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="onboarding-next"
          label={tr(data.button)}
          variant={isWelcome ? 'primary' : 'next'}
          fontSize={18}
          ledge={isWelcome ? { color: '#4D3CA8', depth: 4 } : { color: colors.teal, depth: 3 }}
          onPress={next}
        />
      </View>
    </PatternBackground>
  );
}

function WelcomeBody() {
  const { lang, tr } = useLang();
  const en = lang === 'en';
  return (
    <View style={styles.welcomeBody}>
      <Image source={images.intro1Hero} style={styles.phoneHero} resizeMode="contain" />
      <View style={styles.welcomeTextArea}>
        <Text style={[styles.welcomeTitle, en && styles.welcomeTitleEn]}>{tr(intro.welcome.title)}</Text>
      </View>
    </View>
  );
}

/** CH0-04：スマホ（160×297）の左右に 4機能の吹き出し（107×93） */
function FeaturesBody() {
  const { lang, tr } = useLang();
  const en = lang === 'en';
  const bubbles = [images.introBubbleTl, images.introBubbleTr, images.introBubbleBl, images.introBubbleBr];
  return (
    <>
      <View style={styles.phone}>
        <SvgXml xml={svgIcons.phone} width={160} height={297} />
      </View>
      {bubbles.map((src, i) => {
        const left = i % 2 === 0;
        return (
          // index.html lineExtend：左上 → 右上 → 左下 → 右下の順に、0.15秒から 0.2秒ずつずらして 0.6倍から弾んで出る
          <Appear
            key={i}
            from="scale"
            scaleFrom={0.6}
            delay={150 + i * 200}
            duration={600}
            style={[styles.bubble, left ? { left: 31 } : { right: 31 }, { top: i < 2 ? 104 : 224 }]}
          >
            <Image source={src} style={styles.bubbleImg} resizeMode="contain" />
            {/* 吹き出しのしっぽ側をよけて、左は 7・右は 24 から幅 76 */}
            <Text style={[styles.bubbleLabel, en && styles.bubbleLabelEn, { left: left ? 7 : 24 }]}>{tr(intro.features.labels[i]!)}</Text>
          </Appear>
        );
      })}
      <View style={styles.body}>
        <Text style={[styles.bodyText, en && styles.bodyTextEn]}>{tr(intro.features.lead)}</Text>
        <Text style={[styles.bodyText, en && styles.bodyTextEn, { marginTop: 17 }]}>{tr(intro.features.sub)}</Text>
      </View>
    </>
  );
}

/** CH0-05：Frame 342 を敷いた白いカード（326×284）に、縦線でつないだ 4項目 */
function StepsBody() {
  const { lang, tr } = useLang();
  const en = lang === 'en';
  return (
    <>
      <View style={styles.stepsCard}>
        <StepsCardCorners />
        <View style={styles.stepsLine} />
        {intro.steps.items.map((s, i) => (
          // index.html ch05RowAppear / ch05IconPop：上の項目から 0.2秒ずつずらして出る（アイコンは 0.3倍から弾む）
          <Appear key={i} from="up" distance={8} delay={200 + i * 200} duration={500} style={styles.stepRow}>
            <Appear from="scale" scaleFrom={0.3} delay={200 + i * 200} duration={550}>
              <Image source={images[s.icon]} style={styles.stepIcon} resizeMode="contain" />
            </Appear>
            <Text style={[styles.stepHead, en && styles.stepHeadEn]}>
              {tr(s.head)}
              {lang === 'en' ? ':' : ''}
            </Text>
            <Text style={[styles.stepBody, en && styles.stepBodyEn]}>{tr(s.body)}</Text>
          </Appear>
        ))}
      </View>
      <View style={[styles.body, styles.bodyWide]}>
        <Text style={[styles.bodyText, en && styles.bodyTextEn]}>{tr(intro.steps.desc)}</Text>
      </View>
    </>
  );
}

/** Figma CH0-05 の Frame 119 の四隅の飾り（Group 258〜261、#E6D8BD）。左上の形を左右・上下に反転して置く */
const CORNER_PATHS = [
  'M10.59,8.07C11.27,8.63 12.37,9.23 13.17,9.67C14.2,10.24 15.27,10.75 16.39,11.12C18.43,11.81 20.85,12.09 22.69,10.74C24.2,9.63 24.96,7.64 24.48,5.82C21.7,8.35 15.48,9.43 10.6,8.07Z',
  'M8.07,10.59C8.63,11.27 9.23,12.37 9.67,13.17C10.24,14.2 10.75,15.27 11.12,16.39C11.81,18.43 12.09,20.85 10.74,22.69C9.63,24.2 7.64,24.96 5.82,24.49C8.35,21.7 9.43,15.48 8.07,10.6Z',
  'M22.06,22.06C20.69,22.11 15.32,20.06 14.5,19.54C13.11,18.23 11.81,12.84 9.33,9.33C12.84,11.81 18.23,13.11 19.54,14.5C20.06,15.31 22.11,20.68 22.06,22.06Z',
];
const CORNER_TRANSFORMS = ['translate(1 1)', 'matrix(-1 0 0 1 339 1)', 'matrix(1 0 0 -1 1 273)', 'matrix(-1 0 0 -1 339 273)'];

function StepsCardCorners() {
  return (
    <Svg style={styles.stepsCorners} width={340} height={274} viewBox="0 0 340 274" pointerEvents="none">
      {CORNER_TRANSFORMS.map((t) => (
        <G key={t} transform={t}>
          {CORNER_PATHS.map((d) => (
            <Path key={d} d={d} fill="#E6D8BD" />
          ))}
        </G>
      ))}
    </Svg>
  );
}

/** CH0-06：検定表（Frame 170）に、評価が領域ごとに書き込まれていく */
function CertificationBody() {
  const { lang, tr } = useLang();
  const en = lang === 'en';
  const c = intro.certification;
  return (
    <>
      <ReportReveal />
      <View style={[styles.body, { paddingHorizontal: 0 }]}>
        <View style={{ paddingHorizontal: 34 }}>
          <Text style={[styles.bodyText, en && styles.bodyTextEn]}>{tr(c.reportLead)}</Text>
          <View style={styles.badgeRow}>
            {c.badges.map((b, i) => (
              <View key={i} style={[styles.badgePill, en && styles.badgePillEn]}>
                <Svg width={16} height={16} viewBox="0 0 16 16">
                  <Path d="M2.5 8.5l3.5 3.5 7.5-7.5" fill="none" stroke={colors.teal} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
                <Text style={[styles.badgeText, en && styles.badgeTextEn]}>{tr(b)}</Text>
              </View>
            ))}
          </View>
          {tr(c.reportTail) !== '' && <Text style={[styles.bodyText, en && styles.bodyTextEn, { marginTop: 7 }]}>{tr(c.reportTail)}</Text>}
        </View>
        <View style={[styles.bodyWide, { marginTop: 17 }]}>
          <Text style={[styles.bodyText, en && styles.bodyTextEn]}>{tr(c.desc)}</Text>
        </View>
      </View>
    </>
  );
}

/**
 * index.html の ch06 アニメーション：
 * 0.3秒 総合評価の円が広がる → 1.1秒 Performance が左から → 2.0/2.35/2.7秒 Potential の3行 → 3.9秒 完成画像がフェードイン。
 * 視差効果を減らす ON のときは完成画像だけを出す。
 */
const REPORT_W = 340;
const REPORT_H = 275;
const ease = Easing.bezier(0.16, 1, 0.3, 1);

function ReportReveal() {
  const reduced = useReducedMotion();
  const score = useRef(new Animated.Value(0)).current;
  const perf = useRef(new Animated.Value(0)).current;
  const pot = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const final = useRef(new Animated.Value(reduced ? 1 : 0)).current;

  useEffect(() => {
    if (reduced) return;
    const t = (v: Animated.Value, duration: number, delay: number, easing = ease) =>
      Animated.timing(v, { toValue: 1, duration, delay, easing, useNativeDriver: false });
    const anim = Animated.parallel([
      t(score, 3000, 300),
      t(perf, 1500, 1100),
      t(pot[0]!, 1100, 2000),
      t(pot[1]!, 1100, 2350),
      t(pot[2]!, 1100, 2700),
      t(final, 800, 3900, Easing.out(Easing.quad)),
    ]);
    anim.start();
    return () => anim.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /** 完成画像の一部だけを見せる窓 */
  const windowOf = (x: number, y: number, w: Animated.AnimatedInterpolation<number> | number, h: number, key: string, extra?: object) => (
    <Animated.View key={key} style={[styles.reportWindow, { left: x, top: y, width: w, height: h }, extra]}>
      <Image source={images.intro4Report} style={[styles.reportImg, { left: -x, top: -y }]} resizeMode="contain" />
    </Animated.View>
  );
  const r = score.interpolate({ inputRange: [0, 1], outputRange: [0, 36] });

  return (
    <View style={styles.report}>
      <Image source={images.intro4ReportBase} style={styles.reportBase} resizeMode="contain" />
      {!reduced && (
        <>
          {/* 円：中心 (40,93)、半径 0 → 36 */}
          <Animated.View
            style={[
              styles.reportWindow,
              {
                left: Animated.subtract(40, r),
                top: Animated.subtract(93, r),
                width: Animated.multiply(r, 2),
                height: Animated.multiply(r, 2),
                borderRadius: 36,
              },
            ]}
          >
            <Animated.Image
              source={images.intro4Report}
              style={[styles.reportImg, { left: Animated.subtract(r, 40), top: Animated.subtract(r, 93) }]}
              resizeMode="contain"
            />
          </Animated.View>
          {windowOf(118, 60, perf.interpolate({ inputRange: [0, 1], outputRange: [0, REPORT_W - 118 - 8] }), REPORT_H - 60 - 117, 'perf')}
          {[190, 205, 220].map((y, i) =>
            windowOf(160, y, pot[i]!.interpolate({ inputRange: [0, 1], outputRange: [0, REPORT_W - 160 - 17] }), 15, `pot${i}`),
          )}
        </>
      )}
      <Animated.Image source={images.intro4Report} style={[styles.reportImg, { left: 0, top: 0, opacity: final }]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  welcomeHead: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  badge: { fontFamily: fonts.montserrat, fontSize: 18, lineHeight: 24, color: colors.white, letterSpacing: 1, marginBottom: 11 },
  logo: { width: 200, height: 58 },
  head: { position: 'absolute', left: 21, right: 21, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: colors.white, textAlign: 'center', lineHeight: 27 },
  // index.html の英語（.is-en）：見出し 17px・行の高さ 25、本文 15px・行の高さ 22・幅 360、ラベル 11px、手順の項目 14.5px・説明 12px
  titleEn: { fontSize: 17, lineHeight: 25 },
  divider: { width: 240, height: 13, marginTop: 10 },
  panel: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  arch: { position: 'absolute', top: 0, left: 0 },
  panelBody: { position: 'absolute', top: 107, left: 0, right: 0, bottom: 0, backgroundColor: colors.beige },
  bottom: { position: 'absolute', left: layout.sideMargin, right: layout.sideMargin },
  // WELCOME：スマホ画像（209×342）はパネル上端から 44、文はその下 33
  welcomeBody: { alignItems: 'center', paddingTop: 44 },
  phoneHero: { width: 209, height: 342 },
  welcomeTextArea: { height: 156, justifyContent: 'center', paddingHorizontal: 32 },
  welcomeTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center', lineHeight: 30 },
  welcomeTitleEn: { fontSize: 17, lineHeight: 26 },
  phone: { position: 'absolute', top: 44, left: 0, right: 0, alignItems: 'center' },
  bubble: { position: 'absolute', width: 107, height: 93 },
  bubbleImg: { position: 'absolute', width: 107, height: 93 },
  bubbleLabelEn: { fontSize: 11, lineHeight: 13, letterSpacing: -0.2 },
  bubbleLabel: { position: 'absolute', top: 48, width: 76, fontSize: 12, lineHeight: 14, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { position: 'absolute', top: BODY_TOP, left: 0, right: 0, paddingHorizontal: 32 },
  bodyWide: { paddingHorizontal: layout.sideMargin },
  bodyText: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center' },
  bodyTextEn: { fontSize: 15, lineHeight: 22 },
  // Figma CH0-05 の Frame 119：340×274、白、枠 #E6D8BD 5px（内側）、角丸 10。
  // 項目（Group 257）は枠の外側から (29,35)、アイコン 36 を 56 おきに並べ、アイコンの中心を幅 4 の #B3EFED の線でつなぐ
  stepsCard: {
    position: 'absolute',
    top: 67,
    alignSelf: 'center',
    width: 340,
    height: 274,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#E6D8BD',
    paddingTop: 30,
    paddingLeft: 24,
    gap: 20,
  },
  // 枠の内側が原点になるので、枠の太さ（5）だけ外へずらす
  stepsCorners: { position: 'absolute', left: -5, top: -5 },
  stepsLine: { position: 'absolute', left: 24 + 16, top: 30 + 18, width: 4, height: 168, backgroundColor: '#B3EFED' },
  stepRow: { flexDirection: 'row', alignItems: 'center', height: 36 },
  stepIcon: { width: 36, height: 36, marginRight: 13 },
  stepHeadEn: { fontSize: 14.5 },
  stepBodyEn: { fontSize: 12 },
  stepHead: { fontSize: 16, lineHeight: 20.8, fontWeight: '700', color: '#1A202C', marginRight: 8 },
  stepBody: { fontSize: 13, lineHeight: 16.9, color: colors.text },
  report: { position: 'absolute', top: 66, alignSelf: 'center', width: REPORT_W, height: REPORT_H },
  reportBase: { position: 'absolute', top: 0, left: 0, width: REPORT_W, height: 252 },
  reportWindow: { position: 'absolute', overflow: 'hidden' },
  reportImg: { position: 'absolute', width: REPORT_W, height: REPORT_H },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 7 },
  badgePill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 29, paddingHorizontal: 8, borderRadius: 6, backgroundColor: colors.white },
  badgePillEn: { paddingHorizontal: 6 },
  badgeTextEn: { fontSize: 14 },
  badgeText: { fontSize: 16, fontWeight: '700', color: colors.teal },
});
