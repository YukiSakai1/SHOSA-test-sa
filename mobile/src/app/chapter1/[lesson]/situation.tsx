/** 第1章 状況説明（Web版 screen-ch101-sit1） */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { AdvanceButton } from '@/components/ui';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import { PlayLayout, playTextStyles, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';

export default function SituationScreen() {
  const { lesson: raw } = useLocalSearchParams<{ lesson: string }>();
  const { t, tr } = useLang();
  const index = parseLessonIndex(raw);
  const lesson = index === null ? undefined : chapter1.lessons[index];
  if (index === null || !lesson) return <Redirect href="/chapter1" />;

  return (
    <PlayLayout
      percent={progressPercent(index, 1)}
      image={lesson.sceneImage}
      imageAlt={tr(lesson.title)}
      label={t('situationLabel')}
    >
      <Text style={playTextStyles.meta}>{`${lesson.id}  •  ${lesson.time}  •  ${tr(lesson.title)}`}</Text>
      <Text style={playTextStyles.narrative}>{tr(lesson.narration)}</Text>
      <AdvanceButton
        label={t('next')}
        onPress={() => router.push({ pathname: '/chapter1/[lesson]/dialogue', params: { lesson: String(index) } })}
      />
    </PlayLayout>
  );
}
