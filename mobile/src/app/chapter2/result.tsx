/**
 * 診断結果：職種との相性（Figma CH2-04 デザイン / Group 382）。
 * 左「{職種}で求められる力」と右「あなたの行動傾向」を 1〜4位で並べ、
 * 1位の傾向から「あなたの強み」、職種の1位の力から「これから意識したいこと」を出す。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CtaButton } from '@/components/ui';
import { chapter2, fill, findRole, tendencyInfo, type Tendency } from '@/content/chapter2';
import { useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { scoreRole } from '@/features/chapter2/scoring';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';
import { layout } from '@/theme/layout';

const DARK_TEAL = '#0095A2';

export default function Chapter2ResultScreen() {
  const params = useLocalSearchParams<{ role: string }>();
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const { record } = useChapter2();
  const role = findRole(params.role);
  if (!role) return <Redirect href="/chapter2/roles" />;

  const ranking = scoreRole(role, record.answers[role.id]);
  const top = ranking[0]!.tendency;
  const r = chapter2.result;
  const v = { role: role.name, t: top };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{tr(r.title)}</Text>
          <Text style={styles.lead}>{fill(tr(r.lead), v)}</Text>
          <View style={styles.columns}>
            <RankColumn label={fill(tr(r.requiredLabel), v)} items={role.required} />
            <RankColumn label={tr(r.yoursLabel)} items={ranking.map((x) => x.tendency)} highlight={top} testID="your-ranking" />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{fill(tr(r.strengthsLabel), v)}</Text>
            <Text style={styles.tendencyLine}>{fill(tr(r.tendencyLine), v)}</Text>
            <Text style={styles.text}>{tr(role.strengths[top])}</Text>
          </View>
          <View style={styles.adviceBox}>
            <Text style={styles.adviceLabel}>{tr(r.adviceLabel)}</Text>
            <Text style={styles.text}>{tr(role.advice)}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton testID="c2-result-next" label={tr(r.button)} onPress={() => router.push({ pathname: '/chapter2/profile', params: { role: role.id } })} />
      </View>
    </View>
  );
}

function RankColumn({ label, items, highlight, testID }: { label: string; items: Tendency[]; highlight?: Tendency; testID?: string }) {
  return (
    <View style={styles.column} testID={testID}>
      <Text style={styles.columnLabel}>{label}</Text>
      {items.map((t, i) => (
        <View key={t} style={[styles.rankRow, t === highlight && styles.rankRowHi]}>
          <Text style={styles.rankNum}>{i + 1}</Text>
          <Image source={images[tendencyInfo[t].icon]} style={styles.rankIcon} resizeMode="contain" />
          <Text style={styles.rankName}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: DARK_TEAL },
  scroll: { paddingHorizontal: 16, paddingBottom: 16 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 18, gap: 14 },
  title: { fontSize: 20, fontWeight: '700', color: DARK_TEAL, textAlign: 'center' },
  lead: { fontSize: 16, fontWeight: '700', color: DARK_TEAL, textAlign: 'center', marginTop: -8 },
  columns: { flexDirection: 'row', gap: 10 },
  column: { flex: 1, gap: 6 },
  columnLabel: {
    backgroundColor: colors.teal,
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    overflow: 'hidden',
    minHeight: 52,
    textAlignVertical: 'center',
  },
  rankRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.beige, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8 },
  rankRowHi: { backgroundColor: '#E1F4F5', borderWidth: 1.5, borderColor: colors.teal },
  rankNum: { fontSize: 14, fontWeight: '700', color: colors.teal, width: 12 },
  rankIcon: { width: 22, height: 22 },
  rankName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
  section: { gap: 8 },
  sectionLabel: { alignSelf: 'flex-start', backgroundColor: colors.teal, color: colors.white, fontSize: 14, fontWeight: '700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  tendencyLine: { fontSize: 16, lineHeight: 24, fontWeight: '700', color: '#2D9AA4', textAlign: 'center' },
  text: { fontSize: 14, lineHeight: 22, color: colors.black },
  adviceBox: { backgroundColor: colors.beige, borderRadius: 10, padding: 14, gap: 6 },
  adviceLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
