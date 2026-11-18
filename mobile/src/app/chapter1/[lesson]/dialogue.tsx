/**
 * 第1章 会話（index.html #screen-ch101-sit2）。
 * 1/2：「状況 1 / 2」バッジ → 話者名 → セリフ（line1）
 * 2/2：「SHOSAの視点 2 / 2」バッジ → SHOSA のアイコンと名前 → SHOSA の視点（line2）
 * 3回目のタップで問題へ。
 */
import { useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Appear } from '@/components/Appear';
import { chapter1, parseLessonIndex } from '@/content/chapter1';
import { Ch1AdvanceButton, PlayLayout, playTextStyles, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
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
    <PlayLayout percent={progressPercent(index, 2)} image={lesson.sceneImage} imageAlt={tr(lesson.title)} label={t('situationLabel')}>
      {turn === 1 ? (
        <View key="turn1">
          <Text style={styles.badge}>{t('sceneTurn1')}</Text>
          <Text style={playTextStyles.speaker}>
            {tr(lesson.speaker)}
            {colon}
          </Text>
          <Text style={[playTextStyles.narrative, { marginTop: 18 }]}>{tr(lesson.line1)}</Text>
        </View>
      ) : (
        <Appear key="turn2" from="none" duration={300}>
          <Text style={[styles.badge, styles.badgeShosa]}>{t('sceneTurn2')}</Text>
          <View style={styles.shosaRow}>
            <Image source={images.mascotFace} style={styles.avatar} resizeMode="contain" />
            <Text style={[playTextStyles.speaker, { color: '#18A5B1' }]}>SHOSA{colon}</Text>
          </View>
          <Text style={[playTextStyles.narrative, { marginTop: 14 }]}>{tr(lesson.line2)}</Text>
        </Appear>
      )}
      <Ch1AdvanceButton label={t('next')} onPress={advance} />
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  // .ch101-turn-badge
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 20,
    color: '#8C7B6B',
    backgroundColor: '#F5EFE4',
    borderWidth: 1,
    borderColor: '#DFD3BA',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 10,
    letterSpacing: 0.6,
    overflow: 'hidden',
  },
  // .ch101-turn-badge.is-shosa
  badgeShosa: { color: '#0E7C86', backgroundColor: '#E4F7F6', borderColor: '#AEE3E0' },
  // .ch101-shosa-speaker-row / .ch101-shosa-mini-avatar
  shosaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#E4F7F6' },
});
