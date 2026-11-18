/**
 * 第1章 結果＆解説（Figma CH1-L01-04 / テンプレ4）。
 * Figma の注記どおりに動く：
 * - 正否表示から 1.5 秒後に SHOSA の吹き出しが出て、同時に「SHOSA Focus」ボタンが脈動を始める
 * - NEXT は最初 Disabled（灰色）。SHOSA Focus モーダルを一度開くと Active になり、閉じても Active のまま
 * URL パラメータ choice（A / B）で選んだ答えを受け取る。
 */
import { useEffect, useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { CtaButton, usePulse } from '@/components/ui';
import { chapter1, chapter1LessonCount, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { FocusModal } from '@/features/chapter1/FocusModal';
import { ChapterHeader, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

const BUBBLE_DELAY_MS = 1500;

function parseChoice(raw: string | undefined): ChoiceId | null {
  return raw === 'A' || raw === 'B' ? raw : null;
}

export default function ResultScreen() {
  const params = useLocalSearchParams<{ lesson: string; choice: string }>();
  const { t, tr } = useLang();
  const insets = useSafeAreaInsets();
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusSeen, setFocusSeen] = useState(false);
  const [bubbleShown, setBubbleShown] = useState(false);
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const focusScale = usePulse(bubbleShown && !focusSeen);

  useEffect(() => {
    const id = setTimeout(() => {
      setBubbleShown(true);
      Animated.timing(bubbleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, BUBBLE_DELAY_MS);
    return () => clearTimeout(id);
  }, [bubbleOpacity]);

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
      <ChapterHeader percent={progressPercent(index, 4)} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.tealCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIcon, { backgroundColor: isCorrect ? colors.correct : colors.incorrect }]}>
              <Svg width={14} height={14} viewBox="0 0 14 14">
                {isCorrect ? (
                  <Path d="M 2,7.5 L 5.5,11 L 12,3.5" stroke={colors.white} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <Path d="M 3,3 L 11,11 M 11,3 L 3,11" stroke={colors.white} strokeWidth={2.6} strokeLinecap="round" />
                )}
              </Svg>
            </View>
            <Text testID="result-title" style={styles.statusTitle}>
              {isCorrect ? t('correct') : t('incorrect')}
            </Text>
          </View>
          <Text style={styles.explanation}>{tr(lesson.reason)}</Text>
        </View>
        <View style={[styles.lower, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.mascotRow}>
            <View style={styles.mascotCol}>
              <Image source={images.floorShadow} style={styles.shadow} resizeMode="contain" />
              <Image source={images.mascotFace} style={styles.mascot} resizeMode="contain" />
            </View>
          </View>
          <Animated.View style={[styles.bubble, { opacity: bubbleOpacity }]}>
            <View style={styles.pointer} />
            <Text style={styles.bubbleText}>{tr(lesson.shosaPrompt)}</Text>
          </Animated.View>
          <Animated.View style={{ transform: [{ scale: focusScale }] }}>
            <Pressable
              testID="focus-button"
              accessibilityRole="button"
              onPress={() => {
                setFocusOpen(true);
                setFocusSeen(true);
              }}
              style={({ pressed }) => [styles.focusBtn, pressed && { opacity: 0.85 }]}
            >
              <Image source={images.iconFocus} style={styles.focusIcon} resizeMode="contain" />
              <Text style={styles.focusLabel}>{t('focusButton')}</Text>
            </Pressable>
          </Animated.View>
          <CtaButton testID="result-next" label={t('next')} disabled={!focusSeen} onPress={goNext} />
        </View>
      </ScrollView>
      <FocusModal lesson={lesson} visible={focusOpen} onClose={() => setFocusOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.playBackground },
  tealCard: { backgroundColor: colors.teal, paddingHorizontal: 21, paddingTop: 20, paddingBottom: 24 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIcon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  statusTitle: { fontSize: 22, fontWeight: '700', color: colors.white },
  explanation: { marginTop: 16, fontSize: 16, lineHeight: 24, color: colors.white, fontWeight: '700' },
  lower: { flexGrow: 1, backgroundColor: colors.mint, paddingHorizontal: 21, paddingTop: 12, gap: 14 },
  mascotRow: { alignItems: 'flex-start', paddingLeft: 20 },
  mascotCol: { width: 150, height: 140, alignItems: 'center', justifyContent: 'flex-end' },
  mascot: { width: 150, height: 136 },
  shadow: { position: 'absolute', bottom: 0, width: 103, height: 23 },
  bubble: { backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 33, paddingVertical: 24, marginTop: 6 },
  pointer: {
    position: 'absolute',
    top: -20,
    left: 150,
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 34,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white,
  },
  bubbleText: { fontSize: 16, lineHeight: 24, color: colors.black },
  focusBtn: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.goldButton,
    borderRadius: 10,
  },
  focusIcon: { position: 'absolute', left: 26, top: -15, width: 46, height: 63 },
  focusLabel: { fontSize: 18, fontWeight: '700', color: colors.white },
});
