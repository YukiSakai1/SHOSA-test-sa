/**
 * 適性診断 結果（Figma CH0-20'）。
 * 1位の職種だけを表示し、2位以降は「1章を進めよう」でロックする。
 * NEXT で 0章を完了扱いにして、1章のガイドへ進む。
 */
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { CtaButton } from '@/components/ui';
import { diagnosisResult } from '@/content/onboarding';
import { rankRoles } from '@/features/onboarding/diagnosis';
import { useOnboarding } from '@/features/onboarding/OnboardingProvider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors, fonts } from '@/theme/colors';

const DARK_TEAL = '#0095A2';

export default function DiagnosisResultScreen() {
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const { record, update } = useOnboarding();
  const [first, second] = rankRoles(record.aptitude);
  const r = diagnosisResult;

  const finish = () => {
    update((rec) => ({ ...rec, completed: true }));
    router.dismissTo('/');
    router.push('/chapter1');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      {/* Figma では「適性診断 完了！」画面の上にシートとして重なる */}
      <View style={styles.dim} />
      <View style={styles.titleBar}>
        <Text style={styles.titleText}>{tr(r.title)}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.paper}>
          <Text style={styles.heading}>{r.heading}</Text>
          <Text style={styles.subheading}>{tr(r.subheading)}</Text>

          {first && (
            <View style={styles.rankCard} testID="rank-1">
              <View style={styles.rankHead}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNo}>NO</Text>
                  <Text style={styles.rankNum}>1</Text>
                </View>
                <Text style={styles.roleName}>{first.role.name}</Text>
                <Text style={styles.percent}>
                  {first.matchPercent}
                  <Text style={styles.percentSign}>%</Text>
                </Text>
                <View style={styles.roleIcon}>
                  <Icon icon={first.role.icon} size={40} />
                </View>
              </View>
              <Text style={styles.strengthLabel}>{tr(r.strengthsLabel)}</Text>
              {first.role.strengths.map((s, i) => (
                <Text key={i} style={styles.strength}>
                  ★ {tr(s)}
                </Text>
              ))}
            </View>
          )}

          {second && (
            <View style={styles.lockedCard}>
              <View style={styles.rankHead}>
                <View style={[styles.rankBadge, { backgroundColor: '#A1A1A1' }]}>
                  <Text style={styles.rankNo}>NO</Text>
                  <Text style={styles.rankNum}>2</Text>
                </View>
                <Text style={[styles.roleName, { opacity: 0.25 }]}>{second.role.name}</Text>
              </View>
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockText}>{tr(r.lockedNote)}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <CtaButton testID="result-next" label={tr(r.button)} onPress={finish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FF805C' },
  dim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)' },
  titleBar: {
    alignSelf: 'center',
    backgroundColor: colors.teal,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 8,
    marginBottom: 12,
  },
  titleText: { fontSize: 22, fontWeight: '700', color: colors.white },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  paper: { backgroundColor: colors.beige, borderRadius: 14, padding: 18 },
  heading: { fontFamily: fonts.montserrat, fontSize: 22, color: DARK_TEAL },
  subheading: { fontSize: 12, fontWeight: '700', color: DARK_TEAL, marginTop: 2 },
  rankCard: { marginTop: 14, backgroundColor: colors.white, borderRadius: 10, padding: 14, gap: 6 },
  rankHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rankBadge: { width: 40, height: 40, borderRadius: 6, backgroundColor: colors.goldDark, alignItems: 'center', justifyContent: 'center' },
  rankNo: { fontSize: 9, fontWeight: '800', color: colors.white, marginBottom: -4 },
  rankNum: { fontSize: 20, fontWeight: '700', color: colors.white },
  roleName: { flex: 1, flexShrink: 1, fontFamily: fonts.montserrat, fontSize: 20, color: colors.black },
  percent: { fontSize: 33, fontWeight: '700', color: colors.goldDark },
  percentSign: { fontSize: 18, fontWeight: '900' },
  roleIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.beige, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  strengthLabel: {
    alignSelf: 'flex-start',
    marginTop: 8,
    backgroundColor: colors.goldDark,
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    overflow: 'hidden',
  },
  strength: { fontSize: 14, lineHeight: 21, color: colors.black },
  lockedCard: { marginTop: 12, backgroundColor: colors.white, borderRadius: 10, padding: 14, minHeight: 120, overflow: 'hidden' },
  lockOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.75)', alignItems: 'center', justifyContent: 'center', gap: 6 },
  lockIcon: { fontSize: 26 },
  lockText: { fontSize: 18, color: '#828282', textAlign: 'center', lineHeight: 26 },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
