/** 第1章 2択問題（Web版 screen-ch101-question） */
import { useCallback, useState } from 'react';
import { Redirect, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ImageBackground, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { PlayLayout, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

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
      <Text style={styles.question}>{tr(lesson.question)}</Text>
      <View style={styles.choices}>
        {CHOICE_IDS.map((id) => (
          <Pressable
            key={id}
            testID={`choice-${id}`}
            accessibilityRole="button"
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
          </Pressable>
        ))}
      </View>
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  question: { fontSize: 16, lineHeight: 24, color: colors.black, marginBottom: 20, paddingHorizontal: 20 },
  choices: { gap: 10, marginBottom: -50 },
  choice: { minHeight: 95, justifyContent: 'center', paddingHorizontal: 34, paddingVertical: 16 },
  // 枠画像を親の幅に合わせる（指定しないと Web で画像の元サイズのままはみ出す）
  choiceBorder: { width: '100%', height: '100%' },
  choiceText: { fontSize: 16, lineHeight: 24, color: colors.text, fontWeight: '700' },
});
