/** シナリオ完了／診断完了（Figma CH2-S1-08 / CH2-03）：ベージュ柄の上に ✔ 付きのカード */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { colors } from '@/theme/colors';

export function MilestoneCard({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <PatternBackground {...patterns.beige} style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 16, justifyContent: 'center' }}>
      <View style={styles.card}>
        <Svg width={64} height={64} viewBox="0 0 64 64">
          <Circle cx={32} cy={32} r={30} fill={colors.turquoise} />
          <Path d="M 19,33 L 28,42 L 45,23" stroke={colors.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.actions}>{children}</View>
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 21,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 14,
  },
  title: { fontSize: 20, lineHeight: 30, fontWeight: '700', color: colors.text, textAlign: 'center' },
  body: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center' },
  actions: { alignSelf: 'stretch', gap: 14, marginTop: 8, alignItems: 'center' },
});
