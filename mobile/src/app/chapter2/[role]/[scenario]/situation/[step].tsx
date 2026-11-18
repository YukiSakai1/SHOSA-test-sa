/** 2章 Situation（Figma CH2-S1-02 / 04 / 06）：1章と同じプレイ画面レイアウト */
import { Redirect, router } from 'expo-router';
import { Text } from 'react-native';
import { AdvanceButton } from '@/components/ui';
import { PlayLayout, playTextStyles } from '@/features/chapter1/PlayLayout';
import { playPercent, usePlayParams } from '@/features/chapter2/usePlayParams';
import { useLang } from '@/i18n/LanguageProvider';

export default function Chapter2SituationScreen() {
  const p = usePlayParams();
  const { t, tr } = useLang();
  if (!p) return <Redirect href="/chapter2/roles" />;
  const { role, scenario, step, stepIndex } = p;

  return (
    <PlayLayout
      percent={playPercent(scenario, stepIndex, 1)}
      exitTo="/chapter2/roles"
      image={scenario.scene}
      imageAlt={tr(scenario.title)}
      label={t('situationLabel')}
    >
      <Text style={playTextStyles.narrative}>{tr(step.situation)}</Text>
      <AdvanceButton
        label={t('next')}
        onPress={() =>
          router.push({
            pathname: '/chapter2/[role]/[scenario]/question/[step]',
            params: { role: role.id, scenario: scenario.id, step: String(stepIndex) },
          })
        }
      />
    </PlayLayout>
  );
}
