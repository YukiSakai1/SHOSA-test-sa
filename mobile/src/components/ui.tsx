/** 画面をまたいで使う UI 部品。寸法・色は Figma の値に合わせている。 */
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

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
 * 画面下の丸いボタン（Figma: btn 360x48, r=31）
 * - primary: 紫（START・診断へ進む など）
 * - next:    ターコイズ（NEXT）
 * - light:   白地に紫の文字（2章完了の NEXT CHAPTER）
 * disabled のときは灰色（#E0E0E0）で押せない。
 */
export function CtaButton({
  label,
  onPress,
  variant = 'next',
  disabled = false,
  pulse = false,
  style,
  testID,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /** タップを促す脈動アニメーション */
  pulse?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  const scale = usePulse(pulse && !disabled);
  const base = variant === 'primary' ? colors.purple : variant === 'light' ? colors.white : colors.turquoise;
  const pressedColor = variant === 'primary' ? colors.purplePressed : variant === 'light' ? '#EEEEEE' : colors.turquoisePressed;
  return (
    <Animated.View style={[{ alignSelf: 'stretch', transform: [{ scale }] }, style]}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: disabled ? colors.disabled : pressed ? pressedColor : base },
        ]}
      >
        <Text style={[styles.ctaText, variant === 'light' && !disabled && { color: colors.purple }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/** 1 → 1.04 → 1 をくり返す脈動。enabled が false のときは 1 のまま。 */
export function usePulse(enabled: boolean): Animated.Value {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!enabled) {
      v.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1.04, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enabled, v]);
  return v;
}

/** 日本語 ⇄ 英語の切り替えチップ（Figma: btn_en 48x32） */
export function LangToggle({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t, toggleLang } = useLang();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Translate / 言語切り替え"
      onPress={toggleLang}
      hitSlop={8}
      style={[styles.langChip, style]}
    >
      <Svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={colors.purple} strokeWidth={2.6}>
        <Path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="21 3 21 8 16 8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.langText}>{t('langToggle')}</Text>
    </Pressable>
  );
}

/** 白丸に金の ✕（Figma: Frame 113 / Ellipse 64 + Union） */
export function CloseButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} hitSlop={10} onPress={onPress}>
      <Svg width={32} height={32} viewBox="0 0 32 32">
        <Circle cx={16} cy={16} r={15.5} fill={colors.white} stroke={colors.goldBorder} strokeWidth={1} />
        <Path d="M 10.5,10.5 L 21.5,21.5 M 21.5,10.5 L 10.5,21.5" stroke={colors.goldDark} strokeWidth={3} strokeLinecap="round" />
      </Svg>
    </Pressable>
  );
}

/** カード右下の「進む」丸ボタン（Figma: Frame 113 32x32） */
export function AdvanceButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={14} style={styles.advance}>
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
    </Pressable>
  );
}

/** 進捗バー（Figma: Rectangle 44/67/68 — 灰色の枠付きトラック＋紫＋白いハイライト） */
export function ProgressBar({ percent }: { percent: number }) {
  const w = `${Math.max(0, Math.min(100, percent))}%` as const;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: w }]}>
        <View style={styles.highlight} />
      </View>
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
    justifyContent: 'center',
    gap: 3,
    backgroundColor: colors.white,
    borderRadius: 16.7,
  },
  langText: { color: colors.purple, fontWeight: '800', fontSize: 11 },
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
});
