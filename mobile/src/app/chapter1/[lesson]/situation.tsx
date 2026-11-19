/**
 * 第1章 状況説明（Figma CH1-L01-01）：SITUATION → ナレーション（1文目と、それ以降の 2段落。段落の間は 17）。
 * 文字は左右 41・上は y=521（Noto Sans 16 / 行の高さ 24）。右下に 32×32 の「進む」ボタン。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import { Ch1AdvanceButton, PlayLayout, playTextStyles, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';

/** 1文目（「。」「.」「！」「？」まで）と、残りに分ける */
export function splitFirstSentence(text: string): [string, string] {
  const m = text.match(/^([\s\S]+?[。.!?！？])\s*([\s\S]*)$/);
  return m ? [m[1]!, m[2]!] : [text, ''];
}

export default function SituationScreen() {
  const { lesson: raw } = useLocalSearchParams<{ lesson: string }>();
  const { t, tr } = useLang();
  const index = parseLessonIndex(raw);
  const lesson = index === null ? undefined : chapter1.lessons[index];
  if (index === null || !lesson) return <Redirect href="/chapter1" />;
  const [first, rest] = splitFirstSentence(tr(lesson.narration));

  return (
    <PlayLayout percent={progressPercent(index, 1)} image={lesson.sceneImage} imageAlt={tr(lesson.title)} label={t('situationLabel')}>
      <Text style={playTextStyles.narrative}>{first}</Text>
      {rest !== '' && <Text style={[playTextStyles.narrative, { marginTop: 17 }]}>{rest}</Text>}
      <Ch1AdvanceButton
        label={t('next')}
        onPress={() => router.push({ pathname: '/chapter1/[lesson]/dialogue', params: { lesson: String(index) } })}
      />
    </PlayLayout>
  );
}
