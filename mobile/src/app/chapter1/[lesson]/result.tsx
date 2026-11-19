/**
 * 第1章 結果＆解説（Figma CH1-L01-04 / テンプレ4）。
 * Figma の注記どおりに動く：
 * - 正否表示から 1.5 秒後に SHOSA の吹き出しが出て、同時に「SHOSA Focus」ボタンが脈動を始める
 * - NEXT は最初 Disabled（灰色）。SHOSA Focus モーダルを一度開くと Active になり、閉じても Active のまま
 * URL パラメータ choice（A / B）で選んだ答えを受け取る。
 */
import { useEffect, useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton, usePulse, PressScale } from '@/components/ui';
import { chapter1, chapter1LessonCount, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { FocusModal } from '@/features/chapter1/FocusModal';
import { Ch1Flourish, ChapterHeader, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
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
    <View style={styles.screen}>
      {/* .ch101-result-header-bar：背景 #E8DECB */}
      <ChapterHeader percent={progressPercent(index, 4)} style={styles.header} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* .ch101-teal-result-card */}
        <View style={styles.tealCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusIcon, !isCorrect && styles.statusIconWrong]}>
              <Text style={styles.statusMark}>{isCorrect ? '✔' : '✕'}</Text>
            </View>
            <Text testID="result-title" style={styles.statusTitle}>
              {isCorrect ? t('correct') : t('incorrect')}
            </Text>
          </View>
          <Text style={styles.explanation}>{tr(lesson.reason)}</Text>
          {/* .ch101-result-mascot-row：下のパネルに 20px 重なる */}
          <View style={styles.mascotRow}>
            <Image source={images.mascotFace} style={styles.mascot} resizeMode="contain" />
            <Image source={images.floorShadow} style={styles.shadow} resizeMode="contain" />
          </View>
          <Ch1Flourish corner="bl" color="#E6D8BD" />
          <Ch1Flourish corner="br" color="#E6D8BD" />
        </View>
        {/* .ch101-result-lower-panel */}
        <View style={[styles.lower, { paddingBottom: insets.bottom + 24 }]}>
          <Animated.View style={[styles.bubble, { opacity: bubbleOpacity }]}>
            <View style={styles.pointer} />
            <Text style={styles.bubbleText}>{tr(lesson.shosaPrompt)}</Text>
          </Animated.View>
          {/* .ch101-focus-action-btn：下に #A89572 の影（box-shadow: 0 4px 0） */}
          <Animated.View style={[styles.focusWrap, { transform: [{ scale: focusScale }] }]}>
            <View style={styles.focusShadow}>
              <PressScale
                testID="focus-button"
                onPress={() => {
                  setFocusOpen(true);
                  setFocusSeen(true);
                }}
                style={styles.focusBtn}
              >
                <Image source={images.iconFocus} style={styles.focusIcon} resizeMode="contain" />
                <Text style={styles.focusLabel}>{t('focusButton')}</Text>
              </PressScale>
            </View>
          </Animated.View>
          <View style={styles.nextWrap}>
            <CtaButton testID="result-next" size="tall" fontSize={17} label={t('next')} disabled={!focusSeen} onPress={goNext} />
          </View>
        </View>
      </ScrollView>
      <FocusModal lesson={lesson} visible={focusOpen} onClose={() => setFocusOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#D3F2F1' },
  header: { backgroundColor: '#E8DECB', paddingBottom: 12 },
  tealCard: { backgroundColor: '#18A5B1', paddingTop: 24, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center', zIndex: 3 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00C9C3',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconWrong: { backgroundColor: '#E55353' },
  statusMark: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', lineHeight: 16 },
  statusTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  explanation: { marginTop: 16, marginBottom: 10, fontSize: 14, lineHeight: 22.4, color: '#FFFFFF', fontWeight: '700', textAlign: 'center', maxWidth: 330 },
  mascotRow: { alignItems: 'center', marginTop: 6, marginBottom: -20, zIndex: 3 },
  mascot: { width: 140, height: 127 },
  shadow: { width: 100, height: 22, marginTop: -8 },
  lower: { flexGrow: 1, backgroundColor: '#D3F2F1', paddingTop: 30, paddingHorizontal: 18, alignItems: 'center' },
  bubble: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
  },
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
    borderBottomColor: '#FFFFFF',
  },
  bubbleText: { fontSize: 14.5, lineHeight: 23.2, color: '#2B2B2B', textAlign: 'center', fontWeight: '700' },
  focusWrap: { width: '100%', maxWidth: 340, marginBottom: 16 },
  focusShadow: { borderRadius: 14, backgroundColor: '#A89572', paddingBottom: 4 },
  focusBtn: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CAB896',
    borderRadius: 14,
    paddingLeft: 20,
  },
  focusIcon: { position: 'absolute', left: 14, top: 1, width: 36, height: 50 },
  focusLabel: { fontSize: 16, fontWeight: '800', color: '#FFFFFF' },
  nextWrap: { width: '100%', maxWidth: 340 },
});
