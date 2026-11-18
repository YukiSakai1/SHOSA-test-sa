/**
 * 適性診断（Figma CH0-14）。1画面に3問、5段階（そう思わない〜とてもそう思う）で答える。
 * 3問すべて答えると NEXT が押せる。最後のページの NEXT で診断完了画面へ。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APTITUDE_PAGE_SIZE, aptitudePageCount, aptitudeQuestions, aptitudeScale } from '@/content/onboarding';
import { QuestionLayout } from '@/features/onboarding/components';
import { aptitudeKey } from '@/features/onboarding/diagnosis';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

/** 両端ほど大きい丸（Figma の Likert スケール） */
const DOT_SIZES = [44, 36, 28, 36, 44] as const;

export default function AptitudeScreen() {
  const { page: raw } = useLocalSearchParams<{ page: string }>();
  const { tr } = useLang();
  const { record, update } = useOnboarding();
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 0 || page >= aptitudePageCount) return <Redirect href="/onboarding/aptitude-intro" />;

  const questions = aptitudeQuestions.slice(page * APTITUDE_PAGE_SIZE, (page + 1) * APTITUDE_PAGE_SIZE);
  const allAnswered = questions.every((q) => typeof record.aptitude[aptitudeKey(q.id)] === 'number');

  const next = () => {
    if (page + 1 < aptitudePageCount) router.push({ pathname: '/onboarding/aptitude/[page]', params: { page: String(page + 1) } });
    else router.push('/onboarding/complete');
  };

  return (
    <QuestionLayout percent={Math.round(((page + (allAnswered ? 1 : 0)) / aptitudePageCount) * 100)} nextDisabled={!allAnswered} onNext={next}>
      {questions.map((q) => {
        const value = record.aptitude[aptitudeKey(q.id)];
        return (
          <View key={q.id} style={styles.block}>
            <Text style={styles.q}>{tr(q.text)}</Text>
            <View style={styles.dots}>
              {aptitudeScale.values.map((v, i) => {
                const sel = value === v;
                const size = DOT_SIZES[i]!;
                return (
                  <Pressable
                    key={v}
                    testID={`q${q.id}-${v}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: sel }}
                    accessibilityLabel={`${v}`}
                    hitSlop={6}
                    onPress={() => update((r) => ({ ...r, aptitude: { ...r.aptitude, [aptitudeKey(q.id)]: v } }))}
                    style={[
                      styles.dot,
                      { width: size, height: size, borderRadius: size / 2 },
                      sel && { backgroundColor: colors.purple, borderColor: colors.purple },
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleText}>{tr(aptitudeScale.min)}</Text>
              <Text style={styles.scaleText}>{tr(aptitudeScale.max)}</Text>
            </View>
          </View>
        );
      })}
    </QuestionLayout>
  );
}

const styles = StyleSheet.create({
  block: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.goldBorder },
  q: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.text },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, paddingHorizontal: 8 },
  dot: { borderWidth: 2, borderColor: colors.goldLabel, backgroundColor: colors.white },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  scaleText: { fontSize: 12, color: colors.black },
});
