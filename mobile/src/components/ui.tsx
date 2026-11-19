/** 画面をまたいで使う UI 部品。寸法・色は Figma の値に合わせている。 */
import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { useLang } from '@/i18n/LanguageProvider';
import { haptics } from '@/lib/haptics';
import { colors, fonts } from '@/theme/colors';
import { motion, nativeDriver, useReducedMotion } from '@/theme/motion';

/** 角の金色の飾り（Figma: Group 258〜261） */
export function Flourish({ corner, color = colors.goldDark, size = 22 }: { corner: 'tl' | 'tr' | 'bl' | 'br'; color?: string; size?: number }) {
  const d = {
    tl: 'M 3,3 C 10,5 15,10 17,17 C 10,15 5,10 3,3 Z M 3,3 L 12,4 M 3,3 L 4,12',
    tr: 'M 21,3 C 14,5 9,10 7,17 C 14,15 19,10 21,3 Z M 21,3 L 12,4 M 21,3 L 20,12',
    bl: 'M 3,21 C 10,19 15,14 17,7 C 10,9 5,14 3,21 Z M 3,21 L 12,20 M 3,21 L 4,12',
    br: 'M 21,21 C 14,19 9,14 7,7 C 14,9 19,14 21,21 Z M 21,21 L 12,20 M 21,21 L 20,12',
  }[corner];
  const pos: ViewStyle = {
    position: 'absolute',
    ...(corner[0] === 't' ? { top: 4 } : { bottom: 4 }),
    ...(corner[1] === 'l' ? { left: 4 } : { right: 4 }),
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={pos} pointerEvents="none">
      <Path d={d} fill={color} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

export type ButtonVariant = 'primary' | 'next' | 'light';

/**
 * M-01：押した瞬間に 0.95倍に縮み、軽い触覚を出す（0.15秒）。色や影は変えない。
 * 押せない状態（disabled）のときは反応しない。どのボタンもこれで包む。
 */
export function PressScale({
  onPress,
  disabled = false,
  haptic = true,
  style,
  containerStyle,
  children,
  testID,
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  hitSlop,
}: {
  onPress: () => void;
  disabled?: boolean;
  haptic?: boolean;
  /** 縮む中身のスタイル（背景・角丸・高さなど） */
  style?: StyleProp<ViewStyle>;
  /** 押せる範囲（外側）のスタイル。横に並べて flex で伸ばすときなどに使う */
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'radio';
  accessibilityState?: { disabled?: boolean; checked?: boolean; selected?: boolean };
  hitSlop?: number;
}) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.timing(scale, { toValue: v, duration: motion.pressMs / 2, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }).start();
  return (
    <Pressable
      testID={testID}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, ...accessibilityState }}
      disabled={disabled}
      hitSlop={hitSlop}
      style={containerStyle}
      onPressIn={() => {
        if (disabled) return;
        if (haptic) haptics.tap();
        if (!reduced) to(motion.pressScale);
      }}
      onPressOut={() => to(1)}
      onPress={onPress}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

/**
 * 画面下の丸いボタン（Figma: btn 360x48, r=31）
 * - primary: 紫（START・診断へ進む など）
 * - next:    ターコイズ（NEXT）
 * - light:   白地に紫の文字（2章完了の NEXT CHAPTER）
 * disabled のときは灰色（#E0E0E0）で押せない。
 * M-02：disabled から有効に変わった瞬間に1回だけ小さく弾む（0.3秒）。
 */
export function CtaButton({
  label,
  onPress,
  variant = 'next',
  disabled = false,
  pulse = false,
  size = 'regular',
  fontSize,
  disabledTone = 'figma',
  ledge,
  icon,
  style,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** 押せないときの色。figma: #E0E0E0 に白文字 / beige: #DFDDD6 に #9B978F の文字 / grey: #E0E0E0 に #A1A1A1 の文字（index.html 0章） */
  disabledTone?: 'figma' | 'beige' | 'grey';
  /** index.html 0章の立体ボタン：下に 3〜4px の濃い色の縁（box-shadow 0 Npx 0）。disabledColor を渡すと押せないときも出す */
  ledge?: { color: string; depth: number; disabledColor?: string };
  /** ボタンの左端に置く画像（例：診断完了の「結果を見る」のアイコン）。左から 24、縦は中央 */
  icon?: { source: ImageSourcePropType; width: number; height: number };
  disabled?: boolean;
  /** タップを促す脈動アニメーション（M-13：1.5秒周期） */
  pulse?: boolean;
  /** regular: 高さ 48（Figma）/ tall: 高さ 52・太字 800（index.html の .ch101-cta-btn）/ small: 高さ 40（職種カード内など） */
  size?: 'regular' | 'tall' | 'small';
  /** 文字の大きさ（既定 16） */
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const reduced = useReducedMotion();
  const pulseScale = usePulse(pulse && !disabled && !reduced);
  const bounce = useRef(new Animated.Value(1)).current;
  const wasDisabled = useRef(disabled);
  useEffect(() => {
    if (wasDisabled.current && !disabled && !reduced) {
      const half = motion.enableBounceMs / 2;
      Animated.sequence([
        Animated.timing(bounce, { toValue: 1.06, duration: half, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
        Animated.timing(bounce, { toValue: 1, duration: half, easing: Easing.in(Easing.quad), useNativeDriver: nativeDriver }),
      ]).start();
    }
    wasDisabled.current = disabled;
  }, [disabled, reduced, bounce]);

  const base = variant === 'primary' ? colors.purple : variant === 'light' ? colors.white : colors.turquoise;
  return (
    <Animated.View style={[{ alignSelf: 'stretch', transform: [{ scale: pulseScale }, { scale: bounce }] }, style]}>
      {ledge && (!disabled || ledge.disabledColor) && (
        <View
          pointerEvents="none"
          style={[
            styles.cta,
            StyleSheet.absoluteFill,
            { top: ledge.depth, bottom: -ledge.depth, backgroundColor: disabled ? ledge.disabledColor : ledge.color },
            size === 'tall' && { borderRadius: 999 },
          ]}
        />
      )}
      <PressScale
        testID={testID}
        disabled={disabled}
        onPress={onPress}
        style={[
          styles.cta,
          size === 'small' && { height: 40 },
          size === 'tall' && { height: 52, borderRadius: 999 },
          { backgroundColor: disabled ? (disabledTone === 'beige' ? '#DFDDD6' : colors.disabled) : base },
        ]}
      >
        <Text
          style={[
            styles.ctaText,
            size === 'tall' && { fontWeight: '800' },
            fontSize !== undefined && { fontSize },
            ledge && { letterSpacing: 0.54 },
            variant === 'light' && !disabled && { color: colors.purple },
            disabled && disabledTone === 'beige' && { color: '#9B978F' },
            disabled && disabledTone === 'grey' && { color: '#A1A1A1' },
          ]}
        >
          {label}
        </Text>
        {icon && <Image source={icon.source} style={{ position: 'absolute', left: 24, width: icon.width, height: icon.height }} resizeMode="contain" />}
      </PressScale>
    </Animated.View>
  );
}

/** 1 → 1.04 → 1 をくり返す脈動（M-13：1.5秒周期）。enabled が false のときは 1 のまま。 */
export function usePulse(enabled: boolean): Animated.Value {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!enabled) {
      v.setValue(1);
      return;
    }
    const half = motion.pulsePeriodMs / 2;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1.04, duration: half, easing: Easing.inOut(Easing.quad), useNativeDriver: nativeDriver }),
        Animated.timing(v, { toValue: 1, duration: half, easing: Easing.inOut(Easing.quad), useNativeDriver: nativeDriver }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, v]);
  return v;
}

/**
 * 日本語 ⇄ 英語の切り替えチップ（index.html の .reproduced-lang-chip）。
 * 画面の右端にくっつき、左側だけが丸い 48×32。枠 #E6D8BD、下に 1px の影。文字は 14px・#333。
 */
export function LangToggle({ style }: { style?: StyleProp<ViewStyle> }) {
  const { lang, t, toggleLang } = useLang();
  const reduced = useReducedMotion();
  // index.html .btn-en-toggle.spinning：押した瞬間に矢印が 0.35秒で 1回転する
  const spin = useRef(new Animated.Value(0)).current;
  const onPress = () => {
    if (!reduced) {
      spin.setValue(0);
      Animated.timing(spin, { toValue: 1, duration: 350, easing: Easing.bezier(0.4, 0, 0.2, 1), useNativeDriver: nativeDriver }).start();
    }
    toggleLang();
  };
  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <PressScale
      accessibilityLabel={lang === 'en' ? 'Switch to Japanese / 日本語に切り替え' : 'Switch to English / 英語に切り替え'}
      onPress={onPress}
      hitSlop={8}
      containerStyle={style}
      style={styles.langChip}
    >
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg width={14} height={12} viewBox="0 0 24 24" fill="none" stroke="#1A2530" strokeWidth={2.6}>
          <Path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" strokeLinecap="round" strokeLinejoin="round" />
          <Polyline points="21 3 21 8 16 8" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </Animated.View>
      <Text style={styles.langText}>{t('langToggle')}</Text>
    </PressScale>
  );
}

/** 白丸に金の ✕（Figma: Frame 113 / Ellipse 64 + Union） */
export function CloseButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <PressScale accessibilityLabel={label} hitSlop={10} onPress={onPress}>
      <Svg width={32} height={32} viewBox="0 0 32 32">
        <Circle cx={16} cy={16} r={15.5} fill={colors.white} stroke={colors.goldBorder} strokeWidth={1} />
        <Path d="M 10.5,10.5 L 21.5,21.5 M 21.5,10.5 L 10.5,21.5" stroke={colors.goldDark} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </PressScale>
  );
}

/** カード右下の「進む」丸ボタン（Figma: Frame 113 32x32） */
export function AdvanceButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <View style={styles.advance}>
      <PressScale accessibilityLabel={label} onPress={onPress} hitSlop={14}>
      <Svg width={32} height={32} viewBox="0 0 32 32">
        <Circle cx={16} cy={16} r={15.5} fill={colors.white} stroke={colors.goldBorder} strokeWidth={1} />
        <Path
          d="M 11,16 L 21,16 M 16.5,11 L 21.5,16 L 16.5,21"
          fill="none"
          stroke={colors.goldDark}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      </PressScale>
    </View>
  );
}

/**
 * 進捗バー（Figma: Rectangle 44/67/68 — 灰色の枠付きトラック＋紫＋白いハイライト）。
 * M-30：前の画面の位置から今の位置まで 0.4秒で伸びる（戻った時は縮む）。点滅・光はなし。
 */
let lastProgress = 0;
/**
 * variant:
 * - 'figma'（既定）：灰色の枠付きトラック＋白いハイライト（0章）
 * - 'ch1'：index.html の 1章（.ch101-progress-track：高さ 9、#DFDEDE、枠なし）
 */
export function ProgressBar({ percent, variant = 'figma' }: { percent: number; variant?: 'figma' | 'ch1' | 'ch0' }) {
  const reduced = useReducedMotion();
  const target = Math.max(0, Math.min(100, percent));
  const w = useRef(new Animated.Value(reduced ? target : lastProgress)).current;
  useEffect(() => {
    // 画面が表示されるたびに、直前の位置から伸ばす
    Animated.timing(w, { toValue: target, duration: reduced ? 0 : motion.progressMs, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    lastProgress = target;
  }, [target, reduced, w]);
  const width = w.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });
  if (variant === 'ch0') {
    return (
      <View style={styles.trackCh0}>
        <Animated.View style={[styles.fillCh0, { width }]}>
          <View style={styles.highlightCh0} />
        </Animated.View>
      </View>
    );
  }
  if (variant === 'ch1') {
    return (
      <View style={styles.trackCh1}>
        <Animated.View style={[styles.fillCh1, { width }]} />
      </View>
    );
  }
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]}>
        <View style={styles.highlight} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  cta: { height: 48, borderRadius: 31, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: colors.white, fontSize: 16, fontWeight: '700', letterSpacing: 1 },
  langChip: {
    width: 48,
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
    paddingRight: 4,
    backgroundColor: colors.white,
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: colors.goldBorder,
    shadowColor: colors.goldBorder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  // index.html .lang-text：Roboto 700・14px（Web は Google Fonts の Roboto、Android は標準の Roboto、iOS は標準フォント）
  langText: { color: colors.text, fontWeight: '700', fontSize: 14, lineHeight: 15, fontFamily: fonts.roboto },
  advance: { position: 'absolute', right: 21, bottom: 21 },
  track: {
    flex: 1,
    height: 12,
    backgroundColor: colors.progressTrack,
    borderColor: colors.progressTrackBorder,
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.purple, borderRadius: 10, paddingHorizontal: 3, paddingTop: 1 },
  highlight: { height: 3, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.4)' },
  // index.html 0章（.figma-hearing-progress-bar：#DDDDDD に 1px の枠＋1px の輪＝合わせて 2px の #C2B7A2、中に高さ 10 の紫）
  trackCh0: { height: 14, margin: -1, backgroundColor: '#DDDDDD', borderWidth: 2, borderColor: '#C2B7A2', borderRadius: 999, overflow: 'hidden' },
  fillCh0: { height: '100%', backgroundColor: colors.purple, borderRadius: 999 },
  // .figma-hearing-progress-fill::after：上 2・左右 4 に高さ 3 の白 40% の光
  highlightCh0: { position: 'absolute', top: 2, left: 4, right: 4, height: 3, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.4)' },
  trackCh1: { height: 9, backgroundColor: '#DFDEDE', borderRadius: 999, overflow: 'hidden' },
  fillCh1: { height: '100%', backgroundColor: colors.purple, borderRadius: 999 },
});
