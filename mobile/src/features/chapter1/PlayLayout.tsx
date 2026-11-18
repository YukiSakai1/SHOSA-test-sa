/**
 * 第1章プレイ画面（situation / dialogue / question）の共通レイアウト（Figma CH1-L01-01〜03）。
 * 上：✕・進捗バー／中：画面幅いっぱいのシーン画像（下端がフェード）／下：白いカード（上端に金の帯と飾り）
 * Figma では章の中に EN ボタンは無い（btn_en が非表示）。言語は 0章の言語選択で決まる。
 */
import { useState, type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { router, type Href } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CloseButton, Flourish, ProgressBar } from '@/components/ui';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images, type ImageKey } from '@/theme/images';
import { chapter1LessonCount } from '@/content/chapter1';

/** 1レッスン = 4ステップ（situation, dialogue, question, result） */
export function progressPercent(lessonIndex: number, stepInLesson: 1 | 2 | 3 | 4): number {
  const total = chapter1LessonCount * 4;
  const current = lessonIndex * 4 + stepInLesson;
  return Math.max(4, Math.min(100, Math.round((current / total) * 100)));
}

/** ✕（中断確認ダイアログ付き）＋進捗バー */
/** exitTo: ✕ で中断したときの戻り先（既定はタイトル） */
export function ChapterHeader({ percent, exitTo = '/' }: { percent: number; exitTo?: Href }) {
  const { t } = useLang();
  const [confirming, setConfirming] = useState(false);
  return (
    <View style={styles.header}>
      <CloseButton label={t('close')} onPress={() => setConfirming(true)} />
      <ProgressBar percent={percent} />
      <View style={{ width: 32 }} />
      <ConfirmDialog
        visible={confirming}
        title={t('exitConfirmTitle')}
        body={t('exitConfirmBody')}
        confirmLabel={t('exitConfirmOk')}
        cancelLabel={t('exitConfirmCancel')}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          router.dismissTo(exitTo);
        }}
      />
    </View>
  );
}

interface Props {
  percent: number;
  exitTo?: Href;
  image: ImageKey;
  imageAlt: string;
  label: string;
  children: ReactNode;
}

export function PlayLayout({ percent, exitTo, image, imageAlt, label, children }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const imageH = Math.round((Math.min(width, 500) * 342) / 402);
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ChapterHeader percent={percent} exitTo={exitTo} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={{ height: imageH }}>
          <Image source={images[image]} accessibilityLabel={imageAlt} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <Svg style={styles.fade} height={40} width="100%">
            <Defs>
              <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.white} stopOpacity={0} />
                <Stop offset="1" stopColor={colors.white} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="40" fill="url(#fade)" />
          </Svg>
        </View>
        <View style={[styles.card, { paddingBottom: insets.bottom + 70 }]}>
          <View style={styles.band} />
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
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 21, paddingVertical: 10 },
  fade: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  card: { flexGrow: 1, backgroundColor: colors.white, paddingHorizontal: 21, paddingTop: 30 },
  band: { position: 'absolute', top: 0, left: 0, right: 0, height: 8, backgroundColor: colors.goldBorder },
  cardLabel: { fontFamily: fonts.montserrat, fontSize: 14, color: colors.goldLabel, letterSpacing: 2, textAlign: 'center', marginBottom: 20 },
});

export const playTextStyles = StyleSheet.create({
  narrative: { fontSize: 16, lineHeight: 26, color: colors.black, paddingHorizontal: 20 },
  speaker: { color: colors.goldDark, fontWeight: '700', fontSize: 16 },
});
