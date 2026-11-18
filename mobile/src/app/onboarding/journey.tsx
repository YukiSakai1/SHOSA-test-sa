/**
 * YOUR JOURNEY（Figma CH0-18）。ゴール（401）から現在地（適職診断）までの扉を縦に並べる。
 * いま開けられるのは一番下の「自分を知る（適職診断）」だけで、ほかは鍵付き。
 */
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton } from '@/components/ui';
import { journey } from '@/content/onboarding';
import { OnboardingHeader } from '@/features/onboarding/components';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';
import { images } from '@/theme/images';

export default function JourneyScreen() {
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  return (
    <PatternBackground {...patterns.beige} style={{ paddingTop: insets.top }}>
      <OnboardingHeader />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>{tr(journey.subtitle)}</Text>
        <Text style={styles.title}>{journey.title}</Text>
        <Text style={styles.goal}>{`\\ ${tr(journey.goal)} /`}</Text>
        <View style={styles.path}>
          <View style={styles.rail} />
          {journey.steps.map((s, i) => (
            <View key={i} style={[styles.row, !s.locked && styles.rowCurrent]}>
              <View style={styles.doorWrap}>
                <Image source={images[s.door]} style={s.locked ? styles.door : styles.doorOpen} resizeMode="contain" />
                {s.doorNumber && <Text style={styles.doorNumber}>{s.doorNumber}</Text>}
                {!s.locked && <Image source={images.mascotSmall} style={styles.peek} resizeMode="contain" />}
              </View>
              <View style={styles.texts}>
                <Text style={[styles.stepTitle, s.locked && styles.lockedText]}>✔︎ {tr(s.title)}</Text>
                <Text style={[styles.stepDesc, s.locked && styles.lockedText]}>{tr(s.desc)}</Text>
              </View>
              {s.locked && <Image source={images.lockKey} style={styles.lock} resizeMode="contain" />}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <CtaButton testID="onboarding-next" variant="primary" label={tr(journey.button)} onPress={() => router.push('/onboarding/aptitude-intro')} />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 21, paddingBottom: 16 },
  subtitle: { fontSize: 12, color: colors.black, textAlign: 'center' },
  title: { fontFamily: fonts.montserrat, fontSize: 30, color: colors.text, textAlign: 'center', marginTop: 2 },
  goal: { fontSize: 12, fontWeight: '700', color: colors.goldDark, textAlign: 'center', marginTop: 6 },
  path: { marginTop: 10, gap: 12 },
  rail: { position: 'absolute', left: 46, top: 20, bottom: 20, width: 4, backgroundColor: colors.goldBorder, borderRadius: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 10,
    padding: 10,
  },
  rowCurrent: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.goldLabel },
  doorWrap: { width: 74, alignItems: 'center' },
  door: { width: 54, height: 93 },
  doorOpen: { width: 70, height: 108 },
  doorNumber: { position: 'absolute', top: 12, fontFamily: fonts.montserrat, fontSize: 12, color: colors.goldBorder },
  peek: { position: 'absolute', bottom: 2, width: 44, height: 40 },
  texts: { flex: 1, gap: 4 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  stepDesc: { fontSize: 12, lineHeight: 18, color: colors.black },
  lockedText: { color: '#5D5D5D' },
  lock: { width: 18, height: 24 },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
