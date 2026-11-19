/**
 * 0章の画面で共通して使う部品（Figma「0章_261016」準拠）。
 * - QuestionLayout: ベージュ柄の背景＋ヘッダー＋SHOSA の吹き出し＋選択肢＋NEXT（CH0-08/09〜11/22）
 * - TalkLayout:     ドア101の部屋で SHOSA が話す画面（CH0-07/20/15/13）
 * - OptionCard:     ホタテ型の枠の選択肢カード（360x68）
 */
import { useEffect, useRef, type ComponentRef, type ReactNode, type RefObject } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Circle, Defs, Image as SvgImage, Line, LinearGradient, Path, Pattern, Polygon, Polyline, RadialGradient, Rect, Stop } from 'react-native-svg';
import { Icon } from '@/components/Icon';
import { RichText } from '@/components/RichText';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { Appear } from '@/components/Appear';
import { CtaButton, LangToggle, PressScale, ProgressBar } from '@/components/ui';
import type { IconRef, Localized } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { centered, centeredButton, layout } from '@/theme/layout';
import { motion, nativeDriver, useReducedMotion } from '@/theme/motion';
import { images } from '@/theme/images';
import { useSvgId } from '@/lib/useSvgId';

/**
 * ヘッダー：戻る（金丸の ←）・進捗バー・EN 切り替え。
 * M-31：戻るボタンは「どの画面で表示するか未定」のため、決まるまで表示しない。
 * 表示する画面が決まったら showBack を渡す（押すと M-01 の縮み＋M-03 の逆向きスライドで戻る）。
 */
export function OnboardingHeader({ percent, showLang = true, showBack = false }: { percent?: number; showLang?: boolean; showBack?: boolean }) {
  const { t } = useLang();
  return (
    <View style={styles.header}>
      {showBack ? (
        <PressScale accessibilityLabel={t('back')} hitSlop={10} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
          <Image source={images.btnBack} style={styles.back} />
        </PressScale>
      ) : (
        <View style={styles.back} />
      )}
      {/* index.html .figma-hearing-progress-wrap：中央に最大 280 */}
      <View style={styles.headerTrack}>
        {percent !== undefined && (
          <View style={styles.headerTrackInner}>
            <ProgressBar percent={percent} variant="ch0" />
          </View>
        )}
      </View>
      {showLang ? <LangToggle /> : <View style={{ width: 48 }} />}
    </View>
  );
}

/**
 * 小さい SHOSA（110×100）と足元の影（index.html .langselect-mascot / .langselect-shadow）。
 * - 影は SHOSA が話す画面と同じ、ぼかした床の影の画像（floorShadow）を SHOSA の後ろに。75×17、SHOSA の上端から 86
 * - mascotBreathe / mascotShadowBreatheOrigin：2.2秒周期で SHOSA が 3px 上下し、影が 0.95倍に縮む
 * 視差効果を減らす ON のときは動かさない。言語選択・ヒアリング・学習時間で使う。
 */
export function SmallMascot({ style }: { style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const b = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(b, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
        Animated.timing(b, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: nativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reduced, b]);
  const translateY = b.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const scale = b.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] });
  return (
    <View style={[styles.mascotSmall, style]}>
      {/* 影は SHOSA の後ろ。SHOSA が話す画面と同じ、ぼかした床の影の画像（floorShadow）を使う */}
      <Animated.Image source={images.floorShadow} style={[styles.mascotSmallShadow, { transform: [{ scale }] }]} resizeMode="contain" />
      <Animated.Image source={images.mascotFace} style={[styles.mascotSmall, { transform: [{ translateY }] }]} resizeMode="contain" />
    </View>
  );
}

/** SHOSA（110x100）＋白い吹き出し */
export function MascotBubble({ text, variant = 'hearing' }: { text: Localized; variant?: 'hearing' | 'schedule' }) {
  const { lang, tr } = useLang();
  // 学習時間の英語は文が長く 4行になるため、文字を少し小さくして 98 の高さに収める（index.html の html[lang="en"] と同じ）
  const compact = variant === 'schedule' && lang === 'en';
  return (
    <View style={[styles.mascotRow, variant === 'schedule' && styles.mascotRowSchedule]}>
      <SmallMascot />
      <View style={[styles.bubble, variant === 'schedule' && { paddingTop: 19 }, compact && styles.bubbleCompact]}>
        <View style={styles.bubbleTail} />
        <Text style={[styles.bubbleText, compact && styles.bubbleTextCompact]}>{tr(text)}</Text>
      </View>
    </View>
  );
}

/**
 * ホタテ型の選択肢カード。選択中は紫の枠と文字になる。
 * M-05 / M-33：選んだ瞬間に枠が一瞬ふくらむ（0.15秒・1回）。押した瞬間は M-01 の縮み。
 */
export function OptionCard({
  label,
  icon,
  selected,
  onPress,
  height = 68,
  compact = false,
  children,
  testID,
}: {
  label: string;
  icon?: IconRef;
  selected: boolean;
  onPress: () => void;
  height?: number;
  /** index.html の「その他」カード：高さ 58、左の余白 16 */
  compact?: boolean;
  children?: ReactNode;
  testID?: string;
}) {
  const reduced = useReducedMotion();
  const pop = useRef(new Animated.Value(1)).current;
  const was = useRef(selected);
  useEffect(() => {
    if (selected && !was.current && !reduced) {
      const half = motion.cardPopMs / 2;
      Animated.sequence([
        Animated.timing(pop, { toValue: 1.04, duration: half, useNativeDriver: nativeDriver }),
        Animated.timing(pop, { toValue: 1, duration: half, useNativeDriver: nativeDriver }),
      ]).start();
    }
    was.current = selected;
  }, [selected, reduced, pop]);
  return (
    <PressScale testID={testID} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress}>
      <Animated.View style={{ transform: [{ scale: pop }] }}>
      <ImageBackground
        source={selected ? images.cardBorderSelected : images.cardBorderUnselected}
        resizeMode="stretch"
        style={[styles.option, { minHeight: compact ? 58 : height }, compact && { paddingLeft: 16, paddingVertical: 9 }]}
        imageStyle={styles.fill}
      >
        <View style={styles.optionRow}>
          {icon && <Icon icon={icon} size={40} />}
          {/* index.html：選んでも文字の色は変わらない（枠だけ紫になる） */}
          <Text style={styles.optionText}>{label}</Text>
        </View>
        {children}
      </ImageBackground>
      </Animated.View>
    </PressScale>
  );
}

/** 選択肢を並べる画面の共通レイアウト */
export function QuestionLayout({
  percent,
  question,
  children,
  footer,
  nextLabel,
  nextDisabled,
  onNext,
  showLang = true,
  scrollRef,
  heroVariant,
  background,
  fadeBottom = false,
}: {
  percent?: number;
  /** M-08：自動スクロールに使う ScrollView の ref */
  scrollRef?: RefObject<ComponentRef<typeof ScrollView> | null>;
  question?: Localized;
  children: ReactNode;
  /** NEXT の上に置く要素（お知らせ時間の帯など） */
  footer?: ReactNode;
  nextLabel?: string;
  nextDisabled: boolean;
  onNext: () => void;
  showLang?: boolean;
  /** schedule：index.html の時間選択は SHOSA と吹き出しが 7 下がる */
  heroVariant?: 'hearing' | 'schedule';
  /** 背景色（柄はそのまま）。index.html のプロフィールは #FAF8F2 */
  background?: string;
  /** index.html の適性診断：NEXT の後ろに高さ 200 のグラデーション（透明 → #F6F1E8）を重ね、下の内容を透かす */
  fadeBottom?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  const fadeId = useSvgId('fade');
  return (
    <PatternBackground
      {...patterns.beige}
      {...(background ? { color: background } : null)}
      align={heroVariant === 'schedule' ? 'center' : 'left'}
      style={{ paddingTop: insets.top }}
    >
      <OnboardingHeader percent={percent} showLang={showLang} />
      <ScrollView
        ref={scrollRef}
        // fadeBottom：NEXT が下に重なるので、その高さ（ボタン 48＋上下の余白）だけ下を空ける。
        // 3問は1画面に収まるのでスクロールしない（画面が低い端末だけスクロールできる）
        contentContainerStyle={[styles.scroll, fadeBottom && { paddingBottom: insets.bottom + layout.ctaBottom + 48 + 8 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 要点 CH0-09〜11：吹き出し → 選択肢の順に時間差で出る */}
        {question && (
          <Appear from="none" duration={300}>
            <MascotBubble text={question} variant={heroVariant} />
          </Appear>
        )}
        <Appear delay={question ? 200 : 0} duration={300} style={styles.options}>
          {children}
        </Appear>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }, fadeBottom && styles.bottomFade]}>
        {fadeBottom && (
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none" preserveAspectRatio="none">
            <Defs>
              <LinearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#F6F1E8" stopOpacity={0} />
                <Stop offset="0.8" stopColor="#F6F1E8" stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${fadeId})`} />
          </Svg>
        )}
        {footer}
        <CtaButton
          testID="onboarding-next"
          style={centeredButton}
          label={nextLabel ?? t('next')}
          fontSize={18}
          disabledTone="grey"
          ledge={{ color: colors.teal, depth: 3, disabledColor: '#C2C2C2' }}
          disabled={nextDisabled}
          onPress={onNext}
        />
      </View>
    </PatternBackground>
  );
}

/**
 * ドア101の部屋で SHOSA が話す画面（index.html .figma-ch07-screen）。
 * - 壁：上から 380 まで、#FAF8F2 にベージュの線の柄
 * - 床：上端 334 から、幅木（#E6D8BD）と台形のカーペット（carpet_beige.jpg を 160×55.5 で敷く）
 * - ドア 362 幅（上端 107）、左右のランプ 76×76（上端 155）に光の輪、SHOSA 170×154（上端 235）と足元の影
 * - 白い吹き出し（幅 340、上端 431、上向きのしっぽ）、紫の立体 NEXT
 * index.html では戻るボタンがあるが、M-31 に合わせて出していない。
 */
export function TalkLayout({
  lines,
  onNext,
  highlight = 'purple',
  bubbleHeight,
  style,
}: {
  lines: Localized[];
  onNext: () => void;
  /** 吹き出しの高さ。index.html は画面ごとに固定で、文は縦の中央にそろえる（英語で行数が増えても吹き出しは伸びない） */
  bubbleHeight?: number;
  /** <hl>…</hl> の見せ方。purple: 紫の太字 / bold: 黒の太字 */
  highlight?: 'purple' | 'bold';
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const { t, tr } = useLang();
  const carpetId = useSvgId('carpet');
  // index.html と同じく、部屋（壁・床・ドア・SHOSA・吹き出し）はセーフエリアに関係なく画面上端から置く。EN と NEXT だけセーフエリアを空ける
  const top = 0;
  return (
    <View style={[styles.room, style]}>
      <PatternBackground {...patterns.beige} color="#FAF8F2" align="center" style={[styles.wall, { height: top + 380 }]} />
      <Svg style={[styles.floor, { top: top + 334 }]} width="100%" viewBox="0 0 402 540" preserveAspectRatio="none" pointerEvents="none">
        <Defs>
          <Pattern id={carpetId} patternUnits="userSpaceOnUse" width={160} height={55.5}>
            <SvgImage href={images.carpetBeige} width={160} height={55.5} preserveAspectRatio="none" />
          </Pattern>
        </Defs>
        <Polygon points="0,31 85,0 317,0 402,31 402,42 317,10 85,10 0,42" fill="#E6D8BD" />
        <Polyline points="0,31 85,0 317,0 402,31" stroke="#D1C1A3" strokeWidth={1.5} fill="none" />
        <Line x1={85} y1={0} x2={85} y2={10} stroke="#C8B797" strokeWidth={1} />
        <Line x1={317} y1={0} x2={317} y2={10} stroke="#C8B797" strokeWidth={1} />
        <Polygon points="0,42 85,10 317,10 402,42 402,540 0,540" fill="#BFA889" />
        <Polygon points="0,42 85,10 317,10 402,42 402,540 0,540" fill={`url(#${carpetId})`} opacity={0.9} />
      </Svg>

      <View style={[styles.doorWrap, { top: top + 107 }]}>
        <Image source={images.sceneDoor101} style={styles.door} resizeMode="contain" />
        {/* 要点 CH0-07：ランプの明滅 → マスコットが弾んで登場 → 吹き出しがフェードイン */}
        <Lamp style={{ left: 0 }} />
        <Lamp style={{ left: 286 }} />
      </View>
      <TalkMascot top={top} />

      {/* ch07BubbleFade：0.7秒後に 12px 下から 0.4秒でフェードイン */}
      <Appear
        from="up"
        distance={12}
        delay={700}
        duration={400}
        style={[styles.talkBubble, { top: top + 431 }, bubbleHeight !== undefined && { minHeight: bubbleHeight, justifyContent: 'center', paddingVertical: 0 }]}
      >
        <Svg style={styles.talkBubbleTail} width={34} height={25} viewBox="0 0 44 26" preserveAspectRatio="none">
          <Path d="M18.8 3.8C20.2 1.4 23.8 1.4 25.2 3.8L44 26H0Z" fill={colors.white} />
        </Svg>
        {lines.map((l, i) => (
          <RichText
            key={i}
            style={[styles.talkText, i > 0 && { marginTop: 24 }]}
            highlightStyle={highlight === 'bold' ? { color: colors.black, fontWeight: '700' } : undefined}
          >
            {tr(l)}
          </RichText>
        ))}
      </Appear>

      <View style={[styles.bottomTalk, { bottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="onboarding-next"
          style={centeredButton}
          variant="primary"
          fontSize={18}
          ledge={{ color: '#4D3CA8', depth: 3 }}
          label={t('next')}
          onPress={onNext}
        />
      </View>
      <LangToggle style={[styles.talkLang, { top: insets.top + 14 }]} />
    </View>
  );
}

/**
 * SHOSA と足元の影（index.html .ch07-mascot-img / .ch07-mascot-shadow）。
 * - ch07MascotBounce：0.3秒後に 0.6秒で弾んで登場（下 24px・0.92倍 → 上 6px・1.03倍 → 下 2px・0.99倍 → 元の位置）
 * - ch07ShadowGrow：同時に影が 0.7倍から広がりながら現れる
 * - mascotBreathe / mascotShadowBreathe：その後 2.2秒周期で SHOSA が 3px 上下し、影が 0.95倍に縮む
 * 視差効果を減らす ON のときは動かさない。
 */
function TalkMascot({ top }: { top: number }) {
  const reduced = useReducedMotion();
  const enter = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const breathe = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (reduced) return;
    const intro = Animated.timing(enter, { toValue: 1, duration: 600, delay: 300, easing: Easing.linear, useNativeDriver: nativeDriver });
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
  }, [reduced, enter, breathe]);
  // キーフレーム（0% / 65% / 85% / 100%）をそのまま補間する
  const bounceY = enter.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [24, -6, 2, 0] });
  const bounceS = enter.interpolate({ inputRange: [0, 0.65, 0.85, 1], outputRange: [0.92, 1.03, 0.99, 1] });
  const fadeIn = enter.interpolate({ inputRange: [0, 0.65, 1], outputRange: [0, 1, 1] });
  const breatheY = breathe.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const shadowS = Animated.multiply(
    enter.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
    breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 0.95] }),
  );
  return (
    <>
      <Animated.View pointerEvents="none" style={[styles.talkShadowWrap, { top: top + 368, opacity: enter, transform: [{ scale: shadowS }] }]}>
        <Image source={images.floorShadow} style={styles.talkShadow} resizeMode="contain" />
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.mascotWrapLarge,
          { top: top + 235, opacity: fadeIn, transform: [{ translateY: Animated.add(bounceY, breatheY) }, { scale: bounceS }] },
        ]}
      >
        <Image source={images.mascotFace} style={styles.mascotLarge} resizeMode="contain" />
      </Animated.View>
    </>
  );
}

/**
 * 壁のランプ（Group 224.png）と後ろの光の輪（直径 100）。
 * index.html：最初の 1.2秒は明滅（ch07HaloFlicker）、そのあと 2.8秒周期でゆっくり明るさが変わる（ch07HaloPulse）。
 * ただし最大の明るさは index.html より弱め（不透明度の山 1 → 0.8、脈動の谷 0.8 → 0.65、大きさの山 1.1〜1.2 → 1.06〜1.15）。
 * 視差効果を減らす ON のときは静止。
 */
function Lamp({ style }: { style: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const haloId = useSvgId('halo');
  const o = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const s = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) return;
    const step = (to: number, scale: number, ms: number) =>
      Animated.parallel([
        Animated.timing(o, { toValue: to, duration: ms, useNativeDriver: nativeDriver }),
        Animated.timing(s, { toValue: scale, duration: ms, useNativeDriver: nativeDriver }),
      ]);
    // 最大の明るさは index.html（不透明度 1・大きさ 1.1〜1.2）より弱めにしている（強すぎるため）：山は 0.8・1.06〜1.15
    const flicker = Animated.sequence([
      step(0.8, 1.12, 144),
      step(0.2, 0.8, 120),
      step(0.8, 1.15, 156),
      step(0.45, 0.9, 156),
      step(0.8, 1.06, 144),
      step(0.65, 0.98, 480),
    ]);
    const pulse = Animated.loop(Animated.sequence([step(0.8, 1.06, 1400), step(0.65, 0.98, 1400)]));
    const all = Animated.sequence([flicker, pulse]);
    all.start();
    return () => all.stop();
  }, [reduced, o, s]);
  return (
    <View style={[styles.lampUnit, style]} pointerEvents="none">
      <Animated.View style={[styles.lampHalo, { opacity: o, transform: [{ scale: s }] }]}>
        <Svg width={100} height={100}>
          <Defs>
            <RadialGradient id={haloId} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="rgb(255,235,150)" stopOpacity={0.9} />
              <Stop offset="0.594" stopColor="rgb(255,220,110)" stopOpacity={0.5} />
              <Stop offset="0.99" stopColor="rgb(255,210,80)" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Circle cx={50} cy={50} r={50} fill={`url(#${haloId})`} />
        </Svg>
      </Animated.View>
      <Image source={images.lamp} style={styles.lampBody} />
    </View>
  );
}

const styles = StyleSheet.create({
  // index.html .figma-hearing-header-bar：上 14、高さ 32。進捗バーは x63〜339、EN は右端にぴったり
  header: { flexDirection: 'row', alignItems: 'center', height: 32, marginTop: 14, paddingLeft: 21 },
  back: { width: 32, height: 32 },
  headerTrack: { flex: 1, marginLeft: 10, marginRight: 15, alignItems: 'center' },
  // index.html：幅 276（402 の画面でも広い画面でも同じ）
  headerTrackInner: { width: '100%', maxWidth: 276 },
  scroll: { ...centered, paddingHorizontal: 21, paddingBottom: 16 },
  // SHOSA（110×100）は (28,66)、吹き出しはその右 22。選択肢は SHOSA の下 28 から
  // 高さは最低 SHOSA（100）。英語で吹き出しが 4行以上になっても文字がはみ出さないよう、内容に合わせて伸ばす（下の選択肢がその分下がる）
  mascotRow: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 100, marginTop: 20, marginBottom: 28, marginLeft: 7, marginRight: 7 },
  // 時間選択（index.html）は SHOSA が (28,73)。選択肢は同じ y194 から
  mascotRowSchedule: { marginTop: 27, marginBottom: 21 },
  mascotSmall: { width: 110, height: 100 },
  // SHOSA が話す画面の影（115×26）と同じ縦横比で、小さい SHOSA（110×100）の足元に置く
  mascotSmallShadow: { position: 'absolute', left: 17, top: 86, width: 75, height: 17 },
  bubble: { flex: 1, marginLeft: 22, minHeight: 72, backgroundColor: colors.white, borderRadius: 6, paddingHorizontal: 18, paddingVertical: 14 },
  bubbleTail: {
    position: 'absolute',
    left: -14,
    top: 29,
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
  },
  bubbleText: { fontSize: 16, lineHeight: 22, color: colors.black },
  bubbleCompact: { minHeight: 98, paddingTop: 13, paddingBottom: 13, paddingLeft: 16, paddingRight: 8 },
  bubbleTextCompact: { fontSize: 14, lineHeight: 18 },
  options: { gap: 10 },
  // .frame248-option-btn：360×68、アイコン 40 は左 34、文字はアイコンの右 22
  option: { justifyContent: 'center', paddingLeft: 34, paddingRight: 20, paddingVertical: 12 },
  fill: { width: '100%', height: '100%' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 22 },
  optionText: { flex: 1, fontSize: 16, lineHeight: 19.2, fontWeight: '700', color: colors.text, letterSpacing: 0.3 },
  // footer（お知らせ時間の帯など）と NEXT の間隔は Figma CH0-22 で 40
  bottom: { ...centered, paddingHorizontal: 21, paddingTop: 8, gap: 40 },
  // --- TalkLayout（index.html .figma-ch07-screen）---
  room: { flex: 1, backgroundColor: '#BFA889', overflow: 'hidden' },
  wall: { position: 'absolute', top: 0, left: 0, right: 0, flex: 0 },
  floor: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  doorWrap: { position: 'absolute', alignSelf: 'center', width: 362, height: 239 },
  door: { width: 362, height: 239 },
  lampUnit: { position: 'absolute', top: 48, width: 76, height: 76 },
  lampHalo: { position: 'absolute', left: -12, top: -12, width: 100, height: 100 },
  lampBody: { width: 76, height: 76 },
  mascotWrapLarge: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  mascotLarge: { width: 170, height: 154 },
  talkShadowWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  talkShadow: { width: 115, height: 26 },
  talkBubble: {
    position: 'absolute',
    alignSelf: 'center',
    width: 340,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingTop: 30,
    paddingBottom: 29,
    paddingHorizontal: 20,
  },
  talkBubbleTail: { position: 'absolute', top: -24, alignSelf: 'center' },
  talkText: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center' },
  // NEXT の領域を画面下に重ねる（高さ 200）
  bottomFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, width: '100%', maxWidth: '100%', alignSelf: 'stretch', justifyContent: 'flex-end', paddingTop: 0 },
  bottomTalk: { position: 'absolute', left: layout.sideMargin, right: layout.sideMargin, alignItems: 'center' },
  talkLang: { position: 'absolute', right: 0, zIndex: 10 },
});

/** 0章前半（ヒアリング4問＋スケジュール＋プロフィール）の進捗。Web版と同じ6ステップ */
export function blockProgress(step: number): number {
  return Math.round((step / 6) * 100);
}
