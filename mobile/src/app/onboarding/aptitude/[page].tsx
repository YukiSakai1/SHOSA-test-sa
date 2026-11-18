/**
 * 適性診断（index.html #screen-ob-aptitude、Figma CH0-14）。1画面に3問、5段階（そう思わない〜とてもそう思う）で答える。
 * 問題ごとに白いカード（360×190 以上、角丸 10、間隔 16）。丸は両端ほど大きい（54/44/34）、枠 3px #D8D0C0。
 * 3問すべて答えると NEXT が押せる（M-09：M-02 と同じ弾みで有効になる）。最後のページの NEXT で診断完了画面へ。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, type ComponentRef } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { APTITUDE_PAGE_SIZE, aptitudePageCount, aptitudeQuestions, aptitudeScale } from '@/content/onboarding';
import { QuestionLayout } from '@/features/onboarding/components';
import { aptitudeKey } from '@/features/onboarding/diagnosis';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { haptics } from '@/lib/haptics';
import { colors } from '@/theme/colors';
import { nativeDriver, useReducedMotion } from '@/theme/motion';

/** 両端ほど大きい丸（Figma の Likert スケール） */
const DOT_SIZES = [54, 44, 34, 44, 54] as const;
/** M-08：回答してから次の未回答の問題へスクロールするまでの待ち時間 */
const AUTO_SCROLL_DELAY_MS = 400;

export default function AptitudeScreen() {
  const { page: raw } = useLocalSearchParams<{ page: string }>();
  const { tr } = useLang();
  const { record, update } = useOnboarding();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const blockY = useRef<Record<number, number>>({});
  const page = Number(raw);
  if (!Number.isInteger(page) || page < 0 || page >= aptitudePageCount) return <Redirect href="/onboarding/aptitude-intro" />;

  const questions = aptitudeQuestions.slice(page * APTITUDE_PAGE_SIZE, (page + 1) * APTITUDE_PAGE_SIZE);
  const allAnswered = questions.every((q) => typeof record.aptitude[aptitudeKey(q.id)] === 'number');
  // M-07：全18問のうち何問答えたかでバーを伸ばし、全体の進み具合が分かるようにする
  const answeredTotal = aptitudeQuestions.filter((q) => typeof record.aptitude[aptitudeKey(q.id)] === 'number').length;

  const next = () => {
    if (page + 1 < aptitudePageCount) router.push({ pathname: '/onboarding/aptitude/[page]', params: { page: String(page + 1) } });
    else router.push('/onboarding/complete');
  };

  const answer = (qid: number, v: number) => {
    haptics.select();
    const answers = { ...record.aptitude, [aptitudeKey(qid)]: v };
    update((r) => ({ ...r, aptitude: { ...r.aptitude, [aptitudeKey(qid)]: v } }));
    // M-08：0.4秒後に、このページの次の未回答の問題までスクロール（全問回答済みなら動かさない。画面遷移はしない）
    const nextQ = questions.find((q) => q.id !== qid && typeof answers[aptitudeKey(q.id)] !== 'number');
    if (nextQ && blockY.current[nextQ.id] !== undefined) {
      setTimeout(() => scrollRef.current?.scrollTo({ y: blockY.current[nextQ.id]!, animated: true }), AUTO_SCROLL_DELAY_MS);
    }
  };

  return (
    <QuestionLayout
      scrollRef={scrollRef}
      background="#FAF8F2"
      fadeBottom
      percent={Math.round((answeredTotal / aptitudeQuestions.length) * 100)}
      nextDisabled={!allAnswered}
      onNext={next}
    >
      <View style={styles.list}>
      {questions.map((q) => {
        const value = record.aptitude[aptitudeKey(q.id)];
        return (
          <View key={q.id} style={styles.block} onLayout={(e) => (blockY.current[q.id] = e.nativeEvent.layout.y)}>
            <Text style={styles.q}>{tr(q.text)}</Text>
            <View style={styles.dots}>
              {aptitudeScale.values.map((v, i) => (
                <LikertDot key={v} testID={`q${q.id}-${v}`} size={DOT_SIZES[i]!} label={`${v}`} selected={value === v} onPress={() => answer(q.id, v)} />
              ))}
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleText}>{tr(aptitudeScale.min)}</Text>
              <Text style={styles.scaleText}>{tr(aptitudeScale.max)}</Text>
            </View>
          </View>
        );
      })}
      </View>
    </QuestionLayout>
  );
}

/**
 * M-07：選んだ丸は紫になり、チェックが出る（0.8倍 → 1.1倍 → 1倍、0.3秒・1回）。
 * 赤・緑のような正解／不正解を思わせる色は使わない。
 */
function LikertDot({ size, selected, onPress, label, testID }: { size: number; selected: boolean; onPress: () => void; label: string; testID: string }) {
  const reduced = useReducedMotion();
  const s = useRef(new Animated.Value(1)).current;
  const was = useRef(selected);
  useEffect(() => {
    if (selected && !was.current && !reduced) {
      s.setValue(0.8);
      Animated.sequence([
        Animated.timing(s, { toValue: 1.1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: nativeDriver }),
        Animated.timing(s, { toValue: 1, duration: 120, easing: Easing.in(Easing.quad), useNativeDriver: nativeDriver }),
      ]).start();
    }
    was.current = selected;
  }, [selected, reduced, s]);
  return (
    <Pressable testID={testID} accessibilityRole="radio" accessibilityState={{ checked: selected }} accessibilityLabel={label} hitSlop={6} onPress={onPress}>
      <Animated.View
        style={[
          styles.dot,
          { width: size, height: size, borderRadius: size / 2, transform: [{ scale: s }] },
          selected && { backgroundColor: colors.purple, borderColor: colors.purple },
        ]}
      >
        {selected && (
          <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 14 14">
            <Path d="M 2,7.5 L 5.5,11 L 12,3.5" stroke={colors.white} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // ヘッダーの下 27 からカードを並べる
  list: { marginTop: 27, gap: 16 },
  block: { minHeight: 190, backgroundColor: colors.white, borderRadius: 10, paddingVertical: 18, paddingHorizontal: 19 },
  q: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.text },
  dots: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 54, marginTop: 20 },
  dot: { borderWidth: 3, borderColor: '#D8D0C0', backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  scaleLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 2 },
  scaleText: { fontSize: 12, lineHeight: 26, color: colors.black },
});
