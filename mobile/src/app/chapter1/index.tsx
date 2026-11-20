/**
 * 第1章 ガイダンス（Figma CH0-08）。
 * 空色の背景（#6DCAF1）に、上がアーチ型のクリーム色の面（features/chapter1/guideArt.ts：Figma のベクターをそのまま SVG にしたもの）。
 * 面の中：101（Montserrat 34・#DAC397・金茶の影）→ タイトル（Montserrat 22）→ 副題（12）→ SHOSA（170×114、体は止めたまま頭と顔だけが左右にゆっくり傾く）
 *   → 白い説明カード（上下に 28 の帯、枠は #E6D8BD、角に #E6D8BD の葉の飾り）。下に紫の START（360×48）。
 * 位置は Figma の画面（402×874、上のステータスバー 59 を含む）から。セーフエリアの上端からの距離で置く。
 */
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { RichText } from '@/components/RichText';
import { Appear } from '@/components/Appear';
import { ShosaMascot } from '@/components/ShosaMascot';
import { CtaButton, LangToggle } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { GUIDE_ART_XML } from '@/features/chapter1/guideArt';
import { Ch1CardLeaf } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { layout } from '@/theme/layout';

/** Figma の画面でのステータスバーの高さ（iPhone 17 Pro の上のセーフエリア） */
const FIGMA_TOP = 59;
const CARD_LINE = '#E6D8BD';

export default function Chapter1IntroScreen() {
  const { lang, tr } = useLang();
  const insets = useSafeAreaInsets();
  const { guide } = chapter1;
  // 英語は文が長いため、本文を少し小さくし、副題を 1行に収めて、スクロールなしで START の上に収める
  const en = lang === 'en';
  // Figma の y（画面の上端から）を、セーフエリアの上端からの距離に直す
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;

  return (
    <PatternBackground {...patterns.sky}>
      {/* アーチ型の面（Figma では画面の上から 73、402×801） */}
      <View pointerEvents="none" style={[styles.art, { top: y(73) }]}>
        <SvgXml xml={GUIDE_ART_XML} width="100%" height="100%" preserveAspectRatio="xMidYMin slice" />
      </View>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        contentContainerStyle={{ paddingTop: y(112), paddingBottom: insets.bottom + layout.ctaBottom + 48 + 24, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* 101・タイトル・副題（幅 252 の中央そろえ） */}
        <View style={styles.titleBox}>
          <Text style={styles.badge}>{guide.badgeNumber}</Text>
          <Text style={styles.title}>{tr(guide.title)}</Text>
          <Text style={[styles.subtitle, en && styles.subtitleEn]}>{tr(guide.subtitle)}</Text>
        </View>
        {/* SHOSA（170×114、Figma のベクター）。足元の手が、カードの上の帯（枠）に 12 かかる。フェードインのあと、頭と顔だけを動かす */}
        <Appear from="none" delay={200} duration={400} style={styles.mascot}>
          <ShosaMascot moveHead />
        </Appear>
        <View style={styles.card}>
          <View style={styles.cap} />
          <View style={styles.cardBody}>
            {guide.paragraphs.map((p, i) => (
              <RichText key={i} style={[styles.para, en && styles.paraEn, i > 0 && { marginTop: en ? 12 : 17 }]}>
                {tr(p)}
              </RichText>
            ))}
          </View>
          <View style={[styles.cap, styles.capBottom]} />
          {/* Figma の Frame 255 / 290 の角の飾り（Group 258 / 259：#E6D8BD の葉 3枚、角から 1）。下の帯は上下反転 */}
          <Ch1CardLeaf corner="tl" edge={1} inset={1} />
          <Ch1CardLeaf corner="tr" edge={1} inset={1} />
          <Ch1CardLeaf corner="bl" edge={1} inset={1} />
          <Ch1CardLeaf corner="br" edge={1} inset={1} />
        </View>
      </ScrollView>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="chapter1-start"
          variant="primary"
          // Figma の btn：DROP_SHADOW（0, 3）・ぼかし 0・#4D3CA8
          ledge={{ color: '#4D3CA8', depth: 3 }}
          label={tr(guide.button)}
          onPress={() => router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: '0' } })}
        />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  art: { position: 'absolute', left: 0, right: 0, aspectRatio: 402 / 801 },
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  // Frame 415：幅 252、101（34）→ 15 → タイトル（22）→ 9 → 副題（12）
  titleBox: { width: 252, alignItems: 'center', overflow: 'visible' },
  badge: {
    fontFamily: fonts.montserrat,
    fontSize: 34,
    lineHeight: 34,
    letterSpacing: -1,
    color: '#DAC397',
    // Figma：DROP_SHADOW（0, 1.47）、ぼかし 0、#897759
    textShadowColor: '#897759',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 0,
  },
  title: { fontFamily: fonts.montserrat, fontSize: 22, lineHeight: 22, color: '#333333', marginTop: 15, textAlign: 'center' },
  subtitle: { fontSize: 12, lineHeight: 12, fontWeight: '700', color: '#333333', marginTop: 9, textAlign: 'center' },
  // 英語：副題を 1行にするため、幅を 340（カードの幅）まで広げ、文字を少し小さくする
  subtitleEn: { width: 340, fontSize: 11, lineHeight: 12 },
  // 副題の下端（204）から SHOSA の上端（228）まで 24。カードより手前：手が上の帯（枠）にかかる（Figma）
  mascot: { width: 170, height: 114, marginTop: 24, zIndex: 2 },
  // SHOSA の下端（342）より 12 上に、カードの上の帯（330）
  card: { width: 340, marginTop: -12 },
  // Frame 255 / 290：高さ 28、白、上・左・右に #E6D8BD の 5px の枠、上の角は 10
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
  // Frame 291：高さ 301、白。枠は上下の帯と同じ #E6D8BD の 5px を左右にも続け、枠全体を同じ太さでおおう。文字はカードの左右端から 34（枠 5 の内側から 29）・上 10 から
  cardBody: {
    minHeight: 301,
    backgroundColor: colors.white,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderColor: CARD_LINE,
    paddingHorizontal: 29,
    paddingTop: 10,
    paddingBottom: 10,
  },
  para: { fontSize: 16, lineHeight: 24, color: '#000000' },
  paraEn: { fontSize: 14, lineHeight: 20 },
  bottom: { position: 'absolute', left: 21, right: 21, bottom: 0 },
});
