/**
 * 診断結果：職種との相性（Figma CH2-04 / CH2-05）。位置は Figma の画面（402×874、上のステータスバー 59 を含む）から。
 * ターコイズ（#0095A2）の背景に、上から 52 で薄い水色（#EAF2F3）の面。
 *   タイトル「診断結果」（上から 72・Bold 20・#0095A2）と副題（Bold 16）
 *   → 左右 180 の表（上から 147）：左「{職種}で求められる力」と右「あなたの行動傾向」（右の見出しに「？」）を 1〜4位で並べる
 *   → 「{職種}でのあなたの強み」の白いカード（上から 349）：星形の台と「あなたは○○を優先する傾向があります。」、説明、
 *     ベージュの面に「これから意識したいこと」。下に NEXT（360×48）。
 * 「？」で「日本のホテルで求められるスキル」のモーダル（SkillsModal）が開く。
 */
import { useState } from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PatternBackground } from '@/components/PatternBackground';
import { CtaButton, PressScale } from '@/components/ui';
import { chapter2, fill, findRole, tendencyInfo, type Tendency } from '@/content/chapter2';
import { useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { SkillsModal, TendencyBadge } from '@/features/chapter2/SkillsModal';
import { scoreRole } from '@/features/chapter2/scoring';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';
import { layout } from '@/theme/layout';

const FIGMA_TOP = 59;
const TEAL = '#0095A2';
const HEAD = '#18A5B1';
const SOFT = '#8EC8CD';
const GRID = '#DDDDDD';

export default function Chapter2ResultScreen() {
  const params = useLocalSearchParams<{ role: string }>();
  const insets = useSafeAreaInsets();
  const { tr } = useLang();
  const { record, completeRole } = useChapter2();
  const [skillsOpen, setSkillsOpen] = useState(false);
  const role = findRole(params.role);
  if (!role) return <Redirect href="/chapter2/roles" />;

  const ranking = scoreRole(role, record.answers[role.id]);
  const top = ranking[0]!.tendency;
  const r = chapter2.result;
  const v = { role: role.name, t: top };
  const y = (figmaY: number) => insets.top + figmaY - FIGMA_TOP;

  return (
    <PatternBackground color={TEAL} patternColor="rgba(255,255,255,0.12)">
      {/* 薄い水色の面（上から 52） */}
      <PatternBackground color="#EAF2F3" patternColor="rgba(0,149,162,0.07)" style={[styles.panel, { top: y(52) }]}>
        <ScrollView
          contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + layout.ctaBottom + 48 + 24, paddingHorizontal: 21 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{tr(r.title)}</Text>
          <Text style={styles.lead}>{fill(tr(r.lead), v)}</Text>

          <View style={styles.columns}>
            <RankColumn label={fill(tr(r.requiredLabel), v)} items={role.required} />
            <RankColumn label={tr(r.yoursLabel)} items={ranking.map((x) => x.tendency)} testID="your-ranking" onHelp={() => setSkillsOpen(true)} />
          </View>

          <View style={styles.strengths}>
            <View style={[styles.head, { height: 42 }]}>
              <Text style={styles.headText}>{fill(tr(r.strengthsLabel), v)}</Text>
            </View>
            <View style={styles.strengthsBody}>
              <View style={styles.strengthsTop}>
                <TendencyBadge icon={images[tendencyInfo[top].icon]} size={60} iconSize={38} />
                <Text style={styles.tendencyLine}>{fill(tr(r.tendencyLine), v)}</Text>
              </View>
              <Text style={styles.text}>{tr(role.strengths[top])}</Text>
              <View style={styles.adviceBox}>
                <Text style={styles.adviceLabel}>{tr(r.adviceLabel)}</Text>
                <Text style={[styles.text, { marginTop: 12 }]}>{tr(role.advice)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </PatternBackground>
      <View style={[styles.bottom, { paddingBottom: insets.bottom + layout.ctaBottom }]}>
        <CtaButton
          testID="c2-result-next"
          label={tr(r.button)}
          onPress={() => {
            completeRole(role.id);
            router.push({ pathname: '/chapter2/complete', params: { role: role.id } });
          }}
        />
      </View>
      <SkillsModal visible={skillsOpen} onClose={() => setSkillsOpen(false)} />
    </PatternBackground>
  );
}

/** 順位の列（幅 180）：見出し（42・#18A5B1）と、1〜4位の行（高さ 36。順位 20 + 名前 160） */
function RankColumn({ label, items, testID, onHelp }: { label: string; items: Tendency[]; testID?: string; onHelp?: () => void }) {
  const { t } = useLang();
  return (
    <View style={styles.column} testID={testID}>
      <View style={[styles.head, styles.columnHead]}>
        <Text style={styles.headText}>{label}</Text>
        {onHelp && (
          <PressScale accessibilityLabel={t('skillsHelp')} testID="skills-help" hitSlop={10} onPress={onHelp} style={styles.help}>
            <Text style={styles.helpMark}>？</Text>
          </PressScale>
        )}
      </View>
      {items.map((k, i) => (
        <View key={k} style={styles.rankRow}>
          <View style={[styles.cell, styles.rankNum]}>
            <Text style={styles.rankNumText}>{i + 1}</Text>
          </View>
          <View style={[styles.cell, styles.rankName]}>
            <Image source={images[tendencyInfo[k].icon]} style={styles.rankIcon} resizeMode="contain" />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.rankNameText}>
              {k}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  title: { fontSize: 20, lineHeight: 30, fontWeight: '700', letterSpacing: 1.5, color: TEAL, textAlign: 'center' },
  lead: { fontSize: 16, lineHeight: 16, fontWeight: '700', color: TEAL, textAlign: 'center', marginTop: 5 },
  // 副題（下端 123）の 24 下から表（上から 147）
  columns: { flexDirection: 'row', marginTop: 24 },
  column: { width: '50%' },
  head: { backgroundColor: HEAD, borderWidth: 1, borderColor: GRID, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  columnHead: { height: 42, flexDirection: 'row', gap: 12 },
  headText: { fontSize: 14, lineHeight: 18, fontWeight: '700', color: colors.white, textAlign: 'center' },
  help: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  helpMark: { fontSize: 11, lineHeight: 13, fontWeight: '700', color: '#A1A1A1' },
  rankRow: { height: 36, flexDirection: 'row' },
  cell: { height: 36, backgroundColor: colors.white, borderWidth: 1, borderColor: GRID, justifyContent: 'center' },
  rankNum: { width: 20, alignItems: 'center' },
  rankNumText: { fontSize: 14, fontWeight: '700', color: HEAD },
  rankName: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 8, paddingRight: 6, gap: 15 },
  rankIcon: { width: 18, height: 18 },
  rankNameText: { flex: 1, fontSize: 14, fontWeight: '700', color: '#333333' },
  // 強みのカード：表（下端 333）の 16 下
  strengths: { marginTop: 16 },
  strengthsBody: { backgroundColor: colors.white, borderWidth: 1, borderColor: SOFT, paddingHorizontal: 22, paddingTop: 16, paddingBottom: 5 },
  strengthsTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  tendencyLine: { flex: 1, fontSize: 16, lineHeight: 24, fontWeight: '700', color: SOFT },
  text: { fontSize: 14, lineHeight: 20, color: '#000000', marginTop: 12 },
  // ベージュの面（350・角 4・内側の余白 20）。本文（説明）の 20 下
  adviceBox: { backgroundColor: '#F6F1E8', borderRadius: 4, padding: 20, marginTop: 20, marginHorizontal: -17 },
  adviceLabel: { fontSize: 14, lineHeight: 14, fontWeight: '700', color: '#333333' },
  bottom: { position: 'absolute', left: 21, right: 21, bottom: 0 },
});
