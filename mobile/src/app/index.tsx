/**
 * 仮のホーム画面。
 * Web版のタイトル〜0章（オンボーディング）は未移植のため、ここから第1章へ入る。
 */
import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton, LangToggle } from '@/components/ui';
import { useChapter1Completed } from '@/features/chapter1/progress';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

export default function HomeScreen() {
  const { t } = useLang();
  const insets = useSafeAreaInsets();
  const completed = useChapter1Completed();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }]}>
      <LangToggle style={styles.lang} />
      <View style={styles.center}>
        <Image source={images.mascotIntro} style={styles.mascot} resizeMode="contain" />
        <Text style={styles.title}>{t('homeTitle')}</Text>
        <Text style={styles.subtitle}>{t('homeSubtitle')}</Text>
        {completed && <Text style={styles.done}>✔ {t('homeChapter1Done')}</Text>}
      </View>
      <Link href="/chapter1" asChild>
        <CtaButton testID="start-chapter1" label={t('homeStartChapter1')} onPress={() => {}} />
      </Link>
      <Text style={styles.note}>{t('homeOnboardingTodo')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 24 },
  lang: { alignSelf: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  mascot: { width: 160, height: 160 },
  title: { fontSize: 40, fontWeight: '900', color: colors.purple, letterSpacing: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
  done: { marginTop: 8, color: colors.teal, fontWeight: '800' },
  note: { marginTop: 12, fontSize: 11, color: colors.textMuted, textAlign: 'center' },
});
