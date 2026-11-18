/**
 * Performance Profile ＋ 日本のホテルで求められるスキル（Figma CH2-04 ワイヤー / CH2-05 デザイン）。
 * 行動傾向ごとの割合を横棒で表示し、1位の傾向の要約とおすすめを出す。下に4スキルの解説カード。
 */
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatternBackground, patterns } from '@/components/PatternBackground';
import { CtaButton } from '@/components/ui';
import { chapter2, findRole, TENDENCIES, tendencyInfo } from '@/content/chapter2';
import { useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { scoreRole } from '@/features/chapter2/scoring';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';

export default function Chapter2ProfileScreen() {
  const params = useLocalSearchParams<{ role: string }>();
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const { record, completeRole } = useChapter2();
  const role = findRole(params.role);
  if (!role) return <Redirect href="/chapter2/roles" />;

  const scores = scoreRole(role, record.answers[role.id]);
  const top = scores[0]!.tendency;
  const p = chapter2.profile;

  return (
    <PatternBackground {...patterns.beige} style={{ paddingTop: insets.top + 12 }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.title}>{tr(p.title)}</Text>
          {TENDENCIES.map((t) => {
            const s = scores.find((x) => x.tendency === t)!;
            return (
              <View key={t} style={styles.barRow}>
                <Text style={styles.barLabel}>
                  {tendencyInfo[t].emoji} {t}
                </Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${s.percent}%`, backgroundColor: t === top ? colors.teal : colors.goldLabel }]} />
                </View>
                <Text style={styles.barValue}>{s.percent}%</Text>
              </View>
            );
          })}
          <Text style={styles.label}>{tr(p.featureLabel)}</Text>
          <Text style={styles.text}>{tr(role.profileSummary[top])}</Text>
          <Text style={styles.label}>{tr(p.nextLabel)}</Text>
          {role.recommendations.map((r, i) => (
            <Text key={i} style={styles.text}>
              ・{tr(r)}
            </Text>
          ))}
        </View>

        <Text style={styles.skillsTitle}>{tr(p.skillsTitle)}</Text>
        {TENDENCIES.map((t) => (
          <View key={t} style={styles.skill}>
            <Text style={styles.skillHead}>
              {tendencyInfo[t].emoji} {t}
              {'\n'}
              <Text style={styles.skillSub}>{tr(tendencyInfo[t].label)}</Text>
            </Text>
            <Text style={styles.skillDesc}>{tr(tendencyInfo[t].desc)}</Text>
            <Text style={styles.skillExample}>{tr(tendencyInfo[t].example)}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 16 }]}>
        <CtaButton
          testID="c2-profile-next"
          label={tr(p.button)}
          onPress={() => {
            completeRole(role.id);
            router.push({ pathname: '/chapter2/complete', params: { role: role.id } });
          }}
        />
      </View>
    </PatternBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 18, gap: 10, borderWidth: 1, borderColor: colors.goldBorder },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 4 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 130, fontSize: 13, fontWeight: '700', color: colors.text },
  barTrack: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.beige, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { width: 40, textAlign: 'right', fontSize: 13, fontWeight: '700', color: colors.goldScore },
  label: { marginTop: 6, fontSize: 14, fontWeight: '700', color: colors.teal },
  text: { fontSize: 14, lineHeight: 22, color: colors.black },
  skillsTitle: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 8 },
  skill: { backgroundColor: colors.white, borderRadius: 12, padding: 14, gap: 6, borderWidth: 1, borderColor: colors.goldBorder },
  skillHead: { fontSize: 18, fontWeight: '700', color: colors.text },
  skillSub: { fontSize: 14, fontWeight: '700', color: colors.goldDark },
  skillDesc: { fontSize: 12, lineHeight: 18, color: colors.black },
  skillExample: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal,
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bottom: { paddingHorizontal: 21, paddingTop: 8 },
});
