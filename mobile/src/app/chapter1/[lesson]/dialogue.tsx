/**
 * 第1章 会話（Web版 screen-ch101-sit2）。
 * 1/2：登場人物のセリフ → 2/2：SHOSA の視点 → 問題へ
 */
import { useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AdvanceButton } from '@/components/ui';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import { PlayLayout, playTextStyles, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function DialogueScreen() {
  const { lesson: raw } = useLocalSearchParams<{ lesson: string }>();
  const { lang, t, tr } = useLang();
  const [turn, setTurn] = useState<1 | 2>(1);
  const index = parseLessonIndex(raw);
  const lesson = index === null ? undefined : chapter1.lessons[index];
  if (index === null || !lesson) return <Redirect href="/chapter1" />;

  const colon = lang === 'en' ? ':' : '：';

  const advance = () => {
    if (turn === 1) setTurn(2);
    else router.push({ pathname: '/chapter1/[lesson]/question', params: { lesson: String(index) } });
  };

  return (
    <PlayLayout
      percent={progressPercent(index, 2)}
      image={lesson.sceneImage}
      imageAlt={tr(lesson.title)}
      label={t('situationLabel')}
    >
      {turn === 1 ? (
        <View>
          <Text style={styles.badge}>{t('sceneTurn1')}</Text>
          <Text style={playTextStyles.speaker}>
            {tr(lesson.speaker)}
            {colon}
          </Text>
          <Text style={[playTextStyles.narrative, { marginTop: 14 }]}>{tr(lesson.line1)}</Text>
        </View>
      ) : (
        <View>
          <Text style={[styles.badge, styles.badgeShosa]}>{t('sceneTurn2')}</Text>
          <View style={styles.shosaRow}>
            <Image source={images.mascotFace} style={styles.avatar} />
            <Text style={[playTextStyles.speaker, { color: colors.teal }]}>SHOSA{colon}</Text>
          </View>
          <Text style={[playTextStyles.narrative, { marginTop: 12 }]}>{tr(lesson.line2)}</Text>
        </View>
      )}
      <AdvanceButton label={t('next')} onPress={advance} />
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    backgroundColor: colors.cream,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  badgeShosa: { color: colors.teal, backgroundColor: colors.mint },
  shosaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
});
