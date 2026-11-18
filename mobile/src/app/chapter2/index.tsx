/** 2章 ガイダンス（Figma CH2-01 / デザイン CH2-S1-01 枠）：緑の柄＋アーチのパネル */
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatternBackground } from '@/components/PatternBackground';
import { CtaButton } from '@/components/ui';
import { chapter2, TENDENCIES, tendencyInfo } from '@/content/chapter2';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';

export default function Chapter2GuideScreen() {
  const { tr } = useLang();
  const insets = useSafeAreaInsets();
  const g = chapter2.guide;
  return (
    <PatternBackground color="#57CD95" patternColor="rgba(255,255,255,0.22)" style={{ paddingTop: insets.top + 12 }}>
      <View style={styles.arch}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.badge}>{g.badgeNumber}</Text>
          <Text style={styles.title}>{g.title}</Text>
          <Text style={styles.subtitle}>{tr(g.subtitle)}</Text>
          <View style={styles.noteRow}>
            <Image source={images.mascotFace} style={styles.mascot} resizeMode="contain" />
            <Text style={styles.note}>{tr(g.note)}</Text>
          </View>
          <Text style={styles.body}>{tr(g.body)}</Text>
          <View style={styles.resultsBox}>
            <Text style={styles.resultsLead}>{tr(g.resultsLead)}</Text>
            <View style={styles.grid}>
              {TENDENCIES.map((t) => (
                <View key={t} style={styles.chip}>
                  <Text style={styles.chipEmoji}>{tendencyInfo[t].emoji}</Text>
                  <Text style={styles.chipText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
          <CtaButton testID="chapter2-start" label={tr(g.button)} onPress={() => router.push('/chapter2/roles')} />
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
  scroll: { alignItems: 'center', paddingTop: 40, paddingHorizontal: 31, paddingBottom: 12 },
  badge: { fontFamily: fonts.montserrat, fontSize: 34, color: colors.goldLabel },
  title: { fontFamily: fonts.montserrat, fontSize: 22, color: colors.text, marginTop: 6 },
  subtitle: { fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 6 },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, alignSelf: 'stretch' },
  mascot: { width: 64, height: 58 },
  note: {
    flex: 1,
    backgroundColor: colors.teal,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  body: { fontSize: 16, lineHeight: 24, color: colors.black, marginTop: 16 },
  resultsBox: {
    alignSelf: 'stretch',
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    padding: 14,
    gap: 10,
  },
  resultsLead: { fontSize: 12, color: colors.black, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.beige, borderRadius: 8, padding: 8 },
  chipEmoji: { fontSize: 16 },
  chipText: { fontSize: 14, fontWeight: '700', color: colors.black },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
