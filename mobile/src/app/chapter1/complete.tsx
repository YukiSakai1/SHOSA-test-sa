/**
 * 第1章 学習完了（Figma CH1-END）。
 * 空色の背景にサンバーストと白い円、トロフィーが「フェードイン＋拡大」で出る。
 * START ボタンは「タップを促す脈動（パルス）」（Figma 注記）。
 */
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Celebration, celebrationText } from '@/components/Celebration';
import { CtaButton } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { markChapter1Completed } from '@/features/chapter1/progress';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

export default function Chapter1CompleteScreen() {
  const { tr } = useLang();
  const { end } = chapter1;

  const finish = async () => {
    await markChapter1Completed();
    // Figma のフロー：1章完了 → 2章導線
    router.dismissTo('/');
    router.push('/chapter2');
  };

  return (
    <Celebration
      background={colors.skyEnd}
      title={tr(end.title)}
      medal="medalChapter1"
      footer={<CtaButton testID="chapter1-finish" variant="primary" pulse label={tr(end.button)} onPress={() => void finish()} />}
    >
      <Text style={celebrationText.unlocked}>{tr(end.unlockLabel)}</Text>
      <Text style={celebrationText.body}>{tr(end.body)}</Text>
      <Text style={celebrationText.note}>{tr(end.note)}</Text>
    </Celebration>
  );
}
