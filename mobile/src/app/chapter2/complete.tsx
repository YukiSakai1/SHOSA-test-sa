/**
 * 2章 職種診断完了（Figma CH2-06）：緑の背景・メダル・2つのボタン。
 * 演出（放射線・後光・トロフィー・紙吹雪）は 0章の完了画面と同じ（Celebration の variant="web"）。
 * NEXT CHAPTER：3章はまだデザインが無いためタイトルへ戻る。
 * TRY ANOTHER ROLE：ROLE Line Up へ戻る。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Celebration, CelebrationDivider, celebrationText } from '@/components/Celebration';
import { CtaButton } from '@/components/ui';
import { chapter2, fill, findRole } from '@/content/chapter2';
import { useLang } from '@/i18n/LanguageProvider';

export default function Chapter2CompleteScreen() {
  const params = useLocalSearchParams<{ role: string }>();
  const { tr } = useLang();
  const role = findRole(params.role);
  if (!role) return <Redirect href="/chapter2/roles" />;
  const e = chapter2.end;

  return (
    <Celebration
      variant="web"
      background="#10C56E"
      title={fill(tr(e.title), { role: role.name })}
      medal="medalChapter2"
      footer={
        <>
          {/* Figma CH2-06：上が紫、下が白 */}
          <CtaButton testID="next-chapter" variant="primary" pulse label={tr(e.nextChapter)} onPress={() => router.dismissTo('/')} />
          <CtaButton testID="another-role" variant="light" label={tr(e.anotherRole)} onPress={() => router.dismissTo('/chapter2/roles')} />
        </>
      }
    >
      <Text style={celebrationText.unlocked}>{tr(e.lead)}</Text>
      <CelebrationDivider />
      <Text style={celebrationText.body}>{tr(e.body)}</Text>
    </Celebration>
  );
}
