/** 適性診断 完了！（Figma CH0-19）：オレンジ背景・メダル・1章解放のお知らせ */
import { router } from 'expo-router';
import { Text } from 'react-native';
import { Celebration, celebrationText } from '@/components/Celebration';
import { CtaButton } from '@/components/ui';
import { diagnosisComplete } from '@/content/onboarding';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

export default function DiagnosisCompleteScreen() {
  const { tr } = useLang();
  const c = diagnosisComplete;
  return (
    <Celebration
      background="#FF805C"
      title={tr(c.title)}
      medal="medalBadge"
      footer={<CtaButton testID="see-results" variant="primary" pulse label={tr(c.button)} onPress={() => router.push('/onboarding/result')} />}
    >
      <Text style={celebrationText.unlocked}>{tr(c.unlocked)}</Text>
      <Text style={celebrationText.body}>{tr(c.body)}</Text>
      <Text style={[celebrationText.body, { color: colors.black, marginTop: 6 }]}>{tr(c.hint)}</Text>
    </Celebration>
  );
}
