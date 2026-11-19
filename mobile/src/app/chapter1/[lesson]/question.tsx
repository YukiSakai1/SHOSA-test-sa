/**
 * 第1章 2択問題（Figma CH1-L01-03）。
 * QUESTION → 問題文（左そろえ・Regular 16 / 24）→ 20 あけて選択肢（360×95 のカードを 10 あけて2つ）。
 * 選択肢カード：左 34 に丸（30・白・#DDDDDD の枠）、その 22 右から文字（幅 240・Bold 15 / 21・#333333）。
 * 丸の中身は Figma に指定がないため、いまは空のまま（仮）。
 */
import { useCallback, useState } from 'react';
import { Redirect, router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ImageBackground, Platform, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { PlayLayout, playTextStyles, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
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
    <PlayLayout percent={progressPercent(index, 3)} image={lesson.sceneImage} imageAlt={tr(lesson.title)} label={t('questionLabel')}>
      <Text style={playTextStyles.narrative}>{tr(lesson.question)}</Text>
      <View style={styles.choices}>
        {CHOICE_IDS.map((id) => (
          <PressScale key={id} testID={`choice-${id}`} accessibilityState={{ selected: selected === id }} onPress={() => choose(id)}>
            <ImageBackground
              source={selected === id ? images.cardBorderSelected : images.cardBorderUnselected}
              resizeMode="stretch"
              style={styles.choice}
              imageStyle={styles.choiceBorder}
            >
              <View style={[styles.dot, selected === id && styles.dotSelected]} />
              <Text style={styles.choiceText}>{tr(lesson.choices[id])}</Text>
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
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.white, borderWidth: 1, borderColor: '#DDDDDD' },
  dotSelected: { borderColor: colors.purple, borderWidth: 2 },
  choiceText: { flex: 1, marginLeft: 22, fontSize: 15, lineHeight: 21, fontWeight: '700', color: '#333333' },
});
