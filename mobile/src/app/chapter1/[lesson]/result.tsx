/**
 * 第1章 結果と解説（Web版 screen-ch101-result）。
 * URL パラメータ choice（A / B）で選んだ答えを受け取る。
 */
import { useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton } from '@/components/ui';
import { chapter1, chapter1LessonCount, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { FocusModal } from '@/features/chapter1/FocusModal';
import { ChapterHeader, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

function parseChoice(raw: string | undefined): ChoiceId | null {
  return raw === 'A' || raw === 'B' ? raw : null;
}

export default function ResultScreen() {
  const params = useLocalSearchParams<{ lesson: string; choice: string }>();
  const { t, tr } = useLang();
  const insets = useSafeAreaInsets();
  const [focusOpen, setFocusOpen] = useState(false);

  const index = parseLessonIndex(params.lesson);
  const choice = parseChoice(params.choice);
  const lesson = index === null ? undefined : chapter1.lessons[index];
  if (index === null || !lesson || !choice) return <Redirect href="/chapter1" />;

  const isCorrect = choice === lesson.correct;

  const goNext = () => {
    if (index + 1 < chapter1LessonCount) {
      router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: String(index + 1) } });
    } else {
      router.push('/chapter1/complete');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ChapterHeader percent={progressPercent(index, 4)} dark />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.tealCard}>
          <View style={styles.statusRow}>
            <Text style={[styles.badge, !isCorrect && styles.badgeIncorrect]}>{isCorrect ? '✔' : '✕'}</Text>
            <Text testID="result-title" style={styles.statusTitle}>
              {isCorrect ? t('correct') : t('incorrect')}
            </Text>
          </View>
          <Text style={styles.explanation}>{tr(lesson.reason)}</Text>
          <View style={styles.mascotRow}>
            <Image source={images.floorShadow} style={styles.shadow} resizeMode="contain" />
            <Image source={images.mascotFace} style={styles.mascot} resizeMode="contain" />
          </View>
        </View>
        <View style={[styles.lower, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.bubble}>
            <View style={styles.pointer} />
            <Text style={styles.bubbleText}>{tr(lesson.shosaPrompt)}</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => setFocusOpen(true)} style={styles.focusBtn}>
            <Image source={images.iconFocus} style={styles.focusIcon} />
            <Text style={styles.focusLabel}>{t('focusButton')}</Text>
          </Pressable>
          <CtaButton testID="result-next" label={t('next')} onPress={goNext} />
        </View>
      </ScrollView>
      <FocusModal lesson={lesson} visible={focusOpen} onClose={() => setFocusOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.teal },
  tealCard: { backgroundColor: colors.teal, paddingHorizontal: 24, paddingTop: 12, alignItems: 'center' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    color: colors.teal,
    textAlign: 'center',
    lineHeight: 34,
    fontSize: 18,
    fontWeight: '900',
    overflow: 'hidden',
  },
  badgeIncorrect: { color: colors.incorrect },
  statusTitle: { fontSize: 24, fontWeight: '900', color: colors.white },
  explanation: { marginTop: 14, fontSize: 15, lineHeight: 24, color: colors.white, fontWeight: '600' },
  mascotRow: { height: 150, width: 160, alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
  mascot: { width: 130, height: 130 },
  shadow: { position: 'absolute', bottom: 0, width: 110, height: 18 },
  lower: { flexGrow: 1, backgroundColor: colors.mint, padding: 20, gap: 16 },
  bubble: { backgroundColor: colors.white, borderRadius: 16, padding: 16 },
  pointer: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white,
  },
  bubbleText: { fontSize: 14, lineHeight: 22, color: colors.text, fontWeight: '600' },
  focusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.gold,
    paddingVertical: 12,
  },
  focusIcon: { width: 26, height: 26 },
  focusLabel: { fontSize: 15, fontWeight: '800', color: colors.gold },
});
