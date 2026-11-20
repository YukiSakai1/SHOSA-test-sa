/**
 * 適性診断 完了！（index.html #screen-ob-passport、Figma CH0-19）：オレンジ背景・メダル・1章解放のお知らせ。
 * 「結果を見る」ボタンは紫（360×48）で、左にクリップボードのアイコン（41×50）。文字は Bold 18（Figma）、下に #4D3CA8 の縁（真下 3px・ぼかし無し）。脈動はさせない。
 * 案内文の「結果を見る」だけ太字にする。
 */
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Celebration, CelebrationDivider } from '@/components/Celebration';
import { PressScale } from '@/components/ui';
import { RichText } from '@/components/RichText';
import { diagnosisComplete } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { svgIcons } from '@/theme/svgIcons';

export default function DiagnosisCompleteScreen() {
  const { tr } = useLang();
  const c = diagnosisComplete;
  return (
    <Celebration variant="web" background="#FF805C" title={tr(c.title)} medal="medalBadge" footer={<ResultButton label={tr(c.button)} />}>
      <Text style={styles.unlocked}>{tr(c.unlocked)}</Text>
      {/* Figma の区切り線（星形のきらめきと、先の細い線） */}
      <CelebrationDivider style={styles.divider} />
      <Text style={styles.body}>{tr(c.body)}</Text>
      <RichText style={styles.hint} highlightStyle={styles.hintBold}>
        {tr(c.hint)}
      </RichText>
    </Celebration>
  );
}

function ResultButton({ label }: { label: string }) {
  return (
    <View>
      {/* Figma の影：DROP_SHADOW（0, 3）・ぼかし 0・#4D3CA8。ボタンと同じ形を 3 下にずらして後ろに置く */}
      <View style={styles.ledge} pointerEvents="none" />
      <PressScale testID="see-results" accessibilityRole="button" onPress={() => router.push('/onboarding/result')} style={styles.button}>
        {/* Figma の icon（40×56）：ボタンの左 34・下端にそろえ、上に 8 はみ出す。絵は少し傾いた（-10°）クリップボードで、枠より一回り大きい（50×62） */}
        <View style={styles.icon} pointerEvents="none">
          <SvgXml xml={svgIcons.resultIcon} width={50} height={62} style={styles.iconSvg} />
        </View>
        <Text style={styles.buttonText}>{label}</Text>
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  unlocked: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.white, textAlign: 'center', marginBottom: 16 },
  divider: { marginTop: 0, marginBottom: 20 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center', marginBottom: 17 },
  hint: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center' },
  hintBold: { color: colors.white, fontWeight: '700' },
  button: {
    height: 48,
    borderRadius: 999,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledge: { position: 'absolute', left: 0, right: 0, top: 3, height: 48, borderRadius: 999, backgroundColor: '#4D3CA8' },
  icon: { position: 'absolute', left: 34, bottom: 0, width: 40, height: 56 },
  iconSvg: { position: 'absolute', left: -5, top: -3 },
  // 「結果を見る」：Figma は Noto Sans CJK JP Bold 18・白
  buttonText: { fontSize: 18, fontWeight: '700', color: colors.white },
});
