/** シナリオ完了（Figma CH2-S1-08）。次のシナリオへ、最後なら診断完了へ */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { CtaButton, PressScale } from '@/components/ui';
import { chapter2, fill, findRole } from '@/content/chapter2';
import { MilestoneCard } from '@/features/chapter2/MilestoneCard';
import { useLang } from '@/i18n/LanguageProvider';

export default function ScenarioCompleteScreen() {
  const params = useLocalSearchParams<{ role: string; scenario: string }>();
  const { tr } = useLang();
  const role = findRole(params.role);
  const index = role ? role.scenarios.findIndex((s) => s.id === params.scenario) : -1;
  const scenario = role?.scenarios[index];
  if (!role || !scenario) return <Redirect href="/chapter2/roles" />;

  const c = chapter2.scenarioComplete;
  const nextScenario = role.scenarios[index + 1];
  const next = () => {
    if (nextScenario) {
      router.push({ pathname: '/chapter2/[role]/[scenario]/situation/[step]', params: { role: role.id, scenario: nextScenario.id, step: '0' } });
    } else {
      router.push({ pathname: '/chapter2/diagnosis-complete', params: { role: role.id } });
    }
  };

  return (
    <MilestoneCard title={`[${index + 1}/${role.scenarios.length}] ${fill(tr(c.title), { title: tr(scenario.title) })}`} body={tr(c.body)}>
      <CtaButton testID="scenario-next" label={tr(c.button)} onPress={next} />
      <PressScale onPress={() => router.dismissTo('/chapter2/roles')}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#666666' }}>{tr(chapter2.roles.back)}</Text>
      </PressScale>
    </MilestoneCard>
  );
}
