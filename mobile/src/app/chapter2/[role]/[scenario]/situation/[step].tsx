/**
 * 2章 Situation（Figma CH2-S1-02 / 04 / 06）：1章の「状況」と同じプレイ画面。
 * 場面画像（402×342）→ 白いカード（SITUATION）→ 段落ごとに 17 あけて並べる → 文の 20 下に、右そろえで進む丸ボタン（32）。
 * ※ Figma の上部に「チェックイン開始」の文字があるが、進捗バーと重なる位置のため置いていない。
 */
import { Redirect, router } from 'expo-router';
import { Text } from 'react-native';
import { Ch1AdvanceButton, PlayLayout, playTextStyles } from '@/features/chapter1/PlayLayout';
import { playPercent, usePlayParams } from '@/features/chapter2/usePlayParams';
import { useLang } from '@/i18n/LanguageProvider';

export default function Chapter2SituationScreen() {
  const p = usePlayParams();
  const { t, tr } = useLang();
  if (!p) return <Redirect href="/chapter2/roles" />;
  const { role, scenario, step, stepIndex } = p;
  const paragraphs = tr(step.situation).split('\n');

  return (
    <PlayLayout
      percent={playPercent(scenario, stepIndex, 1)}
      exitTo="/chapter2/roles"
      image={scenario.scene}
      imageAlt={tr(scenario.title)}
      label={t('situationLabel')}
    >
      {paragraphs.map((text, i) => (
        <Text key={i} style={[playTextStyles.narrative, i > 0 && { marginTop: 17 }]}>
          {text}
        </Text>
      ))}
      <Ch1AdvanceButton
        inline
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
