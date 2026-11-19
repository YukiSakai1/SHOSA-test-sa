/**
 * 2章 Question（Figma CH2-S1-03 / 05 / 07）。正解は無く、選んだ行動傾向を記録する。
 * 1章の問題と同じ見た目：場面画像は無く、ヘッダーの下から白いカード（QUESTION）→ 問題文 → 20 あけて選択肢（360×95 のカードを 10 あけて並べる）。
 * 選んだカードは紫（#715BE1）の枠。1つ選ぶと、画面下の NEXT（360×48・ターコイズ）が押せる（1章と違い、選んだ瞬間には進まない）。
 */
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { CtaButton, PressScale } from '@/components/ui';
import { chapter2, type Tendency } from '@/content/chapter2';
import { PlayLayout, playTextStyles } from '@/features/chapter1/PlayLayout';
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
      label={t('questionLabel')}
      footer={<CtaButton testID="c2-next" label={t('next')} disabled={current < 0} onPress={next} />}
    >
      <Text style={playTextStyles.narrative}>{tr(chapter2.questionPrompt)}</Text>
      <View style={styles.choices}>
        {step.choices.map((c, i) => (
          <PressScale key={i} testID={`c2-choice-${i}`} accessibilityRole="radio" accessibilityState={{ checked: current === i }} onPress={() => setSelected(i)}>
            <ImageBackground
              source={current === i ? images.cardBorderSelected : images.cardBorderUnselected}
              resizeMode="stretch"
              style={styles.choice}
              imageStyle={styles.choiceBorder}
            >
              <View style={[styles.dot, current === i && styles.dotSelected]} />
              <Text style={styles.choiceText}>{tr(c.text)}</Text>
            </ImageBackground>
          </PressScale>
        ))}
      </View>
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  // 問題文の下端から 20。カードは文字の左右 41 より 20 外へ広げて、幅 360（左右 21）にする
  choices: { gap: 10, marginTop: 20, marginHorizontal: -20 },
  choice: { minHeight: 95, flexDirection: 'row', alignItems: 'center', paddingLeft: 34, paddingRight: 28, paddingVertical: 16 },
  // 枠画像を親の幅に合わせる（指定しないと Web で画像の元サイズのままはみ出す）
  choiceBorder: { width: '100%', height: '100%' },
  // 左の丸（30・白）。Figma に中身の指定は無い
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: '#DDDDDD' },
  dotSelected: { borderColor: colors.purple, borderWidth: 2 },
  choiceText: { flex: 1, marginLeft: 22, fontSize: 15, lineHeight: 21, fontWeight: '700', color: '#333333' },
});
