/**
 * ROLE Line Up（Figma CH2-02）と、シナリオの導入ポップアップ（CH2-S1-01 の 2枚目）。
 * 画面：#E8DECB の背景に、上のタイトル（Bold 20・#988464）→ 緑（#57CD95）の柄の面（上から 125）。
 *   緑の面の中：案内文（白・Bold 16、上から 26）→ 職種カード（320×540、上から 125）を横に並べる（間隔 27・左右 41）。
 * 職種カード：白い面（角が内側に丸く欠ける）に、上から 30 の職種名（Bold 18）と区切り線、場面の画像（260×154・上から 122）、
 *   画像の下辺にまたがる「こんな仕事があります」の札（上から 258）、仕事の一覧（上から 312・22 おき）、紫の START（230×40・上から 467）。
 *   診断まで終えた職種は、右上に「RESULT」のクリップボード（62×92）が出る。
 * ポップアップ：緑の柄の全面に、白いカード（380×642）。職種カードの START で出る。
 */
import { useState } from 'react';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { AppModal } from '@/components/AppModal';
import { PatternBackground } from '@/components/PatternBackground';
import { CloseButton, CtaButton, PressScale } from '@/components/ui';
import { chapter2, roles, type Role } from '@/content/chapter2';
import { NotePill } from '@/features/chapter2/NotePill';
import { useChapter2 } from '@/features/chapter2/Chapter2Provider';
import { useLang } from '@/i18n/LanguageProvider';
import { colors } from '@/theme/colors';
import { images } from '@/theme/images';

/** Figma の画面でのステータスバーの高さ */
const FIGMA_TOP = 59;
const GREEN = '#57CD95';
const CARD_W = 320;
const CARD_H = 540;
const CARD_GAP = 27;
/** Figma の Vector：四隅が内側に丸く欠けた白いカード（320×540 / 380×642） */
const CARD_PATH =
  'M 0 491.96 C 0 505.22 10.75 515.97 24.01 515.98 C 24.01 529.25 34.77 540 48.03 540 L 271.97 540 C 285.23 540 295.99 529.25 295.99 515.98 C 309.25 515.97 320 505.22 320 491.96 L 320 48.04 C 320 34.78 309.25 24.03 295.99 24.02 C 295.99 10.75 285.23 0 271.97 0 L 48.03 0 C 34.77 0 24.01 10.75 24.01 24.02 C 10.75 24.03 0 34.78 0 48.04 L 0 491.96 Z';
const POPUP_W = 380;
const POPUP_H = 642;
const POPUP_PATH =
  'M 0 584.94 C 0 600.69 12.77 613.45 28.51 613.46 C 28.51 629.22 41.29 641.98 57.03 641.98 L 322.96 641.98 C 338.71 641.98 351.48 629.21 351.48 613.46 C 367.23 613.45 379.99 600.68 379.99 584.94 L 379.99 57.04 C 379.99 41.29 367.22 28.53 351.48 28.52 C 351.48 12.76 338.7 0 322.96 0 L 57.04 0 C 41.29 0 28.52 12.77 28.52 28.52 C 12.77 28.53 0.01 41.3 0.01 57.04 L 0.01 584.94 Z';
/** 仕事の一覧の先頭の飾り（4つの尖った星・12×12。色は #E6D8BD） */
const SPARKLE = 'M 6 0 C 6 3.43 3.43 6 0 6 C 3.43 6 6 8.57 6 12 C 6 8.57 8.57 6 12 6 C 8.57 6 6 3.43 6 0 Z';

function Sparkle() {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12">
      <Path d={SPARKLE} fill="#E6D8BD" />
    </Svg>
  );
}

export default function RolesScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const { t, tr } = useLang();
  const { record } = useChapter2();
  const [picked, setPicked] = useState<Role | null>(null);
  const r = chapter2.roles;
  const scenario = picked?.scenarios[0];
  const popupW = Math.min(POPUP_W, screenW - 22);

  return (
    <View style={styles.screen}>
      {/* タイトル（Figma：上から 76、Bold 20・#988464）。✕ は Figma に無いが、戻る手段として左に置く */}
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <CloseButton label={t('close')} onPress={() => router.dismissTo('/')} />
        <Text style={styles.heading} pointerEvents="none">
          {r.heading}
        </Text>
      </View>
      {/* 緑の柄の面（上から 125） */}
      <PatternBackground color={GREEN} patternColor="rgba(255,255,255,0.22)" style={styles.green}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          <Text style={styles.lead}>{tr(r.lead)}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W + CARD_GAP}
            decelerationRate="fast"
            contentContainerStyle={styles.cards}
            style={styles.cardsScroll}
          >
            {roles.map((role) => {
              const done = record.completedRoles.includes(role.id);
              return (
                <View key={role.id} style={styles.card}>
                  <Svg width={CARD_W} height={CARD_H} viewBox={`0 0 ${CARD_W} ${CARD_H}`} style={StyleSheet.absoluteFill}>
                    <Path d={CARD_PATH} fill={colors.white} />
                  </Svg>
                  {/* 職種名（Bold 18・中央）と区切り線（240×12） */}
                  <View style={styles.cardTitleBox}>
                    <Text style={styles.cardTitle}>{`${role.name} \n${tr(role.tagline)}`}</Text>
                    <Image source={images.frames} style={styles.cardDivider} resizeMode="contain" />
                  </View>
                  <Image source={images.roleSceneCard} style={styles.cardScene} resizeMode="cover" />
                  <NotePill height={28} fontSize={14} lineHeight={18} style={styles.jobsPill}>
                    {tr(r.jobsLabel)}
                  </NotePill>
                  <View style={styles.jobs}>
                    {role.jobs.map((job, i) => (
                      <View key={i} style={styles.jobRow}>
                        <View style={styles.jobIcon}>
                          <Sparkle />
                        </View>
                        <Text numberOfLines={1} style={styles.jobText}>
                          {tr(job)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {/* カード全体をボタンにすると Web でボタンの入れ子になるため、START だけをボタンにする */}
                  <View style={styles.cardStart}>
                    <CtaButton testID={`role-${role.id}`} variant="primary" size="small" label={tr(r.start)} onPress={() => setPicked(role)} />
                  </View>
                  {done && (
                    <PressScale
                      testID={`role-result-${role.id}`}
                      accessibilityLabel={r.resultTag}
                      onPress={() => router.push({ pathname: '/chapter2/result', params: { role: role.id } })}
                      style={styles.resultTag}
                    >
                      <Image source={images.resultButtonIcon} style={styles.resultTagIcon} resizeMode="contain" />
                      <Text style={styles.resultTagText}>RESULT</Text>
                    </PressScale>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </ScrollView>
      </PatternBackground>

      <AppModal visible={!!picked} animationType="fade" onRequestClose={() => setPicked(null)}>
        <PatternBackground color={GREEN} patternColor="rgba(255,255,255,0.22)">
          {picked && scenario && (
            <View style={{ flex: 1, paddingTop: insets.top + 116 - FIGMA_TOP, alignItems: 'center' }}>
              {/* 白いカード（380×642）：上 36 にタイトルと区切り線、本文、場面の画像（309×300）、START（270×47） */}
              <View style={{ width: popupW, height: POPUP_H }}>
                <Svg width={popupW} height={POPUP_H} viewBox={`0 0 ${POPUP_W} ${POPUP_H}`} preserveAspectRatio="none" style={StyleSheet.absoluteFill}>
                  <Path d={POPUP_PATH} fill={colors.white} />
                </Svg>
                <View style={styles.popupHead}>
                  <Text style={styles.popupTitle}>{tr(scenario.title)}</Text>
                  <Image source={images.frames} style={styles.popupDivider} resizeMode="contain" />
                  <Text style={styles.popupText}>{tr(scenario.intro)}</Text>
                </View>
                <Image source={images.roleScenePopup} style={styles.popupScene} resizeMode="cover" />
                <View style={styles.popupStart}>
                  <CtaButton
                    testID="scenario-start"
                    variant="next"
                    label={tr(r.start)}
                    onPress={() => {
                      setPicked(null);
                      router.push({
                        pathname: '/chapter2/[role]/[scenario]/situation/[step]',
                        params: { role: picked.id, scenario: scenario.id, step: '0' },
                      });
                    }}
                  />
                </View>
                {/* 右上の閉じるボタン（41×41・白い丸） */}
                <PressScale accessibilityLabel={t('close')} onPress={() => setPicked(null)} style={styles.popupClose}>
                  <Svg width={15} height={15} viewBox="0 0 15 15">
                    <Path d="M1.5 1.5 L13.5 13.5 M13.5 1.5 L1.5 13.5" stroke="#B09D79" strokeWidth={3} strokeLinecap="round" />
                  </Svg>
                </PressScale>
              </View>
              <PressScale onPress={() => setPicked(null)} style={styles.backLink}>
                <Text style={styles.backLinkText}>{tr(r.back)}</Text>
              </PressScale>
            </View>
          )}
        </PatternBackground>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#E8DECB' },
  // 上から 73 に高さ 32 のヘッダー（✕）。緑の面は上から 125 なので、その分の余白 20 を下に
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: 21, paddingRight: 21, paddingBottom: 20, minHeight: 32 },
  heading: { position: 'absolute', left: 0, right: 0, bottom: 20, textAlign: 'center', fontSize: 20, lineHeight: 30, fontWeight: '700', letterSpacing: 1.5, color: '#988464' },
  green: { flex: 1 },
  // 案内文：緑の面の上から 26、左右 11、白・Bold 16・中央
  lead: { marginTop: 26, marginHorizontal: 11, fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.white, textAlign: 'center' },
  // 案内文（72）の下から、カードの上端まで（緑の面の上から 125）
  cardsScroll: { marginTop: 27 },
  cards: { paddingHorizontal: 41, gap: CARD_GAP },
  card: { width: CARD_W, height: CARD_H },
  cardTitleBox: { position: 'absolute', top: 30, left: 31, width: 260, alignItems: 'center' },
  cardTitle: { fontSize: 18, lineHeight: 27, fontWeight: '700', letterSpacing: 1.5, color: '#333333', textAlign: 'center' },
  cardDivider: { width: 240, height: 12, marginTop: 10 },
  cardScene: { position: 'absolute', top: 122, left: 31, width: 260, height: 154, borderRadius: 6 },
  // 札（174×28）は画像（122〜276）の下辺にまたがる（上から 258）
  jobsPill: { position: 'absolute', top: 258, left: 74, width: 174 },
  jobs: { position: 'absolute', top: 312, left: 31, width: 260, gap: 6 },
  jobRow: { height: 16, flexDirection: 'row', alignItems: 'center' },
  jobIcon: { width: 18, height: 16, justifyContent: 'center' },
  jobText: { flex: 1, fontSize: 14, lineHeight: 16, color: '#333333' },
  cardStart: { position: 'absolute', top: 467, left: 46, width: 230 },
  // 「結果を見る」のクリップボード（62×92）：カードの右上、上に 14・右に 11 はみ出す
  resultTag: { position: 'absolute', top: -14, right: -11, width: 62, height: 92, alignItems: 'center' },
  resultTagIcon: { width: 62, height: 92 },
  resultTagText: { position: 'absolute', top: 44, fontSize: 11, lineHeight: 24, fontWeight: '900', color: colors.white },
  popupHead: { position: 'absolute', top: 36, left: 35, width: 310, alignItems: 'center' },
  popupTitle: { fontSize: 20, lineHeight: 30, fontWeight: '700', letterSpacing: 1.5, color: '#333333', textAlign: 'center' },
  popupDivider: { width: 285, height: 15, marginTop: 12 },
  popupText: { fontSize: 16, lineHeight: 24, color: '#000000', textAlign: 'center', marginTop: 22 },
  popupScene: { position: 'absolute', top: 217, alignSelf: 'center', width: 309, height: 300, borderRadius: 7 },
  popupStart: { position: 'absolute', top: 549, alignSelf: 'center', width: 270 },
  popupClose: { position: 'absolute', top: -51, right: -3, width: 41, height: 41, borderRadius: 21, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  // カード（下端 758）の 20 下（Figma y=778）
  backLink: { marginTop: 20, alignSelf: 'center' },
  backLinkText: { textAlign: 'center', fontSize: 16, lineHeight: 24, fontWeight: '700', color: colors.white },
});
