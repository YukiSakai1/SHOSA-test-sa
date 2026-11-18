/**
 * 2章 Question（Figma CH2-S1-03 / 05 / 07）。正解は無く、選んだ行動傾向を記録する。
 * 1つ選ぶと NEXT が押せる（1章と違い、選んだ瞬間には進まない）。
 */
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { CtaButton } from '@/components/ui';
import { chapter2, type Tendency } from '@/content/chapter2';
import { PlayLayout } from '@/features/chapter1/PlayLayout';
import { answerKey, useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { playPercent, usePlayParams } from '@/features/chapter2/usePlayParams';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function Chapter2QuestionScreen() {
  const p = usePlayParams();
  const { t, tr } = useLang();
  const { record, answer } = useChapter2();
  const saved = p ? record.answers[p.role.id]?.[answerKey(p.scenario.id, p.stepIndex)] : undefined;
  const [selected, setSelected] = useState<number | null>(null);
  if (!p) return <Redirect href="/chapter2/roles" />;
  const { role, scenario, step, stepIndex } = p;

  const current = selected ?? (saved ? step.choices.findIndex((c) => c.tendency === saved) : -1);

  const next = () => {
    const choice = step.choices[current];
    if (!choice) return;
    answer(role.id, scenario.id, stepIndex, choice.tendency as Tendency);
    if (stepIndex + 1 < scenario.steps.length) {
      router.push({ pathname: '/chapter2/[role]/[scenario]/situation/[step]', params: { role: role.id, scenario: scenario.id, step: String(stepIndex + 1) } });
    } else {
      router.push({ pathname: '/chapter2/scenario-complete', params: { role: role.id, scenario: scenario.id } });
    }
  };

  return (
    <PlayLayout
      percent={playPercent(scenario, stepIndex, 2)}
      exitTo="/chapter2/roles"
      image={scenario.scene}
      imageAlt={tr(scenario.title)}
      label={t('questionLabel')}
    >
      <Text style={styles.prompt}>{tr(chapter2.questionPrompt)}</Text>
      <View style={styles.choices}>
        {step.choices.map((c, i) => (
          <Pressable key={i} testID={`c2-choice-${i}`} accessibilityRole="radio" accessibilityState={{ checked: current === i }} onPress={() => setSelected(i)}>
            <ImageBackground
              source={current === i ? images.cardBorderSelected : images.cardBorderUnselected}
              resizeMode="stretch"
              style={styles.choice}
              imageStyle={{ width: '100%', height: '100%' }}
            >
              <Text style={[styles.choiceText, current === i && { color: colors.purple }]}>{tr(c.text)}</Text>
            </ImageBackground>
          </Pressable>
        ))}
      </View>
      <CtaButton testID="c2-next" label={t('next')} disabled={current < 0} onPress={next} style={{ marginTop: 16, marginBottom: -50 }} />
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  prompt: { fontSize: 16, lineHeight: 24, color: colors.black, paddingHorizontal: 20, marginBottom: 14 },
  choices: { gap: 8 },
  choice: { minHeight: 78, justifyContent: 'center', paddingHorizontal: 34, paddingVertical: 14 },
  choiceText: { fontSize: 15, lineHeight: 22, fontWeight: '700', color: colors.text },
});
