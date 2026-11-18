/**
 * 2章 Question（Figma CH2-S1-03 / 05 / 07）。正解は無く、選んだ行動傾向を記録する。
 * 1つ選ぶと NEXT が押せる（1章と違い、選んだ瞬間には進まない）。
 */
import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton, Flourish, PressScale } from '@/components/ui';
import { chapter2, type Tendency } from '@/content/chapter2';
import { ChapterHeader } from '@/features/chapter1/PlayLayout';
import { answerKey, useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { playPercent, usePlayParams } from '@/features/chapter2/usePlayParams';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';
import { layout } from '@/theme/layout';

export default function Chapter2QuestionScreen() {
  const p = usePlayParams();
  const { t, tr } = useLang();
  const { record, answer } = useChapter2();
  const insets = useSafeAreaInsets();
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
    // Figma CH2-S1-03：シーン画像は無く、ヘッダー直下から白いカード。NEXT は画面下に固定
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ChapterHeader percent={playPercent(scenario, stepIndex, 2)} exitTo="/chapter2/roles" />
      <ScrollView contentContainerStyle={styles.card}>
        <View style={styles.band} />
        <Flourish corner="tl" />
        <Flourish corner="tr" />
        <Text style={styles.label}>{t('questionLabel')}</Text>
        <Text style={styles.prompt}>{tr(chapter2.questionPrompt)}</Text>
        <View style={styles.choices}>
          {step.choices.map((c, i) => (
            <PressScale key={i} testID={`c2-choice-${i}`} accessibilityRole="radio" accessibilityState={{ checked: current === i }} onPress={() => setSelected(i)}>
              <ImageBackground
                source={current === i ? images.cardBorderSelected : images.cardBorderUnselected}
                resizeMode="stretch"
                style={styles.choice}
                imageStyle={{ width: '100%', height: '100%' }}
              >
                <Text style={[styles.letter, current === i && styles.letterSelected]}>{String.fromCharCode(65 + i)}</Text>
                <Text style={[styles.choiceText, current === i && { color: colors.purple }]}>{tr(c.text)}</Text>
              </ImageBackground>
            </PressScale>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton testID="c2-next" label={t('next')} disabled={current < 0} onPress={next} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.playBackground },
  card: { flexGrow: 1, backgroundColor: colors.white, paddingHorizontal: 21, paddingTop: 30, paddingBottom: 16 },
  band: { position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: colors.goldBorder },
  label: { fontFamily: fonts.montserrat, fontSize: 14, color: colors.goldLabel, letterSpacing: 2, textAlign: 'center', marginBottom: 20 },
  prompt: { fontSize: 16, lineHeight: 24, color: colors.black, paddingHorizontal: 20, marginBottom: 20 },
  choices: { gap: 10 },
  // 選択肢の文字は x107・幅240（Figma）。左に A〜D の丸を置く
  choice: { minHeight: 95, flexDirection: 'row', alignItems: 'center', gap: 16, paddingLeft: 30, paddingRight: 34, paddingVertical: 14 },
  letter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fonts.montserrat,
    fontSize: 16,
    color: colors.goldDark,
    backgroundColor: colors.beige,
    overflow: 'hidden',
  },
  letterSelected: { color: colors.white, backgroundColor: colors.purple },
  choiceText: { flex: 1, fontSize: 15, lineHeight: 22, fontWeight: '700', color: colors.text },
  bottom: { paddingHorizontal: 21, paddingTop: 8, backgroundColor: colors.white },
});
