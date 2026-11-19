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
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop, SvgXml } from 'react-native-svg';
import { router, type Href } from 'expo-router';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CARD_TOP_XML } from '@/features/chapter1/cardTopArt';
import { fonts } from '@/theme/colors';
import { useSvgId } from '@/lib/useSvgId';
import { LangToggle, PressScale, ProgressBar } from '@/components/ui';
import { useLang } from '@/i18n/LanguageProvider';
import { images, type ImageKey } from '@/theme/images';
import { chapter1LessonCount } from '@/content/chapter1';

/** 1章の色（Figma CH1-L01 の各画面） */
export const ch1 = {
  screenBg: '#E8DECB',
  sceneBg: '#E8E2D8',
  cardLine: '#ECE4D8',
  gold: '#C4A265',
  /** Figma のラベル（SITUATION / QUESTION）の色と、会話の話者名の色 */
  label: '#DAC397',
  speaker: '#B09D79',
  line: '#E6D8BD',
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
 * ヘッダー（Figma：セーフエリアの下 14、高さ 32）。左に ✕ の丸（32・白・#E6D8BD の枠・金茶の ✕）、
 * 進捗バー（0章と同じ：幅 276・高さ 12）、右端に EN。画面の左端から 21。
 * exitTo は ✕ で中断したときの戻り先（既定はタイトル）。
 */
export function ChapterHeader({ percent, exitTo = '/', style }: { percent: number; exitTo?: Href; style?: StyleProp<ViewStyle> }) {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const [confirming, setConfirming] = useState(false);
  return (
    <View style={[styles.header, { paddingTop: insets.top + 14 }, style]}>
      <PressScale accessibilityLabel={t('close')} hitSlop={6} onPress={() => setConfirming(true)} style={styles.close}>
        <Svg width={15} height={15} viewBox="0 0 15 15">
          <Path d="M1.5 1.5 L13.5 13.5 M13.5 1.5 L1.5 13.5" stroke={ch1.speaker} strokeWidth={3} strokeLinecap="round" />
        </Svg>
      </PressScale>
      <View style={styles.trackWrap}>
        <ProgressBar percent={percent} variant="ch0" />
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

/** 角の金の飾り（24px、角から 6px。edge を渡すと左右だけその距離にする：レッスンのカードは 2） */
export function Ch1Flourish({ corner, color = ch1.gold, edge = 6 }: { corner: 'tl' | 'tr' | 'bl' | 'br'; color?: string; edge?: number }) {
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
    ...(corner[1] === 'l' ? { left: edge } : { right: edge }),
  };
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" style={pos} pointerEvents="none">
      <Path d={d} fill={color} stroke={color} strokeWidth={1} />
    </Svg>
  );
}

/** カード右下の「進む」ボタン（Figma：32×32 の白い丸、枠 #E6D8BD、カードの上から 173・右から 21） */
export function Ch1AdvanceButton({ onPress, label, turn = 1 }: { onPress: () => void; label: string; turn?: 1 | 2 }) {
  return (
    // 会話の 2/2 では吹き出しの下（カードの上から 332）に移る
    <View style={[styles.advance, turn === 2 && { top: 332 }]}>
      <PressScale accessibilityLabel={label} onPress={onPress} hitSlop={10} style={styles.advanceHit}>
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Circle cx={16} cy={16} r={15.5} fill="#FFFFFF" stroke={ch1.line} strokeWidth={1} />
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
  const gradId = useSvgId('scenefade');
  return (
    // 背景は Figma の #E8DECB にベージュの菱形とドットの柄
    <PatternBackground color={ch1.screenBg} patternColor={patterns.beige.patternColor} tile={patterns.beige.tile}>
      {/* ヘッダー（高さ 32）の下から場面画像まで 20 */}
      <ChapterHeader percent={percent} exitTo={exitTo} style={{ paddingBottom: 20 }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* 場面画像（Figma：402×342） */}
        <View style={styles.scene}>
          <Image source={images[image]} accessibilityLabel={imageAlt} style={styles.sceneImg} resizeMode="cover" />
          {/* 下の 40 は透明 → 黒 20% のグラデーション */}
          <Svg style={styles.sceneFade} width="100%" height={40} preserveAspectRatio="none" pointerEvents="none">
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#000000" stopOpacity={0} />
                <Stop offset="1" stopColor="#000000" stopOpacity={0.2} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${gradId})`} />
          </Svg>
        </View>
        {/* 白いカード：場面画像に 10 かさなる。上の角は内側に丸く欠け、縁に #E6D8BD の帯 */}
        <View style={[styles.card, { paddingBottom: insets.bottom + 28 }]}>
          <View style={styles.cardFill} />
          <SvgXml xml={CARD_TOP_XML} width="100%" height={16} preserveAspectRatio="none" style={styles.cardTop} />
          <Ch1Flourish corner="tl" edge={2} />
          <Ch1Flourish corner="tr" edge={2} />
          <Text style={styles.cardLabel}>{label}</Text>
          {children}
        </View>
      </ScrollView>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  // ヘッダー：左 21、✕の丸 32、進捗バー（0章と同じ）は ✕ の 10 右・幅 276、EN は右端
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 21, zIndex: 20 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ch1.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackWrap: { flex: 1, maxWidth: 276, marginLeft: 10, marginRight: 15 },
  scene: { width: '100%', aspectRatio: 402 / 342, backgroundColor: ch1.sceneBg, overflow: 'hidden' },
  sceneImg: { width: '100%', height: '100%' },
  sceneFade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  // 白いカード：Figma の y=457（場面画像の下端 467 の 10 上）。ラベルは上から 30、文字は左右 41
  card: { flexGrow: 1, marginTop: -10, paddingTop: 30, paddingHorizontal: 41 },
  cardFill: { position: 'absolute', top: 15, left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF' },
  cardTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  cardLabel: {
    textAlign: 'center',
    fontFamily: fonts.montserrat,
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: -0.42,
    color: ch1.label,
    marginBottom: 20,
    // Figma：DROP_SHADOW（0, 1.5）、ぼかし 0、#897759
    textShadowColor: '#897759',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 0,
  },
  advance: { position: 'absolute', top: 173, right: 21 },
  advanceHit: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});

/** Figma の本文スタイル（Noto Sans CJK JP 16 / 行の高さ 24） */
export const playTextStyles = StyleSheet.create({
  narrative: { fontSize: 16, lineHeight: 24, color: '#000000' },
  /** 話者名（Bold 16・#B09D79） */
  speaker: { color: ch1.speaker, fontWeight: '700', fontSize: 16, lineHeight: 16 },
});
