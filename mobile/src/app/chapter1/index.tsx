/**
 * 第1章 ガイダンス（Figma CH1-GUIDE / デザイン CH0-08 枠）。
 * スカイブルーの柄の背景に、上部が装飾アーチのクリーム色パネル。紫の START。
 */
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { RichText } from '@/components/RichText';
import { CtaButton } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';

export default function Chapter1IntroScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const { guide } = chapter1;

  return (
    <PatternBackground {...patterns.sky} style={{ paddingTop: insets.top + 12 }}>
      <View style={styles.arch}>
        <View style={styles.archTrim} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.badgeNumber}>{guide.badgeNumber}</Text>
          <Text style={styles.title}>{tr(guide.title)}</Text>
          <Text style={styles.subtitle}>{tr(guide.subtitle)}</Text>
          <Image source={images.mascotIntro} style={styles.mascot} resizeMode="contain" />
          <View style={styles.descCard}>
            <View style={styles.bar} />
            <View style={styles.descBody}>
              {guide.paragraphs.map((p, i) => (
                <RichText key={i} style={[styles.para, i > 0 && { marginTop: 16 }]}>
                  {tr(p)}
                </RichText>
              ))}
            </View>
            <View style={styles.bar} />
          </View>
        </ScrollView>
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
          <CtaButton
            testID="chapter1-start"
            variant="primary"
            label={tr(guide.button)}
            onPress={() => router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: '0' } })}
          />
        </View>
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  arch: {
    flex: 1,
    backgroundColor: colors.beige,
    borderTopLeftRadius: 170,
    borderTopRightRadius: 170,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: colors.goldDark,
    overflow: 'hidden',
  },
  archTrim: {
    position: 'absolute',
    top: 5,
    left: 5,
    right: 5,
    bottom: -5,
    borderTopLeftRadius: 165,
    borderTopRightRadius: 165,
    borderWidth: 1.5,
    borderColor: colors.goldBorder,
  },
  scroll: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 31, paddingBottom: 12 },
  badgeNumber: { fontFamily: fonts.montserrat, fontSize: 34, color: colors.goldLabel },
  title: { fontFamily: fonts.montserrat, fontSize: 22, color: colors.text, marginTop: 6 },
  subtitle: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 6 },
  mascot: { width: 170, height: 114, marginVertical: 10 },
  descCard: { alignSelf: 'stretch' },
  bar: { height: 28, backgroundColor: colors.white, borderWidth: 5, borderColor: colors.goldBorder, borderRadius: 10 },
  descBody: {
    backgroundColor: colors.white,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.goldBorder,
    marginHorizontal: 4,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  para: { fontSize: 16, lineHeight: 24, color: colors.black },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
