/** Omotenashi Style 診断 完了（Figma CH2-03）→ VIEW RESULTS */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { CtaButton } from '@/components/ui';
import { chapter2, findRole } from '@/content/chapter2';
import { MilestoneCard } from '@/features/chapter2/MilestoneCard';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';

export default function DiagnosisCompleteScreen() {
  const params = useLocalSearchParams<{ role: string }>();
  const { tr } = useLang();
  const role = findRole(params.role);
  if (!role) return <Redirect href="/chapter2/roles" />;
  const c = chapter2.diagnosisComplete;
  return (
    <MilestoneCard title={tr(c.title)} body={tr(c.body)}>
      <CtaButton
        testID="view-results"
        pulse
        icon={{ source: images.resultButtonIcon, width: 40, height: 56 }}
        label={tr(c.button)}
        onPress={() => router.push({ pathname: '/chapter2/result', params: { role: role.id } })}
      />
    </MilestoneCard>
  );
}
