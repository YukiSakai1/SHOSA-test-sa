/**
 * 第1章 ガイダンス（index.html #screen-ch101-intro）。
 * クリーム色の背景（#FAF8F2）に、上部がアーチ型で金の縁取りのカード（.ch101-arch-card）。
 * カードの中：101・タイトル・副題 → SHOSA（幅 135）→ 白い説明カード（角に金の飾り）。下にターコイズの START。
 */
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { RichText } from '@/components/RichText';
import { CtaButton, LangToggle } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { Ch1Flourish, ch1 } from '@/features/chapter1/PlayLayout';
import { useLang } from '@/i18n/LanguageProvider';
import { images } from '@/theme/images';

export default function Chapter1IntroScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const { guide } = chapter1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <LangToggle style={[styles.lang, { top: insets.top + 14 }]} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.archCard}>
          {/* .ch101-arch-header：カードの上に 38px はみ出すアーチ（index.html の SVG と同じパス） */}
          <View style={styles.archHeader}>
            <Svg width="100%" height="100%" viewBox="0 0 350 115" preserveAspectRatio="none">
              <Path d="M 0,115 L 0,44 C 18,44 32,38 50,42 C 78,48 110,14 175,14 C 240,14 272,48 300,42 C 318,38 332,44 350,44 L 350,115 Z" fill="#FAF7F2" />
              <Path d="M 1,115 L 1,44 C 18,44 32,38 50,42 C 78,48 110,14 175,14 C 240,14 272,48 300,42 C 318,38 332,44 349,44 L 349,115" fill="none" stroke={ch1.gold} strokeWidth={2.5} />
              <Path d="M 6,115 L 6,48 C 22,48 35,43 52,46 C 78,52 108,20 175,20 C 242,20 272,52 298,46 C 315,43 328,48 344,48 L 344,115" fill="none" stroke="#D8C39D" strokeWidth={1.2} />
            </Svg>
            <View style={styles.badgeContent}>
              <Text style={styles.badgeNumber}>{guide.badgeNumber}</Text>
              <Text style={styles.title}>{tr(guide.title)}</Text>
              <Text style={styles.subtitle}>{tr(guide.subtitle)}</Text>
            </View>
          </View>
          <View style={styles.body}>
            <Image source={images.mascotIntro} style={styles.mascot} resizeMode="contain" />
            <View style={styles.descCard}>
              <Ch1Flourish corner="tl" />
              <Ch1Flourish corner="tr" />
              <Ch1Flourish corner="bl" />
              <Ch1Flourish corner="br" />
              {guide.paragraphs.map((p, i) => (
                <RichText key={i} style={[styles.para, i > 0 && { marginTop: 14 }]}>
                  {tr(p)}
                </RichText>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <CtaButton
            testID="chapter1-start"
            label={tr(guide.button)}
            size="tall"
            onPress={() => router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: '0' } })}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // .ch101-intro-screen：背景はページの #FAF8F2、余白 16
  screen: { flex: 1, backgroundColor: '#FAF8F2' },
  // EN はセーフエリアの下 14（index.html の --safe-top + 14）
  lang: { position: 'absolute', right: 0, zIndex: 10 },
  scroll: { paddingHorizontal: 16 },
  // .ch101-arch-card
  archCard: {
    marginTop: 16,
    backgroundColor: '#FAF7F2',
    borderLeftWidth: 2.5,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: ch1.gold,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
  },
  // .ch101-arch-header（幅 +5px、上に -38px、高さ 125）
  archHeader: { marginTop: -38, marginLeft: -2.5, marginRight: -2.5, height: 125 },
  badgeContent: { position: 'absolute', top: 26, left: 0, right: 0, alignItems: 'center' },
  badgeNumber: { fontSize: 32, fontWeight: '800', color: ch1.gold, lineHeight: 32, letterSpacing: 1 },
  title: { fontSize: 20, fontWeight: '800', color: ch1.ink, marginTop: 6, marginBottom: 2, lineHeight: 24 },
  subtitle: { fontSize: 12.5, fontWeight: '600', color: '#4A4A4A' },
  // .ch101-arch-body
  body: { paddingTop: 12, paddingHorizontal: 18, paddingBottom: 22, alignItems: 'center' },
  // .ch101-intro-mascot-wrap / img（幅 135）
  mascot: { width: 135, height: 91, marginTop: 4, marginBottom: 12 },
  // .ch101-desc-card
  descCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6DEC8',
    borderRadius: 8,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  para: { fontSize: 13.5, lineHeight: 24.3, color: '#333333' },
  // .ch101-intro-bottom（上 24）
  bottom: { marginTop: 24 },
});
