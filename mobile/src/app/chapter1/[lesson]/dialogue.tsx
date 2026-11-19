/**
 * 第1章 会話（Figma CH1-L01-02）。
 * 1/2：話者名（Bold 16・#B09D79）→ 17 あけてセリフ（line1）
 * 2/2：話者名とセリフは右へ寄り（左 125・幅 236）、左に SHOSA の顔（80×72）と影。その下に吹き出し（#F6F1E8・360×118）に SHOSA の視点（line2）
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

const BUBBLE = '#F6F1E8';

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
      {/* 話者名とセリフ。2/2 では右（左 125・幅 236）に寄る */}
      <View style={turn === 2 && styles.shifted}>
        <Text style={playTextStyles.speaker}>
          {tr(lesson.speaker)}
          {colon}
        </Text>
        <Text style={[playTextStyles.narrative, { marginTop: 17 }]}>{tr(lesson.line1)}</Text>
      </View>
      {turn === 2 && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Appear from="none" duration={300} style={StyleSheet.absoluteFill}>
          {/* SHOSA の顔（80×72、カードの左 21・上 94）と足元の影（55×13） */}
          <View style={styles.shosaGroup}>
            <View style={styles.shadow} />
            <Image source={images.mascotFace} style={styles.shosa} resizeMode="contain" />
          </View>
          <View style={styles.tail} />
          <View style={styles.bubble}>
            <Text style={playTextStyles.narrative}>{tr(lesson.line2)}</Text>
          </View>
        </Appear>
        </View>
      )}
      <Ch1AdvanceButton label={t('next')} onPress={advance} turn={turn} />
      {turn === 2 && <View style={{ height: 250 }} />}
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  shifted: { marginLeft: 84 },
  shosaGroup: { position: 'absolute', left: 21, top: 94, width: 80, height: 75 },
  shadow: { position: 'absolute', left: 13, top: 63, width: 55, height: 13, borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.10)' },
  shosa: { width: 80, height: 72 },
  // 吹き出しの三角（23×16、左 50・上 178）
  tail: {
    position: 'absolute',
    left: 50,
    top: 178,
    width: 0,
    height: 0,
    borderLeftWidth: 11.5,
    borderRightWidth: 11.5,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: BUBBLE,
  },
  // 吹き出し（左 21・上 194・幅 360・高さ 118、角 10。文字は左右 23・上 23）
  bubble: { position: 'absolute', left: 21, right: 21, top: 194, minHeight: 118, borderRadius: 10, backgroundColor: BUBBLE, paddingHorizontal: 23, paddingTop: 23, paddingBottom: 23 },
});
