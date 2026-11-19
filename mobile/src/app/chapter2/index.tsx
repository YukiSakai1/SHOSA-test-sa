/**
 * 2章 ガイダンス（Figma CH2-S1-01：1章のガイドと同じ作り）。
 * 緑（#57CD95）の柄の背景に、上がアーチ型のクリーム色の面（features/chapter1/guideArt.ts）。
 * 面の中：201（Montserrat 34・#DAC397）→ タイトル（Montserrat 22）→ 副題（12）→ SHOSA（170×114）
 *   → 白いカード（上下に 28 の帯、枠は #E6D8BD）：注記の札 → 本文 → 薄緑（#E7FDEB）の面に「行動傾向を数値化」の見本（4本の棒）。
 * 下にターコイズの START（360×48）。位置は Figma の画面（402×874、上のステータスバー 59 を含む）から。
 */
import { router } from 'expo-router';
import { Animated, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PatternBackground } from '@/components/PatternBackground';
import { useMascotMotion } from '@/components/useMascotMotion';
import { CtaButton, LangToggle } from '@/components/ui';
import { chapter2, TENDENCIES, tendencyInfo } from '@/content/chapter2';
import { GUIDE_ART_XML } from '@/features/chapter1/guideArt';
import { NotePill } from '@/features/chapter2/NotePill';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';
import { layout } from '@/theme/layout';

/** Figma の画面でのステータスバーの高さ（iPhone 17 Pro の上のセーフエリア） */
const FIGMA_TOP = 59;
const CARD_LINE = '#E6D8BD';
/** 見本の棒の長さ（Figma：138 の溝のうち 48 / 48 / 85 / 121） */
const SAMPLE_BARS: Record<(typeof TENDENCIES)[number], number> = { Accuracy: 48 / 138, Efficiency: 48 / 138, Communication: 85 / 138, Hospitality: 121 / 138 };

export default function Chapter2GuideScreen() {
  const { lang, tr } = useLang();
  const insets = useSafeAreaInsets();
  const g = chapter2.guide;
  const { mascot: mascotMotion } = useMascotMotion();
  const en = lang === 'en';
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;

  return (
    <PatternBackground color="#57CD95" patternColor="rgba(255,255,255,0.22)">
      {/* アーチ型の面（1章と同じ形。Figma では画面の上から 73、402×801） */}
      <View pointerEvents="none" style={[styles.art, { top: y(73) }]}>
        <SvgXml xml={GUIDE_ART_XML} width="100%" height="100%" preserveAspectRatio="xMidYMin slice" />
      </View>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ paddingTop: y(112), paddingBottom: insets.bottom + layout.ctaBottom + 48 + 24, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleBox}>
          <Text style={styles.badge}>{g.badgeNumber}</Text>
          <Text style={styles.title}>{tr(g.title)}</Text>
          <Text style={[styles.subtitle, en && styles.subtitleEn]}>{tr(g.subtitle)}</Text>
        </View>
        {/* SHOSA（170×114）。足元の手が、カードの上の帯に 12 かかる */}
        <Animated.Image source={images.mascotIntro} style={[styles.mascot, mascotMotion]} resizeMode="contain" />
        <View style={styles.card}>
          <View style={styles.cap} />
          {/* 白い面：注記の札（272×34）→ 12 あけて本文 */}
          <View style={styles.bodyWhite}>
            <NotePill>{tr(g.note)}</NotePill>
            <Text style={[styles.body, en && styles.bodyEn]}>{tr(g.body)}</Text>
          </View>
          {/* 薄緑の面：行動傾向を数値化する見本 */}
          <View style={styles.bodyGreen}>
            <View style={styles.lead}>
              <Text style={styles.leadText}>{tr(g.resultsLead)}</Text>
            </View>
            <View style={styles.bars}>
              {TENDENCIES.map((t) => (
                <View key={t} style={styles.barRow}>
                  <View style={styles.barLabel}>
                    <Image source={images[tendencyInfo[t].icon]} style={styles.barIcon} resizeMode="contain" />
                    <Text style={styles.barName}>{t}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${SAMPLE_BARS[t] * 100}%` }]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.cap, styles.capBottom]} />
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton testID="chapter2-start" label={tr(g.button)} onPress={() => router.push('/chapter2/roles')} />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute', left: 0, right: 0, aspectRatio: 402 / 801 },
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  titleBox: { width: 252, alignItems: 'center', overflow: 'visible' },
  badge: {
    fontFamily: fonts.montserrat,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1,
    color: '#DAC397',
    textShadowColor: '#897759',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 0,
  },
  title: { fontFamily: fonts.montserrat, fontSize: 22, lineHeight: 22, color: '#333333', marginTop: 15, textAlign: 'center', width: 300 },
  subtitle: { fontSize: 12, lineHeight: 12, fontWeight: '700', color: '#333333', marginTop: 9, textAlign: 'center' },
  subtitleEn: { width: 340, fontSize: 11, lineHeight: 12 },
  mascot: { width: 170, height: 114, marginTop: 24, zIndex: 2 },
  card: { width: 340, marginTop: -12 },
  cap: {
    height: 28,
    backgroundColor: colors.white,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderColor: CARD_LINE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  capBottom: { borderTopWidth: 0, borderBottomWidth: 5, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  // Frame 291（白・高さ 182）：札は上から 0、本文は札の 12 下（札 34 + 12 = 46）。左右 34（枠 5 の内側から 29）
  bodyWhite: { minHeight: 182, backgroundColor: colors.white, borderLeftWidth: 5, borderRightWidth: 5, borderColor: CARD_LINE, paddingHorizontal: 29, paddingBottom: 16 },
  body: { fontSize: 16, lineHeight: 24, color: '#000000', marginTop: 12 },
  bodyEn: { fontSize: 14, lineHeight: 20 },
  // Frame 291（薄緑 #E7FDEB・高さ 156）：上 16、左右 34
  bodyGreen: { minHeight: 156, backgroundColor: '#E7FDEB', borderLeftWidth: 5, borderRightWidth: 5, borderColor: CARD_LINE, paddingHorizontal: 29, paddingVertical: 16, alignItems: 'center' },
  // 「あなたが優先する行動傾向を数値化」：白・角 30・216×21（12 Regular）
  lead: { minWidth: 216, minHeight: 21, borderRadius: 30, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 4 },
  leadText: { fontSize: 12, lineHeight: 14, color: '#000000', textAlign: 'center' },
  // 4本の棒：行の高さ 14、間隔 13（27 おき）。左の見出し 118（アイコン 14 + 4 + 文字）、溝 138（#E0E0E0）に #00C9C3
  bars: { alignSelf: 'stretch', marginTop: 14, gap: 13 },
  barRow: { height: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barLabel: { width: 118, flexDirection: 'row', alignItems: 'center', gap: 4 },
  barIcon: { width: 14, height: 14 },
  barName: { fontSize: 14, lineHeight: 14, fontWeight: '700', color: '#000000' },
  barTrack: { width: 138, height: 14, backgroundColor: '#E0E0E0' },
  barFill: { height: 14, backgroundColor: '#00C9C3' },
  bottom: { position: 'absolute', left: 21, right: 21, bottom: 0 },
});
