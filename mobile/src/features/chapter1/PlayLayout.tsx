/**
 * 第1章プレイ画面（situation / dialogue / question）の共通レイアウト。
 * 上：閉じる・進捗バー・言語切り替え／中：シーン画像／下：白いカード
 */
import { useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Flourish, LangToggle, ProgressBar } from '@/components/ui';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images, type ImageKey } from '@/theme/images';
import { chapter1LessonCount } from '@/content/chapter1';

/** 1レッスン = 4ステップ（situation, dialogue, question, result） */
export function progressPercent(lessonIndex: number, stepInLesson: 1 | 2 | 3 | 4): number {
  const total = chapter1LessonCount * 4;
  const current = lessonIndex * 4 + stepInLesson;
  return Math.max(4, Math.min(100, Math.round((current / total) * 100)));
}

/** 閉じる（✕）＋進捗バー＋言語切り替え。確認ダイアログ付き */
export function ChapterHeader({ percent, dark = false }: { percent: number; dark?: boolean }) {
  const { t } = useLang();
  const [confirming, setConfirming] = useState(false);
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={t('close')} hitSlop={10} onPress={() => setConfirming(true)}>
        <Text style={[styles.close, dark && { color: colors.white }]}>✕</Text>
      </Pressable>
      <ProgressBar percent={percent} />
      <LangToggle />
      <ConfirmDialog
        visible={confirming}
        title={t('exitConfirmTitle')}
        body={t('exitConfirmBody')}
        confirmLabel={t('exitConfirmOk')}
        cancelLabel={t('exitConfirmCancel')}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          router.dismissTo('/');
        }}
      />
    </View>
  );
}

interface Props {
  percent: number;
  image: ImageKey;
  imageAlt: string;
  label: string;
  children: ReactNode;
}

export function PlayLayout({ percent, image, imageAlt, label, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ChapterHeader percent={percent} />
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.illustration}>
          <Image source={images[image]} accessibilityLabel={imageAlt} style={styles.sceneImg} resizeMode="contain" />
        </View>
        <View style={styles.card}>
          <Flourish corner="tl" />
          <Flourish corner="tr" />
          <Text style={styles.cardLabel}>{label}</Text>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.playBackground },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 10 },
  close: { fontSize: 20, color: colors.textMuted, fontWeight: '700', width: 24, textAlign: 'center' },
  scroll: { flexGrow: 1, paddingHorizontal: 16, gap: 14 },
  illustration: { width: '100%', aspectRatio: 4 / 3, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.cream },
  sceneImg: { width: '100%', height: '100%' },
  card: {
    flexGrow: 1,
    minHeight: 220,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.goldPale,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 70,
  },
  cardLabel: { fontSize: 13, fontWeight: '800', color: colors.gold, letterSpacing: 2, textAlign: 'center', marginBottom: 12 },
});

export const playTextStyles = StyleSheet.create({
  meta: { fontSize: 12, color: colors.textMuted, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  narrative: { fontSize: 15, lineHeight: 25, color: colors.text },
  speaker: { color: colors.textMuted, fontWeight: '800', fontSize: 14 },
});
