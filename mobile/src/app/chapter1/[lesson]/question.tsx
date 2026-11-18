/** 第1章 2択問題（Web版 screen-ch101-question） */
import { useCallback, useState } from 'react';
import { Redirect, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { PlayLayout, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';
import { PressScale } from '@/components/ui';

const CHOICE_IDS: ChoiceId[] = ['A', 'B'];
/** 選んだカードの色が変わるのを見せてから結果へ進む（Web版と同じ 280ms） */
const ADVANCE_DELAY_MS = 280;

export default function QuestionScreen() {
  const { lesson: raw } = useLocalSearchParams<{ lesson: string }>();
  const { t, tr } = useLang();
  const [selected, setSelected] = useState<ChoiceId | null>(null);

  // 結果画面から「戻る」で帰ってきたら選択をリセット
  useFocusEffect(useCallback(() => setSelected(null), []));

  const index = parseLessonIndex(raw);
  const lesson = index === null ? undefined : chapter1.lessons[index];
  if (index === null || !lesson) return <Redirect href="/chapter1" />;

  const choose = (choice: ChoiceId) => {
    if (selected) return; // 連打防止
    setSelected(choice);
    if (Platform.OS !== 'web') void Haptics.selectionAsync();
    setTimeout(() => {
      router.push({ pathname: '/chapter1/[lesson]/result', params: { lesson: String(index), choice } });
    }, ADVANCE_DELAY_MS);
  };

  return (
    <PlayLayout
      percent={progressPercent(index, 3)}
      image={lesson.sceneImage}
      imageAlt={tr(lesson.title)}
      label={t('questionLabel')}
    >
      {/* index.html #screen-ch101-question：状況タグ → 問題文（中央・太字）→ 選択肢 */}
      <Text style={styles.tag}>{tr(lesson.situationTag)}</Text>
      <Text style={styles.question}>{tr(lesson.question)}</Text>
      <View style={styles.choices}>
        {CHOICE_IDS.map((id) => (
          <PressScale
            key={id}
            testID={`choice-${id}`}
            accessibilityState={{ selected: selected === id }}
            onPress={() => choose(id)}
          >
            <ImageBackground
              source={selected === id ? images.cardBorderSelected : images.cardBorderUnselected}
              resizeMode="stretch"
              style={styles.choice}
              imageStyle={styles.choiceBorder}
            >
              <Text style={styles.choiceText}>{tr(lesson.choices[id])}</Text>
            </ImageBackground>
          </PressScale>
        ))}
      </View>
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  // .ch101-situation-tag
  tag: {
    alignSelf: 'center',
    maxWidth: '92%',
    backgroundColor: '#FAF5EB',
    borderWidth: 1,
    borderColor: '#E2D5BA',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 11.5,
    fontWeight: '700',
    lineHeight: 15.5,
    color: '#7D6A54',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  // .ch101-question-text
  question: { fontSize: 15, fontWeight: '700', lineHeight: 24, color: '#2B2B2B', textAlign: 'center', marginTop: 4, marginBottom: 24 },
  // .ch101-choices-stack / .ch101-scalloped-choice-btn
  choices: { gap: 14 },
  choice: { minHeight: 68, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14 },
  // 枠画像を親の幅に合わせる（指定しないと Web で画像の元サイズのままはみ出す）
  choiceBorder: { width: '100%', height: '100%' },
  choiceText: { fontSize: 13.5, lineHeight: 18.9, color: '#2B2B2B', fontWeight: '700', textAlign: 'center' },
});
