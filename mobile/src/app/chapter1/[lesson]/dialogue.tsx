/**
 * 第1章 状況説明（Figma CH1-L01-02 / テンプレ2）。
 * 1回目のタップ：登場人物のセリフ（line1）
 * 2回目のタップ：セリフはそのまま、右に SHOSA が現れ、下のベージュの吹き出しに SHOSA の視点（line2）
 * 3回目のタップ：問題へ
 */
import { useEffect, useRef, useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
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
  const appear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (turn === 2) Animated.timing(appear, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [turn, appear]);

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
      <View style={styles.lineRow}>
        <View style={{ flex: 1 }}>
          <Text style={playTextStyles.speaker}>
            {tr(lesson.speaker)}
            {colon}
          </Text>
          <Text style={[styles.line, { marginTop: 12 }]}>{tr(lesson.line1)}</Text>
        </View>
        {turn === 2 && <Animated.Image source={images.mascotFace} style={[styles.shosa, { opacity: appear }]} resizeMode="contain" />}
      </View>
      {turn === 2 && (
        <Animated.View style={[styles.tipBox, { opacity: appear }]} testID="shosa-tip">
          <View style={styles.tipTail} />
          <Text style={styles.line}>{tr(lesson.line2)}</Text>
        </Animated.View>
      )}
      <AdvanceButton label={t('next')} onPress={advance} />
    </PlayLayout>
  );
}

const styles = StyleSheet.create({
  lineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingHorizontal: 20 },
  line: { fontSize: 16, lineHeight: 24, color: colors.black },
  shosa: { width: 80, height: 72 },
  tipBox: { marginTop: 18, backgroundColor: colors.beige, borderRadius: 10, padding: 23 },
  tipTail: {
    position: 'absolute',
    top: -14,
    right: 50,
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.beige,
  },
});
