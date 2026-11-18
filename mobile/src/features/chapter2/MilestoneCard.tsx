/**
 * シナリオ完了／診断完了（Figma CH2-S1-08 / CH2-03）。
 * Figma の配置：タイトルは画面上部（セーフエリア上端から 21）、中央に ✔、
 * 本文はセーフエリア上端から 353、ボタンは画面下（下端から 32）。
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { colors } from '@/theme/colors';
import { layout } from '@/theme/layout';

export function MilestoneCard({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <PatternBackground {...patterns.beige} style={{ paddingTop: insets.top + 21, paddingBottom: insets.bottom + layout.ctaBottom }}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.badgeArea}>
        <View style={styles.badgeHalo}>
          <Svg width={120} height={120} viewBox="0 0 64 64">
            <Circle cx={32} cy={32} r={30} fill={colors.turquoise} />
            <Path d="M 19,33 L 28,42 L 45,23" stroke={colors.white} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      </View>
      <Text style={styles.body}>{body}</Text>
      <View style={{ flex: 1 }} />
      <View style={styles.actions}>{children}</View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, lineHeight: 30, fontWeight: '700', color: colors.text, textAlign: 'center', paddingHorizontal: 76 },
  // タイトル下端（約 81）から本文（353）までの領域
  badgeArea: { height: 272, alignItems: 'center', justifyContent: 'center' },
  badgeHalo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.goldBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.black, textAlign: 'center', paddingHorizontal: 46 },
  actions: { paddingHorizontal: layout.sideMargin, gap: 30, alignItems: 'center' },
});
