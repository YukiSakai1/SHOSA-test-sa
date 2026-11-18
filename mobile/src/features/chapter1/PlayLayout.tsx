/**
 * 第1章プレイ画面（situation / dialogue / question）の共通レイアウト。
 * 見た目は旧Web版 index.html の #screen-ch101-sit1 / sit2 / question（css/style.css の .ch101-*）に合わせている。
 *   上：✕（白丸 36）・進捗バー（高さ 9）・EN（右端に密着）
 *   中：シーン画像（高さ 275、背景 #E8E2D8）
 *   下：白いカード（上端に 1.5px の線、角に金の飾り 24px、内側の余白 20）
 */
import { useState, type ReactNode } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { router, type Href } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LangToggle, PressScale, ProgressBar } from '@/components/ui';
import { useLang } from '@/i18n/LanguageProvider';
import { images, type ImageKey } from '@/theme/images';
import { chapter1LessonCount } from '@/content/chapter1';

/** index.html の 1章の色 */
export const ch1 = {
  screenBg: '#ECE7DE',
  sceneBg: '#E8E2D8',
  cardLine: '#ECE4D8',
  gold: '#C4A265',
  ink: '#2B2B2B',
  brown: '#8C7B6B',
  closeIcon: '#8E8E93',
  track: '#DFDEDE',
} as const;

/** 1レッスン = 4ステップ（situation, dialogue, question, result） */
export function progressPercent(lessonIndex: number, stepInLesson: 1 | 2 | 3 | 4): number {
  const total = chapter1LessonCount * 4;
  const current = lessonIndex * 4 + stepInLesson;
  return Math.max(4, Math.min(100, Math.round((current / total) * 100)));
}

/**
 * ヘッダー（.ch101-header-bar）：上 14・左 16・下 10 の余白。✕・進捗バー（最大幅 250、左右 12）・EN。
 * exitTo は ✕ で中断したときの戻り先（既定はタイトル）。
 */
export function ChapterHeader({ percent, exitTo = '/', style }: { percent: number; exitTo?: Href; style?: StyleProp<ViewStyle> }) {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const [confirming, setConfirming] = useState(false);
  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }, style]}>
      <PressScale accessibilityLabel={t('close')} hitSlop={6} onPress={() => setConfirming(true)} style={styles.close}>
        <Text style={styles.closeText}>✕</Text>
      </PressScale>
      <View style={styles.trackWrap}>
        <ProgressBar percent={percent} variant="ch1" />
      </View>
      <LangToggle style={{ marginLeft: 'auto' }} />
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

/** 角の金の飾り（index.html の .ch101-flourish：24px、角から 6px） */
export function Ch1Flourish({ corner, color = ch1.gold }: { corner: 'tl' | 'tr' | 'bl' | 'br'; color?: string }) {
  const d = {
    tl: 'M 3,3 C 10,5 15,10 17,17 C 10,15 5,10 3,3 Z M 3,3 L 12,4 M 3,3 L 4,12',
    tr: 'M 21,3 C 14,5 9,10 7,17 C 14,15 19,10 21,3 Z M 21,3 L 12,4 M 21,3 L 20,12',
    bl: 'M 3,21 C 10,19 15,14 17,7 C 10,9 5,14 3,21 Z M 3,21 L 12,20 M 3,21 L 4,12',
    br: 'M 21,21 C 14,19 9,14 7,7 C 14,9 19,14 21,21 Z M 21,21 L 12,20 M 21,21 L 20,12',
  }[corner];
  const pos: ViewStyle = {
    position: 'absolute',
    zIndex: 2,
    ...(corner[0] === 't' ? { top: 6 } : { bottom: 6 }),
    ...(corner[1] === 'l' ? { left: 6 } : { right: 6 }),
  };
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" style={pos} pointerEvents="none">
      <Path d={d} fill={color} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

/** カード右下の「進む」ボタン（.ch101-advance-btn：上から 225・右 24、38×38 の中に 32 のアイコン） */
export function Ch1AdvanceButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <View style={styles.advance}>
      <PressScale accessibilityLabel={label} onPress={onPress} hitSlop={10} style={styles.advanceHit}>
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Circle cx={16} cy={16} r={14} fill="#FFFFFF" stroke={ch1.gold} strokeWidth={1.5} />
          <Path d="M 12,16 L 20,16 M 16,11 L 20.5,16 L 16,21" fill="none" stroke={ch1.gold} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M 12,13.5 C 13,15 13,17 12,18.5" fill="none" stroke={ch1.gold} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      </PressScale>
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
  return (
    <View style={styles.screen}>
      <ChapterHeader percent={percent} exitTo={exitTo} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.scene}>
          <Image source={images[image]} accessibilityLabel={imageAlt} style={styles.sceneImg} resizeMode="cover" />
        </View>
        <View style={[styles.card, { paddingBottom: insets.bottom + 28 }]}>
          <Ch1Flourish corner="tl" />
          <Ch1Flourish corner="tr" />
          <Text style={styles.cardLabel}>{label}</Text>
          {children}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: ch1.screenBg },
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingBottom: 10, zIndex: 20 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  closeText: { color: ch1.closeIcon, fontSize: 17, fontWeight: '700', lineHeight: 17 },
  trackWrap: { flex: 1, maxWidth: 250, marginHorizontal: 12 },
  scene: { width: '100%', height: 275, backgroundColor: ch1.sceneBg, overflow: 'hidden' },
  sceneImg: { width: '100%', height: '100%' },
  card: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: ch1.cardLine,
    paddingTop: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
  },
  cardLabel: { textAlign: 'center', fontSize: 13, fontWeight: '800', color: ch1.gold, letterSpacing: 2.5, marginBottom: 20 },
  advance: { position: 'absolute', top: 225, right: 24 },
  advanceHit: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
});

/** index.html の本文スタイル */
export const playTextStyles = StyleSheet.create({
  /** .ch101-lesson-meta */
  meta: { textAlign: 'center', fontSize: 12, fontWeight: '700', color: ch1.brown, marginTop: -10, marginBottom: 14, letterSpacing: 0.4 },
  /** .ch101-narrative-text */
  narrative: { fontSize: 15, lineHeight: 27.75, color: ch1.ink },
  /** .ch101-speaker-name */
  speaker: { color: ch1.brown, fontWeight: '800', fontSize: 15, lineHeight: 27.75 },
});

