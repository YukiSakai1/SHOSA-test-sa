/**
 * 第1章 結果＆解説（Figma CH1-L01-04 / テンプレ4）。
 * 位置は Figma の画面（402×874）から。上から：ヘッダー → 色つきの帯（正解は #18A5B1、不正解は #DC6988。高さ 229、上に #E6D8BD の帯）
 *   → 正否（丸 26 + 22 Bold）→ 解説（16 Bold・白・中央）→ SHOSA（150×136。帯の下に 71 はみ出す）
 *   → 吹き出し（白・340×162・角 10）→ SHOSA Focus（360×48・#CAB896）→ NEXT（360×48）。
 * Figma の注記どおりに動く：
 * - 正否表示から 1.5 秒後に SHOSA の吹き出しが出て、同時に「SHOSA Focus」ボタンが脈動を始める
 * - NEXT は最初 Disabled（灰色）。SHOSA Focus モーダルを一度開くと Active になり、閉じても Active のまま
 * URL パラメータ choice（A / B）で選んだ答えを受け取る。確認用：開発中は ?focus=1 で SHOSA Focus を開いた状態から始まる（lib/devParams.ts）。
 */
import { useEffect, useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton, usePulse, PressScale } from '@/components/ui';
import { useMascotMotion } from '@/components/useMascotMotion';
import { chapter1, chapter1LessonCount, parseLessonIndex } from '@/content/chapter1';
import type { ChoiceId } from '@/content/types';
import { FocusModal } from '@/features/chapter1/FocusModal';
import { cardEdgeXml } from '@/features/chapter1/cardTopArt';
import { Ch1CardLeaf, ChapterHeader, ch1, progressPercent } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { devParam } from '@/lib/devParams';
import { images } from '@/theme/images';

const BUBBLE_DELAY_MS = 1500;
/** 帯の高さと、全体の高さ（帯の上端 = Figma の y=125 を 0 とする） */
const BAND_H = 229;
const PANEL_H = 679;

function parseChoice(raw: string | undefined): ChoiceId | null {
  return raw === 'A' || raw === 'B' ? raw : null;
}

export default function ResultScreen() {
  const params = useLocalSearchParams<{ lesson: string; choice: string; focus?: string }>();
  const { lang, t, tr } = useLang();
  const insets = useSafeAreaInsets();
  const openFocusFromUrl = devParam(params.focus) === '1';
  const [focusOpen, setFocusOpen] = useState(openFocusFromUrl);
  const [focusSeen, setFocusSeen] = useState(openFocusFromUrl);
  const [bubbleShown, setBubbleShown] = useState(false);
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const focusScale = usePulse(bubbleShown && !focusSeen);
  const mascotMotion = useMascotMotion();

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
  const bandColor = isCorrect ? '#18A5B1' : '#DC6988';

  const goNext = () => {
    if (index + 1 < chapter1LessonCount) {
      router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: String(index + 1) } });
    } else {
      router.push('/chapter1/complete');
    }
  };

  return (
    // 背景は Figma の #E8DECB の単色（柄は無し：CH1-L01-04）
    <View style={{ flex: 1, backgroundColor: ch1.screenBg }}>
      <ChapterHeader percent={progressPercent(index, 4)} style={{ paddingBottom: 20 }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={[styles.panel, { minHeight: PANEL_H + insets.bottom + 24 }]}>
          {/* 色つきの帯（Figma：下辺は内側に丸く欠けた角と #E6D8BD の縁（高さ 16）、下の角に金の飾り） */}
          <View style={styles.band}>
            <View style={[styles.bandBody, { backgroundColor: bandColor }]} />
            <SvgXml
              xml={cardEdgeXml(bandColor)}
              width="100%"
              height={16}
              preserveAspectRatio="none"
              style={[styles.bandEdge, { transform: [{ scaleY: -1 }] }]}
            />
            <Ch1CardLeaf corner="bl" />
            <Ch1CardLeaf corner="br" />
            <View style={styles.statusRow}>
              <View style={[styles.statusIcon, !isCorrect && styles.statusIconWrong]}>
                <Text style={styles.statusMark}>{isCorrect ? '✓' : '✕'}</Text>
              </View>
              <Text testID="result-title" style={styles.statusTitle}>
                {isCorrect ? t('correct') : t('incorrect')}
              </Text>
            </View>
            <Text style={[styles.explanation, lang === 'en' && styles.explanationEn]}>{tr(lesson.reason)}</Text>
          </View>
          {/* SHOSA（150×136）と足元の影（103×23）。帯の下に 71 はみ出す */}
          {/* 0章と同じ動き：弾んで登場し、そのあと上下にゆっくり揺れる */}
          <Animated.Image source={images.floorShadow} style={[styles.shadow, mascotMotion.shadow]} resizeMode="contain" />
          <Animated.Image source={images.mascotFace} style={[styles.mascot, mascotMotion.mascot]} resizeMode="contain" />
          {/* 吹き出し：三角（34×24）と白いカード（左右 31・高さ 162・角 10） */}
          <Animated.View style={[StyleSheet.absoluteFill, { opacity: bubbleOpacity }]} pointerEvents="none">
            <View style={styles.pointer} />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{tr(lesson.shosaPrompt)}</Text>
            </View>
          </Animated.View>
          {/* SHOSA Focus（360×48・#CAB896・角 10）。左のアイコン（46×63）は上に 15 はみ出す */}
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
            <CtaButton testID="result-next" label={t('next')} disabled={!focusSeen} onPress={goNext} />
          </View>
        </View>
      </ScrollView>
      <FocusModal lesson={lesson} visible={focusOpen} onClose={() => setFocusOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flexGrow: 1, backgroundColor: '#D3F2F1' },
  band: { position: 'absolute', top: 0, left: 0, right: 0, height: BAND_H, alignItems: 'center' },
  bandBody: { position: 'absolute', top: 0, left: 0, right: 0, height: BAND_H - 16 },
  bandEdge: { position: 'absolute', top: BAND_H - 16, left: 0, right: 0 },
  // 正否：上から 31（Figma y=156）。丸 26 + 10 + 22 Bold
  statusRow: { position: 'absolute', top: 31, flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIcon: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#00C9C3', alignItems: 'center', justifyContent: 'center' },
  statusIconWrong: { backgroundColor: '#E41042' },
  statusMark: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 17 },
  statusTitle: { fontSize: 22, lineHeight: 26, fontWeight: '700', color: '#FFFFFF' },
  // 解説：上から 77（y=202）、左右 21、16 Bold・行の高さ 24
  explanation: { position: 'absolute', top: 77, left: 21, right: 21, fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  // 英語は 4行になるため、14 / 20 にして SHOSA（上から 164）に重ならないようにする
  explanationEn: { fontSize: 14, lineHeight: 20 },
  // SHOSA：上から 164（y=289）。影はその足元（y=406）
  mascot: { position: 'absolute', top: 164, alignSelf: 'center', width: 150, height: 136 },
  shadow: { position: 'absolute', top: 281, alignSelf: 'center', width: 103, height: 23 },
  // 吹き出し：三角は上から 315（y=440）、カードは 339（y=464）
  pointer: {
    position: 'absolute',
    top: 315,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 17,
    borderRightWidth: 17,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
  },
  bubble: { position: 'absolute', top: 339, left: 31, right: 31, minHeight: 162, borderRadius: 10, backgroundColor: '#FFFFFF', paddingHorizontal: 33, paddingVertical: 33 },
  bubbleText: { fontSize: 16, lineHeight: 24, color: '#000000', textAlign: 'center' },
  // SHOSA Focus：上から 556（y=681）。下に #A89572 の影（box-shadow: 0 4px 0）
  focusWrap: { position: 'absolute', top: 556, left: 21, right: 21 },
  focusShadow: { borderRadius: 10, backgroundColor: '#A89572', paddingBottom: 4 },
  focusBtn: { height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#CAB896', borderRadius: 10 },
  focusIcon: { position: 'absolute', left: 26, top: -15, width: 46, height: 63 },
  focusLabel: { fontSize: 18, lineHeight: 18, fontWeight: '700', letterSpacing: 0.54, color: '#FFFFFF' },
  // NEXT：上から 631（y=756）
  nextWrap: { position: 'absolute', top: 631, left: 21, right: 21 },
});
