/**
 * 適性診断 完了！（index.html #screen-ob-passport、Figma CH0-19）：オレンジ背景・メダル・1章解放のお知らせ。
 * 「結果を見る」ボタンは紫（360×48）で、左にクリップボードのアイコン（41×50）。脈動する（1.5秒周期）。
 */
import { router } from 'expo-router';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Celebration } from '@/components/Celebration';
import { PressScale, usePulse } from '@/components/ui';
import { diagnosisComplete } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';
import { useReducedMotion } from '@/theme/motion';
import { svgIcons } from '@/theme/svgIcons';

export default function DiagnosisCompleteScreen() {
  const { tr } = useLang();
  const c = diagnosisComplete;
  return (
    <Celebration variant="web" background="#FF805C" title={tr(c.title)} medal="medalBadge" footer={<ResultButton label={tr(c.button)} />}>
      <Text style={styles.unlocked}>{tr(c.unlocked)}</Text>
      {/* decor_gold_divider を白くしたもの（brightness(0) invert(1)） */}
      <Image source={images.goldDivider} style={styles.divider} resizeMode="contain" tintColor={colors.white} />
      <Text style={styles.body}>{tr(c.body)}</Text>
      <Text style={styles.hint}>{tr(c.hint)}</Text>
    </Celebration>
  );
}

function ResultButton({ label }: { label: string }) {
  const reduced = useReducedMotion();
  const scale = usePulse(!reduced);
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <PressScale testID="see-results" accessibilityRole="button" onPress={() => router.push('/onboarding/result')} style={styles.button}>
        {/* Figma の icon（40×56）：ボタンの左 34・下端にそろえ、上に 8 はみ出す。絵は少し傾いた（-10°）クリップボードで、枠より一回り大きい（50×62） */}
        <View style={styles.icon} pointerEvents="none">
          <SvgXml xml={svgIcons.resultIcon} width={50} height={62} style={styles.iconSvg} />
        </View>
        <Text style={styles.buttonText}>{label}</Text>
      </PressScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  unlocked: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.white, textAlign: 'center', marginBottom: 16 },
  divider: { alignSelf: 'center', width: 240, height: 13, marginBottom: 20 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center', marginBottom: 17 },
  hint: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center' },
  button: {
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgb(84,66,179)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.78,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: { position: 'absolute', left: 34, bottom: 0, width: 40, height: 56 },
  iconSvg: { position: 'absolute', left: -5, top: -3 },
  buttonText: { fontSize: 18, fontWeight: '800', color: colors.white },
});
