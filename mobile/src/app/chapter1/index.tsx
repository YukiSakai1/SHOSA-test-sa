/** 第1章 ガイド画面（Web版 screen-ch101-intro） */
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RichText } from '@/components/RichText';
import { CtaButton, Flourish, LangToggle } from '@/components/ui';
import { chapter1 } from '@/content/chapter1';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function Chapter1IntroScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const { guide } = chapter1;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 8 }]}>
      <LangToggle style={styles.lang} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.archCard}>
          <Text style={styles.badgeNumber}>{guide.badgeNumber}</Text>
          <Text style={styles.title}>{tr(guide.title)}</Text>
          <Text style={styles.subtitle}>{tr(guide.subtitle)}</Text>
          <Image source={images.mascotIntro} style={styles.mascot} resizeMode="contain" />
          <View style={styles.descCard}>
            <Flourish corner="tl" />
            <Flourish corner="tr" />
            <Flourish corner="bl" />
            <Flourish corner="br" />
            {guide.paragraphs.map((p, i) => (
              <RichText key={i} style={[styles.para, i > 0 && { marginTop: 14 }]}>
                {tr(p)}
              </RichText>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <CtaButton
          testID="chapter1-start"
          label={tr(guide.button)}
          onPress={() => router.push({ pathname: '/chapter1/[lesson]/situation', params: { lesson: '0' } })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.playBackground },
  lang: { alignSelf: 'flex-end', marginRight: 16 },
  scroll: { padding: 16 },
  archCard: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 160,
    borderTopRightRadius: 160,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2.5,
    borderColor: colors.gold,
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  badgeNumber: { fontSize: 34, fontWeight: '900', color: colors.gold, letterSpacing: 2 },
  title: { fontSize: 19, fontWeight: '800', color: colors.text, marginTop: 4, textAlign: 'center' },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 6, textAlign: 'center' },
  mascot: { width: 140, height: 140, marginVertical: 12 },
  descCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldPale,
    padding: 22,
  },
  para: { fontSize: 14, lineHeight: 23, color: colors.text },
  bottom: { paddingHorizontal: 24, paddingTop: 8 },
});
