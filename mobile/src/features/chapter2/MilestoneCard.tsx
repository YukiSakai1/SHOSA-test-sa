/**
 * シナリオ完了／診断完了（Figma CH2-S1-08 / CH2-03）。位置は Figma の画面（402×874、上のステータスバー 59 を含む）から。
 *   ✕（上から 73・進捗バーなし）→ タイトル（上から 83・Bold 20・2行・中央）→ 区切り線（上から 155・285×15）
 *   → ✔ の丸（90×90・#00C9C3・上から 295）→ 本文（上から 415・Regular 16）→ 下にボタン（360×48）。
 * 背景はベージュに柄。
 */
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { ChapterHeader } from '@/features/chapter1/PlayLayout';
import { images } from '@/theme/images';

const FIGMA_TOP = 59;

export function MilestoneCard({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;
  return (
    <PatternBackground {...patterns.beige}>
      <ChapterHeader percent={100} exitTo="/chapter2/roles" bare />
      <Text style={[styles.title, { top: y(83) }]}>{title}</Text>
      <Image source={images.frames} style={[styles.divider, { top: y(155) }]} resizeMode="contain" />
      <View style={[styles.check, { top: y(295) }]}>
        <Svg width={46} height={30} viewBox="0 0 46 30">
          <Path d="M 5 15 L 17 25 L 41 5" stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <Text style={[styles.body, { top: y(415) }]}>{body}</Text>
      <View style={[styles.actions, { bottom: insets.bottom + 32 }]}>{children}</View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  title: { position: 'absolute', left: 76, right: 76, fontSize: 20, lineHeight: 30, fontWeight: '700', letterSpacing: 1.5, color: '#333333', textAlign: 'center' },
  divider: { position: 'absolute', alignSelf: 'center', width: 285, height: 15 },
  check: { position: 'absolute', alignSelf: 'center', width: 90, height: 90, borderRadius: 45, backgroundColor: '#00C9C3', alignItems: 'center', justifyContent: 'center' },
  body: { position: 'absolute', left: 46, right: 46, fontSize: 16, lineHeight: 24, color: '#000000', textAlign: 'center' },
  actions: { position: 'absolute', left: 21, right: 21, gap: 30, alignItems: 'center' },
});
