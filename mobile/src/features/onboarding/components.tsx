/**
 * 0章の画面で共通して使う部品（Figma「0章_261016」準拠）。
 * - QuestionLayout: ベージュ柄の背景＋ヘッダー＋SHOSA の吹き出し＋選択肢＋NEXT（CH0-08/09〜11/22）
 * - TalkLayout:     ドア101の部屋で SHOSA が話す画面（CH0-07/20/15/13）
 * - OptionCard:     ホタテ型の枠の選択肢カード（360x68）
 */
import type { ReactNode } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from '@/components/Icon';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton, LangToggle, ProgressBar } from '@/components/ui';
import type { IconRef, Localized } from '@/content/types';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

/** ヘッダー：戻る（金丸の ←）・進捗バー・EN 切り替え */
export function OnboardingHeader({ percent, showLang = true }: { percent?: number; showLang?: boolean }) {
  const { t } = useLang();
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('back')}
        hitSlop={10}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      >
        <Image source={images.btnBack} style={styles.back} />
      </Pressable>
      {percent !== undefined ? <ProgressBar percent={percent} /> : <View style={{ flex: 1 }} />}
      {showLang ? <LangToggle /> : <View style={{ width: 48 }} />}
    </View>
  );
}

/** SHOSA（110x100）＋白い吹き出し */
export function MascotBubble({ text }: { text: Localized }) {
  const { tr } = useLang();
  return (
    <View style={styles.mascotRow}>
      <Image source={images.mascotFace} style={styles.mascotSmall} resizeMode="contain" />
      <View style={styles.bubble}>
        <View style={styles.bubbleTail} />
        <Text style={styles.bubbleText}>{tr(text)}</Text>
      </View>
    </View>
  );
}

/** ホタテ型の選択肢カード。選択中は紫の枠と文字になる */
export function OptionCard({
  label,
  icon,
  selected,
  onPress,
  height = 68,
  children,
  testID,
}: {
  label: string;
  icon?: IconRef;
  selected: boolean;
  onPress: () => void;
  height?: number;
  children?: ReactNode;
  testID?: string;
}) {
  return (
    <Pressable testID={testID} accessibilityRole="radio" accessibilityState={{ checked: selected }} onPress={onPress}>
      <ImageBackground
        source={selected ? images.cardBorderSelected : images.cardBorderUnselected}
        resizeMode="stretch"
        style={[styles.option, { minHeight: height }]}
        imageStyle={styles.fill}
      >
        <View style={styles.optionRow}>
          {icon && <Icon icon={icon} size={40} />}
          <Text style={[styles.optionText, selected && { color: colors.purple }]}>{label}</Text>
        </View>
        {children}
      </ImageBackground>
    </Pressable>
  );
}

/** 選択肢を並べる画面の共通レイアウト */
export function QuestionLayout({
  percent,
  question,
  children,
  footer,
  nextLabel,
  nextDisabled,
  onNext,
  showLang = true,
}: {
  percent?: number;
  question?: Localized;
  children: ReactNode;
  /** NEXT の上に置く要素（お知らせ時間の帯など） */
  footer?: ReactNode;
  nextLabel?: string;
  nextDisabled: boolean;
  onNext: () => void;
  showLang?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const { t } = useLang();
  return (
    <PatternBackground {...patterns.beige} style={{ paddingTop: insets.top }}>
      <OnboardingHeader percent={percent} showLang={showLang} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {question && <MascotBubble text={question} />}
        <View style={styles.options}>{children}</View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        {footer}
        <CtaButton testID="onboarding-next" label={nextLabel ?? t('next')} disabled={nextDisabled} onPress={onNext} />
      </View>
    </PatternBackground>
  );
}

/** ドア101の部屋で SHOSA が話す画面（ランプ・ドア・大きい SHOSA・吹き出し・NEXT） */
export function TalkLayout({ lines, onNext, style }: { lines: Localized[]; onNext: () => void; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  const { t, tr } = useLang();
  return (
    <PatternBackground {...patterns.beige} style={[{ paddingTop: insets.top }, style]}>
      <OnboardingHeader />
      <View style={styles.talkStage}>
        <Image source={images.sceneDoor101} style={styles.door} resizeMode="contain" />
        <Image source={images.lamp} style={[styles.lamp, { left: 18 }]} />
        <Image source={images.lamp} style={[styles.lamp, { right: 18 }]} />
        <Image source={images.floorShadow} style={styles.talkShadow} resizeMode="contain" />
        <Image source={images.mascotFace} style={styles.mascotLarge} resizeMode="contain" />
      </View>
      <View style={styles.talkBubble}>
        <View style={styles.talkBubbleTail} />
        {lines.map((l, i) => (
          <Text key={i} style={[styles.talkText, i > 0 && { marginTop: 14 }]}>
            {tr(l)}
          </Text>
        ))}
      </View>
      <View style={{ flex: 1 }} />
      <View style={[styles.bottomTalk, { paddingBottom: insets.bottom + 16 }]}>
        <CtaButton testID="onboarding-next" label={t('next')} onPress={onNext} />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 21, paddingVertical: 10 },
  back: { width: 32, height: 32 },
  scroll: { paddingHorizontal: 21, paddingBottom: 16 },
  mascotRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, marginBottom: 12 },
  mascotSmall: { width: 110, height: 100 },
  bubble: { flex: 1, backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14 },
  bubbleTail: {
    position: 'absolute',
    left: -9,
    top: '45%',
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: colors.white,
  },
  bubbleText: { fontSize: 16, lineHeight: 24, color: colors.black },
  options: { gap: 10 },
  option: { justifyContent: 'center', paddingHorizontal: 26, paddingVertical: 12 },
  fill: { width: '100%', height: '100%' },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  optionText: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  bottom: { paddingHorizontal: 21, paddingTop: 8, gap: 12 },
  bottomTalk: { paddingHorizontal: 21 },
  talkStage: { height: 300, alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 },
  door: { position: 'absolute', top: 0, width: 300, height: 220 },
  lamp: { position: 'absolute', top: 60, width: 60, height: 60 },
  talkShadow: { position: 'absolute', bottom: 0, width: 120, height: 22 },
  mascotLarge: { width: 170, height: 154, marginBottom: 6 },
  talkBubble: {
    marginHorizontal: 40,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  talkBubbleTail: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.white,
  },
  talkText: { fontSize: 16, lineHeight: 26, color: colors.black, textAlign: 'center' },
});

/** 0章前半（ヒアリング4問＋スケジュール＋プロフィール）の進捗。Web版と同じ6ステップ */
export function blockProgress(step: number): number {
  return Math.round((step / 6) * 100);
}
