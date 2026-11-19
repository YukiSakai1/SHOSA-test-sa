/**
 * 第1章 学習完了（index.html #screen-ch101-complete）。
 * 0章の「適性診断 完了！」と同じ演出（components/Celebration.tsx の variant="web"）にそろえる：
 *   飾り線・タイトル → トロフィー（180×205。上から落ちて弾み、浮かぶ。光が1回横切る）
 *   → 後ろに放射線（24本・ゆっくり回る）と後光（脈動）→ 解放のお知らせ → 区切り線 → 本文 → 注記 → START（紫・脈動）
 * 背景は水色。紙吹雪と成功の触覚も 0章と同じ。
 */
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { Celebration, CelebrationDivider } from '@/components/Celebration';
import { colors } from '@/theme/colors';
import { CtaButton } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { markChapter1Completed } from '@/features/chapter1/progress';
import { useLang } from '@/i18n/LanguageProvider';
import { CHAPTER2_ENABLED } from '@/lib/features';

export default function Chapter1CompleteScreen() {
  const { tr } = useLang();
  const { end } = chapter1;

  const finish = async () => {
    await markChapter1Completed();
    // Figma のフロー：1章完了 → 2章導線
    router.dismissTo('/');
    if (CHAPTER2_ENABLED) router.push('/chapter2');
  };

  return (
    <Celebration
      variant="web"
      background="#4FBFF1"
      title={tr(end.title)}
      medal="medalChapter1"
      footer={<CtaButton testID="chapter1-finish" variant="primary" pulse label={tr(end.button)} onPress={() => void finish()} />}
    >
      {/* Figma CH1-END：解放の文言（20 Bold）→ 16 → 区切り線（240×13）→ 20 → 本文（16 / 24）→ 6 → 注記（12 / 24）。0章の完了画面と同じ間隔 */}
      {/* 解放の文言は Figma どおり常に出す（2章へ進む導線は CHAPTER2_ENABLED で別に切り替える）。区切り線（frames.png）は本文の上 */}
      <Text style={styles.unlocked}>{tr(end.unlockLabel)}</Text>
      <CelebrationDivider style={styles.divider} />
      <Text style={styles.body}>{tr(end.body)}</Text>
      <Text style={styles.note}>{tr(end.note)}</Text>
    </Celebration>
  );
}

const styles = StyleSheet.create({
  unlocked: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.white, textAlign: 'center', marginBottom: 16 },
  divider: { marginTop: 0, marginBottom: 20 },
  body: { fontSize: 16, lineHeight: 24, color: colors.white, textAlign: 'center' },
  note: { fontSize: 12, lineHeight: 24, color: colors.white, textAlign: 'center', marginTop: 6 },
});
