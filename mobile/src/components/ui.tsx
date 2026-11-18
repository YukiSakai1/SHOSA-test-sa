/** 画面をまたいで使う小さな UI 部品 */
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

/** 角の金色の飾り */
export function Flourish({ corner }: { corner: 'tl' | 'tr' | 'bl' | 'br' }) {
  const d = {
    tl: 'M 3,3 C 10,5 15,10 17,17 C 10,15 5,10 3,3 Z M 3,3 L 12,4 M 3,3 L 4,12',
    tr: 'M 21,3 C 14,5 9,10 7,17 C 14,15 19,10 21,3 Z M 21,3 L 12,4 M 21,3 L 20,12',
    bl: 'M 3,21 C 10,19 15,14 17,7 C 10,9 5,14 3,21 Z M 3,21 L 12,20 M 3,21 L 4,12',
    br: 'M 21,21 C 14,19 9,14 7,7 C 14,9 19,14 21,21 Z M 21,21 L 12,20 M 21,21 L 20,12',
  }[corner];
  const pos: ViewStyle = {
    position: 'absolute',
    ...(corner[0] === 't' ? { top: 6 } : { bottom: 6 }),
    ...(corner[1] === 'l' ? { left: 6 } : { right: 6 }),
  };
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" style={pos} pointerEvents="none">
      <Path d={d} fill={colors.gold} stroke={colors.gold} strokeWidth={1} />
    </Svg>
  );
}

/** 画面下のメインボタン（START / NEXT） */
export function CtaButton({
  label,
  onPress,
  style,
  testID,
}: {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, style]}
    >
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}

/** 日本語 ⇄ 英語の切り替えチップ */
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
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.purple} strokeWidth={2.6}>
        <Path d="M21 12a9 9 0 1 1-2.6-6.3L21 8" strokeLinecap="round" strokeLinejoin="round" />
        <Polyline points="21 3 21 8 16 8" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
      <Text style={styles.langText}>{t('langToggle')}</Text>
    </Pressable>
  );
}

/** カード右下の「進む」丸ボタン */
export function AdvanceButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={12} style={styles.advance}>
      <Svg width={44} height={44} viewBox="0 0 32 32">
        <Circle cx={16} cy={16} r={14} fill={colors.white} stroke={colors.gold} strokeWidth={1.5} />
        <Path
          d="M 12,16 L 20,16 M 16,11 L 20.5,16 L 16,21"
          fill="none"
          stroke={colors.gold}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

/** 細い進捗バー（0〜100） */
export function ProgressBar({ percent }: { percent: number }) {
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(100, percent))}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  cta: {
    backgroundColor: colors.cta,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  ctaPressed: { backgroundColor: colors.ctaPressed, transform: [{ scale: 0.98 }] },
  ctaText: { color: colors.white, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E4DEF9',
  },
  langText: { color: colors.purple, fontWeight: '800', fontSize: 12 },
  advance: { position: 'absolute', right: 14, bottom: 14 },
  track: { flex: 1, height: 8, backgroundColor: colors.progressTrack, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.purple, borderRadius: 999 },
});
